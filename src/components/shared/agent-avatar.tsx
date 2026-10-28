import * as React from "react";
import { cn, hashString } from "@/lib/utils";

/** Deterministic SVG robot avatar generated from an agent's seed string */

interface AgentAvatarProps {
  seed: string;
  color?: string;
  name?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  status?: "active" | "sleeping" | "paused" | "error" | "draft" | "none";
  className?: string;
  imageUrl?: string;
}

const sizeMap = {
  xs: { outer: "w-6 h-6", dot: "w-2 h-2 border", svg: 24, text: "text-[9px]" },
  sm: { outer: "w-8 h-8", dot: "w-2.5 h-2.5 border", svg: 32, text: "text-xs" },
  md: { outer: "w-10 h-10", dot: "w-3 h-3 border-2", svg: 40, text: "text-sm" },
  lg: { outer: "w-14 h-14", dot: "w-3.5 h-3.5 border-2", svg: 56, text: "text-base" },
  xl: { outer: "w-20 h-20", dot: "w-4 h-4 border-2", svg: 80, text: "text-xl" },
};

const statusDotColor: Record<string, string> = {
  active: "bg-emerald-400",
  sleeping: "bg-slate-400",
  paused: "bg-amber-400",
  error: "bg-red-400",
  draft: "bg-slate-300",
  none: "",
};

/** Generate a deterministic geometric robot face as an SVG */
function generateRobotSvg(seed: string, color: string, size: number): React.ReactNode {
  const h = hashString(seed);
  const bodyColor = color;
  const eyeStyle = h % 3; // 0=circle, 1=square, 2=diamond
  const antennaStyle = h % 4; // 0=ball, 1=flat, 2=fork, 3=none
  const mouthStyle = h % 3; // 0=line, 1=smile, 2=zigzag
  const hasEars = (h % 2) === 0;

  const s = size;
  const cx = s / 2;
  const cy = s / 2 + s * 0.04;
  const bodyW = s * 0.54;
  const bodyH = s * 0.48;
  const bodyX = cx - bodyW / 2;
  const bodyY = cy - bodyH / 2;
  const eyeY = bodyY + bodyH * 0.3;
  const leftEyeX = bodyX + bodyW * 0.28;
  const rightEyeX = bodyX + bodyW * 0.72;
  const eyeSize = s * 0.1;
  const mouthY = bodyY + bodyH * 0.62;
  const mouthW = bodyW * 0.5;

  return (
    <svg
      width={s}
      height={s}
      viewBox={`0 0 ${s} ${s}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Background */}
      <rect width={s} height={s} rx={s * 0.22} fill={bodyColor} opacity={0.15} />

      {/* Antenna */}
      {antennaStyle < 3 && (
        <>
          <line
            x1={cx}
            y1={bodyY}
            x2={cx}
            y2={bodyY - s * 0.1}
            stroke={bodyColor}
            strokeWidth={s * 0.04}
            strokeLinecap="round"
          />
          {antennaStyle === 0 && (
            <circle cx={cx} cy={bodyY - s * 0.13} r={s * 0.05} fill={bodyColor} />
          )}
          {antennaStyle === 1 && (
            <rect
              x={cx - s * 0.06}
              y={bodyY - s * 0.17}
              width={s * 0.12}
              height={s * 0.05}
              rx={2}
              fill={bodyColor}
            />
          )}
          {antennaStyle === 2 && (
            <>
              <line
                x1={cx - s * 0.06}
                y1={bodyY - s * 0.1}
                x2={cx - s * 0.1}
                y2={bodyY - s * 0.17}
                stroke={bodyColor}
                strokeWidth={s * 0.04}
                strokeLinecap="round"
              />
              <line
                x1={cx + s * 0.06}
                y1={bodyY - s * 0.1}
                x2={cx + s * 0.1}
                y2={bodyY - s * 0.17}
                stroke={bodyColor}
                strokeWidth={s * 0.04}
                strokeLinecap="round"
              />
            </>
          )}
        </>
      )}

      {/* Body */}
      <rect
        x={bodyX}
        y={bodyY}
        width={bodyW}
        height={bodyH}
        rx={s * 0.1}
        fill={bodyColor}
        opacity={0.2}
        stroke={bodyColor}
        strokeWidth={s * 0.025}
        strokeOpacity={0.6}
      />

      {/* Ear bolts */}
      {hasEars && (
        <>
          <rect
            x={bodyX - s * 0.07}
            y={cy - s * 0.06}
            width={s * 0.07}
            height={s * 0.12}
            rx={s * 0.03}
            fill={bodyColor}
            opacity={0.45}
          />
          <rect
            x={bodyX + bodyW}
            y={cy - s * 0.06}
            width={s * 0.07}
            height={s * 0.12}
            rx={s * 0.03}
            fill={bodyColor}
            opacity={0.45}
          />
        </>
      )}

      {/* Eyes */}
      {eyeStyle === 0 && (
        <>
          <circle cx={leftEyeX} cy={eyeY} r={eyeSize} fill={bodyColor} opacity={0.9} />
          <circle cx={rightEyeX} cy={eyeY} r={eyeSize} fill={bodyColor} opacity={0.9} />
          <circle cx={leftEyeX} cy={eyeY} r={eyeSize * 0.4} fill="white" opacity={0.8} />
          <circle cx={rightEyeX} cy={eyeY} r={eyeSize * 0.4} fill="white" opacity={0.8} />
        </>
      )}
      {eyeStyle === 1 && (
        <>
          <rect
            x={leftEyeX - eyeSize}
            y={eyeY - eyeSize}
            width={eyeSize * 2}
            height={eyeSize * 2}
            rx={eyeSize * 0.3}
            fill={bodyColor}
            opacity={0.9}
          />
          <rect
            x={rightEyeX - eyeSize}
            y={eyeY - eyeSize}
            width={eyeSize * 2}
            height={eyeSize * 2}
            rx={eyeSize * 0.3}
            fill={bodyColor}
            opacity={0.9}
          />
        </>
      )}
      {eyeStyle === 2 && (
        <>
          <path
            d={`M${leftEyeX},${eyeY - eyeSize} L${leftEyeX + eyeSize},${eyeY} L${leftEyeX},${eyeY + eyeSize} L${leftEyeX - eyeSize},${eyeY} Z`}
            fill={bodyColor}
            opacity={0.9}
          />
          <path
            d={`M${rightEyeX},${eyeY - eyeSize} L${rightEyeX + eyeSize},${eyeY} L${rightEyeX},${eyeY + eyeSize} L${rightEyeX - eyeSize},${eyeY} Z`}
            fill={bodyColor}
            opacity={0.9}
          />
        </>
      )}

      {/* Mouth */}
      {mouthStyle === 0 && (
        <line
          x1={cx - mouthW / 2}
          y1={mouthY}
          x2={cx + mouthW / 2}
          y2={mouthY}
          stroke={bodyColor}
          strokeWidth={s * 0.04}
          strokeLinecap="round"
          opacity={0.8}
        />
      )}
      {mouthStyle === 1 && (
        <path
          d={`M${cx - mouthW / 2},${mouthY - s * 0.01} Q${cx},${mouthY + s * 0.06} ${cx + mouthW / 2},${mouthY - s * 0.01}`}
          stroke={bodyColor}
          strokeWidth={s * 0.04}
          strokeLinecap="round"
          fill="none"
          opacity={0.8}
        />
      )}
      {mouthStyle === 2 && (
        <path
          d={`M${cx - mouthW / 2},${mouthY} L${cx - mouthW / 4},${mouthY - s * 0.04} L${cx},${mouthY + s * 0.04} L${cx + mouthW / 4},${mouthY - s * 0.04} L${cx + mouthW / 2},${mouthY}`}
          stroke={bodyColor}
          strokeWidth={s * 0.04}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          opacity={0.8}
        />
      )}
    </svg>
  );
}

export function AgentAvatar({
  seed,
  color = "#7C3AED",
  name,
  size = "md",
  status = "none",
  className,
  imageUrl,
}: AgentAvatarProps) {
  const { outer, dot, svg, text } = sizeMap[size];
  const dotColor = status !== "none" ? statusDotColor[status] : "";

  return (
    <div className={cn("relative inline-flex flex-shrink-0", outer, className)}>
      {imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageUrl}
          alt={name ?? seed}
          className="w-full h-full rounded-2xl object-cover"
        />
      ) : (
        <div
          className="w-full h-full rounded-2xl overflow-hidden"
          title={name ?? seed}
          aria-label={`Agent avatar for ${name ?? seed}`}
        >
          {generateRobotSvg(seed, color, svg)}
        </div>
      )}
      {dotColor && (
        <span
          className={cn(
            "absolute bottom-0 right-0 rounded-full border-white",
            dot,
            dotColor
          )}
          aria-hidden="true"
        />
      )}
    </div>
  );
}
