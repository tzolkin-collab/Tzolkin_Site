import { GradientBands } from '@/client/shared/ui/assets';

const MASK =
  'linear-gradient(to left, #000 38%, rgba(0,0,0,0.45) 56%, transparent 82%), linear-gradient(to bottom, #000 58%, transparent 98%)';

/**
 * Faixas estáticas (sem animação, sem filtros). No escuro usa a variante
 * `heroDark`: cores saturadas e sem faixas quase pretas, que viravam lama
 * sobre o fundo escuro. A profundidade vem da máscara de alpha.
 */
export function HeroBands({ className = '' }: { className?: string }) {
  return (
    <>
      <GradientBands variant="hero" drift={false} noise={false} className={`dark:hidden ${className}`} />
      <GradientBands variant="heroDark" drift={false} noise={false} className={`hidden dark:block ${className}`} />
    </>
  );
}

/**
 * Faixas diagonais estáticas no canto superior direito, atrás da composição.
 * A máscara (alpha) dissolve as faixas rumo à coluna de texto e à seção abaixo.
 * Só em lg+; no mobile as faixas ficam atrás do mockup (ver HeroMockups).
 */
export function HeroBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-y-0 right-0 hidden w-[60%] opacity-25 lg:block dark:opacity-40"
      style={{
        WebkitMaskImage: MASK,
        maskImage: MASK,
        WebkitMaskComposite: 'source-in',
        maskComposite: 'intersect',
      }}
    >
      <HeroBands />
    </div>
  );
}
