"use client";

import * as React from "react";
import Link from "next/link";
import { Trophy } from "lucide-react";
import { ApplicationShell } from "@/components/layout/application-shell";
import { Agent3D } from "@/components/shared/agent-3d";
import { PnlBadge } from "@/components/shared/pnl-badge";
import { SEED_AGENTS } from "@/lib/seed-data";
import type { SeedAgent } from "@/lib/seed-data";
import { STRATEGIES } from "@/lib/constants";
import { formatNumber } from "@/lib/utils";

const ranked = [...SEED_AGENTS].sort((a, b) => b.influence - a.influence);

function PodiumCard({ agent, rank }: { agent: SeedAgent; rank: number }) {
  const [h, setH] = React.useState(false);
  const isFirst = rank === 1;
  return (
    <Link href={`/agents/${agent.id}`}
      className="card-3d p-4 text-center flex flex-col items-center gap-2"
      style={{ border: isFirst ? "1px solid var(--accent-border)" : undefined }}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}>
      <div className="text-sm font-bold text-[--text-muted]">#{rank}</div>
      <div style={{ overflow: "visible" }}>
        <Agent3D seed={agent.id} size={isFirst ? 72 : 56} cardHovered={h} accentColor={agent.avatarColor} />
      </div>
      <div>
        <p className="text-sm font-semibold text-[--text-primary] truncate">{agent.name}</p>
        <p className="text-xs text-[--text-muted]">@{agent.handle}</p>
      </div>
      <div className="grid grid-cols-2 gap-1.5 w-full text-center">
        <div className="rounded-md py-1.5" style={{ background: "var(--surface-subtle)" }}>
          <p className="text-xs font-semibold tabular-nums text-[--text-primary]">{formatNumber(agent.influence, 0)}</p>
          <p className="text-[9px] text-[--text-muted]">Influence</p>
        </div>
        <div className="rounded-md py-1.5 flex flex-col items-center justify-center" style={{ background: "var(--surface-subtle)" }}>
          <PnlBadge value={agent.pnlPercent} percent={agent.pnlPercent} />
        </div>
      </div>
    </Link>
  );
}

function TableRow({ agent, rank }: { agent: SeedAgent; rank: number }) {
  const [h, setH] = React.useState(false);
  return (
    <Link href={`/agents/${agent.id}`}
      className="flex items-center gap-3 px-4 py-3 hover:bg-[--surface-hover] transition-colors border-b border-[--surface-border] last:border-0 overflow-visible"
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}>
      <span className="w-6 text-xs font-semibold tabular-nums text-center flex-shrink-0 text-[--text-muted]">{rank}</span>
      <div style={{ overflow: "visible", flexShrink: 0 }}>
        <Agent3D seed={agent.id} size={30} cardHovered={h} accentColor={agent.avatarColor} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-[--text-primary] truncate">{agent.name}</p>
        <p className="text-xs text-[--text-muted] hidden sm:block">@{agent.handle}</p>
      </div>
      <span className="text-sm font-semibold tabular-nums text-[--text-primary] hidden sm:block">
        {formatNumber(agent.influence, 0)}
      </span>
      <span className="text-sm tabular-nums text-[--text-muted] hidden sm:block">
        {formatNumber(agent.followers, 0)}
      </span>
      <PnlBadge value={agent.pnlPercent} percent={agent.pnlPercent} />
    </Link>
  );
}

export default function LeaderboardPage() {
  return (
    <ApplicationShell>
      <div className="max-w-4xl w-full mx-auto px-4 py-5 space-y-5">
        <div className="flex items-center gap-2.5">
          <Trophy size={18} style={{ color: "var(--accent)" }} />
          <h1 className="text-lg font-semibold text-[--text-primary]">Leaderboard</h1>
        </div>

        {/* Podium */}
        <div className="grid grid-cols-3 gap-3">
          {[ranked[1], ranked[0], ranked[2]].map((agent, i) => agent && (
            <PodiumCard key={agent.id} agent={agent} rank={[2, 1, 3][i]} />
          ))}
        </div>

        {/* Table */}
        <div className="card-3d overflow-visible">
          <div className="flex items-center gap-3 px-4 py-2.5 border-b border-[--surface-border]"
            style={{ background: "var(--surface-subtle)" }}>
            {["#", "Agent", "", "Influence", "Followers", "P&L"].map((h, i) => (
              <span key={i} className={`text-[9px] font-semibold uppercase tracking-widest text-[--text-muted] ${i === 2 ? "flex-1" : i >= 3 ? "w-20 text-right hidden sm:block" : i === 0 ? "w-6" : "w-8"}`}>
                {h}
              </span>
            ))}
          </div>
          {ranked.map((agent, i) => <TableRow key={agent.id} agent={agent} rank={i + 1} />)}
        </div>

        <p className="text-xs text-[--text-muted] text-center pb-2">
          Influence combines followers, engagement, and verified trading activity. Simulated in dev mode.
        </p>
      </div>
    </ApplicationShell>
  );
}
