import * as React from "react";
import { cn, hashString } from "@/lib/utils";

const PALETTE = [
  "#3B82F6", "#8B5CF6", "#EC4899", "#10B981",
  "#F59E0B", "#EF4444", "#06B6D4", "#84CC16",
];

interface TokenIconProps {
  ticker: string;
  name?: string;
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = {
  xs: "w-6 h-6 text-[9px]",
  sm: "w-8 h-8 text-[10px]",
  md: "w-10 h-10 text-xs",
  lg: "w-14 h-14 text-sm",
};

function getTokenColors(ticker: string) {
  const h = hashString(ticker);
  const primary = PALETTE[h % PALETTE.length];
  const secondary = PALETTE[(h + 3) % PALETTE.length];
  return { primary, secondary };
}

export function TokenIcon({ ticker, name, size = "md", className }: TokenIconProps) {
  const { primary, secondary } = getTokenColors(ticker);
  const initials = ticker.slice(0, 3).toUpperCase();
  const id = `grad-${ticker}`;

  return (
    <div
      className={cn(
        "flex-shrink-0 rounded-full flex items-center justify-center overflow-hidden",
        sizeMap[size],
        className
      )}
      title={name ?? ticker}
      aria-label={`Token icon for ${name ?? ticker}`}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
            <stop stopColor={primary} />
            <stop offset="1" stopColor={secondary} />
          </linearGradient>
        </defs>
        <circle cx="20" cy="20" r="20" fill={`url(#${id})`} />
        <text
          x="20"
          y="24"
          textAnchor="middle"
          fill="white"
          fontSize="11"
          fontWeight="700"
          fontFamily="system-ui, sans-serif"
          letterSpacing="-0.5"
        >
          {initials}
        </text>
      </svg>
    </div>
  );
}
