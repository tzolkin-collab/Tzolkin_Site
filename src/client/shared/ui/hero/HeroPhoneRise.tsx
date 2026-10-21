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
const BANDS_MASK = 'linear-gradient(to top, transparent 0%, #000 22%, #000 40%, transparent 100%)';
const COVER_MASK = 'linear-gradient(to top, transparent 0%, #000 16%, rgba(0,0,0,0.8) 55%, rgba(0,0,0,0.3) 100%)';

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
  const enter = useTransform(p, [0.04, 0.4], [0, 1], { clamp: true, ease: SETTLE });
  const y = useTransform(enter, [0, 1], ['46svh', '-11svh']);
  const scale = useTransform(enter, [0, 1], [0.95, 1.2]);
  const rotateX = useTransform(enter, [0, 1], [14, 0]);
  const rotateZ = useTransform(enter, [0, 1], [-2, 0]);
  
  // Motion blur real, só durante o movimento da subida: acompanha a velocidade do scroll (até 3,5px), some ao parar e some de vez quando o aparelho assenta.
  const velocity = useSpring(useVelocity(scrollY), { stiffness: 220, damping: 40 });
  // Zona morta: parado ou quase parado não tem desfoque nenhum. E só vale durante a subida do aparelho:
  // o peso cai a zero quando ele assenta, então rolar durante as etapas da conversa não desfoca nada.
  const blur = useTransform([velocity, p], ([v, prog]: number[]) => {
    // Progresso linear da subida (0.04 a 0.40 da pista): o peso cai de 1 a 0 ao longo dela.
    const live = Math.min(1, Math.max(0, 1 - (prog - 0.04) / 0.34));
    const b = Math.min(3.5, Math.max(0, Math.abs(v) - 80) / 420) * live;
    return b < 0.15 ? 'none' : `blur(${b.toFixed(2)}px)`;
  });

  // Linhas bézier e faixas acompanham a entrada.
  const draw = useTransform(enter, [0.05, 1], [0, 1]);
  const bandsOpacity = useTransform(enter, [0, 0.7], [0.9, 1]);
  // O fundo (faixas sobre a cor da página) sobe de baixo e cobre o texto por completo.
  const coverY = useTransform(enter, [0, 0.85], ['100svh', '0svh']);

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
    el.style.opacity = String(Math.max(0, 1 - 1.05 * e));
    el.style.transform = `translateY(${(-24 * e).toFixed(1)}px) scale(${(1 - 0.06 * e).toFixed(3)})`;
  });

  // Etapas: depois que o aparelho assentou.
  useMotionValueEvent(p, 'change', (v) => {
    const s = Math.min(1, Math.max(0, (v - 0.48) / 0.42));
    setStep(Math.min(2, Math.floor(s * 3)));
  });

  const phoneStyle = reduce ? undefined : { y, scale, rotateX, rotateZ, filter: blur, transformPerspective: 900 };

  return (
    <div className="pointer-events-none absolute inset-0 z-20 lg:hidden">
      {/* fundo que sobe e cobre o texto: cor da página + faixas do hero */}
      <motion.div aria-hidden="true" className="absolute inset-0 bg-background" style={{ y: reduce ? '0svh' : coverY, opacity: reduce ? 0 : 1 }}>
        <div className="absolute inset-0" style={{ WebkitMaskImage: COVER_MASK, maskImage: COVER_MASK }}>
          <HeroBands />
        </div>
      </motion.div>

      <motion.div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-[34%]"
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
        <motion.div style={phoneStyle} className="">
          <HeroMockups step={step} />
        </motion.div>
      </div>
    </div>
  );
}
