'use client';

import { useState, type RefObject } from 'react';
import {
  cubicBezier,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from 'framer-motion';
import { HeroBands } from './HeroBackground';
import { HeroMockups } from './HeroMockups';

// Curva de saída suave (ease-out-cubic): arranca firme e assenta devagar.
const SETTLE = cubicBezier(0.33, 1, 0.68, 1);
const BANDS_MASK = 'linear-gradient(to top, #000 0%, #000 35%, transparent 100%)';

/**
 * Palco do hero no celular. Fica DENTRO do bloco fixo do hero (o texto continua atrás) e é conduzido pelo scroll
 * da seção inteira: o aparelho entra de baixo da tela por cima do texto, com zoom, inclinação 3D, desfoque que também
 * acompanha a velocidade do scroll e curvas bézier que se desenham; o texto (#hero-copy) esmaece e recua.
 * Depois as três etapas da conversa avançam. Só transform, opacity e filter; nada se move sozinho.
 */
export function HeroPhoneRise({ target }: { target: RefObject<HTMLElement | null> }) {
  const reduce = useReducedMotion();
  const [step, setStep] = useState(0);

  const { scrollYProgress: p } = useScroll({ target, offset: ['start start', 'end end'] });
  const { scrollY } = useScroll();

  // Entrada: primeiros 32% da pista.
  const enter = useTransform(p, [0, 0.32], [0, 1], { clamp: true, ease: SETTLE });
  const y = useTransform(enter, [0, 1], ['88svh', '0svh']);
  const scale = useTransform(enter, [0, 1], [0.8, 1]);
  const rotateX = useTransform(enter, [0, 1], [34, 0]);
  const rotateZ = useTransform(enter, [0, 1], [-5, 0]);
  const enterBlur = useTransform(enter, [0, 1], [8, 0]);

  // Motion blur real: acompanha a velocidade do scroll (até 3px), suavizado por mola.
  const velocity = useSpring(useVelocity(scrollY), { stiffness: 220, damping: 40 });
  const velBlur = useTransform(velocity, (v) => Math.min(3, Math.abs(v) / 450));
  const blur = useTransform([enterBlur, velBlur], ([a, b]: number[]) => `blur(${(a + b).toFixed(2)}px)`);

  // Linhas bézier e faixas acompanham a entrada.
  const draw = useTransform(enter, [0.05, 1], [0, 1]);
  const bandsOpacity = useTransform(enter, [0, 0.7], [0, 1]);

  // O texto do hero recua e esmaece enquanto o aparelho sobe por cima dele.
  useMotionValueEvent(enter, 'change', (e) => {
    const el = document.getElementById('hero-copy');
    if (!el) return;
    // Só no celular (abaixo de lg). No desktop o texto não é mexido e qualquer resto é limpo.
    if (reduce || !window.matchMedia('(max-width: 1023px)').matches) {
      el.style.opacity = '';
      el.style.transform = '';
      return;
    }
    el.style.opacity = String(1 - 0.78 * e);
    el.style.transform = `translateY(${(-18 * e).toFixed(1)}px) scale(${(1 - 0.05 * e).toFixed(3)})`;
  });

  // Etapas: depois que o aparelho assentou.
  useMotionValueEvent(p, 'change', (v) => {
    const s = Math.min(1, Math.max(0, (v - 0.42) / 0.46));
    setStep(Math.min(2, Math.floor(s * 3)));
  });

  const phoneStyle = reduce ? undefined : { y, scale, rotateX, rotateZ, filter: blur, transformPerspective: 900 };

  return (
    <div className="pointer-events-none absolute inset-0 z-20 lg:hidden">
      <motion.div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-[70%]"
        style={{ opacity: reduce ? 1 : bandsOpacity, WebkitMaskImage: BANDS_MASK, maskImage: BANDS_MASK }}
      >
        <HeroBands />
      </motion.div>

      <motion.svg
        aria-hidden="true"
        viewBox="0 0 390 844"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full text-brand"
        style={{ opacity: reduce ? 0 : bandsOpacity }}
        fill="none"
      >
        <motion.path d="M -20 800 C 90 740, 40 520, 190 470 S 330 260, 410 120" stroke="currentColor" strokeWidth="1.25" style={{ pathLength: draw }} />
        <motion.path d="M -20 840 C 130 800, 70 600, 215 540 S 360 360, 410 250" stroke="currentColor" strokeWidth="1" strokeOpacity="0.6" style={{ pathLength: draw }} />
        <motion.path d="M 60 860 C 120 760, 250 740, 290 620 S 330 430, 410 360" stroke="currentColor" strokeWidth="1" strokeOpacity="0.4" style={{ pathLength: draw }} />
      </motion.svg>

      <div className="absolute inset-x-0 bottom-3 flex justify-center px-6" style={{ perspective: 900 }}>
        <motion.div style={phoneStyle} className="will-change-transform">
          <HeroMockups step={step} />
        </motion.div>
      </div>
    </div>
  );
}
