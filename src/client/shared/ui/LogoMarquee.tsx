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

/**
 * Faixa de logos em tom neutro (silhueta cinza) com animação CSS pura.
 * Todos os logos recebem o mesmo tratamento, o que dispensa o cartão escuro
 * para logos claros: brightness-0 vira silhueta preta e dark:invert, branca.
 */
export function LogoMarquee({ items, speed = 1 }: LogoMarqueeProps) {
  const duration = 30 / speed;

  const renderSet = (keyPrefix: string) =>
    items.map((item, index) => (
      <div
        key={`${keyPrefix}-${index}`}
        className="relative mr-8 h-16 w-36 flex-[0_0_auto] md:mr-14 md:h-20 md:w-48"
      >
        <Image
          src={item.logo}
          alt={item.name}
          fill
          className="object-contain opacity-50 brightness-0 dark:invert"
          sizes="(min-width: 768px) 192px, 144px"
        />
      </div>
    ));

  return (
    <div className="relative w-full overflow-hidden py-6">
      <div
        className="flex animate-marquee touch-pan-y items-center"
        style={{ '--marquee-duration': `${duration}s` } as React.CSSProperties}
      >
        {renderSet('orig')}
        {renderSet('dup')}
      </div>
    </div>
  )
}
