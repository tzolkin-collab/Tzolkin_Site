'use client';

import React from 'react';
import { motion, SVGMotionProps, Variants } from 'framer-motion';

interface TzolkinLogoProps extends Omit<SVGMotionProps<SVGSVGElement>, 'children'> {
  size?: number;
  className?: string;
  variant?: 'adaptive' | 'dark' | 'light';
  animated?: boolean;
}

export function TzolkinLogo({
  size = 40,
  className = '',
  variant = 'adaptive',
  animated = true,
  ...props
}: TzolkinLogoProps) {
  // Configuração de cores por variante ou adaptativa via Tailwind/CSS classes
  const isAdaptive = variant === 'adaptive';
  const isDark = variant === 'dark';

  const bgColor = isAdaptive
    ? 'fill-foreground dark:fill-card border border-border/40'
    : isDark
    ? 'fill-[#0A0A0A]'
    : 'fill-[#FAFAF7]';

  const strokeColor = isAdaptive
    ? 'stroke-background dark:stroke-foreground'
    : isDark
    ? 'stroke-[#FAFAF7]'
    : 'stroke-[#0A0A0A]';

  const fillColor = isAdaptive
    ? 'fill-background dark:fill-foreground'
    : isDark
    ? 'fill-[#FAFAF7]'
    : 'fill-[#0A0A0A]';

  // Variantes de animação de entrada com Framer Motion
  const squircleVariants: Variants = {
    initial: animated ? { scale: 0.8, opacity: 0 } : {},
    animate: {
      scale: 1,
      opacity: 1,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
    },
    hover: {
      scale: 1.05,
      transition: { duration: 0.3, ease: 'easeOut' },
    },
  };

  const ringVariants: Variants = {
    initial: animated ? { pathLength: 0, opacity: 0, rotate: -60 } : {},
    animate: {
      pathLength: 1,
      opacity: 1,
      rotate: 0,
      transition: {
        pathLength: { duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.15 },
        opacity: { duration: 0.4, delay: 0.1 },
        rotate: { duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.1 },
      },
    },
    hover: {
      x: 12,
      scale: 1.06,
      transition: { type: 'spring', stiffness: 300, damping: 20 },
    },
  };

  const coreVariants: Variants = {
    initial: animated ? { scale: 0, opacity: 0 } : {},
    animate: {
      scale: 1,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 18,
        delay: 0.35,
      },
    },
    hover: {
      x: -12,
      scale: 1.06,
      transition: { type: 'spring', stiffness: 300, damping: 20 },
    },
  };

  const glowVariants: Variants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: {
      opacity: [0, 0.3, 0],
      scale: [0.8, 1.2, 0.9],
      transition: {
        duration: 3,
        repeat: Infinity,
        repeatType: 'reverse' as const,
        ease: 'easeInOut',
      },
    },
    hover: {
      opacity: 0.55,
      scale: 1.3,
      transition: { duration: 0.3 },
    },
  };

  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="TZOLKIN Logo"
      className={`select-none shrink-0 ${className}`}
      initial="initial"
      animate="animate"
      whileHover="hover"
      {...props}
    >
      {/* Glow pulsante de eclipse orbital */}
      <motion.circle
        cx="32"
        cy="32"
        r="18"
        className="fill-brand pointer-events-none"
        style={{ filter: 'blur(8px)' }}
        variants={glowVariants}
      />

      {/* Squircle base */}
      <motion.rect
        x="0"
        y="0"
        width="64"
        height="64"
        rx="16"
        ry="16"
        className={bgColor}
        variants={squircleVariants}
      />

      {/* Círculo Esquerdo (Órbita / Ring) */}
      <motion.circle
        cx="26"
        cy="32"
        r="14"
        fill="none"
        strokeWidth="2.6"
        strokeLinecap="round"
        className={strokeColor}
        style={{ originX: '26px', originY: '32px' }}
        variants={ringVariants}
      />

      {/* Círculo Direito (Núcleo / Eclipse) */}
      <motion.circle
        cx="38"
        cy="32"
        r="14"
        className={fillColor}
        style={{ originX: '38px', originY: '32px' }}
        variants={coreVariants}
      />
    </motion.svg>
  );
}
