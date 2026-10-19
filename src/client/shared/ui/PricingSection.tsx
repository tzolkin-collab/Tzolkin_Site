'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Check, Layers, Puzzle, Rocket, Sparkles, type LucideIcon } from 'lucide-react';
import { Button } from './Button';
import { contractSuites } from '@/client/shared/data/homeData';

const suiteIcons: Record<string, LucideIcon> = {
  recorte: Puzzle,
  integrada: Rocket,
  completa: Layers,
};

export function PricingSection() {
  return (
    <section id="como-contratar" aria-labelledby="como-contratar-title" className="py-16 md:py-28 bg-background border-t border-border/50 relative overflow-hidden">
      {/* Glow estático (gradiente CSS, sem blur nem animação) */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_60%_50%_at_85%_0%,color-mix(in_srgb,var(--brand)_14%,transparent),transparent),radial-gradient(ellipse_50%_40%_at_0%_100%,color-mix(in_srgb,var(--brand)_8%,transparent),transparent)]"
      />

      <div className="container mx-auto px-6 md:px-12 relative z-10 mb-14">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-foreground/70 mb-6 text-sm font-medium tracking-wider uppercase text-white">
            <Sparkles size={14} aria-hidden="true" />
            <span>Como contratar</span>
          </div>
          <h2 id="como-contratar-title" className="text-4xl md:text-6xl font-bold leading-tight mb-6 text-foreground">
            Suítes de dois meses,<br /> <span className="text-brand">escopo definido.</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground">
            Cada suíte tem escopo e prazo definidos antes de começar. O valor é apresentado na proposta, conforme o escopo, e cobre os dois meses de trabalho da equipe.
          </p>
        </motion.div>
      </div>

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        {/* TODO(PO): quarta faixa pendente. Acrescentar o card aqui quando nome e valor forem definidos. */}
        <ul className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch max-w-7xl mx-auto">
          {contractSuites.map((suite, idx) => {
            const Icon = suiteIcons[suite.slug] ?? Layers;
            const hl = !!suite.highlight;
            return (
              <motion.li
                key={suite.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.12 }}
                className="flex"
              >
                <article
                  className={`relative flex flex-col w-full p-6 sm:p-8 md:p-10 rounded-3xl border ${
                    hl
                      ? 'bg-brand/5 border-brand/50 shadow-lg shadow-brand/10'
                      : 'bg-card border-border/40 shadow-[0_2px_6px_rgba(0,0,0,0.03),0_12px_28px_-12px_rgba(0,0,0,0.16)]'
                  }`}
                >
                  {hl && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-brand border border-brand/50 text-brand-foreground text-xs font-bold uppercase tracking-widest rounded-full whitespace-nowrap shadow-lg shadow-brand/30">
                      Suíte em destaque
                    </div>
                  )}

                  <div
                    className={`mb-6 inline-flex self-start p-3 rounded-2xl ${
                      hl ? 'bg-gradient-to-br from-brand to-brand/70 text-brand-foreground shadow-lg shadow-brand/30' : 'bg-foreground/5 text-muted-foreground'
                    }`}
                  >
                    <Icon className="w-7 h-7" aria-hidden="true" />
                  </div>

                  <h3 className="text-2xl font-bold text-foreground mb-2 leading-tight">{suite.name}</h3>
                  <p className="text-sm text-muted-foreground min-h-[40px] leading-relaxed">{suite.summary}</p>

                  <p className="mt-6 mb-6 inline-block self-start px-2 py-0.5 bg-foreground text-xs font-bold text-background uppercase tracking-wider rounded-sm">
                    Dois meses · valor na proposta
                  </p>

                  <ul className="space-y-4 mb-8 flex-1">
                    {[suite.scope, suite.integrations, suite.followUp].map((text) => (
                      <li key={text} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-brand shrink-0 mt-0.5" aria-hidden="true" />
                        <span className="text-sm text-foreground/80 leading-relaxed font-medium">{text}</span>
                      </li>
                    ))}
                  </ul>

                  <Link href={suite.href} className="block mt-auto">
                    <Button variant={hl ? 'brand' : 'primary'} size="lg" className="w-full text-base font-bold h-14 shadow-xl">
                      {suite.ctaText}
                    </Button>
                  </Link>
                </article>
              </motion.li>
            );
          })}
        </ul>

        <p className="mt-10 text-sm text-muted-foreground max-w-3xl mx-auto text-center leading-relaxed">
          O valor cobre os dois meses de trabalho. Infraestrutura, APIs e serviços de terceiros (hospedagem, mensageria, emissão fiscal, entre outros) são cobrados à parte e discriminados na proposta.
        </p>
      </div>
    </section>
  );
}
