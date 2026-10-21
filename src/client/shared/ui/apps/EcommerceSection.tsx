'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

type Channel = 'Loja Shopify' | 'Mercado Livre' | 'Amazon' | 'Shopee';
type Tone = 'ok' | 'wait' | 'bad';

interface Order {
  id: string;
  channel: Channel;
  customer: string;
  total: number;
  payment: string;
  status: string;
  tone: Tone;
  events: Array<[string, string]>;
}

// Dados ilustrativos: o objetivo é mostrar como a tela se comporta, não resultados de cliente.
const ORDERS: Order[] = [
  { id: '#4821', channel: 'Loja Shopify', customer: 'Camila R.', total: 489.9, payment: 'Pix', status: 'Separando', tone: 'ok', events: [['14:02', 'Pedido recebido na loja'], ['14:02', 'Pix confirmado'], ['14:02', 'Estoque reservado: 3 itens'], ['14:03', 'Nota fiscal solicitada']] },
  { id: '#4820', channel: 'Mercado Livre', customer: 'Rafael T.', total: 129, payment: 'Cartão 3x', status: 'Pronto p/ envio', tone: 'ok', events: [['13:48', 'Pedido importado do canal'], ['13:48', 'Pagamento aprovado'], ['13:49', 'Estoque reservado'], ['14:10', 'Etiqueta gerada']] },
  { id: '#4819', channel: 'Amazon', customer: 'Juliana M.', total: 246.8, payment: 'Cartão', status: 'Nota emitida', tone: 'ok', events: [['13:20', 'Pedido importado do canal'], ['13:20', 'Pagamento aprovado'], ['13:21', 'Estoque reservado: 2 itens'], ['13:25', 'Nota fiscal emitida']] },
  { id: '#4818', channel: 'Shopee', customer: 'Bruno A.', total: 59.9, payment: 'Cartão', status: 'Em análise', tone: 'wait', events: [['12:55', 'Pedido importado do canal'], ['12:55', 'Pagamento em análise no canal']] },
  { id: '#4817', channel: 'Loja Shopify', customer: 'Patrícia S.', total: 712.4, payment: 'Boleto', status: 'Aguardando', tone: 'wait', events: [['12:31', 'Pedido recebido na loja'], ['12:31', 'Boleto gerado'], ['12:31', 'Estoque reservado até o vencimento']] },
  { id: '#4816', channel: 'Mercado Livre', customer: 'Diego L.', total: 318, payment: 'Cartão', status: 'Enviado', tone: 'ok', events: [['10:12', 'Pedido importado do canal'], ['10:12', 'Pagamento aprovado'], ['10:30', 'Nota fiscal emitida'], ['16:05', 'Rastreio enviado ao canal']] },
  { id: '#4815', channel: 'Loja Shopify', customer: 'Marina F.', total: 199.9, payment: 'Pix', status: 'Entregue', tone: 'ok', events: [['09:40', 'Pedido recebido na loja'], ['09:41', 'Pix confirmado'], ['11:00', 'Enviado'], ['Ontem', 'Entrega confirmada']] },
  { id: '#4814', channel: 'Shopee', customer: 'Lucas P.', total: 142.5, payment: 'Cartão 2x', status: 'Cancelado', tone: 'bad', events: [['11:02', 'Pedido importado do canal'], ['11:40', 'Cancelado pelo comprador'], ['11:40', 'Estoque devolvido ao saldo']] },
];

const TABS: Array<'Todos' | Channel> = ['Todos', 'Loja Shopify', 'Mercado Livre', 'Amazon', 'Shopee'];
const TAG: Record<Channel, string> = { 'Loja Shopify': 'LJ', 'Mercado Livre': 'ML', Amazon: 'AZ', Shopee: 'SH' };
const DOT: Record<Tone, string> = { ok: 'bg-emerald-500', wait: 'bg-amber-500', bad: 'bg-red-500' };

const brl = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const STOCK = [10, 8, 4, 2];
const STOCK_TONE = ['bg-foreground', 'bg-foreground/60', 'bg-foreground/35', 'bg-foreground/15'];

const FACTS: Array<[string, string]> = [
  ['Canais', 'Loja Shopify, Mercado Livre, Amazon e Shopee são exemplos. Os que entram são definidos na proposta.'],
  ['Estoque', 'Um saldo por SKU, dividido entre os canais. Quando um vende, o saldo dos outros é atualizado.'],
  ['Checkout', 'Pix, cartão e boleto no tema da loja, com o que a Shopify permite no seu plano.'],
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
      className="relative overflow-hidden border-t border-border bg-muted/40 py-20 md:py-28 lg:pb-36"
    >
      {/* guias verticais, como no acabamento do Stripe */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-full max-w-[1200px] -translate-x-1/2 grid-cols-4 border-x border-border/70 lg:grid">
        <span className="border-r border-border/70" />
        <span className="border-r border-border/70" />
        <span className="border-r border-border/70" />
        <span />
      </div>

      <div className="relative mx-auto grid max-w-[1200px] gap-14 px-6 md:px-12 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.45fr)] lg:gap-16">
        <div className="lg:py-6">
          <h2 id="ecommerce-title" className="text-3xl font-semibold leading-[1.06] tracking-[-0.03em] md:text-5xl">
            Pedidos de todos os canais, numa tela só.
          </h2>
          <p className="mt-5 text-base leading-relaxed text-muted-foreground md:text-lg">
            Lojas, temas Shopify e marketplaces com jornadas de catálogo, pedido e acompanhamento adaptadas ao seu
            negócio. O primeiro escopo escolhe a parte da experiência que precisa entrar em uso.
          </p>
          <dl className="mt-8 divide-y divide-border border-y border-border">
            {FACTS.map(([k, v]) => (
              <div key={k} className="grid grid-cols-[5.5rem_1fr] gap-4 py-4">
                <dt className="font-mono text-xs uppercase tracking-wide text-foreground">{k}</dt>
                <dd className="text-sm leading-relaxed text-muted-foreground">{v}</dd>
              </div>
            ))}
          </dl>
          <Link
            href="/forms?aplicacao=ecommerce-marketplace"
            className="group mt-8 inline-flex items-center gap-1.5 rounded-sm text-sm font-semibold text-brand hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Conversar sobre minha loja
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
          </Link>
        </div>

        <div className="relative min-w-0 lg:self-center">
          <div className="overflow-hidden rounded-xl border border-border bg-card shadow-[0_40px_80px_-40px_rgba(0,0,0,0.35)]">
            <div className="flex flex-wrap items-center justify-between gap-x-6 border-b border-border px-4 pt-3 md:px-5">
              <div role="tablist" aria-label="Filtrar pedidos por canal" className="-mb-px flex flex-wrap gap-x-4">
                {TABS.map((t) => (
                  <button
                    key={t}
                    type="button"
                    role="tab"
                    aria-selected={tab === t}
                    onClick={() => setTab(t)}
                    className={`min-h-10 border-b-2 text-[13px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand ${
                      tab === t ? 'border-foreground text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <p className="pb-2 font-mono text-[11px] text-muted-foreground">hoje · dados de exemplo</p>
            </div>

            <div className="grid md:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
              <table className="w-full text-left text-[13px]">
                <caption className="sr-only">Pedidos de exemplo. Selecione uma linha para ver o histórico.</caption>
                <thead>
                  <tr className="text-[11px] uppercase tracking-wide text-muted-foreground">
                    <th scope="col" className="px-4 py-2.5 font-medium md:pl-5">Pedido</th>
                    <th scope="col" className="px-2 py-2.5 font-medium">Canal</th>
                    <th scope="col" className="px-2 py-2.5 text-right font-medium">Total</th>
                    <th scope="col" className="hidden px-4 py-2.5 font-medium sm:table-cell">Situação</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((o) => {
                    const active = selected?.id === o.id;
                    return (
                      <tr key={o.id} className={`border-t border-border ${active ? 'bg-muted/70' : 'hover:bg-muted/40'}`}>
                        <td className="relative px-4 py-0 md:pl-5">
                          {active && <span aria-hidden="true" className="absolute inset-y-0 left-0 w-0.5 bg-brand" />}
                          <button
                            type="button"
                            aria-pressed={active}
                            onClick={() => setSelectedId(o.id)}
                            className="flex min-h-11 w-full items-center font-mono font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                          >
                            {o.id}
                          </button>
                        </td>
                        <td className="px-2">
                          <span className="inline-flex items-center gap-2">
                            <span aria-hidden="true" className="inline-flex h-5 w-6 items-center justify-center rounded-[4px] border border-border font-mono text-[9px] text-muted-foreground">
                              {TAG[o.channel]}
                            </span>
                            <span className="hidden whitespace-nowrap xl:inline">{o.channel}</span>
                            <span className="sr-only xl:hidden">{o.channel}</span>
                          </span>
                        </td>
                        <td className="px-2 text-right font-mono tabular-nums">{brl(o.total)}</td>
                        <td className="hidden px-4 sm:table-cell">
                          <span className="inline-flex items-center gap-2 whitespace-nowrap">
                            <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${DOT[o.tone]}`} />
                            {o.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {selected && (
                <div className="border-t border-border bg-muted/30 px-5 py-5 md:border-l md:border-t-0">
                  <p className="font-mono text-[11px] uppercase tracking-wide text-muted-foreground">{selected.channel}</p>
                  <p className="mt-1 text-2xl font-semibold tracking-tight tabular-nums">{brl(selected.total)}</p>
                  <p className="mt-0.5 text-[13px] text-muted-foreground">{selected.customer} · {selected.payment}</p>
                  <ol className="mt-5 space-y-3 border-l border-border pl-4">
                    {selected.events.map(([t, label], i) => (
                      <li key={label} className="relative text-[13px] leading-snug">
                        <span aria-hidden="true" className={`absolute -left-[19px] top-1.5 h-1.5 w-1.5 rounded-full ${i === selected.events.length - 1 ? 'bg-brand' : 'bg-foreground/40'}`} />
                        <time className="mr-2 font-mono text-[11px] text-muted-foreground">{t}</time>
                        <span className={i === selected.events.length - 1 ? 'font-medium' : 'text-muted-foreground'}>{label}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          </div>

          {/* saldo de um SKU, sobreposto ao canto da janela */}
          <div className="mt-4 rounded-lg border border-border bg-card p-4 shadow-[0_24px_48px_-24px_rgba(0,0,0,0.4)] lg:absolute lg:-bottom-20 lg:-left-14 lg:mt-0 lg:w-[290px]">
            <p className="text-[13px] font-medium">Camiseta Linho Areia · M</p>
            <p className="font-mono text-[11px] text-muted-foreground">24 em estoque · 3 reservados</p>
            <div
              role="img"
              aria-label="Saldo por canal: Loja 10, Mercado Livre 8, Amazon 4, Shopee 2"
              className="mt-3 flex h-2 gap-px overflow-hidden rounded-[3px]"
            >
              {STOCK.map((n, i) => (
                <span key={i} className={STOCK_TONE[i]} style={{ flexGrow: n, flexBasis: 0 }} />
              ))}
            </div>
            <p className="mt-2 flex gap-3 font-mono text-[10px] text-muted-foreground">
              <span>LJ 10</span><span>ML 8</span><span>AZ 4</span><span>SH 2</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
