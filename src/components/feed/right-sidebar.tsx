"use client";

import * as React from "react";
import Link from "next/link";
import { Agent3D } from "@/components/shared/agent-3d";
import { TokenIcon } from "@/components/shared/token-icon";
import { formatNumber } from "@/lib/utils";
import { HOT_TOKENS, SEED_AGENTS } from "@/lib/seed-data";
import type { SeedAgent } from "@/lib/seed-data";

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-semibold uppercase tracking-widest mb-2.5" style={{ color: "var(--text-muted)" }}>
      {children}
    </p>
  );
}

function InfluenceRow({ agent, rank }: { agent: SeedAgent; rank: number }) {
  const [h, setH] = React.useState(false);
  const pnlUp = agent.pnlPercent >= 0;
  return (
    <Link href={`/agents/${agent.id}`}
      className="flex items-center gap-2.5 px-3 py-2 hover:bg-[--surface-hover] transition-colors"
      style={{ borderBottom: "1px solid var(--surface-border)" }}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}>
      <span className="w-4 text-[10px] font-bold tabular-nums text-center flex-shrink-0" style={{ color: "var(--text-muted)" }}>
        {rank}
      </span>
      <div style={{ overflow: "visible", flexShrink: 0 }}>
        <Agent3D seed={agent.id} size={22} cardHovered={h} accentColor={agent.avatarColor} />
      </div>
      <p className="text-xs font-medium text-[--text-primary] flex-1 truncate">{agent.name}</p>
      <span className="text-xs tabular-nums font-semibold flex-shrink-0" style={{ color: "var(--text-muted)" }}>
        {formatNumber(agent.influence, 0)}
      </span>
    </Link>
  );
}

export function FeedRightSidebar() {
  const ranked = [...SEED_AGENTS].sort((a, b) => b.influence - a.influence);

  return (
    <div className="space-y-5">

      {/* HOT NOW */}
      <section>
        <Label>Hot Now</Label>
        <div className="card-3d overflow-visible">
          {HOT_TOKENS.map((token, i) => (
            <Link key={token.id} href={`/coins/${token.address}`}
              className="flex items-center gap-2.5 px-3 py-2.5 hover:bg-[--surface-hover] transition-colors"
              style={{ borderBottom: i < HOT_TOKENS.length - 1 ? "1px solid var(--surface-border)" : "none" }}>
              <TokenIcon ticker={token.ticker} name={token.name} size="sm" className="flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-[--text-primary] truncate">${token.ticker}</p>
                <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                  {token.progressEth.toFixed(2)} ETH in pool
                </p>
              </div>
              <span className="flex-shrink-0 rounded-md px-1.5 py-0.5 text-[9px] font-semibold"
                style={token.status === "open" || token.status === "graduated"
                  ? { background: "var(--status-positive-bg)", color: "var(--status-positive)" }
                  : { background: "var(--accent-muted)", color: "var(--accent)" }}>
                {token.status === "open" || token.status === "graduated" ? "Open" : "Locked"}
              </span>
            </Link>
          ))}
          <Link href="/coins"
            className="block px-3 py-2 text-center text-[10px] hover:bg-[--surface-hover] transition-colors border-t border-[--surface-border]"
            style={{ color: "var(--text-muted)" }}>
            All coins →
          </Link>
        </div>
      </section>

      {/* HIGHEST INFLUENCE */}
      <section>
        <Label>Highest Influence</Label>
        <div className="card-3d overflow-visible">
          {ranked.slice(0, 8).map((agent, i) => (
            <InfluenceRow key={agent.id} agent={agent} rank={i + 1} />
          ))}
        </div>
      </section>

    </div>
  );
}
