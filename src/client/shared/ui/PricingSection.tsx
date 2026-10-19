'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { SectionHeader } from './SectionHeader';
import { contractSuites } from '@/client/shared/data/homeData';

const ctaBase =
  'inline-flex h-11 w-full items-center justify-center rounded-full px-6 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background';

export function PricingSection() {
  return (
    <section id="como-contratar" aria-labelledby="como-contratar-title" className="border-t border-border bg-background py-20 md:py-28">
      <div className="mx-auto max-w-[1200px] px-6 md:px-12">
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
          <SectionHeader
            id="como-contratar-title"
            eyebrow="Como contratar"
            title="Suítes de dois meses, com escopo definido."
            description="O valor é apresentado na proposta, conforme o escopo, e cobre os dois meses de trabalho da equipe."
          />
        </motion.div>

        {/* TODO(PO): quarta faixa pendente. Acrescentar o card aqui quando nome e valor forem definidos. */}
        <ul className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {contractSuites.map((suite, idx) => {
            const hl = !!suite.highlight;
            return (
              <motion.li
                key={suite.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: idx * 0.08 }}
                className="flex"
              >
                <article
                  className={`relative flex w-full flex-col rounded-2xl border bg-card p-7 md:p-8 ${
                    hl ? 'border-brand shadow-[0_8px_24px_-12px_rgba(0,0,0,0.18)]' : 'border-border'
                  }`}
                >
                  {hl && (
                    <span className="absolute -top-3 left-7 rounded-full bg-brand px-3 py-0.5 text-xs font-semibold text-brand-foreground">
                      Suíte em destaque
                    </span>
                  )}
                  <h3 className="text-xl font-semibold tracking-tight text-foreground">{suite.name}</h3>
                  <p className="mt-2 min-h-[40px] text-sm leading-relaxed text-muted-foreground">{suite.summary}</p>
                  <p className="mt-6 border-b border-border pb-6 text-sm font-medium text-foreground">Dois meses · valor na proposta</p>

                  <ul className="my-6 flex-1 space-y-4">
                    {[suite.scope, suite.integrations, suite.followUp].map((text) => (
                      <li key={text} className="flex items-start gap-3 text-sm leading-relaxed text-foreground/80">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand" strokeWidth={2} aria-hidden="true" />
                        <span>{text}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={suite.href}
                    className={`${ctaBase} ${
                      hl
                        ? 'bg-brand text-brand-foreground hover:bg-brand/90'
                        : 'border border-border bg-background text-foreground hover:bg-foreground/5'
                    }`}
                  >
                    {suite.ctaText}
                  </Link>
                </article>
              </motion.li>
            );
          })}
        </ul>

        <p className="mt-10 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          O valor cobre os dois meses de trabalho. Infraestrutura, APIs e serviços de terceiros (hospedagem, mensageria, emissão fiscal, entre outros) são cobrados à parte e discriminados na proposta.
        </p>
      </div>
    </section>
  );
}
