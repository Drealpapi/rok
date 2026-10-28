"use client";

import * as React from "react";
import { Zap } from "lucide-react";

/* ═══════════════════════════════════════════════════════════════════════════
   NEW COIN ENTRY ANIMATION SYSTEM

   When a new coin joins the catalog it goes through 3 phases:

   Phase 1 — "LAUNCHING" (0–2s):
     Portal burst: the card slot erupts with a radial light flash,
     particles scatter in 8 directions, the card "teleports in" from
     slightly below with a spring-scale-up + fade-in.

   Phase 2 — "NEW" badge (2s–30s):
     A glowing "NEW" badge pulses on the card. A scan-line animation
     sweeps from top to bottom once. The robot bounces once on entry.

   Phase 3 — Normal:
     Badge fades away, card settles into the grid permanently.

   Usage:
     Wrap any TokenCard with <NewCoinEntry isNew={true} launchDelay={0} />
     isNew=true triggers the sequence. isNew=false renders children normally.
═══════════════════════════════════════════════════════════════════════════ */

const ENTRY_CSS = `
  @keyframes portalBurst {
    0%   { transform: scale(0.1); opacity: 0.9; }
    40%  { transform: scale(1.6); opacity: 0.5; }
    100% { transform: scale(2.4); opacity: 0;   }
  }
  @keyframes particleFly {
    0%   { transform: translate(0,0) scale(1); opacity: 1; }
    100% { transform: translate(var(--px), var(--py)) scale(0); opacity: 0; }
  }
  @keyframes cardLaunch {
    0%   { opacity: 0; transform: scale(0.78) translateY(28px) rotate(-1.5deg); }
    55%  { opacity: 1; transform: scale(1.04) translateY(-6px) rotate(0.5deg); }
    75%  { transform: scale(0.98) translateY(2px) rotate(0deg); }
    88%  { transform: scale(1.01) translateY(-1px); }
    100% { transform: scale(1) translateY(0); }
  }
  @keyframes scanLine {
    0%   { top: 0%;    opacity: 0.55; }
    80%  { top: 100%;  opacity: 0.55; }
    100% { top: 100%;  opacity: 0;    }
  }
  @keyframes newBadgePulse {
    0%,100% { box-shadow: 0 0 0 0 rgba(124,58,237,0.5), 0 0 8px rgba(124,58,237,0.3); }
    50%     { box-shadow: 0 0 0 6px rgba(124,58,237,0), 0 0 20px rgba(124,58,237,0.6); }
  }
  @keyframes newBadgeFade {
    0%    { opacity: 1; transform: scale(1); }
    85%   { opacity: 1; transform: scale(1); }
    100%  { opacity: 0; transform: scale(0.7); }
  }
  @keyframes robotEntry {
    0%   { transform: translateY(-30%) scale(1.18) rotate(-3deg); }
    50%  { transform: translateY(-25%) scale(1.16) rotate(3deg); }
    100% { transform: translateY(0) scale(1) rotate(0deg); }
  }
`;

let entryCSSInjected = false;
function ensureEntryCSS() {
  if (entryCSSInjected || typeof document === "undefined") return;
  const el = document.createElement("style");
  el.textContent = ENTRY_CSS;
  document.head.appendChild(el);
  entryCSSInjected = true;
}

// Particle directions (8-way burst)
const PARTICLE_DIRS = [
  { px: "-60px", py: "-60px", color: "#c4b5fd" },
  { px: "0px",   py: "-80px", color: "#67e8f9" },
  { px: "60px",  py: "-60px", color: "#fcd34d" },
  { px: "80px",  py: "0px",   color: "#86efac" },
  { px: "60px",  py: "60px",  color: "#f9a8d4" },
  { px: "0px",   py: "80px",  color: "#7dd3fc" },
  { px: "-60px", py: "60px",  color: "#fde68a" },
  { px: "-80px", py: "0px",   color: "#d8b4fe" },
];

type Phase = "burst" | "entry" | "new" | "settled";

interface NewCoinEntryProps {
  children: React.ReactNode;
  isNew?: boolean;         // triggers portal entry animation (runtime new)
  launchDelay?: number;
  showNewBadge?: boolean;  // quiet badge-only mode (seed coins 1–8h old)
}

export function NewCoinEntry({
  children,
  isNew = false,
  launchDelay = 0,
  showNewBadge = false,
}: NewCoinEntryProps) {
  const [phase, setPhase] = React.useState<Phase>(isNew ? "burst" : "settled");

  React.useEffect(() => {
    ensureEntryCSS();
    if (!isNew) return;

    const t1 = setTimeout(() => setPhase("entry"),   launchDelay);
    const t2 = setTimeout(() => setPhase("new"),     launchDelay + 600);
    const t3 = setTimeout(() => setPhase("settled"), launchDelay + 30_000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [isNew, launchDelay]);

  if (!isNew || phase === "settled") {
    return <>{children}</>;
  }

  return (
    <div className="relative">
      {/* ── BURST PHASE: portal + particles ── */}
      {phase === "burst" && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20" aria-hidden>
          {/* Portal circle */}
          <div
            className="absolute w-16 h-16 rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(124,58,237,0.85) 0%, rgba(6,182,212,0.40) 60%, transparent 100%)",
              animation: "portalBurst 0.55s ease-out forwards",
            }}
          />
          {/* Particles */}
          {PARTICLE_DIRS.map((dir, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{
                background: dir.color,
                ["--px" as string]: dir.px,
                ["--py" as string]: dir.py,
                animation: `particleFly 0.55s ease-out ${i * 0.03}s forwards`,
                boxShadow: `0 0 6px ${dir.color}`,
              }}
            />
          ))}
          {/* Flash overlay */}
          <div
            className="absolute inset-[-20px] rounded-3xl"
            style={{
              background: "radial-gradient(circle, rgba(255,255,255,0.35) 0%, transparent 70%)",
              animation: "portalBurst 0.4s ease-out forwards",
            }}
          />
          {/* Empty card placeholder */}
          <div
            className="w-full h-full rounded-3xl"
            style={{
              background: "var(--surface-subtle)",
              border: "1px dashed var(--surface-border)",
              opacity: 0.5,
            }}
          />
        </div>
      )}

      {/* ── ENTRY + NEW phases: card animates in ── */}
      {(phase === "entry" || phase === "new") && (
        <div
          style={{
            animation: phase === "entry" ? "cardLaunch 0.7s cubic-bezier(0.34,1.56,0.64,1) forwards" : undefined,
            position: "relative",
          }}
        >
          {children}

          {/* Scan-line sweep on entry */}
          {phase === "entry" && (
            <div
              className="absolute left-0 right-0 h-px pointer-events-none z-10"
              style={{
                background: "linear-gradient(90deg, transparent, rgba(124,58,237,0.70) 30%, rgba(6,182,212,0.70) 70%, transparent)",
                animation: "scanLine 0.7s ease-in-out forwards",
                boxShadow: "0 0 8px rgba(124,58,237,0.60)",
              }}
              aria-hidden
            />
          )}

          {/* NEW badge */}
          {phase === "new" && (
            <div
              className="absolute -top-2.5 -right-2.5 z-20 pointer-events-none"
              style={{ animation: "newBadgeFade 30s linear forwards" }}
            >
              <div
                className="flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-black text-white"
                style={{
                  background: "linear-gradient(135deg, #7c3aed, #0891b2)",
                  animation: "newBadgePulse 1.5s ease-in-out infinite",
                  boxShadow: "0 2px 12px rgba(124,58,237,0.50)",
                }}
              >
                <Zap className="w-2.5 h-2.5" />
                NEW
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   useNewCoins — tracks which coins are newly added since last render.
   Feed this into the grid to automatically trigger entry animations.
═══════════════════════════════════════════════════════════════════════════ */
export function useNewCoins(coinIds: string[]) {
  const prevIds = React.useRef<Set<string>>(new Set());
  const [newIds, setNewIds] = React.useState<Set<string>>(new Set());

  React.useEffect(() => {
    const incoming = coinIds.filter((id) => !prevIds.current.has(id));
    if (incoming.length > 0) {
      setNewIds(new Set(incoming));
      // Clear "new" status after 35s so it doesn't persist across re-mounts
      const t = setTimeout(() => setNewIds(new Set()), 35_000);
      incoming.forEach((id) => prevIds.current.add(id));
      return () => clearTimeout(t);
    }
    coinIds.forEach((id) => prevIds.current.add(id));
  }, [coinIds]);

  return newIds;
}
