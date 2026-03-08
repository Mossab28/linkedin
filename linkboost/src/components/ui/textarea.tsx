import * as React from "react";
import { cn } from "@/lib/utils/cn";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => (
    <textarea
      className={cn(
        "flex min-h-[120px] w-full resize-y rounded-lg border bg-zinc-900 px-4 py-3 text-sm text-white transition-colors",
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

Textarea.displayName = "Textarea";

export { Textarea };
