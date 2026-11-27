export interface FramesVariantSpec {
  readonly count: number;
  readonly pattern: string;
}

export interface FramesManifest {
  readonly desktop: FramesVariantSpec;
  readonly mobile: FramesVariantSpec;
}

export interface CreativeReelItem {
  readonly index: number;
  readonly slotLabel: string;
  readonly placeholderLabel: string;
  readonly videoSrc: string;
  readonly title: string;
  readonly description: string;
}

export interface EngagementSpec {
  readonly label: string;
  readonly value: string;
}

export type EngagementTrackId = "test-batch" | "scale-engine";

export interface EngagementTrack {
  readonly id: EngagementTrackId;
  readonly title: string;
  readonly cadence: string;
  readonly description: string;
  readonly deliverableTitle: string;
  readonly deliverableMetric: string;
  readonly deliverableSub: string;
  readonly matrixLayers: readonly string[];
  readonly specs: readonly EngagementSpec[];
  readonly ctaLabel: string;
  readonly ctaHref: string;
  readonly variant: "primary" | "ghost";
}

export const FRAMES_MANIFEST: FramesManifest = {
  desktop: {
    count: 0,
    pattern: "/frames/desktop/frame-{index}.webp",
  },
  mobile: {
    count: 0,
    pattern: "/frames/mobile/frame-{index}.webp",
  },
};

export const CREATIVE_REELS: readonly CreativeReelItem[] = [
  {
    index: 0,
    slotLabel: "SLOT 01",
    placeholderLabel: "VIDEO PLACEHOLDER 01",
    videoSrc: "/reels/reel-01.mp4",
    title: "MACRO PRODUCT DEMO",
    description:
      "Hyper-detailed synthetic liquid and texture visuals engineered to stop the scroll in skincare and wellness feeds.",
  },
  {
    index: 1,
    slotLabel: "SLOT 02",
    placeholderLabel: "VIDEO PLACEHOLDER 02",
    videoSrc: "/reels/reel-02.mp4",
    title: "HIGH-SPEED ACTION HOOK",
    description:
      "Zero-shoot kinetic product sequences built to trigger instant pattern interruption in the first 3 seconds.",
  },
  {
    index: 2,
    slotLabel: "SLOT 03",
    placeholderLabel: "VIDEO PLACEHOLDER 03",
    videoSrc: "/reels/reel-03.mp4",
    title: "SENSORY POUR VISUAL",
    description:
      "Tactile slow-motion beverage and texture cinematography designed for high-retention paid social ads.",
  },
  {
    index: 3,
    slotLabel: "SLOT 04",
    placeholderLabel: "VIDEO PLACEHOLDER 04",
    videoSrc: "/reels/reel-04.mp4",
    title: "IMPOSSIBLE 3D MECHANISM",
    description:
      "Microscopic ingredient and formulation renders that demonstrate product efficacy beyond live-action cameras.",
  },
  {
    index: 4,
    slotLabel: "SLOT 05",
    placeholderLabel: "VIDEO PLACEHOLDER 05",
    videoSrc: "/reels/reel-05.mp4",
    title: "INDUSTRIAL DESIGN HERO",
    description:
      "Precision hardware lighting and optical refraction frames tailored for consumer tech and SaaS launches.",
  },
  {
    index: 5,
    slotLabel: "SLOT 06",
    placeholderLabel: "VIDEO PLACEHOLDER 06",
    videoSrc: "/reels/reel-06.mp4",
    title: "CINEMATIC B-ROLL VSL",
    description:
      "Atmospheric architectural and lifestyle backdrops crafted for high-ticket lead generation and VSL funnels.",
  },
];

export const MANIFESTO_LINES: readonly string[] = [
  "Most ad accounts die from creative fatigue, not media buying.",
  "We engineer synthetic video built to hold the first three seconds—for skincare, consumer apps, performance agencies, and high-ticket VSLs.",
  "No shoots. No studio bottlenecks. Thirty variations ready to test in five days.",
  "Only the frame in focus earns the click.",
];

export const ENGAGEMENT_TRACKS: readonly EngagementTrack[] = [
  {
    id: "test-batch",
    title: "Test Batch",
    cadence: "5 BUSINESS DAYS",
    description:
      "Ten complete creatives across three hook variations—thirty launch-ready 9:16 and 4:5 masters built to test against your current control.",
    deliverableTitle: "SPRINT MATRIX",
    deliverableMetric: "30 MASTERS",
    deliverableSub: "10 CONCEPTS × 3 HOOKS · 9:16 + 4:5",
    matrixLayers: ["HOOK VARIATION A", "HOOK VARIATION B", "HOOK VARIATION C"],
    specs: [
      { label: "Output", value: "30 ad assets (10 concepts × 3 hooks)" },
      { label: "Formats", value: "9:16 vertical & 4:5 feed masters" },
      { label: "Commitment", value: "Single fixed sprint, zero retainer" },
    ],
    ctaLabel: "Book Test Batch",
    ctaHref: "mailto:hello@tzolkin.studio?subject=TZOLKIN%20Test%20Batch",
    variant: "primary",
  },
  {
    id: "scale-engine",
    title: "Scale Engine",
    cadence: "WEEKLY SPRINTS",
    description:
      "Forty to sixty synthetic assets every month, iterated weekly around what actually holds thumbstop and lowers CPA in your ad account.",
    deliverableTitle: "WEEKLY CADENCE",
    deliverableMetric: "40–60 / MO",
    deliverableSub: "4 WEEKLY SPRINTS · VISUAL LOCK",
    matrixLayers: ["WEEK 01", "WEEK 02", "WEEK 03", "WEEK 04"],
    specs: [
      { label: "Volume", value: "40–60 new assets per month" },
      { label: "Cadence", value: "Weekly iteration off live account winners" },
      { label: "Continuity", value: "Dedicated product render & visual lock" },
    ],
    ctaLabel: "Apply for Scale Engine",
    ctaHref: "mailto:hello@tzolkin.studio?subject=TZOLKIN%20Scale%20Engine",
    variant: "ghost",
  },
];
