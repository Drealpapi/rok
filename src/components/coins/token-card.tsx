"use client";

import * as React from "react";
import Link from "next/link";
import { Copy, Lock, Unlock, Flame, Zap } from "lucide-react";
import { shortAddress, formatNumber, hashString } from "@/lib/utils";
import { Agent3D } from "@/components/shared/agent-3d";
import { isJustLaunched, isHot } from "@/lib/seed-data";
import type { SeedToken, SeedAgent } from "@/lib/seed-data";

const ACCENTS = [
  "#ff7628","#ff8c42","#e86520","#f0a040",
  "#e06020","#ff6010","#fa8030","#f07050",
];
function getAccent(ticker: string) {
  return ACCENTS[hashString(ticker) % ACCENTS.length];
}

export function TokenCard({ token, agent }: { token: SeedToken; agent?: SeedAgent }) {
  const [copied,      setCopied]      = React.useState(false);
  const [cardHovered, setCardHovered] = React.useState(false);

  // Client-side badge checks — safe to use Date.now() in client components
  const [showNew, setShowNew] = React.useState(false);
  const [showHot, setShowHot] = React.useState(false);

  React.useEffect(() => {
    setShowNew(isJustLaunched(token.createdAt));
    setShowHot(isHot(token));
  }, [token]);

  const pct    = Math.min((token.progressEth / token.thresholdEth) * 100, 100);
  const isOpen = token.status === "open" || token.status === "graduated";
  const pnlUp  = token.priceChangePercent >= 0;
  const accent = getAccent(token.ticker);

  function handleCopy(e: React.MouseEvent) {
    e.preventDefault();
    try { navigator.clipboard.writeText(token.address); } catch { /* noop */ }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <Link
      href={`/coins/${token.address}`}
      className="block card-3d overflow-visible"
      style={{ textDecoration: "none", width: "100%", minWidth: 0 }}
      onMouseEnter={() => setCardHovered(true)}
      onMouseLeave={() => setCardHovered(false)}
    >
      {/* Accent top bar */}
      <div style={{ height: 2, background: accent, borderRadius: "12px 12px 0 0" }} />

      <div style={{ padding: "14px" }}>

        {/* ── Header: avatar + name + badges + price change ── */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 10 }}>
          {/* 3D agent avatar */}
          {agent && (
            <div style={{
              overflow: "visible", flexShrink: 0,
              background: `radial-gradient(circle at 50% 70%, ${accent}22 0%, transparent 70%)`,
              borderRadius: 10, padding: "4px 2px 0 2px", marginTop: -4,
            }}>
              <Agent3D seed={agent.id} size={64} cardHovered={cardHovered} accentColor={accent} />
            </div>
          )}

          {/* Name / ticker / status */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Badge row */}
            <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 4, flexWrap: "wrap" }}>
              <span style={{
                fontSize: 9, fontWeight: 600, borderRadius: 4, padding: "1px 5px",
                background: "var(--surface-subtle)", color: "var(--text-muted)",
              }}>V2</span>

              {/* Lock / Open status */}
              <span style={{
                display: "inline-flex", alignItems: "center", gap: 3,
                borderRadius: 4, padding: "1px 5px", fontSize: 9, fontWeight: 700,
                ...(isOpen
                  ? { background: "var(--status-positive-bg)", color: "var(--status-positive)" }
                  : { background: "var(--accent-muted)",       color: "var(--accent)"          }),
              }}>
                {isOpen ? <Unlock size={8} /> : <Lock size={8} />}
                {isOpen ? "Open" : "Locked"}
              </span>

              {/* NEW badge — only within first hour */}
              {showNew && (
                <span style={{
                  display: "inline-flex", alignItems: "center", gap: 3,
                  borderRadius: 4, padding: "1px 6px", fontSize: 9, fontWeight: 800,
                  background: "linear-gradient(135deg, #1d4ed8, #4f46e5)",
                  color: "#fff",
                  boxShadow: "0 0 8px rgba(79,70,229,0.55)",
                  animation: "glowPulse 2s ease-in-out infinite",
                }}>
                  <Zap size={8} />
                  NEW
                </span>
              )}

              {/* HOT badge — strong performers */}
              {showHot && (
                <span style={{
                  display: "inline-flex", alignItems: "center", gap: 3,
                  borderRadius: 4, padding: "1px 6px", fontSize: 9, fontWeight: 800,
                  background: "linear-gradient(135deg, #dc2626, #f97316)",
                  color: "#fff",
                  boxShadow: "0 0 8px rgba(239,68,68,0.55)",
                  animation: "glowPulse 2.4s ease-in-out infinite",
                }}>
                  <Flame size={8} />
                  HOT
                </span>
              )}
            </div>

            <p style={{
              fontSize: 13, fontWeight: 700, color: "var(--text-primary)",
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", lineHeight: 1.2,
            }}>
              {token.name}
            </p>
            <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 1 }}>${token.ticker}</p>
          </div>

          {/* Price change */}
          <span style={{
            flexShrink: 0, borderRadius: 6, padding: "3px 6px",
            fontSize: 10, fontWeight: 700, fontVariantNumeric: "tabular-nums",
            ...(pnlUp
              ? { background: "var(--status-positive-bg)", color: "var(--status-positive)" }
              : { background: "var(--status-error-bg)",    color: "var(--status-error)"    }),
          }}>
            {pnlUp ? "+" : ""}{token.priceChangePercent.toFixed(1)}%
          </span>
        </div>

        {/* ── Address ── */}
        <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 10 }}
          onClick={e => e.preventDefault()}>
          <span style={{ fontSize: 10, fontFamily: "monospace", color: "var(--text-muted)", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {shortAddress(token.address, 5)}
          </span>
          <button onClick={handleCopy}
            style={{
              padding: 4, borderRadius: 4, background: "none", border: "none", cursor: "pointer",
              color: copied ? "var(--status-positive)" : "var(--text-muted)", flexShrink: 0,
            }}
            aria-label="Copy address">
            <Copy size={11} />
          </button>
        </div>

        {/* ── Pool section ── */}
        <div style={{
          borderRadius: 10, padding: "10px 12px", marginBottom: 10,
          ...(isOpen
            ? { background: "var(--status-positive-bg)", border: "1px solid var(--status-positive-border)" }
            : { background: "var(--surface-subtle)",     border: "1px solid var(--surface-border)"         }),
        }}>
          {isOpen ? (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: "var(--status-positive)" }}>Pool bonded</span>
              <span style={{
                borderRadius: 6, padding: "2px 8px", fontSize: 10, fontWeight: 700, color: "#fff",
                background: "var(--status-positive)",
              }}>Open</span>
            </div>
          ) : (
            <>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 5 }}>
                <span style={{ fontSize: 11, color: "var(--text-muted)" }}>Pool</span>
                <span style={{ fontSize: 10, fontWeight: 700, color: accent, fontVariantNumeric: "tabular-nums" }}>
                  {pct.toFixed(0)}%
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 7 }}>
                <span style={{ fontSize: 15, fontWeight: 800, color: "var(--text-primary)", fontVariantNumeric: "tabular-nums" }}>
                  {token.progressEth.toFixed(2)}
                </span>
                <span style={{ fontSize: 10, color: "var(--text-muted)" }}>/ {token.thresholdEth} ETH</span>
              </div>
              <div style={{ height: 5, borderRadius: 3, overflow: "hidden", background: "var(--surface-border)" }}>
                <div style={{
                  height: "100%", borderRadius: 3,
                  width: `${Math.max(pct, 1)}%`,
                  background: accent,
                  transition: "width 0.5s ease",
                  boxShadow: `0 0 6px ${accent}88`,
                }} />
              </div>
            </>
          )}
        </div>

        {/* ── 4-metric row ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6, marginBottom: 10 }}>
          {[
            { l: "Vol",  v: `$${formatNumber(token.volumeUsd, 0)}`      },
            { l: "Mcap", v: `$${formatNumber(token.marketCapUsd, 0)}`   },
            { l: "Fees", v: `$${(token.volumeUsd * 0.0025).toFixed(0)}` },
            { l: "Tx",   v: token.txCount.toString()                     },
          ].map(m => (
            <div key={m.l} style={{ borderRadius: 7, padding: "6px 4px", textAlign: "center", background: "var(--surface-subtle)" }}>
              <p style={{ fontSize: 8, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-muted)", fontWeight: 600, marginBottom: 2 }}>{m.l}</p>
              <p style={{ fontSize: 10, fontWeight: 700, color: "var(--text-primary)", fontVariantNumeric: "tabular-nums" }}>{m.v}</p>
            </div>
          ))}
        </div>

        {/* ── Footer ── */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          paddingTop: 10, borderTop: "1px solid var(--surface-border)",
        }}>
          {agent ? (
            <span style={{ fontSize: 11, color: "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "55%" }}>
              @{agent.handle.slice(0, 12)}{" "}
              <span style={{ fontWeight: 700, color: pnlUp ? "var(--status-positive)" : "var(--status-error)" }}>
                {pnlUp ? "▲" : "▼"}{Math.abs(token.priceChangePercent).toFixed(1)}%
              </span>
            </span>
          ) : <span />}
          <span style={{
            borderRadius: 7, padding: "5px 12px", fontSize: 11, fontWeight: 700,
            color: "#fff", background: "var(--accent)", flexShrink: 0,
          }}>
            View
          </span>
        </div>
      </div>
    </Link>
  );
}
