/** Painéis ilustrativos em fonte mono para "Como construímos". Exemplos, sem dados reais. */

const panel = 'relative overflow-hidden rounded-xl border border-border bg-muted/60 font-mono text-[12px] leading-relaxed text-foreground';

function Bar({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-between gap-2 border-b border-border px-4 py-2 text-[11px] text-muted-foreground">
      <span className="truncate">{label}</span>
      <span className="shrink-0 font-sans">Exemplo ilustrativo</span>
    </div>
  );
}

export function PermissionsPanel() {
  const head = ['Perfil', 'Ler', 'Editar', 'Excluir'];
  const rows: [string, boolean, boolean, boolean][] = [
    ['Admin', true, true, true],
    ['Operador', true, true, false],
    ['Leitura', true, false, false],
  ];
  return (
    <div className={panel} aria-hidden="true">
      <Bar label="permissoes.md" />
      <div className="grid grid-cols-[1.4fr_1fr_1fr_1fr] gap-y-2 px-4 py-4">
        {head.map((h) => (
          <span key={h} className="text-[11px] text-muted-foreground">{h}</span>
        ))}
        {rows.map(([name, ...v]) => (
          <div key={name} className="contents">
            <span>{name}</span>
            {v.map((ok, i) => (
              <span key={i} className={ok ? 'text-foreground' : 'text-muted-foreground/50'}>{ok ? '●' : '○'}</span>
            ))}
          </div>
        ))}
      </div>
      <div className="border-t border-border px-4 py-2.5 text-[11px] text-muted-foreground">
        <span className="text-brand">env</span> segredos fora do código
      </div>
    </div>
  );
}

export function ResourcesPanel() {
  const rows = [
    ['Hospedagem', 'TZOLKIN'],
    ['Banco de dados', 'TZOLKIN'],
    ['Filas', 'TZOLKIN'],
    ['Domínio', 'Cliente'],
    ['Serviços externos', 'Cliente'],
  ];
  return (
    <div className={panel} aria-hidden="true">
      <Bar label="recursos.md" />
      <ul className="divide-y divide-border">
        {rows.map(([r, o]) => (
          <li key={r} className="flex items-center justify-between px-4 py-2">
            <span>{r}</span>
            <span className="rounded border border-border bg-card px-1.5 py-0.5 text-[10px] text-muted-foreground">{o}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function RepoPanel() {
  const lines: [string, string?][] = [
    ['├─ docs/', 'arquitetura'],
    ['├─ src/'],
    ['├─ tests/', 'fluxos críticos'],
    ['├─ README.md'],
    ['└─ HANDOFF.md', 'fim do ciclo'],
  ];
  return (
    <div className={panel} aria-hidden="true">
      <Bar label="repositório do cliente" />
      <div className="space-y-1 px-4 py-4">
        <div className="text-muted-foreground">cliente/projeto</div>
        {lines.map(([f, note]) => (
          <div key={f} className="flex justify-between gap-3 whitespace-nowrap">
            <span>{f}</span>
            {note && <span className="truncate text-muted-foreground">{note}</span>}
          </div>
        ))}
      </div>
      <div className="border-t border-border px-4 py-2.5 text-[11px] text-muted-foreground">
        <span className="text-brand">✓</span> testes passando
      </div>
    </div>
  );
}
