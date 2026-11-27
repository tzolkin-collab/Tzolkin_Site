import type { ReactNode } from "react";

export interface TelemetryTagProps {
  children: ReactNode;
  tone?: "default" | "muted";
  className?: string;
}

/** Compact monospace badge with tabular figures and hairline border. */
export function TelemetryTag({
  children,
  tone = "default",
  className = "",
}: TelemetryTagProps) {
  const toneClasses =
    tone === "default"
      ? "border-[var(--border-strong)] text-[var(--ink)] bg-[var(--surface-1)]"
      : "border-[var(--border)] text-[var(--ink-muted)] bg-[var(--surface-0)]";

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-[var(--radius-sharp)] border px-2 py-1 font-mono text-[var(--text-mono-xs)] uppercase tracking-[0.14em] tz-tabular tz-hairline ${toneClasses} ${className}`.trim()}
    >
      {children}
    </span>
  );
}
