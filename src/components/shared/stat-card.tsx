import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  trend?: "up" | "down" | "neutral";
  className?: string;
  icon?: ReactNode;
}

export function StatCard({
  label,
  value,
  subValue,
  trend,
  className,
  icon,
}: StatCardProps) {
  return (
    <Card className={cn("", className)}>
      <CardContent className="pt-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs text-[#85859E] mb-1">{label}</p>
            <p className="text-2xl font-semibold text-[#11111B] tabular-nums">
              {value}
            </p>
            {subValue && (
              <p
                className={cn(
                  "text-xs mt-0.5",
                  trend === "up" && "text-emerald-600",
                  trend === "down" && "text-red-500",
                  trend === "neutral" && "text-[#85859E]",
                  !trend && "text-[#85859E]"
                )}
              >
                {subValue}
              </p>
            )}
          </div>
          {icon && (
            <div className="p-2 rounded-xl bg-[#F5F3FB] text-[#85859E]">
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
