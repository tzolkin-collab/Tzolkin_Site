'use client';

import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { SectionHeader } from './SectionHeader';
import { WHATSAPP_NUMBER } from '@/lib/whatsapp';

const FAQ = [
  {
    q: 'Quanto custa?',
    a: 'Trabalhamos em suítes de dois meses, conforme o escopo. O valor é apresentado na proposta, com infraestrutura e serviços externos discriminados item a item.',
  },
  {
    q: 'O código fica comigo?',
    a: 'Sim. No fim do ciclo o repositório fica em nome da sua empresa, com documentação, testes e uma reunião de passagem para a sua equipe ou outra assumir.',
  },
  {
    q: 'Quem paga hospedagem, WhatsApp e IA?',
    a: 'Cada custo aparece separado na proposta. O que fica no contrato com a TZOLKIN e o que você paga direto ao fornecedor, como WhatsApp, modelos de IA e domínio, é combinado por escrito antes de começar.',
  },
  {
    q: 'Quanto tempo leva?',
    a: 'Cada suíte dura dois meses. O escopo e o prazo são combinados antes de começar, a partir da conversa sobre o seu projeto.',
  },
  {
    q: 'O que vocês fazem com os meus dados?',
    a: 'Usamos os dados do formulário só para responder sobre o projeto. Para falar sobre eles, escreva para contato@tzolkin.com.br.',
  },
] as const;

// Suporte e privacidade ainda não têm página própria: por enquanto levam ao e-mail (ver a lista de páginas pendentes).
const LINKS = [
  { label: 'Iniciar projeto', href: '/forms' },
  { label: 'Suporte', href: 'mailto:contato@tzolkin.com.br?subject=Suporte' },
  { label: 'Privacidade e dados', href: 'mailto:contato@tzolkin.com.br?subject=Privacidade%20e%20dados' },
  { label: 'WhatsApp', href: `https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, '')}` },
];

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
            <div className="order-3 w-full">
              <h3 className="sr-only">Perguntas frequentes</h3>
              <div className="divide-y divide-border border-y border-border">
                {FAQ.map((item) => (
                  <details key={item.q} name="faq" className="group">
                    <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-4 py-3 text-left text-base font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand [&::-webkit-details-marker]:hidden">
                      {item.q}
                      <Plus size={18} className="shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-45" aria-hidden="true" />
                    </summary>
                    <p className="pb-4 pr-8 text-[15px] leading-relaxed text-muted-foreground">{item.a}</p>
                  </details>
                ))}
              </div>
              <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold">
                {LINKS.map((l) => (
                  <li key={l.label}>
                    <a href={l.href} {...(l.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})} className="text-brand underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand">
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
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
