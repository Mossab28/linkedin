"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

interface AddApplicationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const channelOptions = [
  { value: "linkedin_easy_apply", label: "LinkedIn Easy Apply" },
  { value: "linkedin_message", label: "Message LinkedIn" },
  { value: "email", label: "Email" },
  { value: "company_website", label: "Site entreprise" },
  { value: "referral", label: "Recommandation" },
  { value: "other", label: "Autre" },
];

const statusOptions = [
  { value: "draft", label: "Brouillon" },
  { value: "sent", label: "Envoyee" },
  { value: "pending", label: "En attente" },
  { value: "interview", label: "Entretien" },
];

export function AddApplicationDialog({
  open,
  onOpenChange,
  onSuccess,
}: AddApplicationDialogProps) {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    company: "",
    position: "",
    offer_url: "",
    contact_name: "",
    contact_linkedin: "",
    channel: "linkedin_easy_apply",
    status: "sent",
    notes: "",
    next_follow_up: "",
  });

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setForm({
      company: "",
      position: "",
      offer_url: "",
      contact_name: "",
      contact_linkedin: "",
      channel: "linkedin_easy_apply",
      status: "sent",
      notes: "",
      next_follow_up: "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.company.trim() || !form.position.trim()) {
      toast({
        title: "Champs requis",
        description: "L'entreprise et le poste sont obligatoires.",
        variant: "destructive",
      });
      return;
    }

    try {
      setSubmitting(true);

      const payload: Record<string, string> = {
        entreprise: form.company.trim(),
        poste: form.position.trim(),
        statut: form.status === "sent" ? "envoyee" : form.status === "pending" ? "envoyee" : form.status === "interview" ? "entretien" : "brouillon",
      };

      if (form.offer_url.trim()) payload.url_offre = form.offer_url.trim();
      if (form.contact_name.trim()) payload.contact_nom = form.contact_name.trim();
      if (form.contact_linkedin.trim()) payload.contact_poste = form.contact_linkedin.trim();
      if (form.notes.trim()) payload.notes = form.notes.trim();
      if (form.next_follow_up) payload.date_relance = new Date(form.next_follow_up).toISOString();

      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Erreur lors de l'ajout");
      }

      toast({
        title: "Candidature ajoutee",
        description: `${form.position} chez ${form.company} a ete ajoutee.`,
      });

      resetForm();
      onSuccess();
    } catch (err) {
      console.error(err);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter la candidature. Reessaye.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-zinc-950 border-zinc-800 text-zinc-100 sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-zinc-100">
            Ajouter une candidature
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          {/* Company */}
          <div className="space-y-1.5">
            <Label htmlFor="company" className="text-sm text-zinc-300">
              Entreprise <span className="text-red-400">*</span>
            </Label>
            <Input
              id="company"
              placeholder="Ex: Google"
              value={form.company}
              onChange={(e) => updateField("company", e.target.value)}
              required
              className="bg-zinc-900 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-[#8B5CF6]"
            />
          </div>

          {/* Position */}
          <div className="space-y-1.5">
            <Label htmlFor="position" className="text-sm text-zinc-300">
              Poste <span className="text-red-400">*</span>
            </Label>
            <Input
              id="position"
              placeholder="Ex: Product Designer"
              value={form.position}
              onChange={(e) => updateField("position", e.target.value)}
              required
              className="bg-zinc-900 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-[#8B5CF6]"
            />
          </div>

          {/* Offer URL */}
          <div className="space-y-1.5">
            <Label htmlFor="offer_url" className="text-sm text-zinc-300">
              URL de l&apos;offre
            </Label>
            <Input
              id="offer_url"
              type="url"
              placeholder="https://..."
              value={form.offer_url}
              onChange={(e) => updateField("offer_url", e.target.value)}
              className="bg-zinc-900 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-[#8B5CF6]"
            />
          </div>

          {/* Contact Name */}
          <div className="space-y-1.5">
            <Label htmlFor="contact_name" className="text-sm text-zinc-300">
              Nom du contact
            </Label>
            <Input
              id="contact_name"
              placeholder="Ex: Marie Dupont"
              value={form.contact_name}
              onChange={(e) => updateField("contact_name", e.target.value)}
              className="bg-zinc-900 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-[#8B5CF6]"
            />
          </div>

          {/* Contact LinkedIn */}
          <div className="space-y-1.5">
            <Label htmlFor="contact_linkedin" className="text-sm text-zinc-300">
              LinkedIn du contact
            </Label>
            <Input
              id="contact_linkedin"
              placeholder="https://linkedin.com/in/..."
              value={form.contact_linkedin}
              onChange={(e) => updateField("contact_linkedin", e.target.value)}
              className="bg-zinc-900 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-[#8B5CF6]"
            />
          </div>

          {/* Channel + Status row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-sm text-zinc-300">Canal</Label>
              <Select
                value={form.channel}
                onValueChange={(v) => updateField("channel", v)}
              >
                <SelectTrigger className="bg-zinc-900 border-zinc-800 text-zinc-300 text-sm focus:ring-[#8B5CF6]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-800">
                  {channelOptions.map((opt) => (
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

            <div className="space-y-1.5">
              <Label className="text-sm text-zinc-300">Statut</Label>
              <Select
                value={form.status}
                onValueChange={(v) => updateField("status", v)}
              >
                <SelectTrigger className="bg-zinc-900 border-zinc-800 text-zinc-300 text-sm focus:ring-[#8B5CF6]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-800">
                  {statusOptions.map((opt) => (
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
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <Label htmlFor="notes" className="text-sm text-zinc-300">
              Notes
            </Label>
            <Textarea
              id="notes"
              placeholder="Notes supplementaires..."
              value={form.notes}
              onChange={(e) => updateField("notes", e.target.value)}
              rows={3}
              className="bg-zinc-900 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-[#8B5CF6] resize-none"
            />
          </div>

          {/* Next Follow-up */}
          <div className="space-y-1.5">
            <Label htmlFor="next_follow_up" className="text-sm text-zinc-300">
              Prochaine relance
            </Label>
            <Input
              id="next_follow_up"
              type="date"
              value={form.next_follow_up}
              onChange={(e) => updateField("next_follow_up", e.target.value)}
              className="bg-zinc-900 border-zinc-800 text-zinc-100 focus-visible:ring-[#8B5CF6]"
            />
          </div>

          <DialogFooter className="gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Ajout...
                </>
              ) : (
                "Ajouter"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
