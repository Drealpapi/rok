"use client";

import * as React from "react";

function computeTimeAgo(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const now = Date.now();
  const seconds = Math.floor((now - d.getTime()) / 1000);
  if (seconds < 10) return "just now";
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

interface TimeAgoProps {
  date: string | Date;
  className?: string;
  style?: React.CSSProperties;
}

export function TimeAgo({ date, className, style }: TimeAgoProps) {
  // Start with a static placeholder during SSR / prerender, hydrate on client
  const [label, setLabel] = React.useState<string>("");

  React.useEffect(() => {
    setLabel(computeTimeAgo(date));
    const interval = setInterval(() => {
      setLabel(computeTimeAgo(date));
    }, 60_000);
    return () => clearInterval(interval);
  }, [date]);

  return (
    <time
      dateTime={typeof date === "string" ? date : date.toISOString()}
      className={className}
      style={style}
      suppressHydrationWarning
    >
      {label || "—"}
    </time>
  );
}
