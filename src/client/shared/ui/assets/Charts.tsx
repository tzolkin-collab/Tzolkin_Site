import { useId } from "react";
import { cn } from "@/lib/utils";

type Pt = readonly [number, number];

/** Curva suave monotônica (Fritsch-Carlson) convertida em béziers cúbicas: sem overshoot. */
function smoothPath(pts: readonly Pt[]): string {
  const n = pts.length;
  if (n === 0) return "";
  if (n === 1) return `M${pts[0][0]},${pts[0][1]}`;
  const dx: number[] = [];
  const m: number[] = [];
  for (let i = 0; i < n - 1; i++) {
    dx.push(pts[i + 1][0] - pts[i][0]);
    m.push((pts[i + 1][1] - pts[i][1]) / dx[i]);
  }
  const t: number[] = [m[0]];
  for (let i = 1; i < n - 1; i++) {
    t.push(m[i - 1] * m[i] <= 0 ? 0 : (m[i - 1] + m[i]) / 2);
  }
  t.push(m[n - 2]);
  for (let i = 0; i < n - 1; i++) {
    if (m[i] === 0) {
      t[i] = 0;
      t[i + 1] = 0;
      continue;
    }
    const a = t[i] / m[i];
    const b = t[i + 1] / m[i];
    const s = a * a + b * b;
    if (s > 9) {
      const k = 3 / Math.sqrt(s);
      t[i] = k * a * m[i];
      t[i + 1] = k * b * m[i];
    }
  }
  let d = `M${pts[0][0].toFixed(2)},${pts[0][1].toFixed(2)}`;
  for (let i = 0; i < n - 1; i++) {
    const h = dx[i] / 3;
    d += ` C${(pts[i][0] + h).toFixed(2)},${(pts[i][1] + t[i] * h).toFixed(2)} ${(pts[i + 1][0] - h).toFixed(2)},${(pts[i + 1][1] - t[i + 1] * h).toFixed(2)} ${pts[i + 1][0].toFixed(2)},${pts[i + 1][1].toFixed(2)}`;
  }
  return d;
}

function scale(values: readonly number[], lo: number, hi: number, outLo: number, outHi: number) {
  const span = hi - lo || 1;
  return values.map((v) => outLo + ((v - lo) / span) * (outHi - outLo));
}

const TONES = {
  brand: { a: "#ff8a96", b: "var(--brand)" },
  neutral: { a: "#a3a3a3", b: "var(--foreground)" },
  success: { a: "#7bd88f", b: "var(--chart-positive)" },
} as const;

export type ChartTone = keyof typeof TONES;

/* ------------------------------------------------------------------ */
/* Sparkline                                                          */
/* ------------------------------------------------------------------ */

export interface SparklineProps {
  data: readonly number[];
  tone?: ChartTone;
  /** Preenche a área abaixo da linha com gradiente. */
  fill?: boolean;
  /** Marca o último ponto. */
  endDot?: boolean;
  className?: string;
  ariaLabel?: string;
}

export function Sparkline({
  data,
  tone = "brand",
  fill = true,
  endDot = true,
  className,
  ariaLabel,
}: SparklineProps) {
  const uid = useId().replace(/:/g, "");
  const W = 120;
  const H = 36;
  const pad = 6;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const xs = data.map((_, i) => pad + (i / Math.max(data.length - 1, 1)) * (W - pad * 2));
  const ys = scale(data, min, max, H - pad, pad);
  const pts: Pt[] = xs.map((x, i) => [x, ys[i]]);
  const line = smoothPath(pts);
  const c = TONES[tone];
  const last = pts[pts.length - 1];

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className={cn("block h-auto w-full", className)}
      role={ariaLabel ? "img" : undefined}
      aria-label={ariaLabel}
      aria-hidden={ariaLabel ? undefined : true}

    >
      <defs>
        <linearGradient id={`${uid}-l`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor={c.a} />
          <stop offset="1" stopColor={c.b} />
        </linearGradient>
        <linearGradient id={`${uid}-f`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={c.b} stopOpacity="0.28" />
          <stop offset="1" stopColor={c.b} stopOpacity="0" />
        </linearGradient>
      </defs>
      {fill ? <path d={`${line} L${xs[xs.length - 1]},${H} L${xs[0]},${H} Z`} fill={`url(#${uid}-f)`} /> : null}
      <path
        d={line}
        fill="none"
        stroke={`url(#${uid}-l)`}
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
      {endDot && last ? (
        <>
          <circle cx={last[0]} cy={last[1]} r={4.5} fill={c.b} opacity={0.18} />
          <circle cx={last[0]} cy={last[1]} r={2} fill={c.b} />
        </>
      ) : null}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* AreaChart                                                          */
/* ------------------------------------------------------------------ */

export interface AreaDatum {
  label: string;
  value: number;
}

export interface AreaChartProps {
  data: readonly AreaDatum[];
  /** Série de comparação (mesmo tamanho de `data`), desenhada tracejada em cinza. */
  compare?: readonly number[];
  /** Índice do ponto com marcador + tooltip estático. */
  highlightIndex?: number;
  /** Texto do tooltip; por padrão `label · valor`. */
  tooltip?: string;
  /** Quantidade de divisões do eixo Y. */
  yTicks?: number;
  /** Formatação dos rótulos do eixo Y. */
  formatY?: (v: number) => string;
  /** Tamanho do viewBox (padrão 520x260). Use menor para gráficos pequenos manterem o texto legível. */
  viewWidth?: number;
  viewHeight?: number;
  /** Tamanho dos rótulos em unidades do viewBox (padrão 11.5). */
  fontSize?: number;
  /** Margem esquerda do eixo Y (padrão 44). */
  marginLeft?: number;
  /** Máximo de rótulos no eixo X (padrão 7). */
  maxLabels?: number;
  className?: string;
  ariaLabel?: string;
}

export function AreaChart({
  data,
  compare,
  highlightIndex,
  tooltip,
  yTicks = 4,
  formatY = (v) => String(Math.round(v)),
  viewWidth = 520,
  viewHeight = 260,
  fontSize = 11.5,
  marginLeft = 44,
  maxLabels = 7,
  className,
  ariaLabel = "Gráfico de área",
}: AreaChartProps) {
  const uid = useId().replace(/:/g, "");
  const W = viewWidth;
  const H = viewHeight;
  const L = marginLeft;
  const R = 18;
  const T = 26;
  const B = 32;
  const all = [...data.map((d) => d.value), ...(compare ?? [])];
  const rawMax = Math.max(...all);
  const step = niceStep(rawMax / yTicks);
  const max = step * yTicks;
  const innerH = H - T - B;
  const xs = data.map((_, i) => L + (i / Math.max(data.length - 1, 1)) * (W - L - R));
  const ys = scale(data.map((d) => d.value), 0, max, H - B, T);
  const pts: Pt[] = xs.map((x, i) => [x, ys[i]]);
  const line = smoothPath(pts);
  const cmp = compare
    ? smoothPath(xs.map((x, i) => [x, scale([compare[i]], 0, max, H - B, T)[0]] as Pt))
    : null;
  const ticks = Array.from({ length: yTicks + 1 }, (_, i) => i * step);
  const labelEvery = Math.ceil(data.length / maxLabels);

  const hi = highlightIndex !== undefined ? pts[highlightIndex] : undefined;
  const tipText =
    hi && highlightIndex !== undefined
      ? (tooltip ?? `${data[highlightIndex].label} · ${formatY(data[highlightIndex].value)}`)
      : "";
  const tipW = tipText.length * (fontSize * 0.63) + 24;
  const tipX = hi ? Math.min(Math.max(hi[0] - tipW / 2, L), W - R - tipW) : 0;
  const tipY = hi ? Math.max(hi[1] - 40, 2) : 0;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className={cn("block h-auto w-full", className)}
      role="img"
      aria-label={ariaLabel}
    >
      <defs>
        <linearGradient id={`${uid}-s`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#ff8a96" />
          <stop offset="0.55" stopColor="var(--brand)" />
          <stop offset="1" stopColor="#8a0a1c" />
        </linearGradient>
        <linearGradient id={`${uid}-f`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="var(--brand)" stopOpacity="0.32" />
          <stop offset="0.6" stopColor="#ff8a96" stopOpacity="0.08" />
          <stop offset="1" stopColor="#ff8a96" stopOpacity="0" />
        </linearGradient>
      </defs>

      {ticks.map((tv) => {
        const y = H - B - (tv / max) * innerH;
        return (
          <g key={tv}>
            <line x1={L} x2={W - R} y1={y} y2={y} stroke="currentColor" strokeOpacity={tv === 0 ? 0.22 : 0.09} strokeWidth={1} />
            <text x={L - 10} y={y + 3.5} textAnchor="end" className="fill-muted-foreground font-mono" fontSize={fontSize}>
              {formatY(tv)}
            </text>
          </g>
        );
      })}

      {data.map((d, i) =>
        i % labelEvery === 0 || i === data.length - 1 ? (
          <text
            key={d.label + i}
            x={xs[i]}
            y={H - B + 19}
            textAnchor="middle"
            className="fill-muted-foreground font-mono"
            fontSize={fontSize}
          >
            {d.label}
          </text>
        ) : null,
      )}

      {cmp ? (
        <path d={cmp} fill="none" stroke="currentColor" strokeOpacity={0.35} strokeWidth={1.5} strokeDasharray="4 4" strokeLinecap="round" />
      ) : null}

      <path d={`${line} L${xs[xs.length - 1]},${H - B} L${xs[0]},${H - B} Z`} fill={`url(#${uid}-f)`} />
      <path d={line} fill="none" stroke={`url(#${uid}-s)`} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />

      {hi ? (
        <g>
          <line x1={hi[0]} x2={hi[0]} y1={hi[1]} y2={H - B} stroke="var(--brand)" strokeOpacity={0.5} strokeDasharray="3 3" />
          <circle cx={hi[0]} cy={hi[1]} r={9} fill="var(--brand)" opacity={0.16} />
          <circle cx={hi[0]} cy={hi[1]} r={4.5} className="fill-background" stroke="var(--brand)" strokeWidth={2.5} />
          <g transform={`translate(${tipX},${tipY})`}>
            <rect width={tipW} height={28} rx={7} className="fill-foreground" />
            <text x={tipW / 2} y={18.5} textAnchor="middle" className="fill-background font-mono" fontSize={fontSize + 0.5} fontWeight={500}>
              {tipText}
            </text>
          </g>
        </g>
      ) : null}
    </svg>
  );
}

function niceStep(raw: number): number {
  const p = Math.pow(10, Math.floor(Math.log10(raw || 1)));
  const f = raw / p;
  const nice = f <= 1 ? 1 : f <= 2 ? 2 : f <= 2.5 ? 2.5 : f <= 5 ? 5 : 10;
  return nice * p;
}

/* ------------------------------------------------------------------ */
/* MiniBars                                                           */
/* ------------------------------------------------------------------ */

export interface MiniBarsProps {
  data: readonly number[];
  /** Barras destacadas com gradiente brand; as demais ficam neutras. */
  highlightIndex?: number | readonly number[];
  className?: string;
  ariaLabel?: string;
}

export function MiniBars({ data, highlightIndex, className, ariaLabel }: MiniBarsProps) {
  const uid = useId().replace(/:/g, "");
  const W = 160;
  const H = 56;
  const gap = 4;
  const bw = (W - gap * (data.length - 1)) / data.length;
  const max = Math.max(...data, 1);
  const hl = new Set(
    highlightIndex === undefined ? [] : typeof highlightIndex === "number" ? [highlightIndex] : highlightIndex,
  );
  const r = Math.min(3, bw / 2);

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className={cn("block h-auto w-full", className)}
      role={ariaLabel ? "img" : undefined}
      aria-label={ariaLabel}
      aria-hidden={ariaLabel ? undefined : true}

    >
      <defs>
        <linearGradient id={`${uid}-b`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#ff8a96" />
          <stop offset="1" stopColor="var(--brand)" />
        </linearGradient>
      </defs>
      {data.map((v, i) => {
        const h = Math.max((v / max) * (H - 2), 3);
        const x = i * (bw + gap);
        const y = H - h;
        const on = hl.has(i);
        return (
          <path
            key={i}
            d={`M${x},${H} V${y + r} Q${x},${y} ${x + r},${y} H${x + bw - r} Q${x + bw},${y} ${x + bw},${y + r} V${H} Z`}
            fill={on ? `url(#${uid}-b)` : "currentColor"}
            fillOpacity={on ? 1 : 0.14}
          />
        );
      })}
    </svg>
  );
}
