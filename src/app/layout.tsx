import type { Metadata } from "next";
import { MobileCta } from "@/client/shared/ui/MobileCta";
import { Source_Sans_3, Figtree } from "next/font/google";
import { ThemeProvider } from "@/client/shared/providers/ThemeProvider";
import { SmoothScrolling } from "@/client/shared/ui/SmoothScrolling";
import { ScrollToTop } from "@/client/shared/ui/ScrollToTop";
import { TrackingProvider } from "@/client/shared/ui/analytics/TrackingProvider";
import "./globals.css";
import { cn } from "@/lib/utils";

const sourceSans3 = Source_Sans_3({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800', '900'],
});

const figtree = Figtree({
  subsets: ['latin'],
  variable: '--font-brand',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800', '900'],
});

export const metadata: Metadata = {
  title: {
    default: "TZOLKIN | Software house de produtos digitais com IA",
    template: "%s | TZOLKIN",
  },
  description:
    "Software house que desenha, cria e evolui produtos digitais com IA: CRMs, agentes de IA, lojas e marketplaces, com cibersegurança, infraestrutura dedicada e código limpo.",
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    shortcut: '/favicon.svg',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: "TZOLKIN | Software house de produtos digitais com IA",
    description:
      "Software house que desenha, cria e evolui produtos digitais com IA: CRMs, agentes de IA, lojas e marketplaces, com cibersegurança, infraestrutura dedicada e código limpo.",
    siteName: "TZOLKIN",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "TZOLKIN — Software house de produtos digitais com IA",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TZOLKIN | Software house de produtos digitais com IA",
    description:
      "Software house que desenha, cria e evolui produtos digitais com IA: CRMs, agentes de IA, lojas e marketplaces, com cibersegurança, infraestrutura dedicada e código limpo.",
    images: ["/og-image.jpg"],
  },
  keywords: [
    "software house",
    "produtos digitais",
    "desenvolvimento de software",
    "CRM com IA",
    "agentes de IA",
    "e-commerce",
    "marketplaces",
    "automação fiscal",
    "cibersegurança",
    "TZOLKIN",
  ],
  authors: [{ name: "TZOLKIN" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning className={cn("font-sans", sourceSans3.variable, figtree.variable)}>
      <head>
        <meta
          name="facebook-domain-verification"
          content="jbrszedkqg3k343k03c9llb8mrtbir"
        />
      </head>
      <body
        suppressHydrationWarning
        className={`${sourceSans3.className} antialiased bg-background text-foreground overflow-x-hidden relative w-full pb-12 lg:pb-0`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
        >
          <TrackingProvider />
          <ScrollToTop />
          <SmoothScrolling />
          {children}
          <MobileCta />
        </ThemeProvider>
      </body>
    </html>
  );
}
