import { FormProvider } from '@/client/shared/ui/forms/FormContext';
import { Header } from '@/client/shared/ui/Header';
import { Footer } from '@/client/shared/ui/Footer';
import React from 'react';
import Link from 'next/link';
import { LEAD_SUBMISSIONS_ENABLED, LEAD_SUBMISSIONS_PAUSED_MESSAGE } from '@/lib/lead-submissions.mjs';

export const metadata = {
  title: "Iniciar projeto",
  description: "Fale com a equipe TZOLKIN sobre o seu projeto.",
};

export default function FormsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-background text-foreground">
      <Header />

      {/* ProgressBar/Indicator could go here if needed, or inside the children flow */}
      <main className="flex-1 pt-52 pb-24 flex items-center justify-center">
        {LEAD_SUBMISSIONS_ENABLED ? (
          <FormProvider>{children}</FormProvider>
        ) : (
          <section className="w-full max-w-2xl px-6 text-center space-y-6">
            <h1 className="text-3xl md:text-5xl font-bold">Vamos conversar sobre seu projeto?</h1>
            <p role="status" className="text-lg text-muted-foreground">{LEAD_SUBMISSIONS_PAUSED_MESSAGE}</p>
            <a href="mailto:contato@tzolkin.com.br" className="inline-block rounded-full bg-foreground text-background px-8 py-4 font-semibold">Enviar e-mail</a>
            <div><Link href="/" className="underline underline-offset-4">Voltar ao início</Link></div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
