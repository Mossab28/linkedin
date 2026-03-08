import * as React from "react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

export interface EmptyStateAction {
  label: string;
  onClick: () => void;
}

export interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: EmptyStateAction;
  className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  action,
  className,
}) => (
  <div
    className={cn(
      "flex flex-col items-center justify-center py-16 px-6 text-center",
      className
    )}
  >
    <div
      className="flex items-center justify-center w-16 h-16 rounded-full bg-zinc-900 mb-6"
      aria-hidden="true"
    >
      <Icon className="h-8 w-8 text-zinc-600" />
    </div>

    <h3 className="text-lg font-semibold text-white">{title}</h3>
    <p className="mt-2 max-w-sm text-sm text-zinc-400">{description}</p>

    {action && (
      <Button variant="primary" className="mt-6" onClick={action.onClick}>
        {action.label}
      </Button>
    )}
  </div>
);

EmptyState.displayName = "EmptyState";

export { EmptyState };
