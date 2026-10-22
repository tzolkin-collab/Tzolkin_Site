'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import useEmblaCarousel from 'embla-carousel-react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Project } from '@/client/shared/data/projects';

interface PortfolioCarouselProps {
  projects: Project[];
}

/**
 * Logo dentro de um círculo grande (o modelo original dos cases, restaurado do histórico: commit 5af493b).
 * O círculo muda conforme o logo, não conforme o tema: logos escuros ou coloridos ficam sobre branco,
 * logos claros (brancos ou bege) ficam sobre grafite. Cores originais preservadas.
 */
/** Mesma área de tinta para toda logo (quadradas e largas pesam igual), com teto de largura e altura para não encostar na borda. */
const INK_AREA = 0.3;
const MAX_W = 0.72;
const MAX_H = 0.62;
function inkSize(aspect: number) {
  let w = Math.sqrt(INK_AREA * aspect);
  let h = w / aspect;
  if (w > MAX_W) { w = MAX_W; h = w / aspect; }
  if (h > MAX_H) { h = MAX_H; w = h * aspect; }
  return { w: w * 100, h: h * 100 };
}

function LogoDisc({ project }: { project: Project }) {
  const tone = project.bright ? 'bg-[#15151a] ring-white/10' : 'bg-white ring-black/[0.07]';
  const ink = project.logoAspect ? inkSize(project.logoAspect) : null;
  return (
    <div className={`relative flex aspect-square items-center justify-center overflow-hidden rounded-full ring-1 ring-inset shadow-[0_24px_60px_-28px_rgba(10,20,40,0.35)] ${ink ? '' : 'p-12'} ${tone}`}>
      <div
        className={`transition-transform duration-500 group-hover:scale-105 ${ink ? 'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2' : 'relative h-full w-full'}`}
        style={ink ? { width: `${ink.w}%`, height: `${ink.h}%` } : undefined}
      >
        {project.logo ? (
          <Image
            src={project.logo}
            alt={`Logo de ${project.name}`}
            fill
            loading="lazy"
            quality={75}
            sizes="(max-width: 640px) 85vw, (max-width: 768px) 45vw, 400px"
            className="object-contain"
          />
        ) : (
          <span className={`flex h-full items-center justify-center px-4 text-center text-2xl font-bold uppercase tracking-tight ${project.bright ? 'text-white' : 'text-neutral-600'}`}>
            {project.name}
          </span>
        )}
      </div>
    </div>
  );
}

/**
 * Carrossel arrastável e infinito de cases (cases e parcerias juntos): ao passar do último volta ao primeiro, nos dois
 * sentidos. Sem autoplay: só se move quando a pessoa arrasta.
 */
export function PortfolioCarousel({ projects }: PortfolioCarouselProps) {
  const [emblaRef, embla] = useEmblaCarousel({
    loop: true,
    align: 'center',
    containScroll: false,
    startIndex: Math.floor((projects.length - 1) / 2),
    skipSnaps: false,
    dragFree: true,
  });
  const [canPrev, setCanPrev] = useState(true);
  const [canNext, setCanNext] = useState(true);

  const update = useCallback(() => {
    if (!embla) return;
    setCanPrev(embla.canScrollPrev());
    setCanNext(embla.canScrollNext());
  }, [embla]);

  useEffect(() => {
    if (!embla) return;
    update();
    embla.on('select', update).on('scroll', update).on('reInit', update);
    return () => {
      embla.off('select', update).off('scroll', update).off('reInit', update);
    };
  }, [embla, update]);

  const arrow =
    'flex h-11 w-11 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:border-foreground disabled:cursor-default disabled:opacity-30 disabled:hover:border-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand';

  return (
    <div>
      <div className="relative w-full overflow-visible" ref={emblaRef}>
        <div className="flex touch-pan-y items-start gap-8 md:gap-12">
          {projects.map((project, index) => {
            const projectUrl = project.website || project.instagram;
            const disc = <LogoDisc project={project} />;
            return (
              <div key={`${project.name}-${index}`} className="relative min-w-0 flex-[0_0_82%] sm:flex-[0_0_350px] md:flex-[0_0_400px]">
                <div className="group relative">
                  {projectUrl ? (
                    <Link
                      href={projectUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${project.name}: visitar o site`}
                      className="relative z-10 mb-6 block rounded-full transition-transform duration-500 group-hover:-translate-y-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-4 focus-visible:ring-offset-background"
                    >
                      {disc}
                    </Link>
                  ) : (
                    <div className="relative z-10 mb-6">{disc}</div>
                  )}

                  <div className="relative z-10 flex items-baseline justify-between border-b border-foreground/10 pb-4 transition-colors duration-300 group-hover:border-foreground">
                    <h3 className="text-2xl font-medium tracking-tight">{project.name}</h3>
                    <span className="text-sm text-muted-foreground">
                      {project.category === 'partnership' ? 'Parceria · ' : ''}
                      {project.year}
                    </span>
                  </div>

                  {(project.description || project.role || project.stage) && (
                    <div className="relative z-10 mt-4 space-y-1 text-sm leading-relaxed">
                      {project.description && <p className="text-foreground">{project.description}</p>}
                      {project.role && (
                        <p className="text-muted-foreground">
                          <span className="font-semibold text-foreground">O que a TZOLKIN fez:</span> {project.role}
                        </p>
                      )}
                      {project.stage && (
                        <p className="text-muted-foreground">
                          <span className="font-semibold text-foreground">Estágio:</span> {project.stage}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
