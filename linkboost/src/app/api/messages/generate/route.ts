import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { checkAIGenerationLimit } from "@/lib/rate-limit";
import {
  genererCandidature,
  genererReponseOffre,
  genererRelance,
  genererRemerciement,
} from "@/lib/ai/ai-service";

/**
 * Adapter route: accepts the frontend's format and maps to the ai-service.
 * Frontend sends: { company, position, contactName?, context?, messageType, tone }
 */
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

    const rateLimitResult = checkAIGenerationLimit(user.id);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: "Trop de requetes. Reessayez plus tard." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { company, position, contactName, context, messageType, tone } = body;

    if (!company || !position) {
      return NextResponse.json(
        { error: "Entreprise et poste requis" },
        { status: 400 }
      );
    }

    // Map tone to French
    const toneMapped = tone || "professionnel";

    // Fetch user profile for context
    const { data: profile } = await supabase
      .from("users")
      .select("full_name, skills, bio, current_title, experience_level")
      .eq("id", user.id)
      .single();

    const descriptionPerso = profile?.bio || `${profile?.current_title || "Candidat"} avec experience en ${(profile?.skills || []).join(", ") || "divers domaines"}`;

    let result: { content: string; usage: { prompt_tokens: number; completion_tokens: number; total_tokens: number } };

    // Map messageType to the correct ai-service function
    switch (messageType) {
      case "candidature_spontanee":
      case "candidature":
        result = await genererCandidature({
          poste: position,
          entreprise: company,
          domaine: profile?.current_title || position,
          niveau: profile?.experience_level || "junior",
          description_perso: descriptionPerso,
          ton: toneMapped,
          competences: profile?.skills || [],
        });
        break;

      case "reponse_offre":
        result = await genererReponseOffre({
          titre_offre: position,
          description_offre: context || `Offre pour le poste de ${position} chez ${company}`,
          entreprise: company,
          profil_utilisateur: descriptionPerso,
          ton: toneMapped,
        });
        break;

      case "relance":
        result = await genererRelance({
          contexte: context || `Candidature pour ${position} chez ${company}`,
          poste: position,
          entreprise: company,
          ton: toneMapped,
          delai: "1 semaine",
        });
        break;

      case "remerciement":
        result = await genererRemerciement({
          poste: position,
          entreprise: company,
          nom_interlocuteur: contactName || "le recruteur",
          points_cles: context || `Echange sur le poste de ${position}`,
          ton: toneMapped,
        });
        break;

      default:
        return NextResponse.json(
          { error: "Type de message non supporte" },
          { status: 400 }
        );
    }

    return NextResponse.json(
      {
        content: result.content,
        message: result.content,
        tokensUsed: result.usage.total_tokens,
        quotaRemaining: 20,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur generation message:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
