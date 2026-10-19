import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export type GlassElevation = 1 | 2 | 3;

export interface GlassPanelProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  children?: ReactNode;
  /** Título mono no cabeçalho. Quando presente (ou `windowDots`), mostra o cabeçalho. */
  title?: string;
  /** Mostra os 3 pontos de janela mesmo sem título. */
  windowDots?: boolean;
  /** Elemento à direita do cabeçalho (ex.: Chip). */
  headerRight?: ReactNode;
  /** 1 (sutil) a 3 (flutuante). */
  elevation?: GlassElevation;
  /** Inclinação 3D estática. `true` usa o padrão; ou informe os graus. */
  tilt?: boolean | { x?: number; y?: number };
  bodyClassName?: string;
}

// Sombras em camadas: contato, difusa média, ambiente ampla. Rgba escuras funcionam em claro e escuro.
const SHADOWS: Record<GlassElevation, string> = {
  1: "0 1px 1px rgba(10,10,12,.06), 0 4px 10px -2px rgba(10,10,12,.08), 0 12px 24px -12px rgba(10,10,12,.12)",
  2: "0 1px 1px rgba(10,10,12,.07), 0 6px 14px -3px rgba(10,10,12,.12), 0 22px 44px -16px rgba(10,10,12,.22), 0 40px 80px -30px rgba(60,0,10,.25)",
  3: "0 1px 1px rgba(10,10,12,.08), 0 10px 20px -4px rgba(10,10,12,.16), 0 34px 64px -20px rgba(10,10,12,.32), 0 70px 120px -40px rgba(90,0,16,.38)",
};

export function GlassPanel({
  children,
  title,
  windowDots,
  headerRight,
  elevation = 2,
  tilt = false,
  className,
  bodyClassName,
  style: styleProp,
  ...rest
}: GlassPanelProps) {
  const hasHeader = Boolean(title) || Boolean(windowDots) || Boolean(headerRight);
  const rx = tilt === true ? 6 : tilt ? (tilt.x ?? 6) : 0;
  const ry = tilt === true ? -10 : tilt ? (tilt.y ?? -10) : 0;

  const style: CSSProperties = {
    boxShadow: SHADOWS[elevation],
    ...(tilt
      ? { transform: `perspective(1600px) rotateX(${rx}deg) rotateY(${ry}deg)`, transformOrigin: "50% 50%" }
      : null),
    ...styleProp,
  };

  return (
    <div
      {...rest}
      style={style}
      className={cn(
        "relative overflow-hidden rounded-2xl border border-black/10 bg-card/95 text-card-foreground",
        "dark:border-white/12 dark:bg-card/90",
        // borda de luz superior de 1px
        "before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-white/80 before:to-transparent dark:before:via-white/25",
        className,
      )}
    >
      {hasHeader ? (
        <div className="flex items-center gap-3 border-b border-black/[0.07] bg-black/[0.025] px-4 py-2.5 dark:border-white/[0.08] dark:bg-white/[0.03]">
          <div className="flex items-center gap-1.5" aria-hidden="true">
            <span className="size-2.5 rounded-full bg-[#ff8a96] ring-1 ring-inset ring-black/10" />
            <span className="size-2.5 rounded-full bg-[#ffc58a] ring-1 ring-inset ring-black/10" />
            <span className="size-2.5 rounded-full bg-foreground/20 ring-1 ring-inset ring-black/10" />
          </div>
          {title ? (
            <span className="min-w-0 flex-1 truncate font-mono text-[11px] tracking-tight text-muted-foreground">
              {title}
            </span>
          ) : (
            <span className="flex-1" />
          )}
          {headerRight}
        </div>
      ) : null}
      <div className={cn("p-5", bodyClassName)}>{children}</div>
    </div>
  );
}
