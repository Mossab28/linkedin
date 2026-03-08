// ---------------------------------------------------------------------------
// Sanitization des inputs avant envoi a OpenAI
// ---------------------------------------------------------------------------

const MAX_LENGTHS: Record<string, number> = {
  poste: 100,
  entreprise: 100,
  domaine: 80,
  niveau: 50,
  description_perso: 2000,
  profil_utilisateur: 2000,
  titre_offre: 200,
  description_offre: 3000,
  contexte: 1000,
  delai: 50,
  nom_interlocuteur: 100,
  points_cles: 2000,
  ton: 30,
  keywords: 200,
  location: 100,
};

const INJECTION_PATTERNS: RegExp[] = [
  /ignore\s+(all\s+)?previous\s+instructions/i,
  /ignore\s+(all\s+)?above\s+instructions/i,
  /you\s+are\s+now/i,
  /act\s+as\s+(if\s+you\s+are\s+)?a/i,
  /pretend\s+(you\s+are|to\s+be)/i,
  /system\s*:/i,
  /\bsystem\s+prompt\b/i,
  /\bignore\s+all\b/i,
  /\bforget\s+(everything|all|your)\b/i,
  /\bdo\s+not\s+follow\b/i,
  /\bdisregard\b/i,
  /\boverride\b/i,
  /\bnew\s+instructions?\b/i,
  /\brole\s*:\s*(system|assistant)\b/i,
  /```\s*(system|assistant)/i,
  /<\s*\/?system\s*>/i,
  /\[\s*INST\s*\]/i,
  /\[\s*SYS(TEM)?\s*\]/i,
];

/**
 * Supprime les caracteres de controle et les balises HTML basiques.
 */
function stripControlChars(value: string): string {
  // Supprime les caracteres de controle sauf \n et \t
  // eslint-disable-next-line no-control-regex
  return value.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "");
}

/**
 * Supprime les balises HTML/XML basiques.
 */
function stripHtmlTags(value: string): string {
  return value.replace(/<[^>]*>/g, "");
}

/**
 * Detecte et neutralise les tentatives d'injection de prompt.
 * Retourne la chaine nettoyee.
 */
function neutralizeInjection(value: string): string {
  let cleaned = value;
  for (const pattern of INJECTION_PATTERNS) {
    cleaned = cleaned.replace(pattern, "[contenu filtre]");
  }
  return cleaned;
}

/**
 * Sanitize un champ individuel.
 * - Trim les espaces
 * - Supprime les caracteres de controle
 * - Supprime les balises HTML
 * - Neutralise les injections de prompt
 * - Tronque a la longueur maximale autorisee
 */
export function sanitizeField(field: string, value: string): string {
  if (typeof value !== "string") {
    return String(value ?? "");
  }

  let cleaned = value.trim();
  cleaned = stripControlChars(cleaned);
  cleaned = stripHtmlTags(cleaned);
  cleaned = neutralizeInjection(cleaned);

  // Normalise les espaces multiples
  cleaned = cleaned.replace(/\s{3,}/g, "  ");

  // Tronque si necessaire
  const maxLength = MAX_LENGTHS[field] ?? 500;
  if (cleaned.length > maxLength) {
    cleaned = cleaned.substring(0, maxLength).trimEnd();
  }

  return cleaned;
}

/**
 * Sanitize tous les champs string d'un objet (premier niveau).
 * Les tableaux de strings sont aussi sanitizes.
 */
export function sanitizeObject<T extends Record<string, unknown>>(
  input: T
): T {
  const sanitized: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(input)) {
    if (typeof value === "string") {
      sanitized[key] = sanitizeField(key, value);
    } else if (
      Array.isArray(value) &&
      value.every((item) => typeof item === "string")
    ) {
      sanitized[key] = (value as string[]).map((item) =>
        sanitizeField(key, item)
      );
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized as T;
}
