'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { Button } from '@/client/shared/ui/Button';
import { Marquee } from '@/client/shared/ui/Marquee';
import { LogoMarquee } from '@/client/shared/ui/LogoMarquee';
import { Header } from '@/client/shared/ui/Header';
import { projects } from '@/client/shared/data/projects';
import { brands } from '@/client/shared/data/brands';
import { applications } from '@/client/shared/data/homeData';

import { PortfolioCarousel } from '@/client/shared/ui/PortfolioCarousel';
import { MajorPartnerships } from '@/client/shared/ui/MajorPartnerships';
import { ServicesSection } from '@/client/shared/ui/ServicesSection';
import { MethodTOISection } from '@/client/shared/ui/MethodTOISection';
import { BrandsSection } from '@/client/shared/ui/BrandsSection';
import { FounderSection } from '@/client/shared/ui/FounderSection';
import { PricingSection } from '@/client/shared/ui/PricingSection';
import { Footer } from '@/client/shared/ui/Footer';

// Faixa de aplicações (substitui o marquee antigo de serviços).
const MARQUEE_ITEMS = [
  ...applications.map((a) => a.title),
  ...applications.map((a) => a.title),
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

      {/* ── Hero ── */}
      <section className="flex-1 flex flex-col justify-center px-6 md:px-12 pt-32 pb-20 relative overflow-hidden bg-background">
        <div className="max-w-[1400px] mx-auto w-full">
          <p className="text-sm md:text-base font-semibold tracking-[0.2em] text-muted-foreground uppercase mb-6 animate-[fadeIn_0.6s_var(--ease-sophisticated)_forwards]">
            Software house · Produtos digitais e IA
          </p>

          <h1 className="max-w-6xl text-[11vw] sm:text-6xl md:text-7xl lg:text-8xl leading-[1.02] font-bold tracking-tight text-foreground uppercase animate-[slideUp_0.6s_var(--ease-sophisticated)_forwards]">
            Desenhamos, criamos e <span className="text-brand">evoluímos</span> produtos digitais.
          </h1>

          <div className="mt-12 md:mt-16 flex flex-col md:flex-row justify-between items-start md:items-end gap-8 animate-[fadeIn_0.6s_var(--ease-sophisticated)_0.3s_forwards] opacity-0">
            <p className="max-w-2xl text-lg md:text-xl text-foreground leading-relaxed">
              Da primeira jornada à evolução de um piloto, desenvolvemos software para sua empresa vender, atender e operar. CRMs, agentes de IA, lojas e marketplaces, com integrações e uma base preparada para a próxima etapa.
            </p>

            <div className="flex flex-col items-start md:items-end gap-3">
              <Link href="/forms" className="block">
                <Button
                  variant="brand"
                  size="lg"
                  className="px-12 shadow-xl hover:scale-105 transition-transform"
                >
                  Conversar sobre meu projeto
                </Button>
              </Link>
              <p className="text-sm text-muted-foreground max-w-xs md:text-right">
                Suítes de dois meses, conforme o escopo. O valor é apresentado na proposta, com infraestrutura e serviços externos discriminados.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Faixa de aplicações */}
      <Marquee items={MARQUEE_ITEMS} speed={2} />

      {/* Prova social logo abaixo do hero: clientes */}
      <section aria-label="Clientes" className="bg-background">
        <p className="text-center text-xs md:text-sm font-semibold tracking-[0.2em] text-muted-foreground uppercase pt-10 pb-2">
          Empresas que já construíram com a TZOLKIN
        </p>
        <LogoMarquee items={brands} speed={0.8} />
      </section>

      {/* Aplicações */}
      <ServicesSection />

      {/* Como construímos */}
      <MethodTOISection />

      {/* Cases */}
      <section id="cases" aria-labelledby="cases-title" className="bg-background relative overflow-hidden pt-15 md:py-24">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 mb-12 animate-[fadeIn_0.6s_var(--ease-sophisticated)_0.3s_forwards] opacity-0">
          <h2 id="cases-title" className="text-3xl md:text-5xl font-bold tracking-tight text-foreground uppercase max-w-3xl">
            Projetos em que <span className="text-brand">já atuamos</span>
          </h2>
        </div>
        <div className="max-w-full relative z-10">
          <PortfolioCarousel projects={regularProjects} />
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

      <Footer />
    </div>
  );
}
