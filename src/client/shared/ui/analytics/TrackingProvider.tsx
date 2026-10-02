'use client';

import { useEffect } from 'react';
import Script from 'next/script';
import { captureAttribution } from '@/client/shared/utils/attribution';

export function TrackingProvider() {
  // Guarda UTM e IDs de anúncio da chegada, para o formulário mandar a origem junto com o lead.
  useEffect(() => { captureAttribution(); }, []);
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
