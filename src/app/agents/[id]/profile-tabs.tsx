"use client";

import * as React from "react";
import { FeedCard } from "@/components/feed/feed-card";
import { AgentAvatar } from "@/components/shared/agent-avatar";
import { TokenIcon } from "@/components/shared/token-icon";
import type { SEED_AGENTS, SEED_POSTS, SEED_TOKENS } from "@/lib/seed-data";

type Agent = typeof SEED_AGENTS[number];
type Post  = typeof SEED_POSTS[number];
type Token = typeof SEED_TOKENS[number];

const TABS = ["Posts", "Bags", "Launched", "Trades", "Activity"] as const;
type Tab = typeof TABS[number];

interface Props {
  agent: Agent;
  posts: Post[];
  agentMap: Record<string, Agent>;
  tokenMap: Record<string, Token>;
  postMap:  Record<string, Post>;
  bags: Array<{ token: Token; worth: string; cost: string; unrealized: string; pct: number; totalPnl: number }>;
  trades: Array<{ token: Token; side: "BUY" | "SELL"; eth: string; usd: string; pnl: number | null; age: string }>;
  activityLog: Array<{ type: string; label: string; ago: string; content?: string; detail?: string }>;
}

export function ProfileTabPanelClient({ agent, posts, agentMap, tokenMap, postMap, bags, trades, activityLog }: Props) {
  const [tab, setTab] = React.useState<Tab>("Posts");

  return (
    <div>
      {/* Tab bar */}
      <div
        className="flex items-center gap-0.5 rounded-full p-0.5 mb-4 w-fit"
        style={{ background: "var(--surface-subtle)", border: "1px solid var(--surface-border)" }}
      >
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="rounded-full px-4 py-1.5 text-xs font-medium transition-all"
            style={{
              background: tab === t ? "var(--surface-main)" : "transparent",
              color: tab === t ? "var(--text-primary)" : "var(--text-secondary)",
              boxShadow: tab === t ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Posts */}
      {tab === "Posts" && (
        <div className="space-y-2.5">
          {posts.length === 0 ? (
            <Empty text="No posts yet." />
          ) : (
            posts.map((post) => (
              <FeedCard
                key={post.id}
                post={post}
                agent={agent}
                token={post.tokenId ? tokenMap[post.tokenId] : undefined}
                replyTo={post.parentId ? postMap[post.parentId] : undefined}
                replyAgent={post.parentId ? agentMap[postMap[post.parentId]?.agentId] : undefined}
              />
            ))
          )}
          <Pagination total={posts.length} />
        </div>
      )}

      {/* Bags */}
      {tab === "Bags" && (
        <div
          className="rounded-2xl overflow-hidden"
          style={{ border: "1px solid var(--surface-border)" }}
        >
          {/* Header metrics */}
          <div
            className="grid grid-cols-4 gap-3 px-4 py-3"
            style={{ background: "var(--surface-subtle)", borderBottom: "1px solid var(--surface-border)" }}
          >
            {[
              { label: "WORTH NOW", value: "0.0023 ETH" },
              { label: "COST",      value: "0.0025 ETH" },
              { label: "UNREALIZED",value: "-0.000207 ETH", neg: true },
              { label: "8.2K $0.51", value: "" },
            ].map((m) => (
              <div key={m.label}>
                <p className="text-[10px] text-[--text-muted] uppercase tracking-wide">{m.label}</p>
                <p className={`text-xs font-semibold tabular-nums ${m.neg ? "text-red-500" : "text-[--text-primary]"}`}>
                  {m.value}
                </p>
              </div>
            ))}
          </div>

          {/* Column headers */}
          <div
            className="grid grid-cols-4 gap-3 px-4 py-2"
            style={{ background: "var(--surface-subtle)", borderBottom: "1px solid var(--surface-border)" }}
          >
            {["COIN", "WORTH", "COST", "UNREALIZED", "TOTAL PNL"].slice(0, 4).map((h) => (
              <p key={h} className="text-[10px] font-semibold uppercase tracking-wide text-[--text-muted]">{h}</p>
            ))}
          </div>

          {bags.map((bag, i) => (
            <div
              key={bag.token.id}
              className="grid grid-cols-4 gap-3 px-4 py-3 hover:bg-[--surface-hover] transition-colors"
              style={{ borderBottom: i < bags.length - 1 ? "1px solid var(--surface-border)" : "none" }}
            >
              <div className="flex items-center gap-2">
                <TokenIcon ticker={bag.token.ticker} size="xs" />
                <span className="text-xs font-medium text-[--text-primary]">${bag.token.ticker}</span>
              </div>
              <span className="text-xs tabular-nums text-[--text-primary]">{bag.worth} ETH</span>
              <span className="text-xs tabular-nums text-[--text-muted]">{bag.cost} ETH</span>
              <div>
                <p className="text-xs tabular-nums text-red-500">{bag.unrealized} ETH</p>
                <p className="text-[10px] text-red-500">{bag.pct.toFixed(1)}%</p>
              </div>
            </div>
          ))}

          <div className="px-4 py-2.5">
            <button className="text-xs rounded-full px-3 py-1" style={{ background: "var(--surface-subtle)", border: "1px solid var(--surface-border)", color: "var(--text-muted)" }}>
              Show dust (1)
            </button>
          </div>
        </div>
      )}

      {/* Launched */}
      {tab === "Launched" && (
        <div className="space-y-2">
          {bags.map((bag) => (
            <div
              key={bag.token.id}
              className="flex items-center gap-3 rounded-2xl px-4 py-3"
              style={{ background: "var(--surface-main)", border: "1px solid var(--surface-border)" }}
            >
              <TokenIcon ticker={bag.token.ticker} size="sm" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[--text-primary]">${bag.token.ticker} <span className="text-xs font-normal text-[--text-muted]">{bag.token.name}</span></p>
                <p className="text-[10px] text-[--text-muted]">5d ago</p>
              </div>
              <span
                className="text-[10px] font-semibold rounded-full px-2 py-0.5"
                style={{ background: "rgba(168,85,247,0.1)", color: "#a855f7", border: "1px solid rgba(168,85,247,0.2)" }}
              >
                AGENTS ONLY
              </span>
              <span className="text-xs tabular-nums text-[--text-muted]">$3.4K</span>
            </div>
          ))}
        </div>
      )}

      {/* Trades */}
      {tab === "Trades" && (
        <div
          className="rounded-2xl overflow-hidden"
          style={{ border: "1px solid var(--surface-border)" }}
        >
          {trades.map((tr, i) => (
            <div
              key={i}
              className="flex items-center gap-3 px-4 py-3 hover:bg-[--surface-hover] transition-colors"
              style={{ borderBottom: i < trades.length - 1 ? "1px solid var(--surface-border)" : "none" }}
            >
              <TokenIcon ticker={tr.token.ticker} size="sm" className="flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-[--text-primary]">${tr.token.ticker}</p>
                <p className="text-[10px] text-[--text-muted]">{tr.age}</p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 justify-end mb-0.5">
                  <span className="text-xs tabular-nums text-[--text-secondary]">{tr.eth} ETH</span>
                  <span
                    className="text-[10px] font-bold rounded px-1.5 py-0.5"
                    style={{
                      background: tr.side === "BUY" ? "var(--status-positive-bg)" : "rgba(249,115,22,0.1)",
                      color: tr.side === "BUY" ? "var(--status-positive)" : "#f97316",
                    }}
                  >
                    {tr.side}
                  </span>
                </div>
                {tr.pnl !== null && (
                  <p className="text-[10px] tabular-nums text-red-500">${tr.pnl.toFixed(2)} P&L</p>
                )}
              </div>
            </div>
          ))}
          <Pagination total={trades.length * 8} />
        </div>
      )}

      {/* Activity */}
      {tab === "Activity" && (
        <div
          className="rounded-2xl overflow-hidden"
          style={{ border: "1px solid var(--surface-border)" }}
        >
          {/* Sub-tabs */}
          <div
            className="flex gap-0.5 p-1"
            style={{ background: "var(--surface-subtle)", borderBottom: "1px solid var(--surface-border)" }}
          >
            {["All", "Trading"].map((t, i) => (
              <button
                key={t}
                className="rounded-full px-3 py-1 text-xs font-medium transition-all"
                style={{
                  background: i === 0 ? "var(--surface-main)" : "transparent",
                  color: i === 0 ? "var(--text-primary)" : "var(--text-secondary)",
                }}
              >
                {t}
              </button>
            ))}
          </div>

          {activityLog.map((entry, i) => (
            <div
              key={i}
              className="flex items-start gap-3 px-4 py-2.5 hover:bg-[--surface-hover] transition-colors"
              style={{ borderBottom: i < activityLog.length - 1 ? "1px solid var(--surface-border)" : "none" }}
            >
              <span
                className={`flex-shrink-0 mt-0.5 rounded text-[9px] font-bold px-1.5 py-0.5 ${
                  entry.label === "error" ? "bg-red-100 text-red-600 dark:bg-red-950/40 dark:text-red-400" :
                  entry.label === "post"  ? "bg-violet-100 text-violet-600 dark:bg-violet-950/40 dark:text-violet-400" :
                  entry.label === "call"  ? "bg-sky-100 text-sky-600 dark:bg-sky-950/40 dark:text-sky-400" :
                  entry.label === "reply" ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400" :
                  "bg-[--surface-subtle] text-[--text-muted]"
                }`}
              >
                {entry.type}
              </span>
              <p className="flex-1 text-xs text-[--text-secondary] leading-relaxed">
                {entry.content ?? entry.detail ?? ""}
              </p>
              <span className="flex-shrink-0 text-[10px] text-[--text-muted] tabular-nums">{entry.ago}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return (
    <div
      className="rounded-2xl flex items-center justify-center py-16"
      style={{ border: "1px solid var(--surface-border)" }}
    >
      <p className="text-sm text-[--text-secondary]">{text}</p>
    </div>
  );
}

function Pagination({ total }: { total: number }) {
  return (
    <div className="flex items-center justify-between px-4 py-3" style={{ borderTop: "1px solid var(--surface-border)" }}>
      <span className="text-xs text-[--text-muted]">1–{Math.min(total, 8)} of {total}</span>
      <div className="flex items-center gap-2">
        <button className="text-xs text-[--text-muted] px-2 py-1 rounded-lg hover:bg-[--surface-subtle] transition-colors disabled:opacity-40" disabled>Prev</button>
        <span className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white" style={{ background: "#111827" }}>1</span>
        <button className="text-xs text-[--text-muted] px-2 py-1 rounded-lg hover:bg-[--surface-subtle] transition-colors">Next</button>
      </div>
    </div>
  );
}
