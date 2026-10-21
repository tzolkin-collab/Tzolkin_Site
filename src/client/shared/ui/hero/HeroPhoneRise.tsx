'use client';

import { useRef, useState } from 'react';
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

// Curva de saída suave (ease-out-cubic): arranca firme e assenta devagar, sem terminar cedo demais.
const SETTLE = cubicBezier(0.33, 1, 0.68, 1);
const BANDS_MASK = 'linear-gradient(to top, transparent 0%, #000 22%, #000 62%, transparent 100%)';

/**
 * Hero do celular. O aparelho sobe no fluxo normal da página (o scroll não é sequestrado): conforme entra na tela,
 * ganha escala, perde a inclinação 3D e o desfoque, e linhas bézier se desenham atrás dele. O desfoque também
 * acompanha a velocidade do scroll (motion blur) e some quando para. Depois de assentar, as três etapas da conversa
 * avançam com o próprio scroll. Só transform, opacity e filter; sem animação contínua parada.
 */
export function HeroPhoneRise() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [step, setStep] = useState(0);

  // 0 quando o topo do bloco chega a 80% da altura da tela, 1 quando o bloco sai pelo topo.
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start 0.8', 'end start'] });
  const { scrollY } = useScroll();

  // Entrada: acontece no primeiro terço do trajeto.
  const enter = useTransform(p, [0, 0.36], [0, 1], { clamp: true, ease: SETTLE });
  const y = useTransform(enter, [0, 1], [150, 0]);
  const scale = useTransform(enter, [0, 1], [0.8, 1]);
  const rotateX = useTransform(enter, [0, 1], [32, 0]);
  const rotateZ = useTransform(enter, [0, 1], [-4, 0]);
  const enterBlur = useTransform(enter, [0, 1], [7, 0]);

  // Motion blur: quanto mais rápido o scroll, mais desfoque (até 3px), suavizado por mola.
  const velocity = useSpring(useVelocity(scrollY), { stiffness: 220, damping: 40 });
  const velBlur = useTransform(velocity, (v) => Math.min(3, Math.abs(v) / 450));
  const blur = useTransform([enterBlur, velBlur], ([a, b]: number[]) => `blur(${(a + b).toFixed(2)}px)`);

  // Linhas bézier: se desenham durante a entrada e ficam.
  const draw = useTransform(p, [0.02, 0.4], [0, 1], { clamp: true, ease: SETTLE });
  const lineOpacity = useTransform(p, [0, 0.12, 0.8, 1], [0, 1, 1, 0]);

  // Etapas da conversa: depois que o aparelho assentou.
  useMotionValueEvent(p, 'change', (v) => {
    const s = Math.min(1, Math.max(0, (v - 0.5) / 0.3));
    setStep(Math.min(2, Math.floor(s * 3)));
  });

  const motionStyle = reduce ? undefined : { y, scale, rotateX, rotateZ, filter: blur, transformPerspective: 900 };

  return (
    <div ref={ref} className="relative overflow-hidden pb-16 pt-10 lg:hidden">
      {/* faixas do hero embaixo, dissolvidas nas duas pontas */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-[78%]" style={{ WebkitMaskImage: BANDS_MASK, maskImage: BANDS_MASK }}>
        <HeroBands />
      </div>

      {/* linhas bézier atrás do aparelho */}
      <motion.svg
        aria-hidden="true"
        viewBox="0 0 390 640"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-0 h-full w-full text-brand"
        style={{ opacity: reduce ? 0 : lineOpacity }}
        fill="none"
      >
        <motion.path d="M -20 560 C 90 520, 40 330, 190 300 S 330 140, 410 40" stroke="currentColor" strokeWidth="1.25" style={{ pathLength: draw }} />
        <motion.path d="M -20 610 C 130 590, 70 400, 215 360 S 360 200, 410 120" stroke="currentColor" strokeWidth="1" strokeOpacity="0.6" style={{ pathLength: draw }} />
        <motion.path d="M 60 650 C 120 560, 250 540, 290 430 S 330 250, 410 210" stroke="currentColor" strokeWidth="1" strokeOpacity="0.4" style={{ pathLength: draw }} />
      </motion.svg>

      <div className="relative z-10 flex justify-center px-6" style={{ perspective: 900 }}>
        <motion.div style={motionStyle} className="will-change-transform">
          <HeroMockups step={step} />
        </motion.div>
      </div>
    </div>
  );
}
