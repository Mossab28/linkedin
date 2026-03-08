"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Copy,
  RefreshCw,
  Pencil,
  Loader2,
  ArrowLeft,
  Briefcase,
  Coffee,
  Zap,
  Send,
  MessageSquare,
  Reply,
  Clock,
  Heart,
  Building2,
  User,
  FileText,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type MessageType =
  | "candidature_spontanee"
  | "reponse_offre"
  | "relance"
  | "remerciement";

type ToneType = "professionnel" | "decontracte" | "enthousiaste" | "direct";

interface GenerationResult {
  content: string;
  tokensUsed: number;
  quotaRemaining: number;
}

// ---------------------------------------------------------------------------
// ChipSelect
// ---------------------------------------------------------------------------

interface ChipOption<T extends string> {
  value: T;
  label: string;
  icon: React.ElementType;
}

function ChipSelect<T extends string>({
  options,
  value,
  onChange,
  label,
}: {
  options: ChipOption<T>[];
  value: T;
  onChange: (v: T) => void;
  label: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm text-zinc-400">{label}</label>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const Icon = opt.icon;
          const isActive = value === opt.value;

          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className={cn(
                "inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition-all duration-200",
                "border",
                isActive
                  ? "border-violet-500 bg-violet-500/10 text-violet-400 shadow-sm shadow-violet-500/10"
                  : "border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-zinc-700 hover:text-zinc-300"
              )}
            >
              <Icon className="h-4 w-4" />
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const MESSAGE_TYPES: ChipOption<MessageType>[] = [
  { value: "candidature_spontanee", label: "Candidature spontanee", icon: Send },
  { value: "reponse_offre", label: "Reponse a offre", icon: Reply },
  { value: "relance", label: "Relance", icon: Clock },
  { value: "remerciement", label: "Remerciement", icon: Heart },
];

const TONE_OPTIONS: ChipOption<ToneType>[] = [
  { value: "professionnel", label: "Professionnel", icon: Briefcase },
  { value: "decontracte", label: "Decontracte", icon: Coffee },
  { value: "enthousiaste", label: "Enthousiaste", icon: Sparkles },
  { value: "direct", label: "Direct", icon: Zap },
];

// ---------------------------------------------------------------------------
// Typewriter hook
// ---------------------------------------------------------------------------

function useTypewriter(text: string, speed = 12) {
  const [displayed, setDisplayed] = React.useState("");
  const [done, setDone] = React.useState(false);

  React.useEffect(() => {
    if (!text) {
      setDisplayed("");
      setDone(false);
      return;
    }

    setDisplayed("");
    setDone(false);
    let i = 0;

    const interval = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(interval);
        setDone(true);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  return { displayed, done };
}

// ---------------------------------------------------------------------------
// Result card
// ---------------------------------------------------------------------------

function ResultCard({
  result,
  onCopy,
  onRegenerate,
  regenerating,
}: {
  result: GenerationResult;
  onCopy: () => void;
  onRegenerate: () => void;
  regenerating: boolean;
}) {
  const { displayed, done } = useTypewriter(result.content);
  const [editing, setEditing] = React.useState(false);
  const [editValue, setEditValue] = React.useState(result.content);
  const [copied, setCopied] = React.useState(false);

  // Sync editValue when result changes
  React.useEffect(() => {
    setEditValue(result.content);
    setEditing(false);
  }, [result.content]);

  function handleCopy() {
    const textToCopy = editing ? editValue : result.content;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    toast.success("Message copie !");
    setTimeout(() => setCopied(false), 2000);
    onCopy();
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", duration: 0.5, bounce: 0.15 }}
      className="rounded-xl border border-zinc-800 bg-zinc-900 p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-violet-400" />
          <span className="text-sm font-medium text-white">
            Message genere
          </span>
        </div>
        <Badge variant="accent">IA</Badge>
      </div>

      {/* Content */}
      {editing ? (
        <Textarea
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          className="min-h-[200px] mb-4"
        />
      ) : (
        <div className="rounded-lg bg-zinc-950/60 border border-zinc-800/50 p-4 mb-4">
          <p className="text-sm text-zinc-300 whitespace-pre-wrap leading-relaxed">
            {done ? result.content : displayed}
            {!done && (
              <span className="inline-block w-0.5 h-4 bg-violet-400 animate-pulse ml-0.5 align-middle" />
            )}
          </p>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="primary" size="sm" onClick={handleCopy}>
            {copied ? (
              <Check className="h-3.5 w-3.5" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
            {copied ? "Copie !" : "Copier"}
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={onRegenerate}
            loading={regenerating}
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Regenerer
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setEditing(!editing)}
          >
            <Pencil className="h-3.5 w-3.5" />
            {editing ? "Apercu" : "Modifier"}
          </Button>
        </div>

        <div className="flex items-center gap-3 text-xs text-zinc-500">
          <span>{result.tokensUsed} tokens</span>
          <span className="w-px h-3 bg-zinc-700" />
          <span>Quota: {result.quotaRemaining} restants</span>
        </div>
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Result skeleton
// ---------------------------------------------------------------------------

function ResultSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-zinc-800 bg-zinc-900 p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded bg-zinc-800 animate-pulse" />
          <div className="h-4 w-28 rounded bg-zinc-800 animate-pulse" />
        </div>
        <div className="h-5 w-10 rounded bg-zinc-800 animate-pulse" />
      </div>
      <div className="rounded-lg bg-zinc-950/60 border border-zinc-800/50 p-4 space-y-2.5">
        <div className="h-3 w-full rounded bg-zinc-800 animate-pulse" />
        <div className="h-3 w-11/12 rounded bg-zinc-800/70 animate-pulse" />
        <div className="h-3 w-5/6 rounded bg-zinc-800/50 animate-pulse" />
        <div className="h-3 w-4/6 rounded bg-zinc-800/30 animate-pulse" />
        <div className="h-3 w-3/6 rounded bg-zinc-800/20 animate-pulse" />
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------

export default function GenerateMessagePage() {
  const router = useRouter();

  // Form state
  const [company, setCompany] = React.useState("");
  const [position, setPosition] = React.useState("");
  const [contactName, setContactName] = React.useState("");
  const [context, setContext] = React.useState("");
  const [messageType, setMessageType] =
    React.useState<MessageType>("candidature_spontanee");
  const [tone, setTone] = React.useState<ToneType>("professionnel");

  // Generation state
  const [generating, setGenerating] = React.useState(false);
  const [regenerating, setRegenerating] = React.useState(false);
  const [result, setResult] = React.useState<GenerationResult | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  // ---- Generate ----
  async function handleGenerate(e?: React.FormEvent) {
    e?.preventDefault();

    if (!company.trim() || !position.trim()) {
      toast.error("Veuillez remplir l'entreprise et le poste");
      return;
    }

    const isRegen = !!result;
    if (isRegen) {
      setRegenerating(true);
    } else {
      setGenerating(true);
    }
    setError(null);

    try {
      const res = await fetch("/api/messages/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company: company.trim(),
          position: position.trim(),
          contactName: contactName.trim() || undefined,
          context: context.trim() || undefined,
          messageType,
          tone,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(
          errData?.error ?? "Erreur lors de la generation du message"
        );
      }

      const data = await res.json();

      setResult({
        content: data.content ?? data.message ?? "",
        tokensUsed: data.tokensUsed ?? 0,
        quotaRemaining: data.quotaRemaining ?? 0,
      });

      // Save to Supabase
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          await supabase.from("generated_messages").insert({
            user_id: user.id,
            type:
              MESSAGE_TYPES.find((t) => t.value === messageType)?.label ??
              messageType,
            tone:
              TONE_OPTIONS.find((t) => t.value === tone)?.label ?? tone,
            content: data.content ?? data.message ?? "",
            company: company.trim(),
            position: position.trim(),
            contact_name: contactName.trim() || null,
            is_favorite: false,
          });
        }
      } catch {
        // Silent -- saving is best-effort
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erreur inattendue";
      setError(message);
      toast.error(message);
    } finally {
      setGenerating(false);
      setRegenerating(false);
    }
  }

  function handleRegenerate() {
    handleGenerate();
  }

  function handleCopy() {
    // Already handled inside ResultCard, this is a hook for analytics, etc.
  }

  const canSubmit = company.trim().length > 0 && position.trim().length > 0;

  return (
    <div className="max-w-2xl mx-auto">
      {/* ---- Back button ---- */}
      <motion.button
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => router.push("/messages")}
        className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-300 transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Retour aux messages
      </motion.button>

      {/* ---- Header ---- */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-2xl font-bold text-white">Generer un message</h1>
        <p className="text-sm text-zinc-400 mt-1">
          Creez un message personnalise grace a l'IA pour vos prises de contact
          LinkedIn.
        </p>
      </motion.div>

      {/* ---- Form ---- */}
      <motion.form
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        onSubmit={handleGenerate}
        className="space-y-5 mb-8"
      >
        {/* Company */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm text-zinc-400">
            Entreprise cible <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <Input
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Ex: Google, Datadog, BNP Paribas..."
              className="pl-10"
              required
            />
          </div>
        </div>

        {/* Position */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm text-zinc-400">
            Poste vise <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <Input
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              placeholder="Ex: Stage Marketing Digital, Product Manager..."
              className="pl-10"
              required
            />
          </div>
        </div>

        {/* Contact name */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm text-zinc-400">
            Nom du contact{" "}
            <span className="text-zinc-600 font-normal">(optionnel)</span>
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <Input
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              placeholder="Ex: Marie Dupont"
              className="pl-10"
            />
          </div>
        </div>

        {/* Context */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm text-zinc-400">
            Contexte supplementaire{" "}
            <span className="text-zinc-600 font-normal">(optionnel)</span>
          </label>
          <div className="relative">
            <FileText className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
            <Textarea
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="Description de l'offre, infos sur l'entreprise, ce qui vous motive..."
              className="pl-10 min-h-[100px]"
            />
          </div>
        </div>

        {/* Message type chips */}
        <ChipSelect<MessageType>
          options={MESSAGE_TYPES}
          value={messageType}
          onChange={setMessageType}
          label="Type de message"
        />

        {/* Tone chips */}
        <ChipSelect<ToneType>
          options={TONE_OPTIONS}
          value={tone}
          onChange={setTone}
          label="Ton"
        />

        {/* Error inline */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-400"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Submit */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full"
          loading={generating}
          disabled={!canSubmit || generating}
        >
          {generating ? (
            "Generation en cours..."
          ) : (
            <>
              <Sparkles className="h-5 w-5" />
              Generer le message
            </>
          )}
        </Button>
      </motion.form>

      {/* ---- Result ---- */}
      <AnimatePresence mode="wait">
        {generating && !result ? (
          <ResultSkeleton key="skeleton" />
        ) : result ? (
          <ResultCard
            key="result"
            result={result}
            onCopy={handleCopy}
            onRegenerate={handleRegenerate}
            regenerating={regenerating}
          />
        ) : null}
      </AnimatePresence>
    </div>
  );
}
