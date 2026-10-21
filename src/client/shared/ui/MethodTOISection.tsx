'use client';

import { useRef, useState } from 'react';
import { motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { Check, PackageCheck, ReceiptText, ShieldCheck } from 'lucide-react';
import { FitBox } from '@/client/shared/ui/apps/FitBox';
import { RepoPanel } from '@/client/shared/ui/apps/MethodPanels';

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

const sheet = 'overflow-hidden rounded-xl border border-border bg-card text-[13px]';

/* 1. Quem pode o quê: uma matriz função x ação, mais o registro do que aconteceu. */
function AccessMatrix() {
  const roles = ['Administradora', 'Gestor', 'Vendedora'];
  // 2 = tudo, 1 = só o que é seu, 0 = não
  const rows: Array<[string, [number, number, number]]> = [
    ['Ver vendas', [2, 2, 1]],
    ['Editar pedidos', [2, 2, 1]],
    ['Exportar relatórios', [2, 2, 0]],
    ['Apagar registros', [2, 0, 0]],
    ['Chaves e senhas', [2, 0, 0]],
  ];
  const log: Array<[string, string]> = [
    ['14:02', 'Ana editou o pedido #4821'],
    ['13:48', 'Paulo exportou o relatório do mês'],
    ['13:20', 'Camila consultou 3 contatos'],
  ];
  return (
    <div className={sheet}>
      <div className="flex items-baseline justify-between border-b border-border px-5 py-3.5">
        <p className="text-sm font-semibold">Quem pode o quê</p>
        <p className="text-xs text-muted-foreground">por função</p>
      </div>
      <table className="w-full table-fixed text-left">
        <thead>
          <tr className="text-xs text-muted-foreground">
            <th className="w-[38%] px-5 py-2.5 font-medium"><span className="sr-only">Ação</span></th>
            {roles.map((r) => (
              <th key={r} className="px-1 py-2.5 text-center font-medium">{r}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(([what, v]) => (
            <tr key={what} className="border-t border-border">
              <td className="px-5 py-3 font-medium">{what}</td>
              {v.map((x, i) => (
                <td key={i} className="px-1 py-3 text-center">
                  {x === 2 && <span className="mx-auto flex h-5 w-5 items-center justify-center rounded-full bg-brand text-brand-foreground"><Check size={12} strokeWidth={3} aria-label="pode" /></span>}
                  {x === 1 && <span className="text-xs font-medium text-foreground/80">só as suas</span>}
                  {x === 0 && <span className="text-muted-foreground/60" aria-label="não pode">—</span>}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="border-y border-border bg-muted/50 px-5 py-2.5 text-xs font-semibold text-muted-foreground">Registro de ações</p>
      <ul>
        {log.map(([t, what]) => (
          <li key={t} className="flex items-baseline gap-3 px-5 py-2"><span className="font-mono text-xs tabular-nums text-muted-foreground">{t}</span><span>{what}</span></li>
        ))}
      </ul>
    </div>
  );
}

/* 2. Custos: uma folha de proposta em papel (fixa clara nos dois temas), com outra folha atrás. */
function ProposalPaper() {
  const rows: Array<[string, string, string]> = [
    ['Hospedagem', 'TZOLKIN', 'Incluída'],
    ['Banco de dados', 'TZOLKIN', 'Incluída'],
    ['Tarefas em segundo plano', 'TZOLKIN', 'Incluída'],
    ['Domínio', 'Você', 'Sua conta'],
    ['WhatsApp e IA', 'Você', 'Fornecedor'],
  ];
  return (
    <div className="relative px-3 pb-3 pt-4">
      <div aria-hidden="true" className="absolute inset-x-5 bottom-0 top-6 -rotate-[1.6deg] rounded-md bg-neutral-200" />
      <div className="relative overflow-hidden rounded-md bg-white text-[13px] text-neutral-900">
        <div className="flex items-start justify-between gap-4 px-6 pb-4 pt-6">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-neutral-500">Proposta · exemplo</p>
            <p className="mt-1 text-lg font-semibold leading-tight tracking-tight">Cada custo, item a item</p>
          </div>
          <span className="shrink-0 rounded border border-neutral-300 px-2 py-1 text-[11px] font-semibold text-neutral-600">Anexo 2</span>
        </div>
        <div className="grid grid-cols-[1fr_auto_auto] gap-x-6 border-y border-neutral-200 bg-neutral-50 px-6 py-2 text-[11px] font-semibold uppercase tracking-[0.06em] text-neutral-500">
          <span>Item</span><span>Opera</span><span className="text-right">Custo</span>
        </div>
        <ul className="divide-y divide-neutral-200">
          {rows.map(([what, who, cost]) => (
            <li key={what} className="grid grid-cols-[1fr_auto_auto] items-baseline gap-x-6 px-6 py-3">
              <span className="font-medium">{what}</span>
              <span className={who === 'TZOLKIN' ? 'font-semibold' : 'text-neutral-600'}>{who}</span>
              <span className="text-right text-neutral-600">{cost}</span>
            </li>
          ))}
        </ul>
        <p className="border-t border-neutral-200 px-6 py-3.5 text-xs text-neutral-600">Valores de terceiros entram na proposta, separados dos nossos.</p>
      </div>
    </div>
  );
}

/* 3. Continuidade: o repositório de verdade, num terminal (painel do kit). */
function HandoffTerminal() {
  return (
    <div>
      <RepoPanel />
      <p className="mt-3 text-sm text-foreground/70">Repositório no nome da sua empresa, com documentação e reunião de passagem.</p>
    </div>
  );
}

const SHEETS = [AccessMatrix, ProposalPaper, HandoffTerminal];

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
        {/* disco chapado atrás da folha (outra forma, sem as faixas do hero); ecoa os círculos dos Cases */}
        <div aria-hidden="true" className="pointer-events-none absolute left-[-22vh] top-1/2 hidden h-[86vh] w-[86vh] -translate-y-1/2 rounded-full bg-brand/[0.07] ring-1 ring-brand/20 xl:block" />
        <div aria-hidden="true" className="pointer-events-none absolute left-[-6vh] top-1/2 hidden h-[60vh] w-[60vh] -translate-y-1/2 rounded-full bg-brand/[0.06] ring-1 ring-brand/15 xl:block" />

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

            <div className="mt-4 w-[min(280px,100%)] xl:mt-8">
              <ol className="flex justify-between text-[13px] font-semibold" aria-hidden="true">
                {[
                  { label: 'Acessos', Icon: ShieldCheck },
                  { label: 'Custos', Icon: ReceiptText },
                  { label: 'Entrega', Icon: PackageCheck },
                ].map(({ label, Icon }, i) => (
                  <li key={label} className={`flex items-center gap-1.5 ${i === step ? 'text-foreground' : 'text-muted-foreground/70'}`}>
                    <Icon size={15} className={i === step ? 'text-brand' : ''} aria-hidden="true" />{label}
                  </li>
                ))}
              </ol>
              <div
                role="progressbar"
                aria-label="Progresso das três respostas"
                aria-valuemin={1}
                aria-valuemax={3}
                aria-valuenow={step + 1}
                className="mt-2 h-1 w-full overflow-hidden rounded-full bg-border"
              >
                <motion.div className="h-full origin-left bg-brand" style={{ scaleX: scrollYProgress }} />
              </div>
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
