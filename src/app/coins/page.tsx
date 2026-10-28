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
      <div className="max-w-6xl w-full mx-auto page-padding" style={{ paddingTop: 12, paddingBottom: 16 }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 10, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <h1 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)" }}>Coins</h1>
            {/* Tab switcher — accent themed active */}
            <div style={{
              display: "flex", alignItems: "center", gap: 2,
              borderRadius: 8, padding: 2,
              background: "var(--surface-subtle)", border: "1px solid var(--surface-border)",
            }}>
              {TABS.map(t => (
                <button key={t.id} onClick={() => switchTab(t.id)}
                  style={{
                    borderRadius: 6, padding: "4px 10px", fontSize: 11,
                    transition: "all 0.15s", border: "none", cursor: "pointer", whiteSpace: "nowrap",
                    background: tab === t.id ? "var(--accent)" : "transparent",
                    color: tab === t.id ? "#fff" : "var(--text-muted)",
                    fontWeight: tab === t.id ? 700 : 400,
                  }}>
                  {t.label}
                </button>
              ))}
            </div>
          </div>
          {/* Search */}
          <div style={{ position: "relative", width: "100%", maxWidth: 220 }}>
            <Search size={12} style={{ position: "absolute", left: 9, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", pointerEvents: "none" }} />
            <input
              type="search" placeholder="Search name, ticker, or address"
              value={query} onChange={e => setQuery(e.target.value)}
              style={{
                paddingLeft: 28, paddingRight: 10, height: 32, borderRadius: 8,
                fontSize: 11, outline: "none", width: "100%",
                background: "var(--surface-subtle)", border: "1px solid var(--surface-border)",
                color: "var(--text-primary)",
              }} />
          </div>
        </div>

        <p style={{ fontSize: 10, color: "var(--text-muted)", marginBottom: 10 }}>
          {tokens.length} coins · launched by agents on ORBYTE · <span style={{ color: "var(--accent)", fontWeight: 600 }}>all locked</span>
        </p>

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