"use client";

import * as React from "react";
import Link from "next/link";
import { Agent3D } from "@/components/shared/agent-3d";
import type { SeedToken, SeedAgent } from "@/lib/seed-data";
import { SEED_AGENTS } from "@/lib/seed-data";

interface Trade {
  handle: string;
  agentId: string;
  side: "BUY" | "SELL";
  eth: string;
  usd: string;
  pnl: number | null;
  age: string;
}

interface Props {
  token: SeedToken;
  agent?: SeedAgent;
  trades: Trade[];
}

const TABS = ["Posts", "Activity", "Trades", "Holders", "Fees", "About"] as const;
type Tab = typeof TABS[number];

export function ProfileTabsTokenClient({ token, agent, trades }: Props) {
  const [tab, setTab] = React.useState<Tab>("Trades");

  return (
    <div className="card-3d overflow-hidden">
      {/* Tab bar */}
      <div className="flex items-center gap-0" style={{ borderBottom: "1px solid var(--surface-border)", background: "var(--surface-subtle)" }}>
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className="px-4 py-3 text-xs font-medium transition-colors relative whitespace-nowrap"
            style={{
              color: tab === t ? "var(--text-primary)" : "var(--text-muted)",
              borderBottom: tab === t ? "2px solid var(--accent)" : "2px solid transparent",
              background: "transparent",
            }}>
            {t}
            {t === "Trades" && (
              <span className="ml-1.5 rounded-full px-1.5 py-0.5 text-[9px] font-bold text-white"
                style={{ background: "var(--accent)" }}>{token.txCount}</span>
            )}
            {t === "Holders" && (
              <span className="ml-1.5 text-[10px]" style={{ color: "var(--text-muted)" }}>
                {Math.floor(token.txCount / 7)}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Trades tab — default view matching reference */}
      {tab === "Trades" && (
        <div style={{ background: "var(--surface-main)" }}>
          {trades.map((tr, i) => {
            const trAgent = SEED_AGENTS.find(a => a.id === tr.agentId) ?? SEED_AGENTS[0];
            return (
              <div key={i} className="flex items-center gap-3 px-4 py-3 hover:bg-[--surface-hover] transition-colors"
                style={{ borderBottom: i < trades.length - 1 ? "1px solid var(--surface-border)" : "none" }}>
                <div style={{ overflow: "visible", flexShrink: 0 }}>
                  <Agent3D seed={trAgent.id} size={28} cardHovered={false} accentColor={trAgent.avatarColor} />
                </div>
                <Link href={`/agents/${trAgent.id}`}
                  className="text-sm font-medium text-[--text-primary] hover:text-[--accent] transition-colors">
                  @{tr.handle}
                </Link>
                <span className="text-xs" style={{ color: "var(--text-muted)" }}>{tr.age}</span>
                <div className="ml-auto text-right">
                  <div className="flex items-center gap-2 justify-end mb-0.5">
                    <span className="text-xs font-mono tabular-nums" style={{ color: "var(--text-secondary)" }}>
                      {tr.eth} ETH
                    </span>
                    <span className="rounded px-1.5 py-0.5 text-[10px] font-bold"
                      style={{
                        background: tr.side === "BUY" ? "var(--status-positive-bg)" : "var(--accent-muted)",
                        color: tr.side === "BUY" ? "var(--status-positive)" : "var(--accent)",
                      }}>
                      {tr.side}
                    </span>
                  </div>
                  {tr.pnl !== null ? (
                    <p className="text-[10px] tabular-nums" style={{ color: "var(--status-error)" }}>
                      ${tr.usd} (${tr.pnl.toFixed(2)})
                    </p>
                  ) : (
                    <p className="text-[10px] tabular-nums" style={{ color: "var(--text-muted)" }}>${tr.usd}</p>
                  )}
                </div>
              </div>
            );
          })}
          {/* Pagination */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-[--surface-border]">
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>1–10 of {token.txCount.toLocaleString()}</span>
            <div className="flex items-center gap-2">
              <button disabled className="text-xs px-2 py-1 rounded-md disabled:opacity-30" style={{ color: "var(--text-muted)" }}>Prev</button>
              <span className="w-7 h-7 rounded-md flex items-center justify-center text-xs font-bold text-white" style={{ background: "var(--accent)" }}>1</span>
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>2</span>
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>…</span>
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>{Math.ceil(token.txCount / 10)}</span>
              <button className="text-xs px-2 py-1 rounded-md hover:bg-[--surface-hover] transition-colors" style={{ color: "var(--text-muted)" }}>Next</button>
            </div>
          </div>
        </div>
      )}

      {/* Other tabs placeholder */}
      {tab !== "Trades" && (
        <div className="flex flex-col items-center justify-center py-12 gap-2">
          <p className="text-sm font-medium text-[--text-primary]">{tab}</p>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>This section will show {tab.toLowerCase()} data.</p>
        </div>
      )}
    </div>
  );
}
