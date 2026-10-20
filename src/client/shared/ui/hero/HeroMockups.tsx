import type { ReactNode } from 'react';
import { AreaChart, Chip, ConnectorLine, GlassPanel, IllustrativeTag, Sparkline, StatusDot } from '@/client/shared/ui/assets';
import { HeroBands } from '@/client/shared/ui/hero/HeroBackground';

/*
 * Composição ilustrativa do hero. Todos os dados são fictícios.
 * Regras: nenhum texto abaixo de 11px efetivo (sem transform de escala; o gráfico
 * é renderizado em 3 tamanhos de viewBox para manter o texto 1:1), sem animação,
 * sem filter/backdrop-blur. Em 1024-1279px o funil some em vez de encolher.
 *
 * História: ① lead chega pelo WhatsApp → ② agente de IA qualifica → ③ oportunidade
 * entra no funil e é encaminhada a uma pessoa.
 */

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
const LEADS = [12, 14, 13, 18, 17, 22, 21, 27, 26, 31];
const REPLY = [30, 28, 29, 24, 25, 20, 21, 17, 16, 14];
const RATE = [60, 66, 64, 71, 75, 74, 82, 85, 88, 92];

type Tone = 'brand' | 'success' | 'warning' | 'neutral';

const COLUMNS: { title: string; cards: { name: string; note: string; src: string; tone: Tone; focus?: boolean }[] }[] = [
  {
    title: 'Novos',
    cards: [
      { name: 'Aurora Co.', note: 'Orçamento', src: 'WhatsApp', tone: 'success' },
      { name: 'Loja Vitta', note: 'Pediu demo', src: 'Site', tone: 'neutral' },
    ],
  },
  {
    title: 'Qualificados',
    cards: [
      { name: 'Casa Nobre', note: 'Score 72', src: 'Indicação', tone: 'warning' },
      { name: 'Verde Vale', note: 'Score 65', src: 'Site', tone: 'neutral' },
    ],
  },
  {
    title: 'Com o time',
    cards: [
      { name: 'Prado Auto', note: 'Com a Ana', src: 'WhatsApp', tone: 'success', focus: true },
      { name: 'Lume Foods', note: 'Reunião sex.', src: 'Indicação', tone: 'warning' },
    ],
  },
];

/* Superfícies: no escuro o painel fica mais claro que o fundo, com borda sutil. */
const SURFACE = '!bg-card dark:!bg-[oklch(0.24_0_0)] dark:!border-white/[0.16] [&>div:first-child_.font-mono]:!text-xs';

function Step({ n, children, className = '' }: { n: number; children: ReactNode; className?: string }) {
  return (
    <span
      className={`absolute z-40 inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-black/10 bg-card py-1 pl-1 pr-3 text-xs font-medium text-foreground shadow-[0_1px_1px_rgba(10,10,12,.08),0_8px_18px_-6px_rgba(10,10,12,.3)] dark:border-white/20 dark:bg-[oklch(0.3_0_0)] ${className}`}
    >
      <span className="grid size-5 place-items-center rounded-full bg-brand text-xs font-bold leading-none text-brand-foreground">{n}</span>
      {children}
    </span>
  );
}

function Metric({ label, value, data, tone = 'brand', className = '' }: { label: string; value: string; data: number[]; tone?: 'brand' | 'neutral' | 'success'; className?: string }) {
  return (
    <div className={`min-w-0 flex-1 rounded-lg border border-black/[0.08] bg-background/60 px-2.5 py-2 dark:border-white/[0.12] dark:bg-black/20 ${className}`}>
      <p className="truncate text-xs font-medium leading-4 text-muted-foreground">{label}</p>
      <div className="mt-1 flex items-end justify-between gap-1">
        <p className="whitespace-nowrap text-base font-semibold leading-none tracking-tight text-foreground tabular-nums">{value}</p>
        <Sparkline data={data} tone={tone} endDot={false} fill={false} className="h-5 w-9 shrink-0" />
      </div>
    </div>
  );
}

const CHART_LABEL = 'Gráfico ilustrativo de leads por semana: série atual e série anterior';

function CommercialPanel({ className = '' }: { className?: string }) {
  return (
    <GlassPanel title="Painel comercial" elevation={2} bodyClassName="p-3.5 pb-9 xl:p-4 xl:pb-9" className={`${SURFACE} ${className}`}>
      <div className="flex gap-2">
        <Metric label="Leads qualificados" value="128" data={LEADS} />
        <Metric label="Tempo de resposta" value="1m 48s" data={REPLY} tone="neutral" className="max-sm:hidden" />
        <Metric label="Taxa de resposta" value="94%" data={RATE} tone="success" />
      </div>
      <div className="mt-3.5 flex items-center justify-between gap-3 px-0.5">
        <p className="text-xs font-semibold text-foreground">Leads por semana</p>
        <p className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-0.5 w-3.5 rounded bg-brand" />
            Atual
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-3.5 border-t-2 border-dashed border-foreground/55" />
            Anterior
          </span>
        </p>
      </div>
      {/* Um viewBox por faixa de largura: o texto do gráfico fica em escala 1:1 */}
      <AreaChart data={SERIES} compare={COMPARE} compareOpacity={0.6} highlightIndex={5} tooltip="S6 · 47 leads" width={300} height={190} fontSize={12} seriesEnd="#e8344a" ariaLabel={CHART_LABEL} className="mt-1 w-full min-[490px]:hidden" />
      <AreaChart data={SERIES} compare={COMPARE} compareOpacity={0.6} highlightIndex={5} tooltip="S6 · 47 leads" width={420} height={210} fontSize={12} seriesEnd="#e8344a" ariaLabel={CHART_LABEL} className="mt-1 hidden w-full min-[490px]:block xl:hidden" />
      <AreaChart data={SERIES} compare={COMPARE} compareOpacity={0.6} highlightIndex={5} tooltip="S6 · 47 leads" width={500} height={220} fontSize={12} seriesEnd="#e8344a" ariaLabel={CHART_LABEL} className="mt-1 hidden w-full xl:block" />
    </GlassPanel>
  );
}

function ChatPanel({ className = '' }: { className?: string }) {
  return (
    <GlassPanel title="Conversa" elevation={3} bodyClassName="space-y-2 p-3 text-xs leading-snug" className={`${SURFACE} ${className}`}>
      <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <StatusDot tone="success" size="sm" />
        Marcos · Prado Auto
      </p>
      <div className="max-w-[92%] rounded-2xl rounded-bl-sm bg-muted px-3 py-2 text-foreground dark:bg-white/[0.1]">
        Oi! Vocês integram com o nosso estoque?
      </div>
      <div className="ml-auto max-w-[92%] rounded-2xl rounded-br-sm bg-foreground px-3 py-2 text-background">
        Integramos sim! Posso chamar a Ana, do time comercial?
      </div>
      <div className="flex items-center gap-2 rounded-lg border border-black/10 bg-background/70 px-2.5 py-2 text-muted-foreground dark:border-white/[0.14] dark:bg-black/20">
        <StatusDot tone="success" size="sm" />
        <span>
          Qualificado · <span className="font-semibold text-foreground">score 87</span>
        </span>
      </div>
      {/* Sem o funil (abaixo de 1280px) a etapa 3 aparece aqui */}
      <div className="flex items-center gap-2 rounded-lg border border-brand/30 bg-brand/[0.06] px-2.5 py-2 text-muted-foreground xl:hidden">
        <span className="grid size-5 shrink-0 place-items-center rounded-full bg-brand text-xs font-bold leading-none text-brand-foreground">3</span>
        <span>
          No funil · <span className="font-semibold text-foreground">com a Ana</span>
        </span>
      </div>
    </GlassPanel>
  );
}

function PipelinePanel({ className = '' }: { className?: string }) {
  return (
    <GlassPanel title="Funil de vendas" elevation={3} bodyClassName="grid grid-cols-3 gap-1.5 bg-black/[0.03] p-2.5 dark:bg-white/[0.03]" className={`${SURFACE} ${className}`}>
      {COLUMNS.map((col) => (
        <div key={col.title} className="min-w-0">
          <div className="mb-1.5 flex items-center gap-1 px-0.5 text-[11px] font-semibold leading-4 text-muted-foreground">
            <span className="truncate">{col.title}</span>
          </div>
          <div className="space-y-1.5">
            {col.cards.map((c) => (
              <div
                key={c.name}
                className={`rounded-lg border bg-card p-2 shadow-[0_1px_2px_rgba(10,10,12,.06)] dark:bg-[oklch(0.29_0_0)] ${c.focus ? 'border-brand/60 ring-1 ring-brand/30' : 'border-black/[0.08] dark:border-white/[0.12]'}`}
              >
                <p className="truncate text-xs font-semibold leading-4 text-foreground">{c.name}</p>
                <p className="mt-0.5 truncate text-[11px] leading-4 text-muted-foreground">{c.note}</p>
                <Chip tone={c.tone} className="mt-1.5 !px-1.5 !py-0 !text-[11px]">{c.src}</Chip>
              </div>
            ))}
          </div>
        </div>
      ))}
    </GlassPanel>
  );
}

const FADE = 'linear-gradient(to bottom, transparent, #000 28%, #000 72%, transparent)';

/** Composição ilustrativa de produto: painel comercial (herói), conversa com o agente de IA e funil. */
export function HeroMockups() {
  return (
    <div role="img" aria-label="Exemplo ilustrativo: um lead chega pelo WhatsApp, o agente de IA qualifica e a oportunidade entra no funil, encaminhada a uma pessoa do time" className="relative w-full">
      {/* Faixas atrás da composição, só abaixo de lg (em lg+ o fundo é o HeroBackground) */}
      <div className="pointer-events-none absolute -inset-x-10 -inset-y-12 lg:hidden" aria-hidden="true" style={{ WebkitMaskImage: FADE, maskImage: FADE }}>
        <HeroBands />
      </div>

      <div aria-hidden="true" inert className="relative mx-auto flex w-full max-w-[520px] flex-col lg:max-w-none xl:block xl:h-[690px] xl:max-w-[572px] xl:mx-0">
        <CommercialPanel className="relative z-10 xl:absolute xl:left-6 xl:top-0 xl:w-[548px]" />

        <div className="relative z-20 -mt-5 ml-auto w-[92%] sm:w-[78%] lg:w-[72%] xl:absolute xl:left-0 xl:top-[392px] xl:mt-0 xl:w-[244px]">
          <ChatPanel />
          <Step n={1} className="-top-4 right-3">WhatsApp</Step>
          <Step n={2} className="-bottom-4 right-3 xl:left-3 xl:right-auto">IA qualifica</Step>
        </div>

        <div className="relative hidden xl:absolute xl:left-[276px] xl:top-[428px] xl:block xl:w-[296px] z-20">
          <PipelinePanel />
          <Step n={3} className="-top-4 right-3">Com a Ana</Step>
        </div>

        <div className="pointer-events-none absolute left-[238px] top-[530px] z-30 hidden xl:block">
          <ConnectorLine width={48} height={14} from={[5, 7]} to={[43, 7]} curve="straight" dashed />
        </div>

        <IllustrativeTag className="mt-9 !text-xs !normal-case !tracking-normal !text-muted-foreground xl:absolute xl:bottom-0 xl:left-0 xl:mt-0">Exemplo ilustrativo</IllustrativeTag>
      </div>
    </div>
  );
}
