'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Script from 'next/script';
import { captureAttribution } from '@/client/shared/utils/attribution';

export function TrackingProvider() {
  // Guarda UTM e IDs de anúncio da chegada, para o formulário mandar a origem junto com o lead.
  useEffect(() => { captureAttribution(); }, []);
  // O ID vai para dentro de um <script> inline: só dígitos, para nunca virar injeção.
  const rawPixelId = (process.env.NEXT_PUBLIC_META_PIXEL_ID || '').trim();
  const pixelId = /^\d{5,20}$/.test(rawPixelId) ? rawPixelId : '';
  const pathname = usePathname();
  const firstPath = useRef(true);
  // PageView em navegação client-side (o primeiro já sai no init do Pixel).
  useEffect(() => {
    if (firstPath.current) { firstPath.current = false; return; }
    const fbq = (window as unknown as { fbq?: (...a: unknown[]) => void }).fbq;
    if (pixelId && typeof fbq === 'function') fbq('track', 'PageView');
  }, [pathname, pixelId]);
  const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;
  const UTMIFY_URL = process.env.NEXT_PUBLIC_UTMIFY_URL || "https://cdn.utmify.com.br/scripts/utmify.js"; // URL padrão como fallback de script de rastreio

  return (
    <>
      {/* Google Tag Manager (GTM) */}
      {GTM_ID && (
        <Script
          id="gtm-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${GTM_ID}');
            `,
          }}
        />
      )}

      {/* Meta Pixel direto no site. Use ESTE ou a tag do Pixel no GTM, nunca os dois (duplica conversões). Ver docs/TRACKING.md */}
      {pixelId && (
        <Script
          id="meta-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
              n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
              document,'script','https://connect.facebook.net/en_US/fbevents.js');
              fbq('init','${pixelId}');
              fbq('track','PageView');
            `,
          }}
        />
      )}

      {/* UTMify (Baseado no doc de configuração padrão, o script atinge pageviews nativamente) */}
      <Script
        id="utmify-script"
        src={UTMIFY_URL}
        strategy="afterInteractive"
        async
        defer
      />
    </>
  );
}
