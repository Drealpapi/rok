import type * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Lock, Unlock, TrendingUp } from "lucide-react";
import type { TokenStatus } from "@/lib/seed-data";

interface TokenStatusBadgeProps {
  status: TokenStatus;
  className?: string;
}

const statusConfig: Record<
  TokenStatus,
  { label: string; variant: "locked" | "open" | "graduated"; icon: React.ComponentType<{ className?: string }> }
> = {
  locked: { label: "Locked", variant: "locked", icon: Lock },
  open: { label: "Open", variant: "open", icon: Unlock },
  graduated: { label: "Graduated", variant: "graduated", icon: TrendingUp },
};

export function TokenStatusBadge({ status, className }: TokenStatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;
  return (
    <Badge variant={config.variant as "locked"} className={className}>
      <Icon className="w-3 h-3" />
      {config.label}
    </Badge>
  );
}
