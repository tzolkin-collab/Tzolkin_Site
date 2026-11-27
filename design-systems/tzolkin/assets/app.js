(() => {
  "use strict";

  const CONFIG = {
    smoothScrollSpeed: 16.0,
    tunnelSmoothSpeed: 13.0,
    wheelInertiaSpeed: 12.0,
    maxDpr: 2,
    webglScale: 0.85,
    maxWebGLWidth: 1280,
    keyframeStride: 8,
    batchSize: 12,
  };

  const canvas = document.getElementById("bg-canvas");
  const bgStage = document.getElementById("bg-stage");
  const heroSection = document.getElementById("show");
  const heroStateA = document.getElementById("hero-state-a");
  const heroStateB = document.getElementById("hero-state-b");
  const heroProgressFill = document.getElementById("hero-progress-fill");
  const heroPhaseLabel = document.getElementById("hero-phase-label");
  const heroPercentLabel = document.getElementById("hero-percent-label");
  const heroHud = document.querySelector(".hero-hud");
  const tunnelSection = document.getElementById("tunnel");
  const tunnelLayout = tunnelSection
    ? tunnelSection.querySelector(".tunnel-layout")
    : null;
  const helixStage = document.getElementById("helix-stage");
  const reelTypePanel = document.getElementById("reel-type-panel");
  const replayIntroBtn = document.getElementById("replay-intro");
  const navMenuBtn = document.getElementById("nav-menu-btn");
  const navDrawer = document.getElementById("nav-drawer");

  const manifest = window.TZOLKIN_FRAMES || {
    desktop: { count: 0, pattern: "assets/frames/desktop/frame-{index}.webp" },
    mobile: { count: 0, pattern: "assets/frames/mobile/frame-{index}.webp" },
  };

  const hasManifestFrames =
    (manifest.desktop && manifest.desktop.count > 0) ||
    (manifest.mobile && manifest.mobile.count > 0);

  const reducedMotionQuery = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
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
    targetY: window.scrollY || 0,
    smoothY: window.scrollY || 0,
    lastProgrammaticY: window.scrollY || 0,
    wheelActive: false,
    reducedMotion: reducedMotionQuery.matches,
    startTime: performance.now(),
    lastNow: performance.now(),
    rafId: 0,
    usingWebGL: false,
    activeVariant: "",
    needsRedraw: true,
    lastDrawnIndex: -1,
    activeReelIdx: -1,
    activeHook: "A",
    captionX: null,
    captionY: null,
    reelCards: [],
    reelTypeItems: [],
    caches: {
      desktop: { frames: [], started: false },
      mobile: { frames: [], started: false },
    },
  };

  function clamp(value, min, max) {
    return value < min ? min : value > max ? max : value;
  }

  function clamp01(value) {
    return clamp(value, 0, 1);
  }

  function smoothstep(edge0, edge1, x) {
    const t = clamp01((x - edge0) / (edge1 - edge0));
    return t * t * (3 - 2 * t);
  }

  function cubicBezier(x1, y1, x2, y2, progress) {
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

  function easeBezierOut(t) {
    return cubicBezier(0.22, 1, 0.36, 1, t);
  }

  function easeBezierSmooth(t) {
    return cubicBezier(0.4, 0, 0.2, 1, t);
  }

  function getMaxScroll() {
    return Math.max(
      0,
      document.documentElement.scrollHeight - window.innerHeight
    );
  }

  function padFrameIndex(index) {
    return String(index).padStart(4, "0");
  }

  /* ========================================================================
   * BEAT 0: Automatic Opening Intro Sequence
   * ======================================================================== */
  let introTimerA = 0;
  let introTimerB = 0;

  function runOpeningIntro() {
    window.clearTimeout(introTimerA);
    window.clearTimeout(introTimerB);

    if (state.reducedMotion) {
      document.body.classList.remove("is-intro-active", "is-intro-rising");
      document.body.classList.add("is-intro-done");
      return;
    }

    document.body.classList.remove("is-intro-done", "is-intro-rising");
    document.body.classList.add("is-intro-active");

    introTimerA = window.setTimeout(() => {
      document.body.classList.remove("is-intro-active");
      document.body.classList.add("is-intro-rising");
    }, 680);

    introTimerB = window.setTimeout(() => {
      document.body.classList.remove("is-intro-rising");
      document.body.classList.add("is-intro-done");
    }, 1580);
  }

  runOpeningIntro();

  if (replayIntroBtn) {
    replayIntroBtn.addEventListener("click", () => {
      state.wheelActive = false;
      state.targetY = 0;
      state.smoothY = 0;
      state.lastProgrammaticY = 0;
      window.scrollTo(0, 0);
      syncSectionTargets();
      state.heroCurrent = 0;
      state.tunnelCurrent = 0;
      if (bgStage) {
        bgStage.style.opacity = "";
      }
      runOpeningIntro();
    });
  }

  /* Mobile Drawer Toggle */
  if (navMenuBtn && navDrawer) {
    navMenuBtn.addEventListener("click", () => {
      const open = navMenuBtn.getAttribute("aria-expanded") === "true";
      navMenuBtn.setAttribute("aria-expanded", String(!open));
      navDrawer.hidden = open;
    });

    navDrawer.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navMenuBtn.setAttribute("aria-expanded", "false");
        navDrawer.hidden = true;
      });
    });
  }

  /* Smooth Anchor Jump Compatible With Inertial Scroll */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (event) => {
      const href = anchor.getAttribute("href");
      if (!href || href === "#") {
        return;
      }
      const targetEl = document.querySelector(href);
      if (!targetEl) {
        return;
      }
      event.preventDefault();
      let rawDest = targetEl.getBoundingClientRect().top + (window.scrollY || 0);
      if (targetEl.id === "tunnel") {
        const travel = Math.max(0, targetEl.offsetHeight - window.innerHeight);
        const totalCards = Math.max(1, state.reelCards.length - 1);
        rawDest += Math.round(travel * (1.35 / (totalCards + 1.35)));
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
    });
  });

  /* ========================================================================
   * Bind 3D Helical Video Tunnel Cards (.card3 rendered in HTML)
   * ======================================================================== */
  state.reelCards = helixStage
    ? Array.from(helixStage.querySelectorAll(".card3"))
    : [];
  state.reelTypeItems = reelTypePanel
    ? Array.from(reelTypePanel.querySelectorAll(".reel-type-item"))
    : [];

  const revealTargets = Array.from(document.querySelectorAll("[data-reveal]"));
  if (revealTargets.length > 0) {
    if (state.reducedMotion || !("IntersectionObserver" in window)) {
      revealTargets.forEach((el) => el.classList.add("is-revealed"));
    } else {
      const revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-revealed");
              revealObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.14 }
      );
      revealTargets.forEach((el) => revealObserver.observe(el));
    }
  }

  function updateActiveReel(reelIndex) {
    state.reelCards.forEach((card, idx) => {
      card.classList.toggle("is-focal", idx === reelIndex);
    });
  }

  /* ========================================================================
   * Section Progress Computation (Hero Runway & 3D Tunnel Runway)
   * ======================================================================== */
  function syncSectionTargets() {
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
    if (state.reducedMotion) {
      state.heroCurrent = state.heroTarget;
      state.tunnelCurrent = state.tunnelTarget;
    }
  }

  function updateHeroStates(p) {
    /* State A visible 0.0 -> 0.26, exits smoothly 0.26 -> 0.39 */
    const outA = easeBezierSmooth(clamp01((p - 0.26) / 0.13));
    const opA = 1 - outA;
    if (heroStateA) {
      heroStateA.style.opacity = opA.toFixed(3);
      heroStateA.style.transform = `translate3d(0, ${(-outA * 44).toFixed(1)}px, 0)`;
      heroStateA.style.pointerEvents = opA > 0.25 ? "auto" : "none";
      heroStateA.setAttribute("aria-hidden", opA <= 0.1 ? "true" : "false");
    }

    /* State B enters 0.36 -> 0.50, holds 0.50 -> 0.72, exits upward 0.72 -> 0.83 */
    const inB = easeBezierOut(clamp01((p - 0.36) / 0.14));
    const outB = easeBezierSmooth(clamp01((p - 0.72) / 0.11));
    const opB = inB * (1 - outB);
    const yB = (1 - inB) * 34 - outB * 52;
    if (heroStateB) {
      heroStateB.style.opacity = opB.toFixed(3);
      heroStateB.style.transform = `translate3d(0, ${yB.toFixed(1)}px, 0)`;
      heroStateB.style.pointerEvents = opB > 0.25 ? "auto" : "none";
      heroStateB.setAttribute("aria-hidden", opB <= 0.1 ? "true" : "false");
    }

    const hudP = clamp01(p / 0.76);
    const outHud = easeBezierSmooth(clamp01((p - 0.72) / 0.1));
    if (heroHud) {
      heroHud.style.opacity = (1 - outHud).toFixed(3);
      heroHud.style.transform = `translate3d(0, ${(-outHud * 18).toFixed(1)}px, 0)`;
    }

    if (heroProgressFill) {
      heroProgressFill.style.transform = `scaleX(${hudP.toFixed(4)})`;
    }
    if (heroPhaseLabel) {
      heroPhaseLabel.textContent =
        p < 0.38
          ? "PHASE 01 / 02 — SCROLL TO TRANSFORM"
          : "PHASE 02 / 02 — RELEASE TO 3D TUNNEL";
    }
    if (heroPercentLabel) {
      heroPercentLabel.textContent = `${String(Math.round(hudP * 100)).padStart(2, "0")}%`;
    }

    /* Keep Hero Eclipse pinned, then dissolve smoothly to pure black 0.78 -> 0.98 */
    if (bgStage && !document.body.classList.contains("is-intro-active")) {
      const fadeOut = easeBezierSmooth(clamp01((p - 0.78) / 0.2));
      const bgOp = 1 - fadeOut;
      bgStage.style.opacity = fadeOut <= 0.001 ? "" : bgOp.toFixed(3);
      return bgOp;
    }
    return 1;
  }

  function updateHelix3D(p, dt = 0.016) {
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
    const leadIn = 1.35;
    const activeFloat = -leadIn + p * (total - 1 + leadIn);
    const entryFade = state.reducedMotion
      ? 1
      : easeBezierOut(clamp01(p / 0.13));
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
      let x;
      let y;
      let z;
      let rotY;
      let rotX;

      if (isMobile) {
        x = Math.sin(angle) * 165;
        y = d * 44;
        z = d >= 0 ? -d * 290 : -d * 210;
        rotY = -Math.sin(angle) * 22;
        rotX = d * 3;
      } else {
        x = Math.sin(angle) * 300;
        y = -Math.sin(d * 0.65) * 95 + d * 40;
        z = d >= 0 ? -d * 520 : -d * 340;
        rotY = -Math.sin(angle) * 28;
        rotX = d * 4.5;
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
      const itemOp = (1 - smoothstep(0.14, 0.54, absD)) * entryFade;
      const itemY = state.reducedMotion ? 0 : clamp(d, -1, 1) * travelY;
      item.style.opacity = itemOp.toFixed(3);
      item.style.transform = `translate3d(0, ${itemY.toFixed(1)}px, 0)`;
      item.setAttribute("aria-hidden", itemOp < 0.25 ? "true" : "false");
    }

    if (reelTypePanel) {
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

        if (state.reducedMotion || state.captionX === null) {
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
  function createFrameSequenceMode() {
    if (!(canvas instanceof HTMLCanvasElement)) {
      return null;
    }
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) {
      return null;
    }

    function selectVariant() {
      const isMobile =
        window.innerWidth <= 640 || window.innerHeight > window.innerWidth;
      if (isMobile && manifest.mobile && manifest.mobile.count > 0) {
        return "mobile";
      }
      if (manifest.desktop && manifest.desktop.count > 0) {
        return "desktop";
      }
      return "mobile";
    }

    function loadSingleFrame(variant, zeroIdx) {
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
          if (typeof window.createImageBitmap === "function") {
            window
              .createImageBitmap(img)
              .then((bitmap) => {
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

    async function startProgressiveLoad(variant) {
      const spec = manifest[variant];
      const cache = state.caches[variant];
      if (!spec || spec.count <= 0 || cache.started) {
        return;
      }
      cache.started = true;
      cache.frames = new Array(spec.count);
      await loadSingleFrame(variant, 0);

      const keyIndices = [];
      const restIndices = [];
      for (let i = 1; i < spec.count; i += 1) {
        if (i % CONFIG.keyframeStride === 0) {
          keyIndices.push(i);
        } else {
          restIndices.push(i);
        }
      }
      const ordered = keyIndices.concat(restIndices);
      for (let offset = 0; offset < ordered.length; offset += CONFIG.batchSize) {
        const slice = ordered.slice(offset, offset + CONFIG.batchSize);
        await Promise.all(slice.map((idx) => loadSingleFrame(variant, idx)));
      }
    }

    function isDrawable(frame) {
      if (!frame) {
        return false;
      }
      return (frame.naturalWidth || frame.width || 0) > 0;
    }

    function findNearest(frames, targetIdx) {
      if (isDrawable(frames[targetIdx])) {
        return { frame: frames[targetIdx], index: targetIdx };
      }
      for (let dist = 1; dist < frames.length; dist += 1) {
        const l = targetIdx - dist;
        if (l >= 0 && isDrawable(frames[l])) {
          return { frame: frames[l], index: l };
        }
        const r = targetIdx + dist;
        if (r < frames.length && isDrawable(frames[r])) {
          return { frame: frames[r], index: r };
        }
      }
      return null;
    }

    function onResize() {
      state.dpr = Math.min(window.devicePixelRatio || 1, CONFIG.maxDpr);
      state.width = Math.max(1, Math.floor(window.innerWidth * state.dpr));
      state.height = Math.max(1, Math.floor(window.innerHeight * state.dpr));
      canvas.width = state.width;
      canvas.height = state.height;

      const nextVariant = selectVariant();
      if (nextVariant !== state.activeVariant) {
        state.activeVariant = nextVariant;
        state.lastDrawnIndex = -1;
        startProgressiveLoad(nextVariant);
      }
      state.needsRedraw = true;
    }

    function onRender(_elapsedSec, scrollProgress) {
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

      const fw = match.frame.naturalWidth || match.frame.width;
      const fh = match.frame.naturalHeight || match.frame.height;
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

    return { onResize, onRender };
  }

  /* ========================================================================
   * MODE 2: Approved 60FPS Hardware-Texture WebGL Shader
   * Aquatico Liquid Obsidian -> SpaceX Eclipse Rim Horizon
   * ======================================================================== */
  function createSeamlessNoiseTexture(gl, size) {
    function hashGrid(ix, iy, seed) {
      const n =
        Math.imul(ix, 374761393) +
        Math.imul(iy, 668265263) +
        Math.imul(seed, 1442695041);
      let h = n ^ (n >>> 13);
      h = Math.imul(h, 1274126177);
      return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
    }

    function periodicValueNoise(u, v, period, seed) {
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

    function periodicFbm(u, v, seed) {
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

  function createWebGLMode() {
    if (!(canvas instanceof HTMLCanvasElement)) {
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

      void main() {
        float minDim = min(u_resolution.x, u_resolution.y);
        vec2 p = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / minDim;

        float t = u_time * (1.0 - u_reduced);
        float floorY = -0.18;

        float calm = smoothstep(0.15, 0.82, u_scroll);
        float eclipse = smoothstep(0.22, 0.96, u_scroll);
        float seaLightWeight = 1.0 - smoothstep(0.35, 0.94, u_scroll);
        float waveAmp = mix(1.0, 0.28, calm);

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
        if (horizonMask > 0.002) {
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
          float aboveFloor = smoothstep(floorY - 0.045, floorY + 0.045, p.y);
          float belowFloor = 1.0 - aboveFloor;

          float radius = 0.72;
          vec2 sphereCenter = vec2(0.0, mix(-0.95, -0.76, eclipse));
          float dist = length(p - sphereCenter);

          float outsideSphere = smoothstep(radius - 0.006, radius + 0.010, dist);
          float zenithBoost = smoothstep(-0.26, 0.22, p.y);

          float rimArc = exp(-abs(dist - radius) * 95.0) * zenithBoost;
          float corona = exp(-max(0.0, dist - radius) * 6.5) * outsideSphere * zenithBoost * 0.26;
          float wideAtmosphere = exp(-max(0.0, dist - radius) * 2.6) * outsideSphere * zenithBoost * 0.075;

          float skyEclipse = aboveFloor * (rimArc * 0.92 + corona + wideAtmosphere);

          float floorDist = max(0.001, floorY - p.y);
          vec2 reflP = vec2(p.x, floorY + floorDist) + vec2(grad.x * 0.055, grad.y * 0.022);
          float reflDist = length(reflP - sphereCenter);
          float reflArc = exp(-abs(reflDist - radius) * (34.0 / (1.0 + floorDist * 4.5)));
          float reflCorona = exp(-max(0.0, reflDist - radius) * 4.5) * 0.24;
          float floorDecay = exp(-floorDist * 3.2);

          vec3 floorNormal = normalize(vec3(-grad.x, -grad.y, 1.0));
          vec3 eclipseLightDir = normalize(vec3(-p.x * 0.9, max(0.12, floorDist + 0.1), 0.38));
          vec3 floorHalf = normalize(eclipseLightDir + vec3(0.0, 0.22, 1.0));
          float waterGlint =
            pow(max(dot(floorNormal, floorHalf), 0.0), 32.0) *
            exp(-abs(p.x) * 1.9) *
            floorDecay *
            0.38;

          float waterReflection = belowFloor * (
            (reflArc * 0.62 + reflCorona) * floorDecay +
            waterGlint
          );

          float horizonSheen = exp(-abs(p.y - floorY) * 32.0) * exp(-abs(p.x) * 2.0) * 0.10;

          lum += eclipse * (skyEclipse + waterReflection + horizonSheen);
        }

        float grain = texture2D(
          u_noise,
          gl_FragCoord.xy / 256.0 + vec2(fract(u_time * 7.3), fract(u_time * 11.1))
        ).a - 0.5;
        lum = clamp(lum + grain * 0.028, 0.0, 1.0);

        gl_FragColor = vec4(vec3(lum), 1.0);
      }
    `;

    function compileShader(type, source) {
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
      return null;
    }

    const program = gl.createProgram();
    if (!program) {
      return null;
    }
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      gl.deleteProgram(program);
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

    state.usingWebGL = true;

    function onResize() {
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

    function onRender(elapsedSec, scrollProgress) {
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

      gl.drawArrays(gl.TRIANGLES, 0, 6);
    }

    return { onResize, onRender };
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
  updateHeroStates(state.heroCurrent);
  updateHelix3D(state.tunnelCurrent);

  window.addEventListener(
    "resize",
    () => {
      if (bgEngine) {
        bgEngine.onResize();
      }
      syncSectionTargets();
      updateHelix3D(state.tunnelCurrent);
    },
    { passive: true }
  );

  /* Lenis-style silky desktop wheel inertia */
  window.addEventListener(
    "wheel",
    (event) => {
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
    },
    { passive: false }
  );

  /* Native scroll (scrollbar drag, keyboard arrows, iPhone touch momentum) */
  window.addEventListener(
    "scroll",
    () => {
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
    },
    { passive: true }
  );

  reducedMotionQuery.addEventListener("change", (event) => {
    state.reducedMotion = event.matches;
    if (state.reducedMotion) {
      state.wheelActive = false;
      state.heroCurrent = state.heroTarget;
      state.tunnelCurrent = state.tunnelTarget;
      state.needsRedraw = true;
      document.body.classList.remove("is-intro-active", "is-intro-rising");
      document.body.classList.add("is-intro-done");
    }
  });

  function tick(now) {
    state.rafId = 0;
    if (document.hidden) {
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
      state.heroCurrent += (state.heroTarget - state.heroCurrent) * heroAlpha;
      state.tunnelCurrent +=
        (state.tunnelTarget - state.tunnelCurrent) * tunnelAlpha;
    } else {
      state.heroCurrent = state.heroTarget;
      state.tunnelCurrent = state.tunnelTarget;
    }

    const bgOpacity = updateHeroStates(state.heroCurrent);
    if (bgEngine && bgOpacity > 0.005) {
      const bgProgress = clamp01(state.heroCurrent / 0.72);
      bgEngine.onRender((now - state.startTime) * 0.001, bgProgress);
    }

    updateHelix3D(state.tunnelCurrent, dt);

    state.rafId = window.requestAnimationFrame(tick);
  }

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      if (state.rafId) {
        window.cancelAnimationFrame(state.rafId);
        state.rafId = 0;
      }
    } else if (!state.rafId) {
      state.lastNow = performance.now();
      state.rafId = window.requestAnimationFrame(tick);
    }
  });

  state.rafId = window.requestAnimationFrame(tick);
})();
