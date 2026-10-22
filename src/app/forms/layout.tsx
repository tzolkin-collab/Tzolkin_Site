import { FormsHeader } from '@/client/shared/ui/forms/FormsHeader';
import React from 'react';

export const metadata = {
  title: 'Iniciar Projeto | TZOLKIN',
  description: 'Conte o que você quer construir ou melhorar e a equipe da TZOLKIN responde pelo canal que você escolher.',
};

export default function FormsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex h-[100dvh] flex-col overflow-hidden bg-background font-sans text-foreground">
      <FormsHeader />
      <main className="flex min-h-0 flex-1 flex-col">{children}</main>
    </div>
  );
}
