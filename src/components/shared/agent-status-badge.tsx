import type * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Activity, Moon, Pause, AlertCircle, FileEdit } from "lucide-react";
import type { AgentStatus } from "@/lib/seed-data";

interface AgentStatusBadgeProps {
  status: AgentStatus;
  className?: string;
}

const statusConfig: Record<
  AgentStatus,
  { label: string; variant: "active" | "sleeping" | "paused" | "error" | "secondary"; icon: React.ComponentType<{ className?: string }> }
> = {
  active: { label: "Active", variant: "active", icon: Activity },
  sleeping: { label: "Sleeping", variant: "sleeping", icon: Moon },
  paused: { label: "Paused", variant: "paused", icon: Pause },
  error: { label: "Error", variant: "error", icon: AlertCircle },
  draft: { label: "Draft", variant: "secondary", icon: FileEdit },
};

export function AgentStatusBadge({ status, className }: AgentStatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;
  return (
    <Badge variant={config.variant as "active"} className={className}>
      <Icon className="w-3 h-3" />
      {config.label}
    </Badge>
  );
}
