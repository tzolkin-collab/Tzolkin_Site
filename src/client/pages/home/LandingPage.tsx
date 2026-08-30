'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { Button } from '@/client/shared/ui/Button';
import { Marquee } from '@/client/shared/ui/Marquee';
import { LogoMarquee } from '@/client/shared/ui/LogoMarquee';
import { Header } from '@/client/shared/ui/Header';
import { ArrowRight } from 'lucide-react';
import { projects } from '@/client/shared/data/projects';
import { brands } from '@/client/shared/data/brands';

import { PortfolioCarousel } from '@/client/shared/ui/PortfolioCarousel';
import { MajorPartnerships } from '@/client/shared/ui/MajorPartnerships';
import { ServicesSection } from '@/client/shared/ui/ServicesSection';
import { BrandsSection } from '@/client/shared/ui/BrandsSection';
import { FounderSection } from '@/client/shared/ui/FounderSection';
import { PricingSection } from '@/client/shared/ui/PricingSection';
import { Footer } from '@/client/shared/ui/Footer';

const MARQUEE_ITEMS = ["Sites e Landing Pages", "E-commerce", "Tracking de Funil", "Integrações", "Software sob Medida", "Sites e Landing Pages", "E-commerce", "Tracking de Funil", "Integrações", "Software sob Medida"];

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

      {/* ── A — ATENÇÃO: Hero ── */}
      <section className="flex-1 flex flex-col justify-center px-6 md:px-12 pt-32 pb-20 relative overflow-hidden bg-background">
        <div className="max-w-[1400px] mx-auto w-full">
          <div className="overflow-hidden">
            <h1 aria-label="Software para vender, medir e operar." className="text-[12vw] leading-[0.85] font-bold tracking-tight text-foreground/90 uppercase mix-blend-normal animate-[slideUp_0.6s_var(--ease-sophisticated)_forwards]">
              Software
            </h1>
          </div>
          <div aria-hidden="true" className="overflow-hidden flex items-baseline gap-[2vw]">
            <span className="text-[3.5vw] md:text-[2.5vw] font-semibold tracking-[0.25em] text-muted-foreground uppercase animate-[slideUp_0.6s_var(--ease-sophisticated)_0.08s_forwards] opacity-0">
              para
            </span>
            <p className="text-[12vw] leading-[0.85] font-bold tracking-tight text-foreground uppercase mix-blend-normal animate-[slideUp_0.6s_var(--ease-sophisticated)_0.08s_forwards] opacity-0">
              Vender.
            </p>
          </div>

          <div className="mt-12 md:mt-18 flex flex-col md:flex-row justify-between items-start md:items-end gap-8 animate-[fadeIn_0.6s_var(--ease-sophisticated)_0.3s_forwards] opacity-0">
            <p className="max-w-md text-lg md:text-xl text-foreground leading-relaxed">
              Sites e lojas para apresentar sua oferta. Tracking de funil para entender o caminho até a venda.
              Software sob medida para conectar sua operação. Comece pelo que sua empresa precisa resolver agora.
            </p>

            <div className="flex flex-col items-start md:items-end gap-3">
              <Link href="/#products">
                <Button variant="primary" size="lg" className="px-8 hover:scale-105 group">
                  Encontrar minha solução
                  <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <p className="text-sm text-muted-foreground max-w-xs md:text-right">
                Compare as entregas. Projetos sob medida têm escopo e orçamento próprios.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Marquee — produtos Pontual */}
      <Marquee items={MARQUEE_ITEMS} speed={2} />

      {/* ── I — INTERESSE: O que cada entrega inclui ── */}
      <ServicesSection />

      {/* ── D — DESEJO: Prova social ── */}

      {/* Cases */}
      <section id="cases" className="bg-background relative overflow-hidden py-16 md:py-24">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 mb-12 animate-[fadeIn_0.6s_var(--ease-sophisticated)_0.3s_forwards] opacity-0">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground uppercase">Cases</h2>
        </div>
        <div className="max-w-full relative z-10">
          <PortfolioCarousel projects={regularProjects} />
        </div>
      </section>

      {/* Parcerias */}
      <MajorPartnerships partnerships={partnershipProjects} />

      {/* ── D — DESEJO: Oferta tangível ── */}
      <PricingSection />

      {/* ── D — DESEJO: Confiança técnica ── */}
      <BrandsSection />

      {/* ── D — DESEJO: Humanização ── */}
      <FounderSection />

      {/* Logo Marquee Separator */}
      <LogoMarquee items={brands || []} speed={0.8} />

      <Footer />
    </div>
  );
}
