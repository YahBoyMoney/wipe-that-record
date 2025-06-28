'use client';

import { useEffect } from 'react';
import Script from 'next/script';
import { initAnalytics } from '@/lib/analytics';

interface AnalyticsProps {
  gaId?: string;
}

export default function Analytics({ gaId = 'G-XXXXXXXXXX' }: AnalyticsProps) {
  useEffect(() => {
    // Initialize our custom analytics
    initAnalytics();
  }, []);

  return (
    <>
      {/* Google Analytics */}
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

      {/* Google Tag Manager */}
      <Script id="google-tag-manager" strategy="afterInteractive">
        {`
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-XXXXXXXXX');
        `}
      </Script>

      {/* Schema.org JSON-LD for SEO */}
      <Script id="schema-org" type="application/ld+json">
        {`
          {
            "@context": "https://schema.org",
            "@type": "LegalService",
            "name": "WipeThatRecord",
            "description": "Professional expungement services in California. Clear your criminal record with our DIY kits, professional filing service, or full attorney representation.",
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
              "Criminal Record Expungement",
              "Legal Document Preparation",
              "Attorney Services"
            ],
            "offers": [
              {
                "@type": "Offer",
                "name": "DIY Self Expunge Kit",
                "description": "Complete do-it-yourself expungement kit with forms and instructions",
                "price": "99",
                "priceCurrency": "USD"
              },
              {
                "@type": "Offer",
                "name": "Professionally Filled & Filed Service",
                "description": "Professional form completion and filing guidance",
                "price": "299",
                "priceCurrency": "USD"
              },
              {
                "@type": "Offer",
                "name": "Full Attorney Service",
                "description": "Complete attorney-managed expungement service",
                "price": "1500",
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
          fbq('init', 'XXXXXXXXXXXXXXX');
          fbq('track', 'PageView');
        `}
      </Script>

      {/* Microsoft Clarity */}
      <Script id="microsoft-clarity" strategy="afterInteractive">
        {`
          (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "XXXXXXXXXX");
        `}
      </Script>

      {/* Hotjar */}
      <Script id="hotjar" strategy="afterInteractive">
        {`
          (function(h,o,t,j,a,r){
              h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
              h._hjSettings={hjid:XXXXXXX,hjsv:6};
              a=o.getElementsByTagName('head')[0];
              r=o.createElement('script');r.async=1;
              r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
              a.appendChild(r);
          })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
        `}
      </Script>
    </>
  );
}