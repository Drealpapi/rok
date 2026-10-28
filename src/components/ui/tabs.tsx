"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface TabsContextValue { value: string; onValueChange: (v: string) => void; }
const TabsContext = React.createContext<TabsContextValue>({ value: "", onValueChange: () => {} });

function Tabs({ value, onValueChange, className, children }: {
  value: string; onValueChange: (v: string) => void;
  className?: string; children: React.ReactNode;
}) {
  return (
    <TabsContext.Provider value={{ value, onValueChange }}>
      <div className={cn("flex flex-col", className)}>{children}</div>
    </TabsContext.Provider>
  );
}

function TabsList({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div role="tablist"
      className={cn("inline-flex items-center gap-0.5 rounded-lg p-0.5 bg-[--surface-subtle] border border-[--surface-border]", className)}>
      {children}
    </div>
  );
}

function TabsTrigger({ value, className, children }: { value: string; className?: string; children: React.ReactNode }) {
  const ctx = React.useContext(TabsContext);
  const isActive = ctx.value === value;
  return (
    <button
      role="tab"
      aria-selected={isActive}
      onClick={() => ctx.onValueChange(value)}
      className={cn(
        "rounded-md px-3.5 py-1.5 text-sm transition-all duration-150",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--accent]/40",
        isActive
          ? "bg-[--surface-main] text-[--text-primary] font-semibold shadow-sm"
          : "text-[--text-muted] hover:text-[--text-secondary]",
        className
      )}
    >
      {children}
    </button>
  );
}

function TabsContent({ value, className, children }: { value: string; className?: string; children: React.ReactNode }) {
  const ctx = React.useContext(TabsContext);
  if (ctx.value !== value) return null;
  return <div className={cn("mt-3", className)}>{children}</div>;
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
