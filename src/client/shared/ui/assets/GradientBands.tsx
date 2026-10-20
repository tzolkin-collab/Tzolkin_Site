import { useId } from "react";
import { cn } from "@/lib/utils";

export type GradientBandsVariant = "hero" | "heroDark" | "band" | "subtle";

export interface GradientBandsProps {
  /** hero: 7 faixas densas; band: 5 faixas para seções; subtle: 5 faixas translúcidas. */
  variant?: GradientBandsVariant;
  /** Aplica ruído estático (feTurbulence rasterizado uma vez, sem animação). */
  noise?: boolean;
  /** Movimento lento (transform apenas, 48s, alternate). Desligado com prefers-reduced-motion. */
  drift?: boolean;
  className?: string;
}

type Stop = readonly [offset: number, color: string, opacity: number];

interface Band {
  /** Deslocamento vertical da faixa. */
  d: number;
  /** Espessura vertical. */
  t: number;
  /** Corte (chanfro) do canto inferior esquerdo / direito. */
  cl: number;
  cr: number;
  stops: readonly Stop[];
}

// Paleta decorativa (só dentro do asset): rosé, âmbar suave, brand, vinho, quase preto.
const ROSE = "#ffb3bb";
const ROSE_DEEP = "#ff7f8e";
const AMBER = "#ffc58a";
const BRAND = "#c90000";
const WINE = "#6a0516";
const INK = "#1b0509";

const W = 1440;
const H = 900;
// Inclinação das faixas: sobem da esquerda para a direita.
const X0 = -140;
const X1 = W + 140;
const Y_LEFT = 560;
const Y_RIGHT = -140;

function polygon(b: Band): string {
  const topL: [number, number] = [X0, Y_LEFT + b.d];
  const topR: [number, number] = [X1, Y_RIGHT + b.d];
  const botR: [number, number] = [X1 - b.cr, Y_RIGHT + b.d + b.t];
  const botL: [number, number] = [X0 + b.cl, Y_LEFT + b.d + b.t];
  return [topL, topR, botR, botL].map((p) => p.join(",")).join(" ");
}

const HERO: readonly Band[] = [
  { d: -40, t: 190, cl: 60, cr: 260, stops: [[0, ROSE, 0.0], [0.45, ROSE, 0.55], [1, AMBER, 0.75]] },
  { d: 40, t: 200, cl: 240, cr: 90, stops: [[0, ROSE_DEEP, 0.15], [0.5, ROSE_DEEP, 0.7], [1, BRAND, 0.85]] },
  { d: 140, t: 210, cl: 80, cr: 300, stops: [[0, BRAND, 0.35], [0.55, BRAND, 0.9], [1, WINE, 0.95]] },
  { d: 250, t: 220, cl: 300, cr: 120, stops: [[0, WINE, 0.2], [0.5, BRAND, 0.8], [1, ROSE_DEEP, 0.85]] },
  { d: 360, t: 230, cl: 120, cr: 340, stops: [[0, INK, 0.0], [0.4, WINE, 0.85], [1, BRAND, 0.8]] },
  { d: 480, t: 240, cl: 360, cr: 140, stops: [[0, INK, 0.3], [0.5, INK, 0.92], [1, WINE, 0.9]] },
  { d: 610, t: 260, cl: 160, cr: 380, stops: [[0, INK, 0.0], [0.5, INK, 0.7], [1, BRAND, 0.55]] },
];

// Versão para fundos escuros: sem faixas "ink" (viram lama sobre o preto), cores mais saturadas.
const HOT = "#ff4457";
const CRIMSON = "#e0112b";
const WINE_LIT = "#8f1030";

const HERO_DARK: readonly Band[] = [
  { d: -40, t: 190, cl: 60, cr: 260, stops: [[0, ROSE, 0.0], [0.45, ROSE_DEEP, 0.55], [1, AMBER, 0.8]] },
  { d: 40, t: 200, cl: 240, cr: 90, stops: [[0, HOT, 0.1], [0.5, HOT, 0.7], [1, CRIMSON, 0.9]] },
  { d: 140, t: 210, cl: 80, cr: 300, stops: [[0, CRIMSON, 0.2], [0.55, CRIMSON, 0.85], [1, WINE_LIT, 0.9]] },
  { d: 250, t: 220, cl: 300, cr: 120, stops: [[0, WINE_LIT, 0.1], [0.5, CRIMSON, 0.7], [1, HOT, 0.85]] },
  { d: 360, t: 230, cl: 120, cr: 340, stops: [[0, WINE_LIT, 0.0], [0.4, WINE_LIT, 0.7], [1, CRIMSON, 0.8]] },
  { d: 480, t: 240, cl: 360, cr: 140, stops: [[0, WINE, 0.0], [0.5, WINE, 0.6], [1, WINE_LIT, 0.7]] },
];

const BAND: readonly Band[] = [
  { d: 60, t: 230, cl: 80, cr: 280, stops: [[0, ROSE, 0.0], [0.5, ROSE_DEEP, 0.65], [1, AMBER, 0.7]] },
  { d: 180, t: 240, cl: 280, cr: 100, stops: [[0, BRAND, 0.3], [0.55, BRAND, 0.85], [1, ROSE_DEEP, 0.8]] },
  { d: 310, t: 250, cl: 100, cr: 320, stops: [[0, WINE, 0.2], [0.5, WINE, 0.9], [1, BRAND, 0.85]] },
  { d: 450, t: 260, cl: 320, cr: 120, stops: [[0, INK, 0.1], [0.5, INK, 0.9], [1, WINE, 0.85]] },
  { d: 600, t: 280, cl: 140, cr: 340, stops: [[0, INK, 0.0], [0.6, INK, 0.7], [1, BRAND, 0.6]] },
];

const SUBTLE: readonly Band[] = BAND.map((b) => ({
  ...b,
  stops: b.stops.map(([o, c, a]) => [o, c, +(a * 0.38).toFixed(3)] as const),
}));

const SETS: Record<GradientBandsVariant, readonly Band[]> = {
  hero: HERO,
  heroDark: HERO_DARK,
  band: BAND,
  subtle: SUBTLE,
};

const KEYFRAMES = `@keyframes tz-bands-drift{from{transform:translate3d(-1.5%,0,0)}to{transform:translate3d(1.5%,-1.2%,0)}}
.tz-bands-drift{animation:tz-bands-drift 48s ease-in-out infinite alternate}
@media (prefers-reduced-motion:reduce){.tz-bands-drift{animation:none}}`;

export function GradientBands({
  variant = "hero",
  noise = true,
  drift = false,
  className,
}: GradientBandsProps) {
  const uid = useId().replace(/:/g, "");
  const bands = SETS[variant];
  const hasNoise = noise && variant !== "subtle" && variant !== "heroDark";

  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      {drift ? <style>{KEYFRAMES}</style> : null}
      <div className={cn("absolute -inset-[4%]", drift && "tz-bands-drift")}>
        <svg
          className="h-full w-full"
          viewBox={`0 0 ${W} ${H}`}
          preserveAspectRatio="xMidYMid slice"
          focusable="false"
        >
          <defs>
            {bands.map((b, i) => (
              <linearGradient key={i} id={`${uid}-g${i}`} x1="0" y1="0" x2="1" y2="0.18">
                {b.stops.map(([o, c, a], j) => (
                  <stop key={j} offset={o} stopColor={c} stopOpacity={a} />
                ))}
              </linearGradient>
            ))}
            {hasNoise ? (
              <filter id={`${uid}-n`} x="0" y="0" width="100%" height="100%">
                <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7" stitchTiles="stitch" />
                <feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.55 0" />
              </filter>
            ) : null}
          </defs>
          {bands.map((b, i) => (
            <polygon
              key={i}
              points={polygon(b)}
              fill={`url(#${uid}-g${i})`}
              stroke="#ffffff"
              strokeOpacity={variant === "subtle" ? 0.06 : 0.22}
              strokeWidth={1}
              vectorEffect="non-scaling-stroke"
            />
          ))}
          {hasNoise ? (
            <rect width={W} height={H} filter={`url(#${uid}-n)`} opacity={0.07} />
          ) : null}
        </svg>
      </div>
    </div>
  );
}
