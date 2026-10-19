import { ArrowRight, BellRing, Database, Inbox, LineChart, Sparkles, type LucideIcon } from "lucide-react";
import { flowSteps } from "./content";

// Ícones por posição das etapas (apresentação apenas).
const stepIcons: LucideIcon[] = [Inbox, Sparkles, Database, BellRing, LineChart];

export function FlowDiagram() {
  return (
    <figure className="mt-12">
      <ol className="grid gap-8 md:grid-cols-5 md:gap-5" aria-label="Fluxo do CRM com IA">
        {flowSteps.map((s, i) => {
          const Icon = stepIcons[i] ?? Sparkles;
          const active = i === 1;
          return (
            <li
              key={s.title}
              className={`relative flex items-start gap-4 rounded-3xl border p-5 md:block ${
                active
                  ? "border-brand/50 bg-brand/5 shadow-lg shadow-brand/10"
                  : "border-border/40 bg-card shadow-[0_2px_6px_rgba(0,0,0,0.03),0_12px_28px_-12px_rgba(0,0,0,0.16)]"
              }`}
            >
              <div
                aria-hidden="true"
                className={`relative inline-flex shrink-0 rounded-2xl p-3 md:mb-4 ${
                  active
                    ? "bg-gradient-to-br from-brand to-brand/70 text-brand-foreground shadow-lg shadow-brand/30"
                    : "bg-foreground/5 text-muted-foreground"
                }`}
              >
                <Icon className="h-6 w-6" />
                <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-foreground text-xs font-bold text-background">
                  {i + 1}
                </span>
              </div>
              <div>
                <p className="font-bold leading-snug">{s.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{s.text}</p>
              </div>
              {i < flowSteps.length - 1 && (
                <ArrowRight
                  aria-hidden="true"
                  className="absolute -bottom-7 left-9 z-10 h-5 w-5 rotate-90 text-brand md:-right-[18px] md:bottom-auto md:left-auto md:top-1/2 md:-translate-y-1/2 md:rotate-0"
                  strokeWidth={3}
                />
              )}
            </li>
          );
        })}
      </ol>
      <figcaption className="mt-6 text-center text-sm text-muted-foreground">
        Exemplo ilustrativo. O fluxo real é desenhado com você no mês 1, conforme as suas origens de contato.
      </figcaption>
    </figure>
  );
}
