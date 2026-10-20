import Link from "next/link";
import { ArrowRight, Check, Minus } from "lucide-react";
import { Header } from "@/client/shared/ui/Header";
import { Footer } from "@/client/shared/ui/Footer";
import { SectionHeader } from "@/client/shared/ui/SectionHeader";
import { CodeBlock, tok } from "@/client/shared/ui/assets";
import type { CodeLine } from "@/client/shared/ui/assets";
import { CrmHeroMockup } from "./CrmHeroMockup";
import { FlowDiagram } from "./FlowDiagram";
import {
  CTA_HREF,
  CTA_LABEL,
  PRICE_LINE,
  faq,
  forWho,
  howWeBuild,
  months,
  notForWho,
  notIncluded,
} from "./content";

const ctaClass =
  "inline-flex h-14 items-center justify-center rounded-full bg-brand px-9 text-center text-base font-semibold shadow-[0_10px_24px_-10px_rgba(201,0,0,0.55)] text-brand-foreground transition-colors hover:bg-brand/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background";

const card = "rounded-2xl border border-border bg-card p-6 md:p-8";

type Tone = "plain" | "muted" | "dark";

// Ritmo: fundo liso, fundo muted e uma faixa escura (variante .dark por escopo de classe).
const TONE: Record<Tone, string> = {
  plain: "bg-background",
  muted: "bg-muted/50",
  dark: "dark bg-background text-foreground [html.dark_&]:bg-[oklch(0.11_0_0)]",
};

function Section({
  id,
  eyebrow,
  title,
  muted,
  description,
  tone = "plain",
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  muted?: string;
  description?: string;
  tone?: Tone;
  children: React.ReactNode;
}) {
  return (
    <section aria-labelledby={id} className={`border-t border-border px-6 py-20 md:px-12 md:py-24 ${TONE[tone]}`}>
      <div className="mx-auto max-w-[1200px]">
        <SectionHeader id={id} eyebrow={eyebrow} title={title} muted={muted} description={description} />
        <div className="mt-10 md:mt-12">{children}</div>
      </div>
    </section>
  );
}

function List({ items, positive }: { items: string[]; positive?: boolean }) {
  const Mark = positive ? Check : Minus;
  return (
    <ul className="mt-6 space-y-4">
      {items.map((t) => (
        <li key={t} className="flex items-start gap-3 text-sm leading-relaxed text-foreground/80 md:text-base">
          <Mark aria-hidden="true" className={`mt-1 h-4 w-4 shrink-0 ${positive ? "text-brand" : "text-muted-foreground"}`} />
          <span>{t}</span>
        </li>
      ))}
    </ul>
  );
}

function Cta() {
  return (
    <Link href={CTA_HREF} className={ctaClass}>
      {CTA_LABEL}
      <ArrowRight aria-hidden="true" className="ml-2.5 h-5 w-5" />
    </Link>
  );
}

const ROUTING: CodeLine[] = [
  [tok("cm", "// regras de encaminhamento (exemplo)")],
  [tok("kw", "export const "), tok("var", "regras"), tok("punct", " = [")],
  [tok("plain", "  { "), tok("var", "origem"), tok("punct", ": "), tok("str", '"whatsapp"'), tok("punct", ", "), tok("var", "para"), tok("punct", ": "), tok("str", '"Ana Souza"'), tok("plain", " },")],
  [tok("plain", "  { "), tok("var", "origem"), tok("punct", ": "), tok("str", '"formulario"'), tok("punct", ", "), tok("var", "para"), tok("punct", ": "), tok("str", '"Paulo Reis"'), tok("plain", " },")],
  [tok("plain", "  { "), tok("var", "origem"), tok("punct", ": "), tok("str", '"anuncio"'), tok("punct", ", "), tok("var", "para"), tok("punct", ": "), tok("str", '"Time comercial"'), tok("plain", " },")],
  [tok("punct", "];")],
  [],
  [tok("cm", "// acesso por perfil")],
  [tok("kw", "export const "), tok("var", "perfis"), tok("punct", " = {")],
  [tok("plain", "  "), tok("var", "vendedor"), tok("punct", ": "), tok("str", '"somente as próprias oportunidades"'), tok("punct", ",")],
  [tok("plain", "  "), tok("var", "gestor"), tok("punct", ": "), tok("str", '"todas as oportunidades"'), tok("punct", ",")],
  [tok("punct", "};")],
];

export function CrmIaPage() {
  return (
    <div className="min-h-dvh overflow-x-hidden bg-background text-foreground">
      <Header />
      <main>
        <section className="relative overflow-hidden px-6 pb-20 pt-32 md:px-12 md:pb-24 md:pt-40">
          <div className="relative mx-auto grid max-w-[1200px] gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-x-12 lg:gap-y-8">
            <div className="lg:col-span-2">
              <p className="mb-4 text-sm font-semibold tracking-wide text-brand">Suíte Integrada · CRM com IA</p>
              <h1 className="text-[2.25rem] font-semibold leading-[1.08] tracking-tight text-balance md:text-5xl lg:text-[3.3rem]">
                CRM com IA que organiza cada oportunidade{" "}
                <span className="text-muted-foreground">e encaminha a quem atende.</span>
              </h1>
            </div>
            <div className="lg:self-center">
              <p className="max-w-xl text-lg leading-relaxed text-muted-foreground md:text-xl">
                Em dois meses, entra em funcionamento um CRM próprio, ligado às suas origens de contato. A IA organiza o
                contexto, os dados ficam registrados e cada oportunidade chega ao responsável certo.
              </p>
              <div className="mt-9 flex flex-col items-start">
                <Cta />
                <p className="mt-5 max-w-md text-sm leading-relaxed text-muted-foreground">{PRICE_LINE}</p>
              </div>
            </div>
            <CrmHeroMockup />
          </div>
        </section>

        <Section id="para-quem" eyebrow="Para quem" title="Para quem é," muted="e para quem não é.">
          <div className="grid gap-6 md:grid-cols-2">
            <div className={card}>
              <h3 className="text-lg font-semibold tracking-tight">É para você se</h3>
              <List items={forWho} positive />
            </div>
            <div className={card}>
              <h3 className="text-lg font-semibold tracking-tight">Provavelmente não é para você se</h3>
              <List items={notForWho} />
            </div>
          </div>
        </Section>

        <Section id="fluxo" tone="muted" eyebrow="Fluxo" title="Como o fluxo funciona." description="Do primeiro contato ao acompanhamento, cada etapa fica registrada e com um responsável.">
          <FlowDiagram />
        </Section>

        <Section id="incluido" eyebrow="Escopo" title="O que está incluído nos dois meses.">
          <div className="grid gap-6 md:grid-cols-2">
            {months.map((m) => (
              <div key={m.label} className={card}>
                <p className="text-sm font-semibold text-brand">{m.label}</p>
                <h3 className="mt-2 text-xl font-semibold leading-tight tracking-tight">{m.title}</h3>
                <ul className="mt-6 divide-y divide-border">
                  {m.items.map((it) => (
                    <li key={it.deliverable} className="flex items-start gap-3 py-4 first:pt-0 last:pb-0">
                      <Check aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-brand" />
                      <div>
                        <p className="font-medium leading-snug">{it.deliverable}</p>
                        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                          <span className="font-medium text-foreground">Critério de aceite: </span>
                          {it.accept}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-2xl border border-dashed border-border p-6 md:p-8">
            <h3 className="text-lg font-semibold tracking-tight">O que não está incluído</h3>
            <List items={notIncluded} />
          </div>
        </Section>

        <Section id="como-construimos" tone="dark" eyebrow="Método" title="Como construímos.">
          <div className="grid gap-6 lg:grid-cols-5 lg:gap-8">
            <div className="grid content-start gap-6 sm:grid-cols-2 lg:col-span-3">
              {howWeBuild.map((h) => (
                <div key={h.title} className={card}>
                  <h3 className="text-lg font-semibold tracking-tight">{h.title}</h3>
                  <p className="mt-3 leading-relaxed text-muted-foreground">{h.text}</p>
                </div>
              ))}
            </div>
            <figure className="lg:col-span-2">
              <CodeBlock
                lines={ROUTING}
                tabs={[{ name: "regras.ts", active: true }]}
                ariaLabel="Trecho de código de exemplo com regras de encaminhamento e perfis de acesso"
              />
              <figcaption className="mt-3 text-sm text-muted-foreground">
                Exemplo ilustrativo. O código real é entregue no repositório em nome do cliente.
              </figcaption>
            </figure>
          </div>
        </Section>

        <Section id="demonstracao" eyebrow="Demo" title="Demonstração.">
          {/* TODO(PO): demo real (vídeo ou ambiente de teste). Não usar imagens ilustrativas como se fossem do produto. */}
          <div className="rounded-2xl border border-dashed border-border p-6 md:p-10">
            <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">
              Ainda não temos uma demonstração pública. Mostramos o fluxo funcionando em uma conversa, usando o seu
              caso como referência.
            </p>
            <Link
              href={CTA_HREF}
              className="mt-5 inline-flex min-h-11 items-center font-semibold text-brand underline underline-offset-4 hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            >
              Peça uma demonstração do fluxo
            </Link>
          </div>
        </Section>

        <Section id="custo" tone="muted" eyebrow="Proposta" title="Proposta e o que acontece depois.">
          <div className={card}>
            <p className="text-lg font-semibold tracking-tight">{PRICE_LINE}</p>
            <p className="mt-3 max-w-3xl leading-relaxed text-muted-foreground">
              O valor da proposta cobre o desenvolvimento descrito acima. Hospedagem, mensagens e uso de IA são cobrados por quem
              presta cada serviço, conforme o seu volume, e aparecem separados na proposta.
            </p>
          </div>
          <h3 className="mt-14 text-xl font-semibold tracking-tight">Depois dos dois meses, você escolhe</h3>
          <ul className="mt-6 grid gap-6 md:grid-cols-3">
            {[
              ["Operar sozinho", "Com repositório, documentação e handoff, a sua equipe ou outro time assume."],
              ["Manutenção delimitada", "Correções e ajustes dentro de um escopo combinado. Valor definido na proposta."],
              ["Sustentação", "Acompanhamento contínuo da operação. Valor definido na proposta."],
            ].map(([t, d]) => (
              <li key={t} className={card}>
                <p className="font-semibold tracking-tight">{t}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{d}</p>
              </li>
            ))}
          </ul>
        </Section>

        <Section id="faq" eyebrow="Dúvidas" title="Perguntas frequentes.">
          <div className="max-w-3xl divide-y divide-border border-y border-border">
            {faq.map((f) => (
              <details key={f.q} className="group">
                <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-4 font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <span aria-hidden="true" className="text-xl leading-none text-muted-foreground transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="pb-5 leading-relaxed text-muted-foreground">{f.a}</p>
              </details>
            ))}
          </div>
        </Section>

        <section aria-labelledby="cta-final" className="border-t border-border bg-muted/50 px-6 py-20 md:px-12 md:py-24">
          <div className="mx-auto max-w-[1200px]">
            <h2 id="cta-final" className="max-w-3xl text-3xl font-semibold leading-[1.1] tracking-tight text-balance md:text-5xl">
              Quer ver se faz sentido <span className="text-muted-foreground">para a sua operação?</span>
            </h2>
            <div className="mt-9 flex flex-col items-start">
              <Cta />
              <p className="mt-5 max-w-md text-sm leading-relaxed text-muted-foreground">{PRICE_LINE}</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
