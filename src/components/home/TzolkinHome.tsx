"use client";

import { useEffect, useRef, useState } from "react";
import {
  CREATIVE_REELS,
  ENGAGEMENT_TRACKS,
  FRAMES_MANIFEST,
  MANIFESTO_LINES,
  type EngagementTrackId,
} from "@/data/tzolkin-experience";
import {
  mountTzolkinEngine,
  type TzolkinEngineController,
} from "@/lib/tzolkin-engine";

export function TzolkinHome() {
  const rootRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<TzolkinEngineController | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTrackId, setActiveTrackId] =
    useState<EngagementTrackId>("test-batch");

  useEffect(() => {
    const root = rootRef.current;
    if (!root) {
      return;
    }

    const controller = mountTzolkinEngine(root, { manifest: FRAMES_MANIFEST });
    engineRef.current = controller;

    return () => {
      controller.destroy();
      engineRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!menuOpen) {
      return;
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  const closeDrawer = () => setMenuOpen(false);
  const activeTrackIndex = Math.max(
    0,
    ENGAGEMENT_TRACKS.findIndex((track) => track.id === activeTrackId)
  );
  const activeTrack = ENGAGEMENT_TRACKS[activeTrackIndex] ?? ENGAGEMENT_TRACKS[0];

  return (
    <div ref={rootRef} className="tz-home is-intro-active">
      {/* Persistent Dual-Mode 60FPS Background Canvas (ffmpeg frames OR WebGL) */}
      <div className="bg-stage" id="bg-stage" aria-hidden="true">
        <canvas className="bg-canvas" id="bg-canvas" />
        <div className="bg-vignette" />
      </div>

      {/* Ring-Mounted Front-Facing iPhone -> Instagram Reels Portal */}
      <div
        className="portal-phone-stage"
        id="portal-phone-stage"
        aria-hidden="true"
      >
        <div className="portal-phone-frame" id="portal-phone-frame">
          <span className="phone-btn phone-btn-power" />
          <span className="phone-btn phone-btn-vol-up" />
          <span className="phone-btn phone-btn-vol-down" />
          <div className="phone-screen">
            <div className="phone-island">
              <span className="phone-camera-lens" />
            </div>
            <video
              className="ig-video"
              id="portal-ig-video"
              src={CREATIVE_REELS[0]?.videoSrc ?? "/reels/reel-01.mp4"}
              muted
              loop
              playsInline
              preload="auto"
            />
            <div className="ig-ring-glare" id="portal-ring-glare" />
            <div className="ig-ui">
              <div className="ig-top">
                <span className="ig-reels-label">Reels</span>
                <svg
                  className="ig-icon"
                  viewBox="0 0 24 24"
                  width={20}
                  height={20}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.75}
                >
                  <rect x="3" y="6" width="18" height="14" rx="3" />
                  <circle cx="12" cy="13" r="3.2" />
                  <path d="M8.5 6l1.2-2h4.6l1.2 2" />
                </svg>
              </div>
              <div className="ig-rail">
                <svg
                  className="ig-icon"
                  viewBox="0 0 24 24"
                  width={22}
                  height={22}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.75}
                >
                  <path d="M12 20.5s-7.5-4.7-9.2-9.2C1.6 8 3.6 5 6.8 5c1.9 0 3.4 1 4.2 2.4h2C13.8 6 15.3 5 17.2 5c3.2 0 5.2 3 4 6.3-1.7 4.5-9.2 9.2-9.2 9.2z" />
                </svg>
                <svg
                  className="ig-icon"
                  viewBox="0 0 24 24"
                  width={22}
                  height={22}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.75}
                >
                  <path d="M20 11.5a8 8 0 0 1-11.5 7.2L4 20l1.3-4.2A8 8 0 1 1 20 11.5z" />
                </svg>
                <svg
                  className="ig-icon"
                  viewBox="0 0 24 24"
                  width={22}
                  height={22}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.75}
                >
                  <path d="M21 4L10 14" />
                  <path d="M21 4l-6.5 16-3.8-6.7L4 9.5 21 4z" />
                </svg>
                <svg
                  className="ig-icon"
                  viewBox="0 0 24 24"
                  width={20}
                  height={20}
                  fill="currentColor"
                >
                  <circle cx="12" cy="6" r="1.5" />
                  <circle cx="12" cy="12" r="1.5" />
                  <circle cx="12" cy="18" r="1.5" />
                </svg>
                <span className="ig-audio-disc" />
              </div>
              <div className="ig-bottom">
                <div className="ig-author">
                  <span className="ig-avatar">TZ</span>
                  <div className="ig-author-meta">
                    <span className="ig-handle">tzolkin.studio</span>
                    <span className="ig-sponsored">Sponsored</span>
                  </div>
                </div>
                <p className="ig-caption">
                  Macro texture hook · Engineered for sub-$15 CPA.
                </p>
                <div className="ig-cta-bar">
                  <span>Learn More</span>
                  <span aria-hidden="true">›</span>
                </div>
                <div className="ig-progress-track">
                  <span className="ig-progress-fill" />
                </div>
              </div>
            </div>
            <div className="phone-home-bar" />
          </div>
        </div>
      </div>

      {/* BEAT 0: Automatic Opening Intro (TZOLKIN rises into top nav) */}
      <div className="hero-intro" id="hero-intro" aria-hidden="true">
        <span className="intro-wordmark" id="intro-wordmark">
          TZOLKIN
        </span>
      </div>

      {/* Transparent Floating Navigation Bar */}
      <header className="nav" id="site-nav">
        <div className="nav-inner">
          <a href="#show" className="nav-brand tz-focus">
            TZOLKIN
          </a>

          <nav aria-label="Primary navigation" className="nav-menu-desktop">
            <ul className="nav-links">
              <li>
                <a className="lnk tz-focus" href="#tunnel">
                  Work
                </a>
              </li>
              <li>
                <a className="lnk tz-focus" href="#thesis">
                  Thesis
                </a>
              </li>
              <li>
                <a className="lnk tz-focus" href="#offers">
                  Engage
                </a>
              </li>
            </ul>
          </nav>

          <div className="nav-actions">
            <a href="#offers" className="btn-nav tz-focus">
              Book Test Batch
            </a>
            <button
              type="button"
              className="nav-menu-btn tz-focus"
              id="nav-menu-btn"
              aria-expanded={menuOpen}
              aria-controls="nav-drawer"
              onClick={() => setMenuOpen((prev) => !prev)}
            >
              Menu
            </button>
          </div>
        </div>

        <div
          className={`nav-drawer${menuOpen ? " is-open" : ""}`}
          id="nav-drawer"
          aria-hidden={!menuOpen}
        >
          <a
            className="drawer-lnk tz-focus"
            href="#show"
            tabIndex={menuOpen ? undefined : -1}
            onClick={closeDrawer}
          >
            Show
          </a>
          <a
            className="drawer-lnk tz-focus"
            href="#tunnel"
            tabIndex={menuOpen ? undefined : -1}
            onClick={closeDrawer}
          >
            Work
          </a>
          <a
            className="drawer-lnk tz-focus"
            href="#thesis"
            tabIndex={menuOpen ? undefined : -1}
            onClick={closeDrawer}
          >
            Thesis
          </a>
          <a
            className="drawer-lnk tz-focus"
            href="#offers"
            tabIndex={menuOpen ? undefined : -1}
            onClick={closeDrawer}
          >
            Engage
          </a>
          <a
            className="btn drawer-cta tz-focus"
            href="#offers"
            tabIndex={menuOpen ? undefined : -1}
            onClick={closeDrawer}
          >
            Book Test Batch
          </a>
        </div>
      </header>

      <main>
        {/* BEAT 1 & BEAT 2: Pinned 2-State Hero Stage */}
        <section
          className="section-hero"
          id="show"
          aria-labelledby="hero-headline-a"
        >
          <div className="hero-sticky">
            <div className="hero-content-shell">
              {/* Hero State A */}
              <article className="card" id="hero-state-a">
                <p className="t3">SYNTHETIC CREATIVE ENGINEERING</p>
                <h1 className="h1" id="hero-headline-a">
                  ENGINEERED FOR SUB-$15 CPAS
                </h1>
                <p className="t1">
                  Direct-response synthetic ad assets for US media buyers
                  saturated with generic AI slop.
                </p>
                <div className="hero-actions">
                  <a href="#offers" className="btn tz-focus">
                    Book Test Batch
                  </a>
                  <a href="#tunnel" className="btn2 tz-focus">
                    Enter 3D Tunnel
                  </a>
                </div>
              </article>

              {/* Hero State B */}
              <article className="card2" id="hero-state-b" aria-hidden="true">
                <h2 className="h2">MEDIA BUYERS DO NOT BUY PRETTY AI VIDEOS.</h2>
                <p className="t1">
                  They buy lower CPA, higher 3-second hook rates, and infinite
                  creative testing without fatigue.
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* STAGE 03: 3D Helical Video Tunnel (Axes X, Y, Z) */}
        <section
          className="section-tunnel"
          id="tunnel"
          aria-label="3D creative reel tunnel"
        >
          <div className="tunnel-sticky">
            <div className="tunnel-layout">
              {/* GPU CSS 3D Perspective Stage */}
              <div className="tunnel-viewport" aria-label="3D creative reel tunnel">
                <div className="helix-stage" id="helix-stage">
                  {CREATIVE_REELS.map((reel) => (
                    <article
                      key={reel.index}
                      className="card3"
                      data-index={reel.index}
                      data-creative-type={reel.title}
                      data-creative-desc={reel.description}
                    >
                      <video
                        className="reel-video"
                        src={reel.videoSrc}
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="auto"
                      />
                      <div className="reel-placeholder">
                        <div className="reel-frame" aria-hidden="true" />
                        <div className="reel-meta-top">
                          <span className="tz-tabular">{reel.slotLabel}</span>
                          <span>9:16</span>
                        </div>
                        <div className="reel-center-group">
                          <svg
                            className="reel-play-icon"
                            viewBox="0 0 48 48"
                            width={48}
                            height={48}
                            fill="none"
                            aria-hidden="true"
                          >
                            <rect
                              x={1}
                              y={1}
                              width={46}
                              height={46}
                              stroke="currentColor"
                              strokeWidth={1.25}
                            />
                            <polygon points="20,16 33,24 20,32" fill="currentColor" />
                          </svg>
                          <div className="reel-center-mark">
                            {reel.placeholderLabel}
                          </div>
                          <span className="reel-path">{reel.videoSrc}</span>
                        </div>
                        <div className="reel-meta-bottom">
                          <span>REPLACE WITH VIDEO</span>
                          <span className="tz-tabular">1080×1920</span>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>

              <aside
                className="reel-type-panel"
                id="reel-type-panel"
                aria-live="polite"
              >
                <div className="reel-type-stack">
                  {CREATIVE_REELS.map((reel) => (
                    <div
                      key={reel.index}
                      className="reel-type-item"
                      data-index={reel.index}
                      aria-hidden={reel.index === 0 ? "false" : "true"}
                    >
                      <h2 className="reel-type-title">{reel.title}</h2>
                      <p className="t2 reel-type-desc">{reel.description}</p>
                    </div>
                  ))}
                </div>
              </aside>
            </div>
          </div>
        </section>

        {/* FOLD 3: Scroll-Driven Manifesto */}
        <section
          className="section-manifesto"
          id="thesis"
          aria-label="TZOLKIN thesis"
        >
          <div className="manifesto-sticky">
            <div className="manifesto-shell">
              <div className="manifesto-rail" aria-hidden="true">
                <div className="manifesto-rail-fill" id="manifesto-rail-fill" />
              </div>
              <div className="manifesto-lines">
                {MANIFESTO_LINES.map((line, index) => (
                  <p
                    key={line}
                    className="manifesto-line"
                    data-manifesto-index={index}
                  >
                    {line}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FOLD 4: Interactive 3D Deliverable Stage + Minimal Footer */}
        <section
          className="section-engage"
          id="offers"
          aria-label="Engagement formats"
        >
          <div className="engage-shell">
            <div className="engage-copy">
              <h2 className="h2">FIXED SCOPE. FIVE-DAY TURNAROUND.</h2>

              <div
                className="engage-tabs"
                role="tablist"
                aria-label="Engagement tracks"
                data-active-index={activeTrackIndex}
              >
                <span className="engage-tab-indicator" aria-hidden="true" />
                {ENGAGEMENT_TRACKS.map((track) => {
                  const selected = track.id === activeTrack.id;
                  return (
                    <button
                      key={track.id}
                      type="button"
                      role="tab"
                      id={`tab-${track.id}`}
                      aria-selected={selected}
                      aria-controls="engage-panel"
                      className="engage-tab tz-focus"
                      onClick={() => setActiveTrackId(track.id)}
                    >
                      {track.title}
                    </button>
                  );
                })}
              </div>

              <article
                className="engage-panel"
                id="engage-panel"
                role="tabpanel"
                aria-labelledby={`tab-${activeTrack.id}`}
              >
                <div className="engage-panel-head">
                  <h3 className="engage-title">{activeTrack.title}</h3>
                  <span className="t3 tz-tabular engage-cadence">
                    {activeTrack.cadence}
                  </span>
                </div>
                <p className="t1 engage-lead">{activeTrack.description}</p>
                <dl className="engage-specs">
                  {activeTrack.specs.map((spec) => (
                    <div key={spec.label} className="engage-spec-row">
                      <dt className="t3">{spec.label}</dt>
                      <dd className="t2 engage-spec-val">{spec.value}</dd>
                    </div>
                  ))}
                </dl>
                <div className="engage-actions">
                  <a
                    href={activeTrack.ctaHref}
                    className={`${activeTrack.variant === "primary" ? "btn" : "btn2"} tz-focus`}
                  >
                    {activeTrack.ctaLabel}
                  </a>
                  <a
                    className="engage-mail tz-focus"
                    href="mailto:hello@tzolkin.studio?subject=TZOLKIN%20Inquiry"
                  >
                    hello@tzolkin.studio
                  </a>
                </div>
              </article>
            </div>

            <div className="engage-stage" aria-hidden="true">
              <div className="deliverable-rig" data-track={activeTrack.id}>
                <div className="rig-head">
                  <span className="t3">{activeTrack.deliverableTitle}</span>
                  <span className="t3 tz-tabular">{activeTrack.cadence}</span>
                </div>

                <div className="rig-metric-wrap">
                  <div className="rig-metric tz-tabular">
                    {activeTrack.deliverableMetric}
                  </div>
                  <div className="t3">{activeTrack.deliverableSub}</div>
                </div>

                <div className="rig-planes">
                  {activeTrack.matrixLayers.map((layerLabel, layerIdx) => {
                    const isBatch = activeTrack.id === "test-batch";
                    const slotCount = isBatch ? 10 : 4;
                    return (
                      <div
                        key={layerLabel}
                        className="deliverable-plane"
                        data-layer={layerIdx}
                      >
                        <span className="plane-label">{layerLabel}</span>
                        <div
                          className="plane-slots"
                          data-mode={isBatch ? "matrix" : "weekly"}
                        >
                          {Array.from({ length: slotCount }, (_, slotIdx) => (
                            <span key={slotIdx} className="plane-slot" />
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <footer className="nav-footer">
            <div className="footer-inner">
              <span className="nav-brand">TZOLKIN</span>
              <div className="footer-links">
                <button
                  type="button"
                  className="lnk-btn tz-focus"
                  id="replay-intro"
                  onClick={() => engineRef.current?.replayIntro()}
                >
                  Replay Intro
                </button>
                <a
                  className="lnk tz-focus"
                  href="mailto:hello@tzolkin.studio?subject=TZOLKIN%20Inquiry"
                >
                  Book Call
                </a>
              </div>
            </div>
          </footer>
        </section>
      </main>
    </div>
  );
}
