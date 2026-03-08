import * as React from "react";
import { cn } from "@/lib/utils/cn";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

const Skeleton: React.FC<SkeletonProps> = ({ className, ...props }) => (
  <div
    className={cn("animate-pulse bg-zinc-800 rounded-md", className)}
    aria-hidden="true"
    {...props}
  />
);

Skeleton.displayName = "Skeleton";

export { Skeleton };
