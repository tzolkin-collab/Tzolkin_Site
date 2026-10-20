/**
 * Mini-ilustrações de interface para o bento de aplicações, montadas com o kit de assets.
 * Exemplos ilustrativos: nomes, empresas e documentos são fictícios e nada aqui representa
 * clientes, dados reais ou resultados. Tudo estático (sem animação contínua, sem filtros).
 *
 * Regras de legibilidade: nenhum texto abaixo de 11px (sem escala por transform), um foco por
 * cartão, layout em fluxo (nada absoluto cobre texto) e o selo "Exemplo ilustrativo" sempre
 * no rodapé do palco, fora do conteúdo.
 */
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import {
  AreaChart,
  Avatar,
  Chip,
  CodeBlock,
  GlassPanel,
  GradientBands,
  IllustrativeTag,
  MiniBars,
  StatusDot,
  tok,
} from '@/client/shared/ui/assets';
import type { CodeLine } from '@/client/shared/ui/assets';

/**
 * Palco: faixas suaves + conteúdo em fluxo + selo no rodapé. Decorativo, fora da árvore de
 * acessibilidade e do foco. No escuro o fundo é quase preto com um véu que limpa as faixas.
 */
function Stage({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      aria-hidden="true"
      inert
      className={cn(
        'relative isolate flex flex-col overflow-hidden rounded-xl border border-border bg-muted/50',
        'dark:border-white/10 dark:bg-[#0b0709]',
        className,
      )}
    >
      <GradientBands variant="subtle" drift={false} noise={false} className="opacity-90 dark:opacity-100" />
      <div
        className="pointer-events-none absolute inset-0 hidden dark:block"
        style={{ background: 'linear-gradient(180deg, rgba(11,7,9,.55) 0%, rgba(11,7,9,.15) 55%, rgba(11,7,9,.7) 100%)' }}
      />
      <div className="relative z-10 flex flex-1 flex-col justify-center px-3 pb-2 pt-5 sm:px-5">{children}</div>
      <div className="relative z-10 px-4 pb-3 sm:px-5">
        <IllustrativeTag className="!text-[11px] !normal-case !tracking-normal text-foreground/70" />
      </div>
    </div>
  );
}

const STAGE_H = 'h-[440px]';
const T_MAIN = 'text-[13px] font-semibold leading-tight text-foreground';
const T_SUB = 'text-[11.5px] leading-tight text-muted-foreground';

/* ------------------------------------------------------------------ */
/* CRM com IA                                                         */
/* ------------------------------------------------------------------ */

type Tone = 'neutral' | 'brand' | 'success' | 'warning';
type Deal = { name: string; org: string; chip: string; tone: Tone };

const COLS: { name: string; n: number; deals: Deal[] }[] = [
  {
    name: 'Novos',
    n: 3,
    deals: [
      { name: 'Marina Alves', org: 'Studio Aurora', chip: 'Orçamento', tone: 'neutral' },
      { name: 'Rafael Costa', org: 'Casa Norte', chip: 'Indicação', tone: 'neutral' },
      { name: 'Júlia Nunes', org: 'Padaria Lume', chip: 'Via WhatsApp', tone: 'success' },
    ],
  },
  {
    name: 'Em conversa',
    n: 3,
    deals: [
      { name: 'Beatriz Lima', org: 'Grupo Orion', chip: 'Resumo pronto', tone: 'brand' },
      { name: 'Caio Mendes', org: 'Loja Vértice', chip: 'Retorno hoje', tone: 'warning' },
      { name: 'Sofia Reis', org: 'Café Ponte', chip: 'Próximo passo', tone: 'brand' },
    ],
  },
  {
    name: 'Proposta',
    n: 3,
    deals: [
      { name: 'Laura Prado', org: 'Atelier Sol', chip: 'Enviada', tone: 'success' },
      { name: 'Davi Rocha', org: 'Oficina 12', chip: 'Em análise', tone: 'neutral' },
      { name: 'Helena Cruz', org: 'Studio Nove', chip: 'Rascunho', tone: 'neutral' },
    ],
  },
];

const OPP_NOVAS = [9, 11, 10, 14, 13, 18, 17, 23] as const;
const OPP_ANTES = [7, 8, 9, 9, 10, 11, 13, 14] as const;

export function FunnelMock() {
  return (
    <Stage className="min-h-[470px] md:min-h-[480px] xl:h-full xl:min-h-[520px] xl:rounded-none xl:border-0 xl:border-l">
      <div className="mx-auto w-full max-w-[560px]">
        <GlassPanel
          elevation={2}
          title="funil"
          headerRight={<Chip tone="brand" dot mono>IA triando</Chip>}
          bodyClassName="p-0"
        >
          <div className="grid grid-cols-2 gap-3 px-3 pb-10 pt-3 sm:grid-cols-3">
            {COLS.map((c, ci) => (
              <div key={c.name} className={cn('min-w-0', ci === 2 && 'max-sm:hidden')}>
                <div className="mb-2 flex items-center justify-between text-[12px] font-medium text-muted-foreground">
                  <span className="truncate">{c.name}</span>
                  <span className="rounded-full bg-foreground/[0.07] px-1.5 text-[11px] tabular-nums">{c.n}</span>
                </div>
                <div className="space-y-2">
                  {c.deals.map((d) => (
                    <div key={d.name} className="rounded-lg border border-border bg-background p-2.5 shadow-sm">
                      <div className="truncate text-[12.5px] font-semibold leading-tight text-foreground">{d.name}</div>
                      <div className="mt-0.5 truncate text-[11.5px] leading-tight text-muted-foreground">{d.org}</div>
                      <Chip tone={d.tone} className="mt-2 !px-2 !py-0">{d.chip}</Chip>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </GlassPanel>
        <GlassPanel elevation={3} className="relative z-20 -mt-8 ml-auto w-full max-w-[310px]" bodyClassName="p-3.5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className={T_MAIN}>Oportunidades criadas</div>
              <div className={cn(T_SUB, 'mt-1')}>Últimas 8 semanas</div>
            </div>
            <Chip tone="success" className="!px-2 !py-0">em alta</Chip>
          </div>
          <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11.5px] text-foreground/80">
            <span className="flex items-center gap-1.5">
              <span className="h-0.5 w-4 rounded-full bg-brand" />
              Este período
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-4 border-t-2 border-dashed border-foreground/40" />
              Anterior
            </span>
          </div>
          <AreaChart
            data={OPP_NOVAS.map((value, i) => ({ label: `S${i + 1}`, value }))}
            compare={OPP_ANTES}
            highlightIndex={7}
            tooltip="23 novas"
            yTicks={3}
            viewWidth={240}
            viewHeight={156}
            fontSize={11.5}
            marginLeft={30}
            maxLabels={8}
            className="mt-1 text-foreground"
            ariaLabel="Oportunidades criadas por semana"
          />
        </GlassPanel>
      </div>
    </Stage>
  );
}

/* ------------------------------------------------------------------ */
/* Agentes de IA                                                      */
/* ------------------------------------------------------------------ */

const WAVE = [5, 9, 14, 8, 18, 12, 7, 16, 21, 11, 6, 13, 19, 9, 5, 12, 17, 8, 4, 10];

export function ChatMock() {
  return (
    <Stage className={STAGE_H}>
      <GlassPanel
        elevation={2}
        windowDots
        headerRight={
          <span className="flex gap-1.5">
            <Chip tone="success" dot mono>WhatsApp</Chip>
            <Chip tone="neutral" mono>Voz</Chip>
          </span>
        }
        bodyClassName="space-y-2.5 p-3.5"
      >
        <div className="max-w-[88%] rounded-2xl rounded-bl-sm border border-border bg-background px-3 py-2.5">
          <div className="flex items-center gap-2.5">
            <span className="grid size-7 shrink-0 place-items-center rounded-full bg-foreground text-background">
              <svg viewBox="0 0 10 10" className="size-2.5" aria-hidden="true" focusable="false">
                <path d="M2 1 L9 5 L2 9 Z" fill="currentColor" />
              </svg>
            </span>
            <svg viewBox="0 0 80 24" className="h-6 w-24 shrink-0" aria-hidden="true" focusable="false">
              {WAVE.map((h, i) => (
                <rect key={i} x={i * 4} y={12 - h / 2} width={2} height={h} rx={1} className={i < 12 ? 'fill-brand' : 'fill-foreground/25'} />
              ))}
            </svg>
            <span className="font-mono text-[11px] text-muted-foreground">0:07</span>
          </div>
          <div className="mt-1.5 text-[11.5px] italic leading-snug text-muted-foreground">“Vocês entregam no meu CEP?”</div>
        </div>
        <div className="ml-auto max-w-[88%] rounded-2xl rounded-br-sm bg-foreground px-3 py-2.5 text-[12.5px] leading-snug text-background">
          Claro. Me passa o CEP e confirmo agora.
        </div>
        <div className="flex items-center gap-2.5 rounded-xl border border-brand/35 bg-brand/[0.07] px-3 py-2 text-[12.5px] font-medium text-foreground">
          <Avatar name="Equipe Atendimento" size="sm" paletteIndex={2} className="!size-7 !text-[11px]" />
          <span className="min-w-0 flex-1">Encaminha a uma pessoa</span>
          <span aria-hidden="true" className="text-brand">→</span>
        </div>
      </GlassPanel>
    </Stage>
  );
}

/* ------------------------------------------------------------------ */
/* E-commerce                                                         */
/* ------------------------------------------------------------------ */

type Product = { name: string; stock: string; bg: string; art: ReactNode };

const PRODUCTS: Product[] = [
  {
    name: 'Caneca',
    stock: '24 un.',
    bg: 'from-[#ffd3d8] via-[#ff8a96] to-[#c9283a]',
    art: (
      <>
        <rect x="9" y="9" width="18" height="17" rx="4" fill="#fff" fillOpacity="0.9" />
        <path d="M27 13 H30 a3.5 3.5 0 0 1 0 8 H27" fill="none" stroke="#fff" strokeOpacity="0.9" strokeWidth="2.4" />
        <rect x="9" y="9" width="18" height="5" rx="2.5" fill="#c9283a" fillOpacity="0.25" />
      </>
    ),
  },
  {
    name: 'Luminária',
    stock: '9 un.',
    bg: 'from-[#ffe2c2] via-[#ffb067] to-[#b4501c]',
    art: (
      <>
        <path d="M11 22 L16 8 H24 L29 22 Z" fill="#fff" fillOpacity="0.9" />
        <rect x="18.5" y="22" width="3" height="5" fill="#fff" fillOpacity="0.85" />
        <rect x="13" y="26" width="14" height="2.4" rx="1.2" fill="#fff" fillOpacity="0.9" />
      </>
    ),
  },
  {
    name: 'Mochila',
    stock: '31 un.',
    bg: 'from-[#8a8a98] via-[#4a4a56] to-[#17171c]',
    art: (
      <>
        <rect x="11" y="9" width="18" height="19" rx="6" fill="#fff" fillOpacity="0.88" />
        <rect x="14.5" y="17" width="11" height="7" rx="2.5" fill="#17171c" fillOpacity="0.28" />
        <path d="M16 9 a4 4 0 0 1 8 0" fill="none" stroke="#fff" strokeOpacity="0.9" strokeWidth="2" />
      </>
    ),
  },
];

export function StoreMock() {
  return (
    <Stage className={STAGE_H}>
      <GlassPanel
        elevation={2}
        windowDots
        headerRight={<Chip tone="success" dot mono>Sincronizado</Chip>}
        bodyClassName="p-3"
      >
        <div className="grid grid-cols-3 gap-2">
          {PRODUCTS.map((p) => (
            <div key={p.name} className="min-w-0 rounded-lg border border-border bg-background p-1.5">
              <div className={cn('relative aspect-square overflow-hidden rounded-md bg-gradient-to-br', p.bg)}>
                <svg viewBox="0 0 40 36" className="absolute inset-0 size-full" aria-hidden="true" focusable="false">
                  <ellipse cx="20" cy="31" rx="12" ry="2.2" fill="#000" fillOpacity="0.16" />
                  {p.art}
                </svg>
              </div>
              <div className="mt-1.5 truncate text-[12px] font-semibold leading-tight text-foreground">{p.name}</div>
              <div className="mt-0.5 text-[11px] leading-tight text-muted-foreground">{p.stock}</div>
            </div>
          ))}
        </div>
        <div className="mt-3 flex rounded-lg border border-border bg-foreground/[0.05] p-0.5 text-[11px]">
          {['Loja', 'Marketplace A', 'Marketplace B'].map((t, i) => (
            <span
              key={t}
              className={cn(
                'whitespace-nowrap rounded-md py-1 text-center',
                i === 0 ? 'flex-none bg-background px-3 font-semibold text-foreground shadow-sm' : 'flex-1 text-muted-foreground',
              )}
            >
              {t}
            </span>
          ))}
        </div>
        <div className="mt-3 flex items-end justify-between gap-3">
          <div>
            <div className={T_MAIN}>Pedidos por dia</div>
            <div className={cn(T_SUB, 'mt-1')}>Todos os canais</div>
          </div>
          <MiniBars data={[3, 5, 4, 7, 6, 9, 8]} highlightIndex={5} className="h-11 w-28 text-foreground" ariaLabel="Pedidos por dia" />
        </div>
      </GlassPanel>
    </Stage>
  );
}

/* ------------------------------------------------------------------ */
/* Automação fiscal                                                   */
/* ------------------------------------------------------------------ */

export function InvoiceMock() {
  const events: [string, string, Tone][] = [
    ['Falhou', '10:05', 'brand'],
    ['Nova tentativa', '10:07', 'warning'],
    ['Emitida', '10:07', 'success'],
  ];
  return (
    <Stage className={STAGE_H}>
      <GlassPanel elevation={2} windowDots className="w-[92%]" bodyClassName="p-3.5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className={T_MAIN}>Nota fiscal</div>
            <div className="mt-1 font-mono text-[11px] leading-snug text-muted-foreground">Pedido 0001<br />CNPJ 00.000.000/0001-00</div>
          </div>
          <span className="shrink-0 -rotate-6 rounded border-2 border-[#12a150] px-1.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-[#0d7a3c] dark:border-[#3fd07a] dark:text-[#3fd07a]">
            Emitida
          </span>
        </div>
        <div className="mt-3 space-y-1.5 text-[12px] text-foreground">
          {[['Camiseta básica', '2x'], ['Caneca', '1x'], ['Frete', '—']].map(([a, b]) => (
            <div key={a} className="flex items-center justify-between border-b border-dashed border-border pb-1.5 last:border-b-0 last:pb-0">
              <span>{a}</span>
              <span className="font-mono text-muted-foreground">{b}</span>
            </div>
          ))}
        </div>
      </GlassPanel>
      <GlassPanel elevation={3} className="relative z-20 ml-auto mt-3 w-[88%]" bodyClassName="p-3.5">
        <div className="mb-2.5 flex items-center justify-between">
          <span className={T_MAIN}>Eventos</span>
          <Chip tone="neutral" className="!px-2 !py-0">3 hoje</Chip>
        </div>
        <ul className="space-y-2.5">
          {events.map(([label, time, tone]) => (
            <li key={label} className="flex items-center gap-2.5 text-[12px] text-foreground">
              <StatusDot tone={tone} size="sm" />
              <span className="min-w-0 flex-1 truncate">{label}</span>
              <span className="font-mono text-[11px] text-muted-foreground">{time}</span>
            </li>
          ))}
        </ul>
      </GlassPanel>
    </Stage>
  );
}

/* ------------------------------------------------------------------ */
/* Evoluir um piloto                                                  */
/* ------------------------------------------------------------------ */

const diffLines: readonly CodeLine[] = [
  [tok('cm', '@@ regras.ts')],
  [tok('kw', '- if (n > 3) {')],
  [tok('str', '+ if (n > limite) {')],
  [tok('str', '+   registrar(n)')],
];

export function PilotMock() {
  const checks: [string, boolean][] = [
    ['Revisão de código', true],
    ['Testes passando', true],
    ['Aprovação do cliente', false],
  ];
  return (
    <Stage className={STAGE_H}>
      <CodeBlock
        lines={diffLines}
        tabs={[{ name: 'regras.ts', active: true }]}
        showLineNumbers={false}
        ariaLabel="Exemplo de diferença entre versões"
      />
      <GlassPanel elevation={3} className="relative z-20 ml-auto mt-3 w-[92%]" bodyClassName="p-3.5">
        <svg viewBox="0 0 200 30" className="h-7 w-full" aria-hidden="true" focusable="false">
          <path d="M8 22 H192" className="stroke-border" strokeWidth="2" strokeLinecap="round" fill="none" />
          <path d="M48 22 C64 22 62 8 80 8 H128 C146 8 144 22 160 22" stroke="#c90000" strokeWidth="2" fill="none" strokeLinecap="round" />
          {[8, 48, 160, 192].map((x) => (
            <circle key={x} cx={x} cy={22} r={4} className="fill-background stroke-foreground/50" strokeWidth="1.75" />
          ))}
          {[80, 128].map((x) => (
            <circle key={x} cx={x} cy={8} r={4} className="fill-background" stroke="#c90000" strokeWidth="1.75" />
          ))}
          <circle cx={192} cy={22} r={1.8} fill="#c90000" />
        </svg>
        <ul className="mt-2.5 space-y-2">
          {checks.map(([t, done]) => (
            <li key={t} className="flex items-center gap-2.5 text-[12px] text-foreground">
              <span
                className={cn(
                  'grid size-4 shrink-0 place-items-center rounded border',
                  done ? 'border-brand bg-brand text-white' : 'border-border bg-background',
                )}
              >
                {done ? (
                  <svg viewBox="0 0 10 10" className="size-2.5" aria-hidden="true" focusable="false">
                    <path d="M2 5.3 L4.2 7.5 L8 2.8" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : null}
              </span>
              <span className={done ? '' : 'text-muted-foreground'}>{t}</span>
            </li>
          ))}
        </ul>
      </GlassPanel>
    </Stage>
  );
}
