import type { FramesManifest } from "@/data/tzolkin-experience";

interface FrameVariantCache {
  frames: Array<ImageBitmap | HTMLImageElement | false | null | undefined>;
  started: boolean;
}

interface BgEngine {
  onResize: () => void;
  onRender: (
    elapsedSec: number,
    scrollProgress: number,
    rigY?: number,
    camZoom?: number
  ) => void;
  destroy: () => void;
}

export interface TzolkinEngineController {
  replayIntro: () => void;
  destroy: () => void;
}

const CONFIG = {
  smoothScrollSpeed: 16.0,
  tunnelSmoothSpeed: 13.0,
  manifestoSmoothSpeed: 12.0,
  wheelInertiaSpeed: 12.0,
  maxDpr: 2,
  webglScale: 0.85,
  maxWebGLWidth: 1280,
  keyframeStride: 8,
  batchSize: 12,
} as const;

function clamp(value: number, min: number, max: number): number {
  return value < min ? min : value > max ? max : value;
}

function clamp01(value: number): number {
  return clamp(value, 0, 1);
}

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = clamp01((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

function cubicBezier(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  progress: number
): number {
  const x = clamp01(progress);
  if (x <= 0 || x >= 1) {
    return x;
  }
  const cx = 3 * x1;
  const bx = 3 * (x2 - x1) - cx;
  const ax = 1 - cx - bx;
  const cy = 3 * y1;
  const by = 3 * (y2 - y1) - cy;
  const ay = 1 - cy - by;

  let t = x;
  for (let i = 0; i < 4; i += 1) {
    const sampleX = ((ax * t + bx) * t + cx) * t;
    const dx = (3 * ax * t + 2 * bx) * t + cx;
    if (Math.abs(dx) < 1e-5) {
      break;
    }
    t = clamp01(t - (sampleX - x) / dx);
  }
  return ((ay * t + by) * t + cy) * t;
}

function easeBezierOut(t: number): number {
  return cubicBezier(0.22, 1, 0.36, 1, t);
}

function easeBezierSmooth(t: number): number {
  return cubicBezier(0.4, 0, 0.2, 1, t);
}

function getMaxScroll(): number {
  return Math.max(
    0,
    document.documentElement.scrollHeight - window.innerHeight
  );
}

function padFrameIndex(index: number): string {
  return String(index).padStart(4, "0");
}

export function mountTzolkinEngine(
  root: HTMLElement,
  options: { manifest: FramesManifest }
): TzolkinEngineController {
  const { manifest } = options;

  const canvas = root.querySelector<HTMLCanvasElement>("#bg-canvas");
  const bgStage = root.querySelector<HTMLElement>("#bg-stage");
  const heroSection = root.querySelector<HTMLElement>("#show");
  const heroContentShell = root.querySelector<HTMLElement>(".hero-content-shell");
  const heroStateA = root.querySelector<HTMLElement>("#hero-state-a");
  const heroStateB = root.querySelector<HTMLElement>("#hero-state-b");
  const heroProgressFill =
    root.querySelector<HTMLElement>("#hero-progress-fill");
  const heroPhaseLabel = root.querySelector<HTMLElement>("#hero-phase-label");
  const heroPercentLabel =
    root.querySelector<HTMLElement>("#hero-percent-label");
  const heroHud = root.querySelector<HTMLElement>(".hero-hud");
  const siteNav = root.querySelector<HTMLElement>("#site-nav");
  const tunnelSection = root.querySelector<HTMLElement>("#tunnel");
  const tunnelLayout = tunnelSection
    ? tunnelSection.querySelector<HTMLElement>(".tunnel-layout")
    : null;
  const helixStage = root.querySelector<HTMLElement>("#helix-stage");
  const reelTypePanel = root.querySelector<HTMLElement>("#reel-type-panel");
  const manifestoSection = root.querySelector<HTMLElement>("#thesis");
  const manifestoRailFill = root.querySelector<HTMLElement>(
    "#manifesto-rail-fill"
  );
  const engageSection = root.querySelector<HTMLElement>("#offers");
  const engageStage = root.querySelector<HTMLElement>(".engage-stage");
  const deliverableRig = root.querySelector<HTMLElement>(".deliverable-rig");
  const portalPhoneStage = root.querySelector<HTMLElement>("#portal-phone-stage");
  const portalPhoneFrame = root.querySelector<HTMLElement>("#portal-phone-frame");
  const portalRingGlare = root.querySelector<HTMLElement>("#portal-ring-glare");
  const portalIgVideo = root.querySelector<HTMLVideoElement>("#portal-ig-video");

  const hasManifestFrames =
    manifest.desktop.count > 0 || manifest.mobile.count > 0;

  const reducedMotionQuery = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );
  const finePointerQuery = window.matchMedia(
    "(hover: hover) and (pointer: fine)"
  );

  const state = {
    width: 0,
    height: 0,
    dpr: 1,
    heroTarget: 0,
    heroCurrent: 0,
    heroRaw: 0,
    tunnelTarget: 0,
    tunnelCurrent: 0,
    manifestoTarget: 0,
    manifestoCurrent: 0,
    engageGlowTarget: 0,
    engageGlowCurrent: 0,
    rigTiltTargetX: 2.5,
    rigTiltTargetY: -5,
    rigTiltCurrentX: 2.5,
    rigTiltCurrentY: -5,
    portalVisible: false,
    targetY: window.scrollY || 0,
    smoothY: window.scrollY || 0,
    lastProgrammaticY: window.scrollY || 0,
    wheelActive: false,
    reducedMotion: reducedMotionQuery.matches,
    startTime: performance.now(),
    lastNow: performance.now(),
    rafId: 0,
    usingWebGL: false,
    activeVariant: "" as "" | "desktop" | "mobile",
    needsRedraw: true,
    lastDrawnIndex: -1,
    activeReelIdx: -1,
    captionX: null as number | null,
    captionY: null as number | null,
    reelCards: helixStage
      ? Array.from(helixStage.querySelectorAll<HTMLElement>(".card3"))
      : ([] as HTMLElement[]),
    reelTypeItems: reelTypePanel
      ? Array.from(
          reelTypePanel.querySelectorAll<HTMLElement>(".reel-type-item")
        )
      : ([] as HTMLElement[]),
    manifestoLines: manifestoSection
      ? Array.from(
          manifestoSection.querySelectorAll<HTMLElement>(".manifesto-line")
        )
      : ([] as HTMLElement[]),
    caches: {
      desktop: { frames: [], started: false } as FrameVariantCache,
      mobile: { frames: [], started: false } as FrameVariantCache,
    },
  };

  /* Ensure muted playback compatibility across browsers */
  for (const card of state.reelCards) {
    const vid = card.querySelector("video");
    if (vid instanceof HTMLVideoElement) {
      vid.muted = true;
    }
  }

  let destroyed = false;
  let introTimerA = 0;
  let introTimerB = 0;

  function runOpeningIntro(): void {
    window.clearTimeout(introTimerA);
    window.clearTimeout(introTimerB);

    if (state.reducedMotion) {
      root.classList.remove("is-intro-active", "is-intro-rising");
      root.classList.add("is-intro-done");
      return;
    }

    root.classList.remove("is-intro-done", "is-intro-rising");
    root.classList.add("is-intro-active");

    introTimerA = window.setTimeout(() => {
      if (destroyed) {
        return;
      }
      root.classList.remove("is-intro-active");
      root.classList.add("is-intro-rising");
    }, 680);

    introTimerB = window.setTimeout(() => {
      if (destroyed) {
        return;
      }
      root.classList.remove("is-intro-rising");
      root.classList.add("is-intro-done");
    }, 1580);
  }

  if ((window.scrollY || 0) > 120 || state.reducedMotion) {
    root.classList.remove("is-intro-active", "is-intro-rising");
    root.classList.add("is-intro-done");
  } else {
    runOpeningIntro();
  }

  function syncNavScrolled(): void {
    if (siteNav) {
      siteNav.classList.toggle("is-scrolled", (window.scrollY || 0) > 40);
    }
  }

  function updateActiveReel(reelIndex: number): void {
    state.reelCards.forEach((card, idx) => {
      card.classList.toggle("is-focal", idx === reelIndex);
    });
  }

  function syncSectionTargets(): void {
    syncNavScrolled();
    if (heroSection) {
      const rect = heroSection.getBoundingClientRect();
      const travel = Math.max(1, rect.height - window.innerHeight);
      state.heroRaw = -rect.top / travel;
      state.heroTarget = clamp01(state.heroRaw);
    }
    if (tunnelSection) {
      const rect = tunnelSection.getBoundingClientRect();
      const travel = Math.max(1, rect.height - window.innerHeight);
      state.tunnelTarget = clamp01(-rect.top / travel);
    }
    if (manifestoSection) {
      const rect = manifestoSection.getBoundingClientRect();
      const travel = Math.max(1, rect.height - window.innerHeight);
      state.manifestoTarget = clamp01(-rect.top / travel);
    }
    if (engageSection) {
      const rect = engageSection.getBoundingClientRect();
      state.engageGlowTarget = clamp01(
        (window.innerHeight * 0.92 - rect.top) /
          Math.max(1, window.innerHeight * 0.65)
      );
    }
    if (state.reducedMotion) {
      state.heroCurrent = state.heroTarget;
      state.tunnelCurrent = state.tunnelTarget;
      state.manifestoCurrent = state.manifestoTarget;
      state.engageGlowCurrent = state.engageGlowTarget;
    }
  }

  function updateManifesto(p: number): void {
    if (state.manifestoLines.length === 0) {
      return;
    }
    if (state.reducedMotion) {
      for (const line of state.manifestoLines) {
        line.style.opacity = "1";
        line.style.transform = "translate3d(0, 0, 0)";
      }
      if (manifestoRailFill) {
        manifestoRailFill.style.transform = "scaleY(1)";
      }
      return;
    }

    const count = state.manifestoLines.length;
    const focusFloat = clamp01(p) * (count - 1);
    for (let i = 0; i < count; i += 1) {
      const line = state.manifestoLines[i];
      const d = i - focusFloat;
      const activeGlow = 1 - smoothstep(0.08, 0.85, Math.abs(d));
      const baseOp = d < 0 ? 0.34 : 0.14;
      const lineOp = baseOp + (1 - baseOp) * activeGlow;
      const liftY = d > 0 ? clamp01(d) * 8 : 0;
      const zPx =
        d > 0
          ? -48 * smoothstep(0.05, 1.15, d)
          : -24 * smoothstep(0.05, 1.25, -d);
      line.style.opacity = lineOp.toFixed(3);
      line.style.transform = `translate3d(0, ${liftY.toFixed(1)}px, ${zPx.toFixed(1)}px)`;
    }
    if (manifestoRailFill) {
      const railScale = clamp(0.12 + clamp01(p) * 0.88, 0.12, 1);
      manifestoRailFill.style.transform = `scaleY(${railScale.toFixed(4)})`;
    }
  }

  function updateHeroStates(p: number): number {
    /* State A visible 0.00 -> 0.16, exits smoothly upward 0.16 -> 0.24 */
    const outA = easeBezierSmooth(clamp01((p - 0.16) / 0.08));
    const opA = 1 - outA;
    if (heroStateA) {
      heroStateA.style.opacity = opA.toFixed(3);
      heroStateA.style.transform = `translate3d(0, ${(-outA * 44).toFixed(1)}px, 0)`;
      heroStateA.style.pointerEvents = opA > 0.25 ? "auto" : "none";
      heroStateA.setAttribute("aria-hidden", opA <= 0.1 ? "true" : "false");
    }

    /* State B enters 0.22 -> 0.31, holds 0.31 -> 0.43, exits upward 0.43 -> 0.51 */
    const inB = easeBezierOut(clamp01((p - 0.22) / 0.09));
    const outB = easeBezierSmooth(clamp01((p - 0.43) / 0.08));
    const opB = inB * (1 - outB);
    const yB = (1 - inB) * 34 - outB * 52;
    if (heroStateB) {
      heroStateB.style.opacity = opB.toFixed(3);
      heroStateB.style.transform = `translate3d(0, ${yB.toFixed(1)}px, 0)`;
      heroStateB.style.pointerEvents = opB > 0.25 ? "auto" : "none";
      heroStateB.setAttribute("aria-hidden", opB <= 0.1 ? "true" : "false");
    }

    const hudP = clamp01(p / 0.5);
    const outHud = easeBezierSmooth(clamp01((p - 0.43) / 0.08));
    if (heroHud) {
      heroHud.style.opacity = (1 - outHud).toFixed(3);
      heroHud.style.transform = `translate3d(0, ${(-outHud * 18).toFixed(1)}px, 0)`;
    }

    if (heroProgressFill) {
      heroProgressFill.style.transform = `scaleX(${hudP.toFixed(4)})`;
    }
    if (heroPhaseLabel) {
      heroPhaseLabel.textContent =
        p < 0.23
          ? "PHASE 01 / 02 — SCROLL TO TRANSFORM"
          : "PHASE 02 / 02 — ENTER MONOLITH PORTAL";
    }
    if (heroPercentLabel) {
      heroPercentLabel.textContent = `${String(Math.round(hudP * 100)).padStart(2, "0")}%`;
    }
    if (heroContentShell) {
      heroContentShell.style.visibility =
        opA <= 0.004 && opB <= 0.004 ? "hidden" : "visible";
    }

    /* Keep background canvas alive through Portal Rise & Ring/iPhone Zoom */
    return 1;
  }

  function updatePortalPhone(
    portalProgress: number,
    tunnelP: number,
    isPortalActive: boolean
  ): { rigY: number; camZoom: number } {
    const cssMinDim = Math.max(
      1,
      Math.min(window.innerWidth, window.innerHeight)
    );
    const vh = Math.max(1, window.innerHeight);
    const nativePhoneH =
      window.innerWidth <= 820
        ? Math.min(vh * 0.76, 580)
        : Math.min(vh * 0.82, 660);
    const isPortrait = window.innerWidth <= window.innerHeight;
    const ringRadiusP = isPortrait ? 0.31 : 0.22;
    const restPhoneH = cssMinDim * ringRadiusP * 1.24;
    const baseScale = clamp(
      restPhoneH / Math.max(1, nativePhoneH),
      0.16,
      0.85
    );

    const rigRise = smoothstep(0.46, 0.72, portalProgress);
    const rigEase = 1 - Math.pow(1 - rigRise, 3);
    const startY = isPortrait ? -0.56 : -0.42;

    const flyRaw = smoothstep(0.72, 0.95, portalProgress);
    const zoomEase = state.reducedMotion
      ? flyRaw
      : easeBezierSmooth(clamp01(flyRaw / 0.78));
    const restYBase = isPortrait ? 0.12 : 0.09;
    const restY = restYBase * (1 - zoomEase);
    const rigY = startY + (restY - startY) * rigEase;
    const targetZoom = 1 / baseScale;
    const camZoom = 1 + (targetZoom - 1) * zoomEase;

    if (!portalPhoneStage || !portalPhoneFrame) {
      return { rigY, camZoom };
    }

    const stageStyle = portalPhoneStage.style as CSSStyleDeclaration & {
      webkitMaskImage?: string;
    };

    const phoneEnter = smoothstep(0.52, 0.62, portalProgress);
    const phoneExit = easeBezierSmooth(clamp01((tunnelP - 0.015) / 0.075));
    const phoneOp = isPortalActive ? phoneEnter * (1 - phoneExit) : 0;

    if (phoneOp <= 0.004) {
      if (state.portalVisible) {
        state.portalVisible = false;
        portalPhoneStage.style.opacity = "0";
        portalPhoneStage.style.visibility = "hidden";
      }
      stageStyle.maskImage = "";
      stageStyle.webkitMaskImage = "";
      if (portalIgVideo && !portalIgVideo.paused) {
        portalIgVideo.pause();
      }
      return { rigY, camZoom };
    }

    if (!state.portalVisible) {
      state.portalVisible = true;
      portalPhoneStage.style.visibility = "visible";
    }
    portalPhoneStage.style.opacity = phoneOp.toFixed(3);
    if (
      portalIgVideo &&
      !state.reducedMotion &&
      portalIgVideo.paused &&
      portalIgVideo.readyState >= 2
    ) {
      portalIgVideo.play().catch(() => {});
    }

    const eclipse = smoothstep(0.12, 0.44, portalProgress);
    const globeRise = smoothstep(0.46, 0.72, portalProgress);
    const riseEase = globeRise * globeRise * (3 - 2 * globeRise);
    const moonRadius = 0.72 + ((isPortrait ? 0.9 : 0.88) - 0.72) * riseEase;
    const baseSphereY = -0.95 + (-0.76 - -0.95) * eclipse;
    const sphereCenterY =
      baseSphereY + ((isPortrait ? -1.06 : -0.99) - baseSphereY) * riseEase;
    const moonZoom = 1 + (camZoom - 1) * 1.28;
    const pMoonY = rigY + (sphereCenterY - rigY) * moonZoom;
    const rMoonPx = moonRadius * moonZoom * cssMinDim;
    const cyMoonPx = vh * 0.5 - pMoonY * cssMinDim;
    const moonMask =
      cyMoonPx - rMoonPx < vh + 40
        ? `radial-gradient(circle at 50% ${cyMoonPx.toFixed(1)}px, transparent ${Math.max(0, rMoonPx - 1).toFixed(1)}px, #000 ${(rMoonPx + 2.5).toFixed(1)}px)`
        : "none";
    stageStyle.maskImage = moonMask;
    stageStyle.webkitMaskImage = moonMask;

    const curScale = baseScale * camZoom + phoneExit * 0.18;
    const offsetY = -rigY * cssMinDim;

    portalPhoneFrame.style.transform = `translate3d(0, ${offsetY.toFixed(1)}px, 0) scale(${curScale.toFixed(4)})`;

    if (portalRingGlare) {
      const glareOp = state.reducedMotion
        ? 0
        : 0.65 * (1 - smoothstep(0.15, 0.65, flyRaw));
      portalRingGlare.style.opacity = glareOp.toFixed(3);
    }

    return { rigY, camZoom };
  }

  function updateHelix3D(p: number, dt = 0.016): void {
    if (!tunnelSection || state.reelCards.length === 0) {
      return;
    }
    const rect = tunnelSection.getBoundingClientRect();
    const nearViewport =
      rect.bottom > -240 && rect.top < window.innerHeight + 240;
    if (!nearViewport && state.activeReelIdx >= 0) {
      return;
    }

    const total = state.reelCards.length;
    const leadIn = 0.85;
    const activeFloat = -leadIn + p * (total - 1 + leadIn);
    const portalEmerge = state.reducedMotion
      ? 1
      : easeBezierOut(clamp01(p / 0.14));
    const entryFade = state.reducedMotion
      ? 1
      : easeBezierOut(clamp01((p - 0.055) / 0.085));
    const panelEntry = state.reducedMotion
      ? 1
      : easeBezierOut(clamp01((p - 0.075) / 0.08));
    const nearestIdx = clamp(Math.round(activeFloat), 0, total - 1);
    if (nearestIdx !== state.activeReelIdx) {
      state.activeReelIdx = nearestIdx;
      updateActiveReel(nearestIdx);
    }

    const isMobile = window.innerWidth <= 820;

    for (let i = 0; i < total; i += 1) {
      const card = state.reelCards[i];
      const d = i - activeFloat;
      const absD = Math.abs(d);

      if (absD > 2.6 || entryFade <= 0.004) {
        card.classList.remove("is-focal");
        card.style.opacity = "0";
        card.style.pointerEvents = "none";
        const hiddenVid = card.querySelector("video");
        if (hiddenVid instanceof HTMLVideoElement && !hiddenVid.paused) {
          hiddenVid.pause();
        }
        continue;
      }

      const angle = d * (isMobile ? 1.1 : 0.96);
      let x: number;
      let y: number;
      let z: number;
      let rotY: number;
      let rotX: number;

      if (isMobile) {
        x = Math.sin(angle) * 165 * portalEmerge;
        y = d * 44 * portalEmerge;
        z = (d >= 0 ? -d * 290 : -d * 210) - (1 - portalEmerge) * 420;
        rotY = -Math.sin(angle) * 22 * portalEmerge;
        rotX = d * 3 * portalEmerge;
      } else {
        x = Math.sin(angle) * 300 * portalEmerge;
        y = (-Math.sin(d * 0.65) * 95 + d * 40) * portalEmerge;
        z = (d >= 0 ? -d * 520 : -d * 340) - (1 - portalEmerge) * 620;
        rotY = -Math.sin(angle) * 28 * portalEmerge;
        rotX = d * 4.5 * portalEmerge;
      }

      const focus = clamp01(1 - absD * 1.15);
      const exitFade = d < -0.65 ? 1 - smoothstep(-0.65, -1.5, d) : 1;
      const farFade = d > 1.55 ? 1 - smoothstep(1.55, 2.55, d) : 1;
      const opacity = clamp01(
        (0.48 + focus * 0.52) * exitFade * farFade * entryFade
      );

      const grayscale = Math.round((1 - focus) * 100);
      const brightness = (0.55 + focus * 0.45).toFixed(2);

      card.classList.toggle("is-focal", absD < 0.55 && entryFade > 0.35);
      card.style.transform =
        `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, ${z.toFixed(1)}px) ` +
        `rotateY(${rotY.toFixed(2)}deg) rotateX(${rotX.toFixed(2)}deg)`;
      card.style.opacity = opacity.toFixed(3);
      card.style.filter = `grayscale(${grayscale}%) brightness(${brightness})`;
      card.style.zIndex = String(Math.round(100 - absD * 20));
      card.style.pointerEvents = focus > 0.6 && entryFade > 0.5 ? "auto" : "none";

      const vid = card.querySelector("video");
      if (vid instanceof HTMLVideoElement) {
        const shouldPlay =
          !state.reducedMotion && absD <= 1.25 && entryFade > 0.05;
        if (shouldPlay && vid.paused) {
          vid.play().catch(() => {});
        } else if (!shouldPlay && !vid.paused) {
          vid.pause();
        }
      }
    }

    const travelY = isMobile ? 24 : 32;
    for (let i = 0; i < state.reelTypeItems.length; i += 1) {
      const item = state.reelTypeItems[i];
      const d = i - activeFloat;
      const absD = Math.abs(d);
      const itemOp = (1 - smoothstep(0.14, 0.54, absD)) * panelEntry;
      const itemY = state.reducedMotion ? 0 : clamp(d, -1, 1) * travelY;
      item.style.opacity = itemOp.toFixed(3);
      item.style.transform = `translate3d(0, ${itemY.toFixed(1)}px, 0)`;
      item.setAttribute("aria-hidden", itemOp < 0.25 ? "true" : "false");
    }

    if (reelTypePanel) {
      reelTypePanel.style.opacity = panelEntry.toFixed(3);
      if (!isMobile || !tunnelLayout) {
        if (reelTypePanel.style.transform) {
          reelTypePanel.style.transform = "";
        }
        state.captionX = null;
        state.captionY = null;
      } else {
        const activeD = nearestIdx - activeFloat;
        const activeAngle = activeD * 1.1;
        const trackX = Math.sin(activeAngle) * 52;
        const trackY = activeD * 18;

        const layoutW = tunnelLayout.clientWidth;
        const layoutH = tunnelLayout.clientHeight;
        const cardEl = state.reelCards[nearestIdx];
        const cardW = cardEl ? cardEl.offsetWidth : 220;
        const cardH = cardEl ? cardEl.offsetHeight : 390;
        const panelW = reelTypePanel.offsetWidth || 220;
        const panelH = reelTypePanel.offsetHeight || 110;

        const rawX = layoutW * 0.5 + cardW * 0.5 + 26 - panelW + trackX;
        const rawY = layoutH * 0.41 + cardH * 0.5 + 22 + trackY;
        const targetX = clamp(rawX, 16, Math.max(16, layoutW - panelW - 16));
        const targetY = clamp(rawY, 16, Math.max(16, layoutH - panelH - 16));

        if (
          state.reducedMotion ||
          state.captionX === null ||
          state.captionY === null
        ) {
          state.captionX = targetX;
          state.captionY = targetY;
        } else {
          const alpha = 1 - Math.exp(-12 * dt);
          state.captionX += (targetX - state.captionX) * alpha;
          state.captionY += (targetY - state.captionY) * alpha;
        }

        reelTypePanel.style.transform = `translate3d(${state.captionX.toFixed(1)}px, ${state.captionY.toFixed(1)}px, 0)`;
      }
    }
  }

  /* ========================================================================
   * MODE 1: Apple/Tesla ffmpeg Frame-Sequence Scrubber
   * ======================================================================== */
  function createFrameSequenceMode(): BgEngine | null {
    if (!canvas) {
      return null;
    }
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) {
      return null;
    }

    function selectVariant(): "desktop" | "mobile" {
      const isMobile =
        window.innerWidth <= 640 || window.innerHeight > window.innerWidth;
      if (isMobile && manifest.mobile.count > 0) {
        return "mobile";
      }
      if (manifest.desktop.count > 0) {
        return "desktop";
      }
      return "mobile";
    }

    function loadSingleFrame(
      variant: "desktop" | "mobile",
      zeroIdx: number
    ): Promise<void> {
      const spec = manifest[variant];
      const cache = state.caches[variant];
      if (!spec || zeroIdx < 0 || zeroIdx >= spec.count) {
        return Promise.resolve();
      }
      if (cache.frames[zeroIdx] !== undefined) {
        return Promise.resolve();
      }
      cache.frames[zeroIdx] = null;

      return new Promise((resolve) => {
        const img = new Image();
        img.decoding = "async";
        img.src = spec.pattern.replace("{index}", padFrameIndex(zeroIdx + 1));
        img.onload = () => {
          if (destroyed) {
            resolve();
            return;
          }
          if (typeof window.createImageBitmap === "function") {
            window
              .createImageBitmap(img)
              .then((bitmap) => {
                if (destroyed) {
                  bitmap.close();
                  resolve();
                  return;
                }
                cache.frames[zeroIdx] = bitmap;
                if (variant === state.activeVariant) {
                  state.needsRedraw = true;
                }
                resolve();
              })
              .catch(() => {
                cache.frames[zeroIdx] = img;
                if (variant === state.activeVariant) {
                  state.needsRedraw = true;
                }
                resolve();
              });
          } else {
            cache.frames[zeroIdx] = img;
            if (variant === state.activeVariant) {
              state.needsRedraw = true;
            }
            resolve();
          }
        };
        img.onerror = () => {
          cache.frames[zeroIdx] = false;
          resolve();
        };
      });
    }

    async function startProgressiveLoad(
      variant: "desktop" | "mobile"
    ): Promise<void> {
      const spec = manifest[variant];
      const cache = state.caches[variant];
      if (!spec || spec.count <= 0 || cache.started) {
        return;
      }
      cache.started = true;
      cache.frames = new Array(spec.count);
      await loadSingleFrame(variant, 0);

      const keyIndices: number[] = [];
      const restIndices: number[] = [];
      for (let i = 1; i < spec.count; i += 1) {
        if (i % CONFIG.keyframeStride === 0) {
          keyIndices.push(i);
        } else {
          restIndices.push(i);
        }
      }
      const ordered = keyIndices.concat(restIndices);
      for (let offset = 0; offset < ordered.length; offset += CONFIG.batchSize) {
        if (destroyed) {
          return;
        }
        const slice = ordered.slice(offset, offset + CONFIG.batchSize);
        await Promise.all(slice.map((idx) => loadSingleFrame(variant, idx)));
      }
    }

    function isDrawable(
      frame: FrameVariantCache["frames"][number]
    ): frame is ImageBitmap | HTMLImageElement {
      if (!frame) {
        return false;
      }
      const width =
        frame instanceof HTMLImageElement ? frame.naturalWidth : frame.width;
      return width > 0;
    }

    function findNearest(
      frames: FrameVariantCache["frames"],
      targetIdx: number
    ): { frame: ImageBitmap | HTMLImageElement; index: number } | null {
      const exact = frames[targetIdx];
      if (isDrawable(exact)) {
        return { frame: exact, index: targetIdx };
      }
      for (let dist = 1; dist < frames.length; dist += 1) {
        const l = targetIdx - dist;
        if (l >= 0) {
          const lf = frames[l];
          if (isDrawable(lf)) {
            return { frame: lf, index: l };
          }
        }
        const r = targetIdx + dist;
        if (r < frames.length) {
          const rf = frames[r];
          if (isDrawable(rf)) {
            return { frame: rf, index: r };
          }
        }
      }
      return null;
    }

    function onResize(): void {
      if (!canvas) {
        return;
      }
      state.dpr = Math.min(window.devicePixelRatio || 1, CONFIG.maxDpr);
      state.width = Math.max(1, Math.floor(window.innerWidth * state.dpr));
      state.height = Math.max(1, Math.floor(window.innerHeight * state.dpr));
      canvas.width = state.width;
      canvas.height = state.height;

      const nextVariant = selectVariant();
      if (nextVariant !== state.activeVariant) {
        state.activeVariant = nextVariant;
        state.lastDrawnIndex = -1;
        void startProgressiveLoad(nextVariant);
      }
      state.needsRedraw = true;
    }

    function onRender(_elapsedSec: number, scrollProgress: number): void {
      if (!ctx) {
        return;
      }
      const variant = state.activeVariant || selectVariant();
      const spec = manifest[variant];
      const cache = state.caches[variant];
      if (!spec || spec.count <= 0) {
        return;
      }
      const desiredIdx = Math.min(
        spec.count - 1,
        Math.max(0, Math.round(scrollProgress * (spec.count - 1)))
      );
      if (!state.needsRedraw && desiredIdx === state.lastDrawnIndex) {
        return;
      }
      const match = findNearest(cache.frames, desiredIdx);
      if (!match) {
        return;
      }
      if (!state.needsRedraw && match.index === state.lastDrawnIndex) {
        return;
      }

      const fw =
        match.frame instanceof HTMLImageElement
          ? match.frame.naturalWidth
          : match.frame.width;
      const fh =
        match.frame instanceof HTMLImageElement
          ? match.frame.naturalHeight
          : match.frame.height;
      const scale = Math.max(state.width / fw, state.height / fh);
      const dw = fw * scale;
      const dh = fh * scale;
      const dx = (state.width - dw) * 0.5;
      const dy = (state.height - dh) * 0.5;

      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, state.width, state.height);
      ctx.drawImage(match.frame, dx, dy, dw, dh);

      state.lastDrawnIndex = match.index;
      state.needsRedraw = false;
    }

    function destroy(): void {
      for (const variant of ["desktop", "mobile"] as const) {
        for (const frame of state.caches[variant].frames) {
          if (typeof ImageBitmap !== "undefined" && frame instanceof ImageBitmap) {
            frame.close();
          }
        }
        state.caches[variant].frames = [];
        state.caches[variant].started = false;
      }
    }

    return { onResize, onRender, destroy };
  }

  /* ========================================================================
   * MODE 2: Approved 60FPS Hardware-Texture WebGL Shader
   * Aquatico Liquid Obsidian -> SpaceX Eclipse Rim Horizon
   * ======================================================================== */
  function createSeamlessNoiseTexture(
    gl: WebGLRenderingContext,
    size: number
  ): WebGLTexture | null {
    function hashGrid(ix: number, iy: number, seed: number): number {
      const n =
        Math.imul(ix, 374761393) +
        Math.imul(iy, 668265263) +
        Math.imul(seed, 1442695041);
      let h = n ^ (n >>> 13);
      h = Math.imul(h, 1274126177);
      return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
    }

    function periodicValueNoise(
      u: number,
      v: number,
      period: number,
      seed: number
    ): number {
      const x = u * period;
      const y = v * period;
      const x0 = Math.floor(x);
      const y0 = Math.floor(y);
      const fx = x - x0;
      const fy = y - y0;
      const sx = fx * fx * (3 - 2 * fx);
      const sy = fy * fy * (3 - 2 * fy);

      const ix0 = ((x0 % period) + period) % period;
      const iy0 = ((y0 % period) + period) % period;
      const ix1 = (ix0 + 1) % period;
      const iy1 = (iy0 + 1) % period;

      const a = hashGrid(ix0, iy0, seed);
      const b = hashGrid(ix1, iy0, seed);
      const c = hashGrid(ix0, iy1, seed);
      const d = hashGrid(ix1, iy1, seed);

      return a + (b - a) * sx + (c - a) * sy + (a - b - c + d) * sx * sy;
    }

    function periodicFbm(u: number, v: number, seed: number): number {
      let sum = 0;
      sum += 0.54 * periodicValueNoise(u, v, 4, seed);
      sum += 0.28 * periodicValueNoise(u, v, 8, seed + 17);
      sum += 0.13 * periodicValueNoise(u, v, 16, seed + 53);
      sum += 0.05 * periodicValueNoise(u, v, 32, seed + 97);
      return sum;
    }

    const data = new Uint8Array(size * size * 4);
    const eps = 1 / size;
    for (let y = 0; y < size; y += 1) {
      const v = y / size;
      for (let x = 0; x < size; x += 1) {
        const u = x / size;
        const idx = (y * size + x) * 4;
        const h0 = periodicFbm(u, v, 11);
        const hx = periodicFbm((u + eps) % 1, v, 11);
        const hy = periodicFbm(u, (v + eps) % 1, 11);
        const gx = (hx - h0) / eps;
        const gy = (hy - h0) / eps;
        const grain = hashGrid(x, y, 211);

        data[idx] = Math.round(clamp01(h0) * 255);
        data[idx + 1] = Math.round(clamp01(0.5 + gx * 0.14) * 255);
        data[idx + 2] = Math.round(clamp01(0.5 + gy * 0.14) * 255);
        data[idx + 3] = Math.round(clamp01(grain) * 255);
      }
    }

    const texture = gl.createTexture();
    if (!texture) {
      return null;
    }
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      size,
      size,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      data
    );
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    return texture;
  }

  function createWebGLMode(): BgEngine | null {
    if (!canvas) {
      return null;
    }
    const gl =
      canvas.getContext("webgl2", {
        alpha: false,
        antialias: false,
        depth: false,
        stencil: false,
        powerPreference: "high-performance",
      }) ||
      canvas.getContext("webgl", {
        alpha: false,
        antialias: false,
        depth: false,
        stencil: false,
        powerPreference: "high-performance",
      });

    if (!gl) {
      return null;
    }

    const vertexSource = `
      attribute vec2 a_pos;
      void main() {
        gl_Position = vec4(a_pos, 0.0, 1.0);
      }
    `;

    const fragmentSource = `
      precision highp float;

      uniform sampler2D u_noise;
      uniform vec2 u_resolution;
      uniform float u_time;
      uniform float u_scroll;
      uniform float u_reduced;
      uniform float u_rig_y;
      uniform float u_cam_zoom;

      void main() {
        float minDim = min(u_resolution.x, u_resolution.y);
        vec2 p = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / minDim;

        float t = u_time * (1.0 - u_reduced);
        float isPortrait = step(u_resolution.x, u_resolution.y);
        float floorY = -0.18;

        /* Act 1 & 2: Liquid ocean calms & SpaceX Eclipse Rim Horizon rises */
        float calm = smoothstep(0.08, 0.40, u_scroll);
        float eclipse = smoothstep(0.12, 0.44, u_scroll);
        float seaLightWeight = 1.0 - smoothstep(0.18, 0.44, u_scroll);
        float waveAmp = mix(1.0, 0.44, calm);

        /* Act 3 & 4: Rising & zooming globe -> Ring Light rising from water -> zoom inside iPhone */
        float globeRise = smoothstep(0.46, 0.72, u_scroll);
        float riseEase = globeRise * globeRise * (3.0 - 2.0 * globeRise);

        float ringRadius = mix(0.22, 0.31, isPortrait);
        float standDrop = mix(0.35, 0.48, isPortrait);
        float camZoom = max(1.0, u_cam_zoom);
        vec2 zoomPivot = vec2(0.0, u_rig_y);
        vec2 pz = (p - zoomPivot) / camZoom + zoomPivot;
        float moonZoom = 1.0 + (camZoom - 1.0) * 1.28;
        vec2 pzMoon = (p - zoomPivot) / moonZoom + zoomPivot;

        vec2 uvA = p * vec2(0.24, 0.36) + vec2(t * 0.014, -t * 0.010 + u_scroll * 0.14);
        vec4 sA = texture2D(u_noise, uvA);
        vec2 warp = vec2(sA.r - 0.5, sA.g - 0.5);

        float seaCrest =
          0.02 +
          0.06 * sin(p.x * 1.9 - 0.35 + u_scroll * 1.4) +
          warp.x * 0.16 +
          warp.y * 0.12;
        float crestY = mix(seaCrest, floorY, calm);
        float rawMask = smoothstep(
          crestY + mix(0.44, 0.18, calm),
          crestY - mix(0.32, 0.18, calm),
          p.y
        );
        float horizonMask = rawMask * rawMask;

        vec2 grad = vec2(0.0);
        if (horizonMask > 0.002 || globeRise > 0.001) {
          vec4 s1 = texture2D(u_noise, uvA + warp * 0.18 * waveAmp);
          vec4 s2 = texture2D(
            u_noise,
            uvA * 1.75 - warp * 0.14 * waveAmp + vec2(-t * 0.009, t * 0.012 + u_scroll * 0.09)
          );
          grad = ((s1.gb - 0.5) * 2.1 + (s2.gb - 0.5) * 1.45) * waveAmp;
          grad.x += cos(p.x * 2.1 - p.y * 1.2 + warp.x * 3.0 + u_scroll * 2.2) * 0.25 * waveAmp;
          grad.y += -sin(p.x * 2.1 - p.y * 1.2 + warp.x * 3.0 + u_scroll * 2.2) * 0.14 * waveAmp;
        }

        float lum = 0.0;

        if (seaLightWeight > 0.001) {
          if (horizonMask > 0.002) {
            vec3 normal = normalize(vec3(-grad.x, -grad.y, 1.0));
            vec3 viewDir = normalize(vec3(0.0, 0.1, 1.0));
            vec3 keyLight = normalize(vec3(0.54, 0.74, 0.40));
            vec3 rimLight = normalize(vec3(-0.68, 0.42, 0.24));

            float diff = max(dot(normal, keyLight), 0.0);
            vec3 halfKey = normalize(keyLight + viewDir);
            float spec = pow(max(dot(normal, halfKey), 0.0), 46.0);
            float broadSpec = pow(max(dot(normal, halfKey), 0.0), 14.0);
            float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 3.4);
            float rim = max(dot(normal, rimLight), 0.0) * fresnel;

            float obsidianLum =
              (diff * 0.13 + broadSpec * 0.16 + spec * 0.76 + rim * 0.30) * horizonMask;

            lum += obsidianLum * seaLightWeight;
          }

          float mistSample = texture2D(
            u_noise,
            p * vec2(0.30, 0.48) + vec2(t * 0.008, -t * 0.01)
          ).r;
          float mist = mistSample * exp(-abs(p.y - (crestY - 0.04)) * 2.4) * 0.065;
          lum += mist * seaLightWeight;
        }

        if (eclipse > 0.001) {
          float waterY = mix(floorY, mix(-0.25, -0.34, isPortrait), riseEase);
          float aboveFloor = smoothstep(waterY - 0.018, waterY + 0.018, pzMoon.y);
          float belowFloor = 1.0 - aboveFloor;

          float radius = mix(0.72, mix(0.88, 0.90, isPortrait), riseEase);
          vec2 sphereCenter = vec2(
            0.0,
            mix(mix(-0.95, -0.76, eclipse), mix(-0.99, -1.06, isPortrait), riseEase)
          );
          float dist = length(pzMoon - sphereCenter);

          float outsideSphere = smoothstep(radius - 0.006, radius + 0.010, dist);
          float insideSphere = 1.0 - smoothstep(radius - 0.012, radius + 0.004, dist);
          float zenithBoost = mix(
            smoothstep(-0.26, 0.22, pzMoon.y),
            smoothstep(-0.62, 0.36, pzMoon.y),
            riseEase
          );

          float rimArc = exp(-abs(dist - radius) * mix(95.0, 110.0, riseEase)) * zenithBoost;
          float corona = exp(-max(0.0, dist - radius) * 6.5) * outsideSphere * zenithBoost * 0.26;
          float wideAtmosphere = exp(-max(0.0, dist - radius) * 2.6) * outsideSphere * zenithBoost * 0.075;

          float skyEclipse = aboveFloor * (rimArc * 0.92 + corona + wideAtmosphere);

          float floorDist = max(0.002, waterY - pzMoon.y);
          vec2 waterUv1 = vec2(pzMoon.x * 0.55, floorDist * 2.1 - t * 0.065) + vec2(t * 0.018, 0.0);
          vec2 waterUv2 = vec2(pzMoon.x * 1.15, floorDist * 3.8 + t * 0.045) - vec2(t * 0.012, 0.0);
          vec2 wGrad = ((texture2D(u_noise, waterUv1).gb - 0.5) * 1.9 + (texture2D(u_noise, waterUv2).gb - 0.5) * 1.35) * waveAmp;
          vec2 activeGrad = mix(grad, wGrad, smoothstep(0.30, 0.55, u_scroll));

          vec2 reflP = vec2(pzMoon.x, waterY + floorDist) + vec2(activeGrad.x * (0.045 + floorDist * 0.14), activeGrad.y * 0.025);
          float reflDist = length(reflP - sphereCenter);
          float reflArc = exp(-abs(reflDist - radius) * (34.0 / (1.0 + floorDist * 4.5)));
          float reflCorona = exp(-max(0.0, reflDist - radius) * 4.5) * 0.24;
          float floorDecay = exp(-floorDist * 3.2);

          vec3 floorNormal = normalize(vec3(-activeGrad.x, -activeGrad.y, 1.0));
          vec3 eclipseLightDir = normalize(vec3(-pzMoon.x * 0.9, max(0.12, floorDist + 0.1), 0.38));
          vec3 floorHalf = normalize(eclipseLightDir + vec3(0.0, 0.22, 1.0));
          float waterGlint =
            pow(max(dot(floorNormal, floorHalf), 0.0), 32.0) *
            exp(-abs(pzMoon.x) * 1.9) *
            floorDecay *
            0.38;

          float waterReflection = belowFloor * (
            (reflArc * 0.62 + reflCorona) * floorDecay +
            waterGlint
          );

          float horizonSheen = exp(-abs(pzMoon.y - waterY) * 42.0) * exp(-abs(pzMoon.x) * 1.8) * 0.14;

          /* Intense sunrise glow flaring from behind the Moon's curved crest before & as the Ring Light rises */
          float dawnActive = smoothstep(0.45, 0.55, u_scroll) * (1.0 - smoothstep(0.86, 0.98, u_scroll));
          float moonTopY = sphereCenter.y + radius;
          vec2 ringPos = vec2(0.0, u_rig_y);
          float sunProximity = exp(-max(0.0, moonTopY - (ringPos.y + ringRadius)) * 5.2);
          float crestFocus =
            exp(-pzMoon.x * pzMoon.x * 7.5) *
            smoothstep(moonTopY - 0.18, moonTopY + 0.02, pzMoon.y);
          float sunriseRim =
            exp(-abs(dist - radius) * 58.0) *
            crestFocus *
            sunProximity *
            dawnActive *
            aboveFloor *
            0.88;
          float sunriseEdgeBloom =
            exp(-abs(dist - radius) * 14.0) *
            crestFocus *
            sunProximity *
            dawnActive *
            outsideSphere *
            aboveFloor *
            0.48;
          vec2 sunOrigin = vec2(0.0, max(ringPos.y + ringRadius * 0.45, moonTopY - 0.06));
          float sunDist = length(pz - sunOrigin);
          float radialRayNoise =
            0.85 +
            0.15 * texture2D(
              u_noise,
              vec2(atan(pz.y - sunOrigin.y, pz.x + 1e-4) * 1.4 + 0.5, sunDist * 0.6 - t * 0.02)
            ).r;
          float sunriseSky =
            (exp(-sunDist * 3.2) * 0.44 + exp(-sunDist * 1.35) * 0.16) *
            radialRayNoise *
            outsideSphere *
            aboveFloor *
            sunProximity *
            dawnActive;
          float sunriseWater =
            belowFloor *
            exp(-abs(pzMoon.x + activeGrad.x * 0.16) * 3.8) *
            exp(-floorDist * 2.8) *
            sunProximity *
            dawnActive *
            0.42;

          /* Solid obsidian globe core occludes sea mist above the waterline only */
          lum *= 1.0 - insideSphere * riseEase * aboveFloor;
          lum += eclipse * (skyEclipse + waterReflection + horizonSheen) +
            (sunriseRim + sunriseEdgeBloom + sunriseSky + sunriseWater);

          /* Glowing Studio Ring Light rising from BEHIND the dark foreground Moon (perspective depth) */
          float rigVis = smoothstep(0.45, 0.52, u_scroll);
          if (rigVis > 0.001) {
            float curRingR = ringRadius;
            float ringTube = mix(0.015, 0.021, isPortrait);

            vec2 rp = pz - ringPos;
            float rDist = length(rp);
            float ringEdge = abs(rDist - curRingR);

            float ringCore = smoothstep(ringTube, ringTube * 0.28, ringEdge) * 0.98;
            float ringBezelRim = exp(-abs(ringEdge - ringTube * 1.15) * 240.0) * 0.32;
            float ringHalo =
              exp(-max(0.0, ringEdge - ringTube * 0.45) * 9.0) * 0.46 +
              exp(-max(0.0, ringEdge - ringTube * 0.45) * 2.8) * 0.14;

            /* Clean central phone mount neck + vertical mast plunging behind the Moon into water */
            float standBot = waterY - ringPos.y;
            float stemHalfW = mix(0.0065, 0.0085, isPortrait);
            float clampNeck =
              smoothstep(stemHalfW, stemHalfW * 0.32, abs(rp.x)) *
              step(-curRingR + ringTube * 0.4, rp.y) *
              step(rp.y, -curRingR * 0.54);
            float standPole =
              smoothstep(stemHalfW * 1.15, stemHalfW * 0.38, abs(rp.x)) *
              step(standBot, rp.y) *
              step(rp.y, -curRingR + ringTube * 0.2);

            float standMetalMask = clamp(max(clampNeck, standPole), 0.0, 1.0);

            /* Occlude Ring Light & mast behind the foreground obsidian Moon, leaving subtle halo spill */
            float ringSkyMask = aboveFloor * outsideSphere;
            float haloMoonWrap = mix(
              outsideSphere,
              1.0,
              0.14 * exp(-max(0.0, radius - dist) * 28.0)
            );

            /* Backlit metallic stem ambiented into the lunar sunrise glow & Ring Light halo */
            float moonRimProx = exp(-max(0.0, dist - radius) * 18.0);
            float bgBright = clamp(max(lum, ringHalo * aboveFloor), 0.0, 1.0);
            float edgeNorm = clamp(abs(rp.x) / max(stemHalfW, 1e-4), 0.0, 1.0);
            float cylRim = edgeNorm * edgeNorm;
            float stemCore = mix(0.16 + bgBright * 0.44, bgBright, moonRimProx * 0.86);
            float stemLum = clamp(stemCore + cylRim * (0.24 + bgBright * 0.34), 0.0, 1.0);
            float stemMask = standMetalMask * ringSkyMask * rigVis;

            /* Live shimmering liquid water reflection of the rising glowing ring light below waterY */
            vec2 ringReflP =
              vec2(pzMoon.x, waterY + floorDist) +
              vec2(activeGrad.x * (0.045 + floorDist * 0.24), activeGrad.y * 0.03) -
              ringPos;
            float ringReflDist = abs(length(ringReflP) - curRingR);
            float ringWaterArc = exp(-ringReflDist * (26.0 / (1.0 + floorDist * 5.0))) * exp(-floorDist * 2.4) * 0.68;
            float ringWaterHalo = exp(-max(0.0, ringReflDist) * 4.2) * exp(-floorDist * 3.0) * 0.26;
            float ringRippleGlint =
              pow(max(dot(floorNormal, normalize(vec3(-pzMoon.x * 1.2, max(0.08, floorDist + 0.08), 0.34))), 0.0), 28.0) *
              exp(-floorDist * 2.6) *
              0.46;
            float ringWaterReflection =
              belowFloor *
              smoothstep(0.48, 0.62, u_scroll) *
              (ringWaterArc + ringWaterHalo + ringRippleGlint);

            float portalExitFade = 1.0 - smoothstep(0.88, 0.99, u_scroll);
            float rigAbove =
              (ringCore + ringBezelRim) * ringSkyMask +
              ringHalo * aboveFloor * haloMoonWrap;
            float rigLum = (rigAbove + ringWaterReflection) * rigVis * portalExitFade;

            lum = mix(lum, stemLum, stemMask * (1.0 - moonRimProx * 0.55));
            lum = mix(lum, max(lum, rigLum), rigVis);
            lum *= portalExitFade;
          }
        }

        float grain = texture2D(
          u_noise,
          gl_FragCoord.xy / 256.0 + vec2(fract(u_time * 7.3), fract(u_time * 11.1))
        ).a - 0.5;
        lum = clamp(lum + grain * 0.028, 0.0, 1.0);

        gl_FragColor = vec4(vec3(lum), 1.0);
      }
    `;

    function compileShader(type: number, source: string): WebGLShader | null {
      if (!gl) {
        return null;
      }
      const shader = gl.createShader(type);
      if (!shader) {
        return null;
      }
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    }

    const vs = compileShader(gl.VERTEX_SHADER, vertexSource);
    const fs = compileShader(gl.FRAGMENT_SHADER, fragmentSource);
    if (!vs || !fs) {
      if (vs) gl.deleteShader(vs);
      if (fs) gl.deleteShader(fs);
      return null;
    }

    const program = gl.createProgram();
    if (!program) {
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      return null;
    }
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      return null;
    }

    const noiseTex = createSeamlessNoiseTexture(gl, 256);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );

    const aPos = gl.getAttribLocation(program, "a_pos");
    const uNoise = gl.getUniformLocation(program, "u_noise");
    const uResolution = gl.getUniformLocation(program, "u_resolution");
    const uTime = gl.getUniformLocation(program, "u_time");
    const uScroll = gl.getUniformLocation(program, "u_scroll");
    const uReduced = gl.getUniformLocation(program, "u_reduced");
    const uRigY = gl.getUniformLocation(program, "u_rig_y");
    const uCamZoom = gl.getUniformLocation(program, "u_cam_zoom");

    state.usingWebGL = true;

    function onResize(): void {
      if (!canvas) {
        return;
      }
      const cssW = Math.max(1, window.innerWidth);
      const cssH = Math.max(1, window.innerHeight);
      const targetW = Math.max(
        1,
        Math.min(Math.round(cssW * CONFIG.webglScale), CONFIG.maxWebGLWidth)
      );
      const scale = targetW / cssW;
      state.dpr = scale;
      state.width = targetW;
      state.height = Math.max(1, Math.round(cssH * scale));
      canvas.width = state.width;
      canvas.height = state.height;
    }

    function onRender(
      elapsedSec: number,
      scrollProgress: number,
      rigY = 0.04,
      camZoom = 1.0
    ): void {
      if (!gl) {
        return;
      }
      gl.viewport(0, 0, state.width, state.height);
      gl.useProgram(program);

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, noiseTex);
      gl.uniform1i(uNoise, 0);

      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.enableVertexAttribArray(aPos);
      gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

      gl.uniform2f(uResolution, state.width, state.height);
      gl.uniform1f(uTime, elapsedSec);
      gl.uniform1f(uScroll, scrollProgress);
      gl.uniform1f(uReduced, state.reducedMotion ? 1.0 : 0.0);
      gl.uniform1f(uRigY, rigY);
      gl.uniform1f(uCamZoom, camZoom);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
    }

    function destroy(): void {
      if (!gl) {
        return;
      }
      if (noiseTex) {
        gl.deleteTexture(noiseTex);
      }
      if (buffer) {
        gl.deleteBuffer(buffer);
      }
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    }

    return { onResize, onRender, destroy };
  }

  /* ========================================================================
   * Bootstrap Dual-Mode Engine + Smooth Scroll + 3D Choreography Loop
   * ======================================================================== */
  const bgEngine = hasManifestFrames
    ? createFrameSequenceMode()
    : createWebGLMode();

  if (bgEngine) {
    bgEngine.onResize();
  }

  syncSectionTargets();
  state.heroCurrent = state.heroTarget;
  state.tunnelCurrent = state.tunnelTarget;
  state.manifestoCurrent = state.manifestoTarget;
  updateHeroStates(state.heroCurrent);
  updateHelix3D(state.tunnelCurrent);
  updateManifesto(state.manifestoCurrent);

  /* Smooth Anchor Jump Compatible With Inertial Scroll */
  const anchors = Array.from(
    root.querySelectorAll<HTMLAnchorElement>('a[href^="#"]')
  );
  const anchorListeners: Array<{
    el: HTMLAnchorElement;
    handler: (event: MouseEvent) => void;
  }> = [];

  for (const anchor of anchors) {
    const handler = (event: MouseEvent) => {
      const href = anchor.getAttribute("href");
      if (!href || href === "#") {
        return;
      }
      const targetEl = root.querySelector<HTMLElement>(href);
      if (!targetEl) {
        return;
      }
      event.preventDefault();
      let rawDest = targetEl.getBoundingClientRect().top + (window.scrollY || 0);
      if (targetEl.id === "tunnel") {
        const travel = Math.max(0, targetEl.offsetHeight - window.innerHeight);
        const totalCards = Math.max(1, state.reelCards.length - 1);
        rawDest += Math.round(travel * (0.85 / (totalCards + 0.85)));
      }
      const destY = clamp(rawDest, 0, getMaxScroll());
      if (state.reducedMotion) {
        state.wheelActive = false;
        window.scrollTo(0, destY);
        syncSectionTargets();
        return;
      }
      state.smoothY = window.scrollY || 0;
      state.targetY = destY;
      state.wheelActive = true;
    };
    anchor.addEventListener("click", handler);
    anchorListeners.push({ el: anchor, handler });
  }

  const onResizeWindow = () => {
    if (bgEngine) {
      bgEngine.onResize();
    }
    syncSectionTargets();
    updateHelix3D(state.tunnelCurrent);
  };
  window.addEventListener("resize", onResizeWindow, { passive: true });

  const onWheelWindow = (event: WheelEvent) => {
    if (event.ctrlKey || state.reducedMotion) {
      return;
    }
    const maxScroll = getMaxScroll();
    if (maxScroll <= 0) {
      return;
    }

    event.preventDefault();

    let delta = event.deltaY;
    if (event.deltaMode === 1) {
      delta *= 36;
    } else if (event.deltaMode === 2) {
      delta *= window.innerHeight;
    }

    if (!state.wheelActive) {
      state.smoothY = window.scrollY || 0;
      state.targetY = state.smoothY;
      state.wheelActive = true;
    }

    state.targetY = clamp(state.targetY + delta, 0, maxScroll);
  };
  window.addEventListener("wheel", onWheelWindow, { passive: false });

  const onScrollWindow = () => {
    const y = window.scrollY || 0;
    if (state.wheelActive) {
      if (Math.abs(y - state.lastProgrammaticY) <= 2) {
        return;
      }
      state.wheelActive = false;
    }
    state.targetY = y;
    state.smoothY = y;
    syncSectionTargets();
  };
  window.addEventListener("scroll", onScrollWindow, { passive: true });

  const onEngagePointerMove = (event: PointerEvent) => {
    if (!engageStage || state.reducedMotion || !finePointerQuery.matches) {
      return;
    }
    const rect = engageStage.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) {
      return;
    }
    const nx = clamp((event.clientX - rect.left) / rect.width - 0.5, -0.5, 0.5);
    const ny = clamp((event.clientY - rect.top) / rect.height - 0.5, -0.5, 0.5);
    state.rigTiltTargetY = -5 + nx * 10;
    state.rigTiltTargetX = 2.5 - ny * 7;
  };
  const onEngagePointerLeave = () => {
    state.rigTiltTargetX = 2.5;
    state.rigTiltTargetY = -5;
  };
  if (engageStage) {
    engageStage.addEventListener("pointermove", onEngagePointerMove, {
      passive: true,
    });
    engageStage.addEventListener("pointerleave", onEngagePointerLeave, {
      passive: true,
    });
  }

  const onReducedMotionChange = (event: MediaQueryListEvent) => {
    state.reducedMotion = event.matches;
    if (state.reducedMotion) {
      state.wheelActive = false;
      state.heroCurrent = state.heroTarget;
      state.tunnelCurrent = state.tunnelTarget;
      state.manifestoCurrent = state.manifestoTarget;
      state.engageGlowCurrent = state.engageGlowTarget;
      state.rigTiltTargetX = 0;
      state.rigTiltTargetY = 0;
      state.rigTiltCurrentX = 0;
      state.rigTiltCurrentY = 0;
      state.needsRedraw = true;
      root.classList.remove("is-intro-active", "is-intro-rising");
      root.classList.add("is-intro-done");
      if (deliverableRig) {
        deliverableRig.style.transform = "";
      }
      updateManifesto(state.manifestoCurrent);
    }
  };
  reducedMotionQuery.addEventListener("change", onReducedMotionChange);

  function tick(now: number): void {
    state.rafId = 0;
    if (destroyed || document.hidden) {
      return;
    }

    const dt = Math.min(0.05, Math.max(0.001, (now - state.lastNow) * 0.001));
    state.lastNow = now;

    if (state.wheelActive && !state.reducedMotion) {
      const wheelAlpha = 1 - Math.exp(-CONFIG.wheelInertiaSpeed * dt);
      state.smoothY += (state.targetY - state.smoothY) * wheelAlpha;

      const settled = Math.abs(state.targetY - state.smoothY) < 0.35;
      if (settled) {
        state.smoothY = state.targetY;
      }

      state.lastProgrammaticY = state.smoothY;
      window.scrollTo(0, state.smoothY);
      syncSectionTargets();

      if (settled) {
        state.wheelActive = false;
      }
    }

    if (!state.reducedMotion) {
      const heroAlpha = 1 - Math.exp(-CONFIG.smoothScrollSpeed * dt);
      const tunnelAlpha = 1 - Math.exp(-CONFIG.tunnelSmoothSpeed * dt);
      const manifestoAlpha = 1 - Math.exp(-CONFIG.manifestoSmoothSpeed * dt);
      state.heroCurrent += (state.heroTarget - state.heroCurrent) * heroAlpha;
      state.tunnelCurrent +=
        (state.tunnelTarget - state.tunnelCurrent) * tunnelAlpha;
      state.manifestoCurrent +=
        (state.manifestoTarget - state.manifestoCurrent) * manifestoAlpha;
      state.engageGlowCurrent +=
        (state.engageGlowTarget - state.engageGlowCurrent) * manifestoAlpha;
    } else {
      state.heroCurrent = state.heroTarget;
      state.tunnelCurrent = state.tunnelTarget;
      state.manifestoCurrent = state.manifestoTarget;
      state.engageGlowCurrent = state.engageGlowTarget;
    }

    if (deliverableRig) {
      if (state.reducedMotion) {
        if (deliverableRig.style.transform) {
          deliverableRig.style.transform = "";
        }
      } else {
        const tiltAlpha = 1 - Math.exp(-10 * dt);
        state.rigTiltCurrentX +=
          (state.rigTiltTargetX - state.rigTiltCurrentX) * tiltAlpha;
        state.rigTiltCurrentY +=
          (state.rigTiltTargetY - state.rigTiltCurrentY) * tiltAlpha;
        if (
          Math.abs(state.rigTiltCurrentX - 2.5) > 0.02 ||
          Math.abs(state.rigTiltCurrentY + 5) > 0.02
        ) {
          deliverableRig.style.transform = `rotateX(${state.rigTiltCurrentX.toFixed(2)}deg) rotateY(${state.rigTiltCurrentY.toFixed(2)}deg)`;
        } else if (deliverableRig.style.transform) {
          deliverableRig.style.transform = "";
        }
      }
    }

    updateHeroStates(state.heroCurrent);
    const portalProgress =
      state.heroCurrent * 0.88 + clamp01(state.tunnelCurrent / 0.14) * 0.12;
    const heroPortalBgOp =
      1 - easeBezierSmooth(clamp01((state.tunnelCurrent - 0.01) / 0.12));
    const engageBgOp = state.engageGlowCurrent * 0.44;
    const combinedBgOp = clamp01(Math.max(heroPortalBgOp, engageBgOp));
    if (bgStage && !root.classList.contains("is-intro-active")) {
      bgStage.style.opacity =
        combinedBgOp >= 0.999 ? "" : combinedBgOp.toFixed(3);
    }
    const isPortalActive = heroPortalBgOp >= engageBgOp;
    const { rigY, camZoom } = updatePortalPhone(
      portalProgress,
      state.tunnelCurrent,
      isPortalActive
    );
    if (bgEngine && combinedBgOp > 0.005) {
      if (isPortalActive) {
        bgEngine.onRender(
          (now - state.startTime) * 0.001,
          portalProgress,
          rigY,
          camZoom
        );
      } else {
        bgEngine.onRender(
          (now - state.startTime) * 0.001,
          0.36 + state.engageGlowCurrent * 0.08,
          0.04,
          1.0
        );
      }
    }

    updateHelix3D(state.tunnelCurrent, dt);
    updateManifesto(state.manifestoCurrent);

    state.rafId = window.requestAnimationFrame(tick);
  }

  const onVisibilityChange = () => {
    if (document.hidden) {
      if (state.rafId) {
        window.cancelAnimationFrame(state.rafId);
        state.rafId = 0;
      }
    } else if (!destroyed && !state.rafId) {
      state.lastNow = performance.now();
      state.rafId = window.requestAnimationFrame(tick);
    }
  };
  document.addEventListener("visibilitychange", onVisibilityChange);

  state.rafId = window.requestAnimationFrame(tick);

  return {
    replayIntro() {
      state.wheelActive = false;
      state.targetY = 0;
      state.smoothY = 0;
      window.scrollTo(0, 0);
      syncSectionTargets();
      state.heroCurrent = 0;
      state.tunnelCurrent = 0;
      state.manifestoCurrent = 0;
      state.engageGlowCurrent = 0;
      runOpeningIntro();
    },
    destroy() {
      if (destroyed) {
        return;
      }
      destroyed = true;
      window.clearTimeout(introTimerA);
      window.clearTimeout(introTimerB);
      if (state.rafId) {
        window.cancelAnimationFrame(state.rafId);
        state.rafId = 0;
      }
      if (engageStage) {
        engageStage.removeEventListener("pointermove", onEngagePointerMove);
        engageStage.removeEventListener("pointerleave", onEngagePointerLeave);
      }
      for (const { el, handler } of anchorListeners) {
        el.removeEventListener("click", handler);
      }
      window.removeEventListener("resize", onResizeWindow);
      window.removeEventListener("wheel", onWheelWindow);
      window.removeEventListener("scroll", onScrollWindow);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      reducedMotionQuery.removeEventListener("change", onReducedMotionChange);
      for (const card of state.reelCards) {
        const vid = card.querySelector("video");
        if (vid instanceof HTMLVideoElement) {
          vid.pause();
        }
      }
      if (portalIgVideo) {
        portalIgVideo.pause();
      }
      bgEngine?.destroy();
    },
  };
}
