import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/cn";

const badgeVariants = cva(
  "inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-zinc-800 text-zinc-300",
        accent: "bg-violet-500/10 text-violet-400",
        success: "bg-green-500/10 text-green-400",
        warning: "bg-yellow-500/10 text-yellow-400",
        error: "bg-red-500/10 text-red-400",
        outline: "border border-zinc-700 text-zinc-300 bg-transparent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

const Badge: React.FC<BadgeProps> = ({ className, variant, ...props }) => (
  <span className={cn(badgeVariants({ variant, className }))} {...props} />
);

Badge.displayName = "Badge";

export { Badge, badgeVariants };
