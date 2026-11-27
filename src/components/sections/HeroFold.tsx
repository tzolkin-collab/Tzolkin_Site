"use client";

import { useState } from "react";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import { MonochromeFluidBackdrop } from "@/components/ui/MonochromeFluidBackdrop";
import { TelemetryTag } from "@/components/ui/TelemetryTag";
import { heroCreativeSlot } from "@/data/hero-slot";

const heroSpecs = [
  {
    index: "01",
    label: "TEST BATCH",
    value: "30 Ad Assets (10×3 Hooks)",
  },
  {
    index: "02",
    label: "TURNAROUND",
    value: "5 Business Days",
  },
  {
    index: "03",
    label: "ASPECT RATIOS",
    value: "9:16 Vertical & 4:5 Feed",
  },
] as const;

/**
 * Fold 1 — Asymmetric 60/40 Engineering Hero.
 * Monochrome architecture keeps the 9:16 creative viewport as the sole color element.
 */
export function HeroFold() {
  const [backdropPaused, setBackdropPaused] = useState(false);

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative min-h-[85svh] overflow-clip border-b border-[var(--border)] bg-[var(--surface-0)] tz-hairline"
    >
      <MonochromeFluidBackdrop paused={backdropPaused} />

      <div className="relative z-10 mx-auto max-w-[1360px] px-6 py-12 lg:px-12 lg:py-24">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Left Column (7/12 — Clinical Thesis & Action) */}
          <div className="lg:col-span-7">
            <div className="flex flex-wrap items-center gap-3">
              <TelemetryTag>
                [00] SYNTHETIC CREATIVE ENGINEERING // US MARKET
              </TelemetryTag>
            </div>

            <h1 id="hero-heading" className="tz-display mt-6">
              Synthetic ad assets engineered for sub-$15 CPAs.
            </h1>

            <p className="tz-body-pretty mt-6 max-w-[54ch] text-base text-[var(--ink-muted)] sm:text-[var(--text-body-lg)]">
              Built for US media buyers saturated with generic AI slop.
              Proprietary generative models paired with direct-response
              psychology — built to cut CPA, lift 3-second hook rate, and scale
              budget without creative fatigue.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <ButtonLink href="#offers" variant="primary">
                Commission Test Batch
              </ButtonLink>
              <ButtonLink href="#lab" variant="ghost">
                Telemetry Lab ↓
              </ButtonLink>
              <Link
                href="/design-system"
                className="px-2 py-2 font-mono text-[var(--text-mono-xs)] uppercase tracking-[0.16em] text-[var(--ink-muted)] transition-colors hover:text-[var(--ink)] tz-focus-ring"
              >
                Inspect Design System →
              </Link>
            </div>

            {/* Grounded Productized Scope Bar */}
            <dl className="mt-12 grid grid-cols-1 gap-6 border-t border-[var(--border)] pt-8 sm:grid-cols-3 tz-hairline">
              {heroSpecs.map((spec) => (
                <div key={spec.index}>
                  <dt className="font-mono text-[var(--text-mono-xs)] uppercase tracking-[0.16em] text-[var(--ink-subtle)] tz-tabular">
                    {spec.index} // {spec.label}
                  </dt>
                  <dd className="mt-2 text-base font-normal text-[var(--ink)] tz-tabular">
                    {spec.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Right Column (5/12 — Creative Telemetry Viewport) */}
          <div className="lg:col-span-5">
            <div className="border border-[var(--border)] bg-[var(--surface-1)] tz-hairline">
              {/* Console Header */}
              <div className="flex items-center justify-between gap-4 border-b border-[var(--border)] px-4 py-3 tz-hairline">
                <span className="font-mono text-[var(--text-mono-xs)] uppercase tracking-[0.14em] text-[var(--ink-muted)] tz-tabular">
                  {heroCreativeSlot.slotId} // {heroCreativeSlot.aspect} CREATIVE
                </span>
                <span className="font-mono text-[var(--text-mono-xs)] uppercase tracking-[0.14em] text-[var(--ink)] tz-tabular">
                  [{heroCreativeSlot.statusLabel}]
                </span>
              </div>

              {/* Stage — Creative is the ONLY color on screen */}
              <div className="bg-[var(--surface-0)] p-4 sm:p-6">
                <div className="relative mx-auto aspect-[9/16] w-full max-w-[304px] overflow-hidden border border-[var(--border-strong)] bg-[var(--surface-1)] tz-hairline">
                  {heroCreativeSlot.videoSrc ? (
                    <video
                      src={heroCreativeSlot.videoSrc}
                      poster={heroCreativeSlot.posterSrc ?? undefined}
                      autoPlay
                      muted
                      loop
                      playsInline
                      controls
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    /* Chromatic Calibration Aperture: demonstrates color isolation before real footage is dropped */
                    <div className="relative flex h-full w-full flex-col justify-between p-4">
                      {/* Controlled Editorial Film Spectrum (sole color on screen) */}
                      <div
                        aria-hidden="true"
                        className="absolute inset-0"
                        style={{
                          background:
                            "radial-gradient(circle at 62% 38%, rgba(217, 119, 54, 0.88) 0%, rgba(168, 56, 43, 0.72) 34%, rgba(24, 52, 86, 0.85) 68%, rgba(9, 9, 11, 0.98) 100%)",
                        }}
                      />
                      {/* Subtle dark vignette at edges so registration marks remain crisp */}
                      <div
                        aria-hidden="true"
                        className="absolute inset-0"
                        style={{
                          background:
                            "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.08) 38%, rgba(0,0,0,0.12) 65%, rgba(0,0,0,0.78) 100%)",
                        }}
                      />

                      {/* Corner Safe-Zone Registration Ticks */}
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute top-3 left-3 h-3 w-3 border-t border-l border-white/75"
                      />
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute top-3 right-3 h-3 w-3 border-t border-r border-white/75"
                      />
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute bottom-3 left-3 h-3 w-3 border-b border-l border-white/75"
                      />
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute right-3 bottom-3 h-3 w-3 border-r border-b border-white/75"
                      />

                      {/* Top Hook Ruler */}
                      <div className="relative z-10 flex items-center justify-between border-b border-white/25 pb-2 font-mono text-[0.6875rem] tracking-[0.14em] text-white tz-tabular">
                        <span>HOOK WINDOW</span>
                        <span>{heroCreativeSlot.hookWindow}</span>
                      </div>

                      {/* Center Aperture Marker */}
                      <div className="relative z-10 my-auto flex flex-col items-center text-center">
                        <div className="border border-white/40 bg-black/55 px-3 py-2 font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-white tz-tabular">
                          9:16 CHROMATIC VIEWPORT
                        </div>
                        <p className="mt-3 max-w-[24ch] text-xs font-light tracking-[0.06em] text-white/90">
                          Monochrome shell isolates 100% of visual attention on
                          the ad creative.
                        </p>
                      </div>

                      {/* Bottom Honest Slot Caption */}
                      <div className="relative z-10 border-t border-white/25 pt-2 font-mono text-[0.6875rem] leading-relaxed tracking-[0.1em] text-white/85">
                        {heroCreativeSlot.caption}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Console Footer Telemetry Strip */}
              <div className="grid grid-cols-3 divide-x divide-[var(--border)] border-t border-[var(--border)] bg-[var(--surface-1)] tz-hairline">
                <div className="p-3">
                  <p className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-[var(--ink-subtle)]">
                    HOOK
                  </p>
                  <p className="mt-1 font-mono text-[var(--text-mono-xs)] text-[var(--ink)] tz-tabular">
                    0–3 SEC
                  </p>
                </div>
                <div className="p-3">
                  <p className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-[var(--ink-subtle)]">
                    RENDER
                  </p>
                  <p className="mt-1 font-mono text-[var(--text-mono-xs)] text-[var(--ink)] tz-tabular">
                    {heroCreativeSlot.pipelineLabel}
                  </p>
                </div>
                <div className="p-3">
                  <p className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-[var(--ink-subtle)]">
                    DATA
                  </p>
                  <p className="mt-1 font-mono text-[var(--text-mono-xs)] text-[var(--ink)] tz-tabular">
                    {heroCreativeSlot.telemetryState}
                  </p>
                </div>
              </div>
            </div>

            {/* Visible Pause/Play Backdrop Control (WCAG 2.2.2) */}
            <div className="mt-3 flex items-center justify-between gap-4">
              <span className="font-mono text-[var(--text-mono-xs)] text-[var(--ink-subtle)]">
                35MM MONOCHROME SURFACE
              </span>
              <button
                type="button"
                onClick={() => setBackdropPaused((prev) => !prev)}
                className="rounded-[var(--radius-sharp)] border border-[var(--border)] bg-[var(--surface-1)] px-3 py-1.5 font-mono text-[var(--text-mono-xs)] uppercase tracking-[0.14em] text-[var(--ink-muted)] transition-colors hover:border-[var(--ink)] hover:text-[var(--ink)] tz-focus-ring tz-hairline"
              >
                {backdropPaused ? "Play backdrop" : "Pause backdrop"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
