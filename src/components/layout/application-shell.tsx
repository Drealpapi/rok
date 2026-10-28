"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/nav/sidebar";
import { MobileHeader, MobileBottomNav } from "@/components/nav/mobile-nav";
import { FloatingActionButton } from "@/components/shared/floating-action-button";
import { cn } from "@/lib/utils";

interface ApplicationShellProps {
  children: ReactNode;
  rightSidebar?: ReactNode;
  className?: string;
}

export function ApplicationShell({ children, rightSidebar, className }: ApplicationShellProps) {
  const pathname = usePathname();

  return (
    <div className="app-bg min-h-screen">
      <MobileHeader />
      <div className="flex min-h-screen">
        <div className="hidden lg:flex lg:flex-shrink-0 sticky top-0 h-screen">
          <Sidebar />
        </div>

        {/*
          key={pathname} forces React to remount this element on every route
          change, which restarts the CSS animation — so every page navigation
          gets the cinematic fade-up entrance.
        */}
        <main
          key={pathname}
          className={cn("flex-1 min-w-0 pb-20 lg:pb-0 anim-fade-up", className)}
          style={{
            animationDuration: "0.75s",
            animationDelay:    "0.05s",
            scrollPaddingTop:  "52px",
            /* Critical: prevent any child from blowing out horizontal scroll */
            overflowX:         "hidden",
            width:             "100%",
            minWidth:          0,
          }}
        >
          {children}
        </main>

        {rightSidebar && (
          <aside
            className="hidden xl:flex xl:flex-shrink-0 xl:w-60 2xl:w-64 flex-col sticky top-0 h-screen overflow-y-auto"
            style={{ borderLeft: "1px solid var(--sidebar-border)", background: "var(--sidebar-bg)" }}
          >
            <div className="p-4 space-y-4">{rightSidebar}</div>
          </aside>
        )}
      </div>
      <MobileBottomNav />
      <FloatingActionButton />
    </div>
  );
}
