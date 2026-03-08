# LINKBOOST — Spécification MVP Complète

> **One-liner** : Réponds à 4 questions, obtiens des pistes LinkedIn ciblées et des messages de prospection prêts à envoyer.

---

## TABLE DES MATIÈRES

1. [Produit & Vision](#1-produit--vision)
2. [UX/UI — Design System](#2-uxui--design-system)
3. [UX/UI — Pages](#3-uxui--pages)
4. [Architecture Backend](#4-architecture-backend)
5. [Base de Données](#5-base-de-données)
6. [API Routes](#6-api-routes)
7. [Intelligence Artificielle](#7-intelligence-artificielle)
8. [Conformité & Sécurité](#8-conformité--sécurité)
9. [Roadmap & Sprints](#9-roadmap--sprints)
10. [Tests & QA](#10-tests--qa)
11. [Lancement](#11-lancement)

---

# 1. PRODUIT & VISION

## 1.1 Cibles Prioritaires

### Persona A — L'étudiant stressé (priorité 1)
- Étudiant Bac+3 à Bac+5, 20-25 ans
- Doit trouver un stage obligatoire dans les 2-8 semaines
- Ne sait pas quoi chercher sur LinkedIn, n'ose pas contacter des inconnus
- Utilise LinkedIn sur mobile, entre deux cours

### Persona B — Le jeune diplômé perdu (priorité 2)
- Diplômé depuis moins de 12 mois, 22-27 ans
- Envoie des candidatures génériques sans retour
- Prêt à payer un petit montant si ça marche

### Persona C — Le profil en reconversion (priorité 3)
- 28-40 ans, change de secteur
- Ne connaît pas les bons mots-clés du nouveau domaine

## 1.2 Problème

La recherche d'emploi/stage sur LinkedIn est **lente, manuelle, répétitive et anxiogène** :

1. **Recherche inefficace** : mots-clés approximatifs, centaines de résultats non qualifiés, 3h de scroll
2. **Prospection paralysante** : 20 min par message, résultat générique, 5 messages/semaine au lieu de 50
3. **Suivi inexistant** : aucune vision sur ce qui a été envoyé, oubli de relancer

**Quantification** : 10-15h/semaine pour 3-5 candidatures, taux de réponse < 5%, durée moyenne 3-6 mois.

## 1.3 Proposition de Valeur

| | Avant (manuel) | Avec LinkBoost |
|---|---|---|
| Temps | 5h pour 3 actions | 3 min pour 10+ actions |
| Messages | Génériques, 20 min chacun | Personnalisés, 30 sec |
| Suivi | Aucun | Dashboard clair |
| Taux de réponse | ~5% | Estimé 15-25% |

## 1.4 Principes MVP

1. **Peu d'inputs, beaucoup d'outputs** — 4-5 questions max
2. **Résultat en < 30 secondes** après la dernière question
3. **Zéro compte requis pour le premier résultat** — mur d'inscription après
4. **Copy-paste ready** — bouton "Copier" sur chaque message
5. **Mobile first, dark mode natif**
6. **Pas de faux semblant** — liens de recherche LinkedIn, pas de scraping
7. **Tonalité rassurante et moderne** — tutoiement, formulations courtes

## 1.5 Matrice de Priorités

### Must Have (V1 — Semaines 1-2)
| Feature | Justification |
|---|---|
| Questionnaire 4 étapes | Cœur du produit |
| Génération de liens LinkedIn (offres) | Valeur immédiate |
| Génération de liens LinkedIn (profils) | Prospection directe |
| Génération de 3 messages par IA | Deuxième pilier de valeur |
| Bouton "Copier" sur chaque message | UX critique |
| Landing page | Acquisition |
| Auth Google + email (Supabase) | Sauvegarde |
| Dark mode, responsive mobile | Non négociable |
| Sauvegarde des résultats | Rétention |

### Should Have (V1.1 — Semaines 3-4)
| Feature | Justification |
|---|---|
| Dashboard suivi candidatures | Troisième pilier |
| Bouton "Régénérer" messages | Itération sans relancer le flow |
| Historique des recherches | Retrouver ses anciennes recherches |
| Ajout manuel de candidature | Flexibilité |
| Rappel de relance | Augmente le taux de relance |

### Nice to Have (V2)
- Personnalisation messages avec CV
- Templates par secteur
- Score de pertinence
- Extension Chrome
- Mode "Coach" IA

## 1.6 Modèle de Monétisation (post-validation)

| Plan | Prix | Inclus |
|---|---|---|
| **Gratuit** | 0€ | 2 recherches/semaine, 3 messages/recherche |
| **Pro** | 9,90€/mois | Illimité, dashboard, historique |
| **Boost** | 19,90€/mois | Tout Pro + coaching IA, templates |

---

# 2. UX/UI — DESIGN SYSTEM

## 2.1 Palette de Couleurs (Dark Mode)

```
Background     : #09090B (principal), #111113 (cartes), #1A1A1F (inputs), #222228 (modals)
Bordures       : #27272A (subtile), #3F3F46 (hover), #7C3AED (focus)
Texte          : #FAFAFA (principal), #A1A1AA (secondaire), #71717A (placeholder)
Accent Violet  : #8B5CF6 (principal), #7C3AED (hover), #6D28D9 (active)
Accent Bleu    : #3B82F6
Succès         : #22C55E
Warning        : #F59E0B
Erreur         : #EF4444
Info           : #3B82F6
```

## 2.2 Typographie

- **Police** : Inter (Google Fonts) ou Geist (Vercel)
- **Display** : 48px, line-height 1.1, letter-spacing -0.02em
- **H1** : 36px / **H2** : 30px / **H3** : 24px / **H4** : 20px
- **Body** : 16px, line-height 1.6
- **Body-sm** : 14px / **Caption** : 12px

## 2.3 Spacing & Radius

```
Container max   : 1200px (max-w-6xl)
Card padding    : 1.5rem (p-6)
Input height    : 2.75rem (h-11, 44px touch target)
Border-radius   : 6px (badges), 8px (boutons), 12px (cartes), 16px (modals)
Shadows         : glow = 0 0 20px rgba(139,92,246,0.15)
```

## 2.4 Composants Réutilisables

### Boutons
| Variante | Style |
|---|---|
| primary | bg-accent-500 hover:bg-accent-600 text-white rounded-lg h-11 px-6 |
| secondary | border border-border hover:bg-background-tertiary rounded-lg h-11 px-6 |
| ghost | hover:bg-background-tertiary text-text-secondary rounded-lg h-11 px-4 |
| destructive | bg-error hover:bg-red-600 text-white rounded-lg h-11 px-6 |

### Cards
- **Base** : bg-background-secondary border border-border rounded-xl p-6 hover:border-border-hover
- **Offre** : logo + titre + entreprise + lieu + tags + boutons (Générer message / Voir LinkedIn)
- **Stat** : icône cercle coloré + label caption + valeur h2 bold

### Inputs
- bg-background-tertiary border border-border rounded-lg h-11 px-4 focus:border-accent-500
- **Chip Select** (onboarding) : p-4 rounded-xl, selected = bg-accent-500/10 border-accent-500 shadow-glow

### Navigation
- **Sidebar** (desktop) : w-64 bg-background-secondary, items avec icônes Lucide
- **Bottom Tab Bar** (mobile) : h-16 bg-background-secondary border-t

### Autres
- **Skeleton** : bg-background-tertiary animate-pulse
- **Progress** : gradient from-accent-500 to-blue-500, transition 500ms
- **Badges** : rounded-full avec dot coloré par statut
- **Toast** : bottom-right, bg-background-elevated border rounded-xl, auto-dismiss 4s
- **Empty State** : icône 64x64 + titre + description + CTA

## 2.5 Animations (Framer Motion)

```
Page transition  : opacity 0→1, y 12→0 (250ms)
Onboarding steps : x 40→0 (spring 300ms), inverse au retour
Card hover       : translateY(-2px) + shadow-glow (200ms)
Typewriter IA    : 15ms/caractère, curseur | clignotant
Skeleton→contenu : fade out 150ms, cards stagger 80ms
```

---

# 3. UX/UI — PAGES

## 3.1 Landing Page

### Hero Section
```
[Navbar fixed : Logo | Features | Tarifs | Connexion | CTA]

"Propulsé par l'IA" (overline accent)

"Trouve ton prochain stage ou emploi sur LinkedIn" (display bold, gradient text)

"Réponds à 5 questions. L'IA te trouve les meilleures offres
et génère des messages de prospection personnalisés." (h4 secondary)

[Commencer gratuitement] [Voir la démo]

+2 500 utilisateurs | Gratuit | Aucune carte requise
```

### Sections
- **Comment ça marche** : 3 colonnes (Questions → Offres → Messages)
- **Social Proof** : 3 témoignages
- **CTA Final** : fond gradient + bouton primary
- **Footer** : 4 colonnes (Logo, Produit, Ressources, Légal)

## 3.2 Signup / Login

- **Desktop** : split 50/50 (gauche gradient + illustration, droite formulaire)
- **Mobile** : formulaire plein écran
- Bouton Google OAuth + séparateur "ou" + input Magic Link
- **États** : lien envoyé (icône Mail), email invalide, erreur OAuth, lien expiré

## 3.3 Onboarding (5 étapes)

Plein écran, barre de progression gradient, contenu centré (max-w-md), animation slide entre étapes.

| Step | Question | Interface |
|---|---|---|
| 1 | "Tu cherches quoi ?" | 3 ChipSelect : Stage / Alternance / Emploi |
| 2 | "Dans quel domaine ?" | Grille 2-3 cols de domaines avec icônes (sélection multiple) |
| 3 | "Où ?" | 3 ChipSelect : Ville / Remote / Pas de préférence + input conditionnel |
| 4 | "Quel niveau ?" | 4 ChipSelect : Étudiant / Junior / Confirmé / Senior |
| 5 | "Un mot sur toi" | Textarea optionnelle (500 car.) + bouton "Lancer la recherche" |

## 3.4 Résultats

- **Layout** : Sidebar + contenu principal
- **Header** : titre + compteur + bouton filtres + chips de filtres actifs
- **Liste** : cards offres avec infinite scroll
- **Actions par carte** : Générer message (primary) / Voir sur LinkedIn (secondary) / Bookmark
- **Filtres** : type contrat, mode travail, niveau, date publication
- **États** : loading (6 skeletons), vide (SearchX + message), erreur (AlertTriangle + retry)

### Onglets de résultats
1. **Offres** : 3-5 liens de recherche LinkedIn pré-construits
2. **Contacts** : 3-5 recherches de profils (recruteurs, managers, RH)
3. **Messages** : 3 messages de prospection pré-générés avec boutons Copier / Régénérer

## 3.5 Générateur de Message

- **Rappel offre** : bandeau avec logo + titre + entreprise
- **Paramètres** : type (Candidature/Mise en relation/Info), ton (Pro/Décontracté/Enthousiaste), longueur
- **Bouton** : "Générer le message" (primary fullWidth lg)
- **Preview** : zone texte avec effet typewriter pendant la génération
- **Actions** : Copier (toast succès) / Régénérer / Modifier

## 3.6 Dashboard

- **Stats** : 4 cartes (Envoyées, Vues, Réponses, En attente)
- **Liste candidatures** : filtre par statut, chaque ligne avec logo + poste + entreprise + date + badge statut + menu actions
- **État vide** : "Pas encore de candidatures" + bouton "Découvrir les offres"

---

# 4. ARCHITECTURE BACKEND

## 4.1 Stack

| Composant | Technologie |
|---|---|
| Framework | Next.js 14+ (App Router) |
| Langage | TypeScript strict |
| Base de données | Supabase (PostgreSQL) |
| Auth | Supabase Auth (Google OAuth + Magic Link) |
| IA | OpenAI API (GPT-4o-mini) |
| Déploiement | Vercel |
| Validation | Zod |
| Rate Limiting | Upstash Redis |
| UI | Tailwind CSS + Shadcn/UI + Framer Motion |
| Icônes | Lucide React |

## 4.2 Arborescence Fichiers

```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── layout.tsx
│   ├── (protected)/
│   │   ├── dashboard/page.tsx
│   │   ├── search/page.tsx
│   │   ├── applications/page.tsx
│   │   ├── messages/generate/page.tsx
│   │   ├── settings/page.tsx
│   │   └── layout.tsx
│   ├── onboarding/page.tsx
│   ├── auth/callback/route.ts
│   ├── api/
│   │   ├── onboarding/route.ts
│   │   ├── search/route.ts
│   │   ├── generate-message/route.ts
│   │   ├── applications/route.ts
│   │   ├── applications/[id]/route.ts
│   │   ├── saved-jobs/route.ts
│   │   ├── dashboard/stats/route.ts
│   │   ├── messages/route.ts
│   │   └── user/profile/route.ts
│   ├── layout.tsx
│   ├── page.tsx              # Landing
│   └── error.tsx
├── components/
│   ├── ui/                   # Shadcn/UI customisés
│   ├── layout/               # Navbar, Sidebar, BottomTabBar
│   ├── features/
│   │   ├── onboarding/
│   │   ├── results/
│   │   ├── message-generator/
│   │   └── dashboard/
├── lib/
│   ├── supabase/             # client.ts, server.ts, middleware.ts
│   ├── linkedin/url-builder.ts
│   ├── ai/                   # openai.ts, prompts.ts, ai-service.ts
│   ├── validations/          # Schemas Zod
│   ├── rate-limit.ts
│   ├── sanitize.ts
│   └── utils/
├── types/
│   ├── database.ts           # Types générés par Supabase CLI
│   └── api.ts
├── hooks/
│   ├── use-user.ts
│   ├── use-applications.ts
│   └── use-dashboard-stats.ts
└── styles/globals.css
```

## 4.3 Variables d'Environnement

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...           # JAMAIS côté client

# OpenAI
OPENAI_API_KEY=sk-proj-...                 # JAMAIS côté client

# App
NEXT_PUBLIC_APP_URL=https://linkboost.fr

# Rate Limiting
UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=...
```

## 4.4 Auth Flow

1. **Google OAuth / Magic Link** via Supabase Auth
2. **Middleware** Next.js : vérifie session, redirige vers /login si non auth, vers /onboarding si pas complété
3. **Trigger SQL** `handle_new_user` : crée automatiquement profil + préférences à l'inscription
4. **RLS** sur toutes les tables : un utilisateur ne voit que ses données

## 4.5 Logique de Recherche LinkedIn

Construction d'URLs publiques — **aucun scraping, aucune API LinkedIn**.

**URL de base** : `https://www.linkedin.com/jobs/search/`

| Paramètre | Description | Mapping |
|---|---|---|
| `keywords` | Mots-clés | Texte libre encodé |
| `location` | Localisation | Texte libre |
| `f_TPR` | Date publication | r86400 (24h), r604800 (7j), r2592000 (30j) |
| `f_JT` | Type contrat | F (CDI), I (stage), C (CDD) |
| `f_E` | Niveau | 1 (stage), 2 (junior), 3 (associé) |
| `f_WT` | Remote | 1 (sur site), 2 (remote), 3 (hybride) |
| `sortBy` | Tri | DD (date) |

**Alternative Google Dork** : `site:linkedin.com/jobs/view "développeur web" "Paris"`

```typescript
// lib/linkedin/url-builder.ts
export function buildLinkedInSearchUrl(params: SearchParams): string {
  const url = new URL('https://www.linkedin.com/jobs/search/')
  if (params.keywords.length > 0) url.searchParams.set('keywords', params.keywords.join(' '))
  if (params.location) url.searchParams.set('location', params.location)
  if (params.date_posted !== 'any') url.searchParams.set('f_TPR', DATE_POSTED_MAP[params.date_posted])
  // ... autres filtres
  url.searchParams.set('sortBy', 'DD')
  return url.toString()
}
```

---

# 5. BASE DE DONNÉES

## 5.1 Schéma SQL Complet

```sql
-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLE : users (profil utilisateur)
-- ============================================
CREATE TABLE public.users (
  id                   UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email                TEXT NOT NULL UNIQUE,
  full_name            TEXT NOT NULL DEFAULT '',
  avatar_url           TEXT,
  current_title        TEXT,
  experience_level     TEXT CHECK (experience_level IN ('stage','alternance','junior','intermediaire','senior')) DEFAULT 'stage',
  education            TEXT,
  skills               TEXT[] DEFAULT '{}',
  linkedin_url         TEXT,
  bio                  TEXT,
  city                 TEXT,
  country              TEXT DEFAULT 'France',
  remote_preference    TEXT CHECK (remote_preference IN ('on_site','remote','hybrid','flexible')) DEFAULT 'flexible',
  onboarding_completed BOOLEAN DEFAULT FALSE,
  created_at           TIMESTAMPTZ DEFAULT NOW(),
  updated_at           TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_users_email ON public.users(email);

-- ============================================
-- TABLE : search_profiles (recherches sauvegardées)
-- ============================================
CREATE TABLE public.search_profiles (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id             UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name                TEXT NOT NULL DEFAULT 'Ma recherche',
  keywords            TEXT[] NOT NULL DEFAULT '{}',
  location            TEXT,
  job_type            TEXT[] DEFAULT '{}',
  experience_level    TEXT[] DEFAULT '{}',
  date_posted         TEXT CHECK (date_posted IN ('24h','week','month','any')) DEFAULT 'week',
  remote_filter       TEXT CHECK (remote_filter IN ('on_site','remote','hybrid','any')) DEFAULT 'any',
  linkedin_search_url TEXT,
  google_dork_url     TEXT,
  is_default          BOOLEAN DEFAULT FALSE,
  search_count        INTEGER DEFAULT 0,
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_search_profiles_user ON public.search_profiles(user_id);

-- ============================================
-- TABLE : saved_jobs (offres sauvegardées)
-- ============================================
CREATE TABLE public.saved_jobs (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id          UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title            TEXT NOT NULL,
  company_name     TEXT NOT NULL,
  location         TEXT,
  job_type         TEXT,
  description      TEXT,
  linkedin_job_url TEXT,
  interest_level   INTEGER CHECK (interest_level BETWEEN 1 AND 5) DEFAULT 3,
  notes            TEXT,
  tags             TEXT[] DEFAULT '{}',
  is_archived      BOOLEAN DEFAULT FALSE,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_saved_jobs_user ON public.saved_jobs(user_id);

-- ============================================
-- TABLE : applications (candidatures)
-- ============================================
CREATE TYPE application_status AS ENUM (
  'draft','sent','pending','interview','follow_up','rejected','accepted','withdrawn'
);

CREATE TABLE public.applications (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id               UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  saved_job_id          UUID REFERENCES public.saved_jobs(id) ON DELETE SET NULL,
  company_name          TEXT NOT NULL,
  job_title             TEXT NOT NULL,
  job_url               TEXT,
  status                application_status NOT NULL DEFAULT 'draft',
  applied_at            TIMESTAMPTZ,
  contact_name          TEXT,
  contact_linkedin      TEXT,
  next_follow_up_date   TIMESTAMPTZ,
  follow_up_count       INTEGER DEFAULT 0,
  last_follow_up_at     TIMESTAMPTZ,
  interview_date        TIMESTAMPTZ,
  interview_notes       TEXT,
  notes                 TEXT,
  response_time_days    INTEGER,
  created_at            TIMESTAMPTZ DEFAULT NOW(),
  updated_at            TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_applications_user ON public.applications(user_id);
CREATE INDEX idx_applications_status ON public.applications(user_id, status);
CREATE INDEX idx_applications_date ON public.applications(user_id, applied_at DESC);

-- ============================================
-- TABLE : generated_messages (messages IA)
-- ============================================
CREATE TYPE message_type AS ENUM ('cold_outreach','job_response','follow_up','thank_you');
CREATE TYPE message_tone AS ENUM ('professional','casual','enthusiastic','concise');

CREATE TABLE public.generated_messages (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id             UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  application_id      UUID REFERENCES public.applications(id) ON DELETE SET NULL,
  message_type        message_type NOT NULL,
  tone                message_tone NOT NULL DEFAULT 'professional',
  target_company      TEXT,
  target_job_title    TEXT,
  target_contact_name TEXT,
  generated_content   TEXT NOT NULL,
  model_used          TEXT DEFAULT 'gpt-4o-mini',
  tokens_input        INTEGER,
  tokens_output       INTEGER,
  cost_usd            NUMERIC(10,6),
  is_favorite         BOOLEAN DEFAULT FALSE,
  was_used            BOOLEAN DEFAULT FALSE,
  created_at          TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_messages_user ON public.generated_messages(user_id);

-- ============================================
-- TABLE : user_preferences
-- ============================================
CREATE TABLE public.user_preferences (
  id                       UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id                  UUID UNIQUE NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  default_tone             message_tone DEFAULT 'professional',
  theme                    TEXT CHECK (theme IN ('light','dark','system')) DEFAULT 'dark',
  plan                     TEXT CHECK (plan IN ('free','pro','premium')) DEFAULT 'free',
  messages_generated_today INTEGER DEFAULT 0,
  messages_daily_limit     INTEGER DEFAULT 10,
  last_quota_reset         DATE DEFAULT CURRENT_DATE,
  created_at               TIMESTAMPTZ DEFAULT NOW(),
  updated_at               TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.search_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generated_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

-- Politique : chaque utilisateur ne voit que SES données
CREATE POLICY "own_data" ON public.users FOR ALL USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "own_data" ON public.search_profiles FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own_data" ON public.saved_jobs FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own_data" ON public.applications FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own_data" ON public.generated_messages FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own_data" ON public.user_preferences FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ============================================
-- TRIGGER : création auto profil à l'inscription
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, avatar_url)
  VALUES (
    NEW.id, NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NULL)
  );
  INSERT INTO public.user_preferences (user_id) VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- FONCTION : stats dashboard
-- ============================================
CREATE OR REPLACE FUNCTION public.get_dashboard_stats(p_user_id UUID)
RETURNS JSON AS $$
DECLARE result JSON;
BEGIN
  SELECT json_build_object(
    'total_applications', (SELECT COUNT(*) FROM public.applications WHERE user_id = p_user_id),
    'by_status', (
      SELECT COALESCE(json_object_agg(status::text, cnt), '{}')
      FROM (SELECT status::text, COUNT(*) as cnt FROM public.applications WHERE user_id = p_user_id GROUP BY status) s
    ),
    'this_week', (SELECT COUNT(*) FROM public.applications WHERE user_id = p_user_id AND applied_at >= date_trunc('week', NOW())),
    'this_month', (SELECT COUNT(*) FROM public.applications WHERE user_id = p_user_id AND applied_at >= date_trunc('month', NOW())),
    'response_rate', (
      SELECT ROUND(COALESCE(
        COUNT(*) FILTER (WHERE status NOT IN ('sent','pending','draft'))::numeric /
        NULLIF(COUNT(*) FILTER (WHERE status != 'draft'), 0) * 100, 0), 1)
      FROM public.applications WHERE user_id = p_user_id
    ),
    'pending_follow_ups', (
      SELECT COUNT(*) FROM public.applications
      WHERE user_id = p_user_id AND next_follow_up_date <= NOW() + INTERVAL '2 days'
      AND status NOT IN ('rejected','accepted','withdrawn')
    )
  ) INTO result;
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger updated_at automatique
CREATE OR REPLACE FUNCTION update_updated_at() RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_users BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_search BEFORE UPDATE ON public.search_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_jobs BEFORE UPDATE ON public.saved_jobs FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_apps BEFORE UPDATE ON public.applications FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_prefs BEFORE UPDATE ON public.user_preferences FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

---

# 6. API ROUTES

| Route | Méthode | Auth | Description |
|---|---|---|---|
| `/api/onboarding` | POST | Oui | Sauvegarder profil + créer search_profile |
| `/api/search` | POST | Oui | Construire URLs LinkedIn + Google Dork |
| `/api/generate-message` | POST | Oui | Générer message via OpenAI |
| `/api/applications` | GET/POST | Oui | Lister/créer candidatures |
| `/api/applications/[id]` | PATCH/DELETE | Oui | Modifier/supprimer candidature |
| `/api/saved-jobs` | GET/POST | Oui | Lister/sauvegarder offres |
| `/api/saved-jobs/[id]` | PATCH/DELETE | Oui | Modifier/supprimer offre |
| `/api/dashboard/stats` | GET | Oui | Stats via fonction SQL RPC |
| `/api/messages` | GET | Oui | Historique messages générés |
| `/api/messages/[id]` | PATCH | Oui | Noter/favoris |
| `/api/user/profile` | PATCH | Oui | Modifier profil |
| `/api/user/preferences` | GET/PATCH | Oui | Préférences |
| `/api/ai/stream` | POST | Oui | Génération streaming SSE |

---

# 7. INTELLIGENCE ARTIFICIELLE

## 7.1 Prompts Système

### Candidature Spontanée
```
Tu es un expert en rédaction de messages LinkedIn pour la recherche d'emploi en France.

RÈGLES :
- Message entre 150 et 300 caractères
- Pas de formule bateau ("je me permets de", "votre entreprise m'inspire")
- Structure : accroche personnalisée → valeur ajoutée → appel à l'action
- Vouvoiement par défaut
- Pas d'emoji (sauf ton enthousiaste, max 1)
- Termine par une question ouverte

Retourne UNIQUEMENT le message, sans guillemets ni explication.
```

### Réponse à Offre
```
Cite au moins 1 élément précis de l'offre.
Relie-le à une expérience concrète du candidat.
200-400 caractères.
```

### Relance
```
Non insistant. Apporte un élément nouveau.
100-250 caractères. Ne mentionne pas le délai écoulé.
```

### Remerciement Post-Entretien
```
Cite un point précis discuté pendant l'entretien.
150-300 caractères. Sincère, pas de flatterie excessive.
```

## 7.2 Tons Disponibles

| Ton | Instruction |
|---|---|
| Professionnel | Formel, vouvoiement, phrases structurées |
| Décontracté | Naturel, direct, vouvoiement maintenu |
| Enthousiaste | Dynamique, passionné, max 1 emoji |
| Direct | Ultra-concis, faits et chiffres, 100 mots max |

## 7.3 Paramètres de Génération

| Type | Model | Temperature | Max Tokens | Coût estimé |
|---|---|---|---|---|
| Candidature | gpt-4o-mini | 0.7 | 350 | ~$0.00036 |
| Réponse offre | gpt-4o-mini | 0.6 | 450 | ~$0.00048 |
| Relance | gpt-4o-mini | 0.6 | 300 | ~$0.00021 |
| Remerciement | gpt-4o-mini | 0.7 | 350 | ~$0.00028 |
| Mots-clés | gpt-4o-mini | 0.4 | 500 | ~$0.00035 |

## 7.4 Code d'Intégration

### `lib/openai.ts` — Client OpenAI
```typescript
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export type MessageType = 'candidature' | 'reponse_offre' | 'relance' | 'remerciement';
export type Tone = 'professionnel' | 'decontracte' | 'enthousiaste' | 'direct';

export async function generateMessage(
  messageType: MessageType,
  systemPrompt: string,
  userPrompt: string,
) {
  const config = GENERATION_CONFIGS[messageType];
  const response = await openai.chat.completions.create({
    model: config.model,
    temperature: config.temperature,
    max_tokens: config.max_tokens,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
  });
  return {
    content: response.choices[0]?.message?.content?.trim() ?? '',
    usage: response.usage,
  };
}
```

### `lib/sanitize.ts` — Anti-injection
```typescript
const INJECTION_PATTERNS = [
  /ignore\s+(previous|all|above)\s+instructions/gi,
  /you\s+are\s+now/gi,
  /system\s*:\s*/gi,
];

export function sanitizeField(field: string, value: string): string {
  let s = value.trim();
  for (const pattern of INJECTION_PATTERNS) s = s.replace(pattern, '[FILTRE]');
  return s.substring(0, MAX_LENGTHS[field] || 500);
}
```

### `lib/rate-limit.ts` — Quotas Upstash
```typescript
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

export const aiLimiter = new Ratelimit({
  redis: new Redis({ url: process.env.UPSTASH_REDIS_REST_URL!, token: process.env.UPSTASH_REDIS_REST_TOKEN! }),
  limiter: Ratelimit.slidingWindow(10, '1 m'),
  prefix: 'rl:ai',
});
```

## 7.5 Optimisation des Coûts

**À 1000 utilisateurs actifs (80% free, 15% starter, 5% pro) :** ~16,40 USD/mois

| Stratégie | Impact |
|---|---|
| Cache Redis des prompts identiques (5 min) | -30% |
| Quotas stricts par plan | Contrôle total |
| gpt-4o-mini pour tout | Déjà le moins cher |
| Prompts courts, pas de few-shots | -20% tokens |

## 7.6 Qualité & Sécurité

- **Validation longueur** par type (min/max caractères)
- **Détection formules bateau** ("je me permets", "candidat idéal")
- **Filtres contenu sensible** (mots de passe, cartes bancaires)
- **API Moderation OpenAI** (gratuite) sur chaque output
- **Retry** : 1 tentative si validation échoue
- **Fallback** : message d'aide à la rédaction manuelle si API down

---

# 8. CONFORMITÉ & SÉCURITÉ

## 8.1 Conformité LinkedIn

**Construire des URLs de recherche LinkedIn est 100% légal.** C'est l'équivalent d'un bookmark intelligent. Aucune donnée n'est extraite.

### Interdit
- Scraping, automatisation navigateur, endpoints internes
- Stocker des données LinkedIn, iframes
- Envoi automatisé de messages

### Obligatoire
- Disclaimer "Non affilié à LinkedIn Corporation"
- Respecter les Brand Guidelines pour le logo
- Ne stocker que les URLs, pas les contenus LinkedIn

## 8.2 RGPD

### Données collectées
| Donnée | Source | Base légale |
|---|---|---|
| Email, nom | Google OAuth / Magic Link | Exécution du contrat |
| Préférences recherche | Saisie utilisateur | Exécution du contrat |
| Messages générés | OpenAI API | Exécution du contrat |
| Candidatures | Saisie utilisateur | Exécution du contrat |
| IP, user agent | Automatique | Intérêt légitime |

### Droits utilisateurs à implémenter
- **Accès** : endpoint `/api/user/export` (JSON)
- **Rectification** : page Mon Profil
- **Effacement** : bouton "Supprimer mon compte" (cascade)
- **Portabilité** : même export JSON

### Durées de conservation
- Compte actif : tant qu'actif
- Compte inactif : 24 mois après dernière connexion
- Après suppression : 30 jours (backup) puis suppression définitive

### Cookies
**Si pas d'analytics tiers** (recommandé pour le MVP) → **pas de bannière cookies nécessaire.**

### Transferts hors UE
- Supabase : choisir région EU
- OpenAI : signer le DPA, ne jamais envoyer d'email/nom dans les prompts
- Vercel : SCC automatiques

## 8.3 Sécurité Applicative

### Checklist MVP

```
[x] RLS activé sur TOUTES les tables Supabase
[x] SUPABASE_SERVICE_ROLE_KEY uniquement côté serveur
[x] OPENAI_API_KEY uniquement côté serveur
[x] .env.local dans .gitignore
[x] Headers de sécurité (X-Frame-Options, HSTS, CSP, nosniff)
[x] Rate limiting (10 req/min IA, 30 req/min API, 5 req/15min auth)
[x] Validation Zod sur TOUS les endpoints
[x] Budget cap OpenAI (25 USD/mois hard limit)
[x] npm audit sans vulnérabilité critique
```

### Headers de Sécurité (next.config.ts)
```javascript
const securityHeaders = [
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
];
```

## 8.4 Utilisation de l'IA

- **Informer l'utilisateur** : mention "Message généré par IA" visible
- **Ne JAMAIS envoyer** d'email ou nom dans les prompts OpenAI
- **Data retention OpenAI** : vérifier "zero retention" activé
- **Moderation API** (gratuite) sur chaque output

## 8.5 Pages Légales Obligatoires

1. **Mentions Légales** : éditeur, hébergeur (Vercel), PI, responsabilité
2. **CGU** : description du service, interdiction du spam, utilisation IA, non-affiliation LinkedIn
3. **Politique de Confidentialité** : données collectées, bases légales, transferts, durées, droits, DPO

---

# 9. ROADMAP & SPRINTS

## Sprint 1 — Fondations (Jours 1-4)

| Tâche | Estimation |
|---|---|
| Setup Next.js 14 + TypeScript + Tailwind + Shadcn/UI | 1h |
| Config Supabase (projet, schema initial, RLS) | 2h |
| Auth Google OAuth + Magic Link | 3h |
| Layout principal (navbar, sidebar, dark mode, responsive) | 3h |
| Landing page (hero, features, CTA, footer) | 4h |
| Config Vitest + Sentry | 2h |
| **Total** | **~15h** |

## Sprint 2 — Core Features (Jours 5-8)

| Tâche | Estimation |
|---|---|
| Onboarding 5 étapes (UI + animations) | 5h |
| Construction URLs LinkedIn (url-builder.ts) | 3h |
| Tests unitaires URL builder | 1.5h |
| Page résultats (liens, bouton copier, sauvegarder) | 3h |
| API routes (onboarding, search, saved-jobs) | 3h |
| **Total** | **~16h** |

## Sprint 3 — IA + Dashboard (Jours 9-12)

| Tâche | Estimation |
|---|---|
| Intégration OpenAI + prompt engineering | 3h |
| Interface générateur de messages | 4h |
| Tests unitaires + intégration IA | 2h |
| Dashboard layout + stats | 2h |
| CRUD candidatures (formulaire, liste, statuts) | 4h |
| **Total** | **~15h** |

## Sprint 4 — Polish + Launch (Jours 13-15)

| Tâche | Estimation |
|---|---|
| Tests manuels complets (checklist 60 items) | 4h |
| Fix bugs | 4h |
| Tests E2E Playwright (2 scénarios critiques) | 3h |
| Pages légales (CGU, mentions, confidentialité) | 2h |
| SEO (meta, sitemap, robots.txt, OG) | 1.5h |
| Deploy Vercel + config prod | 1.5h |
| Setup PostHog (events clés) | 1h |
| **Total** | **~17h** |

**Total estimé : ~63h sur 15 jours — marge de 40% pour imprévus.**

---

# 10. TESTS & QA

## 10.1 Tests Unitaires (Vitest)

**Priorité** : URL builder, validation onboarding, prompt builder, formatage dates, sanitization.

```typescript
describe('buildLinkedInSearchUrl', () => {
  it('génère une URL valide', () => {
    const url = buildLinkedInSearchUrl({ keywords: ['dev react'], location: 'Paris', date_posted: 'week' });
    expect(url).toContain('linkedin.com/jobs/search');
    expect(url).toContain('keywords=dev%20react');
  });
  it('encode correctement les accents', () => { /* ... */ });
  it('throw si keywords vide', () => { /* ... */ });
});
```

## 10.2 Tests E2E (Playwright)

**Scénario 1** : Parcours complet inscription → onboarding → résultats → copier message
**Scénario 2** : Dashboard CRUD candidatures (créer, modifier statut, supprimer)

## 10.3 Checklist Tests Manuels (avant launch)

### Landing
- [ ] Charge en < 3s, CTA visible, responsive, liens footer

### Auth
- [ ] Google OAuth fonctionne, Magic Link arrive < 30s, session persiste au refresh

### Onboarding
- [ ] 5 étapes, validation, bouton Précédent conserve données, barre progression

### Résultats
- [ ] URLs LinkedIn s'ouvrent correctement, bouton Copier fonctionne

### Messages IA
- [ ] Génère en < 10s, cohérent, Copier fonctionne, Régénérer produit différent

### Dashboard
- [ ] Stats correctes, CRUD candidatures, filtre par statut

### Sécurité
- [ ] Pas de clé API exposée, RLS vérifié (user A ≠ user B), rate limiting actif

## 10.4 Monitoring Post-Launch

| Outil | Usage | Coût |
|---|---|---|
| Vercel Analytics | Web Vitals, visiteurs | Gratuit |
| Sentry | Erreurs JS/API | Gratuit (5k/mois) |
| PostHog | Events, funnels, rétention | Gratuit (1M events/mois) |
| Supabase Dashboard | DB, auth, storage | Inclus |
| OpenAI Dashboard | Coûts API | Inclus |

### KPIs Mois 1

| Métrique | Objectif |
|---|---|
| Visiteurs uniques | 1 000 |
| Inscriptions | 150 (15% conversion) |
| Recherches générées | 500 |
| Messages copiés | 300 |
| Rétention J+7 | 20% |

---

# 11. LANCEMENT

## 11.1 La V1 Concrète

L'utilisateur arrive sur linkboost.fr → page sombre, épurée → clique "C'est parti" → 4 questions en cliquant sur des cartes (30 sec) → obtient :

- **3 liens de recherche d'offres LinkedIn** optimisés
- **3 liens de recherche de profils** (recruteurs, managers)
- **3 messages de prospection IA** avec bouton "Copier"

**Sans compte.** S'il veut sauvegarder → inscription Google en 1 clic.

### Ce que la V1 ne fait PAS
- Pas de scraping LinkedIn
- Pas d'envoi automatique de messages
- Pas de dashboard (V1.1)
- Pas de light mode
- Pas de paiement (tout gratuit au lancement)

## 11.2 Plan de Simplification (si < 2 semaines)

| Retiré | Remplacé par |
|---|---|
| Dashboard suivi | Reporté V1.1 |
| Historique recherches | Reporté V1.1 |
| Autocomplétion domaines | Chips fixes (10-15 domaines) |
| Autocomplétion villes | 5 villes + champ libre |
| Régénération infinie | Limité à 3 |
| Light mode | Dark mode uniquement |

**DB simplifiée** : 2 tables (users + searches avec JSONB pour liens et messages).

## 11.3 Canaux d'Acquisition (gratuits)

- Posts LinkedIn du fondateur (growth organique)
- Groupes LinkedIn/Facebook étudiants
- Product Hunt launch
- Partenariats BDE / associations étudiantes
- SEO : "trouver stage LinkedIn", "message LinkedIn stage"

## 11.4 Rollback

- Vercel : rollback instantané via Dashboard → Deployments → Promote ancien deploy
- Supabase : backups restaurables
- Status pages : vercel-status.com, status.supabase.com, status.openai.com

## 11.5 Checklist Pré-Launch

```
Code & Qualité
[ ] Build production sans erreur
[ ] Tests passent
[ ] console.log supprimés
[ ] TypeScript sans erreur

Sécurité
[ ] RLS sur toutes les tables
[ ] Secrets uniquement côté serveur
[ ] .env.local dans .gitignore
[ ] Headers de sécurité configurés
[ ] Rate limiting actif
[ ] Budget cap OpenAI configuré

Légal
[ ] Mentions légales publiées
[ ] CGU publiées (case à cocher inscription)
[ ] Politique de confidentialité publiée
[ ] Disclaimer "Non affilié à LinkedIn"
[ ] Mention "Message généré par IA"

SEO & Marketing
[ ] Meta tags + OG tags
[ ] robots.txt + sitemap.xml
[ ] Favicon
[ ] Domaine custom + SSL

Monitoring
[ ] Sentry configuré
[ ] PostHog events clés
[ ] Vercel Analytics activé
```

---

## RÉSUMÉ EXÉCUTIF

**LinkBoost** est un outil qui transforme 4 réponses en résultats LinkedIn actionnables. Pas de scraping, pas de fausses promesses — juste des liens intelligemment construits et des messages IA calibrés.

- **Stack** : Next.js 14 + Supabase + OpenAI + Tailwind/Shadcn + Vercel
- **Timeline** : 2-3 semaines, 1 dev
- **Coût infra** : ~0€/mois au lancement (free tiers partout)
- **Coût IA** : ~16$/mois pour 1000 utilisateurs actifs
- **Risque principal** : qualité du prompt engineering + acquisition premiers utilisateurs
