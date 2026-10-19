'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { buildCommitments } from '@/client/shared/data/homeData';
import { SectionHeader } from '@/client/shared/ui/SectionHeader';
import { PermissionsPanel, RepoPanel, ResourcesPanel } from '@/client/shared/ui/apps/MethodPanels';

const panels = [PermissionsPanel, ResourcesPanel, RepoPanel];

export function MethodTOISection() {
  return (
    <section id="como-construimos" aria-labelledby="como-construimos-title" className="relative border-t border-border bg-background py-20 md:py-32">
      <div className="mx-auto max-w-[1200px] px-6 md:px-12">
        <div className="mb-12 md:mb-16">
          <SectionHeader
            id="como-construimos-title"
            eyebrow="Como construímos"
            title="Três compromissos verificáveis."
            muted="Cada um vira entrega concreta no projeto. Descrevemos o que você recebe, sem prometer certificações."
          />
        </div>

        <ul className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-x-8 xl:grid-cols-3">
          {buildCommitments.map((item, index) => {
            const Panel = panels[index] ?? RepoPanel;
            return (
              <motion.li
                key={item.title}
                className="flex min-w-0 flex-col"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.35, delay: index * 0.05 }}
              >
                <Panel />
                <h3 className="mt-6 text-xl font-semibold tracking-tight text-foreground">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground md:text-base">{item.summary}</p>
                <ul className="mt-5 space-y-2.5 border-t border-border pt-5">
                  {item.deliverables.slice(0, 3).map((d) => (
                    <li key={d} className="flex gap-2.5 text-sm leading-relaxed text-foreground">
                      <Check size={16} className="mt-0.5 shrink-0 text-brand" aria-hidden="true" />
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </motion.li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
