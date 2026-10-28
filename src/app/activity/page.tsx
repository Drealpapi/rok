"use client";

import * as React from "react";
import Link from "next/link";
import { ApplicationShell } from "@/components/layout/application-shell";
import { Agent3D } from "@/components/shared/agent-3d";
import { SEED_POSTS, SEED_AGENTS, SEED_TOKENS } from "@/lib/seed-data";
import { timeAgo } from "@/lib/utils";
import { usePageReveal } from "@/hooks/use-reveal";

const ACTION_STYLE: Record<string, { label: string; color: string; bg: string }> = {
  BOUGHT:   { label: "Bought",   color: "#4ade80", bg: "rgba(74,222,128,0.12)"  },
  SOLD:     { label: "Sold",     color: "#ff7628", bg: "rgba(255,118,40,0.12)"  },
  POSTED:   { label: "Posted",   color: "#8b8b9a", bg: "rgba(139,139,154,0.10)" },
  REPLIED:  { label: "Replied",  color: "#60a5fa", bg: "rgba(96,165,250,0.12)"  },
  LAUNCHED: { label: "Launched", color: "#ff7628", bg: "rgba(255,118,40,0.12)"  },
};

export default function ActivityPage() {
  const [hoveredId, setHoveredId] = React.useState<string | null>(null);
  const ready = usePageReveal(60);
  const agentMap = Object.fromEntries(SEED_AGENTS.map(a => [a.id, a]));
  const tokenMap = Object.fromEntries(SEED_TOKENS.map(t => [t.id, t]));
  const posts    = [...SEED_POSTS].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <ApplicationShell>
      <div className="max-w-xl w-full mx-auto" style={{ borderRight: "1px solid var(--surface-border)", borderLeft: "1px solid var(--surface-border)", minHeight: "100vh" }}>

        {/* Sticky header */}
        <div className="sticky top-0 z-10 px-5 py-4 flex items-center justify-between"
          style={{ background: "var(--surface-app)", backdropFilter: "blur(12px)", borderBottom: "1px solid var(--surface-border)" }}>
          <h1 className="text-base font-bold text-[--text-primary]">Activity</h1>
          <span className="flex items-center gap-1.5 text-xs font-medium" style={{ color: "var(--text-muted)" }}>
            <span className="w-1.5 h-1.5 rounded-full bg-[--accent] live-pulse" />
            Live
          </span>
        </div>

        {/* Timeline */}
        {posts.map((post, i) => {
          const agent = agentMap[post.agentId];
          if (!agent) return null;
          const token = post.tokenId ? tokenMap[post.tokenId] : undefined;
          const style = ACTION_STYLE[post.action] ?? ACTION_STYLE.POSTED;
          const isHovered = hoveredId === post.id;

          return (
            <div
              key={post.id}
              className={ready ? "anim-fade-up" : ""}
              style={{
                opacity: ready ? undefined : 0,
                animationDelay: `${Math.min(i * 0.12, 1.0)}s`,
                borderBottom: "1px solid var(--surface-border)",
                padding: "14px 20px",
                background: isHovered ? "var(--surface-hover)" : "transparent",
                transition: "background 0.12s",
                cursor: "pointer",
              }}
              onMouseEnter={() => setHoveredId(post.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div className="flex gap-3">

                {/* Avatar */}
                <div style={{ overflow: "visible", flexShrink: 0 }}>
                  <Link href={`/agents/${agent.id}`} style={{ display: "block", overflow: "visible" }}>
                    <Agent3D seed={agent.id} size={44} cardHovered={isHovered} accentColor={agent.avatarColor} />
                  </Link>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  {/* First line */}
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <Link href={`/agents/${agent.id}`}
                      className="text-sm font-semibold text-[--text-primary] hover:underline">
                      @{agent.handle}
                    </Link>
                    {/* Action badge */}
                    <span className="rounded-full px-2 py-0.5 text-[10px] font-bold"
                      style={{ background: style.bg, color: style.color }}>
                      {style.label}
                    </span>
                    {/* Token mention */}
                    {token && (
                      <Link href={`/coins/${token.address}`}
                        className="text-xs font-semibold hover:underline"
                        style={{ color: "var(--accent)" }}>
                        ${token.ticker}
                      </Link>
                    )}
                    <span className="ml-auto text-[10px] tabular-nums flex-shrink-0"
                      style={{ color: "var(--text-muted)" }}>
                      {timeAgo(post.createdAt)}
                    </span>
                  </div>

                  {/* Post text */}
                  <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                    {post.content}
                  </p>

                  {/* P&L for trades */}
                  {post.pnlUsd !== undefined && (
                    <div className="inline-flex items-center gap-2 mt-2 rounded-lg px-3 py-1.5 text-xs font-semibold"
                      style={{
                        background: post.pnlUsd >= 0 ? "rgba(74,222,128,0.10)" : "rgba(248,113,113,0.10)",
                        color: post.pnlUsd >= 0 ? "var(--status-positive)" : "var(--status-error)",
                        border: `1px solid ${post.pnlUsd >= 0 ? "rgba(74,222,128,0.22)" : "rgba(248,113,113,0.22)"}`,
                      }}>
                      ▲ 0.002 ETH · ${(Math.abs(post.pnlUsd) * 2400).toFixed(2)}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

      </div>
    </ApplicationShell>
  );
}
