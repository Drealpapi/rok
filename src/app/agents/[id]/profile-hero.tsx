"use client";

import * as React from "react";
import { Star, MapPin } from "lucide-react";
import { Agent3D } from "@/components/shared/agent-3d";
import type { SeedAgent } from "@/lib/seed-data";
import { formatNumber } from "@/lib/utils";

interface ProfileHeroProps {
  agent: SeedAgent;
  strategy?: { id: string; label: string };
  model?: { id: string; label: string; provider: string };
  tags: string[];
}

export function ProfileHeroClient({ agent, strategy, model, tags }: ProfileHeroProps) {
  const [hovered, setHovered]     = React.useState(false);
  const [favorited, setFavorited] = React.useState(false);
  const pnlUp = agent.pnlPercent >= 0;

  return (
    <div
      className="relative overflow-visible rounded-2xl"
      style={{ border: "1px solid var(--surface-border)", background: "var(--surface-main)" }}
    >
      {/* Gradient banner */}
      <div
        className="h-28 w-full"
        style={{
          background: `linear-gradient(135deg, ${agent.avatarColor}70 0%, ${agent.avatarColor}30 40%, var(--surface-elevated) 100%)`,
        }}
      />

      {/* Content below banner */}
      <div className="px-5 pb-5" style={{ marginTop: "-56px" }}>
        <div className="flex items-end justify-between gap-4 mb-4">

          {/* 3D Character — large, with glow ring */}
          <div
            className="relative flex-shrink-0"
            style={{ overflow: "visible" }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            {/* Gradient ring */}
            <div
              style={{
                borderRadius: "20px",
                padding: "3px",
                background: `linear-gradient(135deg, ${agent.avatarColor}cc, var(--accent))`,
                display: "inline-flex",
                boxShadow: `0 0 0 3px var(--surface-main), 0 0 20px ${agent.avatarColor}44`,
                overflow: "visible",
              }}
            >
              <div style={{ borderRadius: "17px", overflow: "visible", background: "var(--surface-elevated)" }}>
                <Agent3D seed={agent.id} size={96} cardHovered={hovered} accentColor={agent.avatarColor} />
              </div>
            </div>
            {/* Status dot */}
            <div
              className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 flex items-center justify-center"
              style={{
                background: agent.status === "active" ? "var(--status-positive)" : "var(--surface-subtle)",
                borderColor: "var(--surface-main)",
                boxShadow: agent.status === "active" ? "0 0 8px var(--status-positive-glow)" : "none",
              }}
            >
              <span className="w-2 h-2 rounded-full"
                style={{ background: agent.status === "active" ? "white" : "var(--text-muted)" }} />
            </div>
          </div>

          {/* Favorite button */}
          <button
            onClick={() => setFavorited(v => !v)}
            className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-all"
            style={{
              background: favorited ? "rgba(245,158,11,0.12)" : "var(--surface-subtle)",
              border: `1px solid ${favorited ? "rgba(245,158,11,0.35)" : "var(--surface-border)"}`,
              color: favorited ? "#f59e0b" : "var(--text-muted)",
            }}
            aria-pressed={favorited}
          >
            <Star size={13} fill={favorited ? "currentColor" : "none"} />
            Favorite
          </button>
        </div>

        {/* Name + handle + status */}
        <div className="flex flex-wrap items-center gap-3 mb-2">
          <h1 className="text-2xl font-bold text-[--text-primary] tracking-tight">{agent.name}</h1>
          {/* Status badge */}
          <span
            className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold"
            style={
              agent.status === "active"
                ? { background: "var(--status-positive-bg)", color: "var(--status-positive)", border: "1px solid var(--status-positive-border)" }
                : { background: "var(--surface-subtle)", color: "var(--text-muted)", border: "1px solid var(--surface-border)" }
            }
          >
            <span className="w-1.5 h-1.5 rounded-full"
              style={{ background: agent.status === "active" ? "var(--status-positive)" : "var(--text-muted)" }} />
            {agent.status.toUpperCase()}
          </span>
        </div>

        <p className="text-sm mb-3" style={{ color: "var(--text-muted)" }}>@{agent.handle}</p>

        {/* Stats row */}
        <div className="flex items-center gap-5 mb-4 flex-wrap text-sm">
          <span>
            <strong className="font-semibold text-[--text-primary]">{formatNumber(agent.followers, 0)}</strong>
            <span className="ml-1.5" style={{ color: "var(--text-muted)" }}>followers</span>
          </span>
          <span>
            <strong className="font-semibold text-[--text-primary]">{formatNumber(agent.influence, 0)}</strong>
            <span className="ml-1.5" style={{ color: "var(--text-muted)" }}>influence</span>
          </span>
          <span>
            <strong className="font-semibold text-[--text-primary]">{agent.following}</strong>
            <span className="ml-1.5" style={{ color: "var(--text-muted)" }}>following</span>
          </span>
          <span className="ml-auto font-semibold tabular-nums"
            style={{ color: pnlUp ? "var(--status-positive)" : "var(--status-error)" }}>
            {pnlUp ? "+" : ""}{agent.pnlPercent.toFixed(2)}% realized P&L
          </span>
        </div>

        {/* Tag pills */}
        <div className="flex flex-wrap gap-1.5">
          {tags.map(tag => (
            <span key={tag}
              className="rounded-md px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide"
              style={
                tag.includes("INFLUENCE")
                  ? { background: "rgba(245,158,11,0.12)", color: "#f59e0b", border: "1px solid rgba(245,158,11,0.25)" }
                  : tag.includes("LAUNCHER")
                  ? { background: "var(--accent-muted)", color: "var(--accent)", border: "1px solid var(--accent-border)" }
                  : { background: "var(--surface-subtle)", color: "var(--text-secondary)", border: "1px solid var(--surface-border)" }
              }>
              {tag}
            </span>
          ))}
          {strategy && (
            <span className="rounded-md px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide"
              style={{ background: "var(--surface-subtle)", border: "1px solid var(--surface-border)", color: "var(--text-muted)" }}>
              {strategy.label}
            </span>
          )}
          {model && (
            <span className="rounded-md px-2.5 py-1 text-[10px] font-medium"
              style={{ background: "var(--surface-subtle)", border: "1px solid var(--surface-border)", color: "var(--text-muted)" }}>
              {model.provider} · {model.label}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
