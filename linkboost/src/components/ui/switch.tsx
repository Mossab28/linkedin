"use client";

import * as React from "react";
import { cn } from "@/lib/utils/cn";

export interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onCheckedChange?: (checked: boolean) => void;
  checked?: boolean;
}

const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, onCheckedChange, checked, onChange, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onCheckedChange?.(e.target.checked);
      onChange?.(e);
    };

    return (
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          ref={ref}
          checked={checked}
          onChange={handleChange}
          className="sr-only peer"
          {...props}
        />
        <div
          className={cn(
            "w-10 h-6 rounded-full border border-zinc-700 bg-zinc-800 transition-colors",
            "peer-checked:bg-violet-600 peer-checked:border-violet-600",
            "peer-focus-visible:ring-2 peer-focus-visible:ring-violet-500 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-zinc-950",
            "after:content-[''] after:absolute after:top-[3px] after:left-[3px]",
            "after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-transform",
            "peer-checked:after:translate-x-4",
            className
          )}
        />
      </label>
    );
  }
);
Switch.displayName = "Switch";

export { Switch };
