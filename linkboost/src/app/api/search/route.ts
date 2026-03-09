import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
const JSEARCH_HOST = "jsearch.p.rapidapi.com";

interface JSearchJob {
  job_id: string;
  job_title: string;
  employer_name: string;
  employer_logo: string | null;
  job_city: string;
  job_country: string;
  job_description: string;
  job_apply_link: string;
  job_employment_type: string;
  job_posted_at_datetime_utc: string;
  job_min_salary: number | null;
  job_max_salary: number | null;
  job_salary_currency: string | null;
  job_is_remote: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Non authentifie" }, { status: 401 });
    }

    const body = await request.json();
    const keywords = body.keywords ?? "";
    const location = body.location ?? "";
    const page = Math.max(1, parseInt(body.page ?? "1", 10));
    const remote = body.remote ?? false;
    const contractType = body.contractType ?? "";

    if (!keywords || keywords.length < 2) {
      return NextResponse.json(
        { error: "Les mots-cles doivent contenir au moins 2 caracteres." },
        { status: 400 }
      );
    }

    if (!RAPIDAPI_KEY) {
      return NextResponse.json(
        { error: "Cle API JSearch non configuree. Ajoutez RAPIDAPI_KEY dans .env.local" },
        { status: 500 }
      );
    }

    // Build query for JSearch
    let query = keywords;
    query += ` in ${location || "France"}`;
    if (contractType) {
      const typeMap: Record<string, string> = {
        stage: "internship",
        alternance: "apprenticeship",
        emploi: "",
        cdi: "fulltime",
        cdd: "contractor",
      };
      const mapped = typeMap[contractType];
      if (mapped) query += ` ${mapped}`;
    }

    const params = new URLSearchParams({
      query,
      page: String(page),
      num_pages: "1",
      date_posted: "month",
    });

    if (remote) {
      params.set("remote_jobs_only", "true");
    }

    const res = await fetch(
      `https://${JSEARCH_HOST}/search?${params.toString()}`,
      {
        headers: {
          "X-RapidAPI-Key": RAPIDAPI_KEY,
          "X-RapidAPI-Host": JSEARCH_HOST,
        },
      }
    );

    if (!res.ok) {
      const text = await res.text();
      console.error("JSearch API error:", res.status, text);
      return NextResponse.json(
        { error: "Erreur lors de la recherche d'offres" },
        { status: 502 }
      );
    }

    const data = await res.json();
    const rawJobs: JSearchJob[] = data.data ?? [];
    const totalResults = data.estimated_total ?? rawJobs.length;

    const jobs = rawJobs.map((j) => {
      let salary: string | null = null;
      if (j.job_min_salary && j.job_max_salary) {
        const cur = j.job_salary_currency || "EUR";
        salary = `${Math.round(j.job_min_salary / 1000)}k - ${Math.round(j.job_max_salary / 1000)}k ${cur}`;
      } else if (j.job_min_salary) {
        salary = `${Math.round(j.job_min_salary / 1000)}k+ ${j.job_salary_currency || "EUR"}`;
      }

      const typeMap: Record<string, string> = {
        FULLTIME: "CDI",
        PARTTIME: "Temps partiel",
        CONTRACTOR: "CDD",
        INTERN: "Stage",
        TEMPORARY: "Interim",
      };

      // Truncate description to ~200 chars
      let snippet = j.job_description || "";
      snippet = snippet.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
      if (snippet.length > 200) snippet = snippet.slice(0, 200) + "...";

      return {
        id: j.job_id,
        title: j.job_title,
        company: j.employer_name,
        logo: j.employer_logo,
        location: [j.job_city, j.job_country].filter(Boolean).join(", "),
        description: snippet,
        url: j.job_apply_link,
        type: typeMap[j.job_employment_type] || j.job_employment_type || null,
        postedAt: j.job_posted_at_datetime_utc,
        salary,
        remote: j.job_is_remote,
      };
    });

    const perPage = 10;
    const totalPages = Math.max(1, Math.ceil(totalResults / perPage));

    return NextResponse.json({
      jobs,
      total: totalResults,
      page,
      totalPages,
    });
  } catch (error) {
    console.error("Erreur recherche:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
