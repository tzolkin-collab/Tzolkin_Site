import { LandingPage } from "@/client/pages/home/LandingPage";
import type { Metadata } from "next";

const description = "Sites, lojas, tracking de funil e software sob medida para sua empresa. Conheça as soluções da TZOLKIN para vender, medir e conectar sua operação.";

export const metadata: Metadata = {
  title: { absolute: "TZOLKIN | Sites, tracking e software sob medida" },
  description,
  alternates: { canonical: "https://tzolkin.cloud/" },
  openGraph: {
    title: "TZOLKIN | Sites, tracking e software sob medida",
    description,
    url: "https://tzolkin.cloud/",
    siteName: "TZOLKIN",
    locale: "pt_BR",
    type: "website",
    images: [{ url: "https://tzolkin.cloud/og-image.jpg", width: 1200, height: 630, alt: "TZOLKIN" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "TZOLKIN | Sites, tracking e software sob medida",
    description,
    images: ["https://tzolkin.cloud/og-image.jpg"],
  },
};

export default function Home() {
  return <LandingPage />;
}
