import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { TelemetryTag } from "@/components/ui/TelemetryTag";

const paletteTokens = [
  {
    token: "--surface-0",
    name: "Void Black",
    hex: "#000000",
    contrast: "21.0:1 vs #FFF",
    usage: "Primary canvas (~90% visual area), absolute focus on colored creative.",
    swatchBg: "bg-[var(--surface-0)]",
  },
  {
    token: "--surface-1",
    name: "Carbon Surface",
    hex: "#09090B",
    contrast: "19.8:1 vs #FFF",
    usage: "Alternating section bands and interactive console frames.",
    swatchBg: "bg-[var(--surface-1)]",
  },
  {
    token: "--surface-2",
    name: "Console Well",
    hex: "#111114",
    contrast: "18.8:1 vs #FFF",
    usage: "Telemetry readouts, inset cells, disabled control fill.",
    swatchBg: "bg-[var(--surface-2)]",
  },
  {
    token: "--ink",
    name: "Pure White",
    hex: "#FFFFFF",
    contrast: "21.0:1 on #000",
    usage: "Primary typography, TZOLKIN wordmark, primary button inversion.",
    swatchBg: "bg-[var(--ink)]",
  },
  {
    token: "--ink-muted",
    name: "Zinc 400",
    hex: "#A1A1AA",
    contrast: "8.2:1 on #000",
    usage: "Clinical body copy, subheadlines, secondary specifications.",
    swatchBg: "bg-[var(--ink-muted)]",
  },
  {
    token: "--ink-subtle",
    name: "Subtle Slate",
    hex: "#85858F",
    contrast: "5.8:1 on #000",
    usage: "Indices ([01]), timestamps, disabled text, technical metadata.",
    swatchBg: "bg-[var(--ink-subtle)]",
  },
  {
    token: "--border",
    name: "Hairline",
    hex: "#1F1F23",
    contrast: "Structural 1px",
    usage: "Surgical 1px grid dividers. Zero drop shadows or decorative gradients.",
    swatchBg: "bg-[var(--border)]",
  },
  {
    token: "--border-strong",
    name: "Hairline Strong",
    hex: "#3F3F46",
    contrast: "Interactive 1px",
    usage: "Active card frames, ghost button default border, aperture ticks.",
    swatchBg: "bg-[var(--border-strong)]",
  },
] as const;

const spacingScale = [
  { token: "--space-1", px: 8, rem: "0.5rem", usage: "Tight tag gaps, icon-to-label" },
  { token: "--space-2", px: 16, rem: "1rem", usage: "Header padding, compact cell padding" },
  { token: "--space-3", px: 24, rem: "1.5rem", usage: "Button inline padding, card inner padding" },
  { token: "--space-4", px: 32, rem: "2rem", usage: "Spec bar top padding, block rhythm" },
  { token: "--space-6", px: 48, rem: "3rem", usage: "Mobile section padding, major grid gaps" },
  { token: "--space-8", px: 64, rem: "4rem", usage: "Desktop column separation (12-col)" },
  { token: "--space-12", px: 96, rem: "6rem", usage: "Desktop fold vertical rhythm (py-24)" },
  { token: "--space-16", px: 128, rem: "8rem", usage: "Expanded editorial breathing room" },
] as const;

export default function DesignSystemPage() {
  return (
    <div className="min-h-screen bg-[var(--surface-0)] text-[var(--ink)]">
      {/* Top Specimen Bar */}
      <header className="border-b border-[var(--border)] bg-[var(--surface-0)] tz-hairline">
        <div className="mx-auto flex max-w-[1360px] flex-wrap items-center justify-between gap-4 px-6 py-4 lg:px-12">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="tz-wordmark text-sm text-[var(--ink)] tz-focus-ring"
            >
              TZOLKIN
            </Link>
            <TelemetryTag tone="muted">SPEC // v1.0 LOCKED</TelemetryTag>
          </div>
          <Link
            href="/"
            className="font-mono text-[var(--text-mono-xs)] uppercase tracking-[0.16em] text-[var(--ink-muted)] transition-colors hover:text-[var(--ink)] tz-focus-ring"
          >
            ← Back to Hero
          </Link>
        </div>
      </header>

      <main>
        {/* Intro */}
        <section className="border-b border-[var(--border)] bg-[var(--surface-0)] py-12 lg:py-16 tz-hairline">
          <div className="mx-auto max-w-[1360px] px-6 lg:px-12">
            <p className="tz-kicker text-xs text-[var(--ink-muted)]">
              ARCHITECTURAL MONOCHROME SYSTEM
            </p>
            <h1 className="tz-display mt-4 max-w-[18ch]">
              Design System Specimen.
            </h1>
            <p className="tz-body-pretty mt-4 max-w-[60ch] text-base text-[var(--ink-muted)]">
              Every surface, hairline, type weight, and spacing unit is locked in
              CSS custom properties before section markup. The creative video
              asset remains the sole source of color on screen.
            </p>
          </div>
        </section>

        {/* 01 // Surfaces & Palette */}
        <section className="border-b border-[var(--border)] bg-[var(--surface-1)] py-12 lg:py-24 tz-hairline">
          <div className="mx-auto max-w-[1360px] px-6 lg:px-12">
            <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-[var(--border)] pb-6 tz-hairline">
              <h2 className="tz-h2">01 // Surfaces &amp; Palette</h2>
              <span className="font-mono text-[var(--text-mono-xs)] uppercase tracking-[0.16em] text-[var(--ink-subtle)]">
                ZERO DROP SHADOWS · ZERO NEON · ZERO GRADIENTS
              </span>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {paletteTokens.map((item) => (
                <div
                  key={item.token}
                  className="flex flex-col justify-between border border-[var(--border)] bg-[var(--surface-0)] p-6 tz-hairline"
                >
                  <div>
                    <div
                      className={`h-16 w-full border border-[var(--border-strong)] ${item.swatchBg}`}
                    />
                    <div className="mt-4 flex items-baseline justify-between gap-2">
                      <span className="text-base font-normal text-[var(--ink)]">
                        {item.name}
                      </span>
                      <span className="font-mono text-[var(--text-mono-xs)] text-[var(--ink)] tz-tabular">
                        {item.hex}
                      </span>
                    </div>
                    <p className="mt-1 font-mono text-[var(--text-mono-xs)] text-[var(--ink-subtle)]">
                      {item.token}
                    </p>
                  </div>

                  <div className="mt-4 border-t border-[var(--border)] pt-3 tz-hairline">
                    <p className="font-mono text-[var(--text-mono-xs)] text-[var(--ink-muted)] tz-tabular">
                      {item.contrast}
                    </p>
                    <p className="tz-body-pretty mt-2 text-sm text-[var(--ink-muted)]">
                      {item.usage}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 02 // Typography */}
        <section className="border-b border-[var(--border)] bg-[var(--surface-0)] py-12 lg:py-24 tz-hairline">
          <div className="mx-auto max-w-[1360px] px-6 lg:px-12">
            <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-[var(--border)] pb-6 tz-hairline">
              <h2 className="tz-h2">02 // Typography Pair</h2>
              <span className="font-mono text-[var(--text-mono-xs)] uppercase tracking-[0.16em] text-[var(--ink-subtle)]">
                OUTFIT (200/300/400) + GEIST MONO (400/500)
              </span>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
              <div className="space-y-8 border border-[var(--border)] bg-[var(--surface-1)] p-6 lg:col-span-7 lg:p-8 tz-hairline">
                <div>
                  <p className="font-mono text-[var(--text-mono-xs)] uppercase tracking-[0.16em] text-[var(--ink-subtle)]">
                    BRANDMARK · OUTFIT 200 · +0.42EM TRACKING
                  </p>
                  <p className="tz-wordmark mt-3 text-2xl sm:text-3xl">TZOLKIN</p>
                </div>

                <div className="border-t border-[var(--border)] pt-6 tz-hairline">
                  <p className="font-mono text-[var(--text-mono-xs)] uppercase tracking-[0.16em] text-[var(--ink-subtle)]">
                    DISPLAY · OUTFIT 300 · CLAMP(2.125REM, 1.35REM + 3.1VW, 4.5REM)
                  </p>
                  <p className="tz-display mt-3">
                    Synthetic ad assets engineered for sub-$15 CPAs.
                  </p>
                </div>

                <div className="border-t border-[var(--border)] pt-6 tz-hairline">
                  <p className="font-mono text-[var(--text-mono-xs)] uppercase tracking-[0.16em] text-[var(--ink-subtle)]">
                    BODY · OUTFIT 400 · MAX 60CH · LINE-HEIGHT 1.55
                  </p>
                  <p className="tz-body-pretty mt-3 max-w-[60ch] text-base text-[var(--ink-muted)]">
                    Proprietary generative models paired with direct-response
                    psychology — engineered to increase 3-second hook rate and
                    sustain budget scale without creative fatigue.
                  </p>
                </div>
              </div>

              <div className="flex flex-col justify-between border border-[var(--border)] bg-[var(--surface-1)] p-6 lg:col-span-5 lg:p-8 tz-hairline">
                <div>
                  <p className="font-mono text-[var(--text-mono-xs)] uppercase tracking-[0.16em] text-[var(--ink-subtle)]">
                    TELEMETRY · GEIST MONO · TABULAR-NUMS
                  </p>
                  <div className="mt-6 space-y-4 font-mono tz-tabular">
                    <div className="flex items-center justify-between border-b border-[var(--border)] pb-3 tz-hairline">
                      <span className="text-[var(--text-mono-xs)] uppercase tracking-[0.14em] text-[var(--ink-muted)]">
                        [01] TEST BATCH SCOPE
                      </span>
                      <span className="text-sm text-[var(--ink)]">
                        30 ASSETS (10×3)
                      </span>
                    </div>
                    <div className="flex items-center justify-between border-b border-[var(--border)] pb-3 tz-hairline">
                      <span className="text-[var(--text-mono-xs)] uppercase tracking-[0.14em] text-[var(--ink-muted)]">
                        [02] TURNAROUND SLA
                      </span>
                      <span className="text-sm text-[var(--ink)]">
                        05 BUSINESS DAYS
                      </span>
                    </div>
                    <div className="flex items-center justify-between border-b border-[var(--border)] pb-3 tz-hairline">
                      <span className="text-[var(--text-mono-xs)] uppercase tracking-[0.14em] text-[var(--ink-muted)]">
                        [03] HOOK WINDOW
                      </span>
                      <span className="text-sm text-[var(--ink)]">
                        00:00 — 00:03
                      </span>
                    </div>
                  </div>
                </div>

                <p className="mt-8 font-mono text-[var(--text-mono-xs)] text-[var(--ink-subtle)]">
                  font-variant-numeric: tabular-nums prevents layout jitter when
                  scrubbing frames or comparing creative specs.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 03 // 8pt Spacing Scale */}
        <section className="border-b border-[var(--border)] bg-[var(--surface-1)] py-12 lg:py-24 tz-hairline">
          <div className="mx-auto max-w-[1360px] px-6 lg:px-12">
            <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-[var(--border)] pb-6 tz-hairline">
              <h2 className="tz-h2">03 // 8pt Spacing Scale</h2>
              <span className="font-mono text-[var(--text-mono-xs)] uppercase tracking-[0.16em] text-[var(--ink-subtle)]">
                CLOSED SET: 8 · N
              </span>
            </div>

            <div className="mt-8 divide-y divide-[var(--border)] border border-[var(--border)] bg-[var(--surface-0)] tz-hairline">
              {spacingScale.map((step) => (
                <div
                  key={step.token}
                  className="grid grid-cols-1 items-center gap-4 px-6 py-4 sm:grid-cols-12"
                >
                  <div className="font-mono text-[var(--text-mono-xs)] text-[var(--ink)] sm:col-span-3">
                    {step.token}
                  </div>
                  <div className="font-mono text-[var(--text-mono-xs)] text-[var(--ink-muted)] tz-tabular sm:col-span-2">
                    {step.px}px ({step.rem})
                  </div>
                  <div className="sm:col-span-3">
                    <div
                      className="h-3 bg-[var(--ink)]"
                      style={{ width: `${step.px}px` }}
                    />
                  </div>
                  <div className="text-sm text-[var(--ink-muted)] sm:col-span-4">
                    {step.usage}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 04 // Interactive Button States */}
        <section className="bg-[var(--surface-0)] py-12 lg:py-24">
          <div className="mx-auto max-w-[1360px] px-6 lg:px-12">
            <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-[var(--border)] pb-6 tz-hairline">
              <h2 className="tz-h2">04 // Button States (3 States)</h2>
              <span className="font-mono text-[var(--text-mono-xs)] uppercase tracking-[0.16em] text-[var(--ink-subtle)]">
                SHARP 2PX RADIUS · PURE INVERSION HOVER
              </span>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
              {/* Primary Variant */}
              <div className="border border-[var(--border)] bg-[var(--surface-1)] p-6 lg:p-8 tz-hairline">
                <p className="font-mono text-[var(--text-mono-xs)] uppercase tracking-[0.16em] text-[var(--ink-muted)]">
                  PRIMARY // INVERSION CTA
                </p>
                <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
                  <div>
                    <p className="mb-3 font-mono text-[var(--text-mono-xs)] text-[var(--ink-subtle)]">
                      DEFAULT
                    </p>
                    <Button variant="primary">Book Batch</Button>
                  </div>
                  <div>
                    <p className="mb-3 font-mono text-[var(--text-mono-xs)] text-[var(--ink-subtle)]">
                      HOVER PREVIEW
                    </p>
                    <Button variant="primary" forceHoverPreview>
                      Book Batch
                    </Button>
                  </div>
                  <div>
                    <p className="mb-3 font-mono text-[var(--text-mono-xs)] text-[var(--ink-subtle)]">
                      DISABLED
                    </p>
                    <Button variant="primary" disabled>
                      Book Batch
                    </Button>
                  </div>
                </div>
              </div>

              {/* Ghost Variant */}
              <div className="border border-[var(--border)] bg-[var(--surface-1)] p-6 lg:p-8 tz-hairline">
                <p className="font-mono text-[var(--text-mono-xs)] uppercase tracking-[0.16em] text-[var(--ink-muted)]">
                  GHOST // SECONDARY ACTION
                </p>
                <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
                  <div>
                    <p className="mb-3 font-mono text-[var(--text-mono-xs)] text-[var(--ink-subtle)]">
                      DEFAULT
                    </p>
                    <Button variant="ghost">Inspect Lab</Button>
                  </div>
                  <div>
                    <p className="mb-3 font-mono text-[var(--text-mono-xs)] text-[var(--ink-subtle)]">
                      HOVER PREVIEW
                    </p>
                    <Button variant="ghost" forceHoverPreview>
                      Inspect Lab
                    </Button>
                  </div>
                  <div>
                    <p className="mb-3 font-mono text-[var(--text-mono-xs)] text-[var(--ink-subtle)]">
                      DISABLED
                    </p>
                    <Button variant="ghost" disabled>
                      Inspect Lab
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
