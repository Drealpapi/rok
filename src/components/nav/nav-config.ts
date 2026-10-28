import type { LucideIcon } from "lucide-react";
import {
  Newspaper,
  Coins,
  Bot,
  Activity,
  Bell,
  UserRound,
  Star,
  Wallet,
  HelpCircle,
  Settings2,
  Plus,
  BarChart3,
  Rocket,
  Trophy,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  badge?: string | number;
  requiresWallet?: boolean;
}

export const MAIN_NAV: NavItem[] = [
  { href: "/feed", label: "Feed", icon: Newspaper },
  { href: "/coins", label: "Coins", icon: Coins },
  { href: "/agents", label: "Agents", icon: Bot },
  { href: "/activity", label: "Activity", icon: Activity },
  { href: "/alerts", label: "Alerts", icon: Bell },
];

export const ACCOUNT_NAV: NavItem[] = [
  { href: "/my-agents", label: "My Agents", icon: UserRound, requiresWallet: true },
  { href: "/favorites", label: "Favorites", icon: Star },
  { href: "/portfolio", label: "Portfolio", icon: Wallet, requiresWallet: true },
];

export const EXPLORE_NAV: NavItem[] = [
  { href: "/launches", label: "Launches", icon: Rocket },
  { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
  { href: "/transactions", label: "Transactions", icon: BarChart3 },
];

export const FOOTER_NAV: NavItem[] = [
  { href: "/how-it-works", label: "How it works", icon: HelpCircle },
  { href: "/settings", label: "Settings", icon: Settings2 },
];

export const CREATE_ACTION = {
  href: "/create",
  label: "Create Agent",
  icon: Plus,
};
