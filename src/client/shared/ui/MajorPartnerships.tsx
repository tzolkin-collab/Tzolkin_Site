'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Project } from '@/client/shared/data/projects';
import { SectionHeader } from './SectionHeader';

interface MajorPartnershipsProps {
  partnerships: Project[];
}

function PartnerLogo({ project }: { project: Project }) {
  const [logoFailed, setLogoFailed] = useState(false);
  const showLogo = Boolean(project.logo) && !logoFailed;

  return (
    <div className="relative flex h-32 items-center justify-center rounded-xl bg-muted/60">
      {showLogo ? (
        <Image
          src={project.logo}
          alt={`Logo ${project.name}`}
          fill
          loading="lazy"
          quality={75}
          sizes="(max-width: 768px) 90vw, 560px"
          className="object-contain p-3 opacity-70 brightness-0 dark:invert"
          onError={() => setLogoFailed(true)}
        />
      ) : (
        <span className="px-8 text-center text-xl font-semibold tracking-tight text-muted-foreground">{project.name}</span>
      )}
    </div>
  );
}

export function MajorPartnerships({ partnerships }: MajorPartnershipsProps) {
  return (
    <section aria-labelledby="parcerias-title" className="bg-background py-20 md:py-28">
      <div className="mx-auto max-w-[1200px] px-6 md:px-12">
        <SectionHeader
          id="parcerias-title"
          eyebrow="Parcerias"
          title="Organizações com as quais"
          muted="mantemos parceria em tecnologia."
        />

        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2">
          {partnerships.map((project, index) => (
            <motion.div
              key={project.name}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: index * 0.05 }}
              className="rounded-2xl border border-border bg-card p-5"
            >
              <PartnerLogo project={project} />
              <div className="mt-5 flex items-baseline justify-between gap-3">
                <h3 className="text-xl font-semibold tracking-tight text-foreground">{project.name}</h3>
                <span className="text-sm text-muted-foreground">{project.year}</span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">Parceria estratégica</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
