'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useMotionValueEvent, useScroll } from 'framer-motion';
import Link from 'next/link';
import { Header } from '@/client/shared/ui/Header';
import { projects } from '@/client/shared/data/projects';

import { PortfolioCarousel } from '@/client/shared/ui/PortfolioCarousel';
import { ServicesSection } from '@/client/shared/ui/ServicesSection';
import { EcommerceSection } from '@/client/shared/ui/apps/EcommerceSection';
import { MethodTOISection } from '@/client/shared/ui/MethodTOISection';
import { BrandsSection } from '@/client/shared/ui/BrandsSection';
import { FounderSection } from '@/client/shared/ui/FounderSection';
import { PricingSection } from '@/client/shared/ui/PricingSection';
import { SectionHeader } from '@/client/shared/ui/SectionHeader';
import { HeroBackground } from '@/client/shared/ui/hero/HeroBackground';
import { HeroMockups } from '@/client/shared/ui/hero/HeroMockups';
import { HeroBands } from '@/client/shared/ui/hero/HeroBackground';
import { FitBox } from '@/client/shared/ui/apps/FitBox';
import { FinalCta } from '@/client/shared/ui/FinalCta';
import { Footer } from '@/client/shared/ui/Footer';

export function LandingPage() {
  // Cases e parcerias numa só lista: os cases primeiro, depois as parcerias.
  const allProjects = useMemo(
    () => [...projects.filter((p) => (p.category || 'case') === 'case'), ...projects.filter((p) => p.category === 'partnership')],
    [],
  );

  // O hero fica fixo e o scroll percorre as 3 etapas em qualquer tela. No desktop a seção inteira fixa;
  // no celular o texto rola normalmente e só o aparelho fica fixo (bloco logo abaixo do texto).
  const heroRef = useRef<HTMLElement>(null);
  const mobileRef = useRef<HTMLDivElement>(null);
  const [pinned, setPinned] = useState(false);
  const [heroStep, setHeroStep] = useState(0);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end end'] });
  const { scrollYProgress: mobileProgress } = useScroll({ target: mobileRef, offset: ['start start', 'end end'] });
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    if (pinned) setHeroStep(Math.min(2, Math.floor(v * 3)));
  });
  useMotionValueEvent(mobileProgress, 'change', (v) => {
    if (!pinned) setHeroStep(Math.min(2, Math.max(0, Math.floor(v * 3))));
  });
  useEffect(() => {
    const query = window.matchMedia('(min-width: 1024px)');
    const update = () => setPinned(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  return (
    <div className="min-h-screen w-full overflow-x-clip flex flex-col font-sans">
      <Header />

      {/* ── Hero ── */}
      <section ref={heroRef} data-hero-pin className="relative bg-background lg:h-[280vh]">
      <div className="relative overflow-clip px-6 pb-16 pt-32 md:px-12 md:pb-24 md:pt-40 lg:sticky lg:top-0 lg:flex lg:h-screen lg:items-center lg:pb-10 lg:pt-24">
        <HeroBackground />
        <div className="relative mx-auto grid w-full w-full max-w-[1200px] grid-cols-[minmax(0,1fr)] items-center gap-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-10">
          <div>
            <p className="mb-6 inline-flex items-center rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
              Software house · Produtos digitais e IA
            </p>
            <h1 className="text-[2.5rem] font-semibold leading-[1.04] tracking-[-0.03em] text-foreground sm:text-6xl lg:text-[4.25rem]">
              Desenhamos, criamos e evoluímos produtos digitais.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-foreground/75 md:text-xl">
              Da primeira jornada à evolução de um piloto, desenvolvemos software para sua empresa vender, atender e operar. CRMs, agentes de IA, lojas e marketplaces, com integrações e uma base preparada para a próxima etapa.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
              <Link
                href="/forms"
                className="inline-flex h-12 items-center rounded-full bg-brand px-7 text-sm font-semibold text-brand-foreground transition-colors hover:bg-brand/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                Conversar sobre meu projeto
              </Link>
              <a href="#aplicacoes" className="text-sm font-semibold text-foreground hover:text-brand">
                Ver aplicações <span aria-hidden="true">→</span>
              </a>
            </div>
            <p className="mt-6 max-w-md text-sm text-muted-foreground">
              Suítes de dois meses, conforme o escopo. O valor é apresentado na proposta.
            </p>
          </div>

          <div className="hidden lg:block">
            <HeroMockups step={heroStep} />
          </div>
        </div>
      </div>

      {/* celular: o aparelho fica fixo e o scroll conduz as etapas */}
      <div ref={mobileRef} className="relative h-[260svh] lg:hidden">
        <div className="sticky top-0 flex h-[100svh] flex-col overflow-hidden px-6 pb-6 pt-[72px]">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-[72%]"
            style={{ WebkitMaskImage: 'linear-gradient(to top, #000 22%, rgba(0,0,0,0.6) 55%, transparent 96%)', maskImage: 'linear-gradient(to top, #000 22%, rgba(0,0,0,0.6) 55%, transparent 96%)' }}
          >
            <HeroBands />
          </div>
          <FitBox className="relative z-10">
            <HeroMockups step={heroStep} />
          </FitBox>
        </div>
      </div>
      </section>

      {/* Cases (inclui as parcerias) */}
      <section id="cases" aria-labelledby="cases-title" className="overflow-x-clip bg-background pb-16 pt-16 md:pb-20 md:pt-24">
        <div className="mx-auto max-w-[1200px] px-6 md:px-12">
          <SectionHeader id="cases-title" eyebrow="Cases" title="Projetos em que" muted="já atuamos." />
          <div className="mt-10 md:mt-12">
            <PortfolioCarousel projects={allProjects} />
          </div>
        </div>
      </section>

      {/* Aplicações */}
      <ServicesSection />

      {/* Como construímos */}
      <MethodTOISection />

      {/* E-commerce */}
      <EcommerceSection />

      {/* Como contratar */}
      <PricingSection />

      {/* Integrações */}
      <BrandsSection />

      {/* Quem somos */}
      <FounderSection />

      <FinalCta />

      <Footer />
    </div>
  );
}
