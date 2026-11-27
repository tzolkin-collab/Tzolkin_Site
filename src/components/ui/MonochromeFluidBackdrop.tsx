"use client";

export interface MonochromeFluidBackdropProps {
  paused: boolean;
}

/**
 * Aquatico-inspired low-contrast monochrome contour waves + 35mm film grain.
 * Stays strictly black-and-white so the video creative remains the sole color on screen.
 */
export function MonochromeFluidBackdrop({ paused }: MonochromeFluidBackdropProps) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <div
        data-motion={paused ? "paused" : "running"}
        className="tz-wave-layer absolute -inset-x-[8%] -inset-y-[6%]"
      >
        <svg
          viewBox="0 0 1440 900"
          fill="none"
          preserveAspectRatio="xMidYMid slice"
          className="h-full w-full"
        >
          <defs>
            <radialGradient id="tz-depth-vignette" cx="68%" cy="45%" r="65%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.06" />
              <stop offset="55%" stopColor="#FFFFFF" stopOpacity="0.015" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0" />
            </radialGradient>
          </defs>

          <rect width="1440" height="900" fill="url(#tz-depth-vignette)" />

          {/* Subtle monochrome fluid contour lines inspired by deep water surface tension */}
          <path
            d="M-80 620 C 210 530, 440 720, 760 590 C 1060 470, 1250 560, 1520 460"
            stroke="#FFFFFF"
            strokeOpacity="0.09"
            strokeWidth="1"
          />
          <path
            d="M-80 656 C 240 566, 460 748, 780 622 C 1075 504, 1265 588, 1520 492"
            stroke="#FFFFFF"
            strokeOpacity="0.065"
            strokeWidth="1"
          />
          <path
            d="M-80 692 C 260 605, 490 778, 800 656 C 1090 540, 1280 620, 1520 526"
            stroke="#FFFFFF"
            strokeOpacity="0.045"
            strokeWidth="1"
          />
          <path
            d="M-80 732 C 290 648, 520 806, 825 692 C 1110 580, 1295 654, 1520 564"
            stroke="#FFFFFF"
            strokeOpacity="0.03"
            strokeWidth="1"
          />
          <path
            d="M280 -40 C 480 180, 820 120, 1080 310 C 1260 440, 1380 410, 1520 350"
            stroke="#FFFFFF"
            strokeOpacity="0.045"
            strokeWidth="1"
          />
        </svg>
      </div>

      {/* Subtle 35mm B&W grain layer */}
      <div className="tz-grain-overlay absolute inset-0" />

      {/* Bottom edge grounding fade into Surface 0 */}
      <div
        className="absolute inset-x-0 bottom-0 h-32"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.92) 100%)",
        }}
      />
    </div>
  );
}
