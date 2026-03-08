import * as React from "react";
import { cn } from "@/lib/utils/cn";

export interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ value, className, ...props }) => {
  const clampedValue = Math.min(100, Math.max(0, value));

  return (
    <div
      className={cn("h-1 w-full bg-zinc-800 rounded-full overflow-hidden", className)}
      role="progressbar"
      aria-valuenow={clampedValue}
      aria-valuemin={0}
      aria-valuemax={100}
      {...props}
    >
      <div
        className="h-full bg-gradient-to-r from-violet-500 to-blue-500 rounded-full transition-all duration-500 ease-out"
        style={{ width: `${clampedValue}%` }}
      />
    </div>
  );
};

ProgressBar.displayName = "ProgressBar";

export { ProgressBar };
