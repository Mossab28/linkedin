"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Send,
  Eye,
  MessageSquare,
  Clock,
  Search,
  Sparkles,
  Plus,
  MoreHorizontal,
  ExternalLink,
  RefreshCw,
  Trash2,
  PenLine,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { StatCard } from "@/components/ui/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { AddApplicationDialog } from "./add-application-dialog";

interface DashboardStats {
  total: number;
  response_rate: number;
  by_status: {
    sent?: number;
    pending?: number;
    interview?: number;
    accepted?: number;
    rejected?: number;
  };
}

interface Application {
  id: string;
  company: string;
  position: string;
  status: "sent" | "pending" | "interview" | "accepted" | "rejected";
  applied_at: string;
  offer_url?: string;
}

const statusConfig: Record<
  string,
  { label: string; className: string }
> = {
  sent: {
    label: "Envoyee",
    className: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  },
  pending: {
    label: "En attente",
    className: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  },
  interview: {
    label: "Entretien",
    className: "bg-violet-500/10 text-violet-400 border-violet-500/20",
  },
  accepted: {
    label: "Acceptee",
    className: "bg-green-500/10 text-green-400 border-green-500/20",
  },
  rejected: {
    label: "Refusee",
    className: "bg-red-500/10 text-red-400 border-red-500/20",
  },
};

const filterOptions = [
  { value: "all", label: "Toutes" },
  { value: "sent", label: "Envoyees" },
  { value: "pending", label: "En attente" },
  { value: "interview", label: "Entretien" },
  { value: "accepted", label: "Acceptees" },
  { value: "rejected", label: "Refusees" },
];

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
  });
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/dashboard/stats");
      if (!res.ok) throw new Error("Erreur lors du chargement");
      const data = await res.json();
      setStats(data.stats);
      setApplications(data.recent_applications || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredApplications =
    statusFilter === "all"
      ? applications
      : applications.filter((a) => a.status === statusFilter);

  const handleDeleteApplication = async (id: string) => {
    try {
      const res = await fetch(`/api/applications/${id}`, { method: "DELETE" });
      if (res.ok) {
        setApplications((prev) => prev.filter((a) => a.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/applications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setApplications((prev) =>
          prev.map((a) =>
            a.id === id ? { ...a, status: newStatus as Application["status"] } : a
          )
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleFollowUp = async (id: string) => {
    try {
      await fetch(`/api/applications/${id}/follow-up`, { method: "POST" });
    } catch (err) {
      console.error(err);
    }
  };

  // --- Loading State ---
  if (loading) {
    return (
      <div className="space-y-8 p-6">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-72" />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
        <Card className="bg-zinc-950 border-zinc-800">
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full rounded-lg" />
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  // --- Empty State ---
  if (!loading && (!applications || applications.length === 0) && stats?.total === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-4"
        >
          <div className="mx-auto w-16 h-16 rounded-2xl bg-zinc-800 flex items-center justify-center">
            <Send className="w-8 h-8 text-zinc-500" />
          </div>
          <h2 className="text-xl font-semibold text-zinc-100">
            Pas encore de candidatures
          </h2>
          <p className="text-sm text-zinc-400 max-w-md">
            Commence par rechercher des offres pour envoyer tes premieres
            candidatures et suivre leur avancement ici.
          </p>
          <Button asChild className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white">
            <Link href="/search">
              <Search className="w-4 h-4 mr-2" />
              Decouvrir les offres
            </Link>
          </Button>
        </motion.div>
      </div>
    );
  }

  // --- Main Dashboard ---
  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-2xl font-bold text-zinc-100">Dashboard</h1>
        <p className="text-sm text-zinc-400 mt-1">
          Vue d&apos;ensemble de tes candidatures
        </p>
      </motion.div>

      {/* Stats */}
      <motion.div
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <StatCard
          icon={Send}
          label="Envoyees"
          value={stats?.by_status.sent || 0}
          color="accent"
        />
        <StatCard
          icon={Eye}
          label="Entretiens"
          value={stats?.by_status.interview || 0}
          color="blue"
        />
        <StatCard
          icon={MessageSquare}
          label="Reponses"
          value={stats?.response_rate + "%"}
          color="success"
        />
        <StatCard
          icon={Clock}
          label="En attente"
          value={stats?.by_status.pending || 0}
          color="warning"
        />
      </motion.div>

      {/* Recent Applications */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <Card className="bg-zinc-950 border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-lg font-semibold text-zinc-100">
              Candidatures recentes
            </CardTitle>
            <div className="flex items-center gap-3">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px] h-8 text-xs bg-zinc-900 border-zinc-800 text-zinc-300">
                  <SelectValue placeholder="Filtrer" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-800">
                  {filterOptions.map((opt) => (
                    <SelectItem
                      key={opt.value}
                      value={opt.value}
                      className="text-zinc-300 text-xs focus:bg-zinc-800 focus:text-zinc-100"
                    >
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="text-zinc-400 hover:text-zinc-100"
              >
                <Link href="/dashboard/applications">Voir tout</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {filteredApplications.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-zinc-500">
                Aucune candidature pour ce filtre.
              </div>
            ) : (
              <div className="divide-y divide-zinc-800">
                {filteredApplications.slice(0, 10).map((app) => (
                  <div
                    key={app.id}
                    className="flex items-center gap-4 px-4 py-3 hover:bg-zinc-900/50 transition-colors"
                  >
                    {/* Company Initials */}
                    <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center text-sm font-bold text-zinc-300 shrink-0">
                      {getInitials(app.company)}
                    </div>

                    {/* Position + Company */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-zinc-100 truncate">
                        {app.position}
                      </p>
                      <p className="text-xs text-zinc-400 truncate">
                        {app.company}
                      </p>
                    </div>

                    {/* Date */}
                    <span className="text-xs text-zinc-500 hidden sm:block shrink-0">
                      {formatDate(app.applied_at)}
                    </span>

                    {/* Status Badge */}
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-xs shrink-0",
                        statusConfig[app.status]?.className
                      )}
                    >
                      {statusConfig[app.status]?.label}
                    </Badge>

                    {/* Actions Dropdown */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-zinc-500 hover:text-zinc-300"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="bg-zinc-900 border-zinc-800 text-zinc-300"
                      >
                        {app.offer_url && (
                          <DropdownMenuItem
                            className="text-xs focus:bg-zinc-800 focus:text-zinc-100 cursor-pointer"
                            onClick={() => window.open(app.offer_url, "_blank")}
                          >
                            <ExternalLink className="w-3.5 h-3.5 mr-2" />
                            Voir l&apos;offre
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          className="text-xs focus:bg-zinc-800 focus:text-zinc-100 cursor-pointer"
                          onClick={() =>
                            handleStatusChange(
                              app.id,
                              app.status === "sent" ? "interview" : "sent"
                            )
                          }
                        >
                          <PenLine className="w-3.5 h-3.5 mr-2" />
                          Modifier le statut
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-xs focus:bg-zinc-800 focus:text-zinc-100 cursor-pointer"
                          onClick={() => handleFollowUp(app.id)}
                        >
                          <RefreshCw className="w-3.5 h-3.5 mr-2" />
                          Relancer
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-xs text-red-400 focus:bg-red-500/10 focus:text-red-400 cursor-pointer"
                          onClick={() => handleDeleteApplication(app.id)}
                        >
                          <Trash2 className="w-3.5 h-3.5 mr-2" />
                          Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <h2 className="text-sm font-medium text-zinc-400 mb-3">
          Actions rapides
        </h2>
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="secondary"
            asChild
            className="bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 justify-start h-12"
          >
            <Link href="/search">
              <Search className="w-4 h-4 mr-2" />
              Nouvelle recherche
            </Link>
          </Button>
          <Button
            variant="secondary"
            asChild
            className="bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 justify-start h-12"
          >
            <Link href="/messages/generate">
              <Sparkles className="w-4 h-4 mr-2" />
              Generer un message
            </Link>
          </Button>
          <Button
            variant="secondary"
            onClick={() => setDialogOpen(true)}
            className="bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 justify-start h-12"
          >
            <Plus className="w-4 h-4 mr-2" />
            Ajouter une candidature
          </Button>
          <Button
            variant="secondary"
            asChild
            className="bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 justify-start h-12"
          >
            <Link href="/messages">
              <MessageSquare className="w-4 h-4 mr-2" />
              Voir mes messages
            </Link>
          </Button>
        </div>
      </motion.div>

      {/* Add Application Dialog */}
      <AddApplicationDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSuccess={() => {
          setDialogOpen(false);
          fetchData();
        }}
      />
    </div>
  );
}
