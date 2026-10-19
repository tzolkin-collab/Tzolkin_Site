import { Header } from '@/client/shared/ui/Header';
import React from 'react';

export const metadata = {
  title: 'Iniciar Projeto | TZOLKIN',
  description: 'Conte o que você quer construir ou melhorar e a equipe da TZOLKIN responde pelo canal que você escolher.',
};

export default function FormsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-[100dvh] flex flex-col font-sans bg-background text-foreground overflow-hidden">
      <Header />
      <main className="flex-1 pt-20 md:pt-24 px-2 sm:px-4 flex flex-col overflow-hidden">
        {children}
      </main>
    </div>
  );
}
