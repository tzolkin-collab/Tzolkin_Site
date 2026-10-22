'use client';

import { useRef, useState } from 'react';
import { cubicBezier, motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { applications } from '@/client/shared/data/homeData';
import { HeroBands } from '@/client/shared/ui/hero/HeroBackground';
import { ServicesContent } from '@/client/shared/ui/ServicesSection';
import { MethodContent } from '@/client/shared/ui/MethodTOISection';

const COUNT = applications.length;
const STEPS = 3;

// Comprimento do scroll, em telas: Aplicações (5 etapas), a troca, e Como construímos (3 etapas).
const APPS = 260;
const SWAP = 100;
const METHOD = 200;
const TOTAL = APPS + SWAP + METHOD;
const F1 = APPS / TOTAL;
const F2 = (APPS + SWAP) / TOTAL;

const SETTLE = cubicBezier(0.33, 1, 0.68, 1);
const layer = 'absolute inset-0 flex flex-col pb-[calc(100lvh-100svh+3rem)] pt-[72px] xl:justify-center xl:pb-6 xl:pt-[76px]';

/**
 * Aplicações e Como construímos no mesmo palco: o fundo e a laje ficam parados e só o conteúdo muda.
 * No fim de Aplicações o conteúdo sobe e some, e o de Como construímos sobe de baixo e toma o lugar,
 * sem a página descer. Só transform e opacity, ligados ao scroll; nada se move sozinho.
 */
export function ApplicationsMethodStory() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const [step, setStep] = useState(0);
  const [phase, setPhase] = useState<'apps' | 'method'>('apps');

  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const swap = useTransform(p, [F1, F2], [0, 1], { clamp: true, ease: SETTLE });
  const methodProgress = useTransform(p, [F2, 1], [0, 1], { clamp: true });

  const bandsOut = useTransform(swap, [0, 1], [1, 0]);
  const bandsIn = swap;
  const yOut = useTransform(swap, [0, 1], ['0vh', '-14vh']);
  const opOut = useTransform(swap, [0, 0.7], [1, 0]);
  const yIn = useTransform(swap, [0.3, 1], ['14vh', '0vh']);
  const opIn = useTransform(swap, [0.35, 1], [0, 1]);

  useMotionValueEvent(p, 'change', (v) => {
    setActive(Math.min(COUNT - 1, Math.max(0, Math.floor((v / F1) * COUNT))));
    setStep(Math.min(STEPS - 1, Math.max(0, Math.floor(((v - F2) / (1 - F2)) * STEPS))));
    setPhase(v > (F1 + F2) / 2 ? 'method' : 'apps');
  });

  const goTo = (i: number) => {
    setActive(i);
    const el = ref.current;
    if (el) {
      const range = el.offsetHeight - window.innerHeight;
      window.scrollTo({ top: el.offsetTop + range * F1 * ((i + 0.5) / COUNT), behavior: 'smooth' });
    }
  };

  return (
    <section ref={ref} className="relative h-[660svh] w-full bg-background">
      {/* âncoras da navegação: #aplicacoes no começo e #como-construimos onde a troca termina */}
      <div id="aplicacoes" aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-px" />
      <div id="como-construimos" aria-hidden="true" className="pointer-events-none absolute inset-x-0 h-px" style={{ top: `${APPS + SWAP}svh` }} />

      <div className="sticky top-0 h-[100lvh] overflow-hidden">
        {/* laje fixa (52% da tela, sangrando até a borda): é do palco, não de nenhuma das duas */}
        {/* No desktop é a laje à direita; no celular é uma faixa atrás da demonstração, que some para cima. */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-[62%] overflow-hidden bg-background [--slab-mask:linear-gradient(to_left,#000_38%,rgba(0,0,0,0.45)_62%,transparent_92%)] max-xl:[mask-image:linear-gradient(to_bottom,transparent,black_32%)] max-xl:[-webkit-mask-image:linear-gradient(to_bottom,transparent,black_32%)] xl:inset-y-0 xl:left-auto xl:right-0 xl:h-auto xl:w-[52%]"
        >
          {/* Como construímos: as faixas do hero espelhadas na vertical (sobem de baixo); Aplicações: como no hero (caem de cima) */}
          <motion.div className="absolute inset-0 xl:[mask-image:var(--slab-mask)] xl:[-webkit-mask-image:var(--slab-mask)] " style={{ opacity: bandsIn }}>
            <div className="absolute inset-0 scale-y-[-1]"><HeroBands /></div>
          </motion.div>
          <motion.div className="absolute inset-0 xl:[mask-image:var(--slab-mask)] xl:[-webkit-mask-image:var(--slab-mask)]" style={{ opacity: bandsOut }}>
            <HeroBands />
          </motion.div>
        </div>

        <motion.div
          role="region"
          aria-labelledby="aplicacoes-title"
          aria-hidden={phase !== 'apps'}
          inert={phase !== 'apps'}
          className={layer}
          style={reduce ? { opacity: phase === 'apps' ? 1 : 0 } : { y: yOut, opacity: opOut }}
        >
          <ServicesContent active={active} onSelect={goTo} />
        </motion.div>

        <motion.div
          role="region"
          aria-labelledby="como-construimos-title"
          aria-hidden={phase !== 'method'}
          inert={phase !== 'method'}
          className={layer}
          style={reduce ? { opacity: phase === 'method' ? 1 : 0 } : { y: yIn, opacity: opIn }}
        >
          <MethodContent step={step} progress={methodProgress} />
        </motion.div>
      </div>
    </section>
  );
}
