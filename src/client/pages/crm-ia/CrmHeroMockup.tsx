import type { ReactNode } from "react";
import { Avatar, Chip, CodeBlock, ConnectorLine, GlassPanel, IllustrativeTag, StatusDot, tok } from "@/client/shared/ui/assets";
import type { ChipTone, CodeLine } from "@/client/shared/ui/assets";
import { HeroBands } from "@/client/shared/ui/hero/HeroBackground";

/*
 * Composição ilustrativa do hero do CRM com IA. Todos os dados são fictícios.
 * História: entrada de contato -> IA organiza o contexto -> registro no CRM e
 * encaminhamento ao responsável -> funil com status.
 * Regras: nenhum texto efetivo abaixo de 11px, sem animação, sem filter/backdrop-blur,
 * sem transform de escala.
 */

type Origin = "Formulário" | "WhatsApp" | "Anúncio";
const ORIGIN_TONE: Record<Origin, ChipTone> = { Formulário: "neutral", WhatsApp: "success", Anúncio: "warning" };

interface Opp {
  name: string;
  origin: Origin;
  note: string;
  dot: "success" | "warning" | "neutral";
  focus?: boolean;
}

const COLUMNS: { title: string; cards: Opp[] }[] = [
  {
    title: "Novo",
    cards: [
      { name: "Camila Duarte", origin: "Formulário", note: "Pediu orçamento", dot: "warning" },
      { name: "Rafael Lima", origin: "Anúncio", note: "Quer conhecer", dot: "neutral" },
    ],
  },
  {
    title: "Em atendimento",
    cards: [
      { name: "Marcos Prado", origin: "WhatsApp", note: "Com Ana Souza", dot: "success", focus: true },
      { name: "Beatriz Nogueira", origin: "Formulário", note: "Com Paulo Reis", dot: "success" },
    ],
  },
  {
    title: "Acompanhando",
    cards: [
      { name: "Thiago Alves", origin: "WhatsApp", note: "Retorno na sexta", dot: "warning" },
      { name: "Larissa Melo", origin: "Anúncio", note: "Aguardando resposta", dot: "neutral" },
    ],
  },
];

const PAYLOAD: CodeLine[] = [
  [tok("punct", "{")],
  [tok("plain", "  "), tok("var", '"origem"'), tok("punct", ": "), tok("str", '"whatsapp"'), tok("punct", ",")],
  [tok("plain", "  "), tok("var", '"contato"'), tok("punct", ": "), tok("str", '"Marcos Prado"'), tok("punct", ",")],
  [tok("plain", "  "), tok("var", '"urgencia"'), tok("punct", ": "), tok("str", '"alta"'), tok("punct", ",")],
  [tok("plain", "  "), tok("var", '"responsavel"'), tok("punct", ": "), tok("str", '"Ana Souza"'), tok("punct", ",")],
  [tok("plain", "  "), tok("var", '"avisado"'), tok("punct", ": "), tok("kw", "true")],
  [tok("punct", "}")],
];

/* Painéis sempre legíveis: no escuro ficam mais claros que o fundo. Cabeçalho mono em 12px. */
const SURFACE = "!bg-card dark:!bg-[oklch(0.24_0_0)] dark:!border-white/[0.16] [&>div:first-child_.font-mono]:!text-xs";

const FADE =
  "linear-gradient(to right, transparent, #000 18%, #000 100%), linear-gradient(to bottom, transparent, #000 20%, #000 80%, transparent)";

function Step({ n, children, className = "" }: { n: number; children: ReactNode; className?: string }) {
  return (
    <span
      className={`absolute z-40 inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-black/10 bg-card py-1 pl-1 pr-3 text-xs font-medium text-foreground shadow-[0_1px_1px_rgba(10,10,12,.08),0_8px_18px_-6px_rgba(10,10,12,.3)] dark:border-white/20 dark:bg-[oklch(0.3_0_0)] ${className}`}
    >
      <span className="grid size-5 place-items-center rounded-full bg-brand text-xs font-bold leading-none text-brand-foreground">{n}</span>
      {children}
    </span>
  );
}

function ContextRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-border/70 py-2 last:border-b-0 last:pb-0 first:pt-0">
      <dt className="shrink-0 text-xs text-muted-foreground">{label}</dt>
      <dd className="min-w-0 text-right text-xs font-medium leading-snug text-foreground">{children}</dd>
    </div>
  );
}

function ContextPanel({ className = "" }: { className?: string }) {
  return (
    <GlassPanel title="Contexto da conversa" elevation={2} bodyClassName="p-3.5" className={`${SURFACE} ${className}`}>
      <div className="flex items-center gap-2.5">
        <Avatar name="Marcos Prado" size="md" paletteIndex={1} />
        <div className="min-w-0">
          <p className="truncate text-[13px] font-semibold leading-4 text-foreground">Marcos Prado</p>
          <p className="mt-0.5 text-xs leading-4 text-muted-foreground">Mensagem recebida</p>
        </div>
        <Chip tone="success" dot className="ml-auto">WhatsApp</Chip>
      </div>
      <dl className="mt-3 rounded-lg border border-black/[0.08] bg-background/60 px-3 py-2.5 dark:border-white/[0.12] dark:bg-black/20">
        <ContextRow label="Necessidade">Orçamento de frota</ContextRow>
        <ContextRow label="Urgência">
          <Chip tone="warning" className="!text-xs">Alta</Chip>
        </ContextRow>
        <ContextRow label="Próximo passo">Retornar ainda hoje</ContextRow>
      </dl>
      <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
        <StatusDot tone="success" size="sm" />
        Resumo salvo no CRM
      </p>
    </GlassPanel>
  );
}

function PipelinePanel({ className = "" }: { className?: string }) {
  return (
    <GlassPanel
      title="Funil de oportunidades"
      elevation={3}
      bodyClassName="grid gap-2.5 bg-black/[0.03] p-3 dark:bg-white/[0.03] sm:grid-cols-3 sm:gap-2"
      className={`${SURFACE} ${className}`}
    >
      {COLUMNS.map((col) => (
        <div key={col.title} className="min-w-0">
          <p className="mb-1.5 truncate px-0.5 text-xs font-semibold leading-4 text-muted-foreground">{col.title}</p>
          <div className="space-y-2">
            {col.cards.map((c, i) => (
              <div
                key={c.name}
                className={`${i > 0 ? "max-sm:hidden" : ""} rounded-lg border bg-card p-2 shadow-[0_1px_2px_rgba(10,10,12,.06)] dark:bg-[oklch(0.29_0_0)] ${
                  c.focus ? "border-brand/60 ring-1 ring-brand/30" : "border-black/[0.08] dark:border-white/[0.12]"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Avatar name={c.name} size="md" className="!size-7 ring-0" />
                  <p className="min-w-0 truncate text-xs font-semibold leading-4 text-foreground">{c.name}</p>
                </div>
                <p className="mt-1.5 flex items-center gap-1.5 truncate text-xs leading-4 text-muted-foreground">
                  <StatusDot tone={c.dot} size="sm" />
                  <span className="truncate">{c.note}</span>
                </p>
                <Chip tone={ORIGIN_TONE[c.origin]} className="mt-1.5 !px-2 !py-0">{c.origin}</Chip>
              </div>
            ))}
          </div>
        </div>
      ))}
    </GlassPanel>
  );
}

export function CrmHeroMockup() {
  return (
    <div
      role="img"
      aria-label="Exemplo ilustrativo: a IA organiza o contexto de uma conversa de WhatsApp, o registro é salvo no CRM, o responsável é avisado e a oportunidade aparece no funil"
      className="relative w-full"
    >
      {/* Faixas atrás da composição, recortadas por máscara */}
      <div className="pointer-events-none absolute -inset-x-8 -inset-y-12 lg:-inset-x-14 lg:-inset-y-16 lg:-right-24" aria-hidden="true" style={{ WebkitMaskImage: FADE, maskImage: FADE, WebkitMaskComposite: "source-in", maskComposite: "intersect" }}>
        <HeroBands />
      </div>

      <div aria-hidden="true" inert className="relative mx-auto flex w-full max-w-[560px] flex-col gap-10 lg:max-w-none">
        <div className="grid gap-10 sm:grid-cols-2 sm:gap-12 lg:grid-cols-1 lg:gap-10 xl:grid-cols-2 xl:gap-12">
          <div className="relative">
            <ContextPanel />
            <Step n={1} className="-top-4 right-3">IA organiza</Step>
          </div>

          <div className="relative">
            <CodeBlock
              lines={PAYLOAD}
              tabs={[{ name: "registro-crm.json", active: true }]}
              showLineNumbers={false}
              ariaLabel="Registro de exemplo no CRM"
              className="h-full [&_[role=tab]]:!text-xs [&_pre]:!text-[13px]"
            />
            <Step n={2} className="-top-4 right-3">Registra e avisa</Step>
            {/* Conector entre as etapas 1 e 2: horizontal lado a lado, vertical quando empilhado */}
            <div className="pointer-events-none absolute -left-[50px] top-14 z-30 hidden sm:block lg:hidden xl:block">
              <ConnectorLine width={52} height={14} from={[5, 7]} to={[47, 7]} curve="straight" dashed />
            </div>
            <div className="pointer-events-none absolute -top-[42px] left-1/2 z-30 -ml-[7px] sm:hidden lg:block xl:hidden">
              <ConnectorLine width={14} height={44} from={[7, 5]} to={[7, 39]} curve="straight" dashed />
            </div>
          </div>
        </div>

        <div className="relative">
          <PipelinePanel />
          <Step n={3} className="-top-4 right-3">Acompanha</Step>
          <div className="pointer-events-none absolute -top-[42px] left-1/2 z-30 -ml-[7px] xl:left-3/4">
            <ConnectorLine width={14} height={44} from={[7, 5]} to={[7, 39]} curve="straight" dashed />
          </div>
        </div>

        <IllustrativeTag className="!text-xs !normal-case !tracking-normal !text-muted-foreground">Exemplo ilustrativo</IllustrativeTag>
      </div>
    </div>
  );
}
