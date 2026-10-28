'use client';

import type { ReactNode } from 'react';
import {
  AlertTriangle,
  Check,
  FileCode2,
  FileText,
  Folder,
  GitBranch,
  GitPullRequest,
  Inbox,
  LayoutGrid,
  MessageCircle,
  Mic,
  PhoneCall,
  RefreshCw,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react';
import { DeviceStage, MacShell, PhoneShell, Screen, STAGE_H, STAGE_W, useFit } from './EcommerceDevices';

/*
 * Demonstrações de produto (CRM, agentes, fiscal, piloto) no mesmo vocabulário do e-commerce:
 * MacBook + iPhone com layouts próprios. Telas em cores fixas (claras), dados fictícios.
 */

const INK = 'text-[#171717]';
const MUTED = 'text-[#737373]';
const brl = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

function Avatar({ children, tone = 'bg-[#f1e4de] text-[#7a3b2a]' }: { children: ReactNode; tone?: string }) {
  return <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-[9px] font-semibold ${tone}`}>{children}</span>;
}

function PhoneStatus() {
  return <div className="flex h-9 shrink-0 items-end px-6 pb-1 text-[11px] font-semibold text-[#171717]">9:41</div>;
}

/* =====================================================================================
 * CRM com IA
 * ===================================================================================== */

const CRM_COLUMNS = ['Entrada', 'Qualificados', 'Com o time'];

function CrmMac({ step }: { step: number }) {
  const lead = (
    <div className={`rounded-lg border bg-white p-2.5 ${step === 0 ? 'border-brand shadow-[0_0_0_3px_rgba(201,0,0,0.08)]' : 'border-[#e5e5e5]'}`}>
      <div className="flex items-start justify-between">
        <p className="text-[12px] font-semibold">Studio Aurora</p>
        {step === 0 && <span className="rounded bg-brand px-1.5 py-0.5 text-[9px] font-semibold text-white">Novo</span>}
        {step === 2 && <Avatar>AS</Avatar>}
      </div>
      <p className={`mt-0.5 text-[10.5px] ${MUTED}`}>Expansão · nova unidade</p>
      <div className="mt-2 flex items-center gap-1.5 text-[10px]">
        <span className="rounded bg-[#e7f6ec] px-1.5 py-0.5 font-medium text-[#15803d]">WhatsApp</span>
        {step >= 1 && <span className="rounded bg-[#f4f4f5] px-1.5 py-0.5 text-[#52525b]">{brl(18000)}</span>}
      </div>
    </div>
  );
  const others: Array<[string, string, number]> = [
    ['Casa Norte', 'Proposta de integração', 0],
    ['Estúdio Lume', 'Retorno agendado', 1],
    ['Oficina Central', 'Nova unidade', 2],
    ['Mercearia do Sul', 'Cotação enviada', 1],
    ['Padaria Central', 'Primeiro contato', 0],
    ['Ótica Visão', 'Proposta enviada', 2],
    ['Clínica Vita', 'Aguardando retorno', 1],
    ['Loja do Zé', 'Pediu demonstração', 0],
    ['Hotel Aurora', 'Reunião marcada', 2],
  ];
  return (
    <div className={`flex h-full ${INK}`}>
      <div className="flex w-12 shrink-0 flex-col items-center gap-4 border-r border-[#ececec] bg-[#fafafa] pt-4 text-[#a3a3a3]">
        <span className="flex h-7 w-7 items-center justify-center rounded-md bg-[#171717] text-[10px] font-bold text-white">tz</span>
        <Inbox size={16} />
        <LayoutGrid size={16} className="text-brand" />
        <Users size={16} />
        <Settings size={16} className="mt-auto mb-4" />
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex h-11 shrink-0 items-center justify-between border-b border-[#ececec] px-5">
          <p className="text-[13px] font-semibold">Pipeline comercial <span className={`font-normal ${MUTED}`}>· 14 oportunidades</span></p>
          <span className="flex h-7 w-32 items-center gap-1.5 rounded-md border border-[#e5e5e5] px-2 text-[11px] text-[#a3a3a3]"><Search size={12} />Buscar</span>
        </div>
        <div className="grid flex-1 grid-cols-3 gap-3 bg-[#fafafa] p-4">
          {CRM_COLUMNS.map((c, ci) => (
            <div key={c} className="flex flex-col gap-2">
              <p className={`flex items-center justify-between text-[11px] font-semibold ${ci === step ? 'text-[#171717]' : 'text-[#737373]'}`}>
                {c}
                <span className="rounded bg-[#ececec] px-1.5 text-[10px] font-medium text-[#525252]">{others.filter((o) => o[2] === ci).length + (ci === step ? 1 : 0)}</span>
              </p>
              {ci === step && lead}
              {others.filter((o) => o[2] === ci).slice(0, ci === step ? 2 : 3).map(([n, d]) => (
                <div key={n} className="rounded-lg border border-[#e5e5e5] bg-white p-2.5">
                  <p className="text-[12px] font-medium">{n}</p>
                  <p className={`mt-0.5 text-[10.5px] ${MUTED}`}>{d}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="w-[210px] shrink-0 border-l border-[#ececec] bg-white p-4">
        <p className="flex items-center gap-1.5 text-[11px] font-semibold text-brand"><Sparkles size={12} />{step === 0 ? 'Conversa recebida' : 'Resumo da conversa'}</p>
        <p className="mt-1 text-[13px] font-semibold">Studio Aurora</p>
        {step === 0 ? (
          <div className="mt-3 rounded-lg bg-[#f4f4f5] p-2.5 text-[11.5px] leading-relaxed text-[#404040]">
            “Estamos abrindo uma nova unidade. Vocês conseguem conectar o atendimento ao nosso estoque?”
            <p className={`mt-2 text-[10px] ${MUTED}`}>WhatsApp · agora</p>
          </div>
        ) : (
          <dl className="mt-3 space-y-2.5 text-[11.5px]">
            {[['Necessidade', 'Conectar atendimento e estoque'], ['Momento', 'Abrindo nova unidade'], ['Origem', 'WhatsApp'], ['Próximo passo', 'Validar sistemas com o comercial']].map(([k, v]) => (
              <div key={k}><dt className={`text-[10px] ${MUTED}`}>{k}</dt><dd className="font-medium leading-snug">{v}</dd></div>
            ))}
          </dl>
        )}
        {step === 2 && (
          <div className="mt-4 flex items-center gap-2 rounded-lg border border-[#e5e5e5] p-2">
            <Avatar>AS</Avatar>
            <div className="leading-tight"><p className="text-[11px] font-medium">Ana Souza</p><p className="text-[10px] text-[#15803d]">Avisada · assumiu</p></div>
          </div>
        )}
      </div>
    </div>
  );
}

export function CrmPhone({ step }: { step: number }) {
  return (
    <div className={`flex h-full flex-col bg-[#f6f6f7] ${INK}`}>
      <PhoneStatus />
      <div className="flex h-11 shrink-0 items-center gap-2 border-b border-[#e5e5e5] bg-white px-4">
        <Avatar tone="bg-[#e7f6ec] text-[#15803d]">SA</Avatar>
        <div className="leading-tight"><p className="text-[12.5px] font-semibold">Studio Aurora</p><p className={`text-[10px] ${MUTED}`}>WhatsApp · online</p></div>
      </div>
      <div className="flex flex-1 flex-col gap-2.5 px-3 py-4 text-[12px] leading-snug">
        <p className="self-center rounded-full bg-[#ececec] px-2.5 py-0.5 text-[10px] text-[#737373]">Hoje</p>
        <div className="max-w-[85%] self-start rounded-2xl rounded-tl-sm bg-white px-3 py-2 shadow-sm">
          Oi! Estamos abrindo uma nova unidade. Vocês conseguem conectar o atendimento ao nosso estoque?
          <span className={`mt-1 block text-right text-[9.5px] ${MUTED}`}>14:02</span>
        </div>
        {step >= 1 && (
          <div className="max-w-[92%] self-center rounded-xl border border-[#f1d5d5] bg-[#fff6f6] px-3 py-2 text-[11px]">
            <p className="flex items-center gap-1.5 font-semibold text-brand"><Sparkles size={12} />Contexto organizado</p>
            <p className="mt-1 text-[#52525b]">Necessidade: conectar atendimento e estoque. Registrado no CRM.</p>
          </div>
        )}
        {step >= 2 && (
          <div className="max-w-[92%] self-center rounded-xl bg-[#171717] px-3 py-2 text-[11px] text-white">
            <p className="flex items-center gap-1.5 font-semibold"><Check size={12} />Encaminhado</p>
            <p className="mt-1 text-white/75">Ana Souza foi avisada e assumiu a conversa.</p>
          </div>
        )}
      </div>
      <div
        role="progressbar"
        aria-label="Progresso da demonstração"
        aria-valuemin={1}
        aria-valuemax={3}
        aria-valuenow={step + 1}
        className="mx-6 mb-3 h-1 shrink-0 overflow-hidden rounded-full bg-[#e5e5e5]"
      >
        <div
          className="h-full origin-left rounded-full bg-brand transition-transform duration-300 motion-reduce:transition-none"
          style={{ transform: `scaleX(${(step + 1) / 3})` }}
        />
      </div>
      <div className="m-3 mb-6 mt-0 flex h-9 items-center rounded-full border border-[#e5e5e5] bg-white px-4 text-[11.5px] text-[#a3a3a3]">Mensagem</div>
    </div>
  );
}

export function CrmDevices({ step = 1 }: { step?: number }) {
  return (
    <DeviceStage
      label="CRM com IA no computador e no celular: conversa recebida, contexto organizado e oportunidade encaminhada"
      mac={<MacShell><CrmMac step={step} /></MacShell>}
      phone={<PhoneShell><CrmPhone step={step} /></PhoneShell>}
    />
  );
}

/* =====================================================================================
 * Agentes de IA (mensagens e voz)
 * ===================================================================================== */

const WAVE = [6, 12, 20, 9, 26, 14, 30, 18, 10, 24, 32, 16, 8, 22, 28, 12, 18, 30, 10, 14, 24, 8];

export function AgentsPhone() {
  return (
    <div className={`flex h-full flex-col bg-[#101114] text-white`}>
      <div className="flex h-9 shrink-0 items-end px-6 pb-1 text-[11px] font-semibold">9:41</div>
      <div className="mt-6 flex flex-col items-center">
        <Avatar tone="bg-white/15 text-white">JM</Avatar>
        <p className="mt-2 text-[15px] font-semibold">Juliana M.</p>
        <p className="flex items-center gap-1.5 text-[11px] text-white/60"><PhoneCall size={11} />Chamada · 02:14</p>
      </div>
      <div className="mt-7 flex h-10 items-center justify-center gap-[3px] px-6" aria-hidden="true">
        {WAVE.map((h, i) => <span key={i} className="w-[3px] rounded-full bg-brand" style={{ height: h }} />)}
      </div>
      <div className="mx-4 mt-6 space-y-2 text-[11.5px] leading-snug">
        <p className="rounded-xl bg-white/10 px-3 py-2"><span className="block text-[9.5px] text-white/50">Cliente</span>Queria saber o status da minha nota fiscal.</p>
        <p className="rounded-xl bg-brand/90 px-3 py-2"><span className="block text-[9.5px] text-white/70">Agente</span>Encontrei o pedido. A nota foi emitida hoje às 14:03.</p>
      </div>
      <div className="mt-auto flex items-center justify-center gap-3 pb-9">
        <span className="flex h-10 items-center gap-1.5 rounded-full bg-white/10 px-4 text-[11.5px]"><Mic size={13} />Mudo</span>
        <span className="flex h-10 items-center rounded-full bg-white px-4 text-[11.5px] font-semibold text-[#171717]">Passar para uma pessoa</span>
      </div>
    </div>
  );
}

export function SalesCallPhone() {
  const steps: Array<[string, boolean, boolean]> = [['Apresentação', true, false], ['Qualificação', false, true], ['Agendar reunião', false, false]];
  return (
    <div className={`flex h-full flex-col bg-[#f6f6f7] ${INK}`}>
      <PhoneStatus />
      <div className="mt-3 flex flex-col items-center">
        <p className="flex items-center gap-1.5 text-[10.5px] font-semibold text-brand"><PhoneCall size={12} />Agente de vendas · ligação ativa</p>
        <Avatar tone="bg-[#171717] text-white">CM</Avatar>
        <p className="mt-1.5 text-[15px] font-semibold">Carlos Mendes</p>
        <p className={`text-[11px] ${MUTED}`}>Ligando · 00:48</p>
      </div>
      <div className="mt-4 flex h-8 items-center justify-center gap-[3px] px-6" aria-hidden="true">
        {WAVE.map((h, i) => <span key={i} className="w-[3px] rounded-full bg-brand" style={{ height: Math.max(4, h * 0.8) }} />)}
      </div>
      <div className="mx-4 mt-4 space-y-2 text-[11.5px] leading-snug">
        <p className="rounded-xl bg-white px-3 py-2 shadow-sm"><span className={`block text-[9.5px] ${MUTED}`}>Agente</span>Olá, Carlos! Falo da Tzolkin. Tem um minuto para conversar?</p>
        <p className="rounded-xl bg-[#ececec] px-3 py-2"><span className={`block text-[9.5px] ${MUTED}`}>Cliente</span>Pode falar.</p>
      </div>
      <ol className="mx-4 mt-4 space-y-1.5 text-[11.5px]">
        {steps.map(([t, done, now]) => (
          <li key={t} className="flex items-center gap-2">
            <span className={`flex h-4 w-4 items-center justify-center rounded-full ${done ? 'bg-brand text-white' : now ? 'border-2 border-brand bg-white' : 'border border-[#d4d4d4] bg-white'}`}>{done && <Check size={10} strokeWidth={3} />}</span>
            <span className={done || now ? 'font-medium' : 'text-[#a3a3a3]'}>{t}</span>
          </li>
        ))}
      </ol>
      <div className="mt-auto flex items-center justify-center gap-3 pb-9">
        <span className="flex h-10 items-center gap-1.5 rounded-full border border-[#d4d4d4] bg-white px-4 text-[11.5px]"><Mic size={13} />Mudo</span>
        <span className="flex h-10 items-center rounded-full bg-[#171717] px-4 text-[11.5px] font-semibold text-white">Encerrar</span>
      </div>
    </div>
  );
}

export function WhatsAppAgentPhone() {
  const me = 'max-w-[82%] self-end rounded-lg rounded-tr-sm bg-[#d9fdd3] px-2.5 py-1.5 shadow-sm';
  const them = 'max-w-[82%] self-start rounded-lg rounded-tl-sm bg-white px-2.5 py-1.5 shadow-sm';
  return (
    <div className="flex h-full flex-col bg-[#efeae2] text-[#171717]">
      <div className="flex shrink-0 flex-col bg-[#0b4f45] text-white">
        <PhoneStatusLight />
        <div className="flex h-12 items-center gap-2.5 px-4">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-[10px] font-semibold">IA</span>
          <div className="leading-tight"><p className="text-[13px] font-semibold">Atendimento</p><p className="text-[10px] text-white/70">agente de IA · online</p></div>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-2 px-3 py-4 text-[12px] leading-snug">
        <p className="self-center rounded-full bg-white/70 px-2.5 py-0.5 text-[10px] text-[#737373]">Hoje</p>
        <div className={me}>Oi! Vocês entregam em Belo Horizonte?<span className={`block text-right text-[9.5px] ${MUTED}`}>14:02</span></div>
        <div className={them}>Entregamos sim! O prazo é de 3 a 5 dias úteis. Quer que eu monte o pedido?<span className={`block text-right text-[9.5px] ${MUTED}`}>14:02</span></div>
        <div className={me}>Quero. Tem na cor preta?<span className={`block text-right text-[9.5px] ${MUTED}`}>14:03</span></div>
        <div className={them}>Tem! Qual tamanho você usa?
          <span className="mt-1.5 flex gap-1.5">{['P', 'M', 'G'].map((t) => <span key={t} className="rounded-full border border-[#0b4f45]/30 px-2.5 py-0.5 text-[11px] font-medium text-[#0b4f45]">{t}</span>)}</span>
        </div>
      </div>
      <div className="m-3 mb-6 mt-0 flex h-9 items-center rounded-full bg-white px-4 text-[11.5px] text-[#a3a3a3]">Mensagem</div>
    </div>
  );
}

function PhoneStatusLight() {
  return <div className="flex h-9 shrink-0 items-end px-6 pb-1 text-[11px] font-semibold text-white">9:41</div>;
}

/** Três celulares lado a lado (atendimento por voz, vendas por ligação e WhatsApp), na largura do palco. */
export function AgentsDevices() {
  const { ref, scale } = useFit(STAGE_W);
  return (
    <div role="group" aria-label="Agentes de IA em três celulares: atendimento por voz, ligação de vendas e conversa de WhatsApp">
      <div ref={ref} className="w-full" style={{ aspectRatio: `${STAGE_W} / ${STAGE_H}`, maxWidth: STAGE_W }}>
        <div className="relative origin-top-left" style={{ width: STAGE_W, height: STAGE_H, transform: `scale(${scale})` }}>
          {[<AgentsPhone key="a" />, <SalesCallPhone key="b" />, <WhatsAppAgentPhone key="c" />].map((screen, i) => (
            <div key={i} className="absolute top-[40px]" style={{ left: i * 339 }}><PhoneShell>{screen}</PhoneShell></div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* =====================================================================================
 * Automação fiscal
 * ===================================================================================== */

function FiscalMac() {
  const rows: Array<[string, string, string, string, string]> = [
    ['#1048', 'Camila R.', brl(154.8), 'Autorizada', 'bg-[#e7f6ec] text-[#15803d]'],
    ['#1047', 'Rafael T.', brl(129), 'Autorizada', 'bg-[#e7f6ec] text-[#15803d]'],
    ['#1046', 'Studio Aurora', brl(1840), 'Falhou', 'bg-[#fde8e8] text-[#b91c1c]'],
    ['#1045', 'Juliana M.', brl(246.8), 'Processando', 'bg-[#fef3c7] text-[#92400e]'],
    ['#1044', 'Patrícia S.', brl(712.4), 'Autorizada', 'bg-[#e7f6ec] text-[#15803d]'],
  ];
  const steps = ['Pedido recebido', 'Dados validados', 'Enviada à SEFAZ', 'Autorizada'];
  return (
    <div className={`flex h-full flex-col ${INK}`}>
      <div className="flex h-11 shrink-0 items-center justify-between border-b border-[#ececec] px-5">
        <p className="text-[13px] font-semibold">Central fiscal <span className={`font-normal ${MUTED}`}>· hoje</span></p>
        <p className="flex items-center gap-3 text-[11px]"><span className="text-[#15803d]">3 autorizadas</span><span className="text-[#b91c1c]">1 falha</span><span className="text-[#92400e]">1 em processo</span></p>
      </div>
      <div className="grid flex-1 grid-cols-[1.2fr_1fr]">
        <div>
          <div className={`grid grid-cols-[52px_1fr_80px_86px] px-5 py-2 text-[10px] uppercase tracking-wide ${MUTED}`}><span>Pedido</span><span>Cliente</span><span className="text-right">Valor</span><span className="text-right">Situação</span></div>
          {rows.map(([id, who, v, st, tone], i) => (
            <div key={id} className={`grid grid-cols-[52px_1fr_80px_86px] items-center border-t border-[#ececec] px-5 py-2.5 text-[12px] ${i === 2 ? 'bg-[#fff7f7]' : ''}`}>
              <span className="font-mono text-[11px]">{id}</span><span className="truncate">{who}</span><span className="text-right tabular-nums">{v}</span>
              <span className="text-right"><span className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${tone}`}>{st}</span></span>
            </div>
          ))}
          <div className="mx-5 mt-3 rounded-lg border border-[#f3c9c9] bg-[#fff5f5] p-3">
            <p className="flex items-center gap-1.5 text-[11.5px] font-semibold text-[#b91c1c]"><AlertTriangle size={13} />Nota #1046 não autorizada</p>
            <p className="mt-1 text-[11px] leading-snug text-[#52525b]">CNPJ do destinatário inválido. Corrija o cadastro e reprocesse.</p>
            <span className="mt-2 inline-flex h-7 items-center gap-1.5 rounded-md bg-[#171717] px-2.5 text-[11px] font-medium text-white"><RefreshCw size={11} />Reprocessar</span>
          </div>
        </div>
        <div className="border-l border-[#ececec] bg-[#fafafa] p-5">
          <p className="text-[12px] font-semibold">Nota fiscal · pedido #1048</p>
          <p className="mt-2 text-[28px] font-semibold leading-none tracking-tight tabular-nums">{brl(154.8)}</p>
          <p className={`mt-3 text-[10px] ${MUTED}`}>Chave de acesso</p>
          <p className="mt-0.5 break-all font-mono text-[10.5px] leading-snug text-[#404040]">3524 1004 7218 3900 0112 5500 1000 0010 4810 0000 1048</p>
          <ol className="mt-4 space-y-2">
            {steps.map((s) => (
              <li key={s} className="flex items-center gap-2 text-[11.5px]"><span className="flex h-4 w-4 items-center justify-center rounded-full bg-brand text-white"><Check size={10} strokeWidth={3} /></span>{s}</li>
            ))}
          </ol>
          <div className="mt-4 flex gap-2 text-[11px] font-medium"><span className="flex h-7 items-center gap-1.5 rounded-md border border-[#d4d4d4] bg-white px-2.5"><FileText size={11} />XML</span><span className="flex h-7 items-center gap-1.5 rounded-md border border-[#d4d4d4] bg-white px-2.5"><FileText size={11} />DANFE</span></div>
        </div>
      </div>
    </div>
  );
}

const BARS = Array.from({ length: 46 }, (_, i) => (i % 5 === 0 ? 22 : i % 3 === 0 ? 16 : 12));

export function FiscalPhone() {
  return (
    <div className={`flex h-full flex-col bg-[#f3f3f5] ${INK}`}>
      <PhoneStatus />
      <div className="mx-3 mt-1 flex items-start gap-2.5 rounded-2xl bg-white p-3 shadow-sm">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand text-white"><FileText size={15} /></span>
        <div className="leading-snug"><p className="text-[12px] font-semibold">Nota fiscal emitida</p><p className={`text-[11px] ${MUTED}`}>Pedido #1048 · {brl(154.8)}</p></div>
        <span className={`ml-auto text-[10px] ${MUTED}`}>agora</span>
      </div>
      <div className="mx-3 mt-4 flex-1 rounded-xl bg-white p-3.5 shadow-sm">
        <p className="text-[11px] font-bold tracking-wide">DANFE</p>
        <p className={`text-[9.5px] ${MUTED}`}>Documento auxiliar da NF-e · exemplo</p>
        <div className="mt-3 grid grid-cols-2 gap-2 text-[10px]">
          <div><p className={MUTED}>Nº</p><p className="font-medium">1048 · Série 1</p></div>
          <div><p className={MUTED}>Emissão</p><p className="font-medium">21/10 14:03</p></div>
          <div className="col-span-2"><p className={MUTED}>Destinatário</p><p className="font-medium">Camila Ribeiro</p></div>
        </div>
        <div className="mt-3 border-t border-dashed border-[#d4d4d4] pt-2 text-[10.5px]">
          <div className="flex justify-between"><span>Camiseta Básica Branca · M</span><span className="tabular-nums">{brl(129.9)}</span></div>
          <div className="mt-1 flex justify-between"><span>Frete</span><span className="tabular-nums">{brl(24.9)}</span></div>
          <div className="mt-2 flex justify-between text-[12px] font-semibold"><span>Total</span><span className="tabular-nums">{brl(154.8)}</span></div>
        </div>
        <div className="mt-3 flex h-9 items-end gap-[2px]" aria-hidden="true">{BARS.map((h, i) => <span key={i} className="w-[2px] bg-[#171717]" style={{ height: h + 6 }} />)}</div>
      </div>
      <div className="p-3 pb-7"><span className="flex h-10 items-center justify-center rounded-xl bg-[#171717] text-[12px] font-semibold text-white">Compartilhar DANFE</span></div>
    </div>
  );
}

export function FiscalDevices() {
  return (
    <DeviceStage
      label="Automação fiscal no computador e no celular: central de notas com falha tratada e DANFE da nota emitida"
      mac={<MacShell><FiscalMac /></MacShell>}
      phone={<PhoneShell><FiscalPhone /></PhoneShell>}
    />
  );
}

/* =====================================================================================
 * Evoluir um piloto
 * ===================================================================================== */

function PilotMac() {
  const files: Array<[string, string, boolean]> = [
    ['src/', '', false], ['  auth.ts', 'M', true], ['  pedidos.ts', 'M', true], ['  env.ts', 'A', true], ['tests/', '', false], ['  pedidos.test.ts', 'A', true], ['docs/', '', false], ['  README.md', 'M', true],
  ];
  const diff: Array<['+' | '-' | ' ', string]> = [
    [' ', 'export async function criarPedido(dados) {'],
    ['-', "  const chave = 'sk_live_9f2a…'; // no código"],
    ['+', '  const chave = process.env.PAGAMENTO_KEY;'],
    [' ', '  const pedido = await salvar(dados);'],
    ['+', '  await validarPermissao(usuario, "pedido:criar");'],
    ['+', '  await registrarAcao(usuario, pedido.id);'],
    [' ', '  return pedido;'],
    [' ', '}'],
    [' ', ''],
    ['+', 'export const permissoes = {'],
    ['+', '  vendedor: ["pedido:criar"],'],
    ['+', '  gestor: ["pedido:criar", "pedido:ver"],'],
    ['+', '};'],
  ];
  return (
    <div className={`flex h-full flex-col ${INK}`}>
      <div className="flex h-11 shrink-0 items-center gap-2.5 border-b border-[#ececec] px-5">
        <GitPullRequest size={15} className="text-[#15803d]" />
        <p className="text-[13px] font-semibold">Próxima versão: do piloto à v1.0</p>
        <span className="ml-auto rounded-full bg-[#e7f6ec] px-2 py-0.5 text-[10px] font-semibold text-[#15803d]">Pronto para revisão</span>
      </div>
      <div className="grid flex-1 grid-cols-[150px_1fr_190px]">
        <div className="border-r border-[#ececec] bg-[#fafafa] p-3">
          <p className={`mb-2 flex items-center gap-1.5 text-[10px] uppercase tracking-wide ${MUTED}`}><GitBranch size={11} />piloto → v1.0</p>
          {files.map(([f, tag, changed]) => (
            <p key={f} className={`flex items-center justify-between whitespace-pre py-[3px] font-mono text-[11px] ${changed ? '' : 'text-[#737373]'}`}>
              <span className="flex items-center gap-1">{!f.startsWith(' ') && <Folder size={11} />}{f.startsWith(' ') ? <FileCode2 size={11} className="ml-2 shrink-0" /> : null}{f.trim()}</span>
              {tag && <span className={`rounded px-1 text-[9px] font-semibold ${tag === 'A' ? 'bg-[#e7f6ec] text-[#15803d]' : 'bg-[#fef3c7] text-[#92400e]'}`}>{tag}</span>}
            </p>
          ))}
        </div>
        <div className="min-w-0 overflow-hidden">
          <p className="border-b border-[#ececec] px-4 py-2 font-mono text-[11px]">src/pedidos.ts</p>
          <div className="py-2 font-mono text-[11px] leading-[1.7]">
            {diff.map(([k, line], i) => (
              <div key={i} className={`flex ${k === '+' ? 'bg-[#e9f8ee]' : k === '-' ? 'bg-[#fdecec]' : ''}`}>
                <span className={`w-9 shrink-0 select-none pr-2 text-right ${MUTED}`}>{i + 12}</span>
                <span className={`w-4 shrink-0 ${k === '+' ? 'text-[#15803d]' : k === '-' ? 'text-[#b91c1c]' : MUTED}`}>{k === ' ' ? '' : k}</span>
                <span className="whitespace-pre text-[#262626]">{line}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="border-l border-[#ececec] p-4">
          <p className="text-[11px] font-semibold">Verificações</p>
          <ul className="mt-2.5 space-y-2.5 text-[11.5px]">
            {[['Testes', '24 de 24 passando'], ['Segredos', 'Fora do código'], ['Permissões', 'Por perfil'], ['Documentação', 'Instalação e operação']].map(([t, d]) => (
              <li key={t} className="flex gap-2"><span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#15803d] text-white"><Check size={10} strokeWidth={3} /></span><span className="leading-tight"><span className="block font-medium">{t}</span><span className={`text-[10.5px] ${MUTED}`}>{d}</span></span></li>
            ))}
          </ul>
          <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-[#ececec]"><div className="h-full w-4/5 bg-brand" /></div>
          <p className={`mt-1.5 text-[10px] ${MUTED}`}>Handoff ao final do ciclo</p>
        </div>
      </div>
    </div>
  );
}

export function PilotPhone() {
  const stages: Array<[string, string, boolean]> = [['Piloto atual', 'v0.1 · criado com IA', true], ['Revisão', 'Pontos críticos corrigidos', true], ['Próxima versão', 'v1.0 · repositório e testes', false], ['Handoff', 'Documentação e acessos', false]];
  return (
    <div className={`flex h-full flex-col bg-[#f6f6f7] ${INK}`}>
      <PhoneStatus />
      <div className="px-5 pt-3">
        <p className="flex items-center gap-1.5 text-[10.5px] font-semibold text-brand"><ShieldCheck size={12} />Seu produto</p>
        <p className="mt-1 text-[19px] font-semibold leading-tight tracking-tight">Do piloto à próxima versão.</p>
      </div>
      <ol className="relative mx-5 mt-5 flex-1 space-y-4 border-l border-[#d4d4d4] pl-5">
        {stages.map(([t, d, done], i) => (
          <li key={t} className="relative">
            <span className={`absolute -left-[27px] top-0.5 flex h-4 w-4 items-center justify-center rounded-full ${done ? 'bg-brand text-white' : i === 2 ? 'border-2 border-brand bg-white' : 'border border-[#d4d4d4] bg-white'}`}>{done && <Check size={10} strokeWidth={3} />}</span>
            <p className={`text-[13px] font-semibold ${done || i === 2 ? '' : 'text-[#a3a3a3]'}`}>{t}</p>
            <p className={`text-[11px] ${MUTED}`}>{d}</p>
          </li>
        ))}
      </ol>
      <div className="mx-4 mb-7 rounded-xl bg-white p-3 shadow-sm">
        <div className="flex items-center justify-between text-[11px]"><span className="font-semibold">Verificações</span><span className="text-[#15803d]">24 de 24</span></div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#ececec]"><div className="h-full w-4/5 bg-brand" /></div>
        <p className={`mt-1.5 text-[10px] ${MUTED}`}>Testes, segredos e permissões</p>
      </div>
    </div>
  );
}

export function PilotDevices() {
  return (
    <DeviceStage
      label="Evolução de um piloto no computador e no celular: revisão de código com verificações e linha do tempo até a v1.0"
      mac={<MacShell><PilotMac /></MacShell>}
      phone={<PhoneShell><PilotPhone /></PhoneShell>}
    />
  );
}

export { Screen };
