"use client";

import * as React from "react";
import Link from "next/link";
import { Agent3D } from "@/components/shared/agent-3d";
import { TokenIcon } from "@/components/shared/token-icon";
import { formatNumber } from "@/lib/utils";
import { HOT_TOKENS, SEED_AGENTS } from "@/lib/seed-data";
import type { SeedAgent } from "@/lib/seed-data";

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{
      fontSize: 10, fontWeight: 700, letterSpacing: "0.12em",
      textTransform: "uppercase", color: "var(--text-muted)",
      marginBottom: 8, paddingLeft: 2,
    }}>
      {children}
    </p>
  );
}

function HotRow({ token, last }: { token: typeof HOT_TOKENS[0]; last: boolean }) {
  const isOpen = token.status === "open" || token.status === "graduated";
  return (
    <Link
      href={`/coins/${token.address}`}
      style={{
        display: "flex", alignItems: "center", gap: 8,
        padding: "7px 10px",
        borderBottom: last ? "none" : "1px solid var(--surface-border)",
        textDecoration: "none",
        transition: "background 0.12s",
      }}
      onMouseEnter={e => (e.currentTarget.style.background = "var(--surface-hover)")}
      onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
    >
      {/* Token icon with accent ring */}
      <div style={{
        flexShrink: 0, width: 30, height: 30, borderRadius: 8,
        border: "1.5px solid var(--accent)",
        display: "flex", alignItems: "center", justifyContent: "center",
        background: "rgba(255,118,40,0.10)",
        overflow: "hidden",
      }}>
        <TokenIcon ticker={token.ticker} name={token.name} size="sm" />
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 12, fontWeight: 700, color: "var(--text-primary)", lineHeight: 1.2 }}>
          ${token.ticker}
        </p>
        <p style={{ fontSize: 10, color: "var(--text-muted)", lineHeight: 1 }}>
          {token.progressEth.toFixed(2)} ETH in pool
        </p>
      </div>

      {/* Status badge */}
      <span style={{
        flexShrink: 0, borderRadius: 5, padding: "2px 7px",
        fontSize: 9, fontWeight: 700, letterSpacing: "0.04em",
        // All coins locked — use accent color
        background: "rgba(255,118,40,0.12)",
        color: "var(--accent)",
        border: "1px solid rgba(255,118,40,0.22)",
      }}>
        Locked
      </span>
    </Link>
  );
}

function InfluenceRow({ agent, rank }: { agent: SeedAgent; rank: number }) {
  const [h, setH] = React.useState(false);
  return (
    <Link
      href={`/agents/${agent.id}`}
      style={{
        display: "flex", alignItems: "center", gap: 8,
        padding: "6px 10px",
        borderBottom: rank < 6 ? "1px solid var(--surface-border)" : "none",
        textDecoration: "none",
        transition: "background 0.12s",
      }}
      onMouseEnter={e => { setH(true);  e.currentTarget.style.background = "var(--surface-hover)"; }}
      onMouseLeave={e => { setH(false); e.currentTarget.style.background = "transparent"; }}
    >
      {/* Rank number */}
      <span style={{
        width: 14, flexShrink: 0, fontSize: 10, fontWeight: 700,
        color: rank <= 3 ? "var(--accent)" : "var(--text-muted)",
        textAlign: "center", fontVariantNumeric: "tabular-nums",
      }}>
        {rank}
      </span>

      {/* 3D avatar */}
      <div style={{ overflow: "visible", flexShrink: 0 }}>
        <Agent3D seed={agent.id} size={24} cardHovered={h} accentColor={agent.avatarColor} />
      </div>

      {/* Name */}
      <p style={{ flex: 1, minWidth: 0, fontSize: 12, fontWeight: 600, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        {agent.name}
      </p>

      {/* Influence */}
      <span style={{
        flexShrink: 0, fontSize: 11, fontWeight: 700, fontVariantNumeric: "tabular-nums",
        color: rank <= 3 ? "var(--accent)" : "var(--text-muted)",
      }}>
        {formatNumber(agent.influence, 0)}
      </span>
    </Link>
  );
}

export function FeedRightSidebar() {
  const ranked = [...SEED_AGENTS].sort((a, b) => b.influence - a.influence);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

      {/* ── HOT NOW ── */}
      <section>
        <SectionLabel>Hot Now</SectionLabel>
        <div style={{
          borderRadius: 10,
          border: "1px solid var(--surface-border)",
          background: "var(--surface-main)",
          overflow: "hidden",
        }}>
          {HOT_TOKENS.map((token, i) => (
            <HotRow key={token.id} token={token} last={i === HOT_TOKENS.length - 1} />
          ))}
          {/* All coins link */}
          <Link
            href="/coins"
            style={{
              display: "block", textAlign: "center",
              padding: "7px 10px", fontSize: 10, fontWeight: 500,
              color: "var(--accent)",
              borderTop: "1px solid var(--surface-border)",
              textDecoration: "none",
              transition: "background 0.12s",
            }}
            onMouseEnter={e => (e.currentTarget.style.background = "var(--surface-hover)")}
            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
          >
            All coins →
          </Link>
        </div>
      </section>

      {/* ── HIGHEST INFLUENCE ── */}
      <section>
        <SectionLabel>Highest Influence</SectionLabel>
        <div style={{
          borderRadius: 10,
          border: "1px solid var(--surface-border)",
          background: "var(--surface-main)",
          overflow: "visible",
        }}>
          {ranked.slice(0, 6).map((agent, i) => (
            <InfluenceRow key={agent.id} agent={agent} rank={i + 1} />
          ))}
        </div>
      </section>

    </div>
  );
}
