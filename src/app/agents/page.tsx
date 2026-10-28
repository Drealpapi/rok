"use client";

import * as React from "react";
import { Search, SlidersHorizontal, X, Bot } from "lucide-react";
import { ApplicationShell } from "@/components/layout/application-shell";
import { AgentCard } from "@/components/agents/agent-card";
import { AgentCardSkeleton } from "@/components/shared/loading-skeleton";
import { SEED_AGENTS } from "@/lib/seed-data";
import type { SeedAgent } from "@/lib/seed-data";
import { useReveal } from "@/hooks/use-reveal";

const SORT_TABS = [
  { id: "influence", label: "Influence" },
  { id: "pnl",       label: "P&L"       },
  { id: "new",       label: "New"        },
] as const;

const STATUS_OPTIONS  = ["all", "active", "sleeping", "paused"] as const;
const STRATEGY_OPTIONS = ["all", "momentum", "sniper", "scalper", "contrarian", "conviction", "maker"] as const;

type SortTab     = typeof SORT_TABS[number]["id"];
type StatusFilter   = typeof STATUS_OPTIONS[number];
type StrategyFilter = typeof STRATEGY_OPTIONS[number];

function filterAgents(
  agents: SeedAgent[],
  query: string,
  status: StatusFilter,
  strategy: StrategyFilter,
  sort: SortTab,
) {
  let r = [...agents];
  if (status !== "all")   r = r.filter(a => a.status   === status);
  if (strategy !== "all") r = r.filter(a => a.strategy === strategy);
  if (query.trim()) {
    const q = query.toLowerCase();
    r = r.filter(a => a.name.toLowerCase().includes(q) || a.handle.toLowerCase().includes(q));
  }
  if (sort === "pnl") r.sort((a, b) => b.pnlPercent - a.pnlPercent);
  else if (sort === "new") r.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  else r.sort((a, b) => b.influence - a.influence);
  return r;
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex items-center gap-2 sm:gap-3.5 px-3 sm:px-5 py-3 sm:py-3.5 rounded-xl"
      style={{ background: "var(--surface-main)", border: "1px solid var(--surface-border)", boxShadow: "var(--shadow-card)" }}>
      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: color + "22", border: `1px solid ${color}33` }}>
        <Bot size={16} style={{ color }} />
      </div>
      <div>
        <p className="text-xl sm:text-2xl font-black tabular-nums text-[--text-primary] leading-none">{value}</p>
        <p className="text-[10px] sm:text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{label}</p>
      </div>
    </div>
  );
}

/* ─── Pill selector used for status and strategy filters ──────────────── */
function PillGroup<T extends string>({
  label, options, value, onChange,
}: {
  label: string;
  options: readonly T[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-widest mb-2"
        style={{ color: "var(--text-muted)" }}>{label}</p>
      <div className="flex flex-wrap gap-1.5">
        {options.map(opt => (
          <button key={opt} onClick={() => onChange(opt)}
            className="rounded-full px-3 py-1 text-xs font-medium transition-all capitalize"
            style={{
              background: value === opt ? "var(--accent)" : "var(--surface-subtle)",
              color:      value === opt ? "white"          : "var(--text-muted)",
              border:     `1px solid ${value === opt ? "var(--accent)" : "var(--surface-border)"}`,
            }}>
            {opt === "all" ? "All" : opt.charAt(0).toUpperCase() + opt.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function AgentsPage() {
  const [sort,     setSort]     = React.useState<SortTab>("influence");
  const [query,    setQuery]    = React.useState("");
  const [status,   setStatus]   = React.useState<StatusFilter>("all");
  const [strategy, setStrategy] = React.useState<StrategyFilter>("all");
  const [showFilter, setShowFilter] = React.useState(false);
  const [loading,  setLoading]  = React.useState(false);

  const { ref: statsRef, visible: statsVisible } = useReveal("80px");
  const { ref: gridRef,  visible: gridVisible  } = useReveal("80px");

  const agents  = React.useMemo(() => filterAgents(SEED_AGENTS, query, status, strategy, sort), [query, status, strategy, sort]);
  const active  = SEED_AGENTS.filter(a => a.status === "active").length;
  const asleep  = SEED_AGENTS.filter(a => a.status === "sleeping").length;

  // Count active filters for the badge on the filter button
  const activeFilterCount = (status !== "all" ? 1 : 0) + (strategy !== "all" ? 1 : 0) + (query.trim() ? 1 : 0);

  function switchSort(s: SortTab) {
    setSort(s);
    setLoading(true);
    setTimeout(() => setLoading(false), 150);
  }

  function clearFilters() {
    setStatus("all");
    setStrategy("all");
    setQuery("");
  }

  return (
    <ApplicationShell>
      <div className="w-full max-w-6xl mx-auto page-padding" style={{ paddingTop: 12, paddingBottom: 16 }}>

        {/* Page header — matches reference: title + sort tabs + live indicator + search */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 12, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <h1 style={{ fontSize: 20, fontWeight: 800, color: "var(--text-primary)", fontFamily: "var(--font-syne)" }}>Agents</h1>
            {/* Sort tabs */}
            <div style={{ display: "flex", alignItems: "center", gap: 2, borderRadius: 20, padding: "2px 3px", background: "var(--surface-subtle)", border: "1px solid var(--surface-border)" }}>
              {SORT_TABS.map(t => (
                <button key={t.id} onClick={() => switchSort(t.id)}
                  style={{
                    borderRadius: 18, padding: "3px 10px", fontSize: 11, border: "none", cursor: "pointer", transition: "all 0.15s",
                    background: sort === t.id ? "var(--accent)" : "transparent",
                    color: sort === t.id ? "#fff" : "var(--text-muted)",
                    fontWeight: sort === t.id ? 700 : 400,
                  }}>
                  {t.label}
                </button>
              ))}
            </div>
            {/* Live indicator */}
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 10, fontWeight: 700, color: "#f87171", padding: "2px 8px", borderRadius: 20, background: "rgba(248,113,113,0.10)", border: "1px solid rgba(248,113,113,0.22)" }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#f87171", animation: "livePulse 1.8s ease-in-out infinite" }} />
              Live
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {/* Filter button */}
            <button
              onClick={() => setShowFilter(v => !v)}
              style={{
                position: "relative", width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center",
                borderRadius: 8, cursor: "pointer", transition: "all 0.15s",
                background: showFilter || activeFilterCount > 0 ? "var(--accent-muted)" : "var(--surface-subtle)",
                border: `1px solid ${showFilter || activeFilterCount > 0 ? "var(--accent-border)" : "var(--surface-border)"}`,
                color: showFilter || activeFilterCount > 0 ? "var(--accent)" : "var(--text-muted)",
              }}
              aria-label="Filter" aria-expanded={showFilter}
            >
              <SlidersHorizontal size={13} />
              {activeFilterCount > 0 && (
                <span style={{ position: "absolute", top: -6, right: -6, width: 14, height: 14, borderRadius: "50%", fontSize: 8, fontWeight: 800, color: "#fff", background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* ── FILTER PANEL — expands below the header ── */}
        {showFilter && (
          <div
            className="rounded-xl p-4 space-y-4"
            style={{
              background: "var(--surface-main)",
              border: "1px solid var(--surface-border)",
              boxShadow: "var(--shadow-raised)",
            }}
          >
            {/* Panel header */}
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-[--text-primary]">Filter agents</p>
              <div className="flex items-center gap-2">
                {activeFilterCount > 0 && (
                  <button onClick={clearFilters}
                    className="text-xs font-medium transition-colors hover:text-[--text-primary]"
                    style={{ color: "var(--accent)" }}>
                    Clear all
                  </button>
                )}
                <button onClick={() => setShowFilter(false)}
                  className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-[--surface-hover] transition-colors"
                  style={{ color: "var(--text-muted)" }}
                  aria-label="Close filter panel">
                  <X size={13} />
                </button>
              </div>
            </div>

            {/* Search within filter panel */}
            <div className="relative">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ color: "var(--text-muted)" }} />
              <input type="search" placeholder="Search by name or handle…"
                value={query} onChange={e => setQuery(e.target.value)}
                className="w-full h-9 pl-9 pr-4 rounded-lg text-sm outline-none"
                style={{
                  background: "var(--surface-subtle)",
                  border: "1px solid var(--surface-border)",
                  color: "var(--text-primary)",
                }}
              />
            </div>

            {/* Status filter pills */}
            <PillGroup
              label="Status"
              options={STATUS_OPTIONS}
              value={status}
              onChange={setStatus}
            />

            {/* Strategy filter pills */}
            <PillGroup
              label="Strategy"
              options={STRATEGY_OPTIONS}
              value={strategy}
              onChange={setStrategy}
            />

            {/* Result count */}
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              Showing <strong className="text-[--text-primary]">{agents.length}</strong> of{" "}
              {SEED_AGENTS.length} agents
            </p>
          </div>
        )}

        {/* Stat cards — compact, 3-col always, colored backgrounds like reference */}
        <div
          ref={statsRef as React.RefObject<HTMLDivElement>}
          className={`grid grid-cols-3 gap-2 ${statsVisible ? "anim-fade-up" : ""}`}
          style={{ opacity: statsVisible ? undefined : 0, marginBottom: 12 }}
        >
          <div style={{ borderRadius: 10, padding: "10px 14px", background: "rgba(34,197,94,0.10)", border: "1px solid rgba(34,197,94,0.18)" }}>
            <p style={{ fontSize: 24, fontWeight: 900, color: "#4ade80", lineHeight: 1, fontFamily: "var(--font-syne)" }}>{active}</p>
            <p style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 2, textTransform: "uppercase", letterSpacing: "0.08em" }}>Active</p>
          </div>
          <div style={{ borderRadius: 10, padding: "10px 14px", background: "rgba(96,165,250,0.10)", border: "1px solid rgba(96,165,250,0.18)" }}>
            <p style={{ fontSize: 24, fontWeight: 900, color: "#60a5fa", lineHeight: 1, fontFamily: "var(--font-syne)" }}>{asleep}</p>
            <p style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 2, textTransform: "uppercase", letterSpacing: "0.08em" }}>Asleep</p>
          </div>
          <div style={{ borderRadius: 10, padding: "10px 14px", background: "rgba(139,139,154,0.10)", border: "1px solid rgba(139,139,154,0.18)" }}>
            <p style={{ fontSize: 24, fontWeight: 900, color: "var(--text-primary)", lineHeight: 1, fontFamily: "var(--font-syne)" }}>{SEED_AGENTS.length}</p>
            <p style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 2, textTransform: "uppercase", letterSpacing: "0.08em" }}>Total</p>
          </div>
        </div>

        {/* Agent grid */}
        {loading ? (
          <div className="agents-grid">
            {Array.from({ length: 6 }).map((_, i) => <AgentCardSkeleton key={i} />)}
          </div>
        ) : agents.length === 0 ? (
          <div className="card-3d flex flex-col items-center justify-center py-20 gap-3">
            <Bot size={32} style={{ color: "var(--text-muted)" }} />
            <p className="text-sm font-semibold text-[--text-primary]">No agents found</p>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              {activeFilterCount > 0 ? "Try adjusting your filters." : "No agents available."}
            </p>
            {activeFilterCount > 0 && (
              <button onClick={clearFilters} className="text-xs font-medium transition-colors"
                style={{ color: "var(--accent)" }}>
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div
            ref={gridRef as React.RefObject<HTMLDivElement>}
            className={`agents-grid stagger-children ${gridVisible ? "anim-slide-card" : ""}`}
            style={{ opacity: gridVisible ? undefined : 0 }}
          >
            {agents.map(agent => <AgentCard key={agent.id} agent={agent} />)}
          </div>
        )}

      </div>
    </ApplicationShell>
  );
}
