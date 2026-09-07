'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import useEmblaCarousel from 'embla-carousel-react';
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  ExternalLink,
  Globe,
  Sparkles,
  Mouse,
  MoveHorizontal,
  Code2
} from 'lucide-react';
import { productsShowcaseData } from '@/client/shared/data/productsData';
import { Button } from '@/client/shared/ui/Button';
import { appendTzolkinUtm } from '@/client/shared/utils/utm';

export function ProductsShowcase() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const isScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: 'start',
    skipSnaps: false,
    duration: 22,
    containScroll: 'trimSnaps',
  });

  const currentProduct = productsShowcaseData[selectedIndex] || productsShowcaseData[0];
  const nextProduct = productsShowcaseData[selectedIndex + 1];

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollTo = useCallback((index: number) => {
    if (emblaApi) emblaApi.scrollTo(index);
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);

  // Teclado (setas)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        scrollNext();
      }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        scrollPrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [scrollNext, scrollPrev]);

  // Interceptar scroll vertical (wheel) para navegar horizontalmente
  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();

      if (isScrollingRef.current) return;

      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;

      if (Math.abs(delta) > 12) {
        isScrollingRef.current = true;

        if (delta > 0) {
          scrollNext();
        } else {
          scrollPrev();
        }

        if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
        scrollTimeoutRef.current = setTimeout(() => {
          isScrollingRef.current = false;
        }, 300);
      }
    };

    node.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      node.removeEventListener('wheel', handleWheel);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, [scrollNext, scrollPrev]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex-1 flex flex-col justify-between pt-20 pb-4 px-4 sm:px-6 md:px-12 bg-background text-foreground overflow-hidden select-none"
    >
      
      {/* 🌌 GRAFISMO DE FUNDO FLUIDO E ULTRARRÁPIDO (120 FPS, ZERO BLUR PESADO) */}
      <div
        className="absolute inset-0 pointer-events-none -z-10 overflow-hidden"
        style={{
          backgroundImage: `
            radial-gradient(circle at 78% 40%, rgba(124, 58, 237, 0.22) 0%, transparent 55%),
            radial-gradient(circle at 88% 68%, rgba(249, 115, 22, 0.18) 0%, transparent 45%),
            radial-gradient(circle at 65% 80%, rgba(139, 92, 246, 0.12) 0%, transparent 40%)
          `,
        }}
      >
        {/* Grafismo Vetorial Fluido em SVG Nativo com Aceleração por GPU */}
        <svg
          className="absolute right-0 top-0 w-full lg:w-[65%] h-full opacity-40 stroke-foreground/20 pointer-events-none"
          viewBox="0 0 1000 700"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ willChange: 'transform' }}
        >
          <defs>
            <linearGradient id="fluid-stroke-1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.8" />
              <stop offset="60%" stopColor="#f97316" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.2" />
            </linearGradient>
            <linearGradient id="fluid-stroke-2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#f97316" stopOpacity="0.6" />
              <stop offset="50%" stopColor="#7c3aed" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.1" />
            </linearGradient>
          </defs>

          {/* Curvas Fluidas em Grafismo */}
          <path
            d="M 200 700 C 350 450, 600 650, 850 350 C 950 200, 1000 100, 1050 0"
            stroke="url(#fluid-stroke-1)"
            strokeWidth="1.5"
            strokeDasharray="6 6"
          />
          <path
            d="M 100 700 C 400 350, 500 500, 750 200 C 880 50, 950 0, 1000 -50"
            stroke="url(#fluid-stroke-2)"
            strokeWidth="2"
          />
          <path
            d="M 300 700 C 450 550, 700 400, 900 150"
            stroke="url(#fluid-stroke-1)"
            strokeWidth="1"
            opacity="0.5"
          />

          {/* Anéis Orbitais de Precisão */}
          <g transform="translate(680, 360)">
            <circle r="220" stroke="url(#fluid-stroke-1)" strokeWidth="1" strokeDasharray="4 8" opacity="0.6" />
            <circle r="320" stroke="url(#fluid-stroke-2)" strokeWidth="0.75" strokeDasharray="8 12" opacity="0.4" />
          </g>
        </svg>
      </div>

      {/* Header Bar da Seção */}
      <div className="max-w-[1400px] mx-auto w-full flex flex-row items-center justify-between gap-4 border-b border-border/50 pb-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-border bg-foreground/5 text-[11px] font-bold tracking-widest uppercase text-brand">
            <Sparkles className="w-3 h-3" />
          </div>
          <h1 className="text-lg md:text-2xl font-bold tracking-tight uppercase hidden sm:block">
            Serviços & <span className="text-brand">Soluções</span>
          </h1>
        </div>


        {/* Barra de Progresso e Setas Superiores */}
        <div className="flex items-center gap-3">
          <div className="text-xs font-mono text-muted-foreground">
            <span className="text-foreground font-bold text-base">{String(selectedIndex + 1).padStart(2, '0')}</span>
            <span className="mx-1 opacity-40">/</span>
            <span>{String(productsShowcaseData.length).padStart(2, '0')}</span>
          </div>
          
        {/* Atalho Visual de Navegação */}
        <div className="text-xs text-muted-foreground font-mono flex items-center gap-2">
          <span className="hidden sm:inline">Navegação:</span>
          <kbd className="px-1.5 py-0.5 bg-muted rounded border border-border text-[10px] font-bold">←</kbd>
          <kbd className="px-1.5 py-0.5 bg-muted rounded border border-border text-[10px] font-bold">→</kbd>
          <span>ou</span>
          <kbd className="px-2 py-0.5 bg-muted rounded border border-border text-[10px] font-bold">Scroll 🖱️</kbd>
        </div>
        </div>
      </div>

      {/* Main Split-Screen Container */}
      <div className="max-w-[1400px] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center flex-1 my-auto overflow-visible py-4">
        
        {/* LADO ESQUERDO: Explicação Dinâmica do Produto */}
        <div className="lg:col-span-5 flex flex-col justify-center max-h-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentProduct.id}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-4"
            >
              {/* Badge & Subdomínio */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wider bg-foreground text-background">
                  {currentProduct.category}
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-mono font-medium border border-border bg-card text-muted-foreground">
                  <Globe className="w-3 h-3 text-brand" />
                  {currentProduct.subdomain}
                </span>
              </div>

              {/* Título & Headline */}
              <div>
                <h2 className="text-2xl sm:text-3xl lg:text-3xl xl:text-4xl font-bold tracking-tight text-foreground leading-tight">
                  {currentProduct.title}
                </h2>
                <p className="mt-1 text-sm md:text-base text-brand font-medium leading-snug">
                  {currentProduct.headline}
                </p>
              </div>

              {/* Descrição Direta */}
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {currentProduct.description}
              </p>

              {/* Métricas Rápidas */}
              <div className="grid grid-cols-3 gap-2 py-2 border-y border-border/50">
                {currentProduct.metrics.map((m, idx) => (
                  <div key={idx} className="space-y-0.5">
                    <p className="text-base sm:text-xl font-black tracking-tight text-foreground">{m.value}</p>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">{m.label}</p>
                  </div>
                ))}
              </div>

              {/* Stack de Tecnologias */}
              <div className="space-y-1.5 pt-0.5">
                <div className="flex items-center gap-1.5 text-[11px] font-mono text-muted-foreground">
                  <Code2 className="w-3.5 h-3.5 text-brand" />
                  <span>Stack & Engenharia:</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {currentProduct.techStack.map((tech, tIdx) => (
                    <span
                      key={tIdx}
                      className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-card border border-border text-foreground"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* CTA Principal + Botão de Próximo Card */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Link
                  href={appendTzolkinUtm(currentProduct.ctaHref)}
                  target={currentProduct.isExternal ? '_blank' : undefined}
                  rel={currentProduct.isExternal ? 'noopener noreferrer' : undefined}
                >
                  <Button
                    variant="brand"
                    size="md"
                    className="px-6 shadow-md hover:scale-105 transition-transform text-xs sm:text-sm group"
                  >
                    {currentProduct.ctaText}
                    {currentProduct.isExternal ? (
                      <ExternalLink className="ml-1.5 w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    ) : (
                      <ArrowRight className="ml-1.5 w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                    )}
                  </Button>
                </Link>

                {nextProduct && (
                  <button
                    onClick={scrollNext}
                    className="inline-flex items-center gap-1 px-3 py-2 rounded-full border border-border bg-card hover:bg-foreground/5 hover:border-brand text-xs font-semibold text-foreground transition-all cursor-pointer group"
                  >
                    <span className="text-muted-foreground text-[11px]">Próximo:</span>
                    <span className="text-brand font-bold">{nextProduct.title.split(' ')[0]}</span>
                    <ArrowRight className="w-3 h-3 text-brand transition-transform group-hover:translate-x-1" />
                  </button>
                )}
              </div>

            </motion.div>
          </AnimatePresence>
        </div>

        {/* LADO DIREITO: Carrossel de Interfaces */}
        <div className="lg:col-span-7 relative w-full overflow-visible">
          
          {/* Seta Flutuante Esquerda */}
          {selectedIndex > 0 && (
            <button
              onClick={scrollPrev}
              aria-label="Voltar interface"
              className="absolute -left-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-brand border-2 border-white/20 text-white shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all cursor-pointer group"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>
          )}

          {/* Seta Flutuante Direita */}
          {selectedIndex < productsShowcaseData.length - 1 && (
            <button
              onClick={scrollNext}
              aria-label="Avançar interface"
              className="absolute -right-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-brand text-white border-2 border-white/20 shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all cursor-pointer group"
            >
              <ChevronRight className="w-6 h-6 text-white transition-transform group-hover:translate-x-0.5" />
            </button>
          )}

          {/* Container Embla */}
          <div className="w-full overflow-hidden -my-8 py-8 -mx-4 px-4" ref={emblaRef}>
            <div className="flex touch-pan-y select-none" style={{ willChange: 'transform' }}>
              {productsShowcaseData.map((prod, index) => {
                const isCurrent = index === selectedIndex;

                return (
                  <div
                    key={prod.id}
                    onClick={() => scrollTo(index)}
                    className={`flex-[0_0_86%] sm:flex-[0_0_88%] md:flex-[0_0_90%] min-w-0 p-3 sm:p-4 cursor-pointer transition-all duration-300 ${
                      isCurrent
                        ? 'scale-100 opacity-100'
                        : 'scale-[0.96] opacity-40 hover:opacity-75'
                    }`}
                  >
                    {/* Visual Interface Card com Moldura Gradiente Suave */}
                    <div className="relative rounded-2xl md:rounded-3xl p-[1.5px] bg-gradient-to-br from-[#7c3aed]/70 via-[#f97316]/60 to-[#8b5cf6]/70">
                      <div className="rounded-2xl md:rounded-3xl overflow-hidden bg-card">
                        <Image
                          src={prod.image}
                          alt={prod.title}
                          width={1600}
                          height={1000}
                          priority={index === 0}
                          className="w-full h-auto object-cover rounded-2xl md:rounded-3xl transition-transform duration-300 group-hover:scale-[1.01]"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>

      {/* Bottom Interactive Step Progress Bar & Pills */}
      <div className="max-w-[1400px] mx-auto w-full pt-3 border-t border-border/40 flex flex-wrap items-center justify-between gap-3 shrink-0">
        
        {/* Step Indicator com Pílulas */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {productsShowcaseData.map((prod, idx) => {
            const isActive = idx === selectedIndex;
            const isPast = idx < selectedIndex;

            return (
              <button
                key={prod.id}
                onClick={() => scrollTo(idx)}
                aria-label={`Ir para serviço ${prod.number} - ${prod.title}`}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-xs font-bold uppercase transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-foreground text-background shadow scale-105'
                    : isPast
                    ? 'bg-brand/10 text-brand border border-brand/30'
                    : 'bg-card text-muted-foreground hover:text-foreground border border-border/60 hover:border-brand/40'
                }`}
              >
                <span className="font-mono text-[10px]">{prod.number}</span>
                <span className="hidden md:inline">{prod.title.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>

      </div>

    </div>
  );
}
