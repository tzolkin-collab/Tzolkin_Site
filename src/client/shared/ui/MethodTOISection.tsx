'use client';

import { motion } from 'framer-motion';
import { Check, KeyRound, Server, Code2, type LucideIcon } from 'lucide-react';
import { buildCommitments } from '@/client/shared/data/homeData';

const icons: LucideIcon[] = [KeyRound, Server, Code2];

export function MethodTOISection() {
  return (
    <section id="como-construimos" aria-labelledby="como-construimos-title" className="py-16 md:py-28 bg-background border-t border-border/50 relative overflow-hidden">
      <div className="container mx-auto px-6 md:px-12">
        <div className="mb-12 space-y-5 max-w-3xl">
          <h2 id="como-construimos-title" className="text-4xl md:text-5xl lg:text-6xl font-bold uppercase tracking-tighter text-foreground">
            Como construímos: <span className="text-brand">três compromissos verificáveis.</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            Cada um vira entrega concreta no projeto. Descrevemos o que você recebe, sem prometer certificações.
          </p>
        </div>

        <ul className="flex flex-col gap-6 md:gap-8">
          {buildCommitments.map((item, index) => {
            const Icon = icons[index] ?? Code2;
            return (
              <motion.li
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <article className="relative overflow-hidden rounded-3xl border border-brand/20 bg-gradient-to-br from-brand/10 via-card to-card shadow-2xl p-7 md:p-12 flex flex-col md:flex-row gap-8 md:gap-14 md:items-center">
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-foreground/20 to-transparent pointer-events-none" aria-hidden="true" />

                  <div className="relative flex-1 space-y-5">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand to-brand2 flex items-center justify-center shadow-lg shadow-brand/30">
                      <Icon size={28} strokeWidth={1.75} className="text-brand-foreground drop-shadow-md" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-card-foreground mb-3 tracking-tight">{item.title}</h3>
                      <p className="text-muted-foreground font-medium leading-relaxed text-base md:text-lg">{item.summary}</p>
                    </div>
                  </div>

                  <div className="relative flex-1 w-full">
                    <p className="text-xs font-bold uppercase tracking-widest text-brand-ink mb-4">O que é entregue</p>
                    <ul className="space-y-3">
                      {item.deliverables.map((d) => (
                        <li key={d} className="flex gap-3 text-base md:text-lg text-card-foreground/90 leading-relaxed">
                          <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand/15 border border-brand/30">
                            <Check size={14} className="text-brand-ink" aria-hidden="true" />
                          </span>
                          <span>{d}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              </motion.li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
