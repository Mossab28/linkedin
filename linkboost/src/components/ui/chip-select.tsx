import * as React from "react";
import { Check, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export interface ChipSelectProps {
  value: string;
  label: string;
  description?: string;
  icon?: LucideIcon;
  selected: boolean;
  onSelect: () => void;
  compact?: boolean;
  className?: string;
}

const ChipSelect: React.FC<ChipSelectProps> = ({
  label,
  description,
  icon: Icon,
  selected,
  onSelect,
  compact = false,
  className,
}) => {
  return (
    <button
      type="button"
      role="option"
      aria-selected={selected}
      onClick={onSelect}
      className={cn(
        "relative flex items-center gap-4 rounded-xl border cursor-pointer transition-all text-left w-full",
        compact ? "p-3" : "p-4",
        selected
          ? "bg-violet-500/10 border-violet-500 shadow-[0_0_20px_rgba(139,92,246,0.15)]"
          : "bg-zinc-900 border-zinc-800 hover:border-zinc-700",
        className
      )}
    >
      {Icon && (
        <span
          className={cn(
            "flex-shrink-0 text-zinc-400",
            selected && "text-violet-400"
          )}
          aria-hidden="true"
        >
          <Icon className={compact ? "w-4 h-4" : "w-5 h-5"} />
        </span>
      )}

      <div className="flex-1 min-w-0">
        <span className="block text-sm font-medium text-white">{label}</span>
        {description && (
          <span className="block mt-1 text-xs text-zinc-400">{description}</span>
        )}
      </div>

      <span
        className={cn(
          "flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full border transition-all",
          selected
            ? "bg-violet-600 border-violet-600 text-white"
            : "border-zinc-700 bg-transparent"
        )}
        aria-hidden="true"
      >
        {selected && <Check className="h-3 w-3" />}
      </span>
    </button>
  );
};

ChipSelect.displayName = "ChipSelect";

export { ChipSelect };
