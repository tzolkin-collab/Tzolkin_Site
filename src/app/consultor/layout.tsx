import { Header } from '@/client/shared/ui/Header';
import React from 'react';

export const metadata = {
  title: 'Consultor de Vendas IA | TZOLKIN',
  description: 'Converse com o consultor virtual da TZOLKIN por texto ou voz e descubra a solução ideal para o seu negócio.',
};

export default function ConsultorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-[100dvh] flex flex-col font-sans bg-background text-foreground overflow-hidden">
      <Header />
      <main className="flex-1 pt-20 md:pt-24 px-2 sm:px-4 flex flex-col overflow-hidden">
        {children}
      </main>
    </div>
  );
}
