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
          <h2 id="about-title" className="text-4xl md:text-6xl font-bold leading-tight mb-8">
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

          <div className="mt-12">
            <Link href="/forms/contato">
              <Button variant="outline" size="lg" className="px-8 hover:scale-105">
                Falar diretamente com os fundadores
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
