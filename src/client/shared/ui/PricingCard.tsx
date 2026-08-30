'use client';

import React, { useId, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { Button } from '@/client/shared/ui/Button';
import Link from 'next/link';
import { appendTzolkinUtm } from '@/client/shared/utils/utm';

export interface PricingCardProps {
  title: string;
  slug: string;
  dropPrice?: string;
  price?: string;
  paymentText?: string;
  description: string;
  features: string[];
  popular?: boolean;
  ctaText?: string;
  ctaHref?: string;
  maintenance?: {
    percent: string;
    tagline: string;
    includes: string[];
  };
}

export function PricingCard({
  title,
  slug,
  dropPrice,
  price,
  paymentText,
  description,
  features,
  popular,
  ctaText,
  ctaHref,
  maintenance,
}: PricingCardProps) {
  const [withMaintenance, setWithMaintenance] = useState(false);
  const segmentId = useId();
  const destinationHref = appendTzolkinUtm(ctaHref || `/servicos/${slug}`);
  const isExternal = destinationHref.startsWith('http');

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className={`relative flex flex-col h-full p-6 sm:p-8 md:p-10 rounded-3xl border w-[85vw] max-w-[340px] md:max-w-none md:w-[420px] shrink-0 ${popular
        ? 'bg-brand/5 border-brand/50 shadow-lg shadow-brand/5'
        : 'bg-card border-border/50 hover:border-brand/30'
        }`}
    >
      {popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-brand border border-brand/50 text-brand-foreground text-xs font-bold uppercase tracking-widest rounded-full whitespace-nowrap shadow-sm">
          Mais Procurado
        </div>
      )}

      <div className="mb-8">
        <h3 className="text-2xl font-bold text-foreground mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground min-h-[40px] leading-relaxed">{description}</p>
      </div>

      {maintenance && (
        <div className="mb-8">
          <div
            role="group"
            aria-label="Formato de contratação"
            className="grid grid-cols-2 gap-1 p-1 rounded-full border border-border/50 bg-foreground/5"
          >
            {(['Projeto único', 'Com manutenção assinada'] as const).map((option, idx) => {
              const isActive = withMaintenance === (idx === 1);
              return (
                <button
                  key={option}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setWithMaintenance(idx === 1)}
                  className={`relative flex min-h-[40px] items-center justify-center px-3 py-2 rounded-full text-center text-[11px] font-bold uppercase tracking-wider leading-tight transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand ${isActive
                    ? 'text-brand-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                    }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId={`${segmentId}-segment-pill`}
                      className="absolute inset-0 rounded-full bg-brand"
                      transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                    />
                  )}
                  <span className="relative z-10">{option}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {price && (
        <div className="mb-8">
          <span className="block text-xs font-bold tracking-widest text-muted-foreground uppercase mb-2">A partir de</span>
          <div className="flex items-end gap-3 mb-3">
            {dropPrice && (
              <span className="text-2xl font-bold text-muted-foreground/40 line-through decoration-brand/50 mb-1">{dropPrice}</span>
            )}
            <span className="text-3xl font-black tracking-tight text-foreground">{price}</span>
          </div>
          {paymentText && (
            <p className="inline-block px-2 py-0.5 bg-foreground text-xs font-bold text-background uppercase tracking-wider rounded-sm">{paymentText}</p>
          )}
          <AnimatePresence initial={false}>
            {withMaintenance && maintenance && (
              <motion.p
                key="maintenance-fee"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2 }}
                className="block w-fit mt-2 px-2 py-0.5 bg-brand text-xs font-bold text-brand-foreground uppercase tracking-wider rounded-sm"
              >
                + {maintenance.percent} por transação
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      )}

      <AnimatePresence initial={false}>
        {withMaintenance && maintenance && (
          <motion.div
            key="maintenance-includes"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="pb-8">
              <div className="rounded-2xl border border-brand/30 bg-brand/5 p-5">
                <p className="text-xs font-bold uppercase tracking-widest text-brand mb-3">Manutenção assinada</p>
                <p className="text-sm text-foreground/80 font-medium mb-4">{maintenance.tagline}</p>
                <div className="space-y-3">
                  {maintenance.includes.map((item) => (
                    <div key={item} className="flex items-start gap-3">
                      <Check className="w-4 h-4 text-brand shrink-0 mt-0.5" />
                      <span className="text-sm text-foreground/80 leading-relaxed font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-4 mb-8 flex-1">
        {features.map((feature, idx) => (
          <div key={idx} className="flex items-start gap-3">
            <Check className="w-5 h-5 text-brand shrink-0 mt-0.5" />
            <span className="text-sm text-foreground/80 leading-relaxed font-medium">{feature}</span>
          </div>
        ))}
      </div>

      <div className="mt-auto pt-2">
        <Link
          href={destinationHref}
          target={isExternal ? '_blank' : undefined}
          rel={isExternal ? 'noopener noreferrer' : undefined}
          className="block"
        >
          <Button
            variant={popular ? 'brand' : 'primary'}
            size="lg"
            className="w-full text-sm hover:scale-[1.02]"
          >
            {ctaText || 'Tenho Interesse'}
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}
