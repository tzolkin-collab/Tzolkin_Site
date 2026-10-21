'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useMotionValueEvent, useScroll } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { EcommerceDevices } from './EcommerceDevices';
import { FitBox } from './FitBox';

// Marcas: Shopify e Mercado Livre do svgl.app; Amazon e Shopee do Simple Icons (CC0). São dos respectivos donos
// e aparecem só para indicar os canais que podem entrar na proposta.
const LOGOS = [
  { name: 'Loja Shopify', src: '/ecommerce/logos/shopify.svg', mono: false },
  { name: 'Mercado Livre', src: '/ecommerce/logos/mercado-libre.svg', mono: false },
  { name: 'Amazon', src: '/ecommerce/logos/amazon.svg', mono: true },
  { name: 'Shopee', src: '/ecommerce/logos/shopee.svg', mono: true },
];

const STEPS = [
  {
    label: 'A loja',
    title: 'Uma loja desenhada para o seu catálogo.',
    text: 'Loja ou tema Shopify com página de produto, variações e carrinho pensados para o computador e para o celular, cada um com o seu layout.',
  },
  {
    label: 'O checkout',
    title: 'Pagar sem tropeçar.',
    text: 'Pix, cartão e boleto no tema da loja, dentro do que o plano da Shopify permite. Duas colunas no computador, uma tela por vez no celular.',
  },
  {
    label: 'O pedido',
    title: 'O pedido cai na mesma fila.',
    text: 'Junto com os de outros canais. O saldo do estoque é atualizado e a nota fiscal é solicitada, sem ninguém digitar o pedido de novo.',
  },
];

const ctaClass =
  'group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-brand px-6 text-sm font-semibold text-brand-foreground transition-colors hover:bg-brand/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background';

/**
 * Seção fixa conduzida pelo scroll em qualquer tela (mesmo padrão do hero): 3 etapas.
 * Em telas pequenas o layout é compacto: etapas em linha e a demonstração escalada para caber na altura que sobra.
 */
export function EcommerceSection() {
  const ref = useRef<HTMLElement>(null);
  const [wide, setWide] = useState(false);
  const [step, setStep] = useState(0);

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  useMotionValueEvent(scrollYProgress, 'change', (v) => setStep(Math.min(2, Math.max(0, Math.floor(v * 3)))));
  useEffect(() => {
    const q = window.matchMedia('(min-width: 1280px)');
    const update = () => setWide(q.matches);
    update();
    q.addEventListener('change', update);
    return () => q.removeEventListener('change', update);
  }, []);

  const goTo = (i: number) => {
    setStep(i);
    const el = ref.current;
    if (el) {
      const total = el.offsetHeight - window.innerHeight;
      window.scrollTo({ top: el.offsetTop + total * ((i + 0.5) / 3), behavior: 'smooth' });
    }
  };

  const current = STEPS[step];
  const devices = <EcommerceDevices step={step} />;

  return (
    <section
      ref={ref}
      id="ecommerce-marketplace"
      aria-labelledby="ecommerce-title"
      className="relative border-t border-border bg-muted/40 h-[300vh]"
    >
      <div className="sticky top-0 flex h-[100svh] flex-col overflow-hidden pb-4 pt-[72px] xl:justify-center xl:py-0">
        {/* cunha de cor no fundo da seção, encostada na borda de baixo, em qualquer tela */}
        <div
          aria-hidden="true"
          className="absolute bottom-0 right-0 h-[220px] w-full bg-[linear-gradient(100deg,transparent_0%,rgba(226,59,59,0.5)_55%,#c90000_100%)] [clip-path:polygon(0_100%,100%_30%,100%_100%)] md:h-[300px] md:w-[80%] xl:h-[48%] xl:w-[64%] xl:[clip-path:polygon(0_100%,100%_18%,100%_100%)]"
        />
        <div className="relative z-10 mx-auto flex min-h-0 w-full max-w-[1200px] flex-1 flex-col px-6 md:px-12 xl:grid xl:flex-none xl:grid-cols-12 xl:items-center xl:gap-0">
          <div className="xl:col-span-4 xl:pr-10">
            <h2 id="ecommerce-title" className="text-[1.65rem] font-semibold leading-[1.05] tracking-[-0.035em] md:text-4xl xl:text-5xl xl:leading-[1.03]">
              Cada pedido, de qualquer canal, na mesma fila.
            </h2>

            <ol className="mt-4 flex gap-2 xl:mt-8 xl:block xl:border-t xl:border-border" aria-label="Etapas da demonstração">
              {STEPS.map((s, i) => (
                <li key={s.label} className="flex-1 xl:border-b xl:border-border">
                  <button
                    type="button"
                    aria-current={step === i ? 'step' : undefined}
                    onClick={() => goTo(i)}
                    className={`flex min-h-10 w-full items-center justify-center gap-2 rounded-full border px-2 text-[13px] font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand xl:min-h-12 xl:justify-start xl:gap-4 xl:rounded-none xl:border-0 xl:px-0 xl:py-3 xl:text-[15px] ${
                      step === i ? 'border-brand text-foreground' : 'border-border text-foreground/50'
                    }`}
                  >
                    <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold tabular-nums xl:h-6 xl:w-6 xl:text-xs ${step === i ? 'bg-brand text-brand-foreground' : 'border border-border'}`}>
                      {i + 1}
                    </span>
                    {s.label}
                  </button>
                </li>
              ))}
            </ol>

            <div className="mt-3 xl:mt-6 xl:min-h-[140px]" aria-live="polite">
              <p className="text-base font-semibold tracking-tight xl:text-xl">{current.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-foreground/70 xl:mt-2 xl:text-base">{current.text}</p>
              {step === 2 && (
                <ul className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 xl:mt-4 xl:gap-x-5 xl:gap-y-2" aria-label="Canais de exemplo">
                  {LOGOS.map((l) => (
                    <li key={l.name} className="flex items-center gap-1.5 text-xs text-foreground/70 xl:gap-2 xl:text-sm">
                      <Image src={l.src} alt="" width={16} height={16} unoptimized className={`h-4 w-4 object-contain ${l.mono ? 'dark:invert' : ''}`} />
                      {l.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <Link
              href="/forms?aplicacao=ecommerce-marketplace"
              className="group mt-1 inline-flex min-h-11 items-center gap-1.5 rounded-sm text-sm font-semibold text-brand hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background xl:hidden"
            >
              Conversar sobre minha loja
              <ArrowRight size={16} aria-hidden="true" />
            </Link>

            <div className="hidden xl:block">
              <Link href="/forms?aplicacao=ecommerce-marketplace" className={`${ctaClass} mt-6`}>
                Conversar sobre minha loja
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </Link>
              <p className="mt-4 text-sm text-foreground/55">Telas de exemplo, com loja, clientes e valores fictícios.</p>
            </div>
          </div>

          {wide ? (
            <div className="relative min-w-0 xl:col-span-8 xl:-mr-16">{devices}</div>
          ) : (
            <FitBox className="mt-3">{devices}</FitBox>
          )}

        </div>
      </div>
    </section>
  );
}
