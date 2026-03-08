"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap,
  Repeat,
  Briefcase,
  Megaphone,
  Palette,
  Code2,
  BarChart3,
  DollarSign,
  Handshake,
  Users,
  MessageCircle,
  Scale,
  Settings,
  Package,
  MoreHorizontal,
  Building2,
  Laptop,
  Globe,
  MapPin,
  BookOpen,
  Rocket,
  Award,
  Crown,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { ProgressBar } from "@/components/ui/progress-bar";
import { ChipSelect } from "@/components/ui/chip-select";

interface OnboardingData {
  searchType: string;
  domains: string[];
  location: string;
  locationCity: string;
  level: string;
  bio: string;
}

const TOTAL_STEPS = 5;

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 60 : -60,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -60 : 60,
    opacity: 0,
  }),
};

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [data, setData] = useState<OnboardingData>({
    searchType: "",
    domains: [],
    location: "",
    locationCity: "",
    level: "",
    bio: "",
  });

  const updateData = useCallback(
    (partial: Partial<OnboardingData>) => {
      setData((prev) => ({ ...prev, ...partial }));
    },
    []
  );

  const canContinue = (): boolean => {
    switch (step) {
      case 1:
        return !!data.searchType;
      case 2:
        return data.domains.length > 0;
      case 3:
        if (!data.location) return false;
        if (data.location === "city" && !data.locationCity.trim()) return false;
        return true;
      case 4:
        return !!data.level;
      case 5:
        return true; // bio is optional
      default:
        return false;
    }
  };

  const handleNext = async () => {
    if (!canContinue()) return;

    if (step === TOTAL_STEPS) {
      setSubmitting(true);
      try {
        const res = await fetch("/api/onboarding", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error("Erreur onboarding");
        router.push("/search");
      } catch {
        console.error("Erreur lors de la sauvegarde");
      } finally {
        setSubmitting(false);
      }
      return;
    }

    setDirection(1);
    setStep((s) => s + 1);
  };

  const handleBack = () => {
    setDirection(-1);
    setStep((s) => s - 1);
  };

  return (
    <div className="min-h-screen bg-[#09090B] flex flex-col">
      {/* Progress Bar */}
      <div className="w-full max-w-lg mx-auto px-6 pt-8">
        <ProgressBar value={step * 20} />
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-lg">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              {step === 1 && (
                <Step1
                  value={data.searchType}
                  onChange={(v) => updateData({ searchType: v })}
                />
              )}
              {step === 2 && (
                <Step2
                  value={data.domains}
                  onChange={(v) => updateData({ domains: v })}
                />
              )}
              {step === 3 && (
                <Step3
                  location={data.location}
                  locationCity={data.locationCity}
                  onLocationChange={(v) => updateData({ location: v })}
                  onCityChange={(v) => updateData({ locationCity: v })}
                />
              )}
              {step === 4 && (
                <Step4
                  value={data.level}
                  onChange={(v) => updateData({ level: v })}
                />
              )}
              {step === 5 && (
                <Step5
                  value={data.bio}
                  onChange={(v) => updateData({ bio: v })}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="w-full max-w-lg mx-auto px-6 pb-8">
        <div className="flex items-center justify-between gap-4">
          {step > 1 ? (
            <button
              onClick={handleBack}
              className={cn(
                "h-12 px-5 rounded-lg text-sm font-medium",
                "text-zinc-400 hover:text-white hover:bg-zinc-800/50",
                "transition-all duration-150 flex items-center gap-2"
              )}
            >
              <ArrowLeft className="w-4 h-4" />
              Retour
            </button>
          ) : (
            <div />
          )}

          <button
            onClick={handleNext}
            disabled={!canContinue() || submitting}
            className={cn(
              "h-12 px-6 rounded-lg text-sm font-medium text-white",
              "bg-violet-600 hover:bg-violet-500 active:scale-[0.98]",
              "transition-all duration-150 flex items-center gap-2",
              "focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-[#09090B]",
              "disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100"
            )}
          >
            {submitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : step === TOTAL_STEPS ? (
              <>
                Lancer la recherche
                <Sparkles className="w-4 h-4" />
              </>
            ) : (
              <>
                Continuer
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Step 1 : Tu cherches quoi ?                                       */
/* ------------------------------------------------------------------ */
function Step1({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const options = [
    {
      value: "stage",
      label: "Un stage",
      description: "Stage de fin d'etudes, decouverte...",
      icon: GraduationCap,
    },
    {
      value: "alternance",
      label: "Une alternance",
      description: "Contrat d'apprentissage ou pro",
      icon: Repeat,
    },
    {
      value: "emploi",
      label: "Un emploi",
      description: "CDI, CDD, freelance...",
      icon: Briefcase,
    },
  ];

  return (
    <div className="space-y-6">
      <StepHeader
        title="Tu cherches quoi ?"
        description="On adapte tout a ton besoin"
      />
      <div className="space-y-3">
        {options.map((opt) => (
          <ChipSelect
            key={opt.value}
            value={opt.value}
            label={opt.label}
            description={opt.description}
            icon={opt.icon}
            selected={value === opt.value}
            onSelect={() => onChange(opt.value)}
          />
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Step 2 : Dans quel domaine ?                                      */
/* ------------------------------------------------------------------ */
function Step2({
  value,
  onChange,
}: {
  value: string[];
  onChange: (v: string[]) => void;
}) {
  const options = [
    { value: "marketing", label: "Marketing", icon: Megaphone },
    { value: "design", label: "Design", icon: Palette },
    { value: "dev", label: "Developpement", icon: Code2 },
    { value: "data", label: "Data / IA", icon: BarChart3 },
    { value: "finance", label: "Finance", icon: DollarSign },
    { value: "commercial", label: "Commercial", icon: Handshake },
    { value: "rh", label: "RH", icon: Users },
    { value: "communication", label: "Communication", icon: MessageCircle },
    { value: "juridique", label: "Juridique", icon: Scale },
    { value: "operations", label: "Operations", icon: Settings },
    { value: "produit", label: "Produit", icon: Package },
    { value: "autre", label: "Autre", icon: MoreHorizontal },
  ];

  const toggle = (v: string) => {
    if (value.includes(v)) {
      onChange(value.filter((d) => d !== v));
    } else {
      onChange([...value, v]);
    }
  };

  return (
    <div className="space-y-6">
      <StepHeader
        title="Dans quel domaine ?"
        description="Selectionne un ou plusieurs domaines"
      />
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {options.map((opt) => (
          <ChipSelect
            key={opt.value}
            value={opt.value}
            label={opt.label}
            icon={opt.icon}
            selected={value.includes(opt.value)}
            onSelect={() => toggle(opt.value)}
            compact
          />
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Step 3 : Ou ?                                                     */
/* ------------------------------------------------------------------ */
function Step3({
  location,
  locationCity,
  onLocationChange,
  onCityChange,
}: {
  location: string;
  locationCity: string;
  onLocationChange: (v: string) => void;
  onCityChange: (v: string) => void;
}) {
  const options = [
    {
      value: "city",
      label: "Dans une ville",
      icon: Building2,
    },
    {
      value: "remote",
      label: "En remote",
      icon: Laptop,
    },
    {
      value: "any",
      label: "Pas de preference",
      icon: Globe,
    },
  ];

  return (
    <div className="space-y-6">
      <StepHeader title="Ou ?" description="Dis-nous ou tu veux bosser" />
      <div className="space-y-3">
        {options.map((opt) => (
          <ChipSelect
            key={opt.value}
            value={opt.value}
            label={opt.label}
            icon={opt.icon}
            selected={location === opt.value}
            onSelect={() => onLocationChange(opt.value)}
          />
        ))}
      </div>

      <AnimatePresence>
        {location === "city" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="relative mt-2">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="text"
                value={locationCity}
                onChange={(e) => onCityChange(e.target.value)}
                placeholder="Paris, Lyon, Bordeaux..."
                className={cn(
                  "w-full h-12 pl-11 pr-4 rounded-lg bg-zinc-900 border border-zinc-800",
                  "text-white text-sm placeholder:text-zinc-500",
                  "outline-none transition-colors duration-150",
                  "focus:ring-2 focus:ring-violet-500 focus:border-transparent",
                  "hover:border-zinc-700"
                )}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Step 4 : Quel niveau ?                                            */
/* ------------------------------------------------------------------ */
function Step4({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const options = [
    { value: "etudiant", label: "Etudiant", icon: BookOpen },
    { value: "junior", label: "Junior (0-3 ans)", icon: Rocket },
    { value: "confirme", label: "Confirme (3-7 ans)", icon: Award },
    { value: "senior", label: "Senior (7+ ans)", icon: Crown },
  ];

  return (
    <div className="space-y-6">
      <StepHeader
        title="Quel niveau ?"
        description="Aide-nous a cibler les bonnes offres"
      />
      <div className="space-y-3">
        {options.map((opt) => (
          <ChipSelect
            key={opt.value}
            value={opt.value}
            label={opt.label}
            icon={opt.icon}
            selected={value === opt.value}
            onSelect={() => onChange(opt.value)}
          />
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Step 5 : Un mot sur toi                                           */
/* ------------------------------------------------------------------ */
function Step5({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const maxLength = 500;

  return (
    <div className="space-y-6">
      <StepHeader
        title="Un mot sur toi"
        description="Optionnel -- aide l'IA a personnaliser tes messages"
      />
      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => {
            if (e.target.value.length <= maxLength) {
              onChange(e.target.value);
            }
          }}
          maxLength={maxLength}
          rows={5}
          placeholder="Etudiant en marketing digital a Paris, passionne par le growth hacking..."
          className={cn(
            "w-full px-4 py-3 rounded-lg bg-zinc-900 border border-zinc-800",
            "text-white text-sm placeholder:text-zinc-500 resize-none",
            "outline-none transition-colors duration-150",
            "focus:ring-2 focus:ring-violet-500 focus:border-transparent",
            "hover:border-zinc-700"
          )}
        />
        <span className="absolute bottom-3 right-3 text-xs text-zinc-500">
          {value.length}/{maxLength}
        </span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Shared StepHeader component                                       */
/* ------------------------------------------------------------------ */
function StepHeader({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="text-center mb-2">
      <h2 className="text-2xl font-bold text-white">{title}</h2>
      <p className="text-sm text-zinc-400 mt-1">{description}</p>
    </div>
  );
}
