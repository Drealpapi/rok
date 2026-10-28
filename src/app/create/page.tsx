"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { ApplicationShell } from "@/components/layout/application-shell";
import { Agent3D } from "@/components/shared/agent-3d";
import { MODEL_CATALOG, STRATEGIES } from "@/lib/constants";
import { ALL_CHARACTER_IDS } from "@/components/shared/agent-3d-config";

const ALL_IDS = ALL_CHARACTER_IDS;

const STEPS = ["Character", "Identity", "Strategy", "Funding", "Review"] as const;
type Step = typeof STEPS[number];

const STEP_KEYS: Step[] = [...STEPS];

interface WizardState {
  characterId: string;
  name:        string;
  handle:      string;
  bio:         string;
  modelId:     string;
  strategyId:  string;
  funding:     string;
}

const INIT: WizardState = {
  characterId: "agent-01",
  name: "", handle: "", bio: "",
  modelId: "gpt-4o-mini",
  strategyId: "momentum",
  funding: "0.1",
};

/*
  Thumbnail colours — one per character, purely CSS, no WebGL.
  The big preview is the only Canvas on this step.
*/
const THUMB_COLORS = [
  "#3b82f6","#ec4899","#8b5cf6","#f59e0b","#10b981","#6366f1",
  "#06b6d4","#ef4444","#84cc16","#f97316","#a855f7","#14b8a6",
  "#e879f9","#fb923c","#34d399","#60a5fa","#f472b6","#4ade80",
  "#fbbf24","#c084fc","#38bdf8","#fb7185","#a3e635",
];

/* ─── Character selector ──────────────────────────────────────────────────── */
function CharacterStep({ state, update }: { state: WizardState; update: (p: Partial<WizardState>) => void }) {
  const [previewHover, setPreviewHover] = React.useState(false);
  // Track whether the big preview canvas has been mounted yet
  // Re-key it when characterId changes so R3F re-mounts with the new GLB
  const previewKey = state.characterId;

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-base font-semibold text-[--text-primary] mb-1">Choose your character</h2>
        <p className="text-sm text-[--text-muted]">Your agent's 3D identity. Pick one — it's permanent.</p>
      </div>

      {/* ── Large 3D preview — ONE canvas, swaps GLB on selection ── */}
      <div
        className="relative flex items-center justify-center rounded-xl"
        style={{
          minHeight: "300px",
          background: "linear-gradient(160deg, #111118 0%, #1a1a2e 100%)",
          border: "1px solid var(--surface-border)",
        }}
        onMouseEnter={() => setPreviewHover(true)}
        onMouseLeave={() => setPreviewHover(false)}
      >
        <div aria-hidden className="absolute rounded-full pointer-events-none"
          style={{ width: "260px", height: "260px",
            background: "radial-gradient(circle, rgba(255,118,40,0.18) 0%, transparent 70%)" }} />
        <div key={previewKey} style={{ overflow: "visible", zIndex: 1, position: "relative",
          filter: "drop-shadow(0 12px 32px rgba(255,118,40,0.40))" }}>
          <Agent3D seed={state.characterId} size={260} cardHovered={previewHover} accentColor="#ff7628" />
        </div>
        <span className="absolute bottom-3 left-4 text-[10px] font-mono"
          style={{ color: "rgba(255,255,255,0.35)" }}>
          #{String(ALL_IDS.indexOf(state.characterId) + 1).padStart(2, "0")} of 23
        </span>
      </div>

      {/* ── Thumbnail grid — CSS only, NO WebGL canvases ── */}
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-widest mb-3"
          style={{ color: "var(--text-muted)" }}>All characters</p>
        <div className="grid grid-cols-6 sm:grid-cols-8 gap-2">
          {ALL_IDS.map((id, idx) => {
            const selected = state.characterId === id;
            const color    = THUMB_COLORS[idx % THUMB_COLORS.length];
            return (
              <button
                key={id}
                onClick={() => update({ characterId: id })}
                aria-label={`Select character ${idx + 1}`}
                aria-pressed={selected}
                style={{
                  position:     "relative",
                  padding:      "6px",
                  borderRadius: "12px",
                  background:   selected ? `${color}22` : "var(--surface-subtle)",
                  border:       selected ? `2px solid ${color}` : "1px solid var(--surface-border)",
                  transform:    selected ? "scale(1.1)" : "scale(1)",
                  boxShadow:    selected ? `0 0 12px ${color}66` : "none",
                  transition:   "all 0.15s ease",
                  cursor:       "pointer",
                  aspectRatio:  "1",
                  display:      "flex",
                  alignItems:   "center",
                  justifyContent: "center",
                }}
              >
                {/* Colour orb */}
                <div style={{
                  width:        "100%",
                  aspectRatio:  "1",
                  borderRadius: "50%",
                  background:   `radial-gradient(circle at 35% 30%, ${color}ff 0%, ${color}bb 50%, ${color}66 100%)`,
                  boxShadow:    `0 2px 8px ${color}66`,
                }} />
                {/* Number label */}
                <span style={{
                  position:  "absolute",
                  bottom:    3,
                  right:     5,
                  fontSize:  9,
                  color:     selected ? color : "rgba(255,255,255,0.4)",
                  fontWeight: 700,
                  fontFamily: "monospace",
                }}>
                  {String(idx + 1).padStart(2, "0")}
                </span>
                {selected && (
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center"
                    style={{ background: color, boxShadow: `0 0 8px ${color}88` }}>
                    <Check size={10} className="text-white" strokeWidth={3} />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ─── Identity step ───────────────────────────────────────────────────────── */
function IdentityStep({ state, update }: { state: WizardState; update: (p: Partial<WizardState>) => void }) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-base font-semibold text-[--text-primary] mb-1">Agent identity</h2>
        <p className="text-sm text-[--text-muted]">Name your agent and describe its personality.</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-[--text-muted] mb-1.5">Name <span className="text-[--accent]">*</span></label>
          <input className="w-full h-9 px-3 rounded-lg text-sm outline-none transition-colors"
            style={{ background: "var(--surface-subtle)", border: "1px solid var(--surface-border)", color: "var(--text-primary)" }}
            placeholder="NeuralNomad" value={state.name} maxLength={28}
            onChange={e => update({ name: e.target.value })} />
        </div>
        <div>
          <label className="block text-xs font-medium text-[--text-muted] mb-1.5">Handle <span className="text-[--accent]">*</span></label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm select-none" style={{ color: "var(--text-muted)" }}>@</span>
            <input className="w-full h-9 pl-6 pr-3 rounded-lg text-sm outline-none transition-colors"
              style={{ background: "var(--surface-subtle)", border: "1px solid var(--surface-border)", color: "var(--text-primary)" }}
              placeholder="neuralnomad" value={state.handle} maxLength={20}
              onChange={e => update({ handle: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "") })} />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-[--text-muted] mb-1.5">Personality & goals</label>
        <textarea className="w-full px-3 py-2.5 rounded-lg text-sm outline-none resize-none transition-colors"
          style={{ background: "var(--surface-subtle)", border: "1px solid var(--surface-border)", color: "var(--text-primary)", minHeight: "80px" }}
          placeholder="Momentum trader. Rides strong launches and exits before the crowd." value={state.bio} maxLength={400}
          onChange={e => update({ bio: e.target.value })} />
      </div>

      <div>
        <label className="block text-xs font-medium text-[--text-muted] mb-2">AI model</label>
        <div className="grid grid-cols-2 gap-2">
          {MODEL_CATALOG.filter(m => m.status === "available").map(m => (
            <button key={m.id} onClick={() => update({ modelId: m.id })}
              className="rounded-lg px-3 py-2.5 text-left text-xs transition-all"
              style={{
                background: state.modelId === m.id ? "var(--accent-muted)" : "var(--surface-subtle)",
                border: `1px solid ${state.modelId === m.id ? "var(--accent)" : "var(--surface-border)"}`,
                color: state.modelId === m.id ? "var(--accent)" : "var(--text-secondary)",
              }}>
              <p className="font-semibold">{m.label}</p>
              <p className="opacity-60">{m.provider}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Strategy step ───────────────────────────────────────────────────────── */
function StrategyStep({ state, update }: { state: WizardState; update: (p: Partial<WizardState>) => void }) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-base font-semibold text-[--text-primary] mb-1">Trading strategy</h2>
        <p className="text-sm text-[--text-muted]">Choose how your agent approaches the market.</p>
      </div>
      <div className="space-y-2">
        {STRATEGIES.map(s => (
          <button key={s.id} onClick={() => update({ strategyId: s.id })}
            className="w-full rounded-lg px-4 py-3 text-left transition-all"
            style={{
              background: state.strategyId === s.id ? "var(--accent-muted)" : "var(--surface-subtle)",
              border: `1px solid ${state.strategyId === s.id ? "var(--accent)" : "var(--surface-border)"}`,
            }}>
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-[--text-primary]">{s.label}</p>
              {state.strategyId === s.id && <Check size={14} style={{ color: "var(--accent)" }} />}
            </div>
            <p className="text-xs text-[--text-muted] mt-0.5 leading-relaxed">{s.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─── Funding step ────────────────────────────────────────────────────────── */
function FundingStep({ state, update }: { state: WizardState; update: (p: Partial<WizardState>) => void }) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-base font-semibold text-[--text-primary] mb-1">Fund the wallet</h2>
        <p className="text-sm text-[--text-muted]">
          Your agent needs ETH to trade. You can add more or withdraw at any time.
        </p>
      </div>
      <div className="rounded-lg p-4 space-y-2.5" style={{ background: "var(--surface-subtle)", border: "1px solid var(--surface-border)" }}>
        <p className="text-xs font-semibold text-[--text-primary]">How agent wallets work</p>
        {["Each agent gets its own isolated wallet.", "You retain full control — withdraw anytime.", "The agent never accesses your seed phrase.", "Minimum deposit is 0.01 ETH."].map(line => (
          <div key={line} className="flex items-start gap-2">
            <span className="mt-0.5 flex-shrink-0 w-3.5 h-3.5 rounded-full flex items-center justify-center" style={{ background: "var(--status-positive-bg)" }}>
              <Check size={8} style={{ color: "var(--status-positive)" }} />
            </span>
            <p className="text-xs text-[--text-muted]">{line}</p>
          </div>
        ))}
      </div>
      <div>
        <label className="block text-xs font-medium text-[--text-muted] mb-2">Initial deposit (ETH)</label>
        <div className="flex gap-2">
          {["0.01", "0.1", "0.25", "0.5", "1"].map(amt => (
            <button key={amt} onClick={() => update({ funding: amt })}
              className="flex-1 h-9 rounded-lg text-sm font-semibold transition-all"
              style={{
                background: state.funding === amt ? "var(--accent)" : "var(--surface-subtle)",
                color: state.funding === amt ? "white" : "var(--text-secondary)",
                border: `1px solid ${state.funding === amt ? "var(--accent)" : "var(--surface-border)"}`,
              }}>
              {amt}
            </button>
          ))}
        </div>
        <p className="text-[10px] text-[--text-muted] mt-2">
          Development mode — no real transaction will occur.
        </p>
      </div>
    </div>
  );
}

/* ─── Review step ─────────────────────────────────────────────────────────── */
function ReviewStep({ state }: { state: WizardState }) {
  const strategy = STRATEGIES.find(s => s.id === state.strategyId);
  const model    = MODEL_CATALOG.find(m => m.id === state.modelId);
  const [hover, setHover] = React.useState(false);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-base font-semibold text-[--text-primary] mb-1">Review your agent</h2>
        <p className="text-sm text-[--text-muted]">Confirm everything looks right before creating.</p>
      </div>

      <div className="flex items-center gap-4 p-4 rounded-lg" style={{ background: "var(--surface-subtle)", border: "1px solid var(--surface-border)" }}>
        <div style={{ overflow: "visible", flexShrink: 0 }} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
          <Agent3D seed={state.characterId} size={72} cardHovered={hover} accentColor="#ff7628" />
        </div>
        <div>
          <p className="font-semibold text-[--text-primary]">{state.name || "—"}</p>
          <p className="text-sm text-[--text-muted]">@{state.handle || "—"}</p>
          {state.bio && <p className="text-xs text-[--text-muted] mt-1 line-clamp-2">{state.bio}</p>}
        </div>
      </div>

      <div className="space-y-0 rounded-lg overflow-hidden" style={{ border: "1px solid var(--surface-border)" }}>
        {[
          { label: "Model",    value: model?.label ?? state.modelId,    locked: true  },
          { label: "Strategy", value: strategy?.label ?? state.strategyId, locked: false },
          { label: "Deposit",  value: `${state.funding} ETH`,           locked: false },
        ].map((row, i) => (
          <div key={row.label} className="flex items-center justify-between px-4 py-3"
            style={{ borderBottom: i < 2 ? "1px solid var(--surface-border)" : "none", background: "var(--surface-main)" }}>
            <div className="flex items-center gap-2">
              <span className="text-sm text-[--text-muted]">{row.label}</span>
              {row.locked && (
                <span className="rounded px-1.5 py-0.5 text-[9px] font-medium"
                  style={{ background: "var(--accent-muted)", color: "var(--accent)" }}>Locked after creation</span>
              )}
            </div>
            <span className="text-sm font-medium text-[--text-primary]">{row.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Main wizard ─────────────────────────────────────────────────────────── */
export default function CreateAgentPage() {
  const [stepIdx, setStepIdx] = React.useState(0);
  const [state, setState]     = React.useState<WizardState>(INIT);
  const [creating, setCreating] = React.useState(false);
  const [done, setDone]         = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const step = STEP_KEYS[stepIdx];

  function update(partial: Partial<WizardState>) { setState(p => ({ ...p, ...partial })); }

  function canAdvance() {
    if (step === "Identity") return state.name.trim().length >= 2 && state.handle.trim().length >= 2;
    return true;
  }

  async function handleCreate() {
    setCreating(true);
    setProgress(0);
    // Animate progress bar so the user sees something happening
    const steps = [
      { pct: 20,  delay: 200  },
      { pct: 50,  delay: 500  },
      { pct: 80,  delay: 900  },
      { pct: 100, delay: 1300 },
    ];
    for (const s of steps) {
      await new Promise(r => setTimeout(r, s.delay));
      setProgress(s.pct);
    }
    await new Promise(r => setTimeout(r, 300));
    setCreating(false);
    setDone(true);
  }

  /* ── Done screen ── */
  if (done) {
    return (
      <ApplicationShell>
        <div className="max-w-lg w-full mx-auto px-4 py-16 flex flex-col items-center text-center gap-6 anim-fade-up">
          {/* Success burst ring */}
          <div style={{ position: "relative", overflow: "visible" }}>
            <div aria-hidden style={{
              position: "absolute", inset: "-24px", borderRadius: "50%",
              border: "1px solid rgba(255,118,40,0.3)",
              animation: "scalePop 0.6s cubic-bezier(0.34,1.56,0.64,1) both",
            }} />
            <div aria-hidden style={{
              position: "absolute", inset: "-48px", borderRadius: "50%",
              border: "1px solid rgba(255,118,40,0.12)",
              animation: "scalePop 0.7s cubic-bezier(0.34,1.56,0.64,1) 0.1s both",
            }} />
            <div style={{ filter: "drop-shadow(0 12px 32px rgba(255,118,40,0.45))", overflow: "visible" }}>
              <Agent3D seed={state.characterId} size={140} cardHovered={true} accentColor="#ff7628" />
            </div>
          </div>

          <div className="anim-fade-up delay-3">
            <div className="flex items-center justify-center gap-2 mb-3">
              <span style={{
                display: "inline-flex", alignItems: "center", gap: "6px",
                background: "rgba(74,222,128,0.15)", color: "#4ade80",
                borderRadius: "100px", padding: "4px 12px", fontSize: "11px", fontWeight: 700,
              }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ade80", display: "inline-block" }} />
                ACTIVE
              </span>
            </div>
            <h2 className="text-2xl font-bold text-[--text-primary] mb-2" style={{ fontFamily: "var(--font-syne)" }}>
              {state.name} is live.
            </h2>
            <p className="text-sm mb-1" style={{ color: "var(--text-muted)" }}>
              Your agent is deployed and ready to trade.
            </p>
            <p className="text-xs" style={{ color: "var(--text-muted)", opacity: 0.6 }}>
              Development mode — no real wallet was deployed.
            </p>
          </div>

          {/* Stats preview */}
          <div className="flex items-center gap-6 anim-fade-up delay-4">
            {[
              { label: "Followers", val: "0" },
              { label: "Strategy",  val: STRATEGIES.find(s => s.id === state.strategyId)?.label ?? "—" },
              { label: "Deposit",   val: `${state.funding} ETH` },
            ].map(s => (
              <div key={s.label} style={{ textAlign: "center" }}>
                <p style={{ fontSize: "16px", fontWeight: 800, color: "var(--text-primary)", fontFamily: "var(--font-syne)" }}>{s.val}</p>
                <p style={{ fontSize: "10px", color: "var(--text-muted)", marginTop: 2 }}>{s.label}</p>
              </div>
            ))}
          </div>

          <div className="flex gap-3 anim-fade-up delay-5">
            <Link href="/agents"
              className="rounded-lg px-6 py-2.5 text-sm font-semibold text-white transition-all hover:opacity-90 hover:-translate-y-0.5"
              style={{ background: "var(--accent)", boxShadow: "0 0 20px rgba(255,118,40,0.4)" }}>
              View all agents
            </Link>
            <button onClick={() => { setDone(false); setStepIdx(0); setState(INIT); setProgress(0); }}
              className="rounded-lg px-6 py-2.5 text-sm font-medium transition-colors hover:bg-[--surface-hover]"
              style={{ border: "1px solid var(--surface-border)", color: "var(--text-secondary)" }}>
              Create another
            </button>
          </div>
        </div>
      </ApplicationShell>
    );
  }

  /* ── Creating overlay ── */
  if (creating) {
    return (
      <ApplicationShell>
        <div className="max-w-lg w-full mx-auto px-4 py-24 flex flex-col items-center text-center gap-8">
          <div style={{ position: "relative", overflow: "visible" }}>
            {/* Spinning orbit ring */}
            <div aria-hidden style={{
              position: "absolute", inset: "-20px", borderRadius: "50%",
              border: "2px solid transparent",
              borderTopColor: "#ff7628",
              borderRightColor: "rgba(255,118,40,0.3)",
              animation: "orbitSpin 1.2s linear infinite",
            }} />
            <div style={{ overflow: "visible" }}>
              <Agent3D seed={state.characterId} size={120} cardHovered={true} accentColor="#ff7628" />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-[--text-primary] mb-1" style={{ fontFamily: "var(--font-syne)" }}>
              Deploying {state.name || "your agent"}…
            </h3>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>Setting up wallet, configuring strategy</p>
          </div>

          {/* Progress bar */}
          <div style={{ width: "100%", maxWidth: 320 }}>
            <div style={{
              height: 4, borderRadius: 4,
              background: "var(--surface-subtle)",
              border: "1px solid var(--surface-border)",
              overflow: "hidden",
            }}>
              <div style={{
                height: "100%",
                width: `${progress}%`,
                background: "linear-gradient(90deg, #ff7628, #ff9a52)",
                borderRadius: 4,
                transition: "width 0.4s cubic-bezier(0.22,1,0.36,1)",
                boxShadow: "0 0 8px rgba(255,118,40,0.6)",
              }} />
            </div>
            <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 8 }}>{progress}%</p>
          </div>
        </div>
      </ApplicationShell>
    );
  }

  return (
    <ApplicationShell>
      <div className="max-w-3xl w-full mx-auto px-4 py-5">

        {/* Back */}
        <Link href="/agents"
          className="inline-flex items-center gap-1 text-sm text-[--text-muted] hover:text-[--text-primary] transition-colors mb-5">
          <ArrowLeft size={14} /> Agents
        </Link>

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-6">
          {STEP_KEYS.map((s, i) => (
            <React.Fragment key={s}>
              <div className="flex items-center gap-2">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors"
                  style={{
                    background: i < stepIdx ? "var(--status-positive)" : i === stepIdx ? "var(--accent)" : "var(--surface-subtle)",
                    color:      i <= stepIdx ? "white" : "var(--text-muted)",
                    border:     `1px solid ${i === stepIdx ? "var(--accent)" : "var(--surface-border)"}`,
                  }}>
                  {i < stepIdx ? <Check size={10} strokeWidth={3} /> : i + 1}
                </div>
                <span className="text-xs hidden sm:block transition-colors"
                  style={{ color: i === stepIdx ? "var(--text-primary)" : "var(--text-muted)", fontWeight: i === stepIdx ? 600 : 400 }}>
                  {s}
                </span>
              </div>
              {i < STEP_KEYS.length - 1 && (
                <div className="flex-1 h-px" style={{ background: i < stepIdx ? "var(--accent)" : "var(--surface-border)" }} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Step content — animate on step change */}
        <div key={stepIdx} className="card-3d p-5 mb-4 anim-fade-up" style={{ animationDuration: "0.30s" }}>
          {step === "Character" && <CharacterStep state={state} update={update} />}
          {step === "Identity"  && <IdentityStep  state={state} update={update} />}
          {step === "Strategy"  && <StrategyStep  state={state} update={update} />}
          {step === "Funding"   && <FundingStep   state={state} update={update} />}
          {step === "Review"    && <ReviewStep    state={state} />}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => stepIdx > 0 ? setStepIdx(i => i - 1) : undefined}
            disabled={stepIdx === 0}
            className="flex items-center gap-1.5 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors disabled:opacity-30"
            style={{ border: "1px solid var(--surface-border)", color: "var(--text-secondary)" }}>
            <ArrowLeft size={14} /> Back
          </button>

          {stepIdx < STEP_KEYS.length - 1 ? (
            <button
              onClick={() => canAdvance() && setStepIdx(i => i + 1)}
              disabled={!canAdvance()}
              className="flex items-center gap-1.5 rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-40"
              style={{ background: "var(--accent)" }}>
              Continue <ArrowRight size={14} />
            </button>
          ) : (
            <button
              onClick={handleCreate}
              className="flex items-center gap-1.5 rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition-all hover:opacity-90 hover:-translate-y-0.5"
              style={{ background: "var(--accent)", boxShadow: "0 0 16px rgba(255,118,40,0.35)" }}>
              <Check size={14} /> Deploy {state.name || "Agent"}
            </button>
          )}
        </div>

      </div>
    </ApplicationShell>
  );
}
