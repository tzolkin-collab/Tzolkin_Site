import Link from 'next/link';
import { GradientBands } from '@/client/shared/ui/assets';

export function FinalCta() {
  return (
    <section aria-labelledby="final-cta-title" className="bg-background px-6 pb-20 pt-4 md:px-12 md:pb-28">
      <div
        className="relative mx-auto max-w-[1200px] overflow-hidden rounded-3xl bg-neutral-950 px-8 py-16 text-neutral-50 md:px-16 md:py-24"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            WebkitMaskImage: 'linear-gradient(to left, #000 25%, transparent 85%)',
            maskImage: 'linear-gradient(to left, #000 25%, transparent 85%)',
          }}
        >
          <GradientBands variant="band" drift={false} />
        </div>
        <h2 id="final-cta-title" className="relative max-w-2xl text-3xl font-semibold tracking-tight md:text-5xl md:leading-[1.08]">
          Vamos desenhar o seu próximo produto.
        </h2>
        <p className="relative mt-5 max-w-xl text-lg text-neutral-300">
          Conte o que você precisa construir ou melhorar e a equipe retorna pelo canal que você escolher.
        </p>
        <div className="relative mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
          <Link
            href="/forms"
            className="inline-flex h-12 items-center rounded-full bg-white px-7 text-sm font-semibold text-neutral-950 transition-colors hover:bg-neutral-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950"
          >
            Conversar sobre meu projeto
          </Link>
        </div>
      </div>
    </section>
  );
}
