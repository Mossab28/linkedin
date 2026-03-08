import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

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

    const { data: profile, error: fetchError } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single();

    if (fetchError) {
      return NextResponse.json(
        { error: "Erreur lors de la recuperation du profil", details: fetchError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ user: profile }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
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

    const allowedFields = [
      "full_name",
      "current_title",
      "experience_level",
      "education",
      "skills",
      "city",
      "remote_preference",
      "bio",
      "linkedin_url",
      "avatar_url",
    ];

    const updateData: Record<string, unknown> = {};
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "Aucun champ valide a mettre a jour" },
        { status: 400 }
      );
    }

    updateData.updated_at = new Date().toISOString();

    const { data: profile, error: updateError } = await supabase
      .from("users")
      .update(updateData)
      .eq("id", user.id)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json(
        { error: "Erreur lors de la mise a jour du profil", details: updateError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ user: profile }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
