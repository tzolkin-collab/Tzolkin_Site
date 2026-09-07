'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from './Button';

export function FounderSection() {
  return (
    <section id="about" className="py-24 md:py-32 bg-background text-foreground relative overflow-hidden">

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto"
        >
          <h2 className="text-4xl md:text-6xl font-bold leading-tight mb-8">
            Engenharia com pele em jogo e <span className="text-brand">foco em retorno.</span>
          </h2>

          <div className="space-y-6 text-lg text-foreground leading-relaxed">
            <p>
              Gustavo e Lucas fundaram a TZOLKIN com um princípio simples: <strong className="text-foreground">tecnologia bonita que não põe dinheiro no caixa da empresa é vaidade, não engenharia.</strong>
            </p>
            <p>
              Não terceirizamos seu projeto para estagiários. Entramos na sua operação para identificar exatamente onde o fluxo de vendas está travado — seja na taxa de conversão da página, no tracking que mente os dados ou na falta de automação da rotina.
            </p>
            <p>
              Você contrata cirurgicamente o que precisa resolver hoje, com escopo fechado e a garantia de quem domina o código do início ao fim.
            </p>
          </div>

          {/* Pull quote como elemento visual (substitui a foto removida) */}
          <figure className="mt-16 border-l-4 border-brand pl-6 md:pl-10">
            <blockquote className="text-2xl md:text-4xl font-bold leading-tight text-foreground">
              &quot;Tecnologia sem estratégia é custo. Tecnologia com estratégia de resposta direta é margem de lucro.&quot;
            </blockquote>
            <figcaption className="mt-6 text-lg font-medium text-foreground">
              Gustavo Sales <span className="text-muted-foreground">| Sócio majoritário e cofundador</span>
            </figcaption>
          </figure>

          {/* CTA */}
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
