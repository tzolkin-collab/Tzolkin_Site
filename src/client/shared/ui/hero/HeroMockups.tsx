const COLUMNS = [
  {
    title: 'Novos',
    count: 3,
    cards: [
      { name: 'Clínica Aurora', value: 'Orçamento', tag: 'WhatsApp' },
      { name: 'Loja Vitta', value: 'Demo agendada', tag: 'Site' },
    ],
  },
  {
    title: 'Em conversa',
    count: 2,
    cards: [{ name: 'Grupo Nobre', value: 'Proposta enviada', tag: 'Indicação' }],
  },
  {
    title: 'Fechados',
    count: 1,
    cards: [{ name: 'Studio Lume', value: 'Contrato assinado', tag: 'Agente de IA' }],
  },
];

function Dot({ className = '' }: { className?: string }) {
  return <span className={`inline-block size-2 rounded-full ${className}`} />;
}

/** Composição ilustrativa de interface: funil de CRM + conversa de agente de IA. */
export function HeroMockups() {
  return (
    <div className="relative w-full" role="img" aria-label="Exemplo ilustrativo de um funil de CRM e de uma conversa com agente de IA">
      {/* Cartão 1: funil */}
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-[0_24px_60px_-28px_rgba(0,0,0,0.25)]">
        <div className="flex items-center gap-2 border-b border-border px-4 py-3">
          <Dot className="bg-border" />
          <Dot className="bg-border" />
          <Dot className="bg-border" />
          <span className="ml-3 text-xs font-medium text-muted-foreground">CRM · Funil de vendas</span>
        </div>
        <div className="grid grid-cols-3 gap-3 bg-muted/50 p-3 sm:p-4">
          {COLUMNS.map((col) => (
            <div key={col.title} className="min-w-0">
              <div className="mb-2 flex items-center justify-between px-1 text-[11px] font-medium text-muted-foreground">
                <span className="truncate">{col.title}</span>
                <span>{col.count}</span>
              </div>
              <div className="space-y-2">
                {col.cards.map((c) => (
                  <div key={c.name} className="rounded-lg border border-border bg-card p-2.5 shadow-sm">
                    <p className="truncate text-xs font-semibold text-foreground">{c.name}</p>
                    <p className="mt-0.5 truncate text-[11px] text-muted-foreground">{c.value}</p>
                    <span className="mt-2 inline-block max-w-full truncate rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">{c.tag}</span>
                  </div>
                ))}
                <div className="h-8 rounded-lg border border-dashed border-border" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cartão 2: conversa do agente, sobreposto em telas largas */}
      <div className="relative mt-4 rounded-2xl border border-border bg-card shadow-[0_24px_60px_-28px_rgba(0,0,0,0.3)] sm:ml-auto sm:w-[80%] lg:-mt-10 lg:mr-[-1rem]">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <span className="flex items-center gap-2 text-xs font-medium text-foreground">
            <span className="grid size-5 place-items-center rounded-full bg-foreground text-[10px] font-semibold text-background">IA</span>
            Agente de atendimento
          </span>
          <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <Dot className="bg-brand" /> Online
          </span>
        </div>
        <div className="space-y-2.5 p-4 text-xs leading-relaxed">
          <div className="max-w-[85%] rounded-2xl rounded-bl-sm bg-muted px-3 py-2 text-foreground">
            Oi! Vocês fazem a integração com o meu sistema de estoque?
          </div>
          <div className="ml-auto max-w-[85%] rounded-2xl rounded-br-sm bg-foreground px-3 py-2 text-background">
            Fazemos sim. Posso agendar uma conversa com o time para entender o seu caso.
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-[11px] text-muted-foreground">
            <span className="text-brand">→</span>
            <span>
              Lead qualificado · <span className="font-medium text-foreground">Encaminhado a Ana</span>
            </span>
          </div>
        </div>
      </div>

      <p className="mt-4 text-center text-[11px] text-muted-foreground lg:text-right">Exemplo ilustrativo</p>
    </div>
  );
}
