import React from 'react';
import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { servicesData } from '@/client/shared/data/servicesData';
import { ServiceGithub } from '@/client/shared/ui/ServiceGithub';
import { MermaidDiagram } from '@/client/shared/ui/MermaidDiagram';
import { PrismBackground } from '@/client/shared/ui/PrismBackground';
import CardSwap, { Card } from '@/client/shared/ui/CardSwap';
import { Marquee } from '@/client/shared/ui/Marquee';
import { Footer } from '@/client/shared/ui/Footer';
import { SpotlightCard } from '@/client/shared/ui/SpotlightCard';
import { ServiceChart } from '@/client/shared/ui/ServiceChart';
import { getChartPrimaryLabel } from '@/client/shared/ui/charts';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, BarChart3, GitBranch, Share2 } from 'lucide-react';

interface Params {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata(props: Params): Promise<Metadata> {
  const params = await props.params;

  // O card "Solução Personalizada" do pricing não possui página de serviço própria:
  // redireciona para o formulário de interesse em vez de retornar 404.
  if (params.slug === 'solucao-personalizada') {
    redirect('/forms?interesse=personalizado');
  }

  const service = servicesData[params.slug];

  if (!service) {
    notFound();
  }

  return {
    title: service.title,
    description: service.description,
  };
}

export async function generateStaticParams() {
  return Object.keys(servicesData).map((slug) => ({
    slug,
  }));
}

export default async function ServicePage(props: Params) {
  const params = await props.params;

  // O card "Solução Personalizada" do pricing não possui página de serviço própria:
  // redireciona para o formulário de interesse em vez de retornar 404.
  if (params.slug === 'solucao-personalizada') {
    redirect('/forms?interesse=personalizado');
  }

  const service = servicesData[params.slug];

  if (!service) {
    notFound();
  }

  return (
    <>
      <main className="min-h-screen bg-background overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative pt-15 pb-20 overflow-hidden border-b border-border/50 min-h-[500px]">
        {/* Animated Backgrounds */}
        <PrismBackground className="opacity-100" colors={['var(--brand)', 'var(--brand)', 'var(--brand)']} />



        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <Link href="/servicos" className="inline-flex items-center gap-2 text-sm font-medium text-foreground hover:text-brand transition-colors mb-6">
            <ChevronLeft className="w-4 h-4" />
            Voltar para serviços
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="max-w-2xl">
              <div className="inline-flex  items-center gap-2 px-3 py-1 rounded-full border border-border bg-foreground mb-6 text-xs font-bold tracking-widest uppercase text-background">
                {service.subtitle}
              </div>
              <h1 className="text-4xl md:text-6xl font-black tracking-tight text-foreground mb-6 leading-tight">
                {service.title}
              </h1>
              <p className="text-lg md:text-xl text-foreground leading-relaxed">
                {service.description}
              </p>
            </div>

            <div className="relative w-full h-[400px] hidden lg:block">
              <CardSwap>
                <Card className="bg-brand/20 border-brand/40" />
                <Card className="bg-brand/40 border-brand/50" />
                <Card className="bg-brand border-brand" />
              </CardSwap>
            </div>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 group/spotlight lg:pr-[30%]">
            {service.heroMetrics.map((metric, idx) => (
              <SpotlightCard key={idx} className="p-6 md:p-8 rounded-3xl border border-border/50 bg-card" spotlightColor="rgba(64, 187, 33, 0.15)">
                <p className="text-sm font-bold tracking-widest uppercase text-foreground mb-2">{metric.label}</p>
                <div className="flex items-end gap-3">
                  <span className="text-3xl md:text-4xl font-black text-foreground">{metric.value}</span>
                  {metric.trend && (
                    <span className={`text-sm font-bold mb-1 ${metric.trendUp ? 'text-green-500' : 'text-red-500'}`}>
                      {metric.trend}
                    </span>
                  )}
                </div>
              </SpotlightCard>
            ))}
          </div>
        </div>
      </section>
      {/* Marquee como quebra de seção */}
      <Marquee items={[...(service.marqueeItems || ['Performance', 'ROI', 'Autoridade', 'Conversão', 'Marca', 'Faturamento']), ...(service.marqueeItems || ['Performance', 'ROI', 'Autoridade', 'Conversão', 'Marca', 'Faturamento'])]} speed={1.5} />
      {/* Analytics & Architecture — só renderiza se NÃO houver contentSections (evita duplicação) */}
      {!service.contentSections?.length && (
        <section className="py-24">
          <div className="container mx-auto px-6 md:px-12">

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 mb-32 items-center">
              {/* Chart Area */}
              <div className="order-2 lg:order-1 relative rounded-3xl border border-border/50 bg-white/5 dark:bg-neutral-900/30 p-6 md:p-10">
                <div className="flex items-center gap-3 mb-8 pb-6 border-b border-border/50">
                  <div className="w-10 h-10 rounded-full bg-brand/10 flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-brand" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground">Motor de performance</h3>
                    <p className="text-sm text-foreground">Métricas simuladas de operação</p>
                  </div>
                </div>
                <div className="h-[350px]">
                  <ServiceChart data={service.chartData} config={service.chartConfig} />
                </div>
              </div>

              {/* Description Area */}
              <div className="order-1 lg:order-2">
                <h2 className="text-3xl md:text-4xl font-black mb-6 tracking-tight">Decisões guiadas por dados.</h2>
                <p className="text-lg text-foreground leading-relaxed mb-8">
                  Visualização clara do impacto na sua operação. Nenhuma arquitetura é definida por instinto: usamos observabilidade e telemetria profunda para comprovar resultados.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 mb-32 items-center">
              {/* Description Area */}
              <div>
                <h2 className="text-3xl md:text-4xl font-black mb-6 tracking-tight">Arquitetura do ecossistema</h2>
                <p className="text-lg text-foreground leading-relaxed mb-8">
                  A estruturação do seu projeto segue padrões rigorosos de engenharia de software e DevOps. O fluxo abaixo ilustra o comportamento do ecossistema proposto.
                </p>
              </div>

              {/* Diagram Area */}
              <div className="relative rounded-3xl border border-border/50 bg-white/5 dark:bg-neutral-900/30 p-6 md:p-10 flex flex-col justify-center min-h-[400px]">
                <div className="flex items-center gap-3 mb-8 absolute top-8 left-8">
                  <div className="w-10 h-10 rounded-full bg-brand/10 flex items-center justify-center">
                    <Share2 className="w-5 h-5 text-brand" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground">Topologia</h3>
                  </div>
                </div>
                <div className="mt-16 w-full h-full flex items-center justify-center">
                  <MermaidDiagram chart={service.mermaidString} />
                </div>
              </div>
            </div>

          </div>
        </section>
      )}

      {/* Content Sections — design premium */}
      {service.contentSections && service.contentSections.map((section, idx) => {
        const isEven = idx % 2 === 0;
        const isLastSection = idx === (service.contentSections?.length || 0) - 1;
        const hasChart = !!section.chart;

        // Sessão final (dados de mercado) → grid de cards em bg invertido
        if (isLastSection && !hasChart) {
          return (
            <section key={idx} className="py-24 text-foreground relative overflow-hidden border-t border-border/50">
              <div className="container mx-auto px-6 md:px-12 relative z-10">
                <div className="max-w-3xl mx-auto text-center mb-16">
                  <div className="relative inline-block mb-6">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border bg-foreground/5">
                      <div className="w-2 h-2 rounded-full bg-brand animate-pulse" />
                      <span className="text-xs font-bold tracking-widest uppercase text-foreground/80">Dados reais de mercado</span>
                    </div>
                  </div>
                  <div>
                    <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
                      {section.headline}
                    </h2>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto group/spotlight">
                  {section.content.map((item, iIdx) => (
                    <SpotlightCard key={iIdx} className="group p-8 rounded-2xl border border-border bg-card hover:border-brand/40 transition-all duration-300" spotlightColor="rgba(161, 33, 187, 0.15)">
                      <div className="w-8 h-[3px] bg-brand mb-6 group-hover:w-12 transition-all duration-300" />
                      <p className="text-lg text-foreground font-medium leading-relaxed">{item}</p>
                    </SpotlightCard>
                  ))}
                </div>
              </div>
            </section>
          );
        }

        // Sessão sem gráfico → texto centralizado
        if (!hasChart) {
          return (
            <section key={idx} className={`py-20 relative overflow-hidden ${isEven ? 'bg-background' : 'bg-neutral-50 dark:bg-neutral-950/80 border-y border-border/20'}`}>
              <div className="container mx-auto px-6 md:px-12 relative z-10">
                <div className="max-w-3xl mx-auto text-center">
                  <div className="w-12 h-[3px] bg-foreground dark:bg-brand/90 mx-auto mb-10" />
                  <h2 className="text-3xl md:text-5xl font-black tracking-tight text-foreground mb-10 leading-tight">{section.headline}</h2>
                  {section.content.map((p, pIdx) => (
                    <p key={pIdx} className="text-lg md:text-xl text-foreground/60 leading-relaxed last:mb-0">{p}</p>
                  ))}
                  {section.copyAction && (
                    <div className="mt-14 relative">
                      <div className="bg-card border border-border rounded-2xl px-10 py-8 shadow-sm">
                        <p className="text-xl font-bold text-foreground leading-relaxed">&ldquo;{section.copyAction}&rdquo;</p>
                      </div>
                    </div>
                  )}
                  {idx === 1 && (
                    <div className="mt-10">
                      <Link href={`/forms?service=${encodeURIComponent(service.title)}`}>
                        <button className="h-14 px-10 rounded-full bg-foreground text-background hover:bg-brand hover:text-white text-sm font-bold uppercase tracking-wider transition-all duration-300 inline-flex items-center gap-3">
                          Falar com especialista
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </section>
          );
        }

        // Sessão COM gráfico → side-by-side alternando direção + carrossel como quebra
        return (
          <React.Fragment key={idx}>
            <section className={`py-20 relative overflow-hidden ${isEven ? 'bg-background' : 'bg-neutral-50 dark:bg-neutral-950/80 border-y border-border/20'}`}>
              <div className="container mx-auto px-6 md:px-12 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

                  {/* Texto */}
                  <div className={`${!isEven ? 'lg:order-2' : ''}`}>
                    <div className="w-12 h-[3px] bg-brand mb-8" />
                    <h2 className="text-3xl md:text-[2.75rem] font-black tracking-tight text-foreground mb-8 leading-[1.15]">
                      {section.headline}
                    </h2>
                    <div className="space-y-5">
                      {section.content.map((p, pIdx) => (
                        <p key={pIdx} className="text-lg text-foreground leading-relaxed">{p}</p>
                      ))}
                    </div>
                    {section.copyAction && (
                      <div className="mt-10 pl-6 border-l-[3px] border-brand">
                        <p className="text-lg font-semibold text-foreground leading-relaxed">
                          &ldquo;{section.copyAction}&rdquo;
                        </p>
                      </div>
                    )}
                    {idx === 1 && (
                      <div className="mt-10">
                        <Link href={`/forms?service=${encodeURIComponent(service.title)}`}>
                          <button className="h-12 px-8 rounded-full bg-brand text-white hover:opacity-90 text-sm font-bold uppercase tracking-wider transition-all duration-300 inline-flex items-center gap-3">
                            Iniciar projeto
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </Link>
                      </div>
                    )}
                  </div>

                  {/* Gráfico */}
                  <div className={`${!isEven ? 'lg:order-1' : ''}`}>
                    <div className="rounded-3xl border border-border bg-card p-8 px-2 md:p-10 shadow-sm">
                      <div className="flex items-center gap-3 mb-8 pb-5 border-b border-border/30">
                        <div className="w-9 h-9 rounded-full bg-brand/10 flex items-center justify-center">
                          <BarChart3 className="w-4 h-4 text-brand" />
                        </div>
                        <p className="text-sm font-bold tracking-wide text-foreground/70">
                          {getChartPrimaryLabel(section.chart!.config)}
                        </p>
                      </div>
                      <div className="h-[320px] pt-10">
                        <ServiceChart data={section.chart!.data} config={section.chart!.config} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

          </React.Fragment>
        );
      })}

      {/* CTA Standalone */}
      {service.contentSections && service.contentSections.length > 0 && (
        <section className="py-20 bg-brand relative overflow-hidden">
          <div className="container mx-auto px-6 md:px-12 relative z-10 text-center">
            <h2 className="text-3xl md:text-5xl font-black text-white dark:text-white tracking-tight mb-6 leading-tight">Pronto para escalar?</h2>
            <p className="text-lg text-white/90 dark:text-white font-medium max-w-2xl mx-auto mb-10">Sua operação merece uma infraestrutura de software que sustenta escala — sem retrabalho e sem improviso.</p>
            <Link href={`/forms?service=${encodeURIComponent(service.title)}`}>
              <button className="h-16 px-12 rounded-full bg-black text-white hover:bg-neutral-900 text-lg font-bold uppercase tracking-wider transition-all inline-flex items-center gap-3">
                Quero escalar meu faturamento
                <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
          </div>
        </section>
      )}

      {/* Github Integrations CTA */}
      <section className="py-24 bg-foreground relative overflow-hidden">
        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
            <div className="col-span-1 lg:col-span-5 flex flex-col justify-center">
              <div className="w-12 h-12 rounded-full bg-background/10 flex items-center justify-center mb-8 border border-white/10">
                <GitBranch className="w-6 h-6 text-background" />
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-background tracking-tight mb-6 leading-tight">
                Engenharia de ponta, código no seu repositório.
              </h2>
              <p className="text-lg text-background/70 leading-relaxed">
                Seu time assume o código no primeiro dia. Projetos modulares, versionados e com CI/CD configurado — a operação passa para as suas mãos sem fricção.
              </p>
            </div>

            <div className="col-span-1 lg:col-span-7 relative">
              <ServiceGithub integrations={service.githubIntegrations} />
            </div>
          </div>
        </div>
      </section>

      </main>
      <Footer />
    </>
  );
}
