"use client";

import Link from "next/link";
import { Sparkles, Play, MessageSquare, Search, Star, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/navbar";

/* ------------------------------------------------------------------ */
/*  Animation variants                                                 */
/* ------------------------------------------------------------------ */

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const features = [
  {
    icon: MessageSquare,
    title: "Reponds aux questions",
    description: "5 questions simples pour comprendre ton profil, tes competences et ce que tu recherches.",
  },
  {
    icon: Search,
    title: "Decouvre les offres",
    description: "L'IA genere des recherches LinkedIn optimisees et te presente les meilleures opportunites.",
  },
  {
    icon: Sparkles,
    title: "Genere tes messages",
    description: "Messages de prospection personnalises et prets a copier pour contacter les recruteurs.",
  },
];

const testimonials = [
  {
    quote: "Grace a LinkBoost, j'ai decroche mon stage en 2 semaines. Les messages generes sont vraiment pertinents et naturels.",
    name: "Sarah M.",
    title: "Etudiante en Marketing, Paris",
  },
  {
    quote: "J'ai envoye 15 messages et recu 8 reponses. Le taux de reponse est bien meilleur qu'avec mes anciens templates.",
    name: "Thomas D.",
    title: "Developpeur Junior, Lyon",
  },
  {
    quote: "Outil indispensable pour tout etudiant en recherche. Simple, rapide et gratuit. Que demander de plus ?",
    name: "Amira K.",
    title: "Etudiante en Finance, Bordeaux",
  },
];

const footerLinks = {
  Produit: [
    { label: "Fonctionnalites", href: "#features" },
    { label: "Tarifs", href: "#pricing" },
    { label: "Changelog", href: "#" },
  ],
  Ressources: [
    { label: "Blog", href: "#" },
    { label: "Guide LinkedIn", href: "#" },
    { label: "Support", href: "#" },
  ],
  Legal: [
    { label: "CGU", href: "#" },
    { label: "Confidentialite", href: "#" },
    { label: "Mentions legales", href: "#" },
  ],
};

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#09090B] text-[#FAFAFA] overflow-x-hidden">
      <Navbar />

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="min-h-screen flex items-center justify-center text-center px-6 pt-16">
        <motion.div
          className="max-w-3xl mx-auto flex flex-col items-center gap-8"
          initial="hidden"
          animate="visible"
          variants={stagger}
        >
          <motion.span
            variants={fadeUp}
            className="inline-block text-xs font-semibold uppercase tracking-widest text-violet-400 bg-violet-500/10 px-4 py-1.5 rounded-full"
          >
            Propulse par l'IA
          </motion.span>

          <motion.h1
            variants={fadeUp}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight"
          >
            Trouve ton prochain{" "}
            <span className="bg-gradient-to-r from-violet-500 to-blue-500 bg-clip-text text-transparent">
              stage ou emploi
            </span>{" "}
            sur LinkedIn
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="text-lg sm:text-xl text-[#A1A1AA] max-w-2xl"
          >
            Reponds a 5 questions. L'IA te trouve les meilleures offres et
            genere des messages personnalises.
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="flex flex-col sm:flex-row items-center gap-4"
          >
            <Button size="lg" asChild>
              <Link href="/login" className="gap-2">
                <Sparkles className="h-5 w-5" />
                Commencer gratuitement
              </Link>
            </Button>
            <Button variant="secondary" size="lg" asChild>
              <Link href="#features" className="gap-2">
                <Play className="h-5 w-5" />
                Voir la demo
              </Link>
            </Button>
          </motion.div>

          <motion.p
            variants={fadeUp}
            className="text-sm text-zinc-500"
          >
            +2 500 utilisateurs &middot; Gratuit &middot; Aucune carte requise
          </motion.p>
        </motion.div>
      </section>

      {/* ── Features ─────────────────────────────────────────────── */}
      <section id="features" className="py-24 lg:py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Comment ca marche
            </h2>
            <p className="text-[#A1A1AA] text-lg max-w-xl mx-auto">
              Trois etapes simples pour booster ta recherche d'emploi sur LinkedIn.
            </p>
          </motion.div>

          <motion.div
            className="grid gap-6 md:grid-cols-3"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={stagger}
          >
            {features.map((f, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="bg-zinc-950/50 border border-zinc-800 rounded-xl p-6 flex flex-col gap-4 hover:border-zinc-700 transition-colors"
              >
                <div className="h-12 w-12 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-400">
                  <f.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-white">{f.title}</h3>
                <p className="text-sm text-[#A1A1AA] leading-relaxed">
                  {f.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────────────── */}
      <section className="py-24 lg:py-32 px-6 bg-zinc-950/60">
        <div className="max-w-5xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Ce qu'ils en disent
            </h2>
            <p className="text-[#A1A1AA] text-lg max-w-xl mx-auto">
              Des centaines d'etudiants utilisent deja LinkBoost pour leur recherche.
            </p>
          </motion.div>

          <motion.div
            className="grid gap-6 md:grid-cols-3"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={stagger}
          >
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="bg-zinc-950/50 border border-zinc-800 rounded-xl p-6 flex flex-col gap-5"
              >
                <div className="flex gap-1 text-violet-400">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="text-sm text-zinc-300 italic leading-relaxed">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="mt-auto">
                  <p className="text-sm font-medium text-white">{t.name}</p>
                  <p className="text-xs text-zinc-500">{t.title}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────── */}
      <section className="py-24 lg:py-32 px-6">
        <motion.div
          className="max-w-3xl mx-auto text-center rounded-2xl border border-zinc-800 bg-gradient-to-b from-violet-500/5 to-transparent p-12 lg:p-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          variants={fadeUp}
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Pret a booster ta recherche ?
          </h2>
          <p className="text-[#A1A1AA] text-lg mb-8 max-w-lg mx-auto">
            Rejoins des milliers d'etudiants qui trouvent leur stage et emploi
            plus rapidement grace a l'IA.
          </p>
          <Button size="lg" asChild>
            <Link href="/login" className="gap-2">
              Commencer gratuitement
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        </motion.div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────── */}
      <footer className="border-t border-zinc-800 py-16 px-6">
        <div className="max-w-5xl mx-auto grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <span className="text-xl font-bold bg-gradient-to-r from-violet-500 to-blue-500 bg-clip-text text-transparent">
              LinkBoost
            </span>
            <p className="text-sm text-zinc-500 leading-relaxed">
              L'assistant IA qui t'aide a trouver ton prochain stage ou emploi
              sur LinkedIn.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading} className="flex flex-col gap-3">
              <h4 className="text-sm font-semibold text-white">{heading}</h4>
              {links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
          ))}
        </div>

        <div className="max-w-5xl mx-auto mt-12 pt-8 border-t border-zinc-800 text-center">
          <p className="text-xs text-zinc-600">
            &copy; {new Date().getFullYear()} LinkBoost. Tous droits reserves.
          </p>
        </div>
      </footer>
    </main>
  );
}
