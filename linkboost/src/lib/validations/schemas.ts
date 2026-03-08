import { z } from "zod";

// ---------------------------------------------------------------------------
// Schemas Zod pour TOUTES les validations LinkBoost
// Messages d'erreur en francais
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Enums reutilisables
// ---------------------------------------------------------------------------

const toneEnum = z.enum(
  ["professionnel", "decontracte", "enthousiaste", "direct"],
  {
    errorMap: () => ({
      message:
        "Le ton doit etre : professionnel, decontracte, enthousiaste ou direct.",
    }),
  }
);

const messageTypeEnum = z.enum(
  ["candidature", "reponse_offre", "relance", "remerciement"],
  {
    errorMap: () => ({
      message:
        "Le type de message doit etre : candidature, reponse_offre, relance ou remerciement.",
    }),
  }
);

const experienceLevelEnum = z.enum(
  ["debutant", "junior", "intermediaire", "senior", "directeur", "executif"],
  {
    errorMap: () => ({
      message:
        "Le niveau d'experience doit etre : debutant, junior, intermediaire, senior, directeur ou executif.",
    }),
  }
);

const jobTypeEnum = z.enum(
  ["temps_plein", "temps_partiel", "contrat", "stage", "interim", "freelance"],
  {
    errorMap: () => ({
      message:
        "Le type de contrat doit etre : temps_plein, temps_partiel, contrat, stage, interim ou freelance.",
    }),
  }
);

const datePostedEnum = z.enum(["24h", "semaine", "mois"], {
  errorMap: () => ({
    message: "La date de publication doit etre : 24h, semaine ou mois.",
  }),
});

const remoteFilterEnum = z.enum(["presentiel", "distant", "hybride"], {
  errorMap: () => ({
    message: "Le mode de travail doit etre : presentiel, distant ou hybride.",
  }),
});

const applicationStatusEnum = z.enum(
  [
    "brouillon",
    "envoyee",
    "vue",
    "entretien",
    "relancee",
    "acceptee",
    "refusee",
    "archivee",
  ],
  {
    errorMap: () => ({
      message:
        "Le statut doit etre : brouillon, envoyee, vue, entretien, relancee, acceptee, refusee ou archivee.",
    }),
  }
);

// ---------------------------------------------------------------------------
// Schema d'onboarding (profil utilisateur)
// ---------------------------------------------------------------------------

export const onboardingSchema = z.object({
  nom: z
    .string({ required_error: "Le nom est requis." })
    .min(1, "Le nom est requis.")
    .max(100, "Le nom ne doit pas depasser 100 caracteres."),

  prenom: z
    .string({ required_error: "Le prenom est requis." })
    .min(1, "Le prenom est requis.")
    .max(100, "Le prenom ne doit pas depasser 100 caracteres."),

  email: z
    .string({ required_error: "L'email est requis." })
    .email("L'adresse email n'est pas valide."),

  poste_recherche: z
    .string({ required_error: "Le poste recherche est requis." })
    .min(2, "Le poste recherche doit contenir au moins 2 caracteres.")
    .max(100, "Le poste recherche ne doit pas depasser 100 caracteres."),

  domaine: z
    .string({ required_error: "Le domaine est requis." })
    .min(2, "Le domaine doit contenir au moins 2 caracteres.")
    .max(80, "Le domaine ne doit pas depasser 80 caracteres."),

  niveau_experience: experienceLevelEnum,

  localisation: z
    .string()
    .max(100, "La localisation ne doit pas depasser 100 caracteres.")
    .optional(),

  description: z
    .string({ required_error: "La description est requise." })
    .min(20, "La description doit contenir au moins 20 caracteres.")
    .max(2000, "La description ne doit pas depasser 2000 caracteres."),

  competences: z
    .array(
      z
        .string()
        .min(1, "La competence ne peut pas etre vide.")
        .max(50, "La competence ne doit pas depasser 50 caracteres.")
    )
    .min(1, "Ajoutez au moins une competence.")
    .max(20, "Maximum 20 competences."),

  linkedin_url: z
    .string()
    .url("L'URL LinkedIn n'est pas valide.")
    .regex(
      /linkedin\.com/,
      "L'URL doit etre une URL LinkedIn valide."
    )
    .optional(),

  ton_prefere: toneEnum.default("professionnel"),
});

export type OnboardingInput = z.infer<typeof onboardingSchema>;

// ---------------------------------------------------------------------------
// Schema d'onboarding front-end (5 etapes du wizard)
// ---------------------------------------------------------------------------

export const onboardingWizardSchema = z.object({
  searchType: z.enum(["stage", "alternance", "emploi"], {
    errorMap: () => ({
      message: "Le type de recherche doit etre : stage, alternance ou emploi.",
    }),
  }),

  domains: z
    .array(z.string().min(1).max(50))
    .min(1, "Selectionne au moins un domaine.")
    .max(12, "Maximum 12 domaines."),

  location: z.enum(["city", "remote", "any"], {
    errorMap: () => ({
      message: "La localisation doit etre : city, remote ou any.",
    }),
  }),

  locationCity: z
    .string()
    .max(100, "La ville ne doit pas depasser 100 caracteres.")
    .default(""),

  level: z.enum(["etudiant", "junior", "confirme", "senior"], {
    errorMap: () => ({
      message: "Le niveau doit etre : etudiant, junior, confirme ou senior.",
    }),
  }),

  bio: z
    .string()
    .max(500, "La bio ne doit pas depasser 500 caracteres.")
    .default(""),
});

export type OnboardingWizardInput = z.infer<typeof onboardingWizardSchema>;

// ---------------------------------------------------------------------------
// Schema de recherche
// ---------------------------------------------------------------------------

export const searchSchema = z.object({
  keywords: z
    .string({ required_error: "Les mots-cles sont requis." })
    .min(2, "Les mots-cles doivent contenir au moins 2 caracteres.")
    .max(200, "Les mots-cles ne doivent pas depasser 200 caracteres."),

  location: z
    .string()
    .max(100, "La localisation ne doit pas depasser 100 caracteres.")
    .optional(),

  job_type: jobTypeEnum.optional(),

  experience_level: experienceLevelEnum.optional(),

  date_posted: datePostedEnum.optional(),

  remote_filter: remoteFilterEnum.optional(),
});

export type SearchInput = z.infer<typeof searchSchema>;

// ---------------------------------------------------------------------------
// Schema de generation de message
// ---------------------------------------------------------------------------

export const generateMessageSchema = z.discriminatedUnion("type", [
  // Candidature
  z.object({
    type: z.literal("candidature"),
    poste: z
      .string({ required_error: "Le poste est requis." })
      .min(2, "Le poste doit contenir au moins 2 caracteres.")
      .max(100, "Le poste ne doit pas depasser 100 caracteres."),
    entreprise: z
      .string({ required_error: "L'entreprise est requise." })
      .min(1, "L'entreprise est requise.")
      .max(100, "L'entreprise ne doit pas depasser 100 caracteres."),
    domaine: z
      .string({ required_error: "Le domaine est requis." })
      .min(2, "Le domaine doit contenir au moins 2 caracteres.")
      .max(80, "Le domaine ne doit pas depasser 80 caracteres."),
    niveau: z
      .string({ required_error: "Le niveau est requis." })
      .min(2, "Le niveau doit contenir au moins 2 caracteres.")
      .max(50, "Le niveau ne doit pas depasser 50 caracteres."),
    description_perso: z
      .string({ required_error: "La description personnelle est requise." })
      .min(10, "La description doit contenir au moins 10 caracteres.")
      .max(2000, "La description ne doit pas depasser 2000 caracteres."),
    ton: toneEnum,
    competences: z
      .array(z.string().max(50, "Chaque competence ne doit pas depasser 50 caracteres."))
      .max(10, "Maximum 10 competences.")
      .optional(),
  }),

  // Reponse offre
  z.object({
    type: z.literal("reponse_offre"),
    titre_offre: z
      .string({ required_error: "Le titre de l'offre est requis." })
      .min(2, "Le titre de l'offre doit contenir au moins 2 caracteres.")
      .max(200, "Le titre de l'offre ne doit pas depasser 200 caracteres."),
    description_offre: z
      .string({ required_error: "La description de l'offre est requise." })
      .min(10, "La description de l'offre doit contenir au moins 10 caracteres.")
      .max(3000, "La description de l'offre ne doit pas depasser 3000 caracteres."),
    entreprise: z
      .string({ required_error: "L'entreprise est requise." })
      .min(1, "L'entreprise est requise.")
      .max(100, "L'entreprise ne doit pas depasser 100 caracteres."),
    profil_utilisateur: z
      .string({ required_error: "Le profil utilisateur est requis." })
      .min(10, "Le profil doit contenir au moins 10 caracteres.")
      .max(2000, "Le profil ne doit pas depasser 2000 caracteres."),
    ton: toneEnum,
  }),

  // Relance
  z.object({
    type: z.literal("relance"),
    contexte: z
      .string({ required_error: "Le contexte est requis." })
      .min(10, "Le contexte doit contenir au moins 10 caracteres.")
      .max(1000, "Le contexte ne doit pas depasser 1000 caracteres."),
    poste: z
      .string({ required_error: "Le poste est requis." })
      .min(2, "Le poste doit contenir au moins 2 caracteres.")
      .max(100, "Le poste ne doit pas depasser 100 caracteres."),
    entreprise: z
      .string({ required_error: "L'entreprise est requise." })
      .min(1, "L'entreprise est requise.")
      .max(100, "L'entreprise ne doit pas depasser 100 caracteres."),
    ton: toneEnum,
    delai: z
      .string({ required_error: "Le delai est requis." })
      .min(1, "Le delai est requis.")
      .max(50, "Le delai ne doit pas depasser 50 caracteres."),
  }),

  // Remerciement
  z.object({
    type: z.literal("remerciement"),
    poste: z
      .string({ required_error: "Le poste est requis." })
      .min(2, "Le poste doit contenir au moins 2 caracteres.")
      .max(100, "Le poste ne doit pas depasser 100 caracteres."),
    entreprise: z
      .string({ required_error: "L'entreprise est requise." })
      .min(1, "L'entreprise est requise.")
      .max(100, "L'entreprise ne doit pas depasser 100 caracteres."),
    nom_interlocuteur: z
      .string({ required_error: "Le nom de l'interlocuteur est requis." })
      .min(1, "Le nom de l'interlocuteur est requis.")
      .max(100, "Le nom ne doit pas depasser 100 caracteres."),
    points_cles: z
      .string({ required_error: "Les points cles sont requis." })
      .min(10, "Les points cles doivent contenir au moins 10 caracteres.")
      .max(2000, "Les points cles ne doivent pas depasser 2000 caracteres."),
    ton: toneEnum,
  }),
]);

export type GenerateMessageInput = z.infer<typeof generateMessageSchema>;

// ---------------------------------------------------------------------------
// Schema de creation de candidature (suivi)
// ---------------------------------------------------------------------------

export const createApplicationSchema = z.object({
  poste: z
    .string({ required_error: "Le poste est requis." })
    .min(2, "Le poste doit contenir au moins 2 caracteres.")
    .max(200, "Le poste ne doit pas depasser 200 caracteres."),

  entreprise: z
    .string({ required_error: "L'entreprise est requise." })
    .min(1, "L'entreprise est requise.")
    .max(100, "L'entreprise ne doit pas depasser 100 caracteres."),

  url_offre: z
    .string()
    .url("L'URL de l'offre n'est pas valide.")
    .max(500, "L'URL ne doit pas depasser 500 caracteres.")
    .optional(),

  statut: applicationStatusEnum.default("brouillon"),

  notes: z
    .string()
    .max(5000, "Les notes ne doivent pas depasser 5000 caracteres.")
    .optional(),

  message_envoye: z
    .string()
    .max(2000, "Le message ne doit pas depasser 2000 caracteres.")
    .optional(),

  contact_nom: z
    .string()
    .max(100, "Le nom du contact ne doit pas depasser 100 caracteres.")
    .optional(),

  contact_poste: z
    .string()
    .max(100, "Le poste du contact ne doit pas depasser 100 caracteres.")
    .optional(),

  date_candidature: z
    .string()
    .datetime({ message: "La date de candidature n'est pas valide." })
    .optional(),

  date_relance: z
    .string()
    .datetime({ message: "La date de relance n'est pas valide." })
    .optional(),
});

export type CreateApplicationInput = z.infer<typeof createApplicationSchema>;

// ---------------------------------------------------------------------------
// Schema de mise a jour de candidature
// ---------------------------------------------------------------------------

export const updateApplicationSchema = createApplicationSchema.partial();

export type UpdateApplicationInput = z.infer<typeof updateApplicationSchema>;

// ---------------------------------------------------------------------------
// Schema de sauvegarde d'offre
// ---------------------------------------------------------------------------

export const createSavedJobSchema = z.object({
  titre: z
    .string({ required_error: "Le titre de l'offre est requis." })
    .min(2, "Le titre doit contenir au moins 2 caracteres.")
    .max(200, "Le titre ne doit pas depasser 200 caracteres."),

  entreprise: z
    .string({ required_error: "L'entreprise est requise." })
    .min(1, "L'entreprise est requise.")
    .max(100, "L'entreprise ne doit pas depasser 100 caracteres."),

  url: z
    .string({ required_error: "L'URL de l'offre est requise." })
    .url("L'URL n'est pas valide.")
    .max(500, "L'URL ne doit pas depasser 500 caracteres."),

  localisation: z
    .string()
    .max(100, "La localisation ne doit pas depasser 100 caracteres.")
    .optional(),

  type_contrat: jobTypeEnum.optional(),

  salaire: z
    .string()
    .max(50, "Le salaire ne doit pas depasser 50 caracteres.")
    .optional(),

  description: z
    .string()
    .max(5000, "La description ne doit pas depasser 5000 caracteres.")
    .optional(),

  date_publication: z
    .string()
    .datetime({ message: "La date de publication n'est pas valide." })
    .optional(),

  notes: z
    .string()
    .max(2000, "Les notes ne doivent pas depasser 2000 caracteres.")
    .optional(),

  priorite: z
    .enum(["basse", "moyenne", "haute"], {
      errorMap: () => ({
        message: "La priorite doit etre : basse, moyenne ou haute.",
      }),
    })
    .default("moyenne"),
});

export type CreateSavedJobInput = z.infer<typeof createSavedJobSchema>;
