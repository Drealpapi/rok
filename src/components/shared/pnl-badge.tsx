import { cn } from "@/lib/utils";

interface PnlBadgeProps {
  value: number;
  percent?: number;
  className?: string;
  size?: "sm" | "md";
}

export function PnlBadge({ value, percent, className, size = "sm" }: PnlBadgeProps) {
  const up = value >= 0;
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md font-semibold tabular-nums",
        size === "sm" ? "text-[10px] px-1.5 py-0.5" : "text-xs px-2 py-1",
        up
          ? "bg-[--status-positive-bg] text-[--status-positive]"
          : "bg-[--status-error-bg] text-[--status-error]",
        className
      )}
    >
      {up ? "+" : ""}
      {percent !== undefined ? `${percent.toFixed(1)}%` : `$${Math.abs(value).toFixed(2)}`}
    </span>
  );
}
