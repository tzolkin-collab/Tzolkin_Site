/**
 * Mini-ilustrações de interface (HTML/CSS) para o bento de aplicações.
 * Exemplos ilustrativos: não representam clientes nem dados reais.
 */

export function IllustrativeTag() {
  return (
    <span className="absolute right-3 top-3 rounded-full border border-border bg-background px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
      Exemplo ilustrativo
    </span>
  );
}

const frame = 'relative overflow-hidden rounded-xl border border-border bg-muted/60 p-4 pt-10';

export function FunnelMock() {
  const cols = [
    { name: 'Novos', n: 3, w: ['w-4/5', 'w-3/5', 'w-2/3'] },
    { name: 'Em conversa', n: 2, w: ['w-3/4', 'w-1/2'] },
    { name: 'Proposta', n: 1, w: ['w-2/3'] },
  ];
  return (
    <div className={frame} aria-hidden="true">
      <IllustrativeTag />
      <div className="grid grid-cols-3 gap-2.5">
        {cols.map((c) => (
          <div key={c.name}>
            <div className="mb-2 flex items-center justify-between text-[11px] font-medium text-muted-foreground">
              <span>{c.name}</span>
              <span className="tabular-nums">{c.n}</span>
            </div>
            <div className="space-y-2">
              {c.w.map((w, i) => (
                <div key={i} className="rounded-lg border border-border bg-card p-2.5 shadow-sm">
                  <div className={`h-1.5 rounded-full bg-foreground/70 ${w}`} />
                  <div className="mt-2 h-1.5 w-1/2 rounded-full bg-border" />
                  {c.name === 'Em conversa' && i === 0 && (
                    <div className="mt-2 inline-flex items-center gap-1 rounded-md border border-border px-1.5 py-0.5 text-[10px] text-muted-foreground">
                      <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                      Próximo passo
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ChatMock() {
  return (
    <div className={frame} aria-hidden="true">
      <IllustrativeTag />
      <div className="space-y-2 text-[12px] leading-snug">
        <div className="max-w-[80%] rounded-2xl rounded-bl-sm border border-border bg-card px-3 py-2 text-foreground">
          Olá, queria saber o prazo de entrega.
        </div>
        <div className="ml-auto max-w-[80%] rounded-2xl rounded-br-sm bg-foreground px-3 py-2 text-background">
          Claro. Me diga o CEP e confirmo agora.
        </div>
        <div className="flex items-center gap-1.5 pt-1 text-[10px] text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-brand" />
          Encaminha a uma pessoa quando necessário
        </div>
      </div>
    </div>
  );
}

export function StoreMock() {
  return (
    <div className={frame} aria-hidden="true">
      <IllustrativeTag />
      <div className="grid grid-cols-3 gap-2">
        {[0, 1, 2].map((i) => (
          <div key={i} className="rounded-lg border border-border bg-card p-1.5">
            <div className="aspect-[4/3] rounded-md bg-muted" />
            <div className="mt-1.5 h-1.5 w-3/4 rounded-full bg-foreground/60" />
            <div className="mt-1 h-1.5 w-1/3 rounded-full bg-border" />
          </div>
        ))}
      </div>
      <div className="mt-2.5 flex flex-wrap gap-1.5 text-[10px] text-muted-foreground">
        {['Loja', 'Marketplace A', 'Marketplace B'].map((t) => (
          <span key={t} className="rounded-md border border-border bg-card px-1.5 py-0.5">{t}</span>
        ))}
      </div>
    </div>
  );
}

export function InvoiceMock() {
  const rows = [
    ['Pedido 0001', 'Emitida', false],
    ['Pedido 0002', 'Emitida', false],
    ['Pedido 0003', 'Falhou', true],
  ] as const;
  return (
    <div className={frame} aria-hidden="true">
      <IllustrativeTag />
      <div className="divide-y divide-border rounded-lg border border-border bg-card text-[11px]">
        {rows.map(([a, b, bad]) => (
          <div key={a} className="flex items-center justify-between px-2.5 py-1.5">
            <span className="font-mono text-foreground">{a}</span>
            <span className={`inline-flex items-center gap-1 ${bad ? 'text-brand' : 'text-muted-foreground'}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${bad ? 'bg-brand' : 'bg-foreground/40'}`} />
              {b}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function PilotMock() {
  const steps = [
    ['Protótipo', true],
    ['Revisão', true],
    ['Testes', false],
    ['Versão 2', false],
  ] as const;
  return (
    <div className={frame} aria-hidden="true">
      <IllustrativeTag />
      <ol className="relative space-y-2.5 pl-4 text-[11px]">
        <span className="absolute bottom-1 left-[3px] top-1 w-px bg-border" />
        {steps.map(([t, done]) => (
          <li key={t} className="relative flex items-center gap-2 text-foreground">
            <span className={`absolute -left-4 h-[7px] w-[7px] rounded-full border ${done ? 'border-foreground bg-foreground' : 'border-border bg-card'}`} />
            <span className={done ? '' : 'text-muted-foreground'}>{t}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
