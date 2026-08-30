'use client';

import React from 'react';
import { motion, Variants } from 'framer-motion';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.05
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.16, 1, 0.3, 1]
    }
  }
};
import { Button } from '@/client/shared/ui/Button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function MethodTOISection() {

  return (
    <section className="pt-12 pb-14 md:py-32 bg-background relative overflow-hidden">
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24">

          {/* Content Side */}
          <div className="flex-1 space-y-12 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl md:text-5xl font-bold leading-tight mb-6">
                Um método, <span className="text-brand">do primeiro deploy à escala.</span>
              </h2>

              <div className="space-y-6">
                <h3 className="text-4xl md:text-6xl font-bold text-foreground tracking-tight">
                  Método<span className="ml-4 text-brand">GT™</span>
                </h3>

                <p className="text-xl text-muted-foreground leading-relaxed max-w-xl">
                  Enquanto agências empilham <span className="text-foreground font-semibold">posts</span>, o Método GT™ alinha <span className="text-foreground font-semibold">funil</span>, <span className="text-foreground font-semibold">estrutura</span> e <span className="text-foreground font-semibold">recorrência</span> — o mesmo rigor em um site, em um SaaS ou em um projeto educacional.
                </p>

                <div className="pt-8">
                  <Link href="/forms?interesse=consultoria">
                    <Button variant="primary" size="lg" className="px-8 group hover:scale-105">
                      Quero aplicar o Método GT™
                      <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Visual Side - 3 Words Representation */}
          <div className="flex-1 w-full relative flex justify-center">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="relative w-full max-w-[500px] min-h-[600px] md:min-h-[700px] flex flex-col items-center justify-center py-12"
            >
              {/* Central Concept - The Method */}
              <div className="relative w-full h-full px-8 flex flex-col justify-center items-center gap-6">

                {/* 01 - TRACKING & VOLUME */}
                <motion.div
                  variants={itemVariants}
                  className="w-full bg-card border border-border p-6 rounded-2xl shadow-xl hover:border-brand/50 transition-all group relative z-30 transform hover:-translate-y-1 hover:shadow-2xl"
                >
                  <div className="flex flex-col justify-center md:flex-row items-center mb-2">
                    <div className="flex items-center">
                      <span className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-brand to-brand/60">01</span>
                      <span className="text-xl md:text-2xl font-bold ml-3 text-foreground tracking-wide">Volume e teste</span>
                    </div>
                    <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest border border-border px-2 py-1 rounded">Análise</span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed pl-14">
                    Através de um tracking inteligente, coletamos as métricas exatas do seu público-alvo inicial.
                  </p>
                </motion.div>

                {/* 02 - SOFISTICAÇÃO */}
                <motion.div
                  variants={itemVariants}
                  className="w-full bg-card border border-border p-6 rounded-2xl shadow-xl hover:border-brand/50 transition-all group relative z-20 transform hover:-translate-y-1 hover:shadow-2xl -mt-4 ml-8 md:ml-12"
                >
                  <div className="flex flex-col items-center justify-between mb-2">
                    <div className="flex items-center">
                      <span className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-brand to-brand/60">02</span>
                      <span className="text-xl md:text-2xl font-bold ml-3 text-foreground tracking-wide">Sofisticação</span>
                    </div>
                    <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest border border-border px-2 py-1 rounded">Estrutura</span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed pl-14">
                    Com clareza absoluta do seu público-alvo, te ajudamos a sofisticar sua estrutura. <span className="font-bold">Você gasta bem menos do que gastaria testando no escuro.</span>
                  </p>
                </motion.div>

                {/* 03 - ESCALA */}
                <motion.div
                  variants={itemVariants}
                  className="w-full bg-card border border-border p-6 rounded-2xl shadow-xl hover:border-brand/50 transition-all group relative z-10 transform hover:-translate-y-1 hover:shadow-2xl -mt-4 mr-4 md:mr-8"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <span className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-brand to-brand/60">03</span>
                      <span className="text-xl md:text-2xl font-bold ml-3 text-foreground tracking-wide">Escala e oferta</span>
                    </div>
                    <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest border border-border px-2 py-1 rounded">Escala</span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed pl-14">
                    Sua marca está blindada e pronta para escalar. Estruturamos ofertas precisas e impulsionamos o negócio com estabilidade — sem distorcer a visão do seu lead.
                  </p>
                </motion.div>

                {/* Connecting Line Visual */}
                <svg className="absolute inset-0 z-0 w-full h-full pointer-events-none opacity-90" viewBox="0 0 400 400">
                  {/* Desktop Path - Smooth Curve */}
                  <path
                    d="M200 00 C 500 100, 250 150, 250 200 C 250 250, 150 250, 150 300"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeDasharray="15 12"
                    className="text-brand/80 hidden md:block"
                    strokeLinecap="round"
                  />

                  {/* Mobile Path - Smooth Vertical Curve */}
                  <path
                    d="M200 80 C 200 120, 200 280, 200 320"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="6"
                    strokeDasharray="12 12"
                    className="text-brand/80 md:hidden"
                    strokeLinecap="round"
                  />
                </svg>

              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
