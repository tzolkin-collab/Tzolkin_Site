import type { CSSProperties, ReactNode } from 'react';
import {
  AreaChart,
  Avatar,
  Chip,
  CodeBlock,
  ConnectorLine,
  GlassPanel,
  GradientBands,
  IllustrativeTag,
  Sparkline,
  StatusDot,
  tok,
} from '@/client/shared/ui/assets';

/* Todos os dados abaixo são fictícios e ilustrativos. */

const LEADS = [12, 14, 13, 18, 17, 22, 21, 27, 26, 31];
const REPLY = [30, 28, 29, 24, 25, 20, 21, 17, 16, 14];
const RATE = [60, 66, 64, 71, 75, 74, 82, 85, 88, 92];

const SERIES = [
  { label: 'S1', value: 20 },
  { label: 'S2', value: 26 },
  { label: 'S3', value: 24 },
  { label: 'S4', value: 33 },
  { label: 'S5', value: 38 },
  { label: 'S6', value: 47 },
  { label: 'S7', value: 52 },
  { label: 'S8', value: 61 },
];
const COMPARE = [18, 21, 22, 24, 25, 27, 28, 30];

type Tone = 'brand' | 'success' | 'warning' | 'neutral';

const COLUMNS: { title: string; count: number; cards: { name: string; note: string; src: string; tone: Tone; status: 'brand' | 'success' | 'warning' }[] }[] = [
  {
    title: 'Novos',
    count: 3,
    cards: [
      { name: 'Aurora Co.', note: 'Pediu orçamento', src: 'WhatsApp', tone: 'success', status: 'success' },
      { name: 'Loja Vitta', note: 'Demo agendada', src: 'Site', tone: 'neutral', status: 'warning' },
    ],
  },
  {
    title: 'Em conversa',
    count: 2,
    cards: [
      { name: 'G. Nobre', note: 'Proposta enviada', src: 'Indicação', tone: 'warning', status: 'warning' },
      { name: 'Prado Auto', note: 'Aguardando retorno', src: 'Agente de IA', tone: 'brand', status: 'brand' },
    ],
  },
  {
    title: 'Fechados',
    count: 1,
    cards: [{ name: 'Lume', note: 'Contrato assinado', src: 'Agente de IA', tone: 'brand', status: 'success' }],
  },
];

function Icon({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}

const ICONS = [
  'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z',
  'M16 20v-1a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v1M10 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM20 20v-1a3.5 3.5 0 0 0-2.5-3.3',
  'M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z',
  'M4 20V10M10 20V4M16 20v-7M22 20H2',
];

function Sidebar() {
  return (
    <div className="flex w-10 shrink-0 flex-col items-center gap-3 border-r border-black/[0.07] bg-black/[0.02] py-4 dark:border-white/[0.08] dark:bg-white/[0.025]" aria-hidden="true">
      <span className="grid size-6 place-items-center rounded-md bg-brand text-[10px] font-bold text-brand-foreground">T</span>
      {ICONS.map((d, i) => (
        <span key={i} className={`grid size-7 place-items-center rounded-md ${i === 3 ? 'bg-foreground/[0.08] text-foreground' : 'text-muted-foreground'}`}>
          <Icon d={d} />
        </span>
      ))}
    </div>
  );
}

function Metric({ label, value, data, tone = 'brand' }: { label: string; value: string; data: number[]; tone?: 'brand' | 'neutral' | 'success' }) {
  return (
    <div className="min-w-0 flex-1 rounded-lg border border-black/[0.07] bg-background/60 px-2.5 py-2 dark:border-white/[0.08]">
      <p className="text-[10px] font-medium leading-3 text-muted-foreground sm:truncate max-sm:min-h-6">{label}</p>
      <div className="mt-1 flex items-end justify-between gap-1">
        <p className="whitespace-nowrap text-[15px] font-semibold leading-none tracking-tight text-foreground tabular-nums">{value}</p>
        <Sparkline data={data} tone={tone} endDot={false} fill={false} className="h-5 w-9 shrink-0" />
      </div>
    </div>
  );
}

function Floating({ children, className = '', tone = 'neutral' }: { children: ReactNode; className?: string; tone?: 'brand' | 'success' | 'neutral' }) {
  return (
    <span
      className={`absolute z-40 inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-black/10 bg-card px-3 py-1.5 text-[11px] font-medium text-foreground shadow-[0_1px_1px_rgba(10,10,12,.08),0_8px_20px_-6px_rgba(10,10,12,.28)] dark:border-white/15 ${className}`}
    >
      <StatusDot tone={tone} size="sm" />
      {children}
    </span>
  );
}

function CommercialPanel({ chartClass = 'h-[150px]', className = '', style }: { chartClass?: string; className?: string; style?: CSSProperties }) {
  return (
    <GlassPanel
      title="Painel comercial"
      elevation={2}
      headerRight={<IllustrativeTag>Ilustrativo</IllustrativeTag>}
      bodyClassName="flex p-0"
      className={`!bg-card dark:!bg-card ${className}`}
      style={style}
    >
      <Sidebar />
      <div className="min-w-0 flex-1 p-3">
        <div className="flex gap-2">
          <Metric label="Leads qualificados" value="128" data={LEADS} />
          <Metric label="Tempo de resposta" value="1m 48s" data={REPLY} tone="neutral" />
          <Metric label="Taxa de resposta" value="94%" data={RATE} tone="success" />
        </div>
        <div className="mt-3 flex items-center justify-between px-0.5">
          <p className="text-[10px] font-medium text-muted-foreground">Leads por semana</p>
          <p className="flex items-center gap-2 text-[10px] text-muted-foreground">
            <span className="inline-flex items-center gap-1"><span className="h-0.5 w-3 rounded bg-brand" />Atual</span>
            <span className="inline-flex items-center gap-1"><span className="h-0.5 w-3 rounded bg-muted-foreground/60" />Anterior</span>
          </p>
        </div>
        <AreaChart data={SERIES} compare={COMPARE} highlightIndex={5} tooltip="S6 · 47 leads" ariaLabel="Gráfico ilustrativo de leads por semana com série de comparação" className={`mt-1 w-full ${chartClass}`} />
      </div>
    </GlassPanel>
  );
}

function ChatPanel({ className = '', style }: { className?: string; style?: CSSProperties }) {
  return (
    <GlassPanel
      title="Agente IA"
      elevation={3}
      headerRight={<IllustrativeTag>Ilustrativo</IllustrativeTag>}
      bodyClassName="space-y-2 p-3 text-[11px] leading-snug"
      className={`!bg-card dark:!bg-card ${className}`}
      style={style}
    >
      <div className="max-w-[88%] rounded-2xl rounded-bl-sm bg-muted px-3 py-2 text-foreground">
        Vocês integram com o meu sistema de estoque?
      </div>
      <div className="ml-auto max-w-[88%] rounded-2xl rounded-br-sm bg-foreground px-3 py-2 text-background">
        Integramos sim. Posso agendar uma conversa com o time para entender o seu caso.
      </div>
      <div className="flex w-fit items-center gap-1 rounded-2xl rounded-bl-sm bg-muted px-3 py-2.5" aria-hidden="true">
        <span className="size-1.5 rounded-full bg-foreground/30" />
        <span className="size-1.5 rounded-full bg-foreground/55" />
        <span className="size-1.5 rounded-full bg-foreground/80" />
      </div>
      <div className="flex items-center gap-2 rounded-lg border border-black/10 bg-background/70 px-2.5 py-2 text-muted-foreground dark:border-white/12">
        <StatusDot tone="success" size="sm" />
        <span>
          Lead qualificado · <span className="font-semibold text-foreground">Encaminhado a Ana</span>
        </span>
      </div>
    </GlassPanel>
  );
}

function PipelinePanel({ className = '', style }: { className?: string; style?: CSSProperties }) {
  return (
    <GlassPanel
      title="Pipeline"
      elevation={3}
      headerRight={<IllustrativeTag>Ilustrativo</IllustrativeTag>}
      bodyClassName="grid grid-cols-3 gap-2 bg-black/[0.025] p-2.5 dark:bg-white/[0.02]"
      className={`!bg-card dark:!bg-card ${className}`}
      style={style}
    >
      {COLUMNS.map((col) => (
        <div key={col.title} className="min-w-0">
          <div className="mb-1.5 flex items-center justify-between px-0.5 text-[10px] font-semibold text-muted-foreground">
            <span className="truncate">{col.title}</span>
            <span className="rounded bg-foreground/[0.07] px-1 tabular-nums">{col.count}</span>
          </div>
          <div className="space-y-1.5">
            {col.cards.map((c) => (
              <div key={c.name} className="rounded-lg border border-black/[0.08] bg-card p-2 shadow-[0_1px_2px_rgba(10,10,12,.06)] dark:border-white/10">
                <div className="flex items-center gap-1.5">
                  <Avatar name={c.name} size="sm" className="!size-5 !text-[8px]" />
                  <p className="min-w-0 flex-1 truncate text-[10.5px] font-semibold text-foreground">{c.name}</p>
                  <StatusDot tone={c.status} size="sm" />
                </div>
                <p className="mt-1 truncate text-[10px] text-muted-foreground">{c.note}</p>
                <Chip tone={c.tone} className="mt-1.5 !px-1.5 !py-0 !text-[9.5px]">{c.src}</Chip>
              </div>
            ))}
          </div>
        </div>
      ))}
    </GlassPanel>
  );
}

const PAYLOAD = [
  [tok('punct', '{')],
  [tok('plain', '  '), tok('str', '"evento"'), tok('punct', ': '), tok('str', '"lead.qualificado"'), tok('punct', ',')],
  [tok('plain', '  '), tok('str', '"origem"'), tok('punct', ': '), tok('str', '"whatsapp"'), tok('punct', ',')],
  [tok('plain', '  '), tok('str', '"score"'), tok('punct', ': '), tok('num', '87'), tok('punct', ',')],
  [tok('plain', '  '), tok('str', '"responsavel"'), tok('punct', ': '), tok('str', '"Ana"')],
  [tok('punct', '}')],
] as const;

/** Composição ilustrativa de produto: painel, pipeline, agente de IA e payload, ligados por um fluxo. */
export function HeroMockups() {
  return (
    <div role="img" aria-label="Exemplo ilustrativo de painel comercial, funil de CRM e conversa com agente de IA" className="relative w-full">
      {/* Mobile / tablet: composição reduzida, 2 painéis */}
      <div className="relative mx-auto w-full max-w-[460px] lg:hidden">
        <div
          className="pointer-events-none absolute -inset-x-10 -inset-y-12"
          aria-hidden="true"
          style={{ WebkitMaskImage: 'linear-gradient(to bottom, transparent, #000 28%, #000 72%, transparent)', maskImage: 'linear-gradient(to bottom, transparent, #000 28%, #000 72%, transparent)' }}
        >
          <GradientBands variant="hero" drift={false} />
        </div>
        <div className="relative">
          <CommercialPanel chartClass="h-[120px]" />
          <ChatPanel className="relative z-10 -mt-6 ml-auto w-[88%]" />
          <Floating tone="success" className="-bottom-3 left-0 -rotate-[3deg]">Lead qualificado</Floating>
        </div>
      </div>

      {/* Desktop: palco 640x620 em camadas, reduzido por escala estática */}
      <div className="relative hidden h-[470px] lg:block xl:h-[560px]" aria-hidden="true">
        <div className="absolute left-0 top-0 h-[620px] w-[640px] origin-top-left lg:scale-[0.75] xl:scale-[0.9]">
          <CommercialPanel className="absolute left-0 top-8 z-10 w-[440px]" style={{ transform: 'perspective(1600px) rotateX(3deg) rotateY(-7deg)' }} />
          <CodeBlock
            variant="editor"
            ariaLabel="Exemplo ilustrativo de payload JSON de um lead qualificado"
            tabs={[{ name: 'lead.json', active: true }]}
            lines={PAYLOAD}
            highlightLines={[2]}
            className="absolute left-[360px] top-[470px] z-0 w-[280px] text-[11px]"
          />
          <PipelinePanel className="absolute left-6 top-[282px] z-20 w-[350px]" style={{ transform: 'perspective(1600px) rotateX(2deg) rotateY(-5deg)' }} />
          <ChatPanel className="absolute right-0 top-[166px] z-30 w-[264px]" />
          <div className="absolute left-[416px] top-[428px] z-30">
            <ConnectorLine width={48} height={64} from={[24, 5]} to={[24, 58]} curve="straight" dashed />
          </div>
          <Floating tone="success" className="left-[262px] top-0 rotate-[-3deg]">Lead qualificado</Floating>
          <Floating tone="brand" className="left-2 top-[556px] rotate-[-2.5deg]">NF emitida</Floating>
          <Floating tone="neutral" className="-right-1 top-[436px] rotate-[2deg]">Pedido sincronizado</Floating>
        </div>
      </div>
    </div>
  );
}
