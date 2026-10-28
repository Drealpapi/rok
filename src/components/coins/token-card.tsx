"use client";

import * as React from "react";
import Link from "next/link";
import { Copy, Lock, ExternalLink, Flame, Zap } from "lucide-react";
import { shortAddress, formatNumber, hashString } from "@/lib/utils";
import { Agent3D } from "@/components/shared/agent-3d";
import { isJustLaunched, isHot } from "@/lib/seed-data";
import type { SeedToken, SeedAgent } from "@/lib/seed-data";

/*
  Sparkline — full-width, edge-to-edge on the card, no margins.
  Sits between the pool section and the metrics row, just like the reference.
*/
function makeSparkline(ticker: string, pct: number): number[] {
  const h = hashString(ticker);
  const pts = Array.from({ length: 20 }, (_, i) => {
    const v = ((h * (i + 1) * 2654435761) >>> 0) % 1000 / 1000;
    // Bias the final portion toward the price direction
    const trendWeight = i / 19;
    const trend = pct >= 0 ? trendWeight * 0.35 : -trendWeight * 0.35;
    return Math.max(0.02, Math.min(0.98, v + trend));
  });
  return pts;
}

function CardSparkline({ ticker, pct, width }: { ticker: string; pct: number; width: number }) {
  const pts   = makeSparkline(ticker, pct);
  const H     = 36;
  const W     = width;
  const minV  = Math.min(...pts);
  const maxV  = Math.max(...pts);
  const range = maxV - minV || 1;

  const xy = pts.map((v, i) => {
    const x = (i / (pts.length - 1)) * W;
    const y = H - ((v - minV) / range) * (H - 6) - 3;
    return [x, y] as [number, number];
  });

  // Build smooth path with cubic bezier
  let d = `M ${xy[0][0].toFixed(1)} ${xy[0][1].toFixed(1)}`;
  for (let i = 1; i < xy.length; i++) {
    const [x0, y0] = xy[i - 1];
    const [x1, y1] = xy[i];
    const cpx = (x0 + x1) / 2;
    d += ` C ${cpx.toFixed(1)} ${y0.toFixed(1)}, ${cpx.toFixed(1)} ${y1.toFixed(1)}, ${x1.toFixed(1)} ${y1.toFixed(1)}`;
  }

  const color   = pct >= 0 ? "#4ade80" : "#f87171";
  const fillId  = `fill-${ticker}-card`;
  const lastX   = xy[xy.length - 1][0].toFixed(1);
  const closedD = `${d} L ${lastX} ${H} L 0 ${H} Z`;

  return (
    <svg
      width={W} height={H}
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      fill="none"
      aria-hidden
      style={{ display: "block" }}
    >
      <defs>
        <linearGradient id={fillId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={color} stopOpacity="0.18" />
          <stop offset="100%" stopColor={color} stopOpacity="0"    />
        </linearGradient>
      </defs>
      <path d={closedD} fill={`url(#${fillId})`} />
      <path d={d}        stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

export function TokenCard({ token, agent }: { token: SeedToken; agent?: SeedAgent }) {
  const [copied,      setCopied]      = React.useState(false);
  const [cardHovered, setCardHovered] = React.useState(false);
  const [showNew,     setShowNew]     = React.useState(false);
  const [showHot,     setShowHot]     = React.useState(false);
  const cardRef  = React.useRef<HTMLAnchorElement>(null);
  const [cardW,  setCardW]  = React.useState(240);

  // Measure card width for the full-bleed sparkline
  React.useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setCardW(e.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

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
      ref={cardRef}
      href={`/coins/${token.address}`}
      className="block card-3d"
      style={{ textDecoration: "none", width: "100%", minWidth: 0, overflow: "hidden" }}
      onMouseEnter={() => setCardHovered(true)}
      onMouseLeave={() => setCardHovered(false)}
    >
      {/* ── Header ── */}
      <div style={{ padding: "12px 12px 0 12px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 8 }}>

          {agent && (
            <div style={{ overflow: "visible", flexShrink: 0, marginTop: -2 }}>
              <Agent3D seed={agent.id} size={52} cardHovered={cardHovered} accentColor="var(--accent)" />
            </div>
          )}

          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Badge row */}
            <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 5, flexWrap: "wrap" }}>
              <span style={{ fontSize: 9, fontWeight: 700, borderRadius: 3, padding: "1px 4px", background: "var(--surface-subtle)", color: "var(--text-muted)" }}>V2</span>

              <span style={{
                display: "inline-flex", alignItems: "center", gap: 2,
                borderRadius: 3, padding: "1px 5px", fontSize: 9, fontWeight: 700,
                background: "rgba(255,118,40,0.12)", color: "var(--accent)",
                border: "1px solid rgba(255,118,40,0.22)",
              }}>
                <Lock size={7} /> Locked
              </span>

              {showNew && (
                <span style={{
                  display: "inline-flex", alignItems: "center", gap: 2,
                  borderRadius: 3, padding: "1px 5px", fontSize: 9, fontWeight: 800,
                  background: "linear-gradient(135deg,#4f46e5,#7c3aed)", color: "#fff",
                }}>
                  <Zap size={7} /> NEW
                </span>
              )}

              {showHot && (
                <span style={{
                  display: "inline-flex", alignItems: "center", gap: 2,
                  borderRadius: 3, padding: "1px 5px", fontSize: 9, fontWeight: 800,
                  background: "linear-gradient(135deg,#dc2626,#f97316)", color: "#fff",
                }}>
                  <Flame size={7} /> HOT
                </span>
              )}

              {/* Price change badge */}
              <span style={{
                marginLeft: "auto", flexShrink: 0, borderRadius: 4, padding: "2px 5px",
                fontSize: 10, fontWeight: 700, fontVariantNumeric: "tabular-nums",
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

        {/* Address row */}
        <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 10 }}
          onClick={e => e.preventDefault()}>
          <span style={{ fontSize: 10, fontFamily: "monospace", color: "var(--text-muted)", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {shortAddress(token.address, 5)}
          </span>
          <button onClick={handleCopy} aria-label="Copy address" style={{ padding: "2px 4px", borderRadius: 4, background: "none", border: "none", cursor: "pointer", color: copied ? "var(--status-positive)" : "var(--text-muted)" }}>
            <Copy size={10} />
          </button>
          <span style={{ color: "var(--text-muted)", padding: "2px 2px" }}>
            <ExternalLink size={10} />
          </span>
        </div>
      </div>

      {/* ── Pool section ── */}
      <div style={{ margin: "0 12px 0", borderRadius: 8, padding: "8px 10px", background: "rgba(255,118,40,0.06)", border: "1px solid rgba(255,118,40,0.14)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
          <span style={{ fontSize: 10, color: "var(--text-muted)", fontWeight: 500 }}>Pool</span>
          <span style={{ fontSize: 10, fontWeight: 700, color: "var(--accent)", fontVariantNumeric: "tabular-nums" }}>{pct.toFixed(0)}%</span>
        </div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 3, marginBottom: 6 }}>
          <span style={{ fontSize: 16, fontWeight: 800, color: "var(--text-primary)", fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>
            {token.progressEth.toFixed(2)}
          </span>
          <span style={{ fontSize: 10, color: "var(--text-muted)" }}>/ {token.thresholdEth} ETH</span>
        </div>
        <div style={{ height: 4, borderRadius: 2, overflow: "hidden", background: "rgba(255,255,255,0.08)" }}>
          <div style={{ height: "100%", borderRadius: 2, width: `${Math.max(pct, 1)}%`, background: "var(--accent)", boxShadow: "0 0 6px rgba(255,118,40,0.55)", transition: "width 0.5s ease" }} />
        </div>
      </div>

      {/*
        ── Sparkline chart — FULL WIDTH, no horizontal padding, between pool and metrics.
        Exactly as the reference image shows.
      */}
      <div style={{ marginTop: 10, lineHeight: 0 }}>
        <CardSparkline ticker={token.ticker} pct={token.priceChangePercent} width={cardW} />
      </div>

      {/* ── Metrics row ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 4, margin: "8px 12px 10px" }}>
        {[
          { l: "VOL",  v: `$${formatNumber(token.volumeUsd, 0)}`      },
          { l: "MCAP", v: `$${formatNumber(token.marketCapUsd, 0)}`   },
          { l: "FEES", v: `$${(token.volumeUsd * 0.0025).toFixed(0)}` },
          { l: "TX",   v: token.txCount.toString()                    },
        ].map(m => (
          <div key={m.l} style={{ borderRadius: 6, padding: "5px 3px", textAlign: "center", background: "var(--surface-subtle)" }}>
            <p style={{ fontSize: 8, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)", fontWeight: 600, marginBottom: 1 }}>{m.l}</p>
            <p style={{ fontSize: 10, fontWeight: 700, color: "var(--text-primary)", fontVariantNumeric: "tabular-nums" }}>{m.v}</p>
          </div>
        ))}
      </div>

      {/* ── Footer ── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 12px", borderTop: "1px solid var(--surface-border)" }}>
        {agent ? (
          <span style={{ fontSize: 10, color: "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>
            @{agent.handle.slice(0, 10)}{" "}
            <span style={{ fontWeight: 700, color: pnlUp ? "var(--status-positive)" : "var(--status-error)" }}>
              {pnlUp ? "▲" : "▼"}{Math.abs(token.priceChangePercent).toFixed(1)}%
            </span>
          </span>
        ) : <span style={{ flex: 1 }} />}
        <span style={{ flexShrink: 0, borderRadius: 6, padding: "4px 10px", fontSize: 10, fontWeight: 700, color: "#fff", background: "var(--accent)" }}>
          View
        </span>
      </div>
    </Link>
  );
}
