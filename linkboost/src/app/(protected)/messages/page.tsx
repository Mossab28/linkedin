"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Copy,
  Star,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Sparkles,
  Building2,
  Briefcase,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface SavedMessage {
  id: string;
  type: string;
  tone: string;
  content: string;
  company: string;
  position: string;
  is_favorite: boolean;
  created_at: string;
}

// ---------------------------------------------------------------------------
// Message card
// ---------------------------------------------------------------------------

function MessageListCard({
  message,
  index,
  onToggleFavorite,
}: {
  message: SavedMessage;
  index: number;
  onToggleFavorite: (id: string) => void;
}) {
  const [expanded, setExpanded] = React.useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(message.content);
    toast.success("Message copie !");
  }

  const typeBadgeVariant =
    message.type === "Candidature spontanee"
      ? "accent"
      : message.type === "Reponse a offre"
      ? "success"
      : message.type === "Relance"
      ? "warning"
      : "default";

  const toneBadgeVariant = "default";

  const date = new Date(message.created_at);
  const formattedDate = date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.35 }}
    >
      <Card className="p-5">
        {/* Header row */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant={typeBadgeVariant}>{message.type}</Badge>
            <Badge variant={toneBadgeVariant}>{message.tone}</Badge>
            <span className="text-xs text-zinc-600">{formattedDate}</span>
          </div>
          <button
            onClick={() => onToggleFavorite(message.id)}
            className="p-1.5 rounded-lg hover:bg-zinc-800 transition-colors"
          >
            <Star
              className={cn(
                "h-4 w-4 transition-colors",
                message.is_favorite
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-zinc-600 hover:text-zinc-400"
              )}
            />
          </button>
        </div>

        {/* Company + position */}
        <div className="flex items-center gap-3 mb-3 text-xs text-zinc-500">
          <span className="inline-flex items-center gap-1">
            <Building2 className="h-3 w-3" />
            {message.company}
          </span>
          <span className="inline-flex items-center gap-1">
            <Briefcase className="h-3 w-3" />
            {message.position}
          </span>
        </div>

        {/* Message preview / full */}
        <div
          className={cn(
            "text-sm text-zinc-400 leading-relaxed mb-3 transition-all",
            !expanded && "line-clamp-2"
          )}
        >
          {message.content}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={handleCopy}>
            <Copy className="h-3.5 w-3.5" />
            Copier
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? (
              <>
                <ChevronUp className="h-3.5 w-3.5" />
                Reduire
              </>
            ) : (
              <>
                <ChevronDown className="h-3.5 w-3.5" />
                Voir complet
              </>
            )}
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Empty state
// ---------------------------------------------------------------------------

function EmptyMessages({ onGenerate }: { onGenerate: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-24 text-center"
    >
      <div className="mb-4 rounded-full bg-zinc-800/50 p-4">
        <MessageSquare className="h-8 w-8 text-zinc-500" />
      </div>
      <p className="text-lg font-medium text-zinc-300 mb-1">
        Aucun message genere
      </p>
      <p className="text-sm text-zinc-500 mb-6 max-w-sm">
        Generez votre premier message personnalise pour contacter des recruteurs
        et managers.
      </p>
      <Button variant="primary" size="sm" onClick={onGenerate}>
        <Sparkles className="h-4 w-4" />
        Generer mon premier message
      </Button>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Skeleton
// ---------------------------------------------------------------------------

function MessageSkeleton({ index }: { index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-5 space-y-3"
    >
      <div className="flex items-center gap-2">
        <div className="h-5 w-28 rounded bg-zinc-800 animate-pulse" />
        <div className="h-5 w-20 rounded bg-zinc-800/60 animate-pulse" />
        <div className="h-4 w-16 rounded bg-zinc-800/40 animate-pulse" />
      </div>
      <div className="flex items-center gap-3">
        <div className="h-3 w-24 rounded bg-zinc-800/50 animate-pulse" />
        <div className="h-3 w-32 rounded bg-zinc-800/50 animate-pulse" />
      </div>
      <div className="space-y-2">
        <div className="h-3 w-full rounded bg-zinc-800 animate-pulse" />
        <div className="h-3 w-3/4 rounded bg-zinc-800/60 animate-pulse" />
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------

export default function MessagesPage() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(true);
  const [messages, setMessages] = React.useState<SavedMessage[]>([]);

  // ---- Fetch messages ----
  React.useEffect(() => {
    async function load() {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
          .from("generated_messages")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setMessages((data as SavedMessage[]) ?? []);
      } catch (err) {
        console.error(err);
        toast.error("Erreur lors du chargement des messages");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  // ---- Toggle favorite ----
  async function handleToggleFavorite(id: string) {
    const msg = messages.find((m) => m.id === id);
    if (!msg) return;

    const newVal = !msg.is_favorite;

    // Optimistic update
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, is_favorite: newVal } : m))
    );

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("generated_messages")
        .update({ is_favorite: newVal })
        .eq("id", id);

      if (error) throw error;

      toast.success(newVal ? "Ajoute aux favoris" : "Retire des favoris");
    } catch {
      // Revert
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, is_favorite: !newVal } : m))
      );
      toast.error("Erreur lors de la mise a jour");
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* ---- Header ---- */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between mb-8"
      >
        <div>
          <h1 className="text-2xl font-bold text-white">Mes messages</h1>
          <p className="text-sm text-zinc-400 mt-1">
            {loading
              ? "Chargement..."
              : `${messages.length} message${messages.length !== 1 ? "s" : ""} genere${messages.length !== 1 ? "s" : ""}`}
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={() => router.push("/messages/generate")}
        >
          <Sparkles className="h-4 w-4" />
          Nouveau message
        </Button>
      </motion.div>

      {/* ---- Content ---- */}
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            className="space-y-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {Array.from({ length: 5 }).map((_, i) => (
              <MessageSkeleton key={i} index={i} />
            ))}
          </motion.div>
        ) : messages.length === 0 ? (
          <EmptyMessages
            key="empty"
            onGenerate={() => router.push("/messages/generate")}
          />
        ) : (
          <motion.div
            key="list"
            className="space-y-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {messages.map((msg, i) => (
              <MessageListCard
                key={msg.id}
                message={msg}
                index={i}
                onToggleFavorite={handleToggleFavorite}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
