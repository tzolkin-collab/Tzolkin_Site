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

        <ul className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {buildCommitments.map((item, index) => {
            const Icon = icons[index] ?? Code2;
            return (
              <motion.li
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="flex"
              >
                <article className="w-full bg-card border border-border rounded-3xl p-7 md:p-8 shadow-lg">
                  <Icon size={28} strokeWidth={1.75} className="text-brand mb-5" aria-hidden="true" />
                  <h3 className="text-2xl font-bold text-card-foreground tracking-tight mb-3">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed mb-6">{item.summary}</p>
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">O que é entregue</p>
                  <ul className="space-y-3">
                    {item.deliverables.map((d) => (
                      <li key={d} className="flex gap-3 text-card-foreground/90 leading-relaxed">
                        <Check size={18} className="text-brand shrink-0 mt-1" aria-hidden="true" />
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              </motion.li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
