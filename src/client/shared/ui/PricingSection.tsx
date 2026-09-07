'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Compass, Code2, Users } from 'lucide-react';
import { PricingCard } from './PricingCard';
import Link from 'next/link';
import { appendTzolkinUtm } from '@/client/shared/utils/utm';

export function PricingSection() {

  const models = [
    {
      title: 'Consultoria e assessoria',
      slug: 'consultoria',
      icon: Compass,
      price: 'Sob Medida',
      paymentText: 'Visão Estratégica',
      description: 'Análise e orientação para decisões de tecnologia, com acompanhamento conforme a necessidade.',
      features: [
        'Análise e orientação para decisões de tecnologia',
        'Avaliação de soluções e ferramentas de mercado',
        'Definição de prioridades e planejamento',
        'Condução de mudanças com apoio especializado'
      ],
      ctaText: 'Conversar com a equipe',
      ctaHref: '/forms?interesse=consultoria',
      popular: false,
    },
    {
      title: 'Terceirização de tecnologia',
      slug: 'terceirizacao',
      icon: Users,
      price: 'Equipe Dedicada',
      paymentText: 'Mensalidade recorrente',
      description: 'Uma equipe externa para executar e acompanhar demandas de forma recorrente.',
      features: [
        'Equipe externa para execução contínua',
        'Acompanhamento de demandas diárias',
        'Frentes de atuação pré-definidas',
        'Rotina de trabalho escalável conforme a necessidade'
      ],
      ctaText: 'Conversar com a equipe',
      ctaHref: '/forms?interesse=terceirizacao',
      popular: true,
    },
    {
      title: 'Projetos sob demanda',
      slug: 'projetos',
      icon: Code2,
      price: 'Escopo Fechado',
      paymentText: 'Entrega Validada',
      description: 'LPs, sites, integrações e soluções sob medida para uma entrega definida.',
      features: [
        'LPs, sites e e-commerces completos',
        'Integrações e sistemas web sob medida',
        'Entrega com escopo e etapas definidas',
        'Critérios de validação claros e testes'
      ],
      ctaText: 'Ver Portfólio de Projetos',
      ctaHref: 'https://sites.tzolkin.cloud/',
      popular: false,
      extraLink: {
        text: 'Precisa de uma LP ou site? Conheça as entregas para apresentar sua oferta e gerar contatos.',
        url: 'https://sites.tzolkin.cloud/'
      }
    }
  ];

  return (
    <section id="products" className="py-12 md:py-32 bg-background border-t border-border/50 relative overflow-hidden">
      {/* Background Decor - Glows to make it less boring */}
      <div className="absolute top-0 right-0 w-full h-full pointer-events-none opacity-40">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-brand/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-brand/5 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-6 md:px-12 relative z-10 mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center md:text-center max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-foreground/70 mb-6 text-sm font-medium tracking-wider uppercase text-white">
            <Sparkles size={14} />
            <span>Formas de Contratar</span>
          </div>

          <h2 className="text-4xl md:text-6xl font-bold leading-tight mb-6 text-foreground">
            Três formas de trabalhar<br /> <span className="text-brand">com a TZOLKIN.</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground">
            O próximo passo depende do momento da sua empresa. Escolha o formato de trabalho adequado para a sua necessidade atual.
          </p>
        </motion.div>
      </div>

      {/* Premium Grid Layout */}
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch max-w-7xl mx-auto">
          {models.map((model, idx) => (
            <motion.div 
              key={model.title} 
              className={`flex flex-col h-full ${idx === 2 ? 'mt-10 lg:mt-0 pt-10 lg:pt-0 border-t lg:border-none border-border/40 relative' : ''}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
            >
              {idx === 2 && (
                <div className="lg:hidden absolute -top-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-background text-muted-foreground text-[10px] font-bold uppercase tracking-widest">
                  Ou
                </div>
              )}
              <PricingCard 
                title={model.title}
                slug={model.slug}
                icon={model.icon}
                price={model.price}
                paymentText={model.paymentText}
                description={model.description}
                features={model.features}
                popular={model.popular}
                ctaText={model.ctaText}
                ctaHref={model.ctaHref}
                fullWidth={true}
              />
              {model.extraLink && (
                <div className="mt-6 p-5 rounded-2xl border border-brand/20 bg-brand/5 relative overflow-hidden group w-full transition-colors hover:bg-brand/10">
                  <div className="absolute inset-0 bg-brand/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                  <div className="relative z-10">
                    <p className="text-sm text-foreground/80 font-medium mb-3">
                      {model.extraLink.text}
                    </p>
                    <Link 
                      href={appendTzolkinUtm(model.extraLink.url)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-bold text-brand hover:text-brand/80 transition-colors uppercase tracking-wider"
                    >
                      Ver LPs e sites
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
