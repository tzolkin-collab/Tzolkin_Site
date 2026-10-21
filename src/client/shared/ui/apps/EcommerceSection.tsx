'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useMotionValueEvent, useScroll } from 'framer-motion';
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

/**
 * Seção fixa conduzida pelo scroll em qualquer tela (mesmo padrão do hero): 3 etapas.
 * Em telas pequenas o layout é compacto: etapas em linha e a demonstração escalada para caber na altura que sobra.
 */
export function EcommerceSection() {
  const ref = useRef<HTMLElement>(null);
  const [step, setStep] = useState(0);

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  useMotionValueEvent(scrollYProgress, 'change', (v) => setStep(Math.min(2, Math.max(0, Math.floor(v * 3)))));

  const devices = <EcommerceDevices step={step} />;

  return (
    <section
      ref={ref}
      id="ecommerce-marketplace"
      aria-labelledby="ecommerce-title"
      className="relative border-t border-border bg-muted/40 h-[300svh]"
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

            {/* os três textos ocupam a mesma célula: a altura é a do maior e nada se mexe ao trocar de etapa */}
            <div className="mt-4 grid xl:mt-8" aria-live="polite">
              {STEPS.map((s, i) => (
                <div key={s.label} aria-hidden={i !== step} className={`col-start-1 row-start-1 ${i === step ? '' : 'invisible'}`}>
                  <p className="text-base font-semibold tracking-tight xl:text-xl">{s.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-foreground/70 xl:mt-2 xl:text-base">{s.text}</p>
                  {i === 2 && (
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
              ))}
            </div>
              <Link
                href="/forms?aplicacao=ecommerce-marketplace"
                className="group mt-1 inline-flex min-h-11 items-center gap-1.5 rounded-sm text-sm font-semibold text-brand hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                Conversar sobre minha loja
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </Link>

            {/* só a barra: o nome de cada etapa já está dentro das telas */}
            <div
              role="progressbar"
              aria-label="Progresso da demonstração"
              aria-valuemin={1}
              aria-valuemax={3}
              aria-valuenow={step + 1}
              className="mt-2 h-1 w-full overflow-hidden rounded-full bg-border xl:mt-3"
            >
              <motion.div className="h-full origin-left bg-brand" style={{ scaleX: scrollYProgress }} />
            </div>
            <p className="mt-4 hidden text-sm text-foreground/55 xl:block">Telas de exemplo, com loja, clientes e valores fictícios.</p>
          </div>

          <div className="relative hidden min-w-0 xl:col-span-8 xl:-mr-16 xl:block">{devices}</div>
          <FitBox className="mt-3 xl:hidden">{devices}</FitBox>
        </div>
      </div>
    </section>
  );
}
