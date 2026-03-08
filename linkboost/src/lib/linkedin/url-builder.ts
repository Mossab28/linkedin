// ---------------------------------------------------------------------------
// Construction d'URLs de recherche LinkedIn et Google Dorks
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Mappings LinkedIn
// ---------------------------------------------------------------------------

export const DATE_POSTED_MAP: Record<string, string> = {
  "24h": "r86400",
  "semaine": "r604800",
  "mois": "r2592000",
};

export const JOB_TYPE_MAP: Record<string, string> = {
  "temps_plein": "F",
  "temps_partiel": "P",
  "contrat": "C",
  "stage": "I",
  "interim": "T",
  "freelance": "O",
};

export const EXPERIENCE_MAP: Record<string, string> = {
  "debutant": "1",
  "junior": "2",
  "intermediaire": "3",
  "senior": "4",
  "directeur": "5",
  "executif": "6",
};

export const REMOTE_MAP: Record<string, string> = {
  "presentiel": "1",
  "distant": "2",
  "hybride": "3",
};

// ---------------------------------------------------------------------------
// Interface des parametres de recherche
// ---------------------------------------------------------------------------

export interface SearchParams {
  keywords: string;
  location?: string;
  job_type?: string;
  experience_level?: string;
  date_posted?: string;
  remote_filter?: string;
}

// ---------------------------------------------------------------------------
// Builders d'URLs
// ---------------------------------------------------------------------------

export function buildLinkedInJobsUrl(params: SearchParams): string {
  const base = "https://www.linkedin.com/jobs/search/";
  const queryParts: string[] = [];

  queryParts.push(`keywords=${encodeURIComponent(params.keywords)}`);

  if (params.location) {
    queryParts.push(`location=${encodeURIComponent(params.location)}`);
  }

  if (params.job_type && JOB_TYPE_MAP[params.job_type]) {
    queryParts.push(`f_JT=${JOB_TYPE_MAP[params.job_type]}`);
  }

  if (params.experience_level && EXPERIENCE_MAP[params.experience_level]) {
    queryParts.push(`f_E=${EXPERIENCE_MAP[params.experience_level]}`);
  }

  if (params.date_posted && DATE_POSTED_MAP[params.date_posted]) {
    queryParts.push(`f_TPR=${DATE_POSTED_MAP[params.date_posted]}`);
  }

  if (params.remote_filter && REMOTE_MAP[params.remote_filter]) {
    queryParts.push(`f_WT=${REMOTE_MAP[params.remote_filter]}`);
  }

  return `${base}?${queryParts.join("&")}`;
}

export function buildLinkedInPeopleUrl(params: SearchParams): string {
  const base = "https://www.linkedin.com/search/results/people/";
  const queryParts: string[] = [];

  queryParts.push(`keywords=${encodeURIComponent(params.keywords)}`);

  if (params.location) {
    queryParts.push(
      `geoUrn=${encodeURIComponent(`["${params.location}"]`)}`
    );
  }

  return `${base}?${queryParts.join("&")}`;
}

export function buildGoogleDorkUrl(params: SearchParams): string {
  const parts: string[] = ["site:linkedin.com/in/"];

  parts.push(`"${params.keywords}"`);

  if (params.location) {
    parts.push(`"${params.location}"`);
  }

  const query = parts.join(" ");
  return `https://www.google.com/search?q=${encodeURIComponent(query)}`;
}

// ---------------------------------------------------------------------------
// Generation de variantes de mots-cles
// ---------------------------------------------------------------------------

const KEYWORD_SYNONYMS: Record<string, string[]> = {
  "developpeur": ["developer", "ingenieur logiciel", "software engineer", "dev"],
  "developer": ["developpeur", "ingenieur logiciel", "software engineer", "dev"],
  "frontend": ["front-end", "front end", "react", "vue.js"],
  "backend": ["back-end", "back end", "api", "server-side"],
  "fullstack": ["full-stack", "full stack", "developpeur web"],
  "data scientist": ["data analyst", "machine learning engineer", "ML engineer"],
  "devops": ["SRE", "site reliability engineer", "cloud engineer"],
  "product manager": ["chef de produit", "product owner", "PO"],
  "designer": ["UX designer", "UI designer", "UX/UI designer"],
  "marketing": ["growth", "acquisition", "digital marketing"],
  "commercial": ["sales", "business developer", "account executive"],
  "chef de projet": ["project manager", "scrum master", "coordinateur"],
  "consultant": ["conseiller", "expert", "architecte"],
  "comptable": ["accountant", "auditeur", "gestionnaire financier"],
  "rh": ["ressources humaines", "human resources", "talent acquisition", "recruteur"],
};

function generateKeywordVariants(keywords: string): string[] {
  const variants: string[] = [keywords];
  const keywordsLower = keywords.toLowerCase();

  for (const [key, synonyms] of Object.entries(KEYWORD_SYNONYMS)) {
    if (keywordsLower.includes(key)) {
      for (const synonym of synonyms) {
        const variant = keywordsLower.replace(key, synonym);
        if (!variants.includes(variant)) {
          variants.push(variant);
        }
        if (variants.length >= 5) break;
      }
    }
    if (variants.length >= 5) break;
  }

  // Si pas assez de variantes, ajouter des variantes avec contexte
  if (variants.length < 3) {
    variants.push(`${keywords} recrutement`);
    variants.push(`${keywords} hiring`);
  }

  return variants.slice(0, 5);
}

// ---------------------------------------------------------------------------
// Generateur de liens multiples
// ---------------------------------------------------------------------------

interface SearchLinks {
  jobLinks: Array<{ label: string; url: string }>;
  peopleLinks: Array<{ label: string; url: string }>;
  googleLinks: Array<{ label: string; url: string }>;
}

export function generateSearchLinks(params: SearchParams): SearchLinks {
  const variants = generateKeywordVariants(params.keywords);

  const jobLinks = variants.map((variant, index) => ({
    label:
      index === 0
        ? `Offres : ${variant}`
        : `Variante ${index} : ${variant}`,
    url: buildLinkedInJobsUrl({ ...params, keywords: variant }),
  }));

  const peopleLinks = variants.slice(0, 3).map((variant, index) => ({
    label:
      index === 0
        ? `Profils : ${variant}`
        : `Variante ${index} : ${variant}`,
    url: buildLinkedInPeopleUrl({ ...params, keywords: variant }),
  }));

  const googleLinks = variants.slice(0, 3).map((variant, index) => ({
    label:
      index === 0
        ? `Google : ${variant}`
        : `Variante ${index} : ${variant}`,
    url: buildGoogleDorkUrl({ ...params, keywords: variant }),
  }));

  return { jobLinks, peopleLinks, googleLinks };
}
