import { cn, clamp } from "@/lib/utils";

interface ProgressBarProps {
  value: number; // 0-100
  className?: string;
  trackClassName?: string;
  fillClassName?: string;
  showLabel?: boolean;
  label?: string;
  color?: "violet" | "emerald" | "amber" | "sky";
}

const colorMap = {
  violet: "bg-gradient-to-r from-violet-500 to-cyan-400",
  emerald: "bg-emerald-400",
  amber: "bg-amber-400",
  sky: "bg-sky-400",
};

export function ProgressBar({
  value,
  className,
  trackClassName,
  fillClassName,
  showLabel = false,
  label,
  color = "violet",
}: ProgressBarProps) {
  const pct = clamp(value, 0, 100);

  return (
    <div className={cn("w-full", className)}>
      {(showLabel || label) && (
        <div className="flex items-center justify-between mb-1">
          {label && <span className="text-xs text-[#85859E]">{label}</span>}
          {showLabel && (
            <span className="text-xs tabular-nums text-[#11111B] font-medium">
              {pct.toFixed(0)}%
            </span>
          )}
        </div>
      )}
      <div
        className={cn(
          "h-1.5 w-full rounded-full bg-[#EDE9F8] overflow-hidden",
          trackClassName
        )}
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500",
            colorMap[color],
            fillClassName
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
