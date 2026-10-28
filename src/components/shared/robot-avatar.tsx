"use client";

import * as React from "react";
import { hashString } from "@/lib/utils";

/* ═══════════════════════════════════════════════════════════════════════════
   ORBYTE Robot Avatar System v3

   PERSONALITIES (11 total):
   ─────────────────────────────────────
   happy    — big eyes, big smile, ^_^ on hover, rosy cheeks, BLINKS
   mad      — V-brows, squint eyes, mean mouth, BLINKS
   grumpy   — heavy drooping brows, frown, BLINKS
   derp     — uneven googly eyes, tongue out, BLINKS
   smirk    — half-lidded, one-side smirk, BLINKS
   cool     — visor shades, flat smile, BLINKS
   nervous  — wide eyes, sweat drop, wiggly mouth, BLINKS

   wink     — eyebrows + CYCLIC wink (open 3s → wink 0.25s → open), NO blink
   hi_brow  — both brows raise like saying "hi" every 5s, NO blink
   one_brow — single brow skeptic raise, NO blink

   BOUNCE: triggered by card hover (prop), not avatar hover
           Robot jumps UP and OUT of the card noticeably
═══════════════════════════════════════════════════════════════════════════ */

// ─── Palettes ────────────────────────────────────────────────────────────────
const PALETTES = [
  { b1: "#7c3aed", b2: "#4f46e5", acc: "#c4b5fd" },
  { b1: "#0891b2", b2: "#0e7490", acc: "#67e8f9" },
  { b1: "#d97706", b2: "#b45309", acc: "#fcd34d" },
  { b1: "#16a34a", b2: "#15803d", acc: "#86efac" },
  { b1: "#db2777", b2: "#be185d", acc: "#f9a8d4" },
  { b1: "#dc2626", b2: "#b91c1c", acc: "#fca5a5" },
  { b1: "#9333ea", b2: "#7c3aed", acc: "#d8b4fe" },
  { b1: "#0284c7", b2: "#075985", acc: "#7dd3fc" },
  { b1: "#ca8a04", b2: "#a16207", acc: "#fde68a" },
  { b1: "#059669", b2: "#047857", acc: "#6ee7b7" },
  { b1: "#be123c", b2: "#9f1239", acc: "#fda4af" },
  { b1: "#6d28d9", b2: "#5b21b6", acc: "#ddd6fe" },
];

type Personality =
  | "happy" | "mad" | "grumpy" | "derp"
  | "smirk" | "wink" | "cool"  | "nervous"
  | "hi_brow" | "one_brow";

const PERSONALITIES: Personality[] = [
  "happy", "mad", "grumpy", "derp",
  "smirk", "wink", "cool",  "nervous",
  "hi_brow", "one_brow",
];

// Which personalities NEVER blink (they have their own eye animations)
const NO_BLINK_PERSONAS = new Set<Personality>(["wink", "hi_brow", "one_brow"]);

const BODY_SHAPES   = ["circle", "squircle", "hex"] as const;
const ANTENNA_STYLES = ["ball", "flat", "spike", "none"] as const;
const EAR_STYLES    = ["none", "bolt", "round"] as const;

function getConfig(seed: string) {
  const h = hashString(seed);
  return {
    palette:     PALETTES[h % PALETTES.length],
    personality: PERSONALITIES[(h >> 4) % PERSONALITIES.length],
    body:        BODY_SHAPES[(h >> 8)  % BODY_SHAPES.length],
    antenna:     ANTENNA_STYLES[(h >> 11) % ANTENNA_STYLES.length],
    ear:         EAR_STYLES[(h >> 14)  % EAR_STYLES.length],
    cheeks:      ((h >> 16) % 4) === 0,
    // for one_brow: which side raises (0=left,1=right)
    browSide:    ((h >> 18) % 2) as 0 | 1,
  };
}

// ─── Global CSS (injected once) ───────────────────────────────────────────────
const CSS = `
  /*
    TWO slow bounces — strains upward like it wants out, but gravity pulls it back.
    Plays once (forwards, not infinite) — triggered by animation restart on hover.
    Peaks at ~28% height above resting — visible above card top edge but not fully free.
    Duration: ~1.4s total (slow and deliberate).
  */
  @keyframes rbBounce {
    0%    { transform: translateY(0)     scale(1)      rotate(0deg);    }
    /* Squish down — gathering energy */
    8%    { transform: translateY(4px)   scale(1.06, 0.94) rotate(0deg); }
    /* First rise — strains upward */
    28%   { transform: translateY(-28%)  scale(0.94, 1.06) rotate(-3deg); }
    /* Come back down, slight overshoot */
    42%   { transform: translateY(3px)   scale(1.05, 0.95) rotate(1deg);  }
    /* Second rise — a little less, still straining */
    60%   { transform: translateY(-18%)  scale(0.96, 1.04) rotate(2deg);  }
    /* Settle — one small final dip */
    76%   { transform: translateY(2px)   scale(1.03, 0.97) rotate(0deg);  }
    /* Rest at slight hover — feels held back */
    88%   { transform: translateY(-6%)   scale(1.01, 0.99) rotate(0deg);  }
    100%  { transform: translateY(-6%)   scale(1)          rotate(0deg);  }
  }
  /* Nervous: shakes side to side at the restrained height */
  @keyframes rbNervous {
    0%,100% { transform: translateY(-6%) scale(1.01) translateX(0); }
    20%     { transform: translateY(-6%) scale(1.01) translateX(-4px); }
    40%     { transform: translateY(-6%) scale(1.01) translateX(4px); }
    60%     { transform: translateY(-6%) scale(1.01) translateX(-3px); }
    80%     { transform: translateY(-6%) scale(1.01) translateX(3px); }
  }
  /* Gentle idle breathe */
  @keyframes rbIdle {
    0%,100% { transform: translateY(0) rotate(0deg) scale(1); }
    50%     { transform: translateY(-3px) rotate(0.5deg) scale(1.01); }
  }
  /* Antenna bob on hover */
  @keyframes rbAntenna {
    0%,100% { transform-origin: 50% 100%; transform: rotate(0deg); }
    35%     { transform-origin: 50% 100%; transform: rotate(-10deg); }
    70%     { transform-origin: 50% 100%; transform: rotate(8deg); }
  }
  /* Sweat drip */
  @keyframes rbSweat {
    0%,100% { opacity: 0; transform: translateY(0); }
    40%     { opacity: 0.85; }
    80%     { opacity: 0.7; transform: translateY(5px); }
  }
  /* Brow raise (hi personality) */
  @keyframes rbBrowRaise {
    0%,100% { transform: translateY(0); }
    15%,35% { transform: translateY(-4px); }
  }
  /* One brow raise */
  @keyframes rbOneBrow {
    0%,100% { transform: translateY(0) rotate(0deg); }
    20%,45% { transform: translateY(-5px) rotate(-12deg); }
  }
`;

let cssInjected = false;
function ensureCSS() {
  if (cssInjected || typeof document === "undefined") return;
  const el = document.createElement("style");
  el.textContent = CSS;
  document.head.appendChild(el);
  cssInjected = true;
}

// ─── The inner SVG robot ──────────────────────────────────────────────────────
interface RobotSVGProps {
  seed: string;
  size: number;
  blinking: boolean;   // only fires for blink-capable personalities
  winking: boolean;    // for "wink" personality cyclic wink
  browRaised: boolean; // for hi_brow / one_brow
  hovered: boolean;    // card hover — changes smile width etc.
}

function RobotSVG({ seed, size: s, blinking, winking, browRaised, hovered }: RobotSVGProps) {
  const cfg  = React.useMemo(() => getConfig(seed), [seed]);
  const { palette: p, personality, body, antenna, ear, cheeks, browSide } = cfg;
  const cx = s / 2;
  const cy = s / 2;
  const id = `rb-${seed.replace(/[^a-z0-9]/gi, "x")}-${s}`;

  // ── Body geometry ──
  function bodyFill() {
    if (body === "circle")   return <circle cx={cx} cy={cy+s*0.02} r={s*0.43} fill={`url(#${id}g)`} />;
    if (body === "squircle") return <rect x={s*0.07} y={s*0.10} width={s*0.86} height={s*0.82} rx={s*0.23} fill={`url(#${id}g)`} />;
    return <path d={`M${cx} ${s*0.10} L${s*0.91} ${s*0.33} L${s*0.91} ${s*0.77} L${cx} ${s*0.92} L${s*0.09} ${s*0.77} L${s*0.09} ${s*0.33} Z`} fill={`url(#${id}g)`} />;
  }
  function bodyClip() {
    if (body === "circle")   return <circle cx={cx} cy={cy+s*0.02} r={s*0.43} />;
    if (body === "squircle") return <rect x={s*0.07} y={s*0.10} width={s*0.86} height={s*0.82} rx={s*0.23} />;
    return <path d={`M${cx} ${s*0.10} L${s*0.91} ${s*0.33} L${s*0.91} ${s*0.77} L${cx} ${s*0.92} L${s*0.09} ${s*0.77} L${s*0.09} ${s*0.33} Z`} />;
  }

  // ── Standard blink slits ──
  const blinkSlits = (
    <g>
      <line x1={cx-s*0.21} y1={cy-s*0.07} x2={cx-s*0.05} y2={cy-s*0.07}
        stroke="white" strokeWidth={s*0.055} strokeLinecap="round" opacity="0.95" />
      <line x1={cx+s*0.05} y1={cy-s*0.07} x2={cx+s*0.21} y2={cy-s*0.07}
        stroke="white" strokeWidth={s*0.055} strokeLinecap="round" opacity="0.95" />
    </g>
  );

  // ── Eyes ──────────────────────────────────────────────────────────────────
  function renderEyes() {

    // ── WINK personality: cyclic one-eye wink, never blinks ──────────────────
    if (personality === "wink") {
      return (
        <g>
          {/* Eyebrows above both eyes */}
          <path d={`M${cx-s*0.24},${cy-s*0.22} Q${cx-s*0.13},${cy-s*0.26} ${cx-s*0.04},${cy-s*0.20}`}
            stroke="white" strokeWidth={s*0.055} strokeLinecap="round" fill="none" opacity="0.85" />
          <path d={`M${cx+s*0.04},${cy-s*0.20} Q${cx+s*0.13},${cy-s*0.26} ${cx+s*0.24},${cy-s*0.22}`}
            stroke="white" strokeWidth={s*0.055} strokeLinecap="round" fill="none" opacity="0.85" />

          {/* Left eye — always open */}
          <circle cx={cx-s*0.14} cy={cy-s*0.07} r={s*0.105} fill="white" opacity="0.96" />
          <circle cx={cx-s*0.12} cy={cy-s*0.05} r={s*0.052} fill={p.b1} opacity="0.90" />
          <circle cx={cx-s*0.17} cy={cy-s*0.10} r={s*0.024} fill="white" opacity="0.65" />

          {/* Right eye — winks open ↔ shut */}
          {winking ? (
            /* Wink: curved shut line */
            <path
              d={`M${cx+s*0.04},${cy-s*0.05} Q${cx+s*0.13},${cy-s*0.16} ${cx+s*0.23},${cy-s*0.05}`}
              stroke="white" strokeWidth={s*0.055} strokeLinecap="round" fill="none" opacity="0.95"
            />
          ) : (
            /* Open */
            <>
              <circle cx={cx+s*0.14} cy={cy-s*0.07} r={s*0.105} fill="white" opacity="0.96" />
              <circle cx={cx+s*0.12} cy={cy-s*0.05} r={s*0.052} fill={p.b1} opacity="0.90" />
              <circle cx={cx+s*0.17} cy={cy-s*0.10} r={s*0.024} fill="white" opacity="0.65" />
            </>
          )}
        </g>
      );
    }

    // ── HI_BROW: both brows raise, normal eyes, no blink ─────────────────────
    if (personality === "hi_brow") {
      const browOffset = browRaised ? -s*0.06 : 0;
      return (
        <g>
          {/* Animated brows — slide up when raised */}
          <g style={{ transform: `translateY(${browOffset}px)`, transition: "transform 0.20s ease" }}>
            <path d={`M${cx-s*0.24},${cy-s*0.18} Q${cx-s*0.13},${cy-s*0.23} ${cx-s*0.03},${cy-s*0.18}`}
              stroke="white" strokeWidth={s*0.058} strokeLinecap="round" fill="none" opacity={browRaised ? 0.98 : 0.75} />
            <path d={`M${cx+s*0.03},${cy-s*0.18} Q${cx+s*0.13},${cy-s*0.23} ${cx+s*0.24},${cy-s*0.18}`}
              stroke="white" strokeWidth={s*0.058} strokeLinecap="round" fill="none" opacity={browRaised ? 0.98 : 0.75} />
          </g>
          {/* Eyes — round, friendly */}
          <circle cx={cx-s*0.14} cy={cy-s*0.05} r={s*0.10} fill="white" opacity="0.96" />
          <circle cx={cx+s*0.14} cy={cy-s*0.05} r={s*0.10} fill="white" opacity="0.96" />
          <circle cx={cx-s*0.12} cy={cy-s*0.03} r={s*0.05} fill={p.b1} opacity="0.90" />
          <circle cx={cx+s*0.12} cy={cy-s*0.03} r={s*0.05} fill={p.b1} opacity="0.90" />
          <circle cx={cx-s*0.16} cy={cy-s*0.07} r={s*0.022} fill="white" opacity="0.60" />
          <circle cx={cx+s*0.16} cy={cy-s*0.07} r={s*0.022} fill="white" opacity="0.60" />
        </g>
      );
    }

    // ── ONE_BROW: single skeptical brow raise, no blink ───────────────────────
    if (personality === "one_brow") {
      // browSide 0 = left brow raises, 1 = right brow raises
      const leftUp  = browSide === 0 && browRaised;
      const rightUp = browSide === 1 && browRaised;
      return (
        <g>
          {/* Left brow */}
          <g style={{ transform: leftUp ? `translateY(${-s*0.07}px) rotate(-10deg)` : "none",
                      transformOrigin: `${cx-s*0.14}px ${cy-s*0.18}px`,
                      transition: "transform 0.18s ease" }}>
            <path d={`M${cx-s*0.24},${cy-s*0.17} Q${cx-s*0.14},${cy-s*0.22} ${cx-s*0.04},${cy-s*0.17}`}
              stroke="white" strokeWidth={s*0.058} strokeLinecap="round" fill="none" opacity={leftUp ? 0.98 : 0.72} />
          </g>
          {/* Right brow */}
          <g style={{ transform: rightUp ? `translateY(${-s*0.07}px) rotate(10deg)` : "none",
                      transformOrigin: `${cx+s*0.14}px ${cy-s*0.18}px`,
                      transition: "transform 0.18s ease" }}>
            <path d={`M${cx+s*0.04},${cy-s*0.17} Q${cx+s*0.14},${cy-s*0.22} ${cx+s*0.24},${cy-s*0.17}`}
              stroke="white" strokeWidth={s*0.058} strokeLinecap="round" fill="none" opacity={rightUp ? 0.98 : 0.72} />
          </g>
          {/* Eyes */}
          <circle cx={cx-s*0.14} cy={cy-s*0.05} r={s*0.095} fill="white" opacity="0.95" />
          <circle cx={cx+s*0.14} cy={cy-s*0.05} r={s*0.095} fill="white" opacity="0.95" />
          <circle cx={cx-s*0.12} cy={cy-s*0.03} r={s*0.048} fill={p.b1} opacity="0.90" />
          <circle cx={cx+s*0.12} cy={cy-s*0.03} r={s*0.048} fill={p.b1} opacity="0.90" />
          <circle cx={cx-s*0.16} cy={cy-s*0.07} r={s*0.022} fill="white" opacity="0.55" />
          <circle cx={cx+s*0.16} cy={cy-s*0.07} r={s*0.022} fill="white" opacity="0.55" />
        </g>
      );
    }

    // ── STANDARD blink-capable personalities ─────────────────────────────────
    if (blinking) return blinkSlits;

    switch (personality) {
      case "happy":
        if (hovered) {
          // ^_^ arc eyes
          return (
            <g>
              <path d={`M${cx-s*0.22},${cy-s*0.02} Q${cx-s*0.13},${cy-s*0.17} ${cx-s*0.04},${cy-s*0.02}`}
                stroke="white" strokeWidth={s*0.058} strokeLinecap="round" fill="none" opacity="0.96" />
              <path d={`M${cx+s*0.04},${cy-s*0.02} Q${cx+s*0.13},${cy-s*0.17} ${cx+s*0.22},${cy-s*0.02}`}
                stroke="white" strokeWidth={s*0.058} strokeLinecap="round" fill="none" opacity="0.96" />
            </g>
          );
        }
        return (
          <g>
            <circle cx={cx-s*0.14} cy={cy-s*0.07} r={s*0.105} fill="white" opacity="0.96" />
            <circle cx={cx+s*0.14} cy={cy-s*0.07} r={s*0.105} fill="white" opacity="0.96" />
            <circle cx={cx-s*0.11} cy={cy-s*0.05} r={s*0.052} fill={p.b1} opacity="0.90" />
            <circle cx={cx+s*0.11} cy={cy-s*0.05} r={s*0.052} fill={p.b1} opacity="0.90" />
            <circle cx={cx-s*0.17} cy={cy-s*0.10} r={s*0.024} fill="white" opacity="0.65" />
            <circle cx={cx+s*0.17} cy={cy-s*0.10} r={s*0.024} fill="white" opacity="0.65" />
          </g>
        );

      case "mad":
        return (
          <g>
            {/* V-shaped angry brows */}
            <line x1={cx-s*0.23} y1={cy-s*0.20} x2={cx-s*0.05} y2={cy-s*0.11}
              stroke="white" strokeWidth={s*0.060} strokeLinecap="round" opacity="0.92" />
            <line x1={cx+s*0.05} y1={cy-s*0.11} x2={cx+s*0.23} y2={cy-s*0.20}
              stroke="white" strokeWidth={s*0.060} strokeLinecap="round" opacity="0.92" />
            {/* Narrow squinting eyes */}
            <ellipse cx={cx-s*0.14} cy={cy-s*0.04} rx={s*0.105} ry={hovered ? s*0.040 : s*0.068}
              fill="white" opacity="0.93" />
            <ellipse cx={cx+s*0.14} cy={cy-s*0.04} rx={s*0.105} ry={hovered ? s*0.040 : s*0.068}
              fill="white" opacity="0.93" />
            <ellipse cx={cx-s*0.14} cy={cy-s*0.04} rx={s*0.058} ry={hovered ? s*0.028 : s*0.038}
              fill="#dc2626" opacity="0.80" />
            <ellipse cx={cx+s*0.14} cy={cy-s*0.04} rx={s*0.058} ry={hovered ? s*0.028 : s*0.038}
              fill="#dc2626" opacity="0.80" />
          </g>
        );

      case "grumpy":
        return (
          <g>
            {/* Heavy heavy brows dragging down */}
            <path d={`M${cx-s*0.24},${cy-s*0.17} Q${cx-s*0.13},${cy-s*0.10} ${cx-s*0.04},${cy-s*0.15}`}
              stroke="white" strokeWidth={s*0.065} strokeLinecap="round" fill="none" opacity="0.90" />
            <path d={`M${cx+s*0.04},${cy-s*0.15} Q${cx+s*0.13},${cy-s*0.10} ${cx+s*0.24},${cy-s*0.17}`}
              stroke="white" strokeWidth={s*0.065} strokeLinecap="round" fill="none" opacity="0.90" />
            <circle cx={cx-s*0.14} cy={cy-s*0.04} r={s*0.090} fill="white" opacity="0.92" />
            <circle cx={cx+s*0.14} cy={cy-s*0.04} r={s*0.090} fill="white" opacity="0.92" />
            <circle cx={cx-s*0.13} cy={cy-s*0.03} r={s*0.044} fill={p.b2} opacity="0.87" />
            <circle cx={cx+s*0.13} cy={cy-s*0.03} r={s*0.044} fill={p.b2} opacity="0.87" />
          </g>
        );

      case "derp":
        return (
          <g>
            <circle cx={cx-s*0.16} cy={cy-s*0.08} r={s*0.125} fill="white" opacity="0.97" />
            <circle cx={cx+s*0.10} cy={cy-s*0.04} r={s*0.090} fill="white" opacity="0.97" />
            <circle cx={cx-s*0.12} cy={cy-s*0.05} r={s*0.068} fill={p.b1} opacity="0.90" />
            <circle cx={cx+s*0.12} cy={cy-s*0.02} r={s*0.046} fill={p.b1} opacity="0.90" />
            <circle cx={cx-s*0.20} cy={cy-s*0.12} r={s*0.030} fill="white" opacity="0.62" />
          </g>
        );

      case "smirk":
        return (
          <g>
            {/* Left eye half-lidded (lid covers top third) */}
            <ellipse cx={cx-s*0.14} cy={cy-s*0.07} rx={s*0.105} ry={s*0.072} fill="white" opacity="0.92" />
            <rect x={cx-s*0.245} y={cy-s*0.135} width={s*0.21} height={s*0.048} rx={s*0.022}
              fill={p.b1} opacity="0.72" />
            <ellipse cx={cx+s*0.14} cy={cy-s*0.07} rx={s*0.105} ry={s*0.082} fill="white" opacity="0.92" />
            <circle cx={cx-s*0.13} cy={cy-s*0.05} r={s*0.042} fill={p.b1} opacity="0.86" />
            <circle cx={cx+s*0.13} cy={cy-s*0.05} r={s*0.042} fill={p.b1} opacity="0.86" />
          </g>
        );

      case "cool":
        return (
          <g>
            <rect x={cx-s*0.31} y={cy-s*0.14} width={s*0.62} height={s*0.145} rx={s*0.04}
              fill="rgba(0,0,0,0.60)" opacity="0.92" />
            <rect x={cx-s*0.30} y={cy-s*0.135} width={s*0.60} height={s*0.065} rx={s*0.025}
              fill="rgba(255,255,255,0.13)" />
            <rect x={cx-s*0.27} y={cy-s*0.13} width={s*0.115} height={s*0.045} rx={s*0.02}
              fill="rgba(255,255,255,0.38)" />
          </g>
        );

      case "nervous":
        return (
          <g>
            <circle cx={cx-s*0.15} cy={cy-s*0.07} r={s*0.115} fill="white" opacity="0.97" />
            <circle cx={cx+s*0.15} cy={cy-s*0.07} r={s*0.115} fill="white" opacity="0.97" />
            <circle cx={cx-s*0.14} cy={cy-s*0.06} r={s*0.058} fill={p.b1} opacity="0.90" />
            <circle cx={cx+s*0.14} cy={cy-s*0.06} r={s*0.058} fill={p.b1} opacity="0.90" />
            {/* Pupils shifted upward — worried look */}
            <circle cx={cx-s*0.14} cy={cy-s*0.10} r={s*0.026} fill="white" opacity="0.62" />
            <circle cx={cx+s*0.14} cy={cy-s*0.10} r={s*0.026} fill="white" opacity="0.62" />
            {/* Sweat drop */}
            <ellipse cx={cx+s*0.29} cy={cy-s*0.03} rx={s*0.026} ry={s*0.040}
              fill={p.acc} opacity="0.85"
              style={{ animation: "rbSweat 2.2s ease-in-out infinite" }} />
          </g>
        );

      default: return null;
    }
  }

  // ── Mouth ─────────────────────────────────────────────────────────────────
  function renderMouth() {
    switch (personality) {
      case "happy": {
        const smileDepth = hovered ? cy+s*0.32 : cy+s*0.26;
        return (
          <g>
            <path d={`M${cx-s*0.21},${cy+s*0.13} Q${cx},${smileDepth} ${cx+s*0.21},${cy+s*0.13}`}
              stroke="white" strokeWidth={s*0.060} strokeLinecap="round" fill="none" opacity="0.92" />
            {hovered && (
              <path d={`M${cx-s*0.16},${cy+s*0.16} Q${cx},${cy+s*0.29} ${cx+s*0.16},${cy+s*0.16}`}
                fill="white" opacity="0.28" />
            )}
          </g>
        );
      }
      case "mad": {
        const y1 = cy + s * (hovered ? 0.22 : 0.17);
        const y2 = cy + s * (hovered ? 0.14 : 0.10);
        return (
          <path d={`M${cx-s*0.19},${y1} Q${cx},${y2} ${cx+s*0.19},${y1}`}
            stroke="white" strokeWidth={s*0.057} strokeLinecap="round" fill="none" opacity="0.87" />
        );
      }
      case "grumpy": {
        const midY = cy + s * (hovered ? 0.15 : 0.12);
        return (
          <path d={`M${cx-s*0.18},${cy+s*0.22} Q${cx},${midY} ${cx+s*0.18},${cy+s*0.22}`}
            stroke="white" strokeWidth={s*0.057} strokeLinecap="round" fill="none" opacity="0.84" />
        );
      }
      case "derp":
        return (
          <g>
            <path d={`M${cx-s*0.16},${cy+s*0.14} Q${cx},${cy+s*0.23} ${cx+s*0.16},${cy+s*0.14}`}
              stroke="white" strokeWidth={s*0.052} strokeLinecap="round" fill="none" opacity="0.82" />
            {/* Tongue — big and floppy */}
            <ellipse cx={cx+s*0.06} cy={cy+s*0.32} rx={s*0.09} ry={s*0.075}
              fill="#fca5a5" opacity="0.94" />
            <ellipse cx={cx+s*0.06} cy={cy+s*0.36} rx={s*0.055} ry={s*0.040}
              fill="#f87171" opacity="0.70" />
            <line x1={cx+s*0.06} y1={cy+s*0.27} x2={cx+s*0.06} y2={cy+s*0.37}
              stroke="#f87171" strokeWidth={s*0.018} opacity="0.65" strokeLinecap="round" />
          </g>
        );
      case "smirk":
        return (
          <path d={`M${cx-s*0.09},${cy+s*0.18} Q${cx+s*0.06},${cy+s*0.23} ${cx+s*0.20},${cy+s*0.14}`}
            stroke="white" strokeWidth={s*0.057} strokeLinecap="round" fill="none" opacity="0.87" />
        );
      case "wink":
        return (
          <path d={`M${cx-s*0.18},${cy+s*0.15} Q${cx},${cy+s*0.27} ${cx+s*0.18},${cy+s*0.15}`}
            stroke="white" strokeWidth={s*0.060} strokeLinecap="round" fill="none" opacity="0.90" />
        );
      case "cool":
        return (
          <path d={`M${cx-s*0.15},${cy+s*0.19} L${cx+s*0.15},${cy+s*0.19}`}
            stroke="white" strokeWidth={s*0.050} strokeLinecap="round" opacity="0.82" />
        );
      case "nervous":
        return (
          <path d={`M${cx-s*0.15},${cy+s*0.19} Q${cx-s*0.03},${cy+s*0.16} ${cx+s*0.02},${cy+s*0.19} Q${cx+s*0.09},${cy+s*0.24} ${cx+s*0.15},${cy+s*0.19}`}
            stroke="white" strokeWidth={s*0.050} strokeLinecap="round" fill="none" opacity="0.82" />
        );
      case "hi_brow":
        return (
          <path d={`M${cx-s*0.18},${cy+s*0.15} Q${cx},${hovered ? cy+s*0.27 : cy+s*0.22} ${cx+s*0.18},${cy+s*0.15}`}
            stroke="white" strokeWidth={s*0.058} strokeLinecap="round" fill="none" opacity="0.88" />
        );
      case "one_brow":
        return (
          <path d={`M${cx-s*0.14},${cy+s*0.18} Q${cx+s*0.02},${hovered ? cy+s*0.25 : cy+s*0.20} ${cx+s*0.16},${cy+s*0.15}`}
            stroke="white" strokeWidth={s*0.055} strokeLinecap="round" fill="none" opacity="0.84" />
        );
      default: return null;
    }
  }

  return (
    <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} fill="none" aria-hidden>
      <defs>
        <linearGradient id={`${id}g`} x1="0" y1="0" x2={s} y2={s} gradientUnits="userSpaceOnUse">
          <stop stopColor={p.b1} />
          <stop offset="1" stopColor={p.b2} />
        </linearGradient>
        <linearGradient id={`${id}sh`} x1="0" y1="0" x2="0" y2={s} gradientUnits="userSpaceOnUse">
          <stop stopColor="rgba(255,255,255,0.44)" />
          <stop offset="0.52" stopColor="rgba(255,255,255,0)" />
          <stop offset="1" stopColor="rgba(0,0,0,0.14)" />
        </linearGradient>
        <filter id={`${id}dr`} x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy={s*0.055} stdDeviation={s*0.10} floodColor={p.b1} floodOpacity="0.55" />
        </filter>
        <clipPath id={`${id}cp`}>{bodyClip()}</clipPath>
      </defs>

      {/* ANTENNA */}
      {antenna !== "none" && (
        <g style={{ animation: hovered ? "rbAntenna 0.55s ease-in-out infinite" : undefined }}>
          <line x1={cx} y1={s*0.12} x2={cx} y2={body === "circle" ? s*0.22 : s*0.11}
            stroke={p.b1} strokeWidth={s*0.055} strokeLinecap="round" opacity="0.85" />
          {antenna === "ball"  && <circle cx={cx} cy={s*0.07} r={s*0.068} fill={p.acc} style={{ filter: `drop-shadow(0 0 ${s*0.05}px ${p.acc})` }} />}
          {antenna === "flat"  && <rect x={cx-s*0.09} y={s*0.04} width={s*0.18} height={s*0.065} rx={s*0.025} fill={p.acc} opacity="0.92" />}
          {antenna === "spike" && <path d={`M${cx-s*0.07} ${s*0.12} L${cx} ${s*0.02} L${cx+s*0.07} ${s*0.12}`} fill={p.acc} opacity="0.92" />}
        </g>
      )}

      {/* BODY */}
      <g filter={`url(#${id}dr)`}>{bodyFill()}</g>

      {/* SHINE */}
      <g clipPath={`url(#${id}cp)`}>
        <rect width={s} height={s} fill={`url(#${id}sh)`} />
        <ellipse cx={cx-s*0.14} cy={cy-s*0.17} rx={s*0.20} ry={s*0.13} fill="white" opacity="0.16" />
      </g>

      {/* EARS */}
      {ear === "bolt" && (
        <>
          <rect x={s*0.01} y={cy-s*0.09} width={s*0.085} height={s*0.18} rx={s*0.03} fill={p.b1} opacity="0.72" />
          <rect x={s*0.905} y={cy-s*0.09} width={s*0.085} height={s*0.18} rx={s*0.03} fill={p.b1} opacity="0.72" />
        </>
      )}
      {ear === "round" && (
        <>
          <ellipse cx={s*0.07} cy={cy} rx={s*0.07} ry={s*0.11} fill={p.b1} opacity="0.65" />
          <ellipse cx={s*0.93} cy={cy} rx={s*0.07} ry={s*0.11} fill={p.b1} opacity="0.65" />
        </>
      )}

      {/* CHEEKS */}
      {cheeks && (
        <>
          <ellipse cx={cx-s*0.30} cy={cy+s*0.06} rx={s*0.088} ry={s*0.056} fill={p.acc} opacity="0.45" />
          <ellipse cx={cx+s*0.30} cy={cy+s*0.06} rx={s*0.088} ry={s*0.056} fill={p.acc} opacity="0.45" />
        </>
      )}

      {/* EYES */}
      {renderEyes()}

      {/* MOUTH */}
      {renderMouth()}
    </svg>
  );
}

// ─── Public API — accepts cardHovered from parent ─────────────────────────────
interface RobotAvatarProps {
  seed: string;
  size?: number;
  cardHovered?: boolean; // passed from the card's own hover state
  className?: string;
}

export function RobotAvatar({ seed, size = 56, cardHovered = false, className }: RobotAvatarProps) {
  const cfg = React.useMemo(() => getConfig(seed), [seed]);
  const persona = cfg.personality;
  const noBlink = NO_BLINK_PERSONAS.has(persona);

  // ── Blink (only for blink-capable personalities) ──────────────────────────
  const [blinking, setBlinking] = React.useState(false);

  React.useEffect(() => {
    ensureCSS();
    if (noBlink) return;

    let timer: ReturnType<typeof setTimeout>;
    function scheduleBlink() {
      // Every 10–15 seconds, one single blink
      const delay = 10_000 + Math.random() * 5_000;
      timer = setTimeout(() => {
        setBlinking(true);
        setTimeout(() => {
          setBlinking(false);
          scheduleBlink();
        }, 130);
      }, delay);
    }
    // Stagger initial blink so all robots don't sync
    const init = setTimeout(scheduleBlink, Math.random() * 9_000);
    return () => { clearTimeout(timer); clearTimeout(init); };
  }, [noBlink]);

  // ── Wink cycle (wink personality only) ──────────────────────────────────
  const [winking, setWinking] = React.useState(false);

  React.useEffect(() => {
    if (persona !== "wink") return;
    let timer: ReturnType<typeof setTimeout>;

    function scheduleWink() {
      // Open for 3–4.5 seconds, then wink for 0.28s
      const openTime = 3_000 + Math.random() * 1_500;
      timer = setTimeout(() => {
        setWinking(true);
        setTimeout(() => {
          setWinking(false);
          scheduleWink();
        }, 280);
      }, openTime);
    }
    const init = setTimeout(scheduleWink, Math.random() * 2_000);
    return () => { clearTimeout(timer); clearTimeout(init); };
  }, [persona]);

  // ── Brow raise cycle (hi_brow / one_brow only) ───────────────────────────
  const [browRaised, setBrowRaised] = React.useState(false);

  React.useEffect(() => {
    if (persona !== "hi_brow" && persona !== "one_brow") return;
    let timer: ReturnType<typeof setTimeout>;

    function scheduleBrow() {
      // Raise every 5–8 seconds, hold for 0.8s
      const delay = 5_000 + Math.random() * 3_000;
      timer = setTimeout(() => {
        setBrowRaised(true);
        setTimeout(() => {
          setBrowRaised(false);
          scheduleBrow();
        }, 800);
      }, delay);
    }
    const init = setTimeout(scheduleBrow, Math.random() * 3_000);
    return () => { clearTimeout(timer); clearTimeout(init); };
  }, [persona]);

  // ── Bounce animation (driven by card hover) ──────────────────────────────
  // Use a key to force animation restart every time card is hovered
  const [bounceKey, setBounceKey] = React.useState(0);

  React.useEffect(() => {
    if (cardHovered) {
      setBounceKey((k) => k + 1);
    }
  }, [cardHovered]);

  const bounceAnim = cardHovered
    ? persona === "nervous"
      // Nervous: repeating shake at restrained height
      ? "rbNervous 0.42s ease-in-out infinite"
      // Everyone else: slow two-bounce, plays once, holds at end
      : "rbBounce 1.35s cubic-bezier(0.34, 1.2, 0.64, 1) forwards"
    : "rbIdle 4s ease-in-out infinite";

  return (
    <div
      className={className}
      style={{ display: "inline-flex", position: "relative" }}
    >
      <div key={bounceKey} style={{ animation: bounceAnim, willChange: "transform" }}>
        <RobotSVG
          seed={seed}
          size={size}
          blinking={blinking}
          winking={winking}
          browRaised={browRaised}
          hovered={cardHovered}
        />
      </div>
    </div>
  );
}

// Backward compat alias
export const HoverRobot = RobotAvatar;
