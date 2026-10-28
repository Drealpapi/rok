"use client";

import * as React from "react";
import Link from "next/link";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Agent3D } from "@/components/shared/agent-3d";
import { formatNumber } from "@/lib/utils";
import { STRATEGIES, MODEL_CATALOG } from "@/lib/constants";
import type { SeedAgent } from "@/lib/seed-data";

const AGENT_TAGS: Record<string, string[]> = {
  "agent-001": ["Momentum", "Timing",    "Execution"],
  "agent-002": ["Sniper",   "Trading",   "Onchain"  ],
  "agent-003": ["Contrarian","Analysis", "Risk"     ],
  "agent-004": ["Scalping", "Micro-Trend","Speed"   ],
  "agent-005": ["Analysis", "Conviction","Research" ],
  "agent-006": ["Maker",    "Grid",      "Long"     ],
};

function StatusDot({ status }: { status: string }) {
  const color =
    status === "active"   ? "#22c55e" :
    status === "sleeping" ? "#6b7280" :
    status === "paused"   ? "#f59e0b" : "#6b7280";
  const label =
    status === "active"   ? "ACTIVE" :
    status === "sleeping" ? "SLEEPING" :
    status === "paused"   ? "PAUSED" : status.toUpperCase();
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 9, fontWeight: 700, color, letterSpacing: "0.06em" }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: color, flexShrink: 0, boxShadow: `0 0 5px ${color}88` }} />
      {label}
    </span>
  );
}

export function AgentCard({ agent }: { agent: SeedAgent }) {
  const [hovered, setHovered] = React.useState(false);
  const strategy = STRATEGIES.find(s => s.id === agent.strategy);
  const model    = MODEL_CATALOG.find(m => m.id === agent.model);
  const pnlUp    = agent.pnlPercent >= 0;
  const tags     = AGENT_TAGS[agent.id] ?? [strategy?.label ?? "Agent"];

  return (
    <Link
      href={`/agents/${agent.id}`}
      style={{
        display: "block", textDecoration: "none",
        borderRadius: 14,
        background: "var(--surface-main)",
        border: `1px solid ${hovered ? "var(--accent-border)" : "var(--surface-border)"}`,
        boxShadow: hovered ? "var(--shadow-hover)" : "var(--shadow-card)",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
        transition: "all 0.18s cubic-bezier(0.22,1,0.36,1)",
        overflow: "hidden",
        position: "relative",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{ padding: "14px 14px 12px" }}>

        {/* Top row: avatar + status dot */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 10 }}>
          <div style={{ overflow: "visible" }}>
            <Agent3D seed={agent.id} size={48} cardHovered={hovered} accentColor={agent.avatarColor} />
          </div>
          <StatusDot status={agent.status} />
        </div>

        {/* Name + handle + model */}
        <div style={{ marginBottom: 6 }}>
          <p style={{ fontSize: 15, fontWeight: 800, color: "var(--text-primary)", lineHeight: 1.15, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {agent.name}
          </p>
          <p style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 2 }}>
            @{agent.handle}
            {model && <span style={{ opacity: 0.7 }}> · {model.provider} {model.label.split(" ").slice(0,2).join(" ")}</span>}
          </p>
        </div>

        {/* Description */}
        <p style={{
          fontSize: 11, lineHeight: 1.5, color: "var(--text-secondary)", marginBottom: 10,
          display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
        }}>
          {agent.description}
        </p>

        {/* Followers + influence */}
        <p style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 10 }}>
          <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>{formatNumber(agent.followers, 0)}</span>
          {" followers "}
          <span style={{ color: "var(--text-muted)" }}>Influence</span>{" "}
          <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>{formatNumber(agent.influence, 0)}</span>
        </p>

        {/* Footer: PnL + strategy */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 8, borderTop: "1px solid var(--surface-border)" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 12, fontWeight: 700, color: pnlUp ? "var(--status-positive)" : "var(--status-error)" }}>
              {pnlUp ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
              {pnlUp ? "+" : ""}{agent.pnlPercent.toFixed(2)}%
            </div>
            <p style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 1, fontVariantNumeric: "tabular-nums" }}>
              {pnlUp ? "+" : ""}{(agent.pnlPercent * 0.001).toFixed(3)} ETH
            </p>
          </div>

          {strategy && (
            <span style={{
              borderRadius: 6, padding: "4px 8px",
              fontSize: 10, fontWeight: 800, letterSpacing: "0.05em", textTransform: "uppercase",
              background: "var(--surface-elevated)", border: "1px solid var(--surface-border)",
              color: "var(--text-primary)", whiteSpace: "nowrap",
            }}>
              {strategy.label}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
