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

        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {applications.map((app, index) => {
            const Icon = icons[app.slug] ?? GitBranch;
            return (
              <motion.li
                key={app.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: index * 0.06 }}
                className="flex"
              >
                <article className="flex flex-col w-full bg-card border border-border rounded-3xl p-7 md:p-8 shadow-lg hover:border-brand/50 transition-colors">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand to-brand2 flex items-center justify-center shadow-lg shadow-brand/20 mb-6">
                    <Icon size={24} strokeWidth={1.75} className="text-brand-foreground" aria-hidden="true" />
                  </div>

                  <h3 className="text-2xl font-bold text-card-foreground tracking-tight mb-5">{app.title}</h3>

                  <dl className="space-y-4 text-base leading-relaxed flex-1">
                    <div>
                      <dt className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Para quem</dt>
                      <dd className="text-card-foreground/90">{app.audience}</dd>
                    </div>
                    <div>
                      <dt className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">O que entra em funcionamento</dt>
                      <dd className="text-card-foreground/90">{app.delivers}</dd>
                    </div>
                  </dl>

                  <Link
                    href={app.href}
                    className="group mt-7 inline-flex items-center gap-2 font-bold text-brand hover:underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm"
                  >
                    {app.ctaText}
                    <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" aria-hidden="true" />
                  </Link>
                </article>
              </motion.li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
