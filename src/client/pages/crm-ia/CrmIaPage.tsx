import Link from "next/link";
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
  "inline-flex h-14 items-center justify-center rounded-full bg-brand px-8 text-base font-bold uppercase tracking-wider text-brand-foreground transition-all duration-300 hover:bg-brand/90 hover:shadow-lg hover:shadow-brand/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.98]";

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section aria-labelledby={id} className="px-4 py-14 sm:px-6 md:px-12 md:py-20">
      <div className="mx-auto max-w-5xl">
        <h2 id={id} className="text-2xl font-bold tracking-tight md:text-4xl">
          {title}
        </h2>
        {children}
      </div>
    </section>
  );
}

function List({ items, mark }: { items: string[]; mark: string }) {
  return (
    <ul className="mt-4 space-y-3">
      {items.map((t) => (
        <li key={t} className="flex gap-3 text-muted-foreground">
          <span aria-hidden="true" className="mt-0.5 font-bold text-brand-ink">
            {mark}
          </span>
          <span>{t}</span>
        </li>
      ))}
    </ul>
  );
}

export function CrmIaPage() {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <Header />
      <main>
        <section className="px-4 pb-14 pt-32 sm:px-6 md:px-12 md:pb-20 md:pt-40">
          <div className="mx-auto max-w-4xl">
            <h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl md:text-6xl">
              CRM com IA que organiza cada oportunidade e encaminha para quem vai atender.
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
              Em dois meses, entra em funcionamento um CRM próprio, ligado às suas origens de contato. A IA organiza o
              contexto, os dados ficam registrados e cada oportunidade chega ao responsável certo.
            </p>
            <div className="mt-8">
              <Link href={CTA_HREF} className={ctaClass}>
                {CTA_LABEL}
              </Link>
              <p className="mt-4 max-w-xl text-sm font-medium">{PRICE_LINE}</p>
            </div>
          </div>
        </section>

        <Section id="para-quem" title="Para quem é, e para quem não é">
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-border p-6">
              <h3 className="text-lg font-semibold">É para você se</h3>
              <List items={forWho} mark="+" />
            </div>
            <div className="rounded-2xl border border-border p-6">
              <h3 className="text-lg font-semibold">Provavelmente não é para você se</h3>
              <List items={notForWho} mark="–" />
            </div>
          </div>
        </Section>

        <Section id="fluxo" title="Como o fluxo funciona">
          <p className="mt-4 max-w-2xl text-muted-foreground">
            Do primeiro contato ao acompanhamento, cada etapa fica registrada e com um responsável.
          </p>
          <FlowDiagram />
        </Section>

        <Section id="incluido" title="O que está incluído nos dois meses">
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {months.map((m) => (
              <div key={m.label} className="rounded-2xl border border-border p-6">
                <p className="text-sm font-bold uppercase tracking-wider text-brand-ink">{m.label}</p>
                <h3 className="mt-1 text-xl font-semibold">{m.title}</h3>
                <ul className="mt-5 space-y-5">
                  {m.items.map((it) => (
                    <li key={it.deliverable}>
                      <p className="font-medium">{it.deliverable}</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        <span className="font-semibold text-foreground">Critério de aceite: </span>
                        {it.accept}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-2xl border border-dashed border-border p-6">
            <h3 className="text-lg font-semibold">O que não está incluído</h3>
            <List items={notIncluded} mark="–" />
          </div>
        </Section>

        <Section id="como-construimos" title="Como construímos">
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {howWeBuild.map((h) => (
              <div key={h.title} className="rounded-2xl border border-border p-6">
                <h3 className="text-lg font-semibold">{h.title}</h3>
                <p className="mt-2 text-muted-foreground">{h.text}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section id="demonstracao" title="Demonstração">
          {/* TODO(PO): demo real (vídeo ou ambiente de teste). Não usar imagens ilustrativas como se fossem do produto. */}
          <div className="mt-6 rounded-2xl border border-dashed border-border p-6 md:p-8">
            <p className="max-w-2xl text-muted-foreground">
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

        <Section id="custo" title="Custo total e o que acontece depois">
          <div className="mt-6 rounded-2xl border border-border p-6">
            <p className="text-lg font-semibold">{PRICE_LINE}</p>
            <p className="mt-3 text-muted-foreground">
              Esse valor cobre o desenvolvimento descrito acima. Hospedagem, mensagens e uso de IA são cobrados por quem
              presta cada serviço, conforme o seu volume, e aparecem separados na proposta.
            </p>
          </div>
          <h3 className="mt-8 text-lg font-semibold">Depois dos dois meses, você escolhe</h3>
          <ul className="mt-4 grid gap-4 md:grid-cols-3">
            {[
              ["Operar sozinho", "Com repositório, documentação e handoff, a sua equipe ou outro time assume."],
              ["Manutenção delimitada", "Correções e ajustes dentro de um escopo combinado. Valor definido na proposta."],
              ["Sustentação", "Acompanhamento contínuo da operação. Valor definido na proposta."],
            ].map(([t, d]) => (
              <li key={t} className="rounded-2xl border border-border p-5">
                <p className="font-semibold">{t}</p>
                <p className="mt-2 text-sm text-muted-foreground">{d}</p>
              </li>
            ))}
          </ul>
        </Section>

        <Section id="faq" title="Perguntas frequentes">
          <div className="mt-6 divide-y divide-border rounded-2xl border border-border">
            {faq.map((f) => (
              <details key={f.q} className="group p-5">
                <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  {f.q}
                  <span aria-hidden="true" className="text-brand-ink transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-muted-foreground">{f.a}</p>
              </details>
            ))}
          </div>
        </Section>

        <section aria-labelledby="cta-final" className="px-4 py-16 sm:px-6 md:px-12 md:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <h2 id="cta-final" className="text-2xl font-bold tracking-tight md:text-4xl">
              Quer ver se faz sentido para a sua operação?
            </h2>
            <div className="mt-8">
              <Link href={CTA_HREF} className={ctaClass}>
                {CTA_LABEL}
              </Link>
              <p className="mx-auto mt-4 max-w-xl text-sm font-medium">{PRICE_LINE}</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
