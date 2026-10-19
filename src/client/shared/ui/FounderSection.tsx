'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from './Button';

export function FounderSection() {
  return (
    <section id="about" aria-labelledby="about-title" className="py-20 md:py-28 bg-background text-foreground relative overflow-hidden">
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto"
        >
          <p className="text-xs md:text-sm font-semibold tracking-[0.2em] text-muted-foreground uppercase mb-4">
            Quem somos
          </p>
          <h2 id="about-title" className="text-[13vw] md:text-8xl leading-[0.9] font-bold tracking-tight uppercase mb-10">
            Quem constrói <span className="text-brand">com você.</span>
          </h2>

          <div className="space-y-6 text-lg text-foreground leading-relaxed">
            <p>
              Gustavo Sales e Lucas fundaram a TZOLKIN, uma software house que desenha, cria e evolui produtos digitais com IA.
            </p>
            <p>
              Você conversa direto com quem define a arquitetura e acompanha a entrega. O escopo, o prazo e os custos de cada suíte são combinados antes de começar, e o código fica com você ao final.
            </p>
          </div>

          <p className="mt-12 border-l-4 border-brand pl-6 md:pl-10 text-2xl md:text-4xl font-bold leading-tight uppercase tracking-tight">
            Escopo, prazo e custos combinados antes de começar.
          </p>

          <div className="mt-12">
            <Link href="/forms/contato">
              <Button variant="outline" size="lg" className="px-8 ">
                Falar diretamente com os fundadores
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
