import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
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

    const allowedFields: Record<string, unknown> = {};
    if (typeof body.is_favorite === "boolean") {
      allowedFields.is_favorite = body.is_favorite;
    }
    if (typeof body.user_rating === "number" && body.user_rating >= 1 && body.user_rating <= 5) {
      allowedFields.user_rating = body.user_rating;
    }
    if (typeof body.was_used === "boolean") {
      allowedFields.was_used = body.was_used;
    }

    if (Object.keys(allowedFields).length === 0) {
      return NextResponse.json(
        { error: "Aucun champ valide a mettre a jour" },
        { status: 400 }
      );
    }

    allowedFields.updated_at = new Date().toISOString();

    const { data: message, error: updateError } = await supabase
      .from("generated_messages")
      .update(allowedFields)
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json(
        { error: "Erreur lors de la mise a jour du message", details: updateError.message },
        { status: 500 }
      );
    }

    if (!message) {
      return NextResponse.json(
        { error: "Message non trouve" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
