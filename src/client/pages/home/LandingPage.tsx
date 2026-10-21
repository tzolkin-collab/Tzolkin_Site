'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useMotionValueEvent, useScroll } from 'framer-motion';
import Link from 'next/link';
import { LogoMarquee } from '@/client/shared/ui/LogoMarquee';
import { Header } from '@/client/shared/ui/Header';
import { projects } from '@/client/shared/data/projects';
import { brands } from '@/client/shared/data/brands';

import { PortfolioCarousel } from '@/client/shared/ui/PortfolioCarousel';
import { MajorPartnerships } from '@/client/shared/ui/MajorPartnerships';
import { ServicesSection } from '@/client/shared/ui/ServicesSection';
import { EcommerceSection } from '@/client/shared/ui/apps/EcommerceSection';
import { MethodTOISection } from '@/client/shared/ui/MethodTOISection';
import { BrandsSection } from '@/client/shared/ui/BrandsSection';
import { FounderSection } from '@/client/shared/ui/FounderSection';
import { PricingSection } from '@/client/shared/ui/PricingSection';
import { SectionHeader } from '@/client/shared/ui/SectionHeader';
import { HeroBackground } from '@/client/shared/ui/hero/HeroBackground';
import { HeroMockups } from '@/client/shared/ui/hero/HeroMockups';
import { FinalCta } from '@/client/shared/ui/FinalCta';
import { Footer } from '@/client/shared/ui/Footer';

export function LandingPage() {
  const { regularProjects, partnershipProjects } = useMemo(() => {
    const groups = new Map<string, typeof projects>();
    projects.forEach(p => {
      const category = p.category || 'case';
      if (!groups.has(category)) groups.set(category, []);
      groups.get(category)!.push(p);
    });
    return {
      regularProjects: groups.get('case') || [],
      partnershipProjects: groups.get('partnership') || [],
    };
  }, []);

  // No desktop o hero fica fixo e o scroll percorre as 3 etapas antes de seguir a página.
  const heroRef = useRef<HTMLElement>(null);
  const [pinned, setPinned] = useState(false);
  const [heroStep, setHeroStep] = useState(0);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end end'] });
  useMotionValueEvent(scrollYProgress, 'change', (v) => setHeroStep(Math.min(2, Math.floor(v * 3))));
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

          <HeroMockups step={pinned ? heroStep : undefined} />
        </div>
      </div>
      </section>

      {/* Clientes */}
      <section aria-label="Clientes" className="border-y border-border bg-muted/80 dark:bg-white/[0.04] py-8">
        <p className="px-6 text-center text-sm text-muted-foreground">Empresas que já construíram com a TZOLKIN</p>
        <LogoMarquee items={brands} speed={0.8} />
      </section>

      {/* Aplicações */}
      <ServicesSection />
      <EcommerceSection />

      {/* Como construímos */}
      <MethodTOISection />

      {/* Cases */}
      <section id="cases" aria-labelledby="cases-title" className="bg-background pb-16 pt-16 md:pb-20 md:pt-24">
        <div className="mx-auto max-w-[1200px] px-6 md:px-12">
          <SectionHeader id="cases-title" eyebrow="Cases" title="Projetos em que" muted="já atuamos." />
          <div className="mt-10 md:mt-12">
            <PortfolioCarousel projects={regularProjects} />
          </div>
        </div>
      </section>

      {/* Parcerias */}
      <MajorPartnerships partnerships={partnershipProjects} />

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
