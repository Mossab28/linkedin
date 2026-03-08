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

    const { data: preferences, error: fetchError } = await supabase
      .from("user_preferences")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (fetchError) {
      if (fetchError.code === "PGRST116") {
        const { data: newPrefs, error: insertError } = await supabase
          .from("user_preferences")
          .insert({ user_id: user.id })
          .select()
          .single();

        if (insertError) {
          return NextResponse.json(
            { error: "Erreur lors de la creation des preferences", details: insertError.message },
            { status: 500 }
          );
        }

        return NextResponse.json({ preferences: newPrefs }, { status: 200 });
      }

      return NextResponse.json(
        { error: "Erreur lors de la recuperation des preferences", details: fetchError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ preferences }, { status: 200 });
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
      "preferred_tone",
      "preferred_language",
      "message_length",
      "auto_save_searches",
      "email_notifications",
      "weekly_report",
      "theme",
      "messages_daily_limit",
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

    const { data: preferences, error: updateError } = await supabase
      .from("user_preferences")
      .update(updateData)
      .eq("user_id", user.id)
      .select()
      .single();

    if (updateError) {
      if (updateError.code === "PGRST116") {
        return NextResponse.json(
          { error: "Preferences non trouvees. Faites d'abord un GET pour les initialiser." },
          { status: 404 }
        );
      }

      return NextResponse.json(
        { error: "Erreur lors de la mise a jour des preferences", details: updateError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ preferences }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
