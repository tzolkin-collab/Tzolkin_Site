'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MessageCircle } from 'lucide-react';

/** Contato sempre à mão no celular: faixa fina colada no fundo e nas laterais. Some no formulário. */
export function MobileCta() {
  const pathname = usePathname();
  if (pathname?.startsWith('/forms')) return null;
  return (
    <Link
      href="/forms"
      className="fixed inset-x-0 bottom-0 z-30 flex h-10 items-center justify-center gap-1.5 bg-brand pb-[env(safe-area-inset-bottom)] text-[13px] font-semibold text-brand-foreground transition-colors hover:bg-brand/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white lg:hidden"
    >
      <MessageCircle size={15} aria-hidden="true" />
      Fale com a TZOLKIN
    </Link>
  );
}
