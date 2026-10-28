"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { NavItem } from "./nav-config";

interface NavItemProps {
  item: NavItem;
  collapsed?: boolean;
  onClick?: () => void;
}

export function SidebarNavItem({ item, collapsed = false, onClick }: NavItemProps) {
  const pathname = usePathname();
  const isActive =
    item.href === "/feed"
      ? pathname === "/" || pathname.startsWith("/feed")
      : pathname.startsWith(item.href);

  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/40",
        isActive
          ? "bg-[#F5F3FB] text-[#11111B]"
          : "text-[#85859E] hover:bg-[#F5F3FB]/60 hover:text-[#11111B]",
        collapsed && "justify-center px-2"
      )}
      aria-current={isActive ? "page" : undefined}
      title={collapsed ? item.label : undefined}
    >
      <Icon
        className={cn(
          "flex-shrink-0 transition-colors",
          collapsed ? "w-5 h-5" : "w-4 h-4",
          isActive ? "text-violet-600" : "text-current"
        )}
        strokeWidth={isActive ? 2.2 : 1.8}
        size={collapsed ? 20 : 18}
      />
      {!collapsed && (
        <span className="truncate">{item.label}</span>
      )}
      {!collapsed && item.badge !== undefined && (
        <span className="ml-auto min-w-[1.25rem] h-5 flex items-center justify-center rounded-full bg-violet-100 text-violet-700 text-[10px] font-semibold px-1">
          {item.badge}
        </span>
      )}
    </Link>
  );
}
