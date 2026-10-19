import Link from "next/link";
import { Check, Minus, Sparkles, type LucideIcon } from "lucide-react";
import { Header } from "@/client/shared/ui/Header";
import { Footer } from "@/client/shared/ui/Footer";
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

// Mesmo visual do Button (variant brand/lg), aplicado a um link para não aninhar <button> em <a>.
const ctaClass =
  "inline-flex h-14 items-center justify-center rounded-full bg-brand px-8 text-center text-base font-bold uppercase tracking-wider text-brand-foreground shadow-xl transition-all duration-300 hover:bg-brand/90 hover:shadow-brand/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.98]";

// Sombra marcante dos cartões, igual à home.
const cardClass =
  "rounded-3xl border border-border/40 bg-card shadow-[0_2px_6px_rgba(0,0,0,0.03),0_12px_28px_-12px_rgba(0,0,0,0.16)]";

// Cartão em destaque: borda vermelha e fundo rosado.
const highlightClass = "rounded-3xl border border-brand/50 bg-brand/5 shadow-lg shadow-brand/10";

// Glow radial estático (apenas gradiente CSS).
const glowTop =
  "bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,color-mix(in_srgb,var(--brand)_14%,transparent),transparent)]";

function Pill({ icon: Icon, children }: { icon: LucideIcon; children: React.ReactNode }) {
  return (
    <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-foreground/70 px-3 py-1 text-sm font-medium uppercase tracking-wider text-white">
      <Icon size={14} aria-hidden="true" />
      <span>{children}</span>
    </div>
  );
}

function Tile({ icon: Icon, active }: { icon: LucideIcon; active?: boolean }) {
  return (
    <div
      className={`inline-flex shrink-0 rounded-2xl p-3 ${
        active
          ? "bg-gradient-to-br from-brand to-brand/70 text-brand-foreground shadow-lg shadow-brand/30"
          : "bg-foreground/5 text-muted-foreground"
      }`}
    >
      <Icon className="h-6 w-6" aria-hidden="true" />
    </div>
  );
}

function Section({
  id,
  eyebrow,
  title,
  glow,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  glow?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section aria-labelledby={id} className="relative overflow-hidden border-t border-border/50 px-4 py-16 sm:px-6 md:px-12 md:py-24">
      {glow && <div aria-hidden="true" className={`pointer-events-none absolute inset-0 ${glowTop}`} />}
      <div className="relative z-10 mx-auto max-w-5xl">
        <div className="mx-auto mb-10 max-w-3xl text-center md:mb-14">
          <Pill icon={Sparkles}>{eyebrow}</Pill>
          <h2 id={id} className="text-3xl font-bold leading-tight tracking-tight text-balance md:text-5xl">
            {title}
          </h2>
        </div>
        {children}
      </div>
    </section>
  );
}

function List({ items, positive }: { items: string[]; positive?: boolean }) {
  const Mark = positive ? Check : Minus;
  return (
    <ul className="mt-5 space-y-3">
      {items.map((t) => (
        <li key={t} className="flex items-start gap-3 text-sm leading-relaxed text-foreground/80 md:text-base">
          <Mark aria-hidden="true" className={`mt-1 h-5 w-5 shrink-0 ${positive ? "text-brand" : "text-muted-foreground"}`} />
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

export function CrmIaPage() {
  return (
    <div className="min-h-dvh overflow-x-hidden bg-background text-foreground">
      <Header />
      <main>
        <section className="relative overflow-hidden px-4 pb-16 pt-32 sm:px-6 md:px-12 md:pb-24 md:pt-44">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_0%,color-mix(in_srgb,var(--brand)_18%,transparent),transparent),radial-gradient(ellipse_45%_35%_at_100%_100%,color-mix(in_srgb,var(--brand)_8%,transparent),transparent)]"
          />
          <div className="relative z-10 mx-auto max-w-4xl text-center">
            <Pill icon={Sparkles}>Suíte Integrada · CRM com IA</Pill>
            <h1 className="text-3xl font-black uppercase leading-[1.05] tracking-tighter text-balance sm:text-4xl md:text-6xl">
              CRM com IA que organiza cada oportunidade{" "}
              <span className="text-brand">e encaminha para quem vai atender.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
              Em dois meses, entra em funcionamento um CRM próprio, ligado às suas origens de contato. A IA organiza o
              contexto, os dados ficam registrados e cada oportunidade chega ao responsável certo.
            </p>
            <div className="mt-10 flex flex-col items-center">
              <Cta />
              <p className="mt-5 max-w-xl text-sm font-medium">{PRICE_LINE}</p>
            </div>
          </div>
        </section>

        <Section id="para-quem" eyebrow="Para quem" title="Para quem é, e para quem não é">
          <div className="grid gap-8 md:grid-cols-2">
            <div className={`${highlightClass} p-6 md:p-8`}>
              <Tile icon={Check} active />
              <h3 className="mt-5 text-xl font-bold">É para você se</h3>
              <List items={forWho} positive />
            </div>
            <div className={`${cardClass} p-6 md:p-8`}>
              <Tile icon={Minus} />
              <h3 className="mt-5 text-xl font-bold">Provavelmente não é para você se</h3>
              <List items={notForWho} />
            </div>
          </div>
        </Section>

        <Section id="fluxo" eyebrow="Fluxo" title="Como o fluxo funciona" glow>
          <p className="mx-auto max-w-2xl text-center text-lg text-muted-foreground">
            Do primeiro contato ao acompanhamento, cada etapa fica registrada e com um responsável.
          </p>
          <FlowDiagram />
        </Section>

        <Section id="incluido" eyebrow="Escopo" title="O que está incluído nos dois meses">
          <div className="grid gap-8 md:grid-cols-2">
            {months.map((m, i) => (
              <div key={m.label} className={`${i === 1 ? highlightClass : cardClass} p-6 md:p-8`}>
                <span className="inline-block rounded-full bg-brand px-4 py-1 text-xs font-bold uppercase tracking-widest text-brand-foreground">
                  {m.label}
                </span>
                <h3 className="mt-4 text-2xl font-bold leading-tight">{m.title}</h3>
                <ul className="mt-6 space-y-5">
                  {m.items.map((it) => (
                    <li key={it.deliverable} className="flex items-start gap-3">
                      <Check aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-brand" />
                      <div>
                        <p className="font-semibold leading-snug">{it.deliverable}</p>
                        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                          <span className="font-semibold text-foreground">Critério de aceite: </span>
                          {it.accept}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-8 rounded-3xl border border-dashed border-border p-6 md:p-8">
            <h3 className="text-xl font-bold">O que não está incluído</h3>
            <List items={notIncluded} />
          </div>
        </Section>

        <Section id="como-construimos" eyebrow="Método" title="Como construímos" glow>
          <div className="grid gap-6 sm:grid-cols-2">
            {howWeBuild.map((h) => (
              <div key={h.title} className={`${cardClass} p-6 md:p-8`}>
                <h3 className="text-xl font-bold">{h.title}</h3>
                <p className="mt-3 leading-relaxed text-muted-foreground">{h.text}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section id="demonstracao" eyebrow="Demo" title="Demonstração">
          {/* TODO(PO): demo real (vídeo ou ambiente de teste). Não usar imagens ilustrativas como se fossem do produto. */}
          <div className="mx-auto max-w-3xl rounded-3xl border border-dashed border-border p-6 text-center md:p-10">
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Ainda não temos uma demonstração pública. Mostramos o fluxo funcionando em uma conversa, usando o seu
              caso como referência.
            </p>
            <Link
              href={CTA_HREF}
              className="mt-5 inline-flex min-h-11 items-center font-semibold text-brand-ink underline underline-offset-4 hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Peça uma demonstração do fluxo
            </Link>
          </div>
        </Section>

        <Section id="custo" eyebrow="Proposta" title="Proposta e o que acontece depois" glow>
          <div className={`${cardClass} mx-auto max-w-3xl p-6 text-center md:p-8`}>
            <p className="text-lg font-bold">{PRICE_LINE}</p>
            <p className="mt-3 text-muted-foreground">
              O valor da proposta cobre o desenvolvimento descrito acima. Hospedagem, mensagens e uso de IA são cobrados por quem
              presta cada serviço, conforme o seu volume, e aparecem separados na proposta.
            </p>
          </div>
          <h3 className="mt-12 text-center text-xl font-bold">Depois dos dois meses, você escolhe</h3>
          <ul className="mt-6 grid gap-6 md:grid-cols-3">
            {[
              ["Operar sozinho", "Com repositório, documentação e handoff, a sua equipe ou outro time assume."],
              ["Manutenção delimitada", "Correções e ajustes dentro de um escopo combinado. Valor definido na proposta."],
              ["Sustentação", "Acompanhamento contínuo da operação. Valor definido na proposta."],
            ].map(([t, d]) => (
              <li key={t} className={`${cardClass} p-6`}>
                <p className="text-lg font-bold">{t}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{d}</p>
              </li>
            ))}
          </ul>
        </Section>

        <Section id="faq" eyebrow="Dúvidas" title="Perguntas frequentes">
          <div className={`${cardClass} mx-auto max-w-3xl divide-y divide-border`}>
            {faq.map((f) => (
              <details key={f.q} className="group p-5">
                <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  {f.q}
                  <span aria-hidden="true" className="text-xl text-brand-ink transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-muted-foreground">{f.a}</p>
              </details>
            ))}
          </div>
        </Section>

        <section aria-labelledby="cta-final" className="relative overflow-hidden border-t border-border/50 px-4 py-20 sm:px-6 md:px-12 md:py-28">
          <div aria-hidden="true" className={`pointer-events-none absolute inset-0 ${glowTop}`} />
          <div className="relative z-10 mx-auto max-w-3xl text-center">
            <h2 id="cta-final" className="text-3xl font-black uppercase leading-tight tracking-tighter text-balance md:text-5xl">
              Quer ver se faz sentido <span className="text-brand">para a sua operação?</span>
            </h2>
            <div className="mt-10 flex flex-col items-center">
              <Cta />
              <p className="mx-auto mt-5 max-w-xl text-sm font-medium">{PRICE_LINE}</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
