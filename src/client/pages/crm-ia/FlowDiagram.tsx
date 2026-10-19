import { flowSteps } from "./content";

export function FlowDiagram() {
  return (
    <figure className="mt-10">
      <ol className="grid gap-5 md:grid-cols-5 md:gap-4" aria-label="Fluxo do CRM com IA">
        {flowSteps.map((s, i) => (
          <li key={s.title} className="relative flex items-start gap-4 rounded-2xl border border-border bg-foreground/[0.03] p-4 md:block">
            <span
              aria-hidden="true"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand text-sm font-bold text-brand-foreground md:mb-3"
            >
              {i + 1}
            </span>
            <div>
              <p className="font-semibold leading-snug">{s.title}</p>
              <p className="mt-1 text-sm text-muted-foreground">{s.text}</p>
            </div>
            {i < flowSteps.length - 1 && (
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="absolute -bottom-[18px] left-7 z-10 h-4 w-4 rotate-90 text-brand-ink md:-right-[14px] md:bottom-auto md:left-auto md:top-1/2 md:-translate-y-1/2 md:rotate-0"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 5l7 7-7 7" />
              </svg>
            )}
          </li>
        ))}
      </ol>
      <figcaption className="mt-4 text-sm text-muted-foreground">
        Exemplo ilustrativo. O fluxo real é desenhado com você no mês 1, conforme as suas origens de contato.
      </figcaption>
    </figure>
  );
}
