import { generateMessage, AIGenerationError } from "./openai";
import type { MessageType } from "./openai";
import {
  buildFullSystemPrompt,
  buildCandidaturePrompt,
  buildReponseOffrePrompt,
  buildRelancePrompt,
  buildRemerciementPrompt,
} from "./prompts";
import type {
  CandidatureInput,
  ReponseOffreInput,
  RelanceInput,
  RemerciementInput,
} from "./prompts";
import { sanitizeObject } from "../sanitize";

// ---------------------------------------------------------------------------
// Validation de l'output genere
// ---------------------------------------------------------------------------

const OUTPUT_LIMITS: Record<MessageType, { min: number; max: number }> = {
  candidature: { min: 80, max: 500 },
  reponse_offre: { min: 100, max: 600 },
  relance: { min: 50, max: 400 },
  remerciement: { min: 80, max: 500 },
};

const FORMULES_BATEAU = [
  "je me permets de vous contacter",
  "je me permets de vous ecrire",
  "n'hesitez pas a",
  "je serais ravi",
  "je serais ravie",
  "dans l'attente de votre retour",
  "je reste a votre disposition",
  "votre offre a retenu toute mon attention",
  "je me permets de vous relancer",
  "sans reponse de votre part",
  "je reviens vers vous",
  "je tenais a vous remercier",
  "ce fut un plaisir",
  "cordialement",
  "bien a vous",
];

interface ValidationResult {
  valid: boolean;
  reason?: string;
}

function validateOutput(
  content: string,
  type: MessageType
): ValidationResult {
  const limits = OUTPUT_LIMITS[type];

  if (content.length < limits.min) {
    return {
      valid: false,
      reason: `Message trop court (${content.length} caracteres, minimum ${limits.min}).`,
    };
  }

  if (content.length > limits.max) {
    return {
      valid: false,
      reason: `Message trop long (${content.length} caracteres, maximum ${limits.max}).`,
    };
  }

  const contentLower = content.toLowerCase();
  for (const formule of FORMULES_BATEAU) {
    if (contentLower.includes(formule)) {
      return {
        valid: false,
        reason: `Le message contient une formule bateau : "${formule}".`,
      };
    }
  }

  return { valid: true };
}

// ---------------------------------------------------------------------------
// Generation avec retry
// ---------------------------------------------------------------------------

interface GenerationResult {
  content: string;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

async function generateWithRetry(
  type: MessageType,
  systemPrompt: string,
  userPrompt: string
): Promise<GenerationResult> {
  const firstAttempt = await generateMessage(type, systemPrompt, userPrompt);
  const firstValidation = validateOutput(firstAttempt.content, type);

  if (firstValidation.valid) {
    return firstAttempt;
  }

  const enhancedUserPrompt = `${userPrompt}

ATTENTION SUPPLEMENTAIRE : Le message precedemment genere a ete rejete pour la raison suivante : ${firstValidation.reason}
Corrige ce probleme dans ta nouvelle version. Assure-toi de respecter TOUTES les regles.`;

  const secondAttempt = await generateMessage(
    type,
    systemPrompt,
    enhancedUserPrompt
  );
  const secondValidation = validateOutput(secondAttempt.content, type);

  if (secondValidation.valid) {
    return {
      content: secondAttempt.content,
      usage: {
        prompt_tokens:
          firstAttempt.usage.prompt_tokens + secondAttempt.usage.prompt_tokens,
        completion_tokens:
          firstAttempt.usage.completion_tokens +
          secondAttempt.usage.completion_tokens,
        total_tokens:
          firstAttempt.usage.total_tokens + secondAttempt.usage.total_tokens,
      },
    };
  }

  // Retourner le second essai meme s'il ne passe pas la validation
  // plutot que de bloquer l'utilisateur
  return {
    content: secondAttempt.content,
    usage: {
      prompt_tokens:
        firstAttempt.usage.prompt_tokens + secondAttempt.usage.prompt_tokens,
      completion_tokens:
        firstAttempt.usage.completion_tokens +
        secondAttempt.usage.completion_tokens,
      total_tokens:
        firstAttempt.usage.total_tokens + secondAttempt.usage.total_tokens,
    },
  };
}

// ---------------------------------------------------------------------------
// API publique
// ---------------------------------------------------------------------------

export async function genererCandidature(
  input: CandidatureInput
): Promise<GenerationResult> {
  const sanitized = sanitizeObject(input) as CandidatureInput;
  const systemPrompt = buildFullSystemPrompt("candidature", sanitized.ton);
  const userPrompt = buildCandidaturePrompt(sanitized);
  return generateWithRetry("candidature", systemPrompt, userPrompt);
}

export async function genererReponseOffre(
  input: ReponseOffreInput
): Promise<GenerationResult> {
  const sanitized = sanitizeObject(input) as ReponseOffreInput;
  const systemPrompt = buildFullSystemPrompt("reponse_offre", sanitized.ton);
  const userPrompt = buildReponseOffrePrompt(sanitized);
  return generateWithRetry("reponse_offre", systemPrompt, userPrompt);
}

export async function genererRelance(
  input: RelanceInput
): Promise<GenerationResult> {
  const sanitized = sanitizeObject(input) as RelanceInput;
  const systemPrompt = buildFullSystemPrompt("relance", sanitized.ton);
  const userPrompt = buildRelancePrompt(sanitized);
  return generateWithRetry("relance", systemPrompt, userPrompt);
}

export async function genererRemerciement(
  input: RemerciementInput
): Promise<GenerationResult> {
  const sanitized = sanitizeObject(input) as RemerciementInput;
  const systemPrompt = buildFullSystemPrompt("remerciement", sanitized.ton);
  const userPrompt = buildRemerciementPrompt(sanitized);
  return generateWithRetry("remerciement", systemPrompt, userPrompt);
}
