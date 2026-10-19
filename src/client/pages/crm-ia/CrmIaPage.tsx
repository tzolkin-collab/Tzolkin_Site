import Link from "next/link";
import { Check, Minus } from "lucide-react";
import { Header } from "@/client/shared/ui/Header";
import { Footer } from "@/client/shared/ui/Footer";
import { SectionHeader } from "@/client/shared/ui/SectionHeader";
import { FlowDiagram } from "./FlowDiagram";
import {
  CTA_HREF,
  CTA_LABEL,
  PRICE_LINE,
  faq,
  flowSteps,
  forWho,
  howWeBuild,
  months,
  notForWho,
  notIncluded,
} from "./content";

const ctaClass =
  "inline-flex h-12 items-center justify-center rounded-full bg-brand px-7 text-center text-sm font-semibold text-brand-foreground transition-colors hover:bg-brand/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background";

const card = "rounded-2xl border border-border bg-card p-6 md:p-8";

function Section({
  id,
  eyebrow,
  title,
  muted,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  muted?: string;
  children: React.ReactNode;
}) {
  return (
    <section aria-labelledby={id} className="border-t border-border px-6 py-20 md:px-12 md:py-28">
      <div className="mx-auto max-w-[1200px]">
        <SectionHeader id={id} eyebrow={eyebrow} title={title} muted={muted} />
        <div className="mt-12 md:mt-14">{children}</div>
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
    </Link>
  );
}

// Mockup em CSS do fluxo. Dados genéricos, sem números nem nomes: apenas a forma do funil.
function FlowMockup() {
  const sources = flowSteps[0].text.split(", ").flatMap((p) => p.split(" ou "));
  return (
    <figure className="w-full">
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-[0_12px_32px_-16px_rgba(0,0,0,0.2)]">
        <div className="flex items-center gap-1.5 border-b border-border px-4 py-3" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-border" />
          <span className="h-2.5 w-2.5 rounded-full bg-border" />
          <span className="h-2.5 w-2.5 rounded-full bg-border" />
        </div>
        <div className="space-y-4 p-5 md:p-6" aria-hidden="true">
          <div>
            <p className="text-xs font-medium text-muted-foreground">{flowSteps[0].title}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {sources.map((s) => (
                <span key={s} className="rounded-full border border-border px-3 py-1 text-xs capitalize text-foreground/80">
                  {s}
                </span>
              ))}
            </div>
          </div>
          <div className="mx-auto h-5 w-px bg-border" />
          <div className="rounded-xl border border-brand/60 p-4">
            <p className="text-xs font-semibold text-brand">{flowSteps[1].title}</p>
            <div className="mt-3 space-y-2">
              <div className="h-2 w-11/12 rounded-full bg-foreground/10" />
              <div className="h-2 w-8/12 rounded-full bg-foreground/10" />
              <div className="h-2 w-10/12 rounded-full bg-foreground/10" />
            </div>
          </div>
          <div className="mx-auto h-5 w-px bg-border" />
          <div className="grid grid-cols-3 gap-2">
            {["Novo", "Em atendimento", "Acompanhando"].map((c, i) => (
              <div key={c} className="rounded-xl border border-border p-3">
                <p className="truncate text-[11px] font-medium text-muted-foreground">{c}</p>
                <div className="mt-3 space-y-2">
                  {Array.from({ length: 3 - i }).map((_, k) => (
                    <div key={k} className="h-7 rounded-md bg-foreground/5" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <figcaption className="mt-3 text-xs text-muted-foreground">Exemplo ilustrativo</figcaption>
    </figure>
  );
}

export function CrmIaPage() {
  return (
    <div className="min-h-dvh overflow-x-hidden bg-background text-foreground">
      <Header />
      <main>
        <section className="px-6 pb-20 pt-32 md:px-12 md:pb-28 md:pt-44">
          <div className="mx-auto grid max-w-[1200px] items-center gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
            <div>
              <p className="mb-4 text-sm font-semibold tracking-wide text-brand">Suíte Integrada · CRM com IA</p>
              <h1 className="text-4xl font-semibold leading-[1.08] tracking-tight text-balance md:text-6xl">
                CRM com IA que organiza cada oportunidade{" "}
                <span className="text-muted-foreground">e encaminha para quem vai atender.</span>
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground md:text-xl">
                Em dois meses, entra em funcionamento um CRM próprio, ligado às suas origens de contato. A IA organiza o
                contexto, os dados ficam registrados e cada oportunidade chega ao responsável certo.
              </p>
              <div className="mt-9 flex flex-col items-start">
                <Cta />
                <p className="mt-5 max-w-md text-sm leading-relaxed text-muted-foreground">{PRICE_LINE}</p>
              </div>
            </div>
            <FlowMockup />
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

        <Section id="fluxo" eyebrow="Fluxo" title="Como o fluxo funciona." muted="Do primeiro contato ao acompanhamento, cada etapa fica registrada e com um responsável.">
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

        <Section id="como-construimos" eyebrow="Método" title="Como construímos.">
          <div className="grid gap-6 sm:grid-cols-2">
            {howWeBuild.map((h) => (
              <div key={h.title} className={card}>
                <h3 className="text-lg font-semibold tracking-tight">{h.title}</h3>
                <p className="mt-3 leading-relaxed text-muted-foreground">{h.text}</p>
              </div>
            ))}
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

        <Section id="custo" eyebrow="Proposta" title="Proposta e o que acontece depois.">
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

        <section aria-labelledby="cta-final" className="border-t border-border px-6 py-24 md:px-12 md:py-32">
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
