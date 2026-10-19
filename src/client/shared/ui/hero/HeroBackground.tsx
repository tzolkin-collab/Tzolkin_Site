import { GradientBands } from '@/client/shared/ui/assets';

const MASK =
  'linear-gradient(to left, #000 38%, rgba(0,0,0,0.45) 56%, transparent 82%), linear-gradient(to bottom, #000 58%, transparent 98%)';

/**
 * Faixas diagonais estáticas no canto superior direito, atrás da composição.
 * A máscara (alpha) dissolve as faixas rumo à coluna de texto e à seção abaixo,
 * então funciona igual no claro e no escuro. Só em lg+; no mobile as faixas
 * ficam atrás do mockup (ver HeroMockups).
 */
export function HeroBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-y-0 right-0 hidden w-[66%] lg:block"
      style={{
        WebkitMaskImage: MASK,
        maskImage: MASK,
        WebkitMaskComposite: 'source-in',
        maskComposite: 'intersect',
      }}
    >
      <GradientBands variant="hero" drift={false} className="dark:opacity-75" />
    </div>
  );
}
