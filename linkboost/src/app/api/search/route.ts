import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { generateSearchLinks } from "@/lib/linkedin/url-builder";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Non authentifie" },
        { status: 401 }
      );
    }

    const body = await request.json();

    // The frontend sends: { keywords, location, contractType, level, datePosted, remote }
    // Map to SearchParams expected by generateSearchLinks
    const keywords = body.keywords ?? "";
    if (!keywords || keywords.length < 2) {
      return NextResponse.json(
        { error: "Les mots-cles doivent contenir au moins 2 caracteres." },
        { status: 400 }
      );
    }

    const links = generateSearchLinks({
      keywords,
      location: body.location || undefined,
      job_type: body.contractType || body.job_type || undefined,
      experience_level: body.level || body.experience_level || undefined,
      date_posted: body.datePosted || body.date_posted || undefined,
      remote_filter: body.remote ? "distant" : (body.remote_filter || undefined),
    });

    // Transform { jobLinks, peopleLinks, googleLinks } into the format
    // the search page expects: { offers, contacts }
    // Each item: { id, label, url }
    let idCounter = 0;
    const offers = links.jobLinks.map((link) => ({
      id: String(++idCounter),
      label: link.label,
      url: link.url,
    }));

    const contacts = [
      ...links.peopleLinks.map((link) => ({
        id: String(++idCounter),
        label: link.label,
        url: link.url,
      })),
      ...links.googleLinks.map((link) => ({
        id: String(++idCounter),
        label: link.label,
        url: link.url,
      })),
    ];

    return NextResponse.json({ offers, contacts }, { status: 200 });
  } catch (error) {
    console.error("Erreur recherche:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
