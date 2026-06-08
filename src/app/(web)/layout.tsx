import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Analytics from "@/components/Analytics";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Wipe That Record - California Record-Cleaning Help | Clean Up Your Record",
  description: "California record-cleaning support: dismissal, record sealing, felony reduction, and arrest-record relief. DIY kits from $97, expert review, and attorney-managed options. Serving Orange County, Los Angeles, San Diego & all CA counties.",
  keywords: "California record cleaning, dismissal, record sealing, DUI record relief, misdemeanor dismissal, Prop 47, felony reduction, Orange County, Los Angeles, San Diego, criminal record relief",
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
    title: "Wipe That Record - California Record-Cleaning Help",
    description: "California record-cleaning support: dismissal, record sealing, felony reduction, and arrest-record relief. Serving all CA counties.",
    url: "https://wipethatrecord.com",
    siteName: "Wipe That Record",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Wipe That Record - California Record-Cleaning Help",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Wipe That Record - California Record-Cleaning Help",
    description: "California record-cleaning support: dismissal, record sealing, felony reduction, and arrest-record relief.",
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
  ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? {
        verification: {
          google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
        },
      }
    : {}),
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
        <meta name="theme-color" content="#0f2747" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LegalService",
              "name": "Wipe That Record",
              "description": "California record-cleaning support: dismissal, record sealing, felony reduction, and arrest-record relief.",
              "url": "https://wipethatrecord.com",
              "areaServed": {
                "@type": "State",
                "name": "California"
              },
              "serviceType": "Criminal Record Relief",
              "priceRange": "$97-$1497",
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
        <Analytics />
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
