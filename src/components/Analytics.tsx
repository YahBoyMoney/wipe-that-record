'use client';

import { useEffect } from 'react';
import Script from 'next/script';
import { initAnalytics } from '@/lib/analytics';

// Real tracking IDs are sourced from public env vars. When they are not
// configured, the corresponding script is simply not rendered so that we never
// ship placeholder IDs that pollute attribution or slow the page down.
const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;
const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID;
const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID;
const HOTJAR_ID = process.env.NEXT_PUBLIC_HOTJAR_ID;

export default function Analytics() {
  useEffect(() => {
    // Initialize our first-party analytics regardless of third-party scripts.
    initAnalytics();
  }, []);

  return (
    <>
      {GA_ID && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_ID}', {
                page_title: document.title,
                page_location: window.location.href,
              });
            `}
          </Script>
        </>
      )}

      {GTM_ID && (
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${GTM_ID}');
          `}
        </Script>
      )}

      {/* Schema.org JSON-LD for SEO */}
      <Script id="schema-org" type="application/ld+json">
        {`
          {
            "@context": "https://schema.org",
            "@type": "LegalService",
            "name": "WipeThatRecord",
            "description": "California record-cleaning support. We help Californians pursue dismissal, record sealing, felony reduction, and related record relief with DIY kits, expert review, or attorney-managed service.",
            "url": "https://www.wipethatrecord.com",
            "logo": "https://www.wipethatrecord.com/logo.png",
            "address": {
              "@type": "PostalAddress",
              "addressRegion": "CA",
              "addressCountry": "US"
            },
            "areaServed": [
              {
                "@type": "State",
                "name": "California"
              }
            ],
            "serviceType": [
              "Criminal Record Relief",
              "Legal Document Preparation",
              "Attorney Services"
            ],
            "offers": [
              {
                "@type": "Offer",
                "name": "DIY Record-Cleaning Kit",
                "description": "Do-it-yourself record-cleaning kit with California forms and instructions",
                "price": "97",
                "priceCurrency": "USD"
              },
              {
                "@type": "Offer",
                "name": "Expert Review",
                "description": "Specialist review of your forms and case before you file",
                "price": "297",
                "priceCurrency": "USD"
              },
              {
                "@type": "Offer",
                "name": "Full Attorney Service",
                "description": "Attorney-managed record-cleaning service",
                "price": "1497",
                "priceCurrency": "USD"
              }
            ]
          }
        `}
      </Script>

      {FB_PIXEL_ID && (
        <Script id="facebook-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${FB_PIXEL_ID}');
            fbq('track', 'PageView');
          `}
        </Script>
      )}

      {CLARITY_ID && (
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "${CLARITY_ID}");
          `}
        </Script>
      )}

      {HOTJAR_ID && (
        <Script id="hotjar" strategy="afterInteractive">
          {`
            (function(h,o,t,j,a,r){
                h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
                h._hjSettings={hjid:${HOTJAR_ID},hjsv:6};
                a=o.getElementsByTagName('head')[0];
                r=o.createElement('script');r.async=1;
                r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
                a.appendChild(r);
            })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
          `}
        </Script>
      )}
    </>
  );
}
