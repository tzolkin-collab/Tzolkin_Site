'use client';

import React from 'react';
import { motion } from 'framer-motion';

export interface PrismBackgroundProps {
  className?: string;
  colors?: string[];
  opacity?: number;
  speed?: number;
}

export function PrismBackground({
  className = '',
  opacity = 1,
}: PrismBackgroundProps) {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`} style={{ opacity }}>
      {/* Clean subtle ambient gradient without expensive continuous blur filters or animations */}
      <div className="absolute inset-0 bg-radial-gradient opacity-30" />
    </div>
  );
}
