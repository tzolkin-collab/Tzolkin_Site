'use client';

import { useLayoutEffect, useRef, useState, type JSX } from 'react';
import Link from 'next/link';
import { useMotionValueEvent, useScroll } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { applications } from '@/client/shared/data/homeData';
import { SectionHeader } from '@/client/shared/ui/SectionHeader';
import { AgentsDevices, CrmDevices, FiscalDevices, PilotDevices } from '@/client/shared/ui/apps/ProductDevices';
import { EcommerceDevices } from '@/client/shared/ui/apps/EcommerceDevices';
import { FitBox } from '@/client/shared/ui/apps/FitBox';
import { HeroBands } from '@/client/shared/ui/hero/HeroBackground';

const mocks: Record<string, () => JSX.Element> = {
  'crm-com-ia': () => <CrmDevices step={1} />,
  'agentes-ia': AgentsDevices,
  'ecommerce-marketplace': () => <EcommerceDevices step={0} />,
  fiscal: FiscalDevices,
  piloto: PilotDevices,
};

const COUNT = applications.length;

// As faixas do hero reaparecem na laje (desktop) ou embaixo da demonstração (celular) e se dissolvem rumo ao texto.
const SLAB_MASK = 'linear-gradient(to top left, #000 0%, rgba(0,0,0,0.55) 38%, transparent 72%)';
const MOBILE_MASK = 'linear-gradient(to top, #000 20%, rgba(0,0,0,0.6) 55%, transparent 96%)';


/**
 * Índice editorial das aplicações, fixo e conduzido pelo scroll em qualquer tela (mesmo padrão do hero):
 * uma aplicação por vez, em um acordeão (a ativa abre) com a demonstração ao lado no desktop e, no celular,
 * escalada para a altura que sobra.
 */
export function ServicesSection() {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  useMotionValueEvent(scrollYProgress, 'change', (v) => setActive(Math.min(COUNT - 1, Math.max(0, Math.floor(v * COUNT)))));

  const goTo = (i: number) => {
    setActive(i);
    const el = ref.current;
    if (el) {
      const total = el.offsetHeight - window.innerHeight;
      window.scrollTo({ top: el.offsetTop + total * ((i + 0.5) / COUNT), behavior: 'smooth' });
    }
  };

  // Acordeão sem layout shift: as linhas têm altura fixa e o painel de detalhes (altura reservada) e as linhas
  // abaixo dele só se movem por transform. O espaço do painel já está reservado no fim da lista.
  const listRef = useRef<HTMLOListElement>(null);
  const rowRefs = useRef<Array<HTMLLIElement | null>>([]);
  const [detailY, setDetailY] = useState(0);
  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const place = () => {
      const li = rowRefs.current[active];
      if (li) setDetailY(li.offsetTop + li.offsetHeight);
    };
    place();
    const ro = new ResizeObserver(place);
    ro.observe(list);
    return () => ro.disconnect();
  }, [active]);

  const app = applications[active];
  const Preview = mocks[app.slug] ?? PilotDevices;
  const linkClass =
    'group inline-flex min-h-11 items-center gap-1.5 rounded-sm text-sm font-semibold text-brand hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background';

  return (
    <section
      ref={ref}
      id="aplicacoes"
      aria-labelledby="aplicacoes-title"
      className="relative z-10 h-[360svh] w-full bg-background"
    >
      <div className="sticky top-0 flex h-[100svh] flex-col overflow-hidden pb-4 pt-[72px] xl:justify-center xl:pb-6 xl:pt-[76px]">
        {/* desktop: laje à direita (52% da tela, sangrando até a borda) com a demonstração dentro dela */}
        <div className="absolute inset-y-0 right-0 hidden w-[52%] xl:block">
          <div aria-hidden="true" className="absolute inset-0 overflow-hidden border-l border-dashed border-border bg-muted/60">
            <div className="absolute inset-0 opacity-80" style={{ WebkitMaskImage: SLAB_MASK, maskImage: SLAB_MASK }}>
              <HeroBands />
            </div>
          </div>
          <div className="absolute inset-0 flex items-center px-6" aria-live="polite">
            <FitBox center className="!flex-none h-[min(700px,calc(100svh-120px))] w-full">
              <div key={app.slug} className="overflow-hidden rounded-lg">
                <Preview />
              </div>
            </FitBox>
          </div>
        </div>
        {/* celular e tablet: faixas embaixo, atrás da demonstração */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[34%] xl:hidden"
          style={{ WebkitMaskImage: MOBILE_MASK, maskImage: MOBILE_MASK }}
        >
          <HeroBands />
        </div>

        <div className="relative z-10 mx-auto flex min-h-0 w-full max-w-[1200px] flex-1 flex-col px-6 md:px-12 xl:grid xl:flex-none xl:grid-cols-12 xl:items-center xl:gap-0">
          <div className="xl:col-span-6 xl:pr-16">
            <SectionHeader id="aplicacoes-title" eyebrow="Aplicações" title="Software para vender," muted="atender e operar." />

            {/* acordeão: a aplicação ativa abre sem empurrar a página (altura reservada, movimento só por transform) */}
            <ol
              ref={listRef}
              className="relative mt-4 border-t border-border [--dh:7.5rem] xl:mt-8 xl:[--dh:11.5rem]"
              style={{ paddingBottom: 'var(--dh)' }}
              aria-label="Aplicações"
            >
              {applications.map((a, i) => {
                const on = i === active;
                return (
                  <li
                    key={a.slug}
                    ref={(el) => {
                      rowRefs.current[i] = el;
                    }}
                    className="border-b border-border"
                    style={{ transform: i > active ? 'translateY(var(--dh))' : undefined }}
                  >
                    <button
                      type="button"
                      aria-expanded={on}
                      onClick={() => goTo(i)}
                      className="flex min-h-11 w-full items-baseline gap-4 py-2.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand xl:min-h-12 xl:gap-5 xl:py-3"
                    >
                      <span className={`w-6 shrink-0 text-sm font-semibold tabular-nums ${on ? 'text-brand' : 'text-foreground/35'}`}>{String(i + 1).padStart(2, '0')}</span>
                      <span className={`text-lg font-semibold leading-snug tracking-tight xl:text-2xl ${on ? 'text-foreground' : 'text-foreground/45'}`}>{a.title}</span>
                    </button>
                  </li>
                );
              })}
              <div
                aria-live="polite"
                className="absolute inset-x-0 top-0 overflow-hidden pl-10 pt-1 xl:pl-11"
                style={{ height: 'var(--dh)', transform: `translateY(${detailY}px)` }}
              >
                <p className="text-sm font-medium xl:text-base">{app.forWho}</p>
                <p className="mt-2 hidden max-w-xl text-[15px] leading-relaxed text-foreground/70 xl:block">{app.delivers}</p>
                <Link href={app.href} className={`${linkClass} mt-1 xl:mt-3`}>
                  {app.ctaText}
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                </Link>
              </div>
            </ol>
            <p className="mt-4 hidden text-sm text-foreground/55 xl:block">Cinco frentes em que já desenhamos e entregamos. O escopo final é definido em conversa.</p>

          </div>

          <FitBox className="mt-1 xl:hidden">
            <div key={app.slug} className="overflow-hidden rounded-lg">
              <Preview />
            </div>
          </FitBox>
        </div>
      </div>
    </section>
  );
}
