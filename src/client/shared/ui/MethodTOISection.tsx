'use client';

import { motion, type MotionValue } from 'framer-motion';
import { Building2, Check, Download, FileCheck2, FileText, GitBranch, Lock, PackageCheck, Receipt, ReceiptText, ShieldCheck } from 'lucide-react';
import { FitBox } from '@/client/shared/ui/apps/FitBox';
import { SectionHeader } from '@/client/shared/ui/SectionHeader';

/*
 * "Como construímos", escrito como as três dúvidas que o cliente tem antes de contratar (acessos, custos, continuidade),
 * com linguagem de benefício e uma folha de produto por etapa. Conteúdo baseado nas entregas já definidas em homeData
 * (buildCommitments): permissões documentadas e segredos fora do código; recursos, responsáveis e custos discriminados;
 * repositório, documentação, testes e handoff. Sem promessa de certificação.
 * Fixa e conduzida pelo scroll como as outras seções; sem layout shift (textos e folhas empilhados na mesma célula).
 */

const STEPS = [
  { title: 'Cada pessoa vê só o que precisa.', text: 'E o que cada um fez fica registrado.' },
  { title: 'Cada custo na mesa, item a item.', text: 'Você sabe quem cuida de cada parte e quanto custa.' },
  { title: 'Dá para seguir sem a gente.', text: 'O código, a documentação e os testes ficam com você.' },
];

const sheet = 'overflow-hidden rounded-xl border border-border bg-card text-[13px]';

/* 1. Acessos: a mesma tela vista por duas funções. */
function AccessCompare() {
  return (
    <div className={sheet}>
      <p className="border-b border-border px-5 py-3.5 text-sm font-semibold">Vendas do mês</p>
      <div className="grid grid-cols-2 divide-x divide-border">
        <div className="px-5 py-5">
          <p className="text-xs font-semibold text-muted-foreground">Camila · Vendedora</p>
          <p className="mt-3 whitespace-nowrap text-2xl font-semibold tracking-tight tabular-nums sm:text-3xl">R$ 13.900</p>
          <p className="mt-1 text-xs text-muted-foreground">só as suas vendas</p>
          <p className="mt-5 flex items-center gap-1.5 text-xs text-muted-foreground"><Lock size={13} aria-hidden="true" />Exportar: sem permissão</p>
        </div>
        <div className="px-5 py-5">
          <p className="text-xs font-semibold text-muted-foreground">Ana · Administradora</p>
          <p className="mt-3 whitespace-nowrap text-2xl font-semibold tracking-tight tabular-nums sm:text-3xl">R$ 187.400</p>
          <p className="mt-1 text-xs text-muted-foreground">toda a equipe</p>
          <p className="mt-5 flex items-center gap-1.5 text-xs font-semibold text-brand"><Download size={13} aria-hidden="true" />Exportar relatório</p>
        </div>
      </div>
      <p className="flex items-baseline gap-3 border-t border-border bg-muted/50 px-5 py-3 text-xs"><span className="font-mono tabular-nums text-muted-foreground">14:02</span><span className="min-w-0 flex-1">Camila tentou exportar</span><span className="font-semibold text-brand">bloqueado</span></p>
    </div>
  );
}

/* 2. Custos: para quem se paga, em papel (fixo claro nos dois temas). */
function CostStatement() {
  return (
    <div className="relative px-3 pb-3 pt-4">
      <div aria-hidden="true" className="absolute inset-x-5 bottom-0 top-6 -rotate-[1.6deg] rounded-md bg-neutral-200" />
      <div className="relative overflow-hidden rounded-md bg-white text-[14px] text-neutral-900">
        <p className="px-6 pb-4 pt-6 text-lg font-semibold leading-tight tracking-tight">Para quem você paga</p>
        <div className="flex items-center gap-2 border-y border-neutral-200 bg-neutral-50 px-6 py-2 text-[11px] font-semibold uppercase tracking-[0.06em] text-neutral-500">
          <Building2 size={13} aria-hidden="true" />À TZOLKIN, no contrato
        </div>
        <ul className="divide-y divide-neutral-200">
          <li className="px-6 py-3 font-medium">Hospedagem e banco de dados</li>
        </ul>
        <div className="flex items-center gap-2 border-y border-neutral-200 bg-neutral-50 px-6 py-2 text-[11px] font-semibold uppercase tracking-[0.06em] text-neutral-500">
          <Receipt size={13} aria-hidden="true" />Direto ao fornecedor
        </div>
        <ul className="divide-y divide-neutral-200">
          <li className="px-6 py-3 font-medium">WhatsApp e IA</li>
          <li className="px-6 py-3 font-medium">Domínio</li>
        </ul>
      </div>
    </div>
  );
}

/* 3. Entrega: de quem é o código. */
function RepoOwnership() {
  return (
    <div className={sheet}>
      <div className="flex items-center gap-2.5 border-b border-border px-5 py-3.5">
        <GitBranch size={16} className="shrink-0 text-muted-foreground" aria-hidden="true" />
        <p className="min-w-0 flex-1 truncate text-sm"><span className="text-muted-foreground">sua-empresa /</span> <span className="font-semibold">crm-vendas</span></p>
        <span className="shrink-0 rounded border border-border px-1.5 py-0.5 text-xs font-medium text-muted-foreground">Privado</span>
      </div>
      <div className="px-5 py-5">
        <p className="text-xs font-semibold text-muted-foreground">Proprietário</p>
        <p className="mt-1 text-2xl font-semibold tracking-tight">Sua empresa</p>
        <p className="mt-4 text-xs text-muted-foreground">Acesso da TZOLKIN: você revoga quando quiser</p>
      </div>
      <ul className="divide-y divide-border border-t border-border">
        <li className="flex items-center gap-3 px-5 py-3"><FileText size={16} className="shrink-0 text-muted-foreground" aria-hidden="true" /><span className="font-medium">Documentação</span></li>
        <li className="flex items-center gap-3 px-5 py-3"><FileCheck2 size={16} className="shrink-0 text-brand" aria-hidden="true" /><span className="font-medium">Testes passando</span></li>
      </ul>
    </div>
  );
}

const SHEETS = [AccessCompare, CostStatement, RepoOwnership];

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

const ICONS = [ShieldCheck, ReceiptText, PackageCheck];

/**
 * Conteúdo de Como construímos, no mesmo layout de Aplicações: texto e lista à esquerda, folha na laje à direita.
 * O palco, a laje e o scroll ficam em ApplicationsMethodStory.
 */
export function MethodContent({ step, progress }: { step: number; progress: MotionValue<number> }) {
  return (
    <>
      <div className="absolute inset-y-0 right-0 hidden w-[52%] xl:block">
        <div className="absolute inset-0 flex items-center justify-center px-10">
          <div className="w-[calc(100%/1.25)] origin-center scale-[1.25]">
            <Sheets step={step} />
          </div>
        </div>
      </div>

      <div className="relative z-10 mx-auto flex min-h-0 w-full max-w-[1200px] flex-1 flex-col px-6 md:px-12 xl:grid xl:flex-none xl:grid-cols-12 xl:items-center xl:gap-0">
        <div className="xl:col-span-6 xl:pr-16">
          <SectionHeader id="como-construimos-title" eyebrow="Como construímos" title="Sem letra miúda:" muted="acessos, custos e código." />

          <ol className="mt-4 xl:mt-8" aria-label="Como construímos" aria-live="polite">
            {STEPS.map((s, i) => {
              const on = i === step;
              const Icon = ICONS[i];
              return (
                <li key={s.title} className={i > 0 ? 'border-t border-border' : ''}>
                  <div className="flex items-start gap-4 py-3 xl:gap-5 xl:py-4">
                    <Icon size={22} className={`mt-0.5 shrink-0 ${on ? 'text-brand' : 'text-foreground/35'}`} aria-hidden="true" />
                    <div className="min-w-0">
                      <p className={`text-lg font-semibold leading-snug tracking-tight xl:text-2xl ${on ? 'text-foreground' : 'text-foreground/45'}`}>{s.title}</p>
                      <p className={`mt-1 text-sm leading-relaxed text-foreground/70 xl:text-base ${on ? 'opacity-100' : 'opacity-0'}`} aria-hidden={!on}>{s.text}</p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>

          <div
            role="progressbar"
            aria-label="Progresso das três respostas"
            aria-valuemin={1}
            aria-valuemax={3}
            aria-valuenow={step + 1}
            className="mt-4 h-1 w-[min(280px,100%)] overflow-hidden rounded-full bg-border xl:mt-6"
          >
            <motion.div className="h-full origin-left bg-brand" style={{ scaleX: progress }} />
          </div>
        </div>

        <FitBox className="mt-4 xl:hidden">
          <Sheets step={step} />
        </FitBox>
      </div>
    </>
  );
}
