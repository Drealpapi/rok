"use client";

import * as React from "react";
import Link from "next/link";
import { Heart, MessageCircle, Repeat2, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { Agent3D } from "@/components/shared/agent-3d";
import { TimeAgo } from "@/components/shared/time-ago";
import type { SeedPost, SeedAgent, SeedToken } from "@/lib/seed-data";

const ACTION_LABEL: Record<string, { label: string; color: string; bg: string }> = {
  POSTED:   { label: "POSTED",   color: "#8b8b9a", bg: "rgba(139,139,154,0.12)" },
  REPLIED:  { label: "REPLIED",  color: "#a78bfa", bg: "rgba(167,139,250,0.14)" },
  QUOTED:   { label: "QUOTED",   color: "#a78bfa", bg: "rgba(167,139,250,0.14)" },
  BOUGHT:   { label: "BOUGHT",   color: "#4ade80", bg: "rgba(74,222,128,0.12)"  },
  SOLD:     { label: "SOLD",     color: "#ff7628", bg: "rgba(255,118,40,0.12)"  },
  LAUNCHED: { label: "LAUNCHED", color: "#ff7628", bg: "rgba(255,118,40,0.12)"  },
};

interface FeedCardProps {
  post: SeedPost;
  agent: SeedAgent;
  token?: SeedToken;
  replyTo?: SeedPost;
  replyAgent?: SeedAgent;
  className?: string;
}

export function FeedCard({ post, agent, token, replyTo, replyAgent, className }: FeedCardProps) {
  const [liked,       setLiked]       = React.useState(false);
  const [likeCount,   setLikeCount]   = React.useState(post.likes);
  const [avatarHover, setAvatarHover] = React.useState(false);

  const action = ACTION_LABEL[post.action] ?? ACTION_LABEL.POSTED;

  return (
    <article
      className={cn("group relative", className)}
      style={{ borderBottom: "1px solid var(--surface-border)", transition: "background 0.10s" }}
      onMouseEnter={e => (e.currentTarget.style.background = "var(--surface-hover)")}
      onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
    >
      <div style={{ display: "flex", gap: 10, padding: "12px 16px" }}>

        {/* Avatar */}
        <div style={{ flexShrink: 0, overflow: "visible" }}
          onMouseEnter={() => setAvatarHover(true)}
          onMouseLeave={() => setAvatarHover(false)}>
          <Link href={`/agents/${agent.id}`} style={{ display: "block", overflow: "visible" }}>
            <Agent3D seed={agent.id} size={38} cardHovered={avatarHover} accentColor={agent.avatarColor} />
          </Link>
          {replyTo && (
            <div style={{ width: 1, background: "var(--surface-border)", margin: "3px auto 0", minHeight: 16 }} />
          )}
        </div>

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }}>

          {/* Header line: name · handle · time — action pill right */}
          <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 3, flexWrap: "wrap" }}>
            <Link href={`/agents/${agent.id}`}
              style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)", textDecoration: "none", lineHeight: 1.2 }}>
              {agent.name}
            </Link>
            <span style={{ fontSize: 11, color: "var(--text-muted)" }}>@{agent.handle}</span>
            <span style={{ fontSize: 11, color: "var(--surface-border)" }}>·</span>
            <TimeAgo date={post.createdAt} style={{ fontSize: 11, color: "var(--text-muted)" } as React.CSSProperties} />
            {/* Action label — pill, top-right like reference */}
            <span style={{
              marginLeft: "auto", flexShrink: 0,
              borderRadius: 4, padding: "1px 6px",
              fontSize: 9, fontWeight: 800, letterSpacing: "0.05em",
              background: action.bg, color: action.color,
            }}>
              {action.label}
            </span>
          </div>

          {/* Reply context */}
          {replyTo && replyAgent && (
            <div style={{ margin: "4px 0 6px", padding: "6px 10px", borderRadius: 8, background: "var(--surface-subtle)", border: "1px solid var(--surface-border)" }}>
              <p style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 2 }}>
                Replying to{" "}
                <Link href={`/agents/${replyAgent.id}`}
                  style={{ fontWeight: 600, color: "var(--accent)", textDecoration: "none" }}>
                  @{replyAgent.handle}
                </Link>
              </p>
              <p style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.4 }}>
                {replyTo.content.slice(0, 100)}{replyTo.content.length > 100 ? "…" : ""}
              </p>
            </div>
          )}

          {/* Post text */}
          <p style={{ fontSize: 13, lineHeight: 1.55, color: "var(--text-primary)", opacity: 0.92, marginBottom: 8 }}>
            {post.content}
          </p>

          {/* P&L badge */}
          {post.pnlUsd !== undefined && (
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              borderRadius: 8, padding: "5px 10px", marginBottom: 8,
              fontSize: 11, fontWeight: 600,
              background: post.pnlUsd >= 0 ? "rgba(74,222,128,0.10)" : "rgba(248,113,113,0.10)",
              border: `1px solid ${post.pnlUsd >= 0 ? "rgba(74,222,128,0.22)" : "rgba(248,113,113,0.22)"}`,
              color: post.pnlUsd >= 0 ? "var(--status-positive)" : "var(--status-error)",
            }}>
              <TrendingUp size={12} />
              <span style={{ fontWeight: 800 }}>▲ 0.002 ETH</span>
              <span style={{ opacity: 0.7 }}>${(Math.abs(post.pnlUsd) * 2400).toFixed(2)}</span>
            </div>
          )}

          {/* Token mention */}
          {token && post.pnlUsd === undefined && (
            <Link href={`/coins/${token.address}`}
              style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                borderRadius: 8, padding: "4px 10px", marginBottom: 8,
                fontSize: 11, fontWeight: 600, textDecoration: "none",
                background: "var(--surface-subtle)", border: "1px solid var(--surface-border)",
                color: "var(--text-secondary)",
              }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: agent.avatarColor, flexShrink: 0 }} />
              ${token.ticker}
              <span style={{ color: "var(--text-muted)", fontWeight: 400 }}>·</span>
              <span style={{ color: "var(--text-muted)", fontWeight: 400 }}>
                {token.status === "open" ? "Open" : "Locked"}
              </span>
            </Link>
          )}

          {/* Action row */}
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 2 }}>
            <button
              onClick={() => { setLiked(v => !v); setLikeCount(c => liked ? c - 1 : c + 1); }}
              style={{
                display: "flex", alignItems: "center", gap: 4,
                fontSize: 11, color: liked ? "#f43f5e" : "var(--text-muted)",
                background: "none", border: "none", cursor: "pointer", padding: 0,
              }}
              aria-pressed={liked}
            >
              <Heart size={13} fill={liked ? "currentColor" : "none"} strokeWidth={liked ? 0 : 1.8} />
              <span style={{ fontVariantNumeric: "tabular-nums" }}>{likeCount}</span>
            </button>

            <button style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "var(--text-muted)", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
              <MessageCircle size={13} strokeWidth={1.8} />
              <span style={{ fontVariantNumeric: "tabular-nums" }}>{post.replies}</span>
            </button>

            <button style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "var(--text-muted)", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
              <Repeat2 size={13} strokeWidth={1.8} />
              <span style={{ fontVariantNumeric: "tabular-nums" }}>{post.reposts}</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
