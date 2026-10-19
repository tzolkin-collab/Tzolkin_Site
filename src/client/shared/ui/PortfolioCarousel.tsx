'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Project } from '@/client/shared/data/projects';

interface PortfolioCarouselProps {
  projects: Project[];
}

function CaseLogo({ project }: { project: Project }) {
  return (
    <div className="relative flex h-28 items-center justify-center rounded-xl bg-muted/60 px-8">
      {project.logo ? (
        <Image
          src={project.logo}
          alt={`Logo de ${project.name}`}
          fill
          loading="lazy"
          quality={75}
          sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 380px"
          className="object-contain p-2 opacity-70 brightness-0 dark:invert"
        />
      ) : (
        <span className="text-center text-lg font-semibold tracking-tight text-muted-foreground">{project.name}</span>
      )}
    </div>
  );
}

/**
 * Grade de cases. Mantém o nome do componente por compatibilidade, mas não é
 * mais um carrossel: sem autoplay/JS contínuo, apenas cartões estáticos.
 */
export function PortfolioCarousel({ projects }: PortfolioCarouselProps) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project, index) => {
        const projectUrl = project.website || project.instagram;
        const body = (
          <>
            <CaseLogo project={project} />
            <div className="mt-5 flex items-baseline justify-between gap-3">
              <h3 className="text-lg font-semibold tracking-tight text-foreground">{project.name}</h3>
              <span className="text-sm text-muted-foreground">{project.year}</span>
            </div>
            {project.description && <p className="mt-2 text-sm leading-relaxed text-foreground">{project.description}</p>}
            {(project.role || project.stage) && (
              <dl className="mt-4 space-y-1.5 border-t border-border pt-4 text-sm">
                {project.role && (
                  <div>
                    <dt className="inline font-medium text-foreground">O que a TZOLKIN fez: </dt>
                    <dd className="inline text-muted-foreground">{project.role}</dd>
                  </div>
                )}
                {project.stage && (
                  <div>
                    <dt className="inline font-medium text-foreground">Estágio: </dt>
                    <dd className="inline text-muted-foreground">{project.stage}</dd>
                  </div>
                )}
              </dl>
            )}
            {projectUrl && (
              <span className="mt-4 inline-block text-sm font-semibold text-brand">
                Visitar <span aria-hidden="true">→</span>
              </span>
            )}
          </>
        );
        const cls = 'block h-full rounded-2xl border border-border bg-card p-5 transition-colors hover:border-foreground/25';
        return (
          <motion.div
            key={`${project.name}-${index}`}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: Math.min(index, 3) * 0.05 }}
          >
            {projectUrl ? (
              <Link href={projectUrl} target="_blank" rel="noopener noreferrer" className={cls}>
                {body}
              </Link>
            ) : (
              <div className={cls}>{body}</div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
