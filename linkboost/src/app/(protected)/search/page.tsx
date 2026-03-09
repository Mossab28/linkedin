"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase,
  ExternalLink,
  SearchX,
  MapPin,
  Clock,
  Plus,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Wifi,
  DollarSign,
  Building2,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/button";
import { SearchDialog, type SearchCriteria } from "./search-dialog";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Job {
  id: string;
  title: string;
  company: string;
  logo: string | null;
  location: string;
  description: string;
  url: string;
  type: string | null;
  postedAt: string;
  salary: string | null;
  remote: boolean;
}

interface SearchProfile {
  keywords: string;
  location: string;
  contractType: string;
  level: string;
  datePosted: string;
  remote: boolean;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function timeAgo(dateStr: string): string {
  if (!dateStr) return "";
  const now = Date.now();
  const posted = new Date(dateStr).getTime();
  const diffMs = now - posted;
  const diffH = Math.floor(diffMs / 3_600_000);
  if (diffH < 1) return "A l'instant";
  if (diffH < 24) return `Il y a ${diffH}h`;
  const diffD = Math.floor(diffH / 24);
  if (diffD === 1) return "Hier";
  if (diffD < 7) return `Il y a ${diffD}j`;
  const diffW = Math.floor(diffD / 7);
  if (diffW < 5) return `Il y a ${diffW} sem.`;
  return `Il y a ${Math.floor(diffD / 30)} mois`;
}

function getInitials(name: string): string {
  return name
    .split(/[\s&]+/)
    .map((w) => w[0])
    .filter(Boolean)
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// ---------------------------------------------------------------------------
// Skeleton
// ---------------------------------------------------------------------------

function SkeletonCard({ index }: { index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.35 }}
      className="rounded-2xl border border-zinc-800/70 bg-zinc-950/50 p-5 sm:p-6"
    >
      <div className="flex gap-4">
        <div className="h-12 w-12 rounded-xl bg-zinc-800 animate-pulse shrink-0" />
        <div className="flex-1 space-y-3">
          <div className="h-4 w-3/4 rounded-lg bg-zinc-800 animate-pulse" />
          <div className="h-3 w-1/2 rounded-lg bg-zinc-800/50 animate-pulse" />
          <div className="h-3 w-full rounded-lg bg-zinc-800/30 animate-pulse" />
          <div className="flex gap-2 pt-1">
            <div className="h-6 w-16 rounded-full bg-zinc-800/50 animate-pulse" />
            <div className="h-6 w-20 rounded-full bg-zinc-800/40 animate-pulse" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Empty state
// ---------------------------------------------------------------------------

function EmptyState({ onAction }: { onAction: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-24 text-center"
    >
      <div className="mb-5 rounded-2xl bg-zinc-800/40 p-5">
        <SearchX className="h-8 w-8 text-zinc-500" />
      </div>
      <p className="text-lg font-semibold text-zinc-200 mb-1">Aucune offre trouvee</p>
      <p className="text-sm text-zinc-500 mb-6 max-w-sm">
        Essaie d'autres mots-cles ou elargis ta zone geographique.
      </p>
      <Button variant="secondary" size="sm" onClick={onAction}>
        Modifier mes criteres
      </Button>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Job card
// ---------------------------------------------------------------------------

function JobCard({ job, index }: { job: Job; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.35, ease: "easeOut" }}
      className="group"
    >
      <div
        className={cn(
          "relative rounded-2xl border border-zinc-800/70 bg-zinc-950/50 p-5 sm:p-6",
          "transition-all duration-300 ease-out",
          "hover:border-violet-500/30 hover:bg-zinc-950/80",
          "hover:shadow-lg hover:shadow-violet-500/[0.03]"
        )}
      >
        <div className="flex gap-4">
          {/* Company logo */}
          <div className="shrink-0">
            {job.logo ? (
              <img
                src={job.logo}
                alt={job.company}
                className="h-12 w-12 rounded-xl object-contain bg-white p-1.5 ring-1 ring-zinc-800/50"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                  (e.target as HTMLImageElement).nextElementSibling?.classList.remove("hidden");
                }}
              />
            ) : null}
            <div
              className={cn(
                "h-12 w-12 rounded-xl bg-gradient-to-br from-violet-500/20 to-blue-500/20 ring-1 ring-violet-500/20",
                "flex items-center justify-center text-sm font-bold text-violet-300",
                job.logo ? "hidden" : ""
              )}
            >
              {getInitials(job.company)}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Title + company */}
            <h3 className="text-[15px] font-semibold text-white leading-snug mb-0.5 line-clamp-1">
              {job.title}
            </h3>
            <div className="flex items-center gap-2 text-sm text-zinc-400 mb-2">
              <Building2 className="h-3.5 w-3.5 shrink-0 text-zinc-500" />
              <span className="truncate">{job.company}</span>
            </div>

            {/* Description snippet */}
            <p className="text-sm text-zinc-500 leading-relaxed mb-3 line-clamp-2">
              {job.description}
            </p>

            {/* Meta badges */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {job.location && (
                <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full border bg-emerald-500/8 text-emerald-400 border-emerald-500/15">
                  <MapPin className="h-3 w-3" />
                  {job.location}
                </span>
              )}
              {job.type && (
                <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full border bg-violet-500/8 text-violet-400 border-violet-500/15">
                  <Briefcase className="h-3 w-3" />
                  {job.type}
                </span>
              )}
              {job.remote && (
                <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full border bg-blue-500/8 text-blue-400 border-blue-500/15">
                  <Wifi className="h-3 w-3" />
                  Remote
                </span>
              )}
              {job.salary && (
                <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full border bg-amber-500/8 text-amber-400 border-amber-500/15">
                  <DollarSign className="h-3 w-3" />
                  {job.salary}
                </span>
              )}
              {job.postedAt && (
                <span className="inline-flex items-center gap-1 text-xs text-zinc-500">
                  <Clock className="h-3 w-3" />
                  {timeAgo(job.postedAt)}
                </span>
              )}
            </div>

            {/* Actions */}
            <button
              onClick={() => window.open(job.url, "_blank")}
              className={cn(
                "inline-flex items-center gap-2 h-9 px-4 rounded-lg text-sm font-medium",
                "text-white bg-violet-600 hover:bg-violet-500 active:bg-violet-700",
                "transition-all duration-200 active:scale-[0.97]"
              )}
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Postuler
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Pagination
// ---------------------------------------------------------------------------

function Pagination({
  page,
  totalPages,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  onPageChange: (p: number) => void;
}) {
  if (totalPages <= 1) return null;

  const maxVisible = 5;
  const half = Math.floor(maxVisible / 2);
  let start = Math.max(1, page - half);
  const end = Math.min(totalPages, start + maxVisible - 1);
  if (end - start + 1 < maxVisible) start = Math.max(1, end - maxVisible + 1);

  const pages: number[] = [];
  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center justify-center gap-1.5 pt-8 pb-4"
    >
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className="h-9 w-9 rounded-lg flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors disabled:opacity-30 disabled:pointer-events-none"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {start > 1 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className="h-9 w-9 rounded-lg flex items-center justify-center text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            1
          </button>
          {start > 2 && <span className="text-zinc-600 text-sm px-1">...</span>}
        </>
      )}

      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={cn(
            "h-9 w-9 rounded-lg flex items-center justify-center text-sm font-medium transition-colors",
            p === page
              ? "bg-violet-600 text-white"
              : "text-zinc-400 hover:text-white hover:bg-zinc-800"
          )}
        >
          {p}
        </button>
      ))}

      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span className="text-zinc-600 text-sm px-1">...</span>}
          <button
            onClick={() => onPageChange(totalPages)}
            className="h-9 w-9 rounded-lg flex items-center justify-center text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            {totalPages}
          </button>
        </>
      )}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className="h-9 w-9 rounded-lg flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors disabled:opacity-30 disabled:pointer-events-none"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------

export default function SearchPage() {
  return (
    <React.Suspense
      fallback={
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <SearchPageInner />
    </React.Suspense>
  );
}

function SearchPageInner() {
  const [loading, setLoading] = React.useState(true);
  const [searchLoading, setSearchLoading] = React.useState(false);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [jobs, setJobs] = React.useState<Job[]>([]);
  const [total, setTotal] = React.useState(0);
  const [page, setPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [profile, setProfile] = React.useState<SearchProfile | null>(null);
  const [error, setError] = React.useState("");

  const searchParams = useSearchParams();

  // ---- On mount, auto-search if URL has query params ----
  React.useEffect(() => {
    const q = searchParams.get("q");
    if (!q) {
      setLoading(false);
      return;
    }

    const loc = searchParams.get("loc") || "";
    const type = searchParams.get("type") || "";

    const criteria: SearchCriteria = {
      keywords: q,
      location: loc,
      contractType: type,
      level: "",
      datePosted: "",
      remote: false,
    };

    setProfile(criteria);

    (async () => {
      await fetchResults(criteria, 1);
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---- Fetch results from API ----
  async function fetchResults(criteria: SearchCriteria, pg: number) {
    setError("");
    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...criteria, page: pg }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Erreur lors de la recherche");
        setJobs([]);
        return;
      }

      setJobs(data.jobs ?? []);
      setTotal(data.total ?? 0);
      setPage(data.page ?? 1);
      setTotalPages(data.totalPages ?? 1);
    } catch (err) {
      console.error("Search error:", err);
      setError("Erreur reseau");
      toast.error("Erreur lors de la recherche");
    }
  }

  // ---- Handle new search from dialog ----
  async function handleSearch(criteria: SearchCriteria) {
    setSearchLoading(true);
    setLoading(true);
    setDialogOpen(false);
    setProfile(criteria);
    setPage(1);

    await fetchResults(criteria, 1);

    setSearchLoading(false);
    setLoading(false);
  }

  // ---- Handle page change ----
  async function handlePageChange(newPage: number) {
    if (!profile || newPage === page) return;
    setLoading(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
    await fetchResults(profile, newPage);
    setLoading(false);
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* ---- Header ---- */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between mb-8"
      >
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <Sparkles className="h-5 w-5 text-violet-400" />
            <h1 className="text-2xl font-bold text-white">Offres</h1>
          </div>
          <p className="text-sm text-zinc-400 mt-1">
            {loading
              ? "Recherche en cours..."
              : error
              ? error
              : total > 0
              ? `${total.toLocaleString("fr-FR")} resultats${profile?.keywords ? ` pour "${profile.keywords}"` : ""}${profile?.location ? ` a ${profile.location}` : ""}`
              : "Lance une recherche pour voir les offres"}
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

      {/* ---- Results ---- */}
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} index={i} />
            ))}
          </motion.div>
        ) : error && jobs.length === 0 ? (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-24 text-center"
          >
            <div className="mb-5 rounded-2xl bg-red-500/10 p-5">
              <SearchX className="h-8 w-8 text-red-400" />
            </div>
            <p className="text-lg font-semibold text-zinc-200 mb-1">Erreur</p>
            <p className="text-sm text-zinc-500 mb-6 max-w-sm">{error}</p>
            <Button variant="secondary" size="sm" onClick={() => setDialogOpen(true)}>
              Reessayer
            </Button>
          </motion.div>
        ) : jobs.length === 0 ? (
          <EmptyState key="empty" onAction={() => setDialogOpen(true)} />
        ) : (
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="space-y-4">
              {jobs.map((job, i) => (
                <JobCard key={job.id} job={job} index={i} />
              ))}
            </div>

            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ---- Search Dialog ---- */}
      <AnimatePresence>
        {dialogOpen && (
          <SearchDialog
            open={dialogOpen}
            onOpenChange={setDialogOpen}
            onSearch={handleSearch}
            loading={searchLoading}
            defaultValues={profile ? profile : undefined}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
