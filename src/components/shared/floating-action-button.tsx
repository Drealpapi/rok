"use client";

import * as React from "react";
import Link from "next/link";
import { Plus, X } from "lucide-react";
import { usePathname } from "next/navigation";

/* Anti-gravity floating action button — shown on all app pages except landing and create */
export function FloatingActionButton() {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);

  // Don't show on landing page or create page (create has its own flow)
  if (pathname === "/" || pathname.startsWith("/create")) return null;

  const ACTIONS = [
    { label: "Create agent", href: "/create",      emoji: "🤖" },
    { label: "Browse agents",href: "/agents",      emoji: "👾" },
    { label: "View coins",   href: "/coins",       emoji: "🪙" },
    { label: "See feed",     href: "/feed",        emoji: "📡" },
  ];

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setOpen(false)}
          aria-hidden
        />
      )}

      {/* Menu items — float up from the button */}
      <div
        className="fixed bottom-20 right-4 lg:bottom-6 lg:right-6 z-50 flex flex-col items-end gap-2"
        style={{
          transition: "opacity 0.2s, transform 0.2s",
          opacity: open ? 1 : 0,
          transform: open ? "translateY(0)" : "translateY(12px)",
          pointerEvents: open ? "auto" : "none",
        }}
      >
        {ACTIONS.map((action, i) => (
          <Link
            key={action.href}
            href={action.href}
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm font-semibold text-[--text-primary] shadow-lg transition-all hover:scale-[1.03]"
            style={{
              background: "var(--surface-elevated)",
              border: "1px solid var(--surface-border)",
              boxShadow: "var(--shadow-raised)",
              animationDelay: `${i * 0.04}s`,
              transitionDelay: `${i * 0.03}s`,
            }}
          >
            <span>{action.emoji}</span>
            {action.label}
          </Link>
        ))}
      </div>

      {/* The FAB itself — anti-gravity bounce on mount */}
      <button
        onClick={() => setOpen(v => !v)}
        className="fixed bottom-20 right-4 lg:bottom-6 lg:right-6 z-50 w-13 h-13 rounded-full flex items-center justify-center text-white shadow-xl transition-all"
        style={{
          width: "52px",
          height: "52px",
          background: open ? "var(--surface-elevated)" : "var(--accent)",
          border: open ? "1px solid var(--surface-border)" : "none",
          boxShadow: open
            ? "var(--shadow-raised)"
            : `0 4px 20px var(--accent-glow), 0 2px 8px rgba(0,0,0,0.30)`,
          transform: open ? "rotate(45deg) scale(0.95)" : "rotate(0deg) scale(1)",
          animation: !open ? "fabBounce 3s ease-in-out infinite" : "none",
        }}
        aria-label={open ? "Close menu" : "Quick actions"}
      >
        <style>{`
          @keyframes fabBounce {
            0%,100% { transform: translateY(0) scale(1); }
            25%      { transform: translateY(-6px) scale(1.04); }
            50%      { transform: translateY(-3px) scale(1.02); }
            75%      { transform: translateY(-8px) scale(1.05); }
          }
        `}</style>
        {open
          ? <X size={20} style={{ color: "var(--text-primary)" }} />
          : <Plus size={22} strokeWidth={2.5} />
        }
      </button>
    </>
  );
}
