'use client';

import { useEffect, useRef, useState, type JSX, type ReactNode } from 'react';
import Link from 'next/link';
import { useMotionValueEvent, useScroll } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { applications } from '@/client/shared/data/homeData';
import { SectionHeader } from '@/client/shared/ui/SectionHeader';
import { ChatMock, FunnelMock, InvoiceMock, PilotMock } from '@/client/shared/ui/apps/AppMockups';
import { EcommerceDevices } from '@/client/shared/ui/apps/EcommerceDevices';
import { HeroBands } from '@/client/shared/ui/hero/HeroBackground';

const mocks: Record<string, () => JSX.Element> = {
  'crm-com-ia': FunnelMock,
  'agentes-ia': ChatMock,
  'ecommerce-marketplace': () => (
    <div className="bg-muted/40 p-4 md:p-6">
      <EcommerceDevices step={0} />
    </div>
  ),
  fiscal: InvoiceMock,
  piloto: PilotMock,
};

const COUNT = applications.length;

// As faixas do hero reaparecem no canto inferior direito da laje e se dissolvem rumo ao texto.
const SLAB_MASK = 'linear-gradient(to top left, #000 0%, rgba(0,0,0,0.55) 38%, transparent 72%)';

// Escala-base de cada demonstração (as baixas crescem, a do CRM é alta). FitPreview ainda reduz o que não couber na tela.
const ZOOM: Record<string, number> = { 'crm-com-ia': 1, 'agentes-ia': 1.2, 'ecommerce-marketplace': 1.05, fiscal: 1.1, piloto: 1.1 };

/** Escala a demonstração para a escala-base, mas nunca além do que cabe na altura da tela fixa. */
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
  const avail = vh - 76 - 24 - 84; // topo sob o header, respiro, linha de fatos
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
 * Índice editorial das aplicações. No desktop a seção fica fixa e o scroll percorre uma aplicação por vez
 * (mesmo padrão do hero); abaixo de xl vira uma lista em que a aplicação aberta mostra a própria demonstração.
 */
export function ServicesSection() {
  const ref = useRef<HTMLElement>(null);
  const [pinned, setPinned] = useState(false);
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    if (pinned) setActive(Math.min(COUNT - 1, Math.max(0, Math.floor(v * COUNT))));
  });
  useEffect(() => {
    const q = window.matchMedia('(min-width: 1280px)');
    const update = () => setPinned(q.matches);
    update();
    q.addEventListener('change', update);
    return () => q.removeEventListener('change', update);
  }, []);

  const goTo = (i: number) => {
    setActive(i);
    const el = ref.current;
    if (pinned && el) {
      const total = el.offsetHeight - window.innerHeight;
      window.scrollTo({ top: el.offsetTop + total * ((i + 0.5) / COUNT), behavior: 'smooth' });
    }
  };

  const Preview = mocks[applications[active].slug] ?? PilotMock;

  return (
    <section
      ref={ref}
      id="aplicacoes"
      aria-labelledby="aplicacoes-title"
      className="relative z-10 w-full bg-background xl:h-[360vh]"
    >
      <div className="relative overflow-hidden py-16 md:py-24 xl:sticky xl:top-0 xl:flex xl:h-screen xl:items-center xl:pb-6 xl:pt-[76px]">
        {/* laje à direita: a demonstração fica sobre ela, sangrando até a borda da tela */}
        <div aria-hidden="true" className="absolute inset-y-0 right-0 hidden w-[46%] overflow-hidden border-l border-dashed border-border bg-muted/60 xl:block">
          <div className="absolute inset-0 opacity-80" style={{ WebkitMaskImage: SLAB_MASK, maskImage: SLAB_MASK }}>
            <HeroBands />
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[1200px] px-6 md:px-12">
          <div className="grid gap-10 xl:grid-cols-12 xl:items-center xl:gap-0">
            <div className="xl:col-span-6 xl:pr-16">
              <SectionHeader
                id="aplicacoes-title"
                eyebrow="Aplicações"
                title="Software para vender,"
                muted="atender e operar."
              />

              <ol className="mt-8 border-t border-border" aria-label="Aplicações">
                {applications.map((app, i) => {
                  const on = i === active;
                  const Mock = mocks[app.slug] ?? PilotMock;
                  return (
                    <li key={app.slug} className="border-b border-border">
                      <button
                        type="button"
                        aria-expanded={on}
                        onClick={() => goTo(i)}
                        className="flex min-h-12 w-full items-baseline gap-5 py-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                      >
                        <span className={`w-6 shrink-0 text-sm font-semibold tabular-nums ${on ? 'text-brand' : 'text-foreground/35'}`}>
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <span className={`text-xl font-semibold tracking-tight md:text-2xl ${on ? 'text-foreground' : 'text-foreground/45'}`}>
                          {app.title}
                        </span>
                      </button>

                      {on && (
                        <div className="pb-6 pl-11">
                          <p className="text-base font-medium">{app.forWho}</p>
                          <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-foreground/70">{app.delivers}</p>
                          <Link
                            href={app.href}
                            className="group mt-4 inline-flex min-h-11 items-center gap-1.5 rounded-sm text-sm font-semibold text-brand hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                          >
                            {app.ctaText}
                            <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                          </Link>
                        </div>
                      )}
                      {on && !pinned && (
                        <div className="mb-6 overflow-hidden rounded-lg border border-border bg-card shadow-[0_24px_60px_-30px_rgba(10,20,40,0.35)]">
                          <Mock />
                        </div>
                      )}
                    </li>
                  );
                })}
              </ol>
              <p className="mt-4 text-sm text-foreground/55">Cinco frentes em que já desenhamos e entregamos. O escopo final é definido em conversa.</p>
            </div>

            {pinned && (
              <div className="relative xl:col-span-6 xl:pl-14" aria-live="polite">
                <div key={applications[active].slug} className="overflow-hidden rounded-lg border border-border bg-card shadow-[0_40px_80px_-40px_rgba(10,20,40,0.4)]">
                  <FitPreview base={ZOOM[applications[active].slug] ?? 1}>
                    <Preview />
                  </FitPreview>
                </div>
                <ul className="mt-5 grid grid-cols-3 divide-x divide-border overflow-hidden rounded-lg border border-border bg-card text-[13px] font-medium leading-snug shadow-[0_16px_40px_-24px_rgba(10,20,40,0.35)]" aria-label="O que a aplicação inclui">
                  {applications[active].chips.map((c) => (
                    <li key={c} className="px-4 py-3 text-foreground/80">{c}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
