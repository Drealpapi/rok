import { notFound } from "next/navigation";
import Link from "next/link";
import { connection } from "next/server";
import { ArrowLeft, Copy, ExternalLink, Lock } from "lucide-react";
import { ApplicationShell } from "@/components/layout/application-shell";
import { Agent3D } from "@/components/shared/agent-3d";
import { ProfileTabsTokenClient } from "./token-tabs";
import { SEED_TOKENS, SEED_AGENTS } from "@/lib/seed-data";
import { formatNumber, shortAddress } from "@/lib/utils";

interface TokenPageProps { params: Promise<{ address: string }> }

export async function generateStaticParams() {
  return SEED_TOKENS.map(t => ({ address: t.address }));
}

export default async function TokenDetailPage({ params }: TokenPageProps) {
  await connection();
  const { address } = await params;
  const token = SEED_TOKENS.find(t => t.address === address);
  if (!token) notFound();

  const agent      = SEED_AGENTS.find(a => a.id === token.launchingAgentId);
  const progressPct = Math.min((token.progressEth / token.thresholdEth) * 100, 100);
  const isOpen      = token.status === "open" || token.status === "graduated";
  const pnlUp       = token.priceChangePercent >= 0;

  // Seed trades for this token
  const TRADES = Array.from({ length: 8 }, (_, i) => ({
    handle: ["nova","nova","mochio","mochio","zedx","mochio","zedx","zedx"][i],
    agentId: SEED_AGENTS[i % SEED_AGENTS.length].id,
    side: i % 3 === 2 ? "SELL" : "BUY" as "BUY" | "SELL",
    eth: (0.001975 - i * 0.000005).toFixed(6),
    usd: (4.88 - i * 0.03).toFixed(2),
    pnl: i % 3 === 2 ? -(0.11 + i * 0.01) : null,
    age: i < 2 ? `${47 + i}m` : "1h",
  }));

  return (
    <ApplicationShell>
      <div className="max-w-5xl w-full mx-auto px-4 py-5 space-y-4">

        {/* Back */}
        <div className="flex items-center justify-between">
          <Link href="/coins"
            className="inline-flex items-center gap-1.5 text-sm hover:text-[--text-primary] transition-colors"
            style={{ color: "var(--text-secondary)" }}>
            <ArrowLeft size={15} />
            ${token.ticker}
          </Link>
          <div className="flex items-center gap-1.5 rounded-full px-3 py-1.5"
            style={{ background: "var(--surface-subtle)", border: "1px solid var(--surface-border)" }}>
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 live-pulse" />
            <span className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>Live</span>
          </div>
        </div>

        {/* Header card */}
        <div className="card-3d p-4">
          <div className="flex items-start gap-4">
            {/* Token avatar using the launching agent's 3D character */}
            {agent ? (
              <div style={{ flexShrink: 0, overflow: "visible" }}>
                <Agent3D seed={agent.id} size={56} cardHovered={false} accentColor={agent.avatarColor} />
              </div>
            ) : (
              <div className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 text-lg font-black text-white"
                style={{ background: "var(--accent)" }}>
                {token.ticker.slice(0, 2)}
              </div>
            )}

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-3 flex-wrap mb-1">
                <div>
                  <h1 className="text-xl font-bold text-[--text-primary]">{token.name}</h1>
                  <p className="text-sm" style={{ color: "var(--text-muted)" }}>${token.ticker}</p>
                </div>
                <span
                  className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold"
                  style={isOpen
                    ? { background: "var(--status-positive-bg)", color: "var(--status-positive)", border: "1px solid var(--status-positive-border)" }
                    : { background: "var(--accent-muted)", color: "var(--accent)", border: "1px solid var(--accent-border)" }}>
                  <Lock size={11} />
                  {isOpen ? "Open" : "Locked"}
                </span>
              </div>

              {/* Address + links */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>
                  {shortAddress(token.address, 8)}
                </span>
                <button className="p-0.5" style={{ color: "var(--text-muted)" }} aria-label="Copy">
                  <Copy size={12} />
                </button>
                {["token ↗", "pool ↗", "gmgn ↗", "dexscreener ↗"].map(l => (
                  <span key={l} className="text-xs cursor-pointer hover:text-[--accent] transition-colors"
                    style={{ color: "var(--text-muted)" }}>{l}</span>
                ))}
              </div>

              {/* Launched by */}
              {agent && (
                <div className="flex items-center gap-1.5 mt-1.5">
                  <span className="text-xs" style={{ color: "var(--text-muted)" }}>🔥 Launched by</span>
                  <Link href={`/agents/${agent.id}`}
                    className="text-xs font-semibold hover:text-[--accent] transition-colors"
                    style={{ color: "var(--accent)" }}>
                    @{agent.handle}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 6-metric bar — matches reference */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {[
            { label: "MARKET CAP", value: `$${formatNumber(token.marketCapUsd, 1)}`,         bg: "rgba(249,115,22,0.08)",  border: "rgba(249,115,22,0.18)" },
            { label: "VOLUME",     value: `$${formatNumber(token.volumeUsd, 1)}`,             bg: "rgba(99,102,241,0.08)", border: "rgba(99,102,241,0.18)" },
            { label: "TRADES",     value: token.txCount.toLocaleString(),                     bg: "rgba(59,130,246,0.08)", border: "rgba(59,130,246,0.18)" },
            { label: "HOLDERS",    value: String(Math.floor(token.txCount / 7)),              bg: "rgba(22,163,74,0.08)",  border: "rgba(22,163,74,0.18)"  },
            { label: "FEES",       value: `$${(token.volumeUsd * 0.01).toFixed(0)}`,         bg: "rgba(168,85,247,0.08)", border: "rgba(168,85,247,0.18)" },
            { label: "PHASE",      value: token.status.charAt(0).toUpperCase() + token.status.slice(1), bg: "rgba(6,182,212,0.08)", border: "rgba(6,182,212,0.18)" },
          ].map(m => (
            <div key={m.label} className="rounded-xl p-3 text-center"
              style={{ background: m.bg, border: `1px solid ${m.border}` }}>
              <p className="text-[9px] font-semibold uppercase tracking-wider mb-1" style={{ color: "var(--text-muted)" }}>{m.label}</p>
              <p className="text-sm font-bold tabular-nums text-[--text-primary]">{m.value}</p>
            </div>
          ))}
        </div>

        {/* Main content: chart left + pool right */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-4">

          {/* Chart area */}
          <div className="card-3d p-4">
            <div className="flex items-end gap-3 mb-3">
              <p className="text-3xl font-black tabular-nums text-[--text-primary]">
                ${formatNumber(token.marketCapUsd, 0)}
              </p>
              <span className="mb-1 text-sm font-semibold tabular-nums"
                style={{ color: pnlUp ? "var(--status-positive)" : "var(--status-error)" }}>
                {pnlUp ? "▲" : "▼"}{Math.abs(token.priceChangePercent).toFixed(2)}% market cap · ${token.ticker}
              </span>
            </div>
            {/* Timeframe buttons */}
            <div className="flex gap-1.5 mb-4">
              {["5m","1h","6h","24h","7d","All"].map((t, i) => (
                <button key={t} className="rounded-full px-2.5 py-1 text-xs font-medium transition-colors"
                  style={{
                    background: i === 1 ? "var(--accent)" : "var(--surface-subtle)",
                    color: i === 1 ? "white" : "var(--text-muted)",
                    border: "1px solid var(--surface-border)",
                  }}>
                  {t}
                </button>
              ))}
              <button className="ml-auto rounded-full px-3 py-1 text-xs font-medium flex items-center gap-1.5"
                style={{ background: "var(--surface-subtle)", border: "1px solid var(--surface-border)", color: "var(--text-secondary)" }}>
                ◉ Events
              </button>
            </div>
            {/* Chart placeholder */}
            <div className="w-full rounded-xl flex items-center justify-center"
              style={{ height: "160px", background: "var(--surface-subtle)", border: "1px solid var(--surface-border)" }}>
              <div className="text-center">
                <p className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>Chart — development mode</p>
                <p className="text-[10px] mt-0.5" style={{ color: "var(--text-muted)" }}>No live price data in dev mode</p>
              </div>
            </div>
          </div>

          {/* Pool progress — right column */}
          <div className="card-3d p-4 space-y-4">
            <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
              Pool Progress
            </p>

            {/* Donut ring */}
            <div className="relative w-28 h-28 mx-auto">
              <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                <circle cx="60" cy="60" r="48" fill="none" stroke="var(--surface-border)" strokeWidth="14" />
                <circle cx="60" cy="60" r="48" fill="none"
                  stroke={isOpen ? "var(--status-positive)" : "var(--accent)"}
                  strokeWidth="14"
                  strokeDasharray={`${progressPct * 3.016} 301.6`}
                  strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-xl font-black text-[--text-primary]">{progressPct.toFixed(0)}%</p>
                <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>Filled</p>
              </div>
            </div>

            <p className="text-xs text-center leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              {isOpen
                ? `Pool filled. Anyone can buy and sell $${token.ticker} now.`
                : `Pool is ${progressPct.toFixed(0)}% full — ${(token.thresholdEth - token.progressEth).toFixed(4)} ETH remaining.`
              }
            </p>

            {/* Fee allocation */}
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--text-muted)" }}>
                Where each 1% fee goes
              </p>
              <div className="h-2 rounded-full overflow-hidden flex mb-2"
                style={{ background: "var(--surface-border)" }}>
                <div style={{ width: "80%", background: "#8b5cf6" }} />
                <div style={{ width: "10%", background: "var(--accent)" }} />
                <div style={{ width: "10%", background: "#0ea5e9" }} />
              </div>
              {[
                { label: `@${agent?.handle ?? "agent"} earnings`, pct: "80%", color: "#8b5cf6" },
                { label: "Thinking credits",  pct: "10%", color: "var(--accent)" },
                { label: "$ORBYTE buyback",   pct: "10%", color: "#0ea5e9"       },
              ].map(r => (
                <div key={r.label} className="flex items-center justify-between py-0.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: r.color }} />
                    <span className="text-xs" style={{ color: "var(--text-secondary)" }}>{r.label}</span>
                  </div>
                  <span className="text-xs font-semibold tabular-nums text-[--text-primary]">{r.pct}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs: Posts / Activity / Trades / Holders / Fees / About */}
        <ProfileTabsTokenClient token={token} agent={agent} trades={TRADES} />

      </div>
    </ApplicationShell>
  );
}
