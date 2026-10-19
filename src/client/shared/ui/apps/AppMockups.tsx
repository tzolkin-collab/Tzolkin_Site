/**
 * Mini-ilustrações de interface para o bento de aplicações, montadas com o kit de assets.
 * Exemplos ilustrativos: nomes, empresas e documentos são fictícios e nada aqui representa
 * clientes, dados reais ou resultados. Tudo estático (sem animação contínua).
 */
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import {
  Avatar,
  Chip,
  CodeBlock,
  ConnectorLine,
  GlassPanel,
  GradientBands,
  IllustrativeTag,
  MiniBars,
  Sparkline,
  StatusDot,
  tok,
} from '@/client/shared/ui/assets';
import type { CodeLine } from '@/client/shared/ui/assets';

/** Palco: fundo de faixas suaves + recorte. Decorativo, fora da árvore de acessibilidade e do foco. */
function Stage({ children, className, tag = true }: { children: ReactNode; className?: string; tag?: boolean }) {
  return (
    <div
      aria-hidden="true"
      inert
      className={cn('relative isolate overflow-hidden rounded-xl border border-border bg-muted/50', className)}
    >
      <GradientBands variant="subtle" drift={false} noise={false} className="opacity-90 dark:opacity-60" />
      {children}
      {tag ? <IllustrativeTag className={TAG_PILL + ' bottom-2.5 left-3'} /> : null}
    </div>
  );
}

const TAG_PILL = 'absolute z-30 rounded-full border border-border bg-background/90 px-2 py-0.5';
const fadeBottom = '[mask-image:linear-gradient(to_bottom,#000_88%,transparent)]';

/* ------------------------------------------------------------------ */
/* CRM com IA                                                         */
/* ------------------------------------------------------------------ */

type Deal = { name: string; org: string; chip: string; tone: 'neutral' | 'brand' | 'success' | 'warning'; dot: 'neutral' | 'brand' | 'success' | 'warning' };

export function FunnelMock() {
  const cols: { name: string; n: number; deals: Deal[] }[] = [
    {
      name: 'Novos',
      n: 3,
      deals: [
        { name: 'Marina Alves', org: 'Studio Aurora', chip: 'Orçamento', tone: 'neutral', dot: 'warning' },
        { name: 'Rafael Costa', org: 'Casa Norte', chip: 'Indicação', tone: 'neutral', dot: 'neutral' },
        { name: 'Davi Rocha', org: 'Oficina 12', chip: 'Via WhatsApp', tone: 'neutral', dot: 'success' },
      ],
    },
    {
      name: 'Em conversa',
      n: 3,
      deals: [
        { name: 'Beatriz Lima', org: 'Grupo Orion', chip: 'Próximo passo', tone: 'brand', dot: 'brand' },
        { name: 'Caio Mendes', org: 'Loja Vértice', chip: 'Retorno hoje', tone: 'warning', dot: 'warning' },
        { name: 'Sofia Reis', org: 'Café Ponte', chip: 'Resumo pronto', tone: 'brand', dot: 'brand' },
      ],
    },
    {
      name: 'Proposta',
      n: 1,
      deals: [{ name: 'Laura Prado', org: 'Atelier Sol', chip: 'Enviada', tone: 'success', dot: 'success' }],
    },
  ];

  return (
    <Stage
      tag={false}
      className="h-[330px] md:h-[400px] xl:h-full xl:min-h-[420px] xl:rounded-none xl:border-0 xl:border-l"
    >
      <GlassPanel
        elevation={2}
        tilt={{ x: 2, y: -4 }}
        title="funil de vendas"
        headerRight={<Chip tone="brand" dot mono>IA triando</Chip>}
        className="absolute left-5 top-6 z-10 w-[560px] max-w-none md:left-8 md:top-8 xl:left-10 xl:top-10"
        bodyClassName="p-0"
      >
        <div className="relative grid grid-cols-3 gap-8 px-4 pb-4 pt-3.5">
          {cols.map((c, ci) => (
            <div key={c.name} className="relative min-w-0">
              <div className="mb-2.5 flex items-center justify-between text-[11px] font-medium text-muted-foreground">
                <span>{c.name}</span>
                <span className="rounded-full bg-foreground/[0.06] px-1.5 tabular-nums">{c.n}</span>
              </div>
              <div className="space-y-2">
                {c.deals.map((d) => (
                  <div key={d.name} className="rounded-lg border border-border bg-background p-2.5 shadow-sm">
                    <div className="flex items-center gap-2">
                      <Avatar name={d.name} size="sm" />
                      <div className="min-w-0 flex-1 leading-tight">
                        <div className="truncate text-[11.5px] font-semibold text-foreground">{d.name}</div>
                        <div className="truncate text-[10.5px] text-muted-foreground">{d.org}</div>
                      </div>
                      <StatusDot tone={d.dot} size="sm" />
                    </div>
                    <div className="mt-2">
                      <Chip tone={d.tone} className="!px-2 !py-0 !text-[10px]">{d.chip}</Chip>
                    </div>
                  </div>
                ))}
              </div>
              {ci < 2 ? (
                <ConnectorLine
                  width={32}
                  height={44}
                  from={[6, 6]}
                  to={[26, 36]}
                  className="absolute -right-8 top-[58px] z-10"
                />
              ) : null}
            </div>
          ))}
        </div>
      </GlassPanel>
      <GlassPanel
        elevation={3}
        className="absolute bottom-12 left-5 z-20 w-[250px] md:left-8 xl:bottom-14 xl:left-10 max-md:hidden"
        bodyClassName="p-3.5"
      >
        <div className="flex items-end justify-between gap-3">
          <div className="leading-tight">
            <div className="text-[11px] font-semibold text-foreground">Oportunidades criadas</div>
            <div className="mt-0.5 text-[10.5px] text-muted-foreground">Últimas 8 semanas</div>
          </div>
          <Chip tone="success" mono className="!px-1.5 !py-0 !text-[10px]">em alta</Chip>
        </div>
        <Sparkline data={[3, 4, 3.6, 5, 4.8, 6.2, 6, 7.4]} className="mt-2 w-full" ariaLabel="Volume de oportunidades" />
      </GlassPanel>
      <IllustrativeTag className={TAG_PILL + ' bottom-3 left-5 md:left-8 xl:left-10'} />
    </Stage>
  );
}

/* ------------------------------------------------------------------ */
/* Agentes de IA                                                      */
/* ------------------------------------------------------------------ */

const WAVE = [5, 9, 14, 8, 18, 12, 7, 16, 21, 11, 6, 13, 19, 9, 5, 12, 17, 8, 4, 10];

export function ChatMock() {
  return (
    <Stage className="h-[316px]">
      <div className={cn('absolute inset-x-4 top-5 z-10', fadeBottom)}>
        <GlassPanel
          elevation={2}
          title="agente"
          headerRight={
            <span className="flex gap-1">
              <Chip tone="success" dot mono>WhatsApp</Chip>
              <Chip tone="neutral" mono className="max-[400px]:hidden">Voz</Chip>
            </span>
          }
          bodyClassName="space-y-2 p-3.5 text-[12px] leading-snug"
        >
          <div className="flex max-w-[82%] items-center gap-2.5 rounded-2xl rounded-bl-sm border border-border bg-background px-3 py-2">
            <span className="grid size-5 shrink-0 place-items-center rounded-full bg-foreground text-[8px] text-background">▶</span>
            <svg viewBox="0 0 80 24" className="h-5 w-24" aria-hidden="true" focusable="false">
              {WAVE.map((h, i) => (
                <rect key={i} x={i * 4} y={12 - h / 2} width={2} height={h} rx={1} className={i < 12 ? 'fill-brand' : 'fill-foreground/25'} />
              ))}
            </svg>
            <span className="font-mono text-[10px] text-muted-foreground">0:07</span>
          </div>
          <div className="ml-auto max-w-[82%] rounded-2xl rounded-br-sm bg-foreground px-3 py-2 text-background">
            Claro. Me passa o CEP e confirmo agora.
          </div>
          <div className="ml-auto flex w-fit items-center gap-1 rounded-2xl rounded-br-sm border border-border bg-background px-3 py-2.5">
            <span className="size-1.5 rounded-full bg-foreground/45" />
            <span className="size-1.5 rounded-full bg-foreground/30" />
            <span className="size-1.5 rounded-full bg-foreground/20" />
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-brand/30 bg-brand/[0.06] px-2.5 py-2 text-[11px] font-medium text-foreground">
            <Avatar name="Equipe Atendimento" size="sm" paletteIndex={2} />
            Encaminha a uma pessoa
            <span className="ml-auto text-brand">→</span>
          </div>
        </GlassPanel>
      </div>
    </Stage>
  );
}

/* ------------------------------------------------------------------ */
/* E-commerce                                                         */
/* ------------------------------------------------------------------ */

const productArt = [
  'from-[#ffb3bb] via-[#ff7f8e] to-[#c90000]',
  'from-[#ffc58a] via-[#ff9aa6] to-[#7a1426]',
  'from-[#e8e8ec] via-[#9a9aa6] to-[#2a2a31]',
] as const;

export function StoreMock() {
  return (
    <Stage className="h-[316px]">
      <GlassPanel
        elevation={2}
        title="vitrine"
        headerRight={<Chip tone="success" dot mono>Sincronizado</Chip>}
        className="absolute inset-x-4 top-5 z-10"
        bodyClassName="p-3"
      >
        <div className="grid grid-cols-3 gap-2">
          {productArt.map((g, i) => (
            <div key={i} className="rounded-lg border border-border bg-background p-1.5">
              <div className={cn('relative aspect-[4/3] overflow-hidden rounded-md bg-gradient-to-br', g)}>
                <svg viewBox="0 0 40 30" className="absolute inset-0 size-full" aria-hidden="true" focusable="false">
                  {i === 0 ? <circle cx="20" cy="15" r="8" fill="#fff" fillOpacity="0.35" /> : null}
                  {i === 1 ? <path d="M8 24 L20 6 L32 24 Z" fill="#fff" fillOpacity="0.3" /> : null}
                  {i === 2 ? <rect x="11" y="7" width="18" height="16" rx="3" fill="#fff" fillOpacity="0.28" /> : null}
                </svg>
              </div>
              <div className="mt-1.5 h-1.5 w-3/4 rounded-full bg-foreground/60" />
              <div className="mt-1 h-1.5 w-1/3 rounded-full bg-border" />
            </div>
          ))}
        </div>
        <div className="mt-2.5 flex rounded-lg border border-border bg-foreground/[0.04] p-0.5 text-[10.5px]">
          {['Loja', 'Marketplace A', 'Marketplace B'].map((t, i) => (
            <span
              key={t}
              className={cn(
                'flex-1 truncate rounded-md px-1.5 py-1 text-center',
                i === 0 ? 'bg-background font-semibold text-foreground shadow-sm' : 'text-muted-foreground',
              )}
            >
              {t}
            </span>
          ))}
        </div>
        <div className="mt-3 flex items-end justify-between gap-3">
          <div className="leading-tight">
            <div className="text-[11px] font-medium text-foreground">Pedidos por dia</div>
            <div className="mt-0.5 text-[10.5px] text-muted-foreground">Todos os canais</div>
          </div>
          <MiniBars data={[3, 5, 4, 7, 6, 9, 8]} highlightIndex={5} className="w-24" ariaLabel="Pedidos por dia" />
        </div>
      </GlassPanel>
    </Stage>
  );
}

/* ------------------------------------------------------------------ */
/* Automação fiscal                                                   */
/* ------------------------------------------------------------------ */

export function InvoiceMock() {
  const events: [string, string, 'success' | 'warning' | 'brand'][] = [
    ['Pedido recebido', '10:02', 'success'],
    ['Nota emitida', '10:02', 'success'],
    ['Falha ao emitir', '10:05', 'brand'],
    ['Nova tentativa', '10:07', 'warning'],
  ];
  return (
    <Stage className="h-[316px]">
      <GlassPanel
        elevation={2}
        windowDots
        className="absolute left-4 top-5 z-10 w-[58%] max-w-[210px]"
        bodyClassName="p-3.5 text-[11px]"
      >
        <div className="flex items-start justify-between gap-2">
          <div className="leading-tight">
            <div className="text-[12px] font-semibold text-foreground">Nota fiscal</div>
            <div className="mt-0.5 font-mono text-[10px] text-muted-foreground">Pedido 0001</div>
          </div>
          <span className="-rotate-6 rounded border-2 border-[#12a150] px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#12a150] dark:border-[#3fd07a] dark:text-[#3fd07a]">
            Emitida
          </span>
        </div>
        <div className="mt-2.5 font-mono text-[10px] text-muted-foreground">CNPJ 00.000.000/0001-00</div>
        <div className="mt-2.5 space-y-1.5">
          {[['Item A', '1x'], ['Item B', '2x'], ['Frete', '—']].map(([a, b]) => (
            <div key={a} className="flex items-center justify-between border-b border-dashed border-border pb-1.5 text-foreground">
              <span>{a}</span>
              <span className="font-mono text-muted-foreground">{b}</span>
            </div>
          ))}
        </div>
        <div className="mt-2.5 h-1.5 w-2/3 rounded-full bg-foreground/15" />
      </GlassPanel>
      <GlassPanel
        elevation={3}
        className="absolute right-3 top-[138px] z-20 w-[56%] max-w-[190px]"
        bodyClassName="p-3"
      >
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[11px] font-semibold text-foreground">Eventos</span>
          <Chip tone="brand" className="!px-1.5 !py-0 !text-[10px]">Falhou</Chip>
        </div>
        <ul className="space-y-2">
          {events.map(([label, time, tone]) => (
            <li key={label} className="flex items-center gap-2 text-[10.5px] text-foreground">
              <StatusDot tone={tone} size="sm" />
              <span className="min-w-0 flex-1 truncate">{label}</span>
              <span className="font-mono text-muted-foreground">{time}</span>
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
  [tok('cm', '@@ regras.ts · v1 → v2')],
  [tok('kw', '- if'), tok('punct', ' ('), tok('var', 'n'), tok('punct', ' > '), tok('num', '3'), tok('punct', ')')],
  [tok('str', '+ if (n > limite)')],
  [tok('str', '+   registrar()')],
];

export function PilotMock() {
  const checks: [string, boolean][] = [
    ['Revisão de código', true],
    ['Testes passando', true],
    ['Aprovação do cliente', false],
  ];
  return (
    <Stage className="h-[316px]">
      <div className="absolute left-4 top-5 z-10 w-[88%] max-w-[300px]">
        <CodeBlock
          lines={diffLines}
          tabs={[{ name: 'regras.ts', active: true }, { name: 'testes.ts' }]}
          showLineNumbers={false}
          highlightLines={[2]}
          ariaLabel="Exemplo de diferença entre versões"
        />
      </div>
      <GlassPanel
        elevation={3}
        className="absolute bottom-10 right-3 z-20 w-[62%] max-w-[210px]"
        bodyClassName="p-3"
      >
        <svg viewBox="0 0 170 34" className="h-8 w-full" aria-hidden="true" focusable="false">
          <path d="M8 24 H162" className="stroke-border" strokeWidth="2" strokeLinecap="round" fill="none" />
          <path d="M44 24 C60 24 58 9 76 9 H112 C128 9 126 24 140 24" stroke="#c90000" strokeWidth="2" fill="none" strokeLinecap="round" />
          {[8, 44, 140, 162].map((x) => (
            <circle key={x} cx={x} cy={24} r={4} className="fill-background stroke-foreground/50" strokeWidth="1.75" />
          ))}
          {[76, 112].map((x) => (
            <circle key={x} cx={x} cy={9} r={4} className="fill-background" stroke="#c90000" strokeWidth="1.75" />
          ))}
          <circle cx={162} cy={24} r={1.8} fill="#c90000" />
        </svg>
        <ul className="mt-2 space-y-1.5">
          {checks.map(([t, done]) => (
            <li key={t} className="flex items-center gap-2 text-[10.5px] text-foreground">
              <span
                className={cn(
                  'grid size-3.5 shrink-0 place-items-center rounded border text-[9px] leading-none',
                  done ? 'border-brand bg-brand text-white' : 'border-border bg-background',
                )}
              >
                {done ? '✓' : ''}
              </span>
              <span className={done ? '' : 'text-muted-foreground'}>{t}</span>
            </li>
          ))}
        </ul>
      </GlassPanel>
    </Stage>
  );
}
