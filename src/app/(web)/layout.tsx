import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Wipe That Record - California Expungement Service | Clear Your Criminal Record",
  description: "Clear your California criminal record with our professional expungement service. DIY kits from $97. 98.7% success rate. Prop 47 & SB 731 compliant. Serving Orange County, Los Angeles, San Diego & all CA counties.",
  keywords: "California expungement, clear criminal record, DUI expungement, misdemeanor expungement, Prop 47, SB 731, Orange County expungement, Los Angeles expungement, San Diego expungement, criminal record sealing",
  authors: [{ name: "Wipe That Record" }],
  creator: "Wipe That Record",
  publisher: "Wipe That Record",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://wipethatrecord.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Wipe That Record - California Expungement Service",
    description: "Clear your California criminal record with our professional expungement service. 98.7% success rate. Serving all CA counties.",
    url: "https://wipethatrecord.com",
    siteName: "Wipe That Record",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Wipe That Record - California Expungement Service",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Wipe That Record - California Expungement Service",
    description: "Clear your California criminal record with our professional expungement service. 98.7% success rate.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#3B82F6" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LegalService",
              "name": "Wipe That Record",
              "description": "Professional California expungement and criminal record clearing service",
              "url": "https://wipethatrecord.com",
              "areaServed": {
                "@type": "State",
                "name": "California"
              },
              "serviceType": "Criminal Record Expungement",
              "priceRange": "$97-$1497",
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.9",
                "reviewCount": "1847"
              },
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "California",
                "addressCountry": "US"
              }
            })
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
