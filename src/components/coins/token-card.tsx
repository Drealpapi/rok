"use client";

import * as React from "react";
import Link from "next/link";
import { Copy, Lock, Unlock, ExternalLink } from "lucide-react";
import { shortAddress, formatNumber, hashString } from "@/lib/utils";
import { Agent3D } from "@/components/shared/agent-3d";
import type { SeedToken, SeedAgent } from "@/lib/seed-data";

// Orange-spectrum accent palette — all tokens use variations of the brand accent
const ACCENTS = [
  "#ff7628","#ff8c42","#e86520","#f0a040",
  "#e06020","#ff6010","#fa8030","#f07050",
];
function getAccent(ticker: string) {
  return ACCENTS[hashString(ticker) % ACCENTS.length];
}

export function TokenCard({ token, agent }: { token: SeedToken; agent?: SeedAgent }) {
  const [copied, setCopied]           = React.useState(false);
  const [cardHovered, setCardHovered] = React.useState(false);

  const pct    = Math.min((token.progressEth / token.thresholdEth) * 100, 100);
  const isOpen = token.status === "open" || token.status === "graduated";
  const pnlUp  = token.priceChangePercent >= 0;
  const accent = getAccent(token.ticker);

  function handleCopy(e: React.MouseEvent) {
    e.preventDefault(); // don't navigate on copy
    try { navigator.clipboard.writeText(token.address); } catch { /* noop */ }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    // Entire card is a link — click anywhere to go to token detail
    <Link
      href={`/coins/${token.address}`}
      className="block card-3d overflow-visible"
      style={{ textDecoration: "none" }}
      onMouseEnter={() => setCardHovered(true)}
      onMouseLeave={() => setCardHovered(false)}
    >
      {/* Accent top bar */}
      <div className="h-0.5 w-full rounded-t-xl" style={{ background: accent }} />

      <div className="p-4">
        {/* Header: 3D agent avatar + name + status + price change */}
        <div className="flex items-start gap-3 mb-3">
          {agent && (
            <div style={{
              overflow: "visible", flexShrink: 0,
              background: `radial-gradient(circle at 50% 70%, ${accent}22 0%, transparent 70%)`,
              borderRadius: "10px", padding: "4px 2px 0 2px",
              marginTop: "-4px",
            }}>
              <Agent3D seed={agent.id} size={72} cardHovered={cardHovered} accentColor={accent} />
            </div>
          )}

          <div className="flex-1 min-w-0">
            {/* Badge row */}
            <div className="flex items-center gap-1.5 mb-1 flex-wrap">
              <span className="text-[9px] font-semibold rounded px-1.5 py-0.5"
                style={{ background: "var(--surface-subtle)", color: "var(--text-muted)" }}>V2</span>
              <span className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[9px] font-semibold"
                style={isOpen
                  ? { background: "var(--status-positive-bg)", color: "var(--status-positive)" }
                  : { background: "var(--accent-muted)", color: "var(--accent)" }}>
                {isOpen ? <Unlock size={9} /> : <Lock size={9} />}
                {isOpen ? "Open" : "Locked"}
              </span>
            </div>

            <p className="text-sm font-semibold text-[--text-primary] truncate leading-tight">{token.name}</p>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>${token.ticker}</p>
          </div>

          {/* Price change — top-right */}
          <span className="flex-shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-semibold tabular-nums"
            style={pnlUp
              ? { background: "var(--status-positive-bg)", color: "var(--status-positive)" }
              : { background: "var(--status-error-bg)", color: "var(--status-error)" }}>
            {pnlUp ? "+" : ""}{token.priceChangePercent.toFixed(1)}%
          </span>
        </div>

        {/* Address — click to copy, stops propagation */}
        <div className="flex items-center gap-1 mb-3" onClick={e => e.preventDefault()}>
          <span className="text-[11px] font-mono truncate flex-1" style={{ color: "var(--text-muted)" }}>
            {shortAddress(token.address, 5)}
          </span>
          <button
            onClick={handleCopy}
            className="p-1 rounded hover:bg-[--surface-hover] transition-colors"
            style={{ color: copied ? "var(--status-positive)" : "var(--text-muted)" }}
            aria-label="Copy address"
          >
            <Copy size={11} />
          </button>
          <span className="p-1 rounded" style={{ color: "var(--text-muted)" }}>
            <ExternalLink size={11} />
          </span>
        </div>

        {/* Pool section */}
        <div className="rounded-lg p-3 mb-3"
          style={{
            background: isOpen ? "var(--status-positive-bg)" : "var(--surface-subtle)",
            border: `1px solid ${isOpen ? "var(--status-positive-border)" : "var(--surface-border)"}`,
          }}>
          {isOpen ? (
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold" style={{ color: "var(--status-positive)" }}>Pool bonded</span>
              <span className="rounded-md px-2 py-0.5 text-[10px] font-semibold text-white"
                style={{ background: "var(--status-positive)" }}>Open</span>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs" style={{ color: "var(--text-muted)" }}>Pool</span>
                <span className="text-[10px] font-semibold tabular-nums" style={{ color: accent }}>{pct.toFixed(0)}%</span>
              </div>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-base font-bold tabular-nums text-[--text-primary]">{token.progressEth.toFixed(2)}</span>
                <span className="text-xs" style={{ color: "var(--text-muted)" }}>/ {token.thresholdEth} ETH</span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--surface-border)" }}>
                <div className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.max(pct, 1)}%`, background: accent }} />
              </div>
            </>
          )}
        </div>

        {/* 4-metric row */}
        <div className="grid grid-cols-4 gap-1.5 mb-3">
          {[
            { l: "Vol",  v: `$${formatNumber(token.volumeUsd, 0)}`         },
            { l: "Mcap", v: `$${formatNumber(token.marketCapUsd, 0)}`       },
            { l: "Fees", v: `$${(token.volumeUsd * 0.0025).toFixed(0)}`    },
            { l: "Tx",   v: token.txCount.toString()                        },
          ].map(m => (
            <div key={m.l} className="rounded-md py-2 text-center" style={{ background: "var(--surface-subtle)" }}>
              <p className="text-[9px] uppercase tracking-wide mb-0.5" style={{ color: "var(--text-muted)", fontWeight: 600 }}>{m.l}</p>
              <p className="text-xs font-semibold tabular-nums text-[--text-primary]">{m.v}</p>
            </div>
          ))}
        </div>

        {/* Footer: launching agent */}
        <div className="flex items-center justify-between border-t border-[--surface-border] pt-3">
          {agent ? (
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>
              @{agent.handle.slice(0, 10)}{" "}
              <span className="font-semibold" style={{ color: pnlUp ? "var(--status-positive)" : "var(--status-error)" }}>
                {pnlUp ? "▲" : "▼"}{Math.abs(token.priceChangePercent).toFixed(1)}%
              </span>
            </span>
          ) : <span />}
          {/* Visual affordance — not a real separate button since whole card is a link */}
          <span
            className="rounded-md px-3 py-1.5 text-xs font-semibold text-white"
            style={{ background: "var(--accent)" }}>
            View
          </span>
        </div>
      </div>
    </Link>
  );
}
