import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createApplicationSchema } from "@/lib/validations/schemas";

export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") ?? "20", 10)));
    const sort = searchParams.get("sort") ?? "created_at";
    const order = searchParams.get("order") === "asc" ? true : false;

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
      .from("applications")
      .select("*", { count: "exact" })
      .eq("user_id", user.id);

    if (status) {
      query = query.eq("status", status);
    }

    query = query.order(sort, { ascending: order }).range(from, to);

    const { data: applications, error: fetchError, count } = await query;

    if (fetchError) {
      return NextResponse.json(
        { error: "Erreur lors de la recuperation des candidatures", details: fetchError.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        applications: applications ?? [],
        total: count ?? 0,
        page,
        pageSize: limit,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}

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
    const parsed = createApplicationSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Donnees invalides", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // Map French Zod fields to English DB columns
    const statusMap: Record<string, string> = {
      brouillon: "draft",
      envoyee: "sent",
      vue: "pending",
      entretien: "interview",
      relancee: "follow_up",
      acceptee: "accepted",
      refusee: "rejected",
      archivee: "withdrawn",
    };

    const { data: application, error: insertError } = await supabase
      .from("applications")
      .insert({
        user_id: user.id,
        job_title: data.poste,
        company_name: data.entreprise,
        job_url: data.url_offre ?? null,
        status: statusMap[data.statut] ?? "draft",
        notes: data.notes ?? null,
        cover_letter: data.message_envoye ?? null,
        contact_name: data.contact_nom ?? null,
        applied_at: data.date_candidature ?? null,
        last_follow_up_at: data.date_relance ?? null,
      })
      .select()
      .single();

    if (insertError) {
      return NextResponse.json(
        { error: "Erreur lors de la creation de la candidature", details: insertError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ application }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
