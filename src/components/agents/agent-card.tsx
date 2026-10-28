"use client";

import * as React from "react";
import Link from "next/link";
import { Users, TrendingUp, TrendingDown } from "lucide-react";
import { Agent3D } from "@/components/shared/agent-3d";
import { formatNumber, hashString } from "@/lib/utils";
import { STRATEGIES, MODEL_CATALOG } from "@/lib/constants";
import type { SeedAgent } from "@/lib/seed-data";

const AGENT_TAGS: Record<string, string[]> = {
  "agent-001": ["Momentum",    "Timing",     "Execution"],
  "agent-002": ["Sniper",      "Trading",    "Onchain"  ],
  "agent-003": ["Contrarian",  "Analysis",   "Risk"     ],
  "agent-004": ["Scalping",    "Micro-Trend","Speed"    ],
  "agent-005": ["Analysis",    "Conviction", "Research" ],
  "agent-006": ["Maker",       "Grid",       "Long"     ],
};

const PANEL_GRADIENTS = [
  "linear-gradient(160deg,#1a1118 0%,#2a1a22 100%)",
  "linear-gradient(160deg,#0d1a22 0%,#0d2233 100%)",
  "linear-gradient(160deg,#1a1a2e 0%,#16213e 100%)",
  "linear-gradient(160deg,#1a180d 0%,#29260c 100%)",
  "linear-gradient(160deg,#1a0d1a 0%,#2a1133 100%)",
  "linear-gradient(160deg,#0d1a1a 0%,#0d2929 100%)",
];

function panelBg(id: string) {
  return PANEL_GRADIENTS[hashString(id) % PANEL_GRADIENTS.length];
}

function StatusBadge({ status }: { status: string }) {
  const cfg =
    status === "active"   ? { label: "ACTIVE",   dot: "#22c55e", bg: "rgba(34,197,94,0.15)",   color: "#4ade80" } :
    status === "sleeping" ? { label: "SLEEPING",  dot: "#6b7280", bg: "rgba(107,114,128,0.15)", color: "#9ca3af" } :
    status === "paused"   ? { label: "PAUSED",    dot: "#f59e0b", bg: "rgba(245,158,11,0.15)",  color: "#fbbf24" } :
                            { label: status.toUpperCase(), dot: "#6b7280", bg: "rgba(107,114,128,0.15)", color: "#9ca3af" };
  return (
    <span
      className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-bold tracking-wide whitespace-nowrap"
      style={{ background: cfg.bg, color: cfg.color }}
    >
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: cfg.dot }} />
      {cfg.label}
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
        display:        "block",
        textDecoration: "none",
        borderRadius:   "14px",
        background:     "var(--surface-main)",
        border:         `1px solid ${hovered ? "var(--accent-border)" : "var(--surface-border)"}`,
        boxShadow:      hovered ? "var(--shadow-hover), 0 0 0 1px var(--accent-border)" : "var(--shadow-card)",
        transform:      hovered ? "translateY(-3px) scale(1.012)" : "translateY(0) scale(1)",
        transition:     "all 0.22s cubic-bezier(0.22,1,0.36,1)",
        overflow:       "visible",
        maxWidth:       "100%",
        position:       "relative",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/*
        Mobile  (<sm): stacked — portrait on top, content below
        Desktop (≥sm): side-by-side — portrait left, content right
        We use a CSS class on the wrapper and media-query controlled
        CSS custom classes via globals.css for the flex direction.
      */}
      <div className="agent-card-inner">

        {/* Portrait panel */}
        <div
          className="agent-card-portrait"
          style={{
            position:    "relative",
            display:     "flex",
            alignItems:  "flex-end",
            justifyContent: "center",
            background:  panelBg(agent.id),
            overflow:    "visible",
            flexShrink:  0,
          }}
        >
          {/* Glow */}
          <div
            aria-hidden
            style={{
              position:     "absolute", inset: 0,
              background:   `radial-gradient(circle at 50% 70%, ${agent.avatarColor}44 0%, transparent 70%)`,
              pointerEvents:"none",
              borderRadius: "inherit",
            }}
          />
          <div style={{ overflow: "visible", position: "relative", zIndex: 1, marginBottom: "-8px" }}>
            <Agent3D
              seed={agent.id}
              size={175}
              cardHovered={hovered}
              accentColor={agent.avatarColor}
            />
          </div>
        </div>

        {/* Content */}
        <div
          style={{
            flex: 1,
            minWidth: 0,
            padding: "14px",
            display: "flex",
            flexDirection: "column",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Status — top right */}
          <div style={{ position: "absolute", top: 10, right: 10 }}>
            <StatusBadge status={agent.status} />
          </div>

          {/* Name / handle / model */}
          <div style={{ marginBottom: 8, paddingRight: 72 }}>
            <p style={{
              fontSize: 14, fontWeight: 700, color: "var(--text-primary)",
              lineHeight: 1.2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
            }}>
              {agent.name}
            </p>
            <p style={{ fontSize: 11, marginTop: 2, color: "var(--text-muted)" }}>@{agent.handle}</p>
            {model && (
              <p style={{ fontSize: 10, marginTop: 2, color: "var(--text-muted)" }}>
                {model.provider} · {model.label.split(" ").slice(0, 3).join(" ")}
              </p>
            )}
          </div>

          {/* Description */}
          <p style={{
            fontSize: 12, lineHeight: 1.5, color: "var(--text-secondary)", marginBottom: 10, flex: 1,
            display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
          }}>
            {agent.description}
          </p>

          {/* Tags */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 10 }}>
            {tags.slice(0, 3).map(tag => (
              <span key={tag} style={{
                borderRadius: 999, padding: "2px 8px", fontSize: 10, fontWeight: 500,
                background: "var(--surface-subtle)", border: "1px solid var(--surface-border)",
                color: "var(--text-secondary)", whiteSpace: "nowrap",
              }}>
                {tag}
              </span>
            ))}
          </div>

          {/* Footer */}
          <div style={{
            display: "flex", alignItems: "center",
            justifyContent: "space-between", gap: 8,
            paddingTop: 10, borderTop: "1px solid var(--surface-border)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "var(--text-muted)", flexShrink: 0 }}>
              <Users size={11} />
              <span style={{ fontWeight: 700, color: "var(--text-primary)" }}>{formatNumber(agent.followers, 0)}</span>
              <span className="hidden sm:inline">followers</span>
            </div>

            <div style={{ textAlign: "center", flexShrink: 0 }}>
              <div style={{
                display: "flex", alignItems: "center", gap: 3, fontSize: 11, fontWeight: 700,
                color: pnlUp ? "var(--status-positive)" : "var(--status-error)",
              }}>
                {pnlUp ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                {pnlUp ? "+" : ""}{agent.pnlPercent.toFixed(2)}%
              </div>
              <p style={{ fontSize: 10, color: "var(--text-muted)" }}>
                {pnlUp ? "+" : ""}{(agent.pnlPercent * 0.001).toFixed(3)} ETH
              </p>
            </div>

            {strategy && (
              <span style={{
                borderRadius: 6, padding: "5px 8px", fontSize: 10, fontWeight: 800,
                letterSpacing: "0.05em", textTransform: "uppercase",
                background: "var(--surface-elevated)", border: "1px solid var(--surface-border)",
                color: "var(--text-primary)", whiteSpace: "nowrap", flexShrink: 0,
              }}>
                {strategy.label}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
