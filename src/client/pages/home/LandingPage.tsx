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

const MARQUEE_ITEMS = [
  "Landing Pages de Alta Conversão",
  "Tracking Server-Side Anti-Perda",
  "Lojas Next.js Ultra-Rápidas",
  "APIs e Automação de Processos",
  "Software Sob Medida",
  "Landing Pages de Alta Conversão",
  "Tracking Server-Side Anti-Perda",
  "Lojas Next.js Ultra-Rápidas",
  "APIs e Automação de Processos",
  "Software Sob Medida"
];

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
            <h1 aria-label="Software feito para vender, medir e operar." className="text-[12vw] leading-[0.85] font-bold tracking-tight text-foreground/90 uppercase mix-blend-normal animate-[slideUp_0.6s_var(--ease-sophisticated)_forwards]">
              Software
            </h1>
          </div>
          <div aria-hidden="true" className="overflow-hidden flex items-baseline gap-[2vw]">
            <span className="text-[3.5vw] md:text-[2.5vw] font-semibold tracking-[0.2em] text-muted-foreground uppercase animate-[slideUp_0.6s_var(--ease-sophisticated)_0.08s_forwards] opacity-0">
              feito para
            </span>
            <p className="text-[12vw] leading-[0.85] font-bold tracking-tight text-foreground uppercase mix-blend-normal animate-[slideUp_0.6s_var(--ease-sophisticated)_0.08s_forwards] opacity-0">
              Vender.
            </p>
          </div>

          <div className="mt-12 md:mt-18 flex flex-col md:flex-row justify-between items-start md:items-end gap-8 animate-[fadeIn_0.6s_var(--ease-sophisticated)_0.3s_forwards] opacity-0">
            <p className="max-w-xl text-lg md:text-xl text-foreground leading-relaxed">
              Se o seu site é lento, o tracking marca metade das vendas e seu time perde horas copiando dados na mão, você está queimando margem de lucro. A TZOLKIN estrutura a tecnologia que o seu comercial precisa para parar de perder clientes e escalar com controle.
            </p>

            <div className="flex flex-col items-start md:items-end gap-3">
              <Link href="/forms" className="block">
                <Button
                  variant="brand"
                  size="lg"
                  className="px-12 shadow-xl hover:scale-105 transition-transform"
                >
                  Destravar meu gargalo operacional
                </Button>
              </Link>
              <p className="text-sm text-muted-foreground max-w-xs md:text-right">
                Entregas com escopo fechado, prazo garantido e preços transparentes. Sem reuniões enroladas para saber quanto custa.
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
      <section id="cases" className="bg-background relative overflow-hidden pt-15 md:py-24">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 mb-12 animate-[fadeIn_0.6s_var(--ease-sophisticated)_0.3s_forwards] opacity-0">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground uppercase max-w-3xl">
            Quem confia na nossa estrutura para <span className="text-brand">vender todos os dias</span>
          </h2>
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
