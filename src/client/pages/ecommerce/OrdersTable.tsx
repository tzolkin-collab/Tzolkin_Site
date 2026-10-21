"use client";

import { Fragment, useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";

type Channel = "Loja Shopify" | "Mercado Livre" | "Amazon" | "Shopee";
type Tone = "ok" | "wait" | "bad" | "done";

interface Order {
  id: string;
  channel: Channel;
  customer: string;
  items: number;
  total: number;
  payment: string;
  status: string;
  tone: Tone;
  events: string[];
}

// Dados ilustrativos: nomes, pedidos e valores são exemplos de como a tela se comporta.
const ORDERS: Order[] = [
  { id: "#4821", channel: "Loja Shopify", customer: "Camila R.", items: 3, total: 489.9, payment: "Pix", status: "Separando", tone: "ok", events: ["Pedido recebido", "Pix confirmado", "Estoque reservado (3 itens)", "Nota fiscal solicitada"] },
  { id: "#4820", channel: "Mercado Livre", customer: "Rafael T.", items: 1, total: 129, payment: "Cartão 3x", status: "Pronto para envio", tone: "ok", events: ["Pedido importado do canal", "Pagamento aprovado", "Estoque reservado", "Etiqueta gerada"] },
  { id: "#4819", channel: "Amazon", customer: "Juliana M.", items: 2, total: 246.8, payment: "Cartão", status: "Nota emitida", tone: "ok", events: ["Pedido importado do canal", "Pagamento aprovado", "Estoque reservado (2 itens)", "Nota fiscal emitida"] },
  { id: "#4818", channel: "Shopee", customer: "Bruno A.", items: 1, total: 59.9, payment: "Cartão", status: "Em análise", tone: "wait", events: ["Pedido importado do canal", "Pagamento em análise no canal"] },
  { id: "#4817", channel: "Loja Shopify", customer: "Patrícia S.", items: 4, total: 712.4, payment: "Boleto", status: "Aguardando pagamento", tone: "wait", events: ["Pedido recebido", "Boleto gerado", "Estoque reservado até o vencimento"] },
  { id: "#4816", channel: "Mercado Livre", customer: "Diego L.", items: 2, total: 318, payment: "Cartão", status: "Enviado", tone: "ok", events: ["Pedido importado do canal", "Pagamento aprovado", "Nota fiscal emitida", "Código de rastreio enviado ao canal"] },
  { id: "#4815", channel: "Loja Shopify", customer: "Marina F.", items: 1, total: 199.9, payment: "Pix", status: "Entregue", tone: "done", events: ["Pedido recebido", "Pix confirmado", "Enviado", "Entrega confirmada"] },
  { id: "#4814", channel: "Shopee", customer: "Lucas P.", items: 3, total: 142.5, payment: "Cartão 2x", status: "Cancelado", tone: "bad", events: ["Pedido importado do canal", "Cancelamento pelo comprador", "Estoque devolvido ao saldo"] },
];

const CHANNELS: Array<"Todos" | Channel> = ["Todos", "Loja Shopify", "Mercado Livre", "Amazon", "Shopee"];

const DOT: Record<Tone, string> = {
  ok: "bg-emerald-500",
  wait: "bg-amber-500",
  bad: "bg-red-500",
  done: "bg-muted-foreground",
};

const brl = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export function OrdersTable() {
  const [channel, setChannel] = useState<(typeof CHANNELS)[number]>("Todos");
  const [open, setOpen] = useState<string | null>("#4821");

  const rows = useMemo(() => ORDERS.filter((o) => channel === "Todos" || o.channel === channel), [channel]);
  const sum = rows.filter((o) => o.tone !== "bad").reduce((a, o) => a + o.total, 0);

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-[0_30px_60px_-30px_rgba(0,0,0,0.25)]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3 md:px-6">
        <div role="group" aria-label="Filtrar por canal" className="flex flex-wrap gap-1.5">
          {CHANNELS.map((c) => (
            <button
              key={c}
              type="button"
              aria-pressed={channel === c}
              onClick={() => setChannel(c)}
              className={`min-h-9 rounded-full px-3.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand ${
                channel === c ? "bg-foreground text-background" : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
        <p className="font-mono text-xs text-muted-foreground">{rows.length} pedidos</p>
      </div>

      <table className="w-full text-left text-sm">
        <caption className="sr-only">Pedidos de exemplo de todos os canais de venda</caption>
        <thead>
          <tr className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
            <th scope="col" className="px-4 py-3 font-medium md:px-6">Pedido</th>
            <th scope="col" className="px-2 py-3 font-medium">Canal</th>
            <th scope="col" className="hidden px-2 py-3 font-medium md:table-cell">Cliente</th>
            <th scope="col" className="hidden px-2 py-3 font-medium lg:table-cell">Pagamento</th>
            <th scope="col" className="px-2 py-3 text-right font-medium">Total</th>
            <th scope="col" className="hidden px-4 py-3 font-medium sm:table-cell md:px-6">Situação</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {rows.map((o) => {
            const isOpen = open === o.id;
            return (
              <Fragment key={o.id}>
                <tr className={isOpen ? "bg-muted/50" : "hover:bg-muted/30"}>
                  <td className="px-4 py-3 md:px-6">
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={`ev-${o.id.slice(1)}`}
                      onClick={() => setOpen(isOpen ? null : o.id)}
                      className="flex min-h-9 items-center gap-2 font-mono font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                    >
                      <ChevronDown aria-hidden="true" className={`h-4 w-4 text-muted-foreground transition-transform ${isOpen ? "" : "-rotate-90"}`} />
                      {o.id}
                    </button>
                  </td>
                  <td className="px-2 py-3">{o.channel}</td>
                  <td className="hidden px-2 py-3 text-muted-foreground md:table-cell">{o.customer} · {o.items} {o.items === 1 ? "item" : "itens"}</td>
                  <td className="hidden px-2 py-3 text-muted-foreground lg:table-cell">{o.payment}</td>
                  <td className="px-2 py-3 text-right font-mono tabular-nums">{brl(o.total)}</td>
                  <td className="hidden px-4 py-3 sm:table-cell md:px-6">
                    <span className="inline-flex items-center gap-2">
                      <span aria-hidden="true" className={`h-2 w-2 rounded-full ${DOT[o.tone]}`} />
                      {o.status}
                    </span>
                  </td>
                </tr>
                {isOpen && (
                  <tr id={`ev-${o.id.slice(1)}`} className="bg-muted/50">
                    <td colSpan={6} className="px-4 pb-4 pl-10 md:px-6 md:pl-12">
                      <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground sm:hidden">{o.status}</p>
                      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
                        {o.events.map((e, i) => (
                          <li key={e} className="flex items-center gap-2">
                            {i > 0 && <span aria-hidden="true">→</span>}
                            <span className={i === o.events.length - 1 ? "font-medium text-foreground" : ""}>{e}</span>
                          </li>
                        ))}
                      </ol>
                    </td>
                  </tr>
                )}
              </Fragment>
            );
          })}
        </tbody>
        <tfoot>
          <tr className="border-t border-border bg-muted/30">
            <td colSpan={4} className="px-4 py-3 text-xs text-muted-foreground md:px-6">
              Soma dos pedidos não cancelados do filtro · dados de exemplo
            </td>
            <td colSpan={2} className="px-4 py-3 text-right font-mono font-medium tabular-nums md:px-6">{brl(sum)}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
