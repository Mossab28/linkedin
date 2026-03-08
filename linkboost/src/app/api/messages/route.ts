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

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const favorites = searchParams.get("favorites");
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") ?? "20", 10)));

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
      .from("generated_messages")
      .select("*", { count: "exact" })
      .eq("user_id", user.id);

    if (type) {
      query = query.eq("type", type);
    }

    if (favorites === "true") {
      query = query.eq("is_favorite", true);
    }

    query = query.order("created_at", { ascending: false }).range(from, to);

    const { data: messages, error: fetchError, count } = await query;

    if (fetchError) {
      return NextResponse.json(
        { error: "Erreur lors de la recuperation des messages", details: fetchError.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        messages: messages ?? [],
        total: count ?? 0,
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
