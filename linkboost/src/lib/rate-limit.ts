// ---------------------------------------------------------------------------
// Rate limiting simple en memoire (MVP)
// Pour la production, migrer vers Upstash ou Redis.
// ---------------------------------------------------------------------------

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

// Nettoyage periodique des entrees expirees (toutes les 5 minutes)
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000;

let cleanupTimer: ReturnType<typeof setInterval> | null = null;

function startCleanup(): void {
  if (cleanupTimer !== null) return;
  cleanupTimer = setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of rateLimitMap.entries()) {
      if (now >= entry.resetAt) {
        rateLimitMap.delete(key);
      }
    }
  }, CLEANUP_INTERVAL_MS);

  // Ne pas bloquer le process Node en cas de shutdown
  if (typeof cleanupTimer === "object" && "unref" in cleanupTimer) {
    cleanupTimer.unref();
  }
}

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetAt: number;
}

/**
 * Verifie et incremente le compteur de rate limiting pour une cle donnee.
 *
 * @param key - Identifiant unique (ex: userId, ip, userId:action)
 * @param limit - Nombre maximal de requetes autorisees dans la fenetre
 * @param windowMs - Duree de la fenetre en millisecondes
 * @returns success (true si autorise), remaining (requetes restantes), resetAt (timestamp de reset)
 */
export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number
): RateLimitResult {
  startCleanup();

  const now = Date.now();
  const existing = rateLimitMap.get(key);

  // Si pas d'entree ou fenetre expiree, creer une nouvelle entree
  if (!existing || now >= existing.resetAt) {
    const entry: RateLimitEntry = {
      count: 1,
      resetAt: now + windowMs,
    };
    rateLimitMap.set(key, entry);
    return {
      success: true,
      remaining: limit - 1,
      resetAt: entry.resetAt,
    };
  }

  // Verifier si la limite est atteinte
  if (existing.count >= limit) {
    return {
      success: false,
      remaining: 0,
      resetAt: existing.resetAt,
    };
  }

  // Incrementer le compteur
  existing.count += 1;
  return {
    success: true,
    remaining: limit - existing.count,
    resetAt: existing.resetAt,
  };
}

// ---------------------------------------------------------------------------
// Presets de rate limiting pour differentes actions
// ---------------------------------------------------------------------------

const RATE_LIMITS = {
  /** Generation de message IA : 10 par minute par utilisateur */
  AI_GENERATION: { limit: 10, windowMs: 60 * 1000 },
  /** Recherche LinkedIn : 20 par minute par utilisateur */
  SEARCH: { limit: 20, windowMs: 60 * 1000 },
  /** Actions generales API : 60 par minute par utilisateur */
  API_GENERAL: { limit: 60, windowMs: 60 * 1000 },
} as const;

export function checkAIGenerationLimit(userId: string): RateLimitResult {
  return checkRateLimit(
    `ai:${userId}`,
    RATE_LIMITS.AI_GENERATION.limit,
    RATE_LIMITS.AI_GENERATION.windowMs
  );
}

export function checkSearchLimit(userId: string): RateLimitResult {
  return checkRateLimit(
    `search:${userId}`,
    RATE_LIMITS.SEARCH.limit,
    RATE_LIMITS.SEARCH.windowMs
  );
}

export function checkAPILimit(userId: string): RateLimitResult {
  return checkRateLimit(
    `api:${userId}`,
    RATE_LIMITS.API_GENERAL.limit,
    RATE_LIMITS.API_GENERAL.windowMs
  );
}
