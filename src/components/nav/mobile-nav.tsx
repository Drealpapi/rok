"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Newspaper, Coins, Bot, Activity, Plus,
  Bell, UserRound, Trophy, Search,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { OrbyteLogo } from "@/components/brand/logo";

const BOTTOM_TABS = [
  { href: "/feed",      label: "Feed",    icon: Newspaper },
  { href: "/coins",     label: "Coins",   icon: Coins     },
  { href: "/create",    label: "",        icon: Plus,  primary: true },
  { href: "/agents",    label: "Agents",  icon: Bot       },
  { href: "/activity",  label: "Activity",icon: Activity  },
];

export function MobileHeader() {
  const pathname = usePathname();

  // Derive page title from pathname
  const title = pathname.startsWith("/feed")       ? "Feed"
    : pathname.startsWith("/coins/0x")             ? "Token"
    : pathname.startsWith("/coins")                ? "Coins"
    : pathname.startsWith("/agents/agent")         ? "Agent"
    : pathname.startsWith("/agents")               ? "Agents"
    : pathname.startsWith("/activity")             ? "Activity"
    : pathname.startsWith("/alerts")               ? "Alerts"
    : pathname.startsWith("/leaderboard")          ? "Leaderboard"
    : pathname.startsWith("/my-agents")            ? "My Agents"
    : pathname.startsWith("/portfolio")            ? "Portfolio"
    : pathname.startsWith("/create")               ? "Create Agent"
    : pathname.startsWith("/settings")             ? "Settings"
    : null; // null = show logo on landing + unknown pages

  return (
    <header
      className="flex lg:hidden items-center justify-between px-4 sticky top-0 z-40"
      style={{
        height: 52,
        background: "var(--sidebar-bg)",
        borderBottom: "1px solid var(--sidebar-border)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
      }}
    >
      {/* Logo or page title */}
      {title ? (
        <span
          style={{
            fontSize: 16, fontWeight: 700,
            color: "var(--text-primary)",
            fontFamily: "var(--font-syne)",
          }}
        >
          {title}
        </span>
      ) : (
        <OrbyteLogo />
      )}

      {/* Right side actions */}
      <div className="flex items-center gap-2">
        {/* Search shortcut */}
        <Link
          href="/agents"
          className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors hover:bg-[--surface-hover]"
          style={{ color: "var(--text-muted)" }}
          aria-label="Search"
        >
          <Search size={16} />
        </Link>

        {/* Alerts */}
        <Link
          href="/alerts"
          className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors hover:bg-[--surface-hover] relative"
          style={{ color: "var(--text-muted)" }}
          aria-label="Alerts"
        >
          <Bell size={16} />
          {/* Unread dot */}
          <span
            className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full"
            style={{ background: "var(--accent)" }}
          />
        </Link>

        {/* Avatar / profile */}
        <Link
          href="/my-agents"
          className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors hover:bg-[--surface-hover]"
          style={{ color: "var(--text-muted)" }}
          aria-label="My agents"
        >
          <UserRound size={16} />
        </Link>
      </div>
    </header>
  );
}

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="flex lg:hidden fixed bottom-0 left-0 right-0 z-40"
      style={{
        background: "var(--sidebar-bg)",
        borderTop: "1px solid var(--sidebar-border)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}
    >
      <div className="flex w-full h-14 items-stretch">
        {BOTTOM_TABS.map((item) => {
          const Icon = item.icon;
          const active = item.href === "/feed"
            ? pathname === "/" || pathname.startsWith("/feed")
            : pathname.startsWith(item.href);

          if (item.primary) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex-1 flex items-center justify-center"
                aria-label="Create agent"
              >
                <div
                  style={{
                    width: 46,
                    height: 46,
                    borderRadius: 14,
                    background: "var(--accent)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 4px 16px rgba(255,118,40,0.45)",
                    transform: "translateY(-8px)",
                    border: "2px solid rgba(255,255,255,0.12)",
                  }}
                >
                  <Icon size={22} className="text-white" strokeWidth={2.5} />
                </div>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex-1 flex flex-col items-center justify-center gap-0.5 transition-colors"
              style={{ color: active ? "var(--accent)" : "var(--text-muted)" }}
              aria-current={active ? "page" : undefined}
            >
              {/* Active indicator dot above icon */}
              <span
                style={{
                  width: 4, height: 4, borderRadius: "50%",
                  background: active ? "var(--accent)" : "transparent",
                  marginBottom: 2,
                  transition: "background 0.2s",
                }}
              />
              <Icon size={19} strokeWidth={active ? 2.2 : 1.7} />
              <span style={{ fontSize: 10, fontWeight: active ? 600 : 400, marginTop: 1 }}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
