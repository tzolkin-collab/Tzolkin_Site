'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { Button } from './Button';
import { contractSuites } from '@/client/shared/data/homeData';

export function PricingSection() {
  return (
    <section id="como-contratar" aria-labelledby="como-contratar-title" className="py-16 md:py-28 bg-background border-t border-border/50 relative overflow-hidden">
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="mb-12 max-w-3xl space-y-5">
          <h2 id="como-contratar-title" className="text-4xl md:text-5xl lg:text-6xl font-bold uppercase tracking-tighter text-foreground">
            Como contratar: <span className="text-brand">suítes de dois meses.</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            Cada suíte tem escopo, prazo e valor definidos antes de começar. O preço cobre os dois meses de trabalho da equipe.
          </p>
        </div>

        {/* TODO(PO): quarta faixa pendente. Acrescentar o card aqui quando nome e valor forem definidos. */}
        <ul className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          {contractSuites.map((suite, idx) => (
            <motion.li
              key={suite.slug}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="flex"
            >
              <article
                className={`flex flex-col w-full rounded-3xl p-7 md:p-8 bg-card border shadow-lg ${
                  suite.highlight ? 'border-brand' : 'border-border'
                }`}
              >
                <h3 className="text-2xl font-bold text-card-foreground tracking-tight">{suite.name}</h3>
                <p className="mt-2 text-muted-foreground leading-relaxed">{suite.summary}</p>

                <p className="mt-6 text-card-foreground">
                  {suite.pricePrefix && (
                    <span className="block text-sm font-semibold uppercase tracking-widest text-muted-foreground">{suite.pricePrefix}</span>
                  )}
                  <span className="text-4xl font-bold tracking-tight">{suite.price}</span>
                  <span className="block text-sm text-muted-foreground mt-1">pelos dois meses, mais custos externos</span>
                </p>

                <dl className="mt-6 space-y-4 flex-1">
                  {[
                    ['Recorte', suite.scope],
                    ['Integrações', suite.integrations],
                    ['Acompanhamento', suite.followUp],
                  ].map(([label, text]) => (
                    <div key={label} className="flex gap-3">
                      <Check size={18} className="text-brand shrink-0 mt-1" aria-hidden="true" />
                      <div>
                        <dt className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{label}</dt>
                        <dd className="text-card-foreground/90 leading-relaxed">{text}</dd>
                      </div>
                    </div>
                  ))}
                </dl>

                <Link href={suite.href} className="block mt-8">
                  <Button variant={suite.highlight ? 'brand' : 'outline'} size="lg" className="w-full">
                    {suite.ctaText}
                  </Button>
                </Link>
              </article>
            </motion.li>
          ))}
        </ul>

        <p className="mt-8 text-sm text-muted-foreground max-w-3xl leading-relaxed">
          Valores pelos dois meses de trabalho. Infraestrutura, APIs e serviços de terceiros (hospedagem, mensageria, emissão fiscal, entre outros) são cobrados à parte e discriminados na proposta.
        </p>
      </div>
    </section>
  );
}
