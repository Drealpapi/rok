"use client";

import * as React from "react";
import { Search } from "lucide-react";
import { ApplicationShell } from "@/components/layout/application-shell";
import { TokenCard } from "@/components/coins/token-card";
import { TokenCardSkeleton } from "@/components/shared/loading-skeleton";
import { NewCoinEntry, useNewCoins } from "@/components/coins/new-coin-entry";
import { SEED_TOKENS, SEED_AGENTS, isJustLaunched, isHot } from "@/lib/seed-data";
import type { SeedToken } from "@/lib/seed-data";
import { usePageReveal } from "@/hooks/use-reveal";

type Tab = "new" | "graduating" | "marketcap";

function filterTokens(tab: Tab, query: string, tokens: SeedToken[]) {
  let r = [...tokens];
  if (tab === "new") r.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  else if (tab === "graduating") r = r.filter(t => t.status === "locked").sort((a, b) => b.progressEth / b.thresholdEth - a.progressEth / a.thresholdEth);
  else r.sort((a, b) => b.marketCapUsd - a.marketCapUsd);
  if (query.trim()) {
    const q = query.toLowerCase();
    r = r.filter(t => t.name.toLowerCase().includes(q) || t.ticker.toLowerCase().includes(q) || t.address.toLowerCase().includes(q));
  }
  return r;
}

const TABS: { id: Tab; label: string }[] = [
  { id: "new",        label: "New"             },
  { id: "graduating", label: "Graduating soon" },
  { id: "marketcap",  label: "Market cap"      },
];

export default function CoinsPage() {
  const [tab, setTab]     = React.useState<Tab>("new");
  const [query, setQuery] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [allTokens]       = React.useState(() => [...SEED_TOKENS]);
  const ready = usePageReveal(50);

  const agentMap  = React.useMemo(() => Object.fromEntries(SEED_AGENTS.map(a => [a.id, a])), []);
  const coinIds   = React.useMemo(() => allTokens.map(t => t.id), [allTokens]);
  const newCoinIds = useNewCoins(coinIds);
  const tokens    = React.useMemo(() => filterTokens(tab, query, allTokens), [tab, query, allTokens]);

  function switchTab(t: Tab) { setTab(t); setLoading(true); setTimeout(() => setLoading(false), 180); }

  return (
    <ApplicationShell>
      <div
        className={ready ? "anim-fade-up" : ""}
        style={{ opacity: ready ? undefined : 0, animationDuration: "0.4s" }}
      >
      <div className="max-w-6xl w-full mx-auto page-padding space-y-4">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-semibold text-[--text-primary]">Coins</h1>
            <div className="flex items-center rounded-lg p-0.5 gap-0.5 bg-[--surface-subtle] border border-[--surface-border]">
              {TABS.map(t => (
                <button key={t.id} onClick={() => switchTab(t.id)}
                  className="rounded-md px-2.5 sm:px-3 py-1.5 text-xs transition-all whitespace-nowrap"
                  style={{
                    background: tab === t.id ? "var(--surface-main)" : "transparent",
                    color: tab === t.id ? "var(--text-primary)" : "var(--text-muted)",
                    fontWeight: tab === t.id ? 600 : 400,
                    boxShadow: tab === t.id ? "var(--shadow-card)" : "none",
                  }}>
                  {t.label}
                </button>
              ))}
            </div>
          </div>
          <div className="relative w-full sm:w-auto">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--text-muted)" }} />
            <input type="search" placeholder="Search name, ticker, or address" value={query} onChange={e => setQuery(e.target.value)}
              className="pl-8 pr-3 h-9 rounded-lg text-xs outline-none w-full sm:w-56"
              style={{ background: "var(--surface-subtle)", border: "1px solid var(--surface-border)", color: "var(--text-primary)" }} />
          </div>
        </div>

        <p className="text-xs text-[--text-muted]">{tokens.length} coins · launched by agents on ORBYTE</p>

        {loading ? (
          <div className="coins-grid">
            {Array.from({ length: 8 }).map((_, i) => <TokenCardSkeleton key={i} />)}
          </div>
        ) : tokens.length === 0 ? (
          <div className="card-3d flex flex-col items-center justify-center py-16">
            <p className="text-sm font-medium text-[--text-primary]">No coins found</p>
            <p className="text-xs text-[--text-muted] mt-1">Try adjusting your search.</p>
          </div>
        ) : (
          <div className="coins-grid">
            {tokens.map((token, idx) => {
              const isRuntimeNew = newCoinIds.has(token.id);
              const isSeedNew    = !isRuntimeNew && isJustLaunched(token.createdAt);
              return (
                <div key={token.id}
                  className="anim-slide-card"
                  style={{ animationDelay: `${Math.min(idx * 0.10, 0.9)}s` }}
                >
                  <NewCoinEntry isNew={isRuntimeNew} launchDelay={isRuntimeNew ? 0 : idx * 60} showNewBadge={isSeedNew}>
                    <TokenCard token={token} agent={agentMap[token.launchingAgentId]} />
                  </NewCoinEntry>
                </div>
              );
            })}
          </div>
        )}

        {!loading && tokens.length > 0 && (
          <div className="flex items-center justify-between pb-4">
            <span className="text-xs text-[--text-muted]">1–{tokens.length} of {tokens.length}</span>
            <div className="flex items-center gap-2">
              <button disabled className="text-xs px-2 py-1 rounded-md text-[--text-muted] disabled:opacity-40">Prev</button>
              <span className="w-7 h-7 rounded-md flex items-center justify-center text-xs font-semibold text-white"
                style={{ background: "var(--accent)" }}>1</span>
              <button className="text-xs px-2 py-1 rounded-md text-[--text-muted] hover:bg-[--surface-hover] transition-colors">Next</button>
            </div>
          </div>
        )}

      </div>
      </div>
    </ApplicationShell>
  );
}