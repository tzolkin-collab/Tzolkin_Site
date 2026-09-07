'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Project } from '@/client/shared/data/projects';

interface MajorPartnershipsProps {
  partnerships: Project[];
}

function PartnershipCardMedia({ project }: { project: Project }) {
  const [logoFailed, setLogoFailed] = useState(false);
  const showLogo = Boolean(project.logo) && !logoFailed;

  return (
    <div className="aspect-[16/10] bg-neutral-950 dark:bg-white mb-8 overflow-hidden relative flex items-center justify-center p-8 md:p-16 transition-all duration-500 rounded-3xl group-hover:-translate-y-2 z-10 shadow-xl border border-white/5 dark:border-black/5 group-hover:border-brand/30">
      {/* Fallback visual: logo ausente ou falha de carregamento */}
      {!showLogo && (
        <div className="absolute inset-0 z-[5] flex items-center justify-center bg-muted">
          <span className="text-2xl md:text-3xl font-bold uppercase tracking-tight text-muted-foreground text-center px-8">
            {project.name}
          </span>
        </div>
      )}

      {/* Main Content - Project Logo */}
      {showLogo && (
        <div className="relative w-full h-full z-10 transition-transform duration-500 group-hover:scale-105">
          <Image
            src={project.logo}
            alt={`Logo ${project.name}`}
            fill
            loading="lazy"
            quality={75}
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-contain brightness-0 invert dark:invert-0"
            onError={() => setLogoFailed(true)}
          />
        </div>
      )}
    </div>
  );
}

export function MajorPartnerships({ partnerships }: MajorPartnershipsProps) {
  return (
    <section className="py-20 md:py-24 bg-background relative overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 md:mb-24 items-start"
        >
          <h2 className="text-[8vw] md:text-[4vw] leading-[0.9] font-bold tracking-tight text-foreground uppercase mix-blend-normal">
            Estrutura validada por quem <br />
            <span className="text-brand">não pode ter erro</span>
          </h2>
          <p className="mt-8 text-lg text-foreground max-w-xl">
            De operações com alto volume de vendas a gigantes globais como o Instituto Vale: quando a tecnologia precisa funcionar sem falhas, é na TZOLKIN que eles apoiam suas soluções.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-24">
          {partnerships.map((project, index) => (
            <motion.div
              key={project.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className={`group cursor-pointer relative ${index % 2 !== 0 ? 'md:mt-24' : ''}`}
            >
              {/* Card Container */}
              <PartnershipCardMedia project={project} />

              {/* Text Content */}
              <div className="flex flex-col border-l-2 border-transparent group-hover:border-brand transition-colors duration-500 relative z-10">
                <div className="transition-transform duration-500 group-hover:translate-x-8">
                  <h3 className="text-4xl font-bold mb-3 tracking-tight group-hover:text-brand transition-colors">{project.name}</h3>
                  <span className="text-base text-muted-foreground uppercase tracking-widest font-medium">Parceria Estratégica &bull; {project.year}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
