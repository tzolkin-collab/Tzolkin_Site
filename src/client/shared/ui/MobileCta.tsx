'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MessageCircle } from 'lucide-react';

/** Contato sempre à mão no celular: faixa colada no fundo e nas laterais. Some no formulário. */
export function MobileCta() {
  const pathname = usePathname();
  if (pathname?.startsWith('/forms')) return null;
  return (
    <Link
      href="/forms"
      className="fixed inset-x-0 bottom-0 z-30 transform-gpu bg-brand pb-[env(safe-area-inset-bottom)] text-brand-foreground transition-colors hover:bg-brand/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white lg:hidden"
    >
      <span className="flex h-12 items-center justify-center gap-1.5 text-[14px] font-semibold leading-none">
        <MessageCircle size={16} aria-hidden="true" />
        Fale com a TZOLKIN
      </span>
    </Link>
  );
}
