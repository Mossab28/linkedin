"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Loader2, Save, Trash2, AlertTriangle, User } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

interface UserProfile {
  full_name: string;
  current_title: string;
  education: string;
  bio: string;
  linkedin_url: string;
  avatar_url?: string;
}

interface UserPreferences {
  default_tone: string;
  follow_up_notifications: boolean;
}

interface UserPlan {
  name: string;
  messages_used: number;
  messages_limit: number;
}

const toneOptions = [
  { value: "professional", label: "Professionnel" },
  { value: "casual", label: "Decontracte" },
  { value: "enthusiastic", label: "Enthousiaste" },
  { value: "direct", label: "Direct" },
];

export default function SettingsPage() {
  const { toast } = useToast();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [profile, setProfile] = useState<UserProfile>({
    full_name: "",
    current_title: "",
    education: "",
    bio: "",
    linkedin_url: "",
  });

  const [preferences, setPreferences] = useState<UserPreferences>({
    default_tone: "professional",
    follow_up_notifications: true,
  });

  const [plan, setPlan] = useState<UserPlan>({
    name: "Gratuit",
    messages_used: 0,
    messages_limit: 10,
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/user/profile");
        if (res.ok) {
          const data = await res.json();
          if (data.profile) setProfile(data.profile);
          if (data.preferences) setPreferences(data.preferences);
          if (data.plan) setPlan(data.plan);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const updateProfile = (field: keyof UserProfile, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile, preferences }),
      });

      if (!res.ok) throw new Error("Erreur");

      toast({
        title: "Profil sauvegarde",
        description: "Tes modifications ont ete enregistrees.",
      });
    } catch (err) {
      console.error(err);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder. Reessaye.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setDeleting(true);
      const res = await fetch("/api/user/account", { method: "DELETE" });
      if (!res.ok) throw new Error("Erreur");
      router.push("/");
    } catch (err) {
      console.error(err);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le compte.",
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  const getInitials = (name: string) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-6 h-6 animate-spin text-zinc-500" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-2xl font-bold text-zinc-100">Parametres</h1>
        <p className="text-sm text-zinc-400 mt-1">
          Gere ton profil et tes preferences
        </p>
      </motion.div>

      {/* Profile Section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <Card className="bg-zinc-950 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-zinc-100">
              Profil
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Avatar */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center text-lg font-bold text-zinc-300 border-2 border-zinc-700">
                {profile.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt="Avatar"
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  getInitials(profile.full_name)
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-100">
                  {profile.full_name || "Ton nom"}
                </p>
                <p className="text-xs text-zinc-500">
                  {profile.current_title || "Titre actuel"}
                </p>
              </div>
            </div>

            {/* Full Name */}
            <div className="space-y-1.5">
              <Label htmlFor="full_name" className="text-sm text-zinc-300">
                Nom complet
              </Label>
              <Input
                id="full_name"
                placeholder="Ton nom complet"
                value={profile.full_name}
                onChange={(e) => updateProfile("full_name", e.target.value)}
                className="bg-zinc-900 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-[#8B5CF6]"
              />
            </div>

            {/* Current Title */}
            <div className="space-y-1.5">
              <Label htmlFor="current_title" className="text-sm text-zinc-300">
                Titre actuel
              </Label>
              <Input
                id="current_title"
                placeholder="Ex: Product Designer"
                value={profile.current_title}
                onChange={(e) => updateProfile("current_title", e.target.value)}
                className="bg-zinc-900 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-[#8B5CF6]"
              />
            </div>

            {/* Education */}
            <div className="space-y-1.5">
              <Label htmlFor="education" className="text-sm text-zinc-300">
                Formation
              </Label>
              <Input
                id="education"
                placeholder="Ex: Master UX Design - Universite XYZ"
                value={profile.education}
                onChange={(e) => updateProfile("education", e.target.value)}
                className="bg-zinc-900 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-[#8B5CF6]"
              />
            </div>

            {/* Bio */}
            <div className="space-y-1.5">
              <Label htmlFor="bio" className="text-sm text-zinc-300">
                Bio
              </Label>
              <Textarea
                id="bio"
                placeholder="Quelques mots sur toi..."
                value={profile.bio}
                onChange={(e) => updateProfile("bio", e.target.value)}
                rows={3}
                className="bg-zinc-900 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-[#8B5CF6] resize-none"
              />
            </div>

            {/* LinkedIn URL */}
            <div className="space-y-1.5">
              <Label htmlFor="linkedin_url" className="text-sm text-zinc-300">
                LinkedIn URL
              </Label>
              <Input
                id="linkedin_url"
                placeholder="https://linkedin.com/in/ton-profil"
                value={profile.linkedin_url}
                onChange={(e) => updateProfile("linkedin_url", e.target.value)}
                className="bg-zinc-900 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-[#8B5CF6]"
              />
            </div>

            {/* Save Button */}
            <div className="pt-2">
              <Button
                onClick={handleSaveProfile}
                disabled={saving}
                className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sauvegarde...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Sauvegarder
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Preferences Section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <Card className="bg-zinc-950 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-zinc-100">
              Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Default Tone */}
            <div className="space-y-1.5">
              <Label className="text-sm text-zinc-300">Ton par defaut</Label>
              <Select
                value={preferences.default_tone}
                onValueChange={(v) =>
                  setPreferences((prev) => ({ ...prev, default_tone: v }))
                }
              >
                <SelectTrigger className="bg-zinc-900 border-zinc-800 text-zinc-300 text-sm focus:ring-[#8B5CF6] w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-800">
                  {toneOptions.map((opt) => (
                    <SelectItem
                      key={opt.value}
                      value={opt.value}
                      className="text-zinc-300 text-sm focus:bg-zinc-800 focus:text-zinc-100"
                    >
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Follow-up Notifications */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-zinc-100">
                  Notifications de relance
                </p>
                <p className="text-xs text-zinc-500">
                  Recevoir un rappel quand il est temps de relancer
                </p>
              </div>
              <Switch
                checked={preferences.follow_up_notifications}
                onCheckedChange={(checked) =>
                  setPreferences((prev) => ({
                    ...prev,
                    follow_up_notifications: checked,
                  }))
                }
                className="data-[state=checked]:bg-[#8B5CF6]"
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Plan / Infos Section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <Card className="bg-zinc-950 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-zinc-100">
              Infos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-zinc-100">Plan actuel</p>
                <p className="text-xs text-zinc-500">
                  Ton abonnement en cours
                </p>
              </div>
              <Badge
                variant="outline"
                className="bg-[#8B5CF6]/10 text-[#8B5CF6] border-[#8B5CF6]/20"
              >
                {plan.name}
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-zinc-100">Quota</p>
                <p className="text-xs text-zinc-500">
                  Messages generes aujourd&apos;hui
                </p>
              </div>
              <p className="text-sm text-zinc-300">
                <span className="font-semibold text-zinc-100">
                  {plan.messages_used}
                </span>
                <span className="text-zinc-500">
                  /{plan.messages_limit} messages
                </span>
              </p>
            </div>

            {/* Progress bar */}
            <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#8B5CF6] rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(
                    (plan.messages_used / plan.messages_limit) * 100,
                    100
                  )}%`,
                }}
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Danger Zone */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
      >
        <Card className="bg-zinc-950 border-red-500/20">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-red-400 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Zone dangereuse
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-zinc-100">
                  Supprimer mon compte
                </p>
                <p className="text-xs text-zinc-500">
                  Cette action est irreversible. Toutes tes donnees seront
                  supprimees.
                </p>
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setDeleteDialogOpen(true)}
                className="bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Supprimer
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="bg-zinc-950 border-zinc-800 text-zinc-100 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-zinc-100 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              Confirmer la suppression
            </DialogTitle>
            <DialogDescription className="text-sm text-zinc-400">
              Es-tu sur de vouloir supprimer ton compte ? Cette action est
              irreversible. Toutes tes candidatures, messages et donnees seront
              definitivement perdus.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 pt-4">
            <Button
              variant="ghost"
              onClick={() => setDeleteDialogOpen(false)}
              className="text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
            >
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteAccount}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {deleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Suppression...
                </>
              ) : (
                "Supprimer definitivement"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
