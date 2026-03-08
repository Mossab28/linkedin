import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { generateMessageSchema } from "@/lib/validations/schemas";
import { checkAIGenerationLimit } from "@/lib/rate-limit";
import {
  genererCandidature,
  genererReponseOffre,
  genererRelance,
  genererRemerciement,
} from "@/lib/ai/ai-service";

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
        {
          error: "Trop de requetes. Reessayez plus tard.",
          retryAfter: rateLimitResult.resetAt,
        },
        { status: 429 }
      );
    }

    const body = await request.json();
    const parsed = generateMessageSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Donnees invalides", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;

    let result: { content: string; usage: { prompt_tokens: number; completion_tokens: number; total_tokens: number } };

    switch (data.type) {
      case "candidature":
        result = await genererCandidature({
          poste: data.poste,
          entreprise: data.entreprise,
          domaine: data.domaine,
          niveau: data.niveau,
          description_perso: data.description_perso,
          ton: data.ton,
          competences: data.competences,
        });
        break;
      case "reponse_offre":
        result = await genererReponseOffre({
          titre_offre: data.titre_offre,
          description_offre: data.description_offre,
          entreprise: data.entreprise,
          profil_utilisateur: data.profil_utilisateur,
          ton: data.ton,
        });
        break;
      case "relance":
        result = await genererRelance({
          contexte: data.contexte,
          poste: data.poste,
          entreprise: data.entreprise,
          ton: data.ton,
          delai: data.delai,
        });
        break;
      case "remerciement":
        result = await genererRemerciement({
          poste: data.poste,
          entreprise: data.entreprise,
          nom_interlocuteur: data.nom_interlocuteur,
          points_cles: data.points_cles,
          ton: data.ton,
        });
        break;
      default:
        return NextResponse.json(
          { error: "Type de message non supporte" },
          { status: 400 }
        );
    }

    // Map French values to English DB ENUMs
    const messageTypeMap: Record<string, string> = {
      candidature: "cold_outreach",
      reponse_offre: "job_response",
      relance: "follow_up",
      remerciement: "thank_you",
    };
    const toneMap: Record<string, string> = {
      professionnel: "professional",
      decontracte: "casual",
      enthousiaste: "enthusiastic",
      direct: "concise",
    };

    const { error: saveError } = await supabase
      .from("generated_messages")
      .insert({
        user_id: user.id,
        message_type: messageTypeMap[data.type] ?? "cold_outreach",
        generated_content: result.content,
        company_name: data.entreprise,
        tone: toneMap[data.ton] ?? "professional",
        job_title: "poste" in data ? data.poste : null,
        prompt_tokens: result.usage.prompt_tokens,
        completion_tokens: result.usage.completion_tokens,
        ai_model: "claude-haiku-4-5",
      });

    if (saveError) {
      console.error("Erreur sauvegarde message:", saveError.message);
    }

    return NextResponse.json(
      {
        message: result.content,
        usage: result.usage,
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
