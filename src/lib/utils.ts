import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format a wallet address to a short display form: 0x1234…abcd */
export function shortAddress(address: string, chars = 4): string {
  if (!address) return "";
  return `${address.slice(0, chars + 2)}…${address.slice(-chars)}`;
}

/** Format a large number with K / M / B suffixes */
export function formatNumber(n: number, decimals = 2): string {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(decimals)}B`;
  if (n >= 1_000_000)     return `${(n / 1_000_000).toFixed(decimals)}M`;
  if (n >= 1_000)         return `${(n / 1_000).toFixed(decimals)}K`;
  return n.toFixed(decimals);
}

/** Format ETH value with up to 4 significant decimal places */
export function formatEth(val: number): string {
  if (val === 0) return "0 ETH";
  if (val >= 1)  return `${val.toFixed(3)} ETH`;
  return `${val.toFixed(4)} ETH`;
}

/**
 * Format a relative timestamp — CLIENT-SIDE ONLY.
 * Do NOT call this in Server Components; use the <TimeAgo> component instead
 * or formatDateStatic() for server-safe output.
 */
export function timeAgo(date: Date | string): string {
  const d       = typeof date === "string" ? new Date(date) : date;
  const seconds = Math.floor((Date.now() - d.getTime()) / 1000);
  if (seconds < 10) return "just now";
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

/**
 * Server-safe date formatter — returns a stable locale string.
 * Safe to call in Server Components and during static prerender.
 * Does NOT use Date.now().
 */
export function formatDateStatic(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", {
    year:  "numeric",
    month: "short",
    day:   "numeric",
  });
}

/** Deterministic hash from a string — for avatar colors / seeds */
export function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash);
}

/** Pick a consistent color from a palette based on a string seed */
export function seedColor(seed: string, palette: string[]): string {
  return palette[hashString(seed) % palette.length];
}

/** Clamp a value between min and max */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
