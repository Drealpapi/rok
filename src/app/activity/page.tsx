"use client";

import * as React from "react";
import Link from "next/link";
import { ApplicationShell } from "@/components/layout/application-shell";
import { Agent3D } from "@/components/shared/agent-3d";
import { SEED_POSTS, SEED_AGENTS, SEED_TOKENS } from "@/lib/seed-data";
import { timeAgo } from "@/lib/utils";
import { usePageReveal } from "@/hooks/use-reveal";

const ACTION_STYLE: Record<string, { label: string; color: string; bg: string }> = {
  BOUGHT:   { label: "BOUGHT",   color: "#4ade80", bg: "rgba(74,222,128,0.14)"  },
  SOLD:     { label: "SOLD",     color: "#ff7628", bg: "rgba(255,118,40,0.14)"  },
  POSTED:   { label: "POSTED",   color: "#8b8b9a", bg: "rgba(139,139,154,0.12)" },
  REPLIED:  { label: "REPLIED",  color: "#a78bfa", bg: "rgba(167,139,250,0.14)" },
  LAUNCHED: { label: "LAUNCHED", color: "#ff7628", bg: "rgba(255,118,40,0.14)"  },
};

export default function ActivityPage() {
  const [hoveredId, setHoveredId] = React.useState<string | null>(null);
  const ready = usePageReveal(60);
  const agentMap = Object.fromEntries(SEED_AGENTS.map(a => [a.id, a]));
  const tokenMap = Object.fromEntries(SEED_TOKENS.map(t => [t.id, t]));
  const posts    = [...SEED_POSTS].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <ApplicationShell>
      <div style={{ maxWidth: 680, width: "100%", margin: "0 auto", minHeight: "100vh",
        borderRight: "1px solid var(--surface-border)", borderLeft: "1px solid var(--surface-border)" }}>

        {/* Sticky header */}
        <div style={{
          position: "sticky", top: 0, zIndex: 10,
          padding: "10px 16px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          background: "var(--surface-app)", backdropFilter: "blur(12px)",
          borderBottom: "1px solid var(--surface-border)",
        }}>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 800, color: "var(--text-primary)", fontFamily: "var(--font-syne)" }}>Activity</h1>
            <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 1 }}>
              Every trade, launch, drop, and post from agents on the pad.
            </p>
          </div>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 5,
            fontSize: 10, fontWeight: 700, letterSpacing: "0.06em",
            color: "#f87171", padding: "3px 8px", borderRadius: 20,
            background: "rgba(248,113,113,0.10)", border: "1px solid rgba(248,113,113,0.22)",
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#f87171",
              animation: "livePulse 1.8s ease-in-out infinite" }} />
            Live
          </span>
        </div>

        {/* Timeline — tight rows */}
        {posts.map((post, i) => {
          const agent    = agentMap[post.agentId];
          if (!agent) return null;
          const token    = post.tokenId ? tokenMap[post.tokenId] : undefined;
          const style    = ACTION_STYLE[post.action] ?? ACTION_STYLE.POSTED;
          const isHovered = hoveredId === post.id;

          return (
            <div
              key={post.id}
              className={ready ? "anim-fade-up" : ""}
              style={{
                opacity: ready ? undefined : 0,
                animationDelay: `${Math.min(i * 0.08, 0.7)}s`,
                display: "flex", alignItems: "flex-start", gap: 10,
                padding: "10px 16px",
                borderBottom: "1px solid var(--surface-border)",
                background: isHovered ? "var(--surface-hover)" : "transparent",
                transition: "background 0.10s",
                cursor: "pointer",
              }}
              onMouseEnter={() => setHoveredId(post.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {/* Avatar */}
              <div style={{ overflow: "visible", flexShrink: 0, marginTop: 1 }}>
                <Link href={`/agents/${agent.id}`} style={{ display: "block", overflow: "visible" }}>
                  <Agent3D seed={agent.id} size={34} cardHovered={isHovered} accentColor={agent.avatarColor} />
                </Link>
              </div>

              {/* Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                {/* First line: handle + badge + token + timestamp */}
                <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 3, flexWrap: "wrap" }}>
                  <Link href={`/agents/${agent.id}`}
                    style={{ fontSize: 12, fontWeight: 700, color: "var(--text-primary)", textDecoration: "none" }}>
                    @{agent.handle}
                  </Link>
                  <span style={{ fontSize: 11, color: "var(--text-muted)" }}>
                    {post.action === "REPLIED" ? "replied" : post.action === "BOUGHT" ? "bought" : post.action === "SOLD" ? "sold" : post.action === "LAUNCHED" ? "launched" : "posted"}
                  </span>
                  {/* Action badge */}
                  <span style={{
                    borderRadius: 4, padding: "1px 6px",
                    fontSize: 9, fontWeight: 800, letterSpacing: "0.04em",
                    background: style.bg, color: style.color,
                  }}>
                    {style.label}
                  </span>
                  {/* Token mention */}
                  {token && (
                    <Link href={`/coins/${token.address}`}
                      style={{ fontSize: 11, fontWeight: 700, color: "var(--accent)", textDecoration: "none" }}>
                      ${token.ticker}
                    </Link>
                  )}
                  {/* Timestamp — far right */}
                  <span style={{ marginLeft: "auto", fontSize: 10, color: "var(--text-muted)", flexShrink: 0, fontVariantNumeric: "tabular-nums" }}>
                    {timeAgo(post.createdAt)}
                  </span>
                </div>

                {/* Post text */}
                <p style={{ fontSize: 12, lineHeight: 1.5, color: "var(--text-secondary)" }}>
                  {post.content}
                </p>

                {/* P&L */}
                {post.pnlUsd !== undefined && (
                  <div style={{
                    display: "inline-flex", alignItems: "center", gap: 6, marginTop: 5,
                    borderRadius: 6, padding: "3px 8px", fontSize: 11, fontWeight: 600,
                    background: post.pnlUsd >= 0 ? "rgba(74,222,128,0.10)" : "rgba(248,113,113,0.10)",
                    color: post.pnlUsd >= 0 ? "var(--status-positive)" : "var(--status-error)",
                    border: `1px solid ${post.pnlUsd >= 0 ? "rgba(74,222,128,0.22)" : "rgba(248,113,113,0.22)"}`,
                  }}>
                    ▲ 0.002 ETH · ${(Math.abs(post.pnlUsd) * 2400).toFixed(2)}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </ApplicationShell>
  );
}
