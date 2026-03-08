"use client";

import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import * as SelectPrimitive from "@radix-ui/react-select";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  X,
  ChevronDown,
  Check,
  MapPin,
  Briefcase,
  GraduationCap,
  Calendar,
  Wifi,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface SearchCriteria {
  keywords: string;
  location: string;
  contractType: string;
  level: string;
  datePosted: string;
  remote: boolean;
}

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSearch: (criteria: SearchCriteria) => void;
  defaultValues?: Partial<SearchCriteria>;
  loading?: boolean;
}

// ---------------------------------------------------------------------------
// Tiny Select component (wraps Radix)
// ---------------------------------------------------------------------------

function MiniSelect({
  value,
  onValueChange,
  placeholder,
  options,
  icon: Icon,
}: {
  value: string;
  onValueChange: (v: string) => void;
  placeholder: string;
  options: { value: string; label: string }[];
  icon?: React.ElementType;
}) {
  return (
    <SelectPrimitive.Root value={value} onValueChange={onValueChange}>
      <SelectPrimitive.Trigger
        className={cn(
          "flex h-11 w-full items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900 px-4 text-sm text-white transition-colors",
          "placeholder:text-zinc-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500",
          "data-[placeholder]:text-zinc-500"
        )}
      >
        <span className="flex items-center gap-2 truncate">
          {Icon && <Icon className="h-4 w-4 text-zinc-400" />}
          <SelectPrimitive.Value placeholder={placeholder} />
        </span>
        <SelectPrimitive.Icon>
          <ChevronDown className="h-4 w-4 text-zinc-400" />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>

      <SelectPrimitive.Portal>
        <SelectPrimitive.Content
          className="z-[100] overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900 shadow-xl"
          position="popper"
          sideOffset={4}
        >
          <SelectPrimitive.Viewport className="p-1">
            {options.map((opt) => (
              <SelectPrimitive.Item
                key={opt.value}
                value={opt.value}
                className={cn(
                  "relative flex h-9 cursor-pointer select-none items-center rounded-md px-8 text-sm text-zinc-300 outline-none",
                  "data-[highlighted]:bg-violet-500/10 data-[highlighted]:text-violet-400"
                )}
              >
                <SelectPrimitive.ItemIndicator className="absolute left-2">
                  <Check className="h-3.5 w-3.5 text-violet-400" />
                </SelectPrimitive.ItemIndicator>
                <SelectPrimitive.ItemText>{opt.label}</SelectPrimitive.ItemText>
              </SelectPrimitive.Item>
            ))}
          </SelectPrimitive.Viewport>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  );
}

// ---------------------------------------------------------------------------
// Toggle
// ---------------------------------------------------------------------------

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex items-center gap-3 group"
    >
      <span
        className={cn(
          "relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors",
          checked ? "bg-violet-600" : "bg-zinc-700"
        )}
      >
        <span
          className={cn(
            "pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow-lg transition-transform",
            checked ? "translate-x-5" : "translate-x-0.5"
          )}
        />
      </span>
      <span className="text-sm text-zinc-300 group-hover:text-white transition-colors">
        {label}
      </span>
    </button>
  );
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const CONTRACT_OPTIONS = [
  { value: "stage", label: "Stage" },
  { value: "alternance", label: "Alternance" },
  { value: "cdi", label: "CDI" },
  { value: "cdd", label: "CDD" },
];

const LEVEL_OPTIONS = [
  { value: "etudiant", label: "Etudiant" },
  { value: "junior", label: "Junior" },
  { value: "confirme", label: "Confirme" },
  { value: "senior", label: "Senior" },
];

const DATE_OPTIONS = [
  { value: "24h", label: "24 heures" },
  { value: "7d", label: "7 jours" },
  { value: "30d", label: "30 jours" },
  { value: "all", label: "Toutes" },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function SearchDialog({
  open,
  onOpenChange,
  onSearch,
  defaultValues,
  loading = false,
}: SearchDialogProps) {
  const [keywords, setKeywords] = React.useState(defaultValues?.keywords ?? "");
  const [location, setLocation] = React.useState(defaultValues?.location ?? "");
  const [contractType, setContractType] = React.useState(
    defaultValues?.contractType ?? ""
  );
  const [level, setLevel] = React.useState(defaultValues?.level ?? "");
  const [datePosted, setDatePosted] = React.useState(
    defaultValues?.datePosted ?? ""
  );
  const [remote, setRemote] = React.useState(defaultValues?.remote ?? false);

  // Reset when defaults change
  React.useEffect(() => {
    if (defaultValues) {
      setKeywords(defaultValues.keywords ?? "");
      setLocation(defaultValues.location ?? "");
      setContractType(defaultValues.contractType ?? "");
      setLevel(defaultValues.level ?? "");
      setDatePosted(defaultValues.datePosted ?? "");
      setRemote(defaultValues.remote ?? false);
    }
  }, [defaultValues]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSearch({ keywords, location, contractType, level, datePosted, remote });
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay asChild>
          <motion.div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        </Dialog.Overlay>

        <Dialog.Content asChild>
          <motion.div
            className={cn(
              "fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2",
              "rounded-2xl border border-zinc-800 bg-[#09090B] p-6 shadow-2xl",
              "focus:outline-none"
            )}
            initial={{ opacity: 0, scale: 0.95, y: "-48%" }}
            animate={{ opacity: 1, scale: 1, y: "-50%" }}
            exit={{ opacity: 0, scale: 0.95, y: "-48%" }}
            transition={{ type: "spring", duration: 0.4, bounce: 0.15 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <Dialog.Title className="text-xl font-semibold text-white">
                Nouvelle recherche
              </Dialog.Title>
              <Dialog.Close asChild>
                <button className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors">
                  <X className="h-4 w-4" />
                </button>
              </Dialog.Close>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Keywords */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm text-zinc-400">Mots-cles</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                  <Input
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    placeholder="Ex: Marketing digital, Developpeur React..."
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Location */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm text-zinc-400">Localisation</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                  <Input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Ex: Paris, Lyon, Remote..."
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Selects row */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm text-zinc-400">Type de contrat</label>
                  <MiniSelect
                    value={contractType}
                    onValueChange={setContractType}
                    placeholder="Selectionner"
                    options={CONTRACT_OPTIONS}
                    icon={Briefcase}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm text-zinc-400">Niveau</label>
                  <MiniSelect
                    value={level}
                    onValueChange={setLevel}
                    placeholder="Selectionner"
                    options={LEVEL_OPTIONS}
                    icon={GraduationCap}
                  />
                </div>
              </div>

              {/* Date + Remote */}
              <div className="grid grid-cols-2 gap-3 items-end">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm text-zinc-400">
                    Date de publication
                  </label>
                  <MiniSelect
                    value={datePosted}
                    onValueChange={setDatePosted}
                    placeholder="Selectionner"
                    options={DATE_OPTIONS}
                    icon={Calendar}
                  />
                </div>
                <div className="flex items-center h-11">
                  <Toggle
                    checked={remote}
                    onChange={setRemote}
                    label="Remote accepte"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 mt-2">
                <Dialog.Close asChild>
                  <Button type="button" variant="ghost" size="sm">
                    Annuler
                  </Button>
                </Dialog.Close>
                <Button type="submit" variant="primary" size="sm" loading={loading}>
                  <Search className="h-4 w-4" />
                  Rechercher
                </Button>
              </div>
            </form>
          </motion.div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
