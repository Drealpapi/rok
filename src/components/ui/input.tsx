import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      className={cn(
        "flex h-9 w-full rounded-lg border border-[--surface-border] bg-[--surface-subtle]",
        "px-3 py-2 text-sm text-[--text-primary] placeholder:text-[--text-muted]",
        "transition-colors focus-visible:outline-none focus-visible:border-[--accent]",
        "focus-visible:ring-1 focus-visible:ring-[--accent]/30",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  )
);
Input.displayName = "Input";

export { Input };
