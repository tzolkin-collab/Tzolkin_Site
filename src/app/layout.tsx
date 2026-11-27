import type { Metadata, Viewport } from "next";
import { Outfit, Source_Sans_3, Geist_Mono } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500"],
  variable: "--font-outfit",
  display: "swap",
});

const sourceSans3 = Source_Sans_3({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-source-sans-3",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "TZOLKIN — Synthetic Creative Engineering",
  description:
    "High-velocity synthetic ad assets engineered for sub-$15 CPAs and infinite creative testing.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${sourceSans3.variable} ${geistMono.variable}`}
    >
      <body className="antialiased selection:bg-[var(--ink)] selection:text-[var(--surface-0)]">
        {children}
      </body>
    </html>
  );
}
