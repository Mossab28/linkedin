import * as React from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const colorMap = {
  accent: {
    bg: "bg-violet-500/10",
    text: "text-violet-400",
    trend: "text-violet-400",
  },
  blue: {
    bg: "bg-blue-500/10",
    text: "text-blue-400",
    trend: "text-blue-400",
  },
  success: {
    bg: "bg-green-500/10",
    text: "text-green-400",
    trend: "text-green-400",
  },
  warning: {
    bg: "bg-yellow-500/10",
    text: "text-yellow-400",
    trend: "text-yellow-400",
  },
} as const;

export interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  trend?: string;
  color?: keyof typeof colorMap;
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  icon: Icon,
  label,
  value,
  trend,
  color = "accent",
  className,
}) => {
  const palette = colorMap[color];

  return (
    <div
      className={cn(
        "bg-zinc-950/50 border border-zinc-800 rounded-xl p-5 transition-colors hover:border-zinc-700",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div
          className={cn(
            "flex items-center justify-center w-10 h-10 rounded-full",
            palette.bg
          )}
          aria-hidden="true"
        >
          <Icon className={cn("h-5 w-5", palette.text)} />
        </div>

        {trend && (
          <span className={cn("text-xs font-medium", palette.trend)}>{trend}</span>
        )}
      </div>

      <div className="mt-4">
        <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">{label}</p>
        <p className="mt-1 text-2xl font-bold text-white">{value}</p>
      </div>
    </div>
  );
};

StatCard.displayName = "StatCard";

export { StatCard };
