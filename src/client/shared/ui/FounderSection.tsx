'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { SectionHeader } from './SectionHeader';

export function FounderSection() {
  return (
    <section id="about" aria-labelledby="about-title" className="bg-background py-16 text-foreground md:py-24">
      <div className="mx-auto max-w-[1200px] px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="grid gap-12 md:grid-cols-2 md:gap-16"
        >
          <div className="contents md:flex md:flex-col md:items-start md:gap-8">
            <div className="order-1">
              <SectionHeader id="about-title" eyebrow="Quem somos" title="Quem constrói" muted="com você." />
            </div>
            <Link
              href="/forms/contato"
              className="order-3 inline-flex items-center text-sm font-semibold text-brand hover:underline underline-offset-4"
            >
              Falar diretamente com os fundadores <span aria-hidden="true" className="ml-1">→</span>
            </Link>
          </div>

          <div className="order-2 space-y-5 border-border text-lg leading-relaxed text-muted-foreground md:border-l md:pl-12">
            <p>
              Gustavo Sales e Lucas fundaram a TZOLKIN, uma software house que desenha, cria e evolui produtos digitais com IA.
            </p>
            <p>
              Você conversa direto com quem define a arquitetura e acompanha a entrega. O escopo, o prazo e os custos de cada suíte são combinados antes de começar, e o código fica com você ao final.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
