'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useMotionValueEvent, useScroll } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { EcommerceDevices } from './EcommerceDevices';

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

export function EcommerceSection() {
  const ref = useRef<HTMLElement>(null);
  const [pinned, setPinned] = useState(false);
  const [step, setStep] = useState(0);

  // Mesmo padrão do hero: no desktop a seção fica fixa e o scroll percorre as 3 etapas.
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    if (pinned) setStep(Math.min(2, Math.max(0, Math.floor(v * 3))));
  });
  useEffect(() => {
    const q = window.matchMedia('(min-width: 1280px)');
    const update = () => setPinned(q.matches);
    update();
    q.addEventListener('change', update);
    return () => q.removeEventListener('change', update);
  }, []);

  const goTo = (i: number) => {
    setStep(i);
    const el = ref.current;
    if (pinned && el) {
      const total = el.offsetHeight - window.innerHeight;
      window.scrollTo({ top: el.offsetTop + total * ((i + 0.5) / 3), behavior: 'smooth' });
    }
  };

  const current = STEPS[step];

  return (
    <section
      ref={ref}
      id="ecommerce-marketplace"
      aria-labelledby="ecommerce-title"
      className="relative border-t border-border bg-muted/40 xl:h-[300vh]"
    >
      <div className="relative overflow-hidden py-20 md:py-24 xl:sticky xl:top-0 xl:flex xl:h-screen xl:items-center xl:py-0">
        {/* cunha de cor no fundo da seção, encostada na borda de baixo (visível também no celular) */}
        <div
          aria-hidden="true"
          className="absolute bottom-0 right-0 h-[260px] w-full bg-[linear-gradient(100deg,transparent_0%,rgba(226,59,59,0.5)_55%,#c90000_100%)] [clip-path:polygon(0_100%,100%_28%,100%_100%)] md:h-[320px] md:w-[80%] xl:h-[48%] xl:w-[64%] xl:[clip-path:polygon(0_100%,100%_18%,100%_100%)]"
        />
        <div className="relative z-10 mx-auto w-full max-w-[1200px] px-6 md:px-12">
          <div className="grid items-center gap-12 xl:grid-cols-12 xl:gap-0">
            <div className="xl:col-span-4 xl:pr-10">
              <h2 id="ecommerce-title" className="text-4xl font-semibold leading-[1.03] tracking-[-0.035em] md:text-5xl">
                Cada pedido, de qualquer canal, na mesma fila.
              </h2>

              <ol className="mt-8 border-t border-border" aria-label="Etapas da demonstração">
                {STEPS.map((s, i) => (
                  <li key={s.label} className="border-b border-border">
                    <button
                      type="button"
                      aria-current={step === i ? 'step' : undefined}
                      onClick={() => goTo(i)}
                      className="flex min-h-12 w-full items-center gap-4 py-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                    >
                      <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold tabular-nums ${step === i ? 'bg-brand text-brand-foreground' : 'border border-border text-foreground/50'}`}>
                        {i + 1}
                      </span>
                      <span className={`text-[15px] font-medium ${step === i ? 'text-foreground' : 'text-foreground/50'}`}>{s.label}</span>
                    </button>
                  </li>
                ))}
              </ol>

              <div className="mt-6 min-h-[140px]" aria-live="polite">
                <p className="text-xl font-semibold tracking-tight">{current.title}</p>
                <p className="mt-2 text-base leading-relaxed text-foreground/70">{current.text}</p>
                {step === 2 && (
                  <ul className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2" aria-label="Canais de exemplo">
                    {LOGOS.map((l) => (
                      <li key={l.name} className="flex items-center gap-2 text-sm text-foreground/70">
                        <Image src={l.src} alt="" width={16} height={16} unoptimized className={`h-4 w-4 object-contain ${l.mono ? 'dark:invert' : ''}`} />
                        {l.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <Link
                href="/forms?aplicacao=ecommerce-marketplace"
                className="group mt-6 inline-flex h-12 items-center gap-2 rounded-full bg-brand px-6 text-sm font-semibold text-brand-foreground transition-colors hover:bg-brand/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                Conversar sobre minha loja
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </Link>
              <p className="mt-4 text-sm text-foreground/55">Telas de exemplo, com loja, clientes e valores fictícios.</p>
            </div>

            <div className="relative min-w-0 xl:col-span-8 xl:-mr-16">
              <div className="relative z-10">
                <EcommerceDevices step={step} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
