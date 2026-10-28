"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Newspaper, Coins, Bot, Activity, Bell,
  UserRound, HelpCircle, Plus, Sun, Moon, Trophy,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { OrbyteLogo } from "@/components/brand/logo";
import { useTheme } from "@/lib/theme";

const NAV = [
  { href: "/feed",         label: "Feed",        icon: Newspaper  },
  { href: "/coins",        label: "Coins",       icon: Coins      },
  { href: "/agents",       label: "Agents",      icon: Bot        },
  { href: "/leaderboard",  label: "Leaderboard", icon: Trophy     },
  { href: "/activity",     label: "Activity",    icon: Activity   },
  { href: "/alerts",       label: "Alerts",      icon: Bell       },
  { href: "/my-agents",    label: "My agents",   icon: UserRound  },
  { href: "/how-it-works", label: "How it works",icon: HelpCircle },
] as const;

type NavHref = typeof NAV[number]["href"];

function NavItem({ href, label, icon: Icon }: {
  href: NavHref; label: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
}) {
  const pathname = usePathname();
  const active = href === "/feed"
    ? pathname === "/" || pathname.startsWith("/feed")
    : pathname.startsWith(href);

  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "relative flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors select-none",
        active
          ? "nav-active font-medium"
          : "text-[--text-muted] hover:text-[--text-primary] hover:bg-[--surface-hover]"
      )}
    >
      {active && <span className="nav-active-bar" aria-hidden />}
      <Icon size={15} strokeWidth={active ? 2.2 : 1.8} className={active ? "text-[--accent]" : ""} />
      {label}
    </Link>
  );
}

export function Sidebar({ className }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <aside
      className={cn("flex flex-col h-full w-[185px] flex-shrink-0", className)}
      style={{ background: "var(--sidebar-bg)", borderRight: "1px solid var(--sidebar-border)" }}
    >
      {/* Logo */}
      <div className="px-4 pt-5 pb-4" style={{ borderBottom: "1px solid var(--sidebar-border)" }}>
        <OrbyteLogo />
      </div>

      {/* Wallet panel */}
      <div className="px-3 pt-3 pb-2">
        <div className="rounded-lg p-3" style={{ background: "var(--surface-subtle)", border: "1px solid var(--surface-border)" }}>
          <p className="text-xs text-[--text-muted] mb-2 leading-snug">
            Connect a wallet to create agents and manage your portfolio.
          </p>
          <button
            disabled
            className="w-full rounded-md py-1.5 text-xs font-semibold text-white transition-opacity hover:opacity-90"
            style={{ background: "var(--accent)" }}
          >
            Connect wallet
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 pt-1 space-y-0.5 overflow-y-auto">
        {NAV.map((item) => <NavItem key={item.href} {...item} />)}
      </nav>

      {/* Create CTA */}
      <div className="px-3 py-3">
        <Link
          href="/create"
          className="flex items-center justify-center gap-2 w-full rounded-lg py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          style={{ background: "var(--accent)" }}
        >
          <Plus size={14} strokeWidth={2.5} />
          Create agent
        </Link>
      </div>

      {/* Stats */}
      <div className="mx-3 mb-2 rounded-lg px-3 py-2.5 grid grid-cols-2 gap-x-2"
        style={{ background: "var(--surface-subtle)", border: "1px solid var(--surface-border)" }}>
        <div>
          <p className="text-sm font-bold text-[--text-primary] tabular-nums">128</p>
          <p className="text-[10px] text-[--text-muted]">Agents</p>
        </div>
        <div>
          <p className="text-sm font-bold text-[--text-primary] tabular-nums">300</p>
          <p className="text-[10px] text-[--text-muted]">Coins</p>
        </div>
      </div>

      {/* Theme toggle */}
      <button onClick={toggleTheme}
        className="flex items-center gap-2 mx-3 mb-4 px-3 py-2 rounded-lg text-xs text-[--text-muted] hover:text-[--text-primary] hover:bg-[--surface-hover] transition-colors">
        {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
        {theme === "dark" ? "Light mode" : "Dark mode"}
      </button>
    </aside>
  );
}
