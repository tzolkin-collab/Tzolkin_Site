export interface HeroCreativeSlot {
  slotId: string;
  aspect: "9:16" | "4:5";
  videoSrc: string | null;
  posterSrc: string | null;
  statusLabel: string;
  hookWindow: string;
  pipelineLabel: string;
  telemetryState: string;
  caption: string;
}

/**
 * Editable Hero creative slot.
 * Replace `videoSrc` (e.g. "/reels/hero-feed-01.mp4") once real creative assets are ready.
 * No campaign metrics are fabricated while `videoSrc` is null.
 */
export const heroCreativeSlot: HeroCreativeSlot = {
  slotId: "FEED_01",
  aspect: "9:16",
  videoSrc: null,
  posterSrc: null,
  statusLabel: "SLOT READY",
  hookWindow: "00:00 — 00:03",
  pipelineLabel: "HYBRID AI + DR",
  telemetryState: "AWAITING REEL",
  caption: "CREATIVE IS THE ONLY COLOR // DROP 9:16 REEL IN src/data/hero-slot.ts",
};
