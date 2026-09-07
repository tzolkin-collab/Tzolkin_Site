'use client'
import React from 'react'
import Image from 'next/image'

interface LogoMarqueeProps {
  items: {
    name: string;
    logo: string;
    bright?: boolean;
    invert?: boolean;
  }[]
  speed?: number
}

export function LogoMarquee({ items, speed = 1 }: LogoMarqueeProps) {
  // Speed factor to adjust animation duration
  // Default 20s for speed 1. Higher speed = Lower duration.
  const duration = 30 / speed;

  return (
    <div className="w-full overflow-hidden bg-background py-8 border-y border-border relative z-20">
      <div
        className="flex animate-marquee touch-pan-y items-center"
        style={{ '--marquee-duration': `${duration}s` } as React.CSSProperties}
      >
        {/* First Set */}
        {items.map((item, index) => (
          <div
            key={`orig-${index}`}
            className="flex-[0_0_auto] min-w-0 mr-12 md:mr-24 relative h-16 w-32 md:h-20 md:w-48 opacity-90 hover:opacity-100 transition-all duration-300 hover:scale-105"
          >
            <Image
              src={item.logo}
              alt={item.name}
              fill
              className="object-contain"
              sizes="(min-width: 1024px) 192px, 128px"
            />
          </div>
        ))}

        {/* Duplicate Set for Infinite Loop */}
        {items.map((item, index) => (
          <div
            key={`dup-${index}`}
            className="flex-[0_0_auto] min-w-0 mr-12 md:mr-24 relative h-16 w-32 md:h-20 md:w-48 opacity-90 hover:opacity-100 transition-all duration-300 hover:scale-105"
          >
            <Image
              src={item.logo}
              alt={item.name}
              fill
              className="object-contain"
              sizes="(min-width: 1024px) 192px, 128px"
            />
          </div>
        ))}
      </div>
    </div>
  )
}
