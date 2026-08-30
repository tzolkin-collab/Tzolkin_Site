import React from 'react';
import type { Metadata } from 'next';
import { Header } from '@/client/shared/ui/Header';
import { ProductsShowcase } from '@/client/pages/produtos/ProductsShowcase';

export const metadata: Metadata = {
  title: 'Serviços & Soluções | TZOLKIN — tzolkin.cloud',
  description:
    'Conheça os serviços e soluções de software da TZOLKIN: Landing Pages de alta conversão, E-commerce Global Headless, Tagueamento de Fluxo & CAPI, Pagamentos e Sistemas de Mensalidade.',
  openGraph: {
    title: 'Serviços & Soluções | TZOLKIN',
    description:
      'Landing pages de alta conversão, e-commerces escaláveis, tagueamento server-side e plataformas de software sob medida.',
    siteName: 'TZOLKIN',
  },
};

export default function ServicosPage() {
  return (
    <main className="h-screen h-dvh flex flex-col bg-background text-foreground overflow-hidden">
      <Header />
      <div className="flex-1 flex flex-col justify-center">
        <ProductsShowcase />
      </div>
    </main>
  );
}
