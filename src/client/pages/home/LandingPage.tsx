'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { LogoMarquee } from '@/client/shared/ui/LogoMarquee';
import { Header } from '@/client/shared/ui/Header';
import { projects } from '@/client/shared/data/projects';
import { brands } from '@/client/shared/data/brands';

import { PortfolioCarousel } from '@/client/shared/ui/PortfolioCarousel';
import { MajorPartnerships } from '@/client/shared/ui/MajorPartnerships';
import { ServicesSection } from '@/client/shared/ui/ServicesSection';
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

  return (
    <div className="min-h-screen w-full overflow-x-clip flex flex-col font-sans">
      <Header />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-background px-6 pb-16 pt-32 md:px-12 md:pb-24 md:pt-40">
        <HeroBackground />
        <div className="relative mx-auto grid w-full max-w-[1200px] items-center gap-14 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
          <div>
            <p className="mb-6 inline-flex items-center rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
              Software house · Produtos digitais e IA
            </p>
            <h1 className="text-[2.5rem] font-semibold leading-[1.04] tracking-[-0.03em] text-foreground sm:text-6xl lg:text-[4.25rem]">
              Desenhamos, criamos e evoluímos produtos digitais.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground md:text-xl">
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

          <HeroMockups />
        </div>
      </section>

      {/* Clientes */}
      <section aria-label="Clientes" className="border-y border-border bg-background py-8">
        <p className="px-6 text-center text-sm text-muted-foreground">Empresas que já construíram com a TZOLKIN</p>
        <LogoMarquee items={brands} speed={0.8} />
      </section>

      {/* Aplicações */}
      <ServicesSection />

      {/* Como construímos */}
      <MethodTOISection />

      {/* Cases */}
      <section id="cases" aria-labelledby="cases-title" className="bg-background py-20 md:py-28">
        <div className="mx-auto max-w-[1200px] px-6 md:px-12">
          <SectionHeader id="cases-title" eyebrow="Cases" title="Projetos em que" muted="já atuamos." />
          <div className="mt-12">
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
