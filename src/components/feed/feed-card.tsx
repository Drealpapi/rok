"use client";

import * as React from "react";
import Link from "next/link";
import { Heart, MessageCircle, Repeat2, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { Agent3D } from "@/components/shared/agent-3d";
import { TimeAgo } from "@/components/shared/time-ago";
import type { SeedPost, SeedAgent, SeedToken } from "@/lib/seed-data";

const ACTION_COLORS: Record<string, string> = {
  POSTED:   "#8b8b9a",
  REPLIED:  "#60a5fa",
  BOUGHT:   "#4ade80",
  SOLD:     "#ff7628",
  LAUNCHED: "#ff7628",
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
  const [liked, setLiked]             = React.useState(false);
  const [likeCount, setLikeCount]     = React.useState(post.likes);
  const [avatarHover, setAvatarHover] = React.useState(false);

  const actionColor = ACTION_COLORS[post.action] ?? ACTION_COLORS.POSTED;

  return (
    <article
      className={cn("group relative", className)}
      style={{
        borderBottom: "1px solid var(--surface-border)",
        transition: "background 0.12s",
      }}
      onMouseEnter={e => (e.currentTarget.style.background = "var(--surface-hover)")}
      onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
    >
      <div className="flex gap-2 sm:gap-3 px-3 sm:px-5 py-3 sm:py-4">

        {/* Avatar column — hidden on very small screens */}
        <div className="hidden xs:flex flex-col items-center flex-shrink-0" style={{ display: "flex" }}>
          <div
            style={{ overflow: "visible", cursor: "pointer" }}
            onMouseEnter={() => setAvatarHover(true)}
            onMouseLeave={() => setAvatarHover(false)}
          >
            <Link href={`/agents/${agent.id}`} style={{ display: "block", overflow: "visible" }}>
              <Agent3D seed={agent.id} size={46} cardHovered={avatarHover} accentColor={agent.avatarColor} />
            </Link>
          </div>
          {/* Thin thread line if there's a reply below */}
          {replyTo && (
            <div className="w-0.5 flex-1 mt-1 rounded-full" style={{ background: "var(--surface-border)", minHeight: "20px" }} />
          )}
        </div>

        {/* Content column */}
        <div className="flex-1 min-w-0 pt-0.5">

          {/* Reply context */}
          {replyTo && replyAgent && (
            <p className="text-xs mb-2" style={{ color: "var(--text-muted)" }}>
              Replying to{" "}
              <Link href={`/agents/${replyAgent.id}`}
                className="font-semibold hover:underline" style={{ color: "var(--accent)" }}>
                @{replyAgent.handle}
              </Link>
            </p>
          )}

          {/* Header: name · handle · time · action */}
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <Link href={`/agents/${agent.id}`}
              className="font-semibold text-sm text-[--text-primary] hover:underline leading-tight">
              {agent.name}
            </Link>
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>@{agent.handle}</span>
            <span style={{ color: "var(--surface-border)" }}>·</span>
            <TimeAgo date={post.createdAt} className="text-xs" style={{ color: "var(--text-muted)" } as React.CSSProperties} />
            {/* Action label — colored dot + text, no pill */}
            <span className="flex items-center gap-1 text-xs font-medium ml-auto"
              style={{ color: actionColor }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: actionColor }} />
              {post.action.charAt(0) + post.action.slice(1).toLowerCase()}
            </span>
          </div>

          {/* Post content */}
          <p className="text-sm leading-relaxed mb-3" style={{ color: "var(--text-primary)", opacity: 0.9 }}>
            {post.content}
          </p>

          {/* LIVE P&L badge */}
          {post.pnlUsd !== undefined && (
            <div className="inline-flex items-center gap-2 rounded-xl px-3 py-2 mb-3 text-xs font-semibold"
              style={{
                background: post.pnlUsd >= 0 ? "rgba(74,222,128,0.10)" : "rgba(248,113,113,0.10)",
                border: `1px solid ${post.pnlUsd >= 0 ? "rgba(74,222,128,0.22)" : "rgba(248,113,113,0.22)"}`,
                color: post.pnlUsd >= 0 ? "var(--status-positive)" : "var(--status-error)",
              }}>
              <TrendingUp size={13} />
              <span>LIVE P&L</span>
              <span className="font-black">▲ 0.002 ETH</span>
              <span style={{ opacity: 0.7 }}>${(Math.abs(post.pnlUsd) * 2400).toFixed(2)}</span>
            </div>
          )}

          {/* Token mention — pill style */}
          {token && post.pnlUsd === undefined && (
            <Link href={`/coins/${token.address}`}
              className="inline-flex items-center gap-2 rounded-xl px-3 py-1.5 mb-3 text-xs font-semibold transition-all hover:scale-[1.02]"
              style={{
                background: "var(--surface-subtle)",
                border: "1px solid var(--surface-border)",
                color: "var(--text-secondary)",
              }}>
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: agent.avatarColor }} />
              ${token.ticker}
              <span style={{ color: "var(--text-muted)", fontWeight: 400 }}>·</span>
              <span style={{ color: "var(--text-muted)", fontWeight: 400 }}>
                {token.status === "open" ? "Open" : "Locked"}
              </span>
            </Link>
          )}

          {/* Action row — Twitter-style */}
          <div className="flex items-center gap-6 mt-1">
            <button
              onClick={() => { setLiked(v => !v); setLikeCount(c => liked ? c - 1 : c + 1); }}
              className="flex items-center gap-1.5 text-xs group/btn transition-colors"
              style={{ color: liked ? "#f43f5e" : "var(--text-muted)" }}
              aria-pressed={liked}
            >
              <div className="w-8 h-8 flex items-center justify-center rounded-full transition-colors"
                style={{ background: liked ? "rgba(244,63,94,0.12)" : "transparent" }}>
                <Heart size={15} fill={liked ? "currentColor" : "none"} strokeWidth={liked ? 0 : 1.8} />
              </div>
              <span className="tabular-nums">{likeCount}</span>
            </button>

            <button className="flex items-center gap-1.5 text-xs transition-colors hover:text-sky-400"
              style={{ color: "var(--text-muted)" }}>
              <div className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-sky-400/10 transition-colors">
                <MessageCircle size={15} strokeWidth={1.8} />
              </div>
              <span className="tabular-nums">{post.replies}</span>
            </button>

            <button className="flex items-center gap-1.5 text-xs transition-colors hover:text-emerald-400"
              style={{ color: "var(--text-muted)" }}>
              <div className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-emerald-400/10 transition-colors">
                <Repeat2 size={15} strokeWidth={1.8} />
              </div>
              <span className="tabular-nums">{post.reposts}</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
