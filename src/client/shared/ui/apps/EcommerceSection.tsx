'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';

type Channel = 'Loja Shopify' | 'Mercado Livre' | 'Amazon' | 'Shopee';
type Tone = 'go' | 'wait' | 'plain';

interface Order {
  id: string;
  channel: Channel;
  customer: string;
  product: string;
  more?: string;
  photo: string;
  total: number;
  payment: string;
  status: string;
  tone: Tone;
  /** Quantas etapas já aconteceram (de 5). */
  done: number;
}

// Dados ilustrativos: mostram como a tela se comporta, não resultados de cliente.
const ORDERS: Order[] = [
  { id: '#4821', channel: 'Loja Shopify', customer: 'Camila R.', product: 'Camiseta Básica Branca', more: '+2 itens', photo: 'camiseta', total: 489.9, payment: 'Pix', status: 'Separando', tone: 'plain', done: 4 },
  { id: '#4820', channel: 'Mercado Livre', customer: 'Rafael T.', product: 'Tênis Urbano Laranja', photo: 'tenis', total: 129, payment: 'Cartão 3x', status: 'Pronto para envio', tone: 'go', done: 5 },
  { id: '#4819', channel: 'Amazon', customer: 'Juliana M.', product: 'Mochila Urbana Preta', more: '+1 item', photo: 'mochila', total: 246.8, payment: 'Cartão', status: 'Nota emitida', tone: 'go', done: 4 },
  { id: '#4818', channel: 'Shopee', customer: 'Bruno A.', product: 'Óculos Acetato Preto', photo: 'oculos', total: 59.9, payment: 'Cartão', status: 'Em análise', tone: 'wait', done: 1 },
  { id: '#4817', channel: 'Loja Shopify', customer: 'Patrícia S.', product: 'Jaqueta Jeans', more: '+3 itens', photo: 'jaqueta', total: 712.4, payment: 'Boleto', status: 'Aguardando boleto', tone: 'wait', done: 2 },
];

// Logos: Shopify e Mercado Livre do svgl.app; Amazon e Shopee do Simple Icons (CC0). Marcas dos respectivos donos, usadas só para indicar o canal.
const LOGO: Record<Channel, { src: string; mono?: boolean }> = {
  'Loja Shopify': { src: '/ecommerce/logos/shopify.svg' },
  'Mercado Livre': { src: '/ecommerce/logos/mercado-libre.svg' },
  Amazon: { src: '/ecommerce/logos/amazon.svg', mono: true },
  Shopee: { src: '/ecommerce/logos/shopee.svg', mono: true },
};

function ChannelMark({ channel, size = 16 }: { channel: Channel; size?: number }) {
  const l = LOGO[channel];
  return (
    <Image src={l.src} alt="" width={size} height={size} unoptimized className={`inline-block shrink-0 object-contain ${l.mono ? 'dark:invert' : ''}`} style={{ width: size, height: size }} />
  );
}

const STEPS = ['Pedido recebido', 'Pagamento confirmado', 'Estoque reservado', 'Nota fiscal solicitada', 'Etiqueta gerada'];
const TABS: Array<'Todos' | Channel> = ['Todos', 'Loja Shopify', 'Mercado Livre', 'Amazon', 'Shopee'];

const CHIP: Record<Tone, string> = {
  go: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300',
  wait: 'bg-amber-500/15 text-amber-700 dark:text-amber-300',
  plain: 'bg-foreground/[0.07] text-foreground/80',
};

const brl = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const FACTS: Array<[string, string]> = [
  ['Canais', 'Loja própria, Mercado Livre, Amazon, Shopee. Os que entram são definidos na proposta.'],
  ['Estoque', 'Um saldo por SKU. Quando um canal vende, o saldo dos outros acompanha.'],
  ['Checkout', 'Pix, cartão e boleto no tema da loja, dentro do que o plano da Shopify permite.'],
];

export function EcommerceSection() {
  const [tab, setTab] = useState<(typeof TABS)[number]>('Todos');
  const rows = ORDERS.filter((o) => tab === 'Todos' || o.channel === tab);
  const [selectedId, setSelectedId] = useState('#4821');
  const selected = rows.find((o) => o.id === selectedId) ?? rows[0];

  return (
    <section
      id="ecommerce-marketplace"
      aria-labelledby="ecommerce-title"
      className="relative overflow-hidden border-t border-border bg-muted/40 py-20 md:py-28"
    >
      <div className="mx-auto max-w-[1200px] px-6 md:px-12">
        <div className="grid gap-14 xl:grid-cols-12 xl:gap-0 xl:border-x xl:border-dashed xl:border-border">
          <div className="xl:col-span-5 xl:pb-16 xl:pl-8 xl:pr-12 xl:pt-6">
            <h2 id="ecommerce-title" className="text-4xl font-semibold leading-[1.03] tracking-[-0.035em] md:text-6xl">
              Cada pedido, de qualquer canal, na mesma fila.
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-foreground/70">
              Lojas, temas Shopify e marketplaces com catálogo, pedido e acompanhamento desenhados para o seu negócio.
              O primeiro escopo escolhe a parte da experiência que entra em uso primeiro.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Link
                href="/forms?aplicacao=ecommerce-marketplace"
                className="group inline-flex h-12 items-center gap-2 rounded-full bg-brand px-6 text-sm font-semibold text-brand-foreground transition-colors hover:bg-brand/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                Conversar sobre minha loja
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </Link>
            </div>
            <dl className="mt-12 space-y-5">
              {FACTS.map(([k, v]) => (
                <div key={k} className="grid grid-cols-[5.5rem_1fr] gap-4 border-t border-border pt-4">
                  <dt className="text-sm font-semibold">{k}</dt>
                  <dd className="text-sm leading-relaxed text-foreground/70">{v}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative min-w-0 xl:col-span-7 xl:border-l xl:border-dashed xl:border-border xl:self-center xl:py-6 xl:pl-10 xl:pr-0">
            <div className="relative">
            {/* cunha de cor atrás da folha: uma única família de cor, ancorada na diagonal */}
            <div
              aria-hidden="true"
              className="absolute -bottom-24 -right-[25vw] left-[24%] z-0 hidden h-[300px] bg-[linear-gradient(100deg,transparent_0%,rgba(226,59,59,0.55)_55%,#c90000_100%)] [clip-path:polygon(0_100%,100%_18%,100%_100%)] xl:block"
            />

            <div className="relative z-10 overflow-hidden rounded-lg border border-border bg-card shadow-[0_30px_80px_-30px_rgba(10,20,40,0.35)] xl:-mr-24">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4">
                <p className="text-[15px] font-semibold">Atelier Areia <span className="font-normal text-foreground/50">· pedidos de hoje</span></p>
                <div role="tablist" aria-label="Filtrar por canal" className="flex flex-wrap gap-1">
                  {TABS.map((t) => (
                    <button
                      key={t}
                      type="button"
                      role="tab"
                      aria-selected={tab === t}
                      onClick={() => setTab(t)}
                      className={`inline-flex min-h-9 items-center gap-1.5 rounded-md px-2.5 text-[13px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand ${
                        tab === t ? 'bg-foreground/[0.08] text-foreground' : 'text-foreground/55 hover:text-foreground'
                      }`}
                    >
                      {t !== 'Todos' && <ChannelMark channel={t} size={14} />}
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-[minmax(0,1fr)] md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
                <ul aria-label="Pedidos" className="divide-y divide-border">
                  {rows.map((o) => {
                    const active = selected?.id === o.id;
                    return (
                      <li key={o.id}>
                        <button
                          type="button"
                          aria-pressed={active}
                          onClick={() => setSelectedId(o.id)}
                          className={`relative flex min-h-[72px] w-full items-center gap-4 px-5 py-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand ${
                            active ? 'bg-brand/[0.06]' : 'hover:bg-foreground/[0.03]'
                          }`}
                        >
                          {active && <span aria-hidden="true" className="absolute inset-y-0 left-0 w-[3px] bg-brand" />}
                          <Image src={`/ecommerce/${o.photo}.jpg`} alt={o.product} width={44} height={44} unoptimized className="h-11 w-11 shrink-0 rounded-md object-cover" />
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-[15px] font-medium">
                              {o.product} {o.more && <span className="font-normal text-foreground/50">{o.more}</span>}
                            </span>
                            <span className="flex min-w-0 items-center gap-1.5 text-sm text-foreground/60">
                              <span className="shrink-0">{o.customer} ·</span>
                              <ChannelMark channel={o.channel} size={13} />
                              <span className="truncate">{o.channel}</span>
                            </span>
                          </span>
                          <span className="shrink-0 text-right">
                            <span className="block text-[15px] font-semibold tabular-nums">{brl(o.total)}</span>
                            <span className={`mt-1 inline-block rounded px-1.5 py-0.5 text-xs font-medium ${CHIP[o.tone]}`}>{o.status}</span>
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>

                {selected && (
                  <div className="border-t border-border bg-foreground/[0.02] p-5 md:border-l md:border-t-0">
                    <p className="text-sm font-semibold">Pedido {selected.id}</p>
                    <p className="mt-3 text-4xl font-semibold tracking-[-0.03em] tabular-nums">{brl(selected.total)}</p>
                    <p className="mt-1 text-sm text-foreground/60">
                      {selected.customer} · {selected.payment} · {selected.channel}
                    </p>

                    <ol className="mt-6 space-y-3">
                      {STEPS.map((s, i) => {
                        const done = i < selected.done;
                        const current = i === selected.done;
                        return (
                          <li key={s} className="flex items-center gap-3 text-sm">
                            <span
                              aria-hidden="true"
                              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                                done ? 'bg-brand text-brand-foreground' : current ? 'border-2 border-brand' : 'border border-border'
                              }`}
                            >
                              {done && <Check size={12} strokeWidth={3} />}
                            </span>
                            <span className={done ? 'text-foreground' : current ? 'font-medium text-foreground' : 'text-foreground/45'}>
                              {s}
                              <span className="sr-only">{done ? ' (concluído)' : current ? ' (próxima etapa)' : ' (pendente)'}</span>
                            </span>
                          </li>
                        );
                      })}
                    </ol>

                    <div className="mt-6 border-t border-border pt-4">
                      <div className="flex items-baseline justify-between text-sm">
                        <span className="whitespace-nowrap font-medium">Camiseta Básica · M</span>
                        <span className="whitespace-nowrap tabular-nums text-foreground/60">24 em estoque</span>
                      </div>
                      <div
                        role="img"
                        aria-label="Saldo por canal: Loja 10, Mercado Livre 8, Amazon 4, Shopee 2"
                        className="mt-2 flex h-2 gap-0.5 overflow-hidden rounded-sm"
                      >
                        {[10, 8, 4, 2].map((n, i) => (
                          <span key={i} className={['bg-brand', 'bg-foreground/55', 'bg-foreground/30', 'bg-foreground/15'][i]} style={{ flexGrow: n, flexBasis: 0 }} />
                        ))}
                      </div>
                      <p className="mt-2 flex gap-4 text-xs tabular-nums text-foreground/60">
                        <span>Loja 10</span><span>ML 8</span><span>Amazon 4</span><span>Shopee 2</span>
                      </p>
                    </div>
                  </div>
                )}
              </div>
              <p className="border-t border-border px-5 py-3 text-sm text-foreground/55">Tela de exemplo, com loja, clientes e valores fictícios.</p>
            </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
