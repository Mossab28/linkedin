import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { onboardingWizardSchema } from "@/lib/validations/schemas";

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
    const parsed = onboardingWizardSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Donnees invalides", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // Map experience level for the DB ENUM: 'stage','alternance','junior','intermediaire','senior'
    const levelMap: Record<string, string> = {
      etudiant: "stage",
      junior: "junior",
      confirme: "intermediaire",
      senior: "senior",
    };

    const { error: updateError } = await supabase
      .from("users")
      .update({
        current_title: data.searchType,
        skills: data.domains,
        experience_level: levelMap[data.level] ?? data.level,
        city: data.location === "city" ? data.locationCity : null,
        bio: data.bio || null,
        onboarding_completed: true,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (updateError) {
      return NextResponse.json(
        { error: "Erreur lors de la mise a jour du profil", details: updateError.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, redirectTo: "/search" },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
