'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { PricingCard, PricingCardProps } from './PricingCard';
import { pricingData } from '@/client/shared/data/pricingData';
import { Button } from './Button';
import Link from 'next/link';
import { ArrowRight, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';

export function PricingSection() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    dragFree: true,
    containScroll: 'trimSnaps',
    duration: 25,
  });

  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setPrevBtnDisabled(!emblaApi.canScrollPrev());
    setNextBtnDisabled(!emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    const timer = setTimeout(() => {
      onSelect();
    }, 0);

    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);

    return () => {
      clearTimeout(timer);
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <section id="products" className="py-12 md:py-32 bg-background border-t border-border/50 relative overflow-hidden">
      <div className="container mx-auto px-6 md:px-12 relative z-10 mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center md:text-left max-w-3xl"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-foreground/5 mb-6 text-sm font-medium tracking-wider uppercase text-brand">
            <Sparkles size={14} />
            <span>Serviços e entregas</span>
          </div>

          <h2 className="text-4xl md:text-6xl font-bold leading-tight mb-6 text-foreground">
            O que você precisa<br /> <span className="text-brand">resolver agora?</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground">
            Compare sites, lojas, tracking e integrações. Os valores exibidos se referem aos escopos descritos; personalizações e custos recorrentes devem ser conferidos antes da contratação. Serviços por projeto não são assinaturas de SaaS.
          </p>
        </motion.div>
      </div>

      {/* Carousel */}
      <div className="w-full relative z-10 pl-6 md:pl-12 py-2 overflow-hidden pr-6 md:pr-12" ref={emblaRef}>
        <div
          className="flex gap-6 pb-6 pt-4 cursor-grab active:cursor-grabbing touch-pan-y items-stretch"
          style={{ willChange: 'transform' }}
        >
          {pricingData.map((plan: PricingCardProps) => (
            <div key={plan.title} className="flex h-full">
              <PricingCard {...plan} />
            </div>
          ))}

          {/* Special Last Card for More Products/Services */}
          <div
            className="group relative flex flex-col h-full p-6 sm:p-8 md:p-10 rounded-3xl border transition-all duration-300 w-[85vw] max-w-[340px] md:max-w-none md:w-[420px] shrink-0 text-foreground justify-center items-center text-center hover:bg-foreground-invert border-transparent bg-card/40"
          >
            <Link href="/catalogo" className="absolute inset-0 z-10" aria-label="Ver soluções personalizadas" />
            <Sparkles className="w-12 h-12 mb-6 opacity-70 group-hover:scale-110 transition-transform duration-300 pointer-events-none" />
            <h3 className="text-3xl font-black mb-4 uppercase tracking-tighter leading-none pointer-events-none">
              Soluções <br /> personalizadas
            </h3>
            <p className="font-medium opacity-80 mb-8 px-4 pointer-events-none">
              Infraestrutura, automação de dados ou identidade de marca completa — desenhadas para a sua operação.
            </p>
            <div className="flex items-center gap-2 font-bold uppercase tracking-widest text-sm pointer-events-none">
              Ver soluções personalizadas <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Buttons (Desktop Only) */}
      <div className="hidden md:flex items-center justify-end gap-4 px-12 relative z-10 -mt-8">
        <button
          onClick={scrollPrev}
          disabled={prevBtnDisabled}
          className="w-12 h-12 rounded-full border border-border flex items-center justify-center bg-background hover:bg-foreground/5 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          aria-label="Anterior"
        >
          <ChevronLeft className="w-6 h-6 text-foreground" />
        </button>
        <button
          onClick={scrollNext}
          disabled={nextBtnDisabled}
          className="w-12 h-12 rounded-full border border-border flex items-center justify-center bg-background hover:bg-foreground/5 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          aria-label="Próximo"
        >
          <ChevronRight className="w-6 h-6 text-foreground" />
        </button>
      </div>

      {/* Sob Demanda CTA */}
      <div className="container mx-auto px-6 md:px-12 relative z-10 mt-6 md:mt-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-foreground text-background rounded-3xl p-8 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8 border border-background/10"
        >
          <div className="max-w-xl text-center md:text-left">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">Sua operação precisa de algo próprio?</h3>
            <p className="text-background/70 text-lg leading-relaxed">
              Se o problema envolve vários sistemas ou regras específicas, começamos pelo processo. Depois definimos o que integrar, o que desenvolver e em quais etapas entregar.
            </p>
          </div>
          <div className="shrink-0 w-full md:w-auto mt-6 md:mt-0">
            <Link href="/forms?interesse=personalizado">
              <Button
                variant="brand"
                size="lg"
                className="w-full md:w-auto px-10 flex items-center justify-center gap-3 hover:scale-105"
              >
                Solicitar orçamento
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>

    </section>
  );
}
