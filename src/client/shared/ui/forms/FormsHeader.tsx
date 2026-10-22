'use client';

import Link from 'next/link';
import { ModeToggle } from '@/client/shared/ui/ModeToggle';

/** Marca sem fundo nem borda: o anel e o disco, na cor do texto. */
function LogoMark({ size = 26 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="8 12 44 40" aria-hidden="true" className="shrink-0">
      <circle cx="26" cy="32" r="14" fill="none" stroke="currentColor" strokeWidth="2.4" />
      <circle cx="38" cy="32" r="14" fill="currentColor" />
    </svg>
  );
}

/**
 * Cabeçalho simplificado dos formulários: logo e troca de tema, sem links nem menu. No desktop a logo fica sobre a foto
 * (branca); no celular, sobre o fundo da página (cor do texto).
 */
export function FormsHeader() {
  return (
    <header className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-center justify-between px-6 py-5 md:px-10">
      <Link href="/" aria-label="TZOLKIN, página inicial" className="pointer-events-auto flex select-none items-center gap-2.5 text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand lg:text-white">
        <LogoMark />
        <span style={{ fontFamily: 'var(--font-brand)' }} className="text-[17px] font-semibold uppercase leading-none tracking-[0.5px]">TZOLKIN</span>
      </Link>
      <div className="pointer-events-auto">
        <ModeToggle />
      </div>
    </header>
  );
}
