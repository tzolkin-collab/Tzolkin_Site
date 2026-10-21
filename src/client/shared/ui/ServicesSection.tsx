'use client';

import { useEffect, useRef, useState, type JSX, type ReactNode } from 'react';
import Link from 'next/link';
import { useMotionValueEvent, useScroll } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { applications } from '@/client/shared/data/homeData';
import { SectionHeader } from '@/client/shared/ui/SectionHeader';
import { ChatMock, FunnelMock, InvoiceMock, PilotMock } from '@/client/shared/ui/apps/AppMockups';
import { EcommerceDevices } from '@/client/shared/ui/apps/EcommerceDevices';
import { FitBox } from '@/client/shared/ui/apps/FitBox';
import { HeroBands } from '@/client/shared/ui/hero/HeroBackground';

const mocks: Record<string, () => JSX.Element> = {
  'crm-com-ia': FunnelMock,
  'agentes-ia': ChatMock,
  'ecommerce-marketplace': () => (
    <div className="p-2 md:p-4">
      <EcommerceDevices step={0} />
    </div>
  ),
  fiscal: InvoiceMock,
  piloto: PilotMock,
};

const COUNT = applications.length;

// As faixas do hero reaparecem na laje (desktop) ou embaixo da demonstração (celular) e se dissolvem rumo ao texto.
const SLAB_MASK = 'linear-gradient(to top left, #000 0%, rgba(0,0,0,0.55) 38%, transparent 72%)';
const MOBILE_MASK = 'linear-gradient(to top, #000 20%, rgba(0,0,0,0.6) 55%, transparent 96%)';

// Escala-base de cada demonstração (as baixas crescem, a do CRM é alta). O ajuste ainda reduz o que não couber na tela.
const ZOOM: Record<string, number> = { 'crm-com-ia': 1, 'agentes-ia': 1.2, 'ecommerce-marketplace': 1.05, fiscal: 1.1, piloto: 1.1 };

/** Desktop: escala a demonstração para a escala-base, mas nunca além do que cabe na altura da tela fixa. */
function FitPreview({ base, children }: { base: number; children: ReactNode }) {
  const inner = useRef<HTMLDivElement>(null);
  const [h, setH] = useState(0);
  const [vh, setVh] = useState(900);
  useEffect(() => {
    const el = inner.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setH(el.offsetHeight));
    ro.observe(el);
    setH(el.offsetHeight);
    const onResize = () => setVh(window.innerHeight);
    onResize();
    window.addEventListener('resize', onResize);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', onResize);
    };
  }, []);
  const avail = vh - 76 - 24; // topo sob o header e respiro
  const scale = h > 0 ? Math.min(base, avail / h) : base;
  return (
    <div style={{ height: h > 0 ? h * scale : undefined }}>
      <div ref={inner} style={{ width: `${100 / scale}%`, transform: `scale(${scale})`, transformOrigin: 'top left' }}>
        {children}
      </div>
    </div>
  );
}

/**
 * Índice editorial das aplicações, fixo e conduzido pelo scroll em qualquer tela (mesmo padrão do hero):
 * uma aplicação por vez, em um acordeão (a ativa abre) com a demonstração ao lado no desktop e, no celular,
 * escalada para a altura que sobra.
 */
export function ServicesSection() {
  const ref = useRef<HTMLElement>(null);
  const [wide, setWide] = useState(false);
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  useMotionValueEvent(scrollYProgress, 'change', (v) => setActive(Math.min(COUNT - 1, Math.max(0, Math.floor(v * COUNT)))));
  useEffect(() => {
    const q = window.matchMedia('(min-width: 1280px)');
    const update = () => setWide(q.matches);
    update();
    q.addEventListener('change', update);
    return () => q.removeEventListener('change', update);
  }, []);

  const goTo = (i: number) => {
    setActive(i);
    const el = ref.current;
    if (el) {
      const total = el.offsetHeight - window.innerHeight;
      window.scrollTo({ top: el.offsetTop + total * ((i + 0.5) / COUNT), behavior: 'smooth' });
    }
  };

  const app = applications[active];
  const Preview = mocks[app.slug] ?? PilotMock;
  const linkClass =
    'group inline-flex min-h-11 items-center gap-1.5 rounded-sm text-sm font-semibold text-brand hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background';

  return (
    <section
      ref={ref}
      id="aplicacoes"
      aria-labelledby="aplicacoes-title"
      className="relative z-10 h-[360vh] w-full bg-background"
    >
      <div className="sticky top-0 flex h-[100svh] flex-col overflow-hidden pb-4 pt-[72px] xl:justify-center xl:pb-6 xl:pt-[76px]">
        {/* desktop: laje à direita, sangrando até a borda da tela */}
        <div aria-hidden="true" className="absolute inset-y-0 right-0 hidden w-[46%] overflow-hidden border-l border-dashed border-border bg-muted/60 xl:block">
          <div className="absolute inset-0 opacity-80" style={{ WebkitMaskImage: SLAB_MASK, maskImage: SLAB_MASK }}>
            <HeroBands />
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

            {/* desktop: lista com a aplicação ativa aberta */}
            <ol className="mt-4 border-t border-border xl:mt-8" aria-label="Aplicações">
              {applications.map((a, i) => {
                const on = i === active;
                return (
                  <li key={a.slug} className="border-b border-border">
                    <button
                      type="button"
                      aria-expanded={on}
                      onClick={() => goTo(i)}
                      className="flex min-h-11 w-full items-baseline gap-4 py-2.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand xl:min-h-12 xl:gap-5 xl:py-3"
                    >
                      <span className={`w-6 shrink-0 text-sm font-semibold tabular-nums ${on ? 'text-brand' : 'text-foreground/35'}`}>{String(i + 1).padStart(2, '0')}</span>
                      <span className={`text-lg font-semibold leading-snug tracking-tight xl:text-2xl ${on ? 'text-foreground' : 'text-foreground/45'}`}>{a.title}</span>
                    </button>
                    {on && (
                      <div className="pb-3 pl-10 xl:pb-6 xl:pl-11">
                        <p className="text-sm font-medium xl:text-base">{a.forWho}</p>
                        <p className="mt-2 hidden max-w-xl text-[15px] leading-relaxed text-foreground/70 xl:block">{a.delivers}</p>
                        <Link href={a.href} className={`${linkClass} mt-1 xl:mt-4`}>
                          {a.ctaText}
                          <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                        </Link>
                      </div>
                    )}
                  </li>
                );
              })}
            </ol>
            <p className="mt-4 hidden text-sm text-foreground/55 xl:block">Cinco frentes em que já desenhamos e entregamos. O escopo final é definido em conversa.</p>

          </div>

          {wide ? (
            <div className="relative xl:col-span-6 xl:pl-14" aria-live="polite">
              <div key={app.slug} className={`overflow-hidden rounded-lg ${app.slug === 'ecommerce-marketplace' ? 'xl:-ml-10 xl:-mr-10' : ''}`}>
                <FitPreview base={ZOOM[app.slug] ?? 1}>
                  <Preview />
                </FitPreview>
              </div>
            </div>
          ) : (
            <FitBox className="mt-1">
              <div key={app.slug} className="overflow-hidden rounded-lg">
                <Preview />
              </div>
            </FitBox>
          )}
        </div>
      </div>
    </section>
  );
}
