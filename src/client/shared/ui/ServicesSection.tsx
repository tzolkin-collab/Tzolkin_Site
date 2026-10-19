'use client';

import type { JSX } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Bot, GitBranch, Handshake, Receipt, ShoppingBag, type LucideIcon } from 'lucide-react';
import { applications } from '@/client/shared/data/homeData';
import { SectionHeader } from '@/client/shared/ui/SectionHeader';
import { ChatMock, FunnelMock, InvoiceMock, PilotMock, StoreMock } from '@/client/shared/ui/apps/AppMockups';

const icons: Record<string, LucideIcon> = {
  'crm-com-ia': Handshake,
  'agentes-ia': Bot,
  'ecommerce-marketplace': ShoppingBag,
  fiscal: Receipt,
  piloto: GitBranch,
};

const mocks: Record<string, () => JSX.Element> = {
  'crm-com-ia': FunnelMock,
  'agentes-ia': ChatMock,
  'ecommerce-marketplace': StoreMock,
  fiscal: InvoiceMock,
  piloto: PilotMock,
};

export function ServicesSection() {
  return (
    <section className="relative z-10 w-full bg-background py-20 md:py-32" id="aplicacoes" aria-labelledby="aplicacoes-title">
      <div className="mx-auto max-w-[1200px] px-6 md:px-12">
        <div className="mb-12 md:mb-16">
          <SectionHeader
            id="aplicacoes-title"
            eyebrow="Aplicações"
            title="Software para vender,"
            muted="atender e operar."
            description="Cinco frentes em que já desenhamos e entregamos. O escopo final é definido em conversa."
          />
        </div>

        <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-6 xl:gap-5">
          {applications.map((app, index) => {
            const Icon = icons[app.slug] ?? GitBranch;
            const Mock = mocks[app.slug] ?? PilotMock;
            const big = app.slug === 'crm-com-ia';
            return (
              <motion.li
                key={app.slug}
                className={big ? 'md:col-span-2 xl:col-span-4' : 'xl:col-span-2'}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.35, delay: Math.min(index, 2) * 0.05 }}
              >
                <article className={`flex h-full flex-col gap-6 rounded-2xl border border-border bg-card p-6 shadow-sm md:p-8 ${big ? 'xl:flex-row xl:gap-10' : ''}`}>
                  <div className={`flex flex-col ${big ? 'xl:w-[44%]' : 'flex-1'}`}>
                    <Icon size={20} strokeWidth={1.75} className="mb-5 text-muted-foreground" aria-hidden="true" />
                    <h3 className={`font-semibold tracking-tight text-card-foreground ${big ? 'text-2xl md:text-3xl' : 'text-xl'}`}>{app.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground md:text-base">{app.forWho}</p>
                    <ul className="mt-5 flex flex-wrap gap-1.5" aria-label="Itens da aplicação">
                      {app.chips.map((chip) => (
                        <li key={chip} className="rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground">
                          {chip}
                        </li>
                      ))}
                    </ul>
                    <Link
                      href={app.href}
                      className="group mt-6 inline-flex items-center gap-1.5 self-start rounded-sm pt-1 text-sm font-semibold text-brand hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background xl:mt-auto"
                    >
                      {app.ctaText} <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                    </Link>
                  </div>
                  <div className={big ? 'xl:flex-1 xl:self-center' : 'order-first'}>
                    <Mock />
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
