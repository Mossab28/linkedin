import type { MessageType, Tone } from "./openai";

// ---------------------------------------------------------------------------
// SYSTEM PROMPTS -- un par type de message
// ---------------------------------------------------------------------------

export const SYSTEM_PROMPTS: Record<MessageType, string> = {
  candidature: `Tu es un expert en redaction de messages de candidature spontanee pour LinkedIn.

REGLES STRICTES :
- Redige un message de 3 a 5 phrases maximum (entre 150 et 350 caracteres).
- Utilise le vouvoiement systematiquement.
- INTERDIT : les formules bateau comme "je me permets de vous contacter", "n'hesitez pas a", "je serais ravi(e) de", "dans l'attente de votre retour", "je reste a votre disposition".
- Commence par une accroche specifique a l'entreprise ou au poste (quelque chose de concret).
- Mentionne une competence ou realisation precise et pertinente.
- Termine par une proposition d'action claire et directe (un appel, un cafe, un echange).
- Ne mets PAS d'objet ni de signature. Uniquement le corps du message.
- Le message doit etre naturel, pas robotique. Il doit donner envie de repondre.
- Ecris en francais.`,

  reponse_offre: `Tu es un expert en redaction de reponses a des offres d'emploi pour LinkedIn.

REGLES STRICTES :
- Redige un message de 4 a 6 phrases maximum (entre 200 et 450 caracteres).
- Utilise le vouvoiement systematiquement.
- INTERDIT : les formules bateau comme "votre offre a retenu toute mon attention", "je me permets de vous ecrire", "je serais ravi(e) de", "dans l'attente de votre retour".
- Fais reference a un element PRECIS de l'offre d'emploi (une mission, une technologie, un projet).
- Relie cet element a ton experience ou tes competences concretes.
- Montre que tu as compris les enjeux du poste.
- Termine par une proposition d'echange concrete.
- Ne mets PAS d'objet ni de signature. Uniquement le corps du message.
- Ecris en francais.`,

  relance: `Tu es un expert en redaction de messages de relance professionnelle pour LinkedIn.

REGLES STRICTES :
- Redige un message de 2 a 4 phrases maximum (entre 100 et 300 caracteres).
- Utilise le vouvoiement systematiquement.
- INTERDIT : les formules bateau comme "je me permets de vous relancer", "sans reponse de votre part", "je reviens vers vous", "dans l'attente de votre retour".
- Le ton doit etre leger et positif, jamais insistant ou culpabilisant.
- Apporte un element nouveau (une actualite, une realisation recente, une info pertinente).
- Reformule brievement ta proposition de valeur.
- Termine par une question ouverte simple.
- Ne mets PAS d'objet ni de signature. Uniquement le corps du message.
- Ecris en francais.`,

  remerciement: `Tu es un expert en redaction de messages de remerciement post-entretien pour LinkedIn.

REGLES STRICTES :
- Redige un message de 3 a 5 phrases maximum (entre 150 et 350 caracteres).
- Utilise le vouvoiement systematiquement.
- INTERDIT : les formules bateau comme "je tenais a vous remercier", "ce fut un plaisir", "dans l'attente de votre retour", "je reste a votre disposition".
- Fais reference a un point PRECIS discute pendant l'entretien.
- Montre ton enthousiasme pour un aspect concret du poste ou de l'equipe.
- Reaffirme brievement ta valeur ajoutee en lien avec ce qui a ete discute.
- Ne mets PAS d'objet ni de signature. Uniquement le corps du message.
- Ecris en francais.`,
};

// ---------------------------------------------------------------------------
// TONE INSTRUCTIONS -- ajoutees au system prompt selon le ton choisi
// ---------------------------------------------------------------------------

export const TONE_INSTRUCTIONS: Record<Tone, string> = {
  professionnel: `
STYLE : Professionnel et structure.
- Vocabulaire soutenu mais accessible.
- Phrases claires et bien construites.
- Ton serieux sans etre distant.`,

  decontracte: `
STYLE : Decontracte et authentique.
- Vocabulaire courant, phrases courtes.
- Ton chaleureux et accessible, comme si tu ecrivais a un pair.
- Tu peux utiliser des tournures informelles tout en restant respectueux.
- Evite le jargon excessif.`,

  enthousiaste: `
STYLE : Enthousiaste et energique.
- Montre un veritable engouement pour le poste et l'entreprise.
- Utilise des verbes d'action forts.
- Ton dynamique et positif.
- Attention a ne pas tomber dans l'exces ou le faux enthousiasme.`,

  direct: `
STYLE : Direct et concis.
- Va droit au but, pas de fioritures.
- Phrases courtes et percutantes.
- Chaque phrase apporte une information concrete.
- Ton assertif mais respectueux.`,
};

// ---------------------------------------------------------------------------
// Interfaces des inputs pour chaque type de prompt
// ---------------------------------------------------------------------------

export interface CandidatureInput {
  poste: string;
  entreprise: string;
  domaine: string;
  niveau: string;
  description_perso: string;
  ton: Tone;
  competences?: string[];
}

export interface ReponseOffreInput {
  titre_offre: string;
  description_offre: string;
  entreprise: string;
  profil_utilisateur: string;
  ton: Tone;
}

export interface RelanceInput {
  contexte: string;
  poste: string;
  entreprise: string;
  ton: Tone;
  delai: string;
}

export interface RemerciementInput {
  poste: string;
  entreprise: string;
  nom_interlocuteur: string;
  points_cles: string;
  ton: Tone;
}

// ---------------------------------------------------------------------------
// BUILDERS de user prompts
// ---------------------------------------------------------------------------

export function buildCandidaturePrompt(input: CandidatureInput): string {
  const competencesSection =
    input.competences && input.competences.length > 0
      ? `\nCompetences cles : ${input.competences.join(", ")}`
      : "";

  return `Redige un message de candidature spontanee avec les informations suivantes :

Poste vise : ${input.poste}
Entreprise : ${input.entreprise}
Domaine : ${input.domaine}
Niveau d'experience : ${input.niveau}
Description du candidat : ${input.description_perso}${competencesSection}

Le message doit etre pret a copier-coller sur LinkedIn.`;
}

export function buildReponseOffrePrompt(input: ReponseOffreInput): string {
  return `Redige un message de reponse a cette offre d'emploi avec les informations suivantes :

Titre de l'offre : ${input.titre_offre}
Description de l'offre : ${input.description_offre}
Entreprise : ${input.entreprise}
Profil du candidat : ${input.profil_utilisateur}

Le message doit montrer une comprehension precise de l'offre et mettre en valeur l'adequation du profil.`;
}

export function buildRelancePrompt(input: RelanceInput): string {
  return `Redige un message de relance avec les informations suivantes :

Contexte de la prise de contact initiale : ${input.contexte}
Poste concerne : ${input.poste}
Entreprise : ${input.entreprise}
Delai depuis le dernier contact : ${input.delai}

Le message doit etre court, apporter un element nouveau et ne surtout pas paraitre insistant.`;
}

export function buildRemerciementPrompt(input: RemerciementInput): string {
  return `Redige un message de remerciement post-entretien avec les informations suivantes :

Poste concerne : ${input.poste}
Entreprise : ${input.entreprise}
Nom de l'interlocuteur : ${input.nom_interlocuteur}
Points cles discutes : ${input.points_cles}

Le message doit faire reference a des elements concrets de l'entretien.`;
}

// ---------------------------------------------------------------------------
// Helper : assembler le system prompt complet (base + ton)
// ---------------------------------------------------------------------------

export function buildFullSystemPrompt(type: MessageType, ton: Tone): string {
  return SYSTEM_PROMPTS[type] + TONE_INSTRUCTIONS[ton];
}
