import Link from 'next/link';

export function FinalCta() {
  return (
    <section aria-labelledby="final-cta-title" className="bg-background px-6 pb-20 pt-4 md:px-12 md:pb-28">
      <div
        className="relative mx-auto max-w-[1200px] overflow-hidden rounded-3xl bg-neutral-950 px-8 py-16 text-neutral-50 md:px-16 md:py-24"
        style={{
          backgroundImage:
            'radial-gradient(60% 80% at 90% 0%, color-mix(in oklab, var(--brand) 38%, transparent), transparent 70%), radial-gradient(40% 60% at 0% 100%, rgba(255,255,255,0.07), transparent 70%)',
        }}
      >
        <h2 id="final-cta-title" className="max-w-2xl text-3xl font-semibold tracking-tight md:text-5xl md:leading-[1.08]">
          Vamos desenhar o seu próximo produto.
        </h2>
        <p className="mt-5 max-w-xl text-lg text-neutral-300">
          Conte o que você precisa. Respondemos com escopo, prazo e proposta.
        </p>
        <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
          <Link
            href="/forms"
            className="inline-flex h-12 items-center rounded-full bg-white px-7 text-sm font-semibold text-neutral-950 transition-colors hover:bg-neutral-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950"
          >
            Conversar sobre meu projeto
          </Link>
          <Link href="/forms/contato" className="text-sm font-semibold text-neutral-200 hover:text-white">
            Falar com os fundadores <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
