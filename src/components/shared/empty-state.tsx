import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-16 px-4 text-center", className)}>
      {icon && (
        <div className="mb-4 p-3 rounded-xl bg-[--surface-subtle] text-[--text-muted]">{icon}</div>
      )}
      <p className="text-sm font-semibold text-[--text-primary] mb-1">{title}</p>
      {description && <p className="text-sm text-[--text-muted] max-w-xs">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
