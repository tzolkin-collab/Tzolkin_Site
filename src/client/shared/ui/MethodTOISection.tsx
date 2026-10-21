'use client';

import { useRef, useState } from 'react';
import { motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { Check, FileText, KeyRound, Lock, Server, Users } from 'lucide-react';
import { FitBox } from '@/client/shared/ui/apps/FitBox';
import { HeroBands } from '@/client/shared/ui/hero/HeroBackground';

/*
 * "Como construímos", escrito como as três dúvidas que o cliente tem antes de contratar (acessos, custos, continuidade),
 * com linguagem de benefício e uma folha de produto por etapa. Conteúdo baseado nas entregas já definidas em homeData
 * (buildCommitments): permissões documentadas e segredos fora do código; recursos, responsáveis e custos discriminados;
 * repositório, documentação, testes e handoff. Sem promessa de certificação.
 * Fixa e conduzida pelo scroll como as outras seções; sem layout shift (textos e folhas empilhados na mesma célula).
 */

const STEPS = [
  {
    kicker: 'Acessos e segurança',
    title: 'Cada pessoa vê só o que precisa.',
    text: 'Sua equipe trabalha com os acessos certos e você sabe o que cada um fez. Menos risco de erro e de vazamento.',
    checks: ['Acesso por função: vendedor, gestor e administrador', 'Senhas e chaves guardadas fora do código', 'Registro de cada ação sensível'],
  },
  {
    kicker: 'Custos e responsabilidades',
    title: 'Cada custo na mesa, item a item.',
    text: 'Antes de assinar, você sabe quem cuida de cada parte e quanto cada serviço custa, inclusive os de terceiros.',
    checks: ['Ambiente só do seu projeto, separado de outros clientes', 'Custos de infraestrutura e serviços externos separados na proposta', 'Quem opera o quê, combinado por escrito'],
  },
  {
    kicker: 'Continuidade',
    title: 'Dá para seguir sem a gente.',
    text: 'No fim do ciclo, a sua equipe, ou outra, consegue assumir o produto sem começar do zero.',
    checks: ['Repositório em nome da sua empresa', 'Documentação de instalação, uso e manutenção', 'Testes dos fluxos que não podem quebrar', 'Reunião de passagem no fim do ciclo'],
  },
];

const sheet = 'overflow-hidden rounded-xl border border-border bg-card text-[13px] shadow-[0_30px_70px_-32px_rgba(10,20,40,0.4)]';
const sheetHead = 'flex items-center gap-2.5 border-b border-border px-5 py-3.5 text-[13px] font-semibold';

function TeamSheet() {
  const people: Array<[string, string, string, string]> = [
    ['AS', 'Ana Souza', 'Administradora', 'Vê e altera tudo'],
    ['PR', 'Paulo Reis', 'Gestor', 'Vê todas as vendas'],
    ['CR', 'Camila Ribeiro', 'Vendedora', 'Vê só as próprias'],
  ];
  const log: Array<[string, string]> = [
    ['14:02', 'Ana editou o pedido #4821'],
    ['13:48', 'Paulo exportou o relatório do mês'],
    ['13:20', 'Camila consultou 3 contatos'],
  ];
  return (
    <div className={sheet}>
      <p className={sheetHead}><Users size={15} className="text-brand" aria-hidden="true" />Acessos da equipe</p>
      <ul className="divide-y divide-border">
        {people.map(([ini, name, role, sees]) => (
          <li key={name} className="flex items-center gap-3.5 px-5 py-3.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-foreground/[0.07] text-xs font-semibold">{ini}</span>
            <span className="min-w-0 flex-1 leading-tight"><span className="block font-medium">{name}</span><span className="text-muted-foreground">{sees}</span></span>
            <span className="rounded-md border border-border px-2 py-1 text-xs font-medium text-foreground/80">{role}</span>
          </li>
        ))}
      </ul>
      <p className="border-y border-border bg-muted/50 px-5 py-2.5 text-xs font-semibold text-muted-foreground">Atividade recente</p>
      <ul className="divide-y divide-border">
        {log.map(([t, what]) => (
          <li key={t} className="flex items-baseline gap-3 px-5 py-2.5"><span className="font-mono text-xs text-muted-foreground">{t}</span><span>{what}</span></li>
        ))}
      </ul>
      <p className="flex items-center gap-2 border-t border-border bg-muted/50 px-5 py-3 text-xs text-muted-foreground"><KeyRound size={13} className="shrink-0 text-foreground" aria-hidden="true" />Senhas e chaves ficam guardadas fora do código.</p>
    </div>
  );
}

function CostsSheet() {
  const rows: Array<[string, string, boolean]> = [
    ['Hospedagem', 'Onde o sistema roda', true],
    ['Banco de dados', 'Onde os seus dados ficam', true],
    ['Tarefas em segundo plano', 'Envios e avisos automáticos', true],
    ['Domínio', 'O seu endereço na internet', false],
    ['WhatsApp e IA', 'Cobrados pelo fornecedor de cada um', false],
  ];
  return (
    <div className={sheet}>
      <p className={sheetHead}><Server size={15} className="text-brand" aria-hidden="true" />Quem cuida de cada parte</p>
      <ul className="divide-y divide-border">
        {rows.map(([what, desc, tz]) => (
          <li key={what} className="flex items-center gap-3.5 px-5 py-3.5">
            <span className="min-w-0 flex-1 leading-tight"><span className="block font-medium">{what}</span><span className="text-muted-foreground">{desc}</span></span>
            <span className={`shrink-0 rounded-md px-2.5 py-1 text-xs font-semibold ${tz ? 'bg-foreground text-background' : 'border border-border text-foreground/80'}`}>{tz ? 'TZOLKIN' : 'Sua conta'}</span>
          </li>
        ))}
      </ul>
      <p className="flex items-center gap-2 border-t border-border bg-muted/50 px-5 py-3 text-xs text-muted-foreground"><FileText size={13} className="shrink-0 text-foreground" aria-hidden="true" />Cada custo aparece separado na proposta, item a item.</p>
    </div>
  );
}

function HandoffSheet() {
  const rows: Array<[string, string]> = [
    ['Repositório', 'Todo o código, no nome da sua empresa'],
    ['Documentação', 'Como instalar, usar e manter'],
    ['Testes', 'Verificam o que não pode quebrar'],
    ['Reunião de passagem', 'Repassamos tudo à sua equipe ou a outra'],
  ];
  return (
    <div className={sheet}>
      <p className={sheetHead}><Lock size={15} className="text-brand" aria-hidden="true" />Pacote de entrega</p>
      <ul className="divide-y divide-border">
        {rows.map(([what, desc]) => (
          <li key={what} className="flex items-center gap-3.5 px-5 py-4">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand text-brand-foreground"><Check size={13} strokeWidth={3} aria-hidden="true" /></span>
            <span className="leading-tight"><span className="block font-medium">{what}</span><span className="text-muted-foreground">{desc}</span></span>
          </li>
        ))}
      </ul>
      <p className="border-t border-border bg-muted/50 px-5 py-3 text-xs text-muted-foreground">Outra equipe consegue assumir sem começar do zero.</p>
    </div>
  );
}

const SHEETS = [TeamSheet, CostsSheet, HandoffSheet];
const SLAB_MASK = 'linear-gradient(to top right, #000 0%, rgba(0,0,0,0.55) 40%, transparent 74%)';
const MOBILE_MASK = 'linear-gradient(to top, #000 20%, rgba(0,0,0,0.6) 55%, transparent 96%)';

function Sheets({ step }: { step: number }) {
  return (
    <div className="grid" role="group" aria-label="Exemplos de como cada resposta aparece no projeto">
      {SHEETS.map((Sheet, i) => (
        <div
          key={i}
          aria-hidden={i !== step}
          className={`col-start-1 row-start-1 self-start transition-opacity duration-200 motion-reduce:transition-none ${i === step ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
        >
          <Sheet />
        </div>
      ))}
    </div>
  );
}

export function MethodTOISection() {
  const ref = useRef<HTMLElement>(null);
  const [step, setStep] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  useMotionValueEvent(scrollYProgress, 'change', (v) => setStep(Math.min(2, Math.max(0, Math.floor(v * 3)))));

  return (
    <section
      ref={ref}
      id="como-construimos"
      aria-labelledby="como-construimos-title"
      className="relative h-[300svh] border-y border-border bg-muted/40"
    >
      <div className="sticky top-0 flex h-[100svh] flex-col overflow-hidden pb-4 pt-[72px] xl:justify-center xl:py-0">
        {/* desktop: laje à esquerda com as faixas do hero; celular: faixas embaixo */}
        <div aria-hidden="true" className="absolute inset-y-0 left-0 hidden w-[48%] overflow-hidden border-r border-dashed border-border bg-muted/60 xl:block">
          <div className="absolute inset-0 opacity-80" style={{ WebkitMaskImage: SLAB_MASK, maskImage: SLAB_MASK, transform: 'scaleX(-1)' }}>
            <HeroBands />
          </div>
        </div>
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-[34%] xl:hidden" style={{ WebkitMaskImage: MOBILE_MASK, maskImage: MOBILE_MASK }}>
          <HeroBands />
        </div>

        <div className="relative z-10 mx-auto flex min-h-0 w-full max-w-[1200px] flex-1 flex-col px-6 md:px-12 xl:grid xl:flex-none xl:grid-cols-12 xl:items-center xl:gap-0">
          {/* texto (à direita no desktop) */}
          <div className="xl:order-2 xl:col-span-6 xl:pl-16">
            <p className="text-sm font-semibold text-brand">Como construímos</p>
            <h2 id="como-construimos-title" className="mt-2 text-[1.65rem] font-semibold leading-[1.05] tracking-[-0.035em] md:text-4xl xl:text-5xl xl:leading-[1.03]">
              Sem letra miúda: <span className="text-muted-foreground">acessos, custos e código.</span>
            </h2>

            <div className="mt-4 grid xl:mt-8" aria-live="polite">
              {STEPS.map((s, i) => (
                <div key={s.kicker} aria-hidden={i !== step} className={`col-start-1 row-start-1 ${i === step ? '' : 'invisible'}`}>
                  <p className="text-[13px] font-semibold text-muted-foreground xl:text-sm">{s.kicker}</p>
                  <p className="mt-1 text-lg font-semibold leading-snug tracking-tight xl:mt-1.5 xl:text-2xl">{s.title}</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-foreground/70 xl:mt-2 xl:text-base">{s.text}</p>
                  <ul className="mt-3 space-y-1.5 xl:mt-4 xl:space-y-2">
                    {s.checks.map((c) => (
                      <li key={c} className="flex items-start gap-2.5 text-[13px] leading-snug xl:text-[15px]">
                        <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-brand/15 text-brand xl:h-[18px] xl:w-[18px]"><Check size={11} strokeWidth={3} aria-hidden="true" /></span>
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div
              role="progressbar"
              aria-label="Progresso das três respostas"
              aria-valuemin={1}
              aria-valuemax={3}
              aria-valuenow={step + 1}
              className="mt-4 h-1 w-full overflow-hidden rounded-full bg-border xl:mt-8"
            >
              <motion.div className="h-full origin-left bg-brand" style={{ scaleX: scrollYProgress }} />
            </div>
          </div>

          {/* folha de produto (à esquerda no desktop, sobre a laje) */}
          <div className="hidden xl:order-1 xl:col-span-6 xl:block xl:pr-16">
            <Sheets step={step} />
          </div>
          <FitBox className="mt-3 xl:hidden">
            <Sheets step={step} />
          </FitBox>
        </div>
      </div>
    </section>
  );
}
