import type { Metadata } from "next";
import { EcommercePage } from "@/client/pages/ecommerce/EcommercePage";

const URL = "https://tzolkin.cloud/ecommerce-marketplace";
const title = "E-commerce e marketplaces | TZOLKIN";
const description =
  "Loja ou tema Shopify com catálogo, estoque e pedidos de marketplaces no mesmo fluxo. Suíte de dois meses, com valor apresentado na proposta.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: URL },
  openGraph: {
    title,
    description,
    url: URL,
    siteName: "TZOLKIN",
    locale: "pt_BR",
    type: "website",
    images: [{ url: "https://tzolkin.cloud/og-image.jpg", width: 1200, height: 630, alt: "TZOLKIN" }],
  },
  twitter: { card: "summary_large_image", title, description, images: ["https://tzolkin.cloud/og-image.jpg"] },
};

export default function Page() {
  return <EcommercePage />;
}
