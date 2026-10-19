import { flowSteps } from "./content";

// Fluxo em linha: nós numerados ligados por conectores finos (vertical no celular, horizontal no desktop).
export function FlowDiagram() {
  return (
    <figure className="mt-14">
      <ol className="grid gap-0 md:grid-cols-5" aria-label="Fluxo do CRM com IA">
        {flowSteps.map((s, i) => {
          const last = i === flowSteps.length - 1;
          const active = i === 1;
          return (
            <li key={s.title} className="relative flex gap-4 pb-8 md:block md:pb-0 md:pr-6">
              {!last && (
                <span
                  aria-hidden="true"
                  className="absolute left-[15px] top-8 h-[calc(100%-2rem)] w-px bg-border md:left-8 md:top-[15px] md:h-px md:w-[calc(100%-2rem)]"
                />
              )}
              <span
                aria-hidden="true"
                className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-sm font-semibold ${
                  active ? "border-brand bg-brand text-brand-foreground" : "border-border bg-background text-foreground"
                }`}
              >
                {i + 1}
              </span>
              <div className="md:mt-5">
                <p className="font-semibold leading-snug tracking-tight text-foreground">{s.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{s.text}</p>
              </div>
            </li>
          );
        })}
      </ol>
      <figcaption className="mt-10 border-t border-border pt-5 text-sm text-muted-foreground">
        Exemplo ilustrativo. O fluxo real é desenhado com você no mês 1, conforme as suas origens de contato.
      </figcaption>
    </figure>
  );
}
