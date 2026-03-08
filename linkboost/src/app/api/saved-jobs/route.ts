import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createSavedJobSchema } from "@/lib/validations/schemas";

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

    const { data: jobs, error: fetchError } = await supabase
      .from("saved_jobs")
      .select("*")
      .eq("user_id", user.id)
      .eq("is_archived", false)
      .order("created_at", { ascending: false });

    if (fetchError) {
      return NextResponse.json(
        { error: "Erreur lors de la recuperation des offres", details: fetchError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ jobs: jobs ?? [] }, { status: 200 });
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
    const parsed = createSavedJobSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Donnees invalides", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { data: job, error: insertError } = await supabase
      .from("saved_jobs")
      .insert({
        user_id: user.id,
        ...parsed.data,
      })
      .select()
      .single();

    if (insertError) {
      return NextResponse.json(
        { error: "Erreur lors de la sauvegarde de l'offre", details: insertError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ job }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
