import * as React from "react";
import { cn } from "@/lib/utils/cn";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", error, ...props }, ref) => (
    <input
      type={type}
      className={cn(
        "flex h-11 w-full rounded-lg border bg-zinc-900 px-4 text-sm text-white transition-colors",
        "placeholder:text-zinc-500",
        "focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500",
        "disabled:cursor-not-allowed disabled:opacity-50",
        error ? "border-red-500" : "border-zinc-800",
        className
      )}
      ref={ref}
      aria-invalid={error || undefined}
      {...props}
    />
  )
);

Input.displayName = "Input";

export { Input };
