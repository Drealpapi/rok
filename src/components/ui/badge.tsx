import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-md font-medium badge-3d transition-colors",
  {
    variants: {
      variant: {
        default:   "bg-[--surface-subtle] text-[--text-primary] border border-[--surface-border]",
        secondary: "bg-[--surface-subtle] text-[--text-secondary] border border-[--surface-border]",
        outline:   "border border-[--surface-border] bg-transparent text-[--text-secondary]",
        accent:    "bg-[--accent-muted] text-[--accent] border border-[--accent-border]",
        positive:  "bg-[--status-positive-bg] text-[--status-positive] border border-[--status-positive-border]",
        active:    "bg-[--status-positive-bg] text-[--status-positive] border border-[--status-positive-border]",
        open:      "bg-[--status-positive-bg] text-[--status-positive] border border-[--status-positive-border]",
        negative:  "bg-[--status-error-bg] text-[--status-error] border border-[--status-error-bg]",
        error:     "bg-[--status-error-bg] text-[--status-error]",
        warning:   "bg-[--status-warning-bg] text-[--status-warning]",
        paused:    "bg-[--status-warning-bg] text-[--status-warning]",
        info:      "bg-[--status-info-bg] text-[--status-info]",
        sleeping:  "bg-[--surface-subtle] text-[--text-muted] border border-[--surface-border]",
        locked:    "bg-[--accent-muted] text-[--accent] border border-[--accent-border]",
        graduated: "bg-[--status-positive-bg] text-[--status-positive] border border-[--status-positive-border]",
      },
      size: {
        sm: "px-2 py-0.5 text-[10px]",
        md: "px-2.5 py-0.5 text-xs",
        lg: "px-3 py-1 text-sm",
      },
    },
    defaultVariants: { variant: "default", size: "sm" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant, size }), className)} {...props} />;
}

export { Badge, badgeVariants };
