/** Malha de gradientes radiais estática (CSS puro, sem animação). */
export function HeroBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0"
      style={{
        backgroundImage: [
          'radial-gradient(60% 50% at 85% 10%, color-mix(in oklab, var(--brand) 9%, transparent), transparent 70%)',
          'radial-gradient(45% 45% at 100% 60%, color-mix(in oklab, var(--foreground) 5%, transparent), transparent 70%)',
          'radial-gradient(50% 50% at 0% 0%, color-mix(in oklab, var(--foreground) 4%, transparent), transparent 70%)',
        ].join(','),
      }}
    />
  );
}
