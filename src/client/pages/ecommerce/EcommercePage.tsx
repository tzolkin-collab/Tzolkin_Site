import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Header } from "@/client/shared/ui/Header";
import { Footer } from "@/client/shared/ui/Footer";
import { OrdersTable } from "./OrdersTable";

export const CTA_HREF = "/forms?aplicacao=ecommerce-marketplace&suite=integrada";
export const CTA_LABEL = "Conversar sobre minha loja";
const PRICE_LINE =
  "Suítes de dois meses. O valor é apresentado na proposta, com infraestrutura e serviços externos discriminados.";

const ctaClass =
  "inline-flex h-14 items-center justify-center rounded-full bg-brand px-9 text-center text-base font-semibold text-brand-foreground shadow-[0_10px_24px_-10px_rgba(201,0,0,0.55)] transition-colors hover:bg-brand/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background";

function Cta() {
  return (
    <Link href={CTA_HREF} className={ctaClass}>
      {CTA_LABEL}
      <ArrowRight aria-hidden="true" className="ml-2.5 h-5 w-5" />
    </Link>
  );
}

const DARK = "dark bg-background text-foreground [html.dark_&]:bg-[oklch(0.11_0_0)]";

// ---------- linha do tempo de um pedido ----------
const TIMELINE = [
  { t: "14:02:11", who: "Loja Shopify", what: "Pedido #4821 recebido", detail: "3 itens · R$ 489,90 · frete R$ 24,90" },
  { t: "14:02:13", who: "Pagamento", what: "Pix confirmado", detail: "Conciliado com o pedido; o canal recebe o status." },
  { t: "14:02:14", who: "Estoque", what: "3 itens reservados", detail: "Camiseta Linho Areia M: saldo exposto nos outros canais cai de 24 para 23." },
  { t: "14:03:40", who: "Nota fiscal", what: "Emissão solicitada", detail: "Se a emissão falhar, o pedido fica sinalizado para a equipe tratar." },
  { t: "15:20:05", who: "Expedição", what: "Etiqueta gerada", detail: "Pedido entra na fila de separação." },
  { t: "Dia seguinte", who: "Transportadora", what: "Rastreio enviado ao comprador", detail: "O código volta ao canal de origem do pedido." },
];

// ---------- estoque por canal ----------
const SKUS = [
  { name: "Camiseta Linho Areia · M", split: [10, 8, 4, 2], reserved: 3 },
  { name: "Tênis Urbano Preto · 41", split: [6, 6, 3, 0], reserved: 1 },
  { name: "Mochila Lona 22L", split: [14, 10, 6, 4], reserved: 5 },
];
const CH_SHORT = ["Loja", "ML", "Amazon", "Shopee"];
const CH_TONE = ["bg-foreground", "bg-foreground/65", "bg-foreground/40", "bg-foreground/20"];

const THEME_TREE = [
  ["layout/", "theme.liquid"],
  ["sections/", "product-main · cart-drawer · shipping-estimate"],
  ["snippets/", "price-brl · pix-badge · installments"],
  ["templates/", "product.json · collection.json · cart.json"],
  ["assets/", "tema.css · tema.js"],
];

const CHANNEL_ROWS = ["Loja Shopify", "Mercado Livre", "Amazon", "Shopee"];
const DEST_ROWS = [
  ["Nota fiscal", "emissão a partir do pedido"],
  ["Expedição", "etiqueta e rastreio"],
  ["Financeiro", "valores por canal"],
];

const STEPS = [
  ["Desenhamos o recorte", "Quem usa, qual tarefa precisa concluir e quais sistemas participam. A proposta registra entregas, limites, dependências e critérios de aceite."],
  ["Construímos com validações", "Você acompanha os marcos combinados e avalia o fluxo com pedidos reais ou de teste. Os ajustes seguem o uso e os critérios da etapa."],
  ["Organizamos a continuidade", "Documentação e orientações previstas no escopo. A próxima etapa sai do que foi observado e das prioridades do negócio."],
];

const LIMITS = [
  "As integrações dependem do que a API e as credenciais de cada canal permitem; isso é verificado antes do escopo fechar.",
  "A suíte cobre o recorte combinado, não uma loja e todos os marketplaces ao mesmo tempo. Um marketplace completo exige escopo próprio.",
  "O que dá para alterar no checkout depende do plano da loja e dos recursos da Shopify.",
  "Hospedagem, apps e taxas de cada canal são cobrados por quem presta o serviço e aparecem separados na proposta.",
];

export function EcommercePage() {
  return (
    <div className="min-h-dvh overflow-x-hidden bg-background text-foreground">
      <Header />
      <main>
        {/* 1. Abertura: manchete e a tabela de pedidos como eixo */}
        <section className="px-6 pb-16 pt-32 md:px-12 md:pb-24 md:pt-40">
          <div className="mx-auto max-w-[1200px]">
            <p className="mb-4 text-sm font-semibold tracking-wide text-brand">E-commerce e marketplaces</p>
            <h1 className="max-w-4xl text-[2.25rem] font-semibold leading-[1.06] tracking-tight text-balance md:text-6xl lg:text-[4.25rem]">
              Todo pedido no mesmo lugar,{" "}
              <span className="text-muted-foreground">de qualquer canal em que você vende.</span>
            </h1>
            <div className="mt-8 grid gap-8 md:mt-10 md:grid-cols-[1fr_auto] md:items-end">
              <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
                Loja ou tema Shopify no ar, com catálogo, estoque e pedidos dos marketplaces integrados em um fluxo só.
                Construímos a parte da experiência de compra que precisa entrar em uso primeiro.
              </p>
              <div>
                <Cta />
              </div>
            </div>
          </div>
          <div className="mx-auto mt-14 max-w-[1320px] md:mt-20">
            <OrdersTable />
            <p className="mt-3 text-sm text-muted-foreground">
              Tela de exemplo com dados fictícios. Clique em um pedido para ver o que aconteceu com ele.
            </p>
          </div>
        </section>

        {/* 2. Um pedido de ponta a ponta */}
        <section aria-labelledby="pedido" className={`border-t border-border px-6 py-20 md:px-12 md:py-28 ${DARK}`}>
          <div className="mx-auto grid max-w-[1200px] gap-12 lg:grid-cols-[5fr_7fr] lg:gap-20">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <p className="mb-4 text-sm font-semibold tracking-wide text-brand">Um pedido, de ponta a ponta</p>
              <h2 id="pedido" className="text-3xl font-semibold leading-[1.08] tracking-tight md:text-5xl">
                R$ 489,90 <span className="text-muted-foreground">entram, seis coisas acontecem.</span>
              </h2>
              <p className="mt-6 max-w-md text-lg leading-relaxed text-muted-foreground">
                Ninguém digita o pedido de novo. Pagamento, estoque, nota e envio andam juntos, e cada etapa fica
                registrada com hora e origem.
              </p>
            </div>
            <ol className="relative">
              {TIMELINE.map((e, i) => (
                <li key={e.t} className="relative grid grid-cols-[5.5rem_1fr] gap-x-5 pb-9 last:pb-0 md:grid-cols-[7rem_1fr]">
                  <span aria-hidden="true" className="absolute left-[5.5rem] top-2 hidden h-full w-px bg-border md:left-[7rem] sm:block" />
                  <time className="pt-0.5 font-mono text-xs text-muted-foreground md:text-sm">{e.t}</time>
                  <div className="relative sm:pl-7">
                    <span aria-hidden="true" className={`absolute left-[-4px] top-2 hidden h-2 w-2 rounded-full sm:block ${i === 0 ? "bg-brand" : "bg-foreground/50"}`} />
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{e.who}</p>
                    <p className="mt-1 text-xl font-semibold tracking-tight">{e.what}</p>
                    <p className="mt-1.5 max-w-lg leading-relaxed text-muted-foreground">{e.detail}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* 3. Mapa de canais */}
        <section aria-labelledby="canais" className="px-6 py-20 md:px-12 md:py-28">
          <div className="mx-auto max-w-[1200px]">
            <p className="mb-4 text-sm font-semibold tracking-wide text-brand">Canais</p>
            <h2 id="canais" className="max-w-3xl text-3xl font-semibold leading-[1.08] tracking-tight md:text-5xl">
              Quatro canais entram. <span className="text-muted-foreground">Um registro por pedido sai.</span>
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              Os canais acima são exemplos. Quais entram na suíte é definido na proposta, conforme as integrações
              disponíveis para a sua conta em cada um.
            </p>

            <div className="mt-14 grid gap-4 md:mt-16 md:grid-cols-[1fr_4rem_1.15fr_4rem_1fr] md:gap-0">
              <ul className="flex flex-col gap-3 md:h-[360px] md:justify-between md:gap-0">
                {CHANNEL_ROWS.map((c) => (
                  <li key={c} className="flex h-16 items-center border-b border-border text-lg font-medium md:h-[72px]">
                    {c}
                  </li>
                ))}
              </ul>
              <ul aria-hidden="true" className="hidden md:flex md:h-[360px] md:flex-col md:justify-between">
                {CHANNEL_ROWS.map((c) => (
                  <li key={c} className="flex h-[72px] items-center">
                    <span className="h-px w-full bg-foreground/30" />
                  </li>
                ))}
              </ul>
              <div className="flex flex-col justify-between rounded-2xl bg-foreground p-6 text-background md:min-h-[360px] md:p-8">
                <p className="font-mono text-xs uppercase tracking-wide opacity-60">Pedidos e estoque</p>
                <div>
                  <p className="text-3xl font-semibold leading-tight tracking-tight md:text-4xl">Um pedido, um saldo por SKU.</p>
                  <p className="mt-4 text-sm leading-relaxed opacity-70">
                    Quando um canal vende, o saldo dos outros é atualizado. A regra de quanto cada canal expõe é definida
                    com você.
                  </p>
                </div>
              </div>
              <ul aria-hidden="true" className="hidden md:flex md:h-[360px] md:flex-col md:justify-between">
                {DEST_ROWS.map(([d]) => (
                  <li key={d} className="flex h-[72px] items-center">
                    <span className="h-px w-full bg-foreground/30" />
                  </li>
                ))}
              </ul>
              <ul className="flex flex-col gap-3 md:h-[360px] md:justify-between md:gap-0">
                {DEST_ROWS.map(([d, s]) => (
                  <li key={d} className="flex h-16 flex-col justify-center border-b border-border md:h-[72px]">
                    <p className="text-lg font-medium">{d}</p>
                    <p className="text-sm text-muted-foreground">{s}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* 4. Estoque */}
        <section aria-labelledby="estoque" className="border-t border-border bg-muted/50 px-6 py-20 md:px-12 md:py-28">
          <div className="mx-auto max-w-[1200px]">
            <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
              <div>
                <p className="mb-4 text-sm font-semibold tracking-wide text-brand">Estoque</p>
                <h2 id="estoque" className="text-3xl font-semibold leading-[1.08] tracking-tight md:text-5xl">
                  Sem vender duas vezes <span className="text-muted-foreground">a mesma peça.</span>
                </h2>
                <p className="mt-6 max-w-md text-lg leading-relaxed text-muted-foreground">
                  O saldo de cada SKU é dividido entre os canais, e o que já foi vendido e ainda não saiu fica como
                  reservado. É assim que a tela do operador se parece.
                </p>
              </div>
              <div>
                <ul className="divide-y divide-border border-y border-border">
                  {SKUS.map((s) => {
                    const total = s.split.reduce((a, b) => a + b, 0);
                    return (
                      <li key={s.name} className="py-6">
                        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                          <p className="text-lg font-medium">{s.name}</p>
                          <p className="font-mono text-sm text-muted-foreground tabular-nums">
                            {total} em estoque · {s.reserved} reservados
                          </p>
                        </div>
                        <div role="img" aria-label={s.split.map((n, i) => `${CH_SHORT[i]}: ${n}`).join(", ")} className="mt-4 flex h-3 gap-0.5 overflow-hidden rounded-full">
                          {s.split.map((n, i) =>
                            n > 0 ? <span key={CH_SHORT[i]} className={CH_TONE[i]} style={{ flexGrow: n, flexBasis: 0 }} /> : null,
                          )}
                        </div>
                        <p className="mt-3 flex flex-wrap gap-x-5 gap-y-1 font-mono text-xs text-muted-foreground tabular-nums">
                          {s.split.map((n, i) => (
                            <span key={CH_SHORT[i]} className="inline-flex items-center gap-1.5">
                              <span aria-hidden="true" className={`h-2 w-2 rounded-sm ${CH_TONE[i]}`} />
                              {CH_SHORT[i]} {n}
                            </span>
                          ))}
                        </p>
                      </li>
                    );
                  })}
                </ul>
                <p className="mt-3 text-sm text-muted-foreground">Exemplo ilustrativo com SKUs fictícios.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Checkout e tema Shopify */}
        <section aria-labelledby="loja" className="px-6 py-20 md:px-12 md:py-28">
          <div className="mx-auto max-w-[1200px]">
            <div className="max-w-3xl">
              <p className="mb-4 text-sm font-semibold tracking-wide text-brand">Loja e checkout</p>
              <h2 id="loja" className="text-3xl font-semibold leading-[1.08] tracking-tight md:text-5xl">
                A jornada de compra <span className="text-muted-foreground">desenhada para o seu catálogo.</span>
              </h2>
            </div>

            <div className="mt-14 grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
              {/* Checkout em etapas */}
              <div>
                <ol className="flex items-center gap-3 text-sm font-medium" aria-label="Etapas do checkout de exemplo">
                  {["Carrinho", "Entrega", "Pagamento"].map((s, i) => (
                    <li key={s} className="flex items-center gap-3">
                      {i > 0 && <span aria-hidden="true" className="h-px w-8 bg-border" />}
                      <span className={i === 2 ? "text-foreground" : "text-muted-foreground"}>
                        <span className="font-mono">{i + 1}</span> {s}
                      </span>
                    </li>
                  ))}
                </ol>
                <div className="mt-6 divide-y divide-border rounded-2xl border border-border bg-card">
                  {[
                    ["Pix", "Aprovação na hora, QR Code e copia e cola", true],
                    ["Cartão de crédito", "Parcelamento exibido no produto e no carrinho", false],
                    ["Boleto", "Estoque reservado até o vencimento", false],
                  ].map(([n, d, on]) => (
                    <div key={n as string} className="flex items-start gap-4 px-5 py-4">
                      <span aria-hidden="true" className={`mt-1.5 h-4 w-4 shrink-0 rounded-full border-2 ${on ? "border-brand bg-brand shadow-[inset_0_0_0_3px_var(--card)]" : "border-border"}`} />
                      <div className="flex-1">
                        <p className="font-medium">{n as string}</p>
                        <p className="text-sm text-muted-foreground">{d as string}</p>
                      </div>
                    </div>
                  ))}
                  <div className="flex items-center justify-between px-5 py-4">
                    <span className="text-muted-foreground">Total do pedido</span>
                    <span className="font-mono text-lg font-medium tabular-nums">R$ 489,90</span>
                  </div>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">
                  Exemplo de organização do checkout. Formas de pagamento e regras são definidas no escopo.
                </p>
              </div>

              {/* Tema Shopify */}
              <div className="lg:pt-12">
                <h3 className="text-xl font-semibold tracking-tight">Tema Shopify sob medida</h3>
                <p className="mt-3 leading-relaxed text-muted-foreground">
                  Quando a loja é Shopify, entregamos um tema em código, versionado no repositório do cliente, em vez de
                  ajustes soltos no editor.
                </p>
                <div className="mt-6 overflow-hidden rounded-xl border border-border bg-[oklch(0.15_0_0)] p-5 font-mono text-[13px] leading-7 text-neutral-300">
                  <p className="text-neutral-500">tema/</p>
                  {THEME_TREE.map(([d, f]) => (
                    <p key={d} className="pl-4">
                      <span className="text-neutral-100">{d}</span> <span className="text-neutral-500">{f}</span>
                    </p>
                  ))}
                </div>
                <p className="mt-3 text-sm text-muted-foreground">Estrutura ilustrativa; os arquivos variam por projeto.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 6. Como a suíte acontece e limites */}
        <section aria-labelledby="escopo" className={`border-t border-border px-6 py-20 md:px-12 md:py-28 ${DARK}`}>
          <div className="mx-auto max-w-[1200px]">
            <p className="mb-4 text-sm font-semibold tracking-wide text-brand">Dois meses</p>
            <h2 id="escopo" className="max-w-3xl text-3xl font-semibold leading-[1.08] tracking-tight md:text-5xl">
              Um recorte primeiro. <span className="text-muted-foreground">O resto depois de ver funcionando.</span>
            </h2>
            <ol className="mt-12 divide-y divide-border border-y border-border">
              {STEPS.map(([t, d], i) => (
                <li key={t} className="grid gap-2 py-7 md:grid-cols-[4rem_1fr_1.4fr] md:gap-8 md:py-9">
                  <span className="font-mono text-sm text-muted-foreground">0{i + 1}</span>
                  <h3 className="text-2xl font-semibold tracking-tight">{t}</h3>
                  <p className="leading-relaxed text-muted-foreground">{d}</p>
                </li>
              ))}
            </ol>

            <div className="mt-16 grid gap-8 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
              <h3 className="text-xl font-semibold tracking-tight">O que vale saber antes</h3>
              <ul className="space-y-4">
                {LIMITS.map((l) => (
                  <li key={l} className="flex gap-3 leading-relaxed text-muted-foreground">
                    <span aria-hidden="true" className="mt-2.5 h-px w-4 shrink-0 bg-foreground/50" />
                    {l}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* 7. CTA */}
        <section aria-labelledby="cta-final" className="border-t border-border px-6 py-20 md:px-12 md:py-28">
          <div className="mx-auto max-w-[1200px]">
            <h2 id="cta-final" className="max-w-3xl text-3xl font-semibold leading-[1.08] tracking-tight text-balance md:text-5xl">
              Vende em mais de um canal? <span className="text-muted-foreground">Vamos olhar os seus pedidos.</span>
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
