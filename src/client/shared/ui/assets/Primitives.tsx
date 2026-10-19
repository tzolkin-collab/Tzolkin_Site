import { useId } from "react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Avatar                                                             */
/* ------------------------------------------------------------------ */

// 6 paletas fixas (gradiente + cor do texto), escolhidas pelo hash do nome.
const AVATAR_PALETTE = [
  "from-[#ff9aa6] to-[#c90000] text-white",
  "from-[#ffc58a] to-[#d9582b] text-white",
  "from-[#7a1426] to-[#2a0710] text-[#ffd9de]",
  "from-[#e8e8ec] to-[#9a9aa6] text-[#18181b]",
  "from-[#3a3a42] to-[#0e0e11] text-white",
  "from-[#ffd3d8] to-[#f08a97] text-[#5a0614]",
] as const;

export interface AvatarProps {
  name: string;
  size?: "sm" | "md" | "lg";
  /** Força uma das 6 paletas (0 a 5). */
  paletteIndex?: number;
  className?: string;
}

const AVATAR_SIZE = { sm: "size-6 text-[10px]", md: "size-8 text-xs", lg: "size-11 text-sm" } as const;

function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  const first = parts[0][0] ?? "";
  const last = parts.length > 1 ? (parts[parts.length - 1][0] ?? "") : "";
  return (first + last).toUpperCase();
}

function hashOf(name: string): number {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return h;
}

export function Avatar({ name, size = "md", paletteIndex, className }: AvatarProps) {
  const idx = (paletteIndex ?? hashOf(name)) % AVATAR_PALETTE.length;
  return (
    <span
      role="img"
      aria-label={name}
      className={cn(
        "inline-flex shrink-0 select-none items-center justify-center rounded-full bg-gradient-to-br font-semibold tracking-tight ring-2 ring-background",
        AVATAR_SIZE[size],
        AVATAR_PALETTE[idx],
        className,
      )}
    >
      {initialsOf(name)}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Chip                                                               */
/* ------------------------------------------------------------------ */

export type ChipTone = "neutral" | "brand" | "success" | "warning";

const CHIP_TONE: Record<ChipTone, string> = {
  neutral: "bg-foreground/[0.06] text-foreground/75 ring-foreground/10",
  brand: "bg-[#c90000]/10 text-[#b00000] ring-[#c90000]/25 dark:bg-[#ff5a6e]/15 dark:text-[#ff9aa6] dark:ring-[#ff5a6e]/30",
  success: "bg-[#008300]/10 text-[#00700a] ring-[#008300]/25 dark:bg-[#2f9e2f]/15 dark:text-[#7bd88f] dark:ring-[#2f9e2f]/30",
  warning: "bg-[#d97706]/12 text-[#9a5200] ring-[#d97706]/30 dark:bg-[#ffc58a]/12 dark:text-[#ffc58a] dark:ring-[#ffc58a]/28",
};

export interface ChipProps {
  tone?: ChipTone;
  children: ReactNode;
  /** Ponto de status à esquerda. */
  dot?: boolean;
  mono?: boolean;
  className?: string;
}

export function Chip({ tone = "neutral", children, dot = false, mono = false, className }: ChipProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-0.5 text-[11px] font-medium leading-5 ring-1 ring-inset",
        mono && "font-mono tracking-tight",
        CHIP_TONE[tone],
        className,
      )}
    >
      {dot ? <StatusDot tone={tone === "neutral" ? "neutral" : tone} size="sm" /> : null}
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* StatusDot                                                          */
/* ------------------------------------------------------------------ */

export type StatusTone = "neutral" | "brand" | "success" | "warning";

const DOT_TONE: Record<StatusTone, string> = {
  neutral: "bg-foreground/40",
  brand: "bg-[#c90000] dark:bg-[#ff5a6e]",
  success: "bg-[#12a150] dark:bg-[#3fd07a]",
  warning: "bg-[#e08a00] dark:bg-[#ffc58a]",
};
const DOT_HALO: Record<StatusTone, string> = {
  neutral: "ring-foreground/10",
  brand: "ring-[#c90000]/20 dark:ring-[#ff5a6e]/25",
  success: "ring-[#12a150]/20 dark:ring-[#3fd07a]/25",
  warning: "ring-[#e08a00]/22 dark:ring-[#ffc58a]/25",
};

export interface StatusDotProps {
  tone?: StatusTone;
  size?: "sm" | "md";
  /** Rótulo acessível; sem ele o ponto é decorativo. */
  label?: string;
  className?: string;
}

export function StatusDot({ tone = "success", size = "md", label, className }: StatusDotProps) {
  return (
    <span
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={cn(
        "inline-block shrink-0 rounded-full ring-[3px]",
        size === "sm" ? "size-1.5 ring-2" : "size-2",
        DOT_TONE[tone],
        DOT_HALO[tone],
        className,
      )}
    />
  );
}

/* ------------------------------------------------------------------ */
/* ConnectorLine                                                      */
/* ------------------------------------------------------------------ */

export interface ConnectorLineProps {
  width: number;
  height: number;
  from: readonly [number, number];
  to: readonly [number, number];
  /** smooth: bezier em S; step: cotovelo com cantos arredondados; straight: reta. */
  curve?: "smooth" | "step" | "straight";
  dashed?: boolean;
  className?: string;
}

export function ConnectorLine({
  width,
  height,
  from,
  to,
  curve = "smooth",
  dashed = false,
  className,
}: ConnectorLineProps) {
  const uid = useId().replace(/:/g, "");
  const [x1, y1] = from;
  const [x2, y2] = to;
  const mx = (x1 + x2) / 2;
  let d: string;
  if (curve === "straight") {
    d = `M${x1},${y1} L${x2},${y2}`;
  } else if (curve === "step") {
    const r = Math.min(10, Math.abs(y2 - y1) / 2, Math.abs(x2 - x1) / 2);
    const sy = y2 >= y1 ? 1 : -1;
    d = `M${x1},${y1} H${mx - r} Q${mx},${y1} ${mx},${y1 + sy * r} V${y2 - sy * r} Q${mx},${y2} ${mx + r},${y2} H${x2}`;
  } else {
    d = `M${x1},${y1} C${mx},${y1} ${mx},${y2} ${x2},${y2}`;
  }

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={cn("block max-w-full", className)}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={`${uid}-g`} gradientUnits="userSpaceOnUse" x1={x1} y1={y1} x2={x2} y2={y2 === y1 ? y2 + 0.01 : y2}>
          <stop offset="0" stopColor="#ff8a96" stopOpacity="0.2" />
          <stop offset="0.5" stopColor="#c90000" />
          <stop offset="1" stopColor="#7a1426" stopOpacity="0.9" />
        </linearGradient>
      </defs>
      <path
        d={d}
        fill="none"
        stroke={`url(#${uid}-g)`}
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeDasharray={dashed ? "5 5" : undefined}
      />
      <circle cx={x1} cy={y1} r={5} className="fill-background" stroke="#ff8a96" strokeWidth={1.75} />
      <circle cx={x2} cy={y2} r={5} className="fill-background" stroke="#7a1426" strokeWidth={1.75} />
      <circle cx={x2} cy={y2} r={2} fill="#c90000" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* IllustrativeTag                                                    */
/* ------------------------------------------------------------------ */

export interface IllustrativeTagProps {
  children?: ReactNode;
  className?: string;
}

export function IllustrativeTag({ children = "Exemplo ilustrativo", className }: IllustrativeTagProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground/80",
        className,
      )}
    >
      <span aria-hidden="true" className="size-1 rounded-full bg-current opacity-60" />
      {children}
    </span>
  );
}
