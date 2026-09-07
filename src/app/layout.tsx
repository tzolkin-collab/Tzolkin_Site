import type { Metadata } from "next";
import { Source_Sans_3, Figtree } from "next/font/google";
import { ThemeProvider } from "@/client/shared/providers/ThemeProvider";
import { SmoothScrolling } from "@/client/shared/ui/SmoothScrolling";
import { ScrollToTop } from "@/client/shared/ui/ScrollToTop";
import { TrackingProvider } from "@/client/shared/ui/analytics/TrackingProvider";
import { ChatProvider } from "@/client/shared/providers/ChatProvider";
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
    default: "TZOLKIN | Software de alto padrão",
    template: "%s | TZOLKIN",
  },
  description:
    "Software de alto padrão: consultoria, produtos white-label e sob medida, e ferramentas próprias — de IA a cybersecurity, do desenvolvimento ao educacional.",
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    shortcut: '/favicon.svg',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: "TZOLKIN | Software de alto padrão",
    description:
      "Consultoria, produtos white-label e sob medida, e ferramentas próprias — de IA a cybersecurity, do desenvolvimento ao educacional.",
    siteName: "TZOLKIN",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "TZOLKIN — Software de alto padrão",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TZOLKIN | Software de alto padrão",
    description:
      "Consultoria, produtos white-label e sob medida, e ferramentas próprias — de IA a cybersecurity, do desenvolvimento ao educacional.",
    images: ["/og-image.jpg"],
  },
  keywords: [
    "software",
    "software house",
    "consultoria de software",
    "desenvolvimento de software",
    "white-label",
    "SaaS",
    "inteligência artificial",
    "cybersecurity",
    "web design",
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
      <body
        suppressHydrationWarning
        className={`${sourceSans3.className} antialiased bg-background text-foreground overflow-x-hidden relative w-full`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
        >
          <TrackingProvider />
          <ScrollToTop />
          <SmoothScrolling />
          <ChatProvider>
            {children}
          </ChatProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
