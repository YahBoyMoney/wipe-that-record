'use client';

import { useEffect } from 'react';
import Script from 'next/script';
import { initAnalytics } from '@/lib/analytics';

interface AnalyticsProps {
  gaId?: string;
  gtmId?: string;
  fbPixelId?: string;
  clarityId?: string;
  hotjarId?: string;
}

/**
 * Analytics scripts only render when an ID is explicitly provided either via
 * props or `NEXT_PUBLIC_*` environment variables. Placeholder IDs are never
 * injected into the page — they create broken network calls and dirty consoles.
 */
export default function Analytics({
  gaId = process.env.NEXT_PUBLIC_GA_ID,
  gtmId = process.env.NEXT_PUBLIC_GTM_ID,
  fbPixelId = process.env.NEXT_PUBLIC_FB_PIXEL_ID,
  clarityId = process.env.NEXT_PUBLIC_CLARITY_ID,
  hotjarId = process.env.NEXT_PUBLIC_HOTJAR_ID,
}: AnalyticsProps) {
  useEffect(() => {
    initAnalytics();
  }, []);

  return (
    <>
      {/* Google Analytics — only when ID provided */}
      {gaId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gaId}', {
                page_title: document.title,
                page_location: window.location.href,
              });
            `}
          </Script>
        </>
      )}

      {/* Google Tag Manager */}
      {gtmId && (
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${gtmId}');
          `}
        </Script>
      )}

      {/* Schema.org JSON-LD for SEO — always safe to render */}
      <Script id="schema-org" type="application/ld+json">
        {`
          {
            "@context": "https://schema.org",
            "@type": "LegalService",
            "name": "WipeThatRecord",
            "description": "Professional expungement services in California. Clear your criminal record with our DIY kits, professional filing service, or full attorney representation.",
            "url": "https://www.wipethatrecord.com",
            "logo": "https://www.wipethatrecord.com/logo.png",
            "telephone": "+1-909-609-6685",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "901 Via Piemonte, Suite 230",
              "addressLocality": "Ontario",
              "addressRegion": "CA",
              "postalCode": "91764",
              "addressCountry": "US"
            },
            "areaServed": [
              { "@type": "State", "name": "California" }
            ],
            "serviceType": [
              "Criminal Record Expungement",
              "Legal Document Preparation",
              "Attorney Services"
            ],
            "offers": [
              {
                "@type": "Offer",
                "name": "DIY Self Expunge Kit",
                "description": "Complete do-it-yourself expungement kit with forms and instructions",
                "price": "97",
                "priceCurrency": "USD"
              },
              {
                "@type": "Offer",
                "name": "Expert Review",
                "description": "Professional form completion and filing guidance",
                "price": "297",
                "priceCurrency": "USD"
              },
              {
                "@type": "Offer",
                "name": "Full Attorney Service",
                "description": "Complete attorney-managed expungement service",
                "price": "1497",
                "priceCurrency": "USD"
              }
            ],
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.8",
              "reviewCount": "265"
            }
          }
        `}
      </Script>

      {/* Facebook Pixel */}
      {fbPixelId && (
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
            fbq('init', '${fbPixelId}');
            fbq('track', 'PageView');
          `}
        </Script>
      )}

      {/* Microsoft Clarity */}
      {clarityId && (
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "${clarityId}");
          `}
        </Script>
      )}

      {/* Hotjar */}
      {hotjarId && (
        <Script id="hotjar" strategy="afterInteractive">
          {`
            (function(h,o,t,j,a,r){
                h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
                h._hjSettings={hjid:${hotjarId},hjsv:6};
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
