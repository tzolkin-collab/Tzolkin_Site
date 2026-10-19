import { LandingPage } from "@/client/pages/home/LandingPage";
import type { Metadata } from "next";

const description = "Software house que desenha, cria e evolui produtos digitais com IA: CRMs, agentes de IA, lojas e marketplaces, com cibersegurança, infraestrutura dedicada e código limpo.";

export const metadata: Metadata = {
  title: { absolute: "TZOLKIN | Software house de produtos digitais com IA" },
  description,
  alternates: { canonical: "https://tzolkin.cloud/" },
  openGraph: {
    title: "TZOLKIN | Software house de produtos digitais com IA",
    description,
    url: "https://tzolkin.cloud/",
    siteName: "TZOLKIN",
    locale: "pt_BR",
    type: "website",
    images: [{ url: "https://tzolkin.cloud/og-image.jpg", width: 1200, height: 630, alt: "TZOLKIN" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "TZOLKIN | Software house de produtos digitais com IA",
    description,
    images: ["https://tzolkin.cloud/og-image.jpg"],
  },
};

export default function Home() {
  return <LandingPage />;
}
