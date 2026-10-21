import { GradientBands } from '@/client/shared/ui/assets';

// Celular: as faixas ocupam a metade de baixo (atrás do mockup) e se dissolvem para cima.
const MASK_MOBILE = 'linear-gradient(to top, #000 22%, rgba(0,0,0,0.6) 55%, transparent 96%)';

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
 * Só em lg+ (canto superior direito). No celular as faixas ficam no bloco do aparelho (LandingPage).
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
      <HeroBands />
    </div>
  );
}
