import { cn } from "@/lib/utils";
import Link from "next/link";

interface LogoProps { collapsed?: boolean; className?: string; }

export function OrbyteLogo({ collapsed = false, className }: LogoProps) {
  return (
    <Link href="/" className={cn("flex items-center gap-2 group select-none", className)} aria-label="ORBYTE">
      <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden>
        <circle cx="13" cy="13" r="12" fill="var(--accent)" />
        <circle cx="13" cy="13" r="5" fill="white" opacity="0.95" />
        <circle cx="13" cy="3"  r="2.5" fill="white" opacity="0.6" />
        <circle cx="23" cy="13" r="2"   fill="white" opacity="0.4" />
      </svg>
      {!collapsed && (
        <span className="text-[15px] font-bold tracking-tight text-[--text-primary] group-hover:text-[--accent] transition-colors">
          ORBYTE
        </span>
      )}
    </Link>
  );
}
