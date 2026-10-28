"use client";

import * as React from "react";
import Link from "next/link";
import { Copy, Lock, ExternalLink, Flame, Zap } from "lucide-react";
import { shortAddress, formatNumber } from "@/lib/utils";
import { Agent3D } from "@/components/shared/agent-3d";
import { isJustLaunched, isHot } from "@/lib/seed-data";
import type { SeedToken, SeedAgent } from "@/lib/seed-data";

export function TokenCard({ token, agent }: { token: SeedToken; agent?: SeedAgent }) {
  const [copied,      setCopied]      = React.useState(false);
  const [cardHovered, setCardHovered] = React.useState(false);
  const [showNew,     setShowNew]     = React.useState(false);
  const [showHot,     setShowHot]     = React.useState(false);

  React.useEffect(() => {
    setShowNew(isJustLaunched(token.createdAt));
    setShowHot(isHot(token));
  }, [token]);

  const pct   = Math.min((token.progressEth / token.thresholdEth) * 100, 100);
  const pnlUp = token.priceChangePercent >= 0;

  function handleCopy(e: React.MouseEvent) {
    e.preventDefault();
    try { navigator.clipboard.writeText(token.address); } catch { /* noop */ }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <Link
      href={`/coins/${token.address}`}
      className="block card-3d"
      style={{ textDecoration: "none", width: "100%", minWidth: 0, overflow: "hidden" }}
      onMouseEnter={() => setCardHovered(true)}
      onMouseLeave={() => setCardHovered(false)}
    >
      <div style={{ padding: "12px" }}>

        {/* ── Top row: avatar + badges + price change ── */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 8 }}>

          {/* Agent avatar */}
          {agent && (
            <div style={{ overflow: "visible", flexShrink: 0 }}>
              <Agent3D seed={agent.id} size={48} cardHovered={cardHovered} accentColor="var(--accent)" />
            </div>
          )}

          {/* Badges + name */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Badge row */}
            <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 4, flexWrap: "wrap" }}>
              <span style={{ fontSize: 9, fontWeight: 600, borderRadius: 3, padding: "1px 4px", background: "var(--surface-subtle)", color: "var(--text-muted)" }}>V2</span>

              <span style={{
                display: "inline-flex", alignItems: "center", gap: 2, borderRadius: 3, padding: "1px 5px",
                fontSize: 9, fontWeight: 700,
                background: "rgba(255,118,40,0.10)", color: "var(--accent)", border: "1px solid rgba(255,118,40,0.20)",
              }}>
                <Lock size={7} /> LOCKED
              </span>

              {showNew && (
                <span style={{ display: "inline-flex", alignItems: "center", gap: 2, borderRadius: 3, padding: "1px 5px", fontSize: 9, fontWeight: 800, background: "linear-gradient(135deg,#4f46e5,#7c3aed)", color: "#fff" }}>
                  <Zap size={7} /> NEW
                </span>
              )}
              {showHot && (
                <span style={{ display: "inline-flex", alignItems: "center", gap: 2, borderRadius: 3, padding: "1px 5px", fontSize: 9, fontWeight: 800, background: "linear-gradient(135deg,#dc2626,#f97316)", color: "#fff" }}>
                  <Flame size={7} /> HOT
                </span>
              )}

              {/* Price change */}
              <span style={{
                marginLeft: "auto", borderRadius: 4, padding: "2px 5px",
                fontSize: 10, fontWeight: 700, fontVariantNumeric: "tabular-nums", flexShrink: 0,
                background: pnlUp ? "rgba(74,222,128,0.12)" : "rgba(248,113,113,0.12)",
                color: pnlUp ? "var(--status-positive)" : "var(--status-error)",
              }}>
                {pnlUp ? "+" : ""}{token.priceChangePercent.toFixed(1)}%
              </span>
            </div>

            <p style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", lineHeight: 1.15, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {token.name}
            </p>
            <p style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 1 }}>${token.ticker}</p>
          </div>
        </div>

        {/* ── Address ── */}
        <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 8 }} onClick={e => e.preventDefault()}>
          <span style={{ fontSize: 10, fontFamily: "monospace", color: "var(--text-muted)", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {shortAddress(token.address, 6)}
          </span>
          <button onClick={handleCopy} aria-label="Copy address" style={{ padding: "2px 3px", borderRadius: 4, background: "none", border: "none", cursor: "pointer", color: copied ? "var(--status-positive)" : "var(--text-muted)" }}>
            <Copy size={10} />
          </button>
          <span style={{ color: "var(--text-muted)" }}><ExternalLink size={10} /></span>
        </div>

        {/* ── Pool section ── */}
        <div style={{
          borderRadius: 8, padding: "8px 10px", marginBottom: 8,
          background: "rgba(255,118,40,0.06)", border: "1px solid rgba(255,118,40,0.14)",
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 3 }}>
            <span style={{ fontSize: 10, color: "var(--text-muted)" }}>Pool</span>
            <span style={{ fontSize: 10, fontWeight: 700, color: "var(--accent)", fontVariantNumeric: "tabular-nums" }}>{pct.toFixed(0)}%</span>
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 3, marginBottom: 5 }}>
            <span style={{ fontSize: 17, fontWeight: 800, color: "var(--text-primary)", fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>
              {token.progressEth.toFixed(2)}
            </span>
            <span style={{ fontSize: 10, color: "var(--text-muted)" }}>/ {token.thresholdEth}</span>
          </div>
          <div style={{ height: 4, borderRadius: 2, overflow: "hidden", background: "rgba(255,255,255,0.07)" }}>
            <div style={{
              height: "100%", borderRadius: 2,
              width: `${Math.max(pct, 1)}%`,
              background: "var(--accent)",
              boxShadow: "0 0 5px rgba(255,118,40,0.5)",
              transition: "width 0.5s ease",
            }} />
          </div>
        </div>

        {/* ── Metrics row ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 4, marginBottom: 8 }}>
          {[
            { l: "Vol",  v: `$${formatNumber(token.volumeUsd, 0)}`      },
            { l: "Mcap", v: `$${formatNumber(token.marketCapUsd, 0)}`   },
            { l: "Fees", v: `$${(token.volumeUsd * 0.0025).toFixed(0)}` },
            { l: "Tx",   v: token.txCount.toString()                    },
          ].map(m => (
            <div key={m.l} style={{ textAlign: "center" }}>
              <p style={{ fontSize: 8, textTransform: "uppercase", letterSpacing: "0.04em", color: "var(--text-muted)", fontWeight: 600, marginBottom: 1 }}>{m.l}</p>
              <p style={{ fontSize: 10, fontWeight: 700, color: "var(--text-primary)", fontVariantNumeric: "tabular-nums" }}>{m.v}</p>
            </div>
          ))}
        </div>

        {/* ── Footer: agent handle + View ── */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 8, borderTop: "1px solid var(--surface-border)" }}>
          {agent ? (
            <span style={{ fontSize: 10, color: "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>
              @{agent.handle.slice(0, 10)}{" "}
              <span style={{ fontWeight: 700, color: pnlUp ? "var(--status-positive)" : "var(--status-error)" }}>
                {pnlUp ? "▲" : "▼"}{Math.abs(token.priceChangePercent).toFixed(1)}%
              </span>
            </span>
          ) : <span style={{ flex: 1 }} />}
          <span style={{ flexShrink: 0, borderRadius: 6, padding: "4px 12px", fontSize: 11, fontWeight: 700, color: "#fff", background: "var(--accent)" }}>
            View
          </span>
        </div>
      </div>
    </Link>
  );
}
