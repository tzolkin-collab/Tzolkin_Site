import type { Metadata } from "next";
import { CrmIaPage } from "@/client/pages/crm-ia/CrmIaPage";

const URL = "https://tzolkin.cloud/crm-com-ia";
const title = "CRM com IA para equipes comerciais | TZOLKIN";
const description =
  "CRM com IA integrado: recebe a oportunidade, organiza o contexto, registra os dados e encaminha ao responsável. Suíte Integrada: R$ 14.900 por dois meses.";

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
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["https://tzolkin.cloud/og-image.jpg"],
  },
};

// Apenas dados verdadeiros: sem avaliações, sem notas.
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "CRM com IA (Suíte Integrada)",
  description,
  url: URL,
  provider: { "@type": "Organization", name: "TZOLKIN", url: "https://tzolkin.cloud" },
  areaServed: "BR",
  offers: {
    "@type": "Offer",
    price: "14900",
    priceCurrency: "BRL",
    description: "Dois meses. Infraestrutura e serviços externos discriminados na proposta.",
  },
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <CrmIaPage />
    </>
  );
}
