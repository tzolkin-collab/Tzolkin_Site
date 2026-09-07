'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { TzolkinLogo } from '@/client/shared/ui/TzolkinLogo';
import { Check, ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function LogoPreviewPage() {
  const [selectedConcept, setSelectedConcept] = useState<number>(1);

  const concepts = [
    {
      id: 1,
      name: 'Estilo Linear',
      tagline: 'Geometria de Software de Elite',
      description: 'Tipografia com geometria pura, proporções ópticas refinadas, peso médio equilibrado e kerning encaixado perfeitamente na altura do símbolo. O padrão adotado pelos maiores SaaS e apps modernos do Vale do Silício.',
      render: () => (
        <div className="flex items-center gap-3 select-none">
          <Image src="/logotzolkin.svg" alt="" width={30} height={30} priority className="shrink-0" />
          <span className="text-[19px] font-medium tracking-[-0.02em] uppercase text-foreground leading-none">
            TZOLKIN
          </span>
        </div>
      ),
    },
    {
      id: 2,
      name: 'Estilo Vercel & Geist',
      tagline: 'Austeridade Monolítica Suíça',
      description: 'Visual sóbrio, austero e sem decorações excessivas. Tipografia neutra e sólida com kerning padrão, inspirada na engenharia alemã e em sistemas de infraestrutura crítica.',
      render: () => (
        <div className="flex items-center gap-2.5 select-none">
          <Image src="/logotzolkin.svg" alt="" width={28} height={28} priority className="shrink-0" />
          <span className="text-[17px] font-semibold tracking-normal uppercase text-foreground leading-none">
            TZOLKIN
          </span>
        </div>
      ),
    },
    {
      id: 3,
      name: 'Estilo Nothing Tech / Teenage Engineering',
      tagline: 'Futurismo Industrial Minimalista',
      description: 'Letras finas, tamanho reduzido e kerning matematicamente aberto. Transmite a sensação de uma inscrição a laser gravada em hardware de titânio de alta fidelidade.',
      render: () => (
        <div className="flex items-center gap-3.5 select-none">
          <Image src="/logotzolkin.svg" alt="" width={24} height={24} priority className="shrink-0" />
          <span className="text-[13px] font-light tracking-[0.32em] uppercase text-foreground/90 leading-none">
            TZOLKIN
          </span>
        </div>
      ),
    },
    {
      id: 4,
      name: 'Estilo Orbital Tech',
      tagline: 'Deep-Tech & Cosmologia Matemática',
      description: 'Tipografia display geométrica com proporção expandida e respiro orbital, criando uma presença de marca forte e inconfundível para empresas de deep-tech e inteligência artificial.',
      render: () => (
        <div className="flex items-center gap-3 select-none">
          <TzolkinLogo size={32} animated={false} />
          <span className="text-[18px] font-normal tracking-[0.14em] uppercase text-foreground leading-none">
            TZ<span className="text-brand font-medium">O</span>LKIN
          </span>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground py-16 px-6 md:px-12">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Cabeçalho */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-foreground/5 text-xs font-semibold uppercase tracking-wider text-brand">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Laboratório de Identidade Visual</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight">
            Escolha o Conceito Visual da TZOLKIN
          </h1>
          <p className="text-muted-foreground text-sm md:text-base max-w-xl mx-auto">
            Veja as 4 referências de design aplicadas ao vivo com o símbolo oficial da marca. Clique no conceito que mais gostar para me dizer qual aplicar.
          </p>
        </div>

        {/* Grade de Conceitos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {concepts.map((concept) => (
            <div
              key={concept.id}
              onClick={() => setSelectedConcept(concept.id)}
              className={`p-6 md:p-8 rounded-3xl border transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                selectedConcept === concept.id
                  ? 'bg-card border-brand shadow-2xl shadow-brand/10 ring-2 ring-brand/30'
                  : 'bg-card/60 border-border/70 hover:border-border hover:bg-card'
              }`}
            >
              <div>
                {/* Visualizador da Logo em Fundo Escuro Real */}
                <div className="w-full h-28 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center justify-center p-6 mb-6 shadow-inner">
                  {concept.render()}
                </div>

                {/* Título e Tagline */}
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-foreground">
                    {concept.name}
                  </h3>
                  {selectedConcept === concept.id && (
                    <span className="w-6 h-6 rounded-full bg-brand text-white flex items-center justify-center">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </span>
                  )}
                </div>
                <p className="text-xs font-semibold text-brand mb-3 uppercase tracking-wider">
                  {concept.tagline}
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {concept.description}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-border/50 flex items-center justify-between text-xs font-bold">
                <span className={selectedConcept === concept.id ? 'text-brand' : 'text-muted-foreground'}>
                  {selectedConcept === concept.id ? 'Conceito Selecionado' : 'Clique para selecionar'}
                </span>
                <span className="uppercase text-[11px] tracking-wider text-muted-foreground/60">
                  Opção {concept.id}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Ação de Confirmação */}
        <div className="text-center pt-6">
          <div className="p-6 rounded-2xl bg-card border border-border/70 max-w-lg mx-auto space-y-3">
            <p className="text-sm font-semibold text-foreground">
              Qual das 4 opções você prefere? (1, 2, 3 ou 4)
            </p>
            <p className="text-xs text-muted-foreground">
              Me diga o número aqui no chat e eu aplico imediatamente no Header e no Footer do site!
            </p>
            <div className="pt-2">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-xs font-bold text-brand hover:underline"
              >
                <span>Voltar para a Home</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
