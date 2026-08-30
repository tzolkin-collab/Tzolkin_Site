'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { Project } from '@/client/shared/data/projects';
import { InstagramEmbed } from './InstagramEmbed';

interface PortfolioCarouselProps {
  projects: Project[];
  showEmbeds?: boolean;
}

export function PortfolioCarousel({ projects, showEmbeds = false }: PortfolioCarouselProps) {
  const [emblaRef] = useEmblaCarousel({
    loop: true,
    align: 'start',
    skipSnaps: false,
    dragFree: true
  }, [
    Autoplay({ delay: 4000, stopOnInteraction: false })
  ]);

  return (
    <div className="w-full relative overflow-hidden" ref={emblaRef}>
      <div className="flex touch-pan-y gap-8 md:gap-12 px-4 md:px-0 items-start" style={{ willChange: 'transform' }}>
        {projects.map((project, index) => {
          const projectUrl = project.website || project.instagram;

          return (
            <div
              key={`${project.name}-${index}`}
              className="flex-[0_0_100%] sm:flex-[0_0_350px] md:flex-[0_0_400px] min-w-0 pl-4 relative pt-28"
            >
              <div className="group cursor-pointer relative">

                {showEmbeds && project.instagramPostUrl ? (
                  <div className="mb-6 relative z-10 transition-transform duration-500 group-hover:-translate-y-2">
                    <div className="overflow-hidden rounded-xl shadow-2xl bg-white dark:bg-black">
                      <InstagramEmbed url={project.instagramPostUrl} />
                    </div>
                  </div>
                ) : (
                  projectUrl ? (
                    <Link href={projectUrl} target="_blank" rel="noopener noreferrer" className="block mb-6 relative z-10 transition-transform duration-500 group-hover:-translate-y-2">
                      <div className="aspect-square md:rounded-[240px] bg-white/100 overflow-hidden relative flex items-center justify-center p-12 shadow-2xl rounded-sm">
                        {/* Main Content - Project Logo */}
                        <div className="relative w-full h-full z-10 transition-transform duration-500 group-hover:scale-105">
                          <Image
                            src={project.logo}
                            alt={`Logo de ${project.name}`}
                            fill
                            loading="lazy"
                            quality={75}
                            sizes="(max-width: 640px) 85vw, (max-width: 768px) 45vw, (max-width: 1024px) 25vw, 20vw"
                            className={`object-contain transition-transform duration-500 ${project.bright ? 'brightness-0' : ''} ${project.invert ? 'invert dark:invert-0' : ''}`}
                          />
                        </div>
                      </div>
                    </Link>
                  ) : (
                    <div className="aspect-square md:rounded-[240px] bg-neutral-950 dark:bg-white mb-6 overflow-hidden relative flex items-center justify-center p-12 transition-transform duration-500 group-hover:-translate-y-2 z-10 shadow-2xl rounded-sm">
                      {/* Main Content - Project Logo */}
                      <div className="relative w-full h-full z-10 transition-transform duration-500 group-hover:scale-105">
                        <Image
                          src={project.logo}
                          alt={`Logo de ${project.name}`}
                          fill
                          loading="lazy"
                          quality={75}
                          sizes="(max-width: 640px) 85vw, (max-width: 768px) 45vw, (max-width: 1024px) 25vw, 20vw"
                          className={`object-contain transition-transform duration-500 ${project.bright ? 'brightness-0' : ''} ${project.invert ? 'invert dark:invert-0' : ''}`}
                        />
                      </div>
                    </div>
                  )
                )}

                <div className="flex justify-between items-baseline border-b border-foreground/10 pb-4 group-hover:border-foreground transition-colors duration-300 relative z-10">
                  <h3 className="text-2xl font-medium">{project.name}</h3>
                  <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">{project.year}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
}
