"use client";

import * as React from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase,
  Users,
  MessageSquare,
  ExternalLink,
  Copy,
  RefreshCw,
  SearchX,
  Linkedin,
  Plus,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SearchDialog, type SearchCriteria } from "./search-dialog";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface SearchLink {
  id: string;
  label: string;
  url: string;
}

interface GeneratedMessage {
  id: string;
  type: "Candidature spontanee" | "Approche manager" | "Networking";
  content: string;
  loading?: boolean;
}

interface SearchProfile {
  keywords: string;
  location: string;
  contract_type: string;
  level: string;
  date_posted: string;
  remote: boolean;
  domain?: string;
  city?: string;
}

// ---------------------------------------------------------------------------
// Skeleton
// ---------------------------------------------------------------------------

function SkeletonCard({ index }: { index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-5"
    >
      <div className="flex items-start gap-4">
        <div className="h-10 w-10 rounded-lg bg-zinc-800 animate-pulse" />
        <div className="flex-1 space-y-3">
          <div className="h-4 w-3/4 rounded bg-zinc-800 animate-pulse" />
          <div className="h-3 w-1/2 rounded bg-zinc-800/60 animate-pulse" />
          <div className="flex gap-2 pt-1">
            <div className="h-8 w-32 rounded-lg bg-zinc-800 animate-pulse" />
            <div className="h-8 w-24 rounded-lg bg-zinc-800/60 animate-pulse" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function MessageSkeleton({ index }: { index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-5 space-y-3"
    >
      <div className="h-5 w-32 rounded bg-zinc-800 animate-pulse" />
      <div className="space-y-2 rounded-lg bg-zinc-900 p-4">
        <div className="h-3 w-full rounded bg-zinc-800 animate-pulse" />
        <div className="h-3 w-5/6 rounded bg-zinc-800/60 animate-pulse" />
        <div className="h-3 w-4/6 rounded bg-zinc-800/40 animate-pulse" />
      </div>
      <div className="flex gap-2">
        <div className="h-8 w-24 rounded-lg bg-zinc-800 animate-pulse" />
        <div className="h-8 w-28 rounded-lg bg-zinc-800/60 animate-pulse" />
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Empty state
// ---------------------------------------------------------------------------

function EmptyState({
  onAction,
  actionLabel,
  message,
}: {
  onAction: () => void;
  actionLabel: string;
  message: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-20 text-center"
    >
      <div className="mb-4 rounded-full bg-zinc-800/50 p-4">
        <SearchX className="h-8 w-8 text-zinc-500" />
      </div>
      <p className="text-lg font-medium text-zinc-300 mb-1">Aucun resultat</p>
      <p className="text-sm text-zinc-500 mb-6 max-w-sm">{message}</p>
      <Button variant="secondary" size="sm" onClick={onAction}>
        {actionLabel}
      </Button>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Link card
// ---------------------------------------------------------------------------

function LinkCard({ link, index }: { link: SearchLink; index: number }) {
  async function handleCopy() {
    await navigator.clipboard.writeText(link.url);
    toast.success("Lien copie dans le presse-papiers");
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.35 }}
    >
      <Card className="p-5 hover:border-violet-500/30 transition-all duration-300">
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-violet-500/10">
            <Linkedin className="h-5 w-5 text-violet-400" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-white truncate mb-3">
              {link.label}
            </h3>

            <div className="flex items-center gap-2">
              <Button
                variant="primary"
                size="sm"
                onClick={() => window.open(link.url, "_blank")}
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Ouvrir sur LinkedIn
              </Button>
              <Button variant="ghost" size="sm" onClick={handleCopy}>
                <Copy className="h-3.5 w-3.5" />
                Copier
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Message card
// ---------------------------------------------------------------------------

function MessageCard({
  message,
  index,
  onRegenerate,
}: {
  message: GeneratedMessage;
  index: number;
  onRegenerate: (id: string) => void;
}) {
  async function handleCopy() {
    await navigator.clipboard.writeText(message.content);
    toast.success("Message copie !");
  }

  const badgeVariant =
    message.type === "Candidature spontanee"
      ? "accent"
      : message.type === "Approche manager"
      ? "success"
      : "warning";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.35 }}
    >
      <Card className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <Badge variant={badgeVariant}>{message.type}</Badge>
        </div>

        {message.loading ? (
          <div className="space-y-2 rounded-lg bg-zinc-900 p-4">
            <div className="h-3 w-full rounded bg-zinc-800 animate-pulse" />
            <div className="h-3 w-5/6 rounded bg-zinc-800/60 animate-pulse" />
            <div className="h-3 w-3/6 rounded bg-zinc-800/40 animate-pulse" />
          </div>
        ) : (
          <div className="rounded-lg bg-zinc-900 p-4 mb-3">
            <p className="text-sm text-zinc-300 whitespace-pre-wrap leading-relaxed">
              {message.content}
            </p>
          </div>
        )}

        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={handleCopy}
            disabled={message.loading}
          >
            <Copy className="h-3.5 w-3.5" />
            Copier
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onRegenerate(message.id)}
            disabled={message.loading}
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Regenerer
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Tab trigger
// ---------------------------------------------------------------------------

function TabTrigger({
  value,
  icon: Icon,
  label,
  count,
}: {
  value: string;
  icon: React.ElementType;
  label: string;
  count?: number;
}) {
  return (
    <Tabs.Trigger
      value={value}
      className={cn(
        "group inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors rounded-lg",
        "text-zinc-500 hover:text-zinc-300",
        "data-[state=active]:bg-violet-500/10 data-[state=active]:text-violet-400"
      )}
    >
      <Icon className="h-4 w-4" />
      {label}
      {count !== undefined && (
        <span className="ml-1 text-xs text-zinc-600 group-data-[state=active]:text-violet-500">
          {count}
        </span>
      )}
    </Tabs.Trigger>
  );
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------

export default function SearchPage() {
  const [loading, setLoading] = React.useState(true);
  const [searchLoading, setSearchLoading] = React.useState(false);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [offers, setOffers] = React.useState<SearchLink[]>([]);
  const [contacts, setContacts] = React.useState<SearchLink[]>([]);
  const [messages, setMessages] = React.useState<GeneratedMessage[]>([]);
  const [profile, setProfile] = React.useState<SearchProfile | null>(null);
  const [activeTab, setActiveTab] = React.useState("offers");

  // ---- On mount, just stop loading and show empty state ----
  React.useEffect(() => {
    setLoading(false);
  }, []);

  // ---- Fetch results from API ----
  async function fetchResults(criteria: SearchCriteria) {
    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(criteria),
      });

      if (!res.ok) throw new Error("Search API error");

      const data = await res.json();

      setOffers(data.offers ?? []);
      setContacts(data.contacts ?? []);
      setMessages(data.messages ?? []);
    } catch (err) {
      console.error("Search error:", err);
      toast.error("Erreur lors de la recherche");
    }
  }

  // ---- Handle new search from dialog ----
  async function handleSearch(criteria: SearchCriteria) {
    setSearchLoading(true);
    setLoading(true);
    setDialogOpen(false);

    await fetchResults(criteria);

    setProfile({
      keywords: criteria.keywords,
      location: criteria.location,
      contract_type: criteria.contractType,
      level: criteria.level,
      date_posted: criteria.datePosted,
      remote: criteria.remote,
      domain: criteria.keywords,
      city: criteria.location,
    });

    setSearchLoading(false);
    setLoading(false);
  }

  // ---- Regenerate a message ----
  async function handleRegenerate(id: string) {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, loading: true } : m))
    );

    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          regenerateMessageId: id,
          keywords: profile?.keywords ?? "",
          location: profile?.location ?? "",
        }),
      });

      if (!res.ok) throw new Error("Regenerate error");

      const data = await res.json();
      const newMsg = data.message;

      setMessages((prev) =>
        prev.map((m) =>
          m.id === id
            ? { ...m, content: newMsg?.content ?? m.content, loading: false }
            : m
        )
      );

      toast.success("Message regenere");
    } catch {
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, loading: false } : m))
      );
      toast.error("Erreur lors de la regeneration");
    }
  }

  // ---- Computed ----
  const totalLinks = offers.length + contacts.length;
  const domain = profile?.domain || profile?.keywords || "votre domaine";
  const city = profile?.city || profile?.location || "votre ville";

  return (
    <div className="max-w-4xl mx-auto">
      {/* ---- Header ---- */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between mb-8"
      >
        <div>
          <h1 className="text-2xl font-bold text-white">Resultats</h1>
          <p className="text-sm text-zinc-400 mt-1">
            {loading
              ? "Chargement..."
              : `${totalLinks} liens generes pour ${domain} a ${city}`}
          </p>
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setDialogOpen(true)}
        >
          <Plus className="h-4 w-4" />
          Nouvelle recherche
        </Button>
      </motion.div>

      {/* ---- Tabs ---- */}
      <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
        <Tabs.List className="flex items-center gap-1 mb-6 p-1 bg-zinc-900/50 rounded-xl border border-zinc-800 w-fit">
          <TabTrigger
            value="offers"
            icon={Briefcase}
            label="Offres"
            count={offers.length}
          />
          <TabTrigger
            value="contacts"
            icon={Users}
            label="Contacts"
            count={contacts.length}
          />
          <TabTrigger
            value="messages"
            icon={MessageSquare}
            label="Messages"
            count={messages.length}
          />
        </Tabs.List>

        {/* ---- Offers ---- */}
        <Tabs.Content value="offers">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                className="space-y-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {Array.from({ length: 6 }).map((_, i) => (
                  <SkeletonCard key={i} index={i} />
                ))}
              </motion.div>
            ) : offers.length === 0 ? (
              <EmptyState
                key="empty"
                message="Aucune offre trouvee. Modifiez vos criteres pour elargir la recherche."
                actionLabel="Modifier mes criteres"
                onAction={() => setDialogOpen(true)}
              />
            ) : (
              <motion.div
                key="results"
                className="space-y-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {offers.map((link, i) => (
                  <LinkCard key={link.id} link={link} index={i} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </Tabs.Content>

        {/* ---- Contacts ---- */}
        <Tabs.Content value="contacts">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                className="space-y-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {Array.from({ length: 6 }).map((_, i) => (
                  <SkeletonCard key={i} index={i} />
                ))}
              </motion.div>
            ) : contacts.length === 0 ? (
              <EmptyState
                key="empty"
                message="Aucun contact trouve. Essayez d'autres mots-cles ou localisation."
                actionLabel="Modifier mes criteres"
                onAction={() => setDialogOpen(true)}
              />
            ) : (
              <motion.div
                key="results"
                className="space-y-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {contacts.map((link, i) => (
                  <LinkCard key={link.id} link={link} index={i} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </Tabs.Content>

        {/* ---- Messages ---- */}
        <Tabs.Content value="messages">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                className="space-y-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {Array.from({ length: 3 }).map((_, i) => (
                  <MessageSkeleton key={i} index={i} />
                ))}
              </motion.div>
            ) : messages.length === 0 ? (
              <EmptyState
                key="empty"
                message="Aucun message genere. Lancez une recherche pour obtenir des messages personnalises."
                actionLabel="Modifier mes criteres"
                onAction={() => setDialogOpen(true)}
              />
            ) : (
              <motion.div
                key="results"
                className="space-y-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {messages.map((msg, i) => (
                  <MessageCard
                    key={msg.id}
                    message={msg}
                    index={i}
                    onRegenerate={handleRegenerate}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </Tabs.Content>
      </Tabs.Root>

      {/* ---- Search Dialog ---- */}
      <AnimatePresence>
        {dialogOpen && (
          <SearchDialog
            open={dialogOpen}
            onOpenChange={setDialogOpen}
            onSearch={handleSearch}
            loading={searchLoading}
            defaultValues={
              profile
                ? {
                    keywords: profile.keywords,
                    location: profile.location,
                    contractType: profile.contract_type,
                    level: profile.level,
                    datePosted: profile.date_posted,
                    remote: profile.remote,
                  }
                : undefined
            }
          />
        )}
      </AnimatePresence>
    </div>
  );
}
