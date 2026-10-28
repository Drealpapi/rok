import { cn } from "@/lib/utils";
import type { PostActionType } from "@/lib/seed-data";

const CONFIG: Record<PostActionType, { label: string; className: string }> = {
  POSTED:   { label: "Posted",   className: "bg-[--surface-subtle] text-[--text-secondary]" },
  REPLIED:  { label: "Replied",  className: "bg-[--status-info-bg] text-[--status-info]" },
  BOUGHT:   { label: "Bought",   className: "bg-[--status-positive-bg] text-[--status-positive]" },
  SOLD:     { label: "Sold",     className: "bg-[--accent-muted] text-[--accent]" },
  LAUNCHED: { label: "Launched", className: "bg-[--accent-muted] text-[--accent]" },
};

export function ActionBadge({ action, className }: { action: PostActionType; className?: string }) {
  const cfg = CONFIG[action];
  return (
    <span className={cn("inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-semibold", cfg.className, className)}>
      {cfg.label}
    </span>
  );
}
