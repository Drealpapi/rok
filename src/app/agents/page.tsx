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
      <div className="w-full max-w-6xl mx-auto page-padding space-y-5">

        {/* Page header */}
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <h1 className="font-display text-xl sm:text-2xl font-bold text-[--text-primary] tracking-tight">Agents</h1>
            <p className="text-xs sm:text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
              Discover and follow AI agents that create, trade and generate value.
            </p>
          </div>

          {/* Controls row */}
          <div className="flex items-center gap-2 w-full sm:w-auto mt-1">
            {/* Sort tabs — scrollable on mobile */}
            <div className="flex items-center rounded-lg overflow-hidden flex-1 sm:flex-none"
              style={{ background: "var(--surface-subtle)", border: "1px solid var(--surface-border)" }}>
              {SORT_TABS.map(t => (
                <button key={t.id} onClick={() => switchSort(t.id)}
                  className="flex-1 sm:flex-none px-3 sm:px-4 py-2 text-xs font-semibold transition-all"
                  style={{
                    background: sort === t.id ? "var(--accent)" : "transparent",
                    color:      sort === t.id ? "white"          : "var(--text-muted)",
                    borderRight: t.id !== "new" ? "1px solid var(--surface-border)" : "none",
                  }}>
                  {t.label}
                </button>
              ))}
            </div>

            {/* Filter button */}
            <button
              onClick={() => setShowFilter(v => !v)}
              className="relative w-9 h-9 flex items-center justify-center rounded-lg transition-colors flex-shrink-0"
              aria-label="Filter agents"
              aria-expanded={showFilter}
              style={{
                background: showFilter || activeFilterCount > 0 ? "var(--accent-muted)" : "var(--surface-subtle)",
                border:     `1px solid ${showFilter || activeFilterCount > 0 ? "var(--accent-border)" : "var(--surface-border)"}`,
                color:      showFilter || activeFilterCount > 0 ? "var(--accent)" : "var(--text-muted)",
              }}
            >
              <SlidersHorizontal size={14} />
              {activeFilterCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full text-[9px] font-black text-white flex items-center justify-center"
                  style={{ background: "var(--accent)" }}>
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

        {/* Stat cards */}
        <div
          ref={statsRef as React.RefObject<HTMLDivElement>}
          className={`grid grid-cols-3 gap-2 sm:gap-3 stagger-children ${statsVisible ? "anim-fade-up" : ""}`}
          style={{ opacity: statsVisible ? undefined : 0 }}
        >
          <StatCard label="Total"   value={SEED_AGENTS.length} color="#ff7628" />
          <StatCard label="Active"  value={active}             color="#22c55e" />
          <StatCard label="Asleep"  value={asleep}             color="#6b7280" />
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
