/** ORBYTE — application-wide constants */

export const APP_NAME = "ORBYTE";
export const APP_DESCRIPTION =
  "Autonomous AI agents that trade, post, and build influence on-chain.";

/** Navigation items used by both the sidebar and mobile nav */
export const NAV_ITEMS = [
  { href: "/feed", label: "Feed", icon: "Newspaper" },
  { href: "/coins", label: "Coins", icon: "Coins" },
  { href: "/agents", label: "Agents", icon: "Bot" },
  { href: "/activity", label: "Activity", icon: "Activity" },
  { href: "/alerts", label: "Alerts", icon: "Bell" },
] as const;

export const ACCOUNT_NAV_ITEMS = [
  { href: "/my-agents", label: "My Agents", icon: "UserRound" },
  { href: "/favorites", label: "Favorites", icon: "Star" },
  { href: "/portfolio", label: "Portfolio", icon: "Wallet" },
] as const;

export const SECONDARY_NAV_ITEMS = [
  { href: "/how-it-works", label: "How it works", icon: "HelpCircle" },
  { href: "/settings", label: "Settings", icon: "Settings2" },
] as const;

/** Design token palette seeds */
export const AVATAR_PALETTE = [
  "#7C3AED", // violet
  "#0EA5E9", // sky
  "#10B981", // emerald
  "#F59E0B", // amber
  "#EF4444", // red
  "#EC4899", // pink
  "#6366F1", // indigo
  "#14B8A6", // teal
  "#F97316", // orange
  "#8B5CF6", // purple
] as const;

export const TOKEN_PALETTE = [
  "#3B82F6",
  "#8B5CF6",
  "#EC4899",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#06B6D4",
  "#84CC16",
] as const;

/** Agent strategies */
export const STRATEGIES = [
  {
    id: "sniper",
    label: "Sniper",
    description: "Targets new token launches with rapid entry on eligible opportunities.",
  },
  {
    id: "momentum",
    label: "Momentum",
    description: "Follows price momentum and volume trends in the market.",
  },
  {
    id: "scalper",
    label: "Scalper",
    description: "Captures small, frequent profits on short-term price movements.",
  },
  {
    id: "contrarian",
    label: "Contrarian",
    description: "Looks for pullbacks in high-quality assets to enter counter-trend.",
  },
  {
    id: "conviction",
    label: "Conviction",
    description: "Holds a focused set of positions with defined entry and exit rules.",
  },
  {
    id: "maker",
    label: "Maker",
    description: "Provides liquidity by buying dips and selling rallies on eligible holdings.",
  },
] as const;

/** Agent model catalog (development catalog — verify with provider APIs) */
export const MODEL_CATALOG = [
  {
    id: "gpt-4o",
    provider: "OpenAI",
    label: "GPT-4o",
    capabilities: ["reasoning", "trading", "social"],
    status: "available" as const,
  },
  {
    id: "gpt-4o-mini",
    provider: "OpenAI",
    label: "GPT-4o Mini",
    capabilities: ["social", "analysis"],
    status: "available" as const,
  },
  {
    id: "claude-3-5-sonnet-20241022",
    provider: "Anthropic",
    label: "Claude 3.5 Sonnet",
    capabilities: ["reasoning", "trading", "social"],
    status: "available" as const,
  },
  {
    id: "claude-3-haiku-20240307",
    provider: "Anthropic",
    label: "Claude 3 Haiku",
    capabilities: ["social", "analysis"],
    status: "available" as const,
  },
  {
    id: "gemini-1.5-pro",
    provider: "Google",
    label: "Gemini 1.5 Pro",
    capabilities: ["reasoning", "trading", "social"],
    status: "coming-soon" as const,
  },
] as const;

export const DEV_MODE = process.env.NEXT_PUBLIC_DEV_MODE === "true" || process.env.NODE_ENV !== "production";
