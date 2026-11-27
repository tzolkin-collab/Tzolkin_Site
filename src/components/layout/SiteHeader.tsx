import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";

const navItems = [
  { label: "Lab", href: "#lab" },
  { label: "Verticals", href: "#verticals" },
  { label: "Offers", href: "#offers" },
  { label: "Design System", href: "/design-system" },
] as const;

/** Architectural full-width navigation bar on Void Black with hairline bottom rule. */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--surface-0)]/95 backdrop-blur-xs tz-hairline">
      <div className="mx-auto flex max-w-[1360px] flex-wrap items-center justify-between gap-4 px-6 py-4 lg:px-12">
        <Link
          href="/"
          className="tz-wordmark text-sm text-[var(--ink)] sm:text-base tz-focus-ring"
        >
          TZOLKIN
        </Link>

        <nav
          aria-label="Primary navigation"
          className="flex flex-wrap items-center gap-6"
        >
          <ul className="hidden items-center gap-6 md:flex">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="font-mono text-[var(--text-mono-xs)] uppercase tracking-[0.16em] text-[var(--ink-muted)] transition-colors hover:text-[var(--ink)] tz-focus-ring"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <Link
            href="/design-system"
            className="font-mono text-[var(--text-mono-xs)] uppercase tracking-[0.16em] text-[var(--ink-muted)] transition-colors hover:text-[var(--ink)] md:hidden tz-focus-ring"
          >
            Tokens
          </Link>

          <ButtonLink href="#offers" variant="primary" className="px-4 py-3">
            Test Batch
          </ButtonLink>
        </nav>
      </div>
    </header>
  );
}
