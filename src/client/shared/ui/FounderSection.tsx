'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { SectionHeader } from './SectionHeader';

export function FounderSection() {
  return (
    <section id="about" aria-labelledby="about-title" className="bg-background py-20 text-foreground md:py-28">
      <div className="mx-auto max-w-[1200px] px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="grid gap-12 md:grid-cols-2 md:gap-20"
        >
          <SectionHeader id="about-title" eyebrow="Quem somos" title="Quem constrói" muted="com você." />

          <div>
            <div className="space-y-5 text-lg leading-relaxed text-muted-foreground">
              <p>
                Gustavo Sales e Lucas fundaram a TZOLKIN, uma software house que desenha, cria e evolui produtos digitais com IA.
              </p>
              <p>
                Você conversa direto com quem define a arquitetura e acompanha a entrega. O escopo, o prazo e os custos de cada suíte são combinados antes de começar, e o código fica com você ao final.
              </p>
            </div>

            <p className="mt-8 rounded-2xl border border-border bg-muted/50 px-6 py-5 text-lg font-semibold tracking-tight text-foreground">
              Escopo, prazo e custos combinados antes de começar.
            </p>

            <Link
              href="/forms/contato"
              className="mt-8 inline-flex items-center text-sm font-semibold text-brand hover:underline underline-offset-4"
            >
              Falar diretamente com os fundadores <span aria-hidden="true" className="ml-1">→</span>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
