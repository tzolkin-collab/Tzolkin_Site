'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Bot, GitBranch, Handshake, Receipt, ShoppingBag, type LucideIcon } from 'lucide-react';
import { applications } from '@/client/shared/data/homeData';

const icons: Record<string, LucideIcon> = {
  'crm-com-ia': Handshake,
  'agentes-ia': Bot,
  'ecommerce-marketplace': ShoppingBag,
  fiscal: Receipt,
  piloto: GitBranch,
};

export function ServicesSection() {
  return (
    <section className="w-full bg-background py-16 md:py-28 relative z-10" id="aplicacoes" aria-labelledby="aplicacoes-title">
      <div className="container mx-auto px-6 md:px-12">
        <div className="mb-12 space-y-5">
          <h2 id="aplicacoes-title" className="text-4xl md:text-5xl lg:text-6xl font-bold uppercase tracking-tighter max-w-4xl text-foreground">
            O que construímos: <span className="text-brand">aplicações para vender, atender e operar.</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed">
            Cinco frentes em que já desenhamos e entregamos software. Escolha a mais próxima do seu caso; o escopo final é definido em conversa.
          </p>
        </div>

        <ul className="flex flex-col gap-6 md:gap-8">
          {applications.map((app, index) => {
            const Icon = icons[app.slug] ?? GitBranch;
            return (
              <motion.li
                key={app.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <article className="relative overflow-hidden rounded-3xl border border-brand/20 bg-gradient-to-br from-brand/10 via-card to-card shadow-2xl p-7 md:p-12 flex flex-col md:flex-row gap-8 md:gap-14 md:items-center hover:border-brand/40 transition-colors">
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-foreground/20 to-transparent pointer-events-none" aria-hidden="true" />

                  <div className="relative flex-1 space-y-5">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand to-brand2 flex items-center justify-center shadow-lg shadow-brand/30">
                      <Icon size={28} strokeWidth={1.75} className="text-brand-foreground drop-shadow-md" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-card-foreground mb-3 tracking-tight">{app.title}</h3>
                      <p className="text-muted-foreground font-medium leading-relaxed text-base md:text-lg">{app.audience}</p>
                    </div>
                  </div>

                  <div className="relative flex-1 space-y-6 w-full">
                    <p className="text-base md:text-lg text-card-foreground/90 leading-relaxed">{app.delivers}</p>
                    <ul className="flex flex-wrap gap-2.5" aria-label="Itens da aplicação">
                      {app.chips.map((chip) => (
                        <li key={chip} className="inline-flex items-center px-3.5 py-1.5 rounded-full text-xs md:text-sm font-medium bg-foreground/5 border border-border text-foreground">
                          {chip}
                        </li>
                      ))}
                    </ul>
                    <Link
                      href={app.href}
                      className="group inline-flex items-center gap-2 rounded-full bg-brand px-7 py-3.5 text-base font-bold text-brand-foreground shadow-lg shadow-brand/30 hover:bg-brand/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    >
                      {app.ctaText}
                      <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" aria-hidden="true" />
                    </Link>
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
