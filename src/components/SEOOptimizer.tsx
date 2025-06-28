import { Metadata } from 'next';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonicalUrl?: string;
  imageUrl?: string;
  noIndex?: boolean;
}

export function generateSEOMetadata({
  title = "Wipe That Record - California Expungement Service | Clear Your Criminal Record",
  description = "Clear your California criminal record with our professional expungement service. DIY kits from $99. 98.7% success rate. Prop 47 & SB 731 compliant. Serving Orange County, Los Angeles, San Diego & all CA counties.",
  keywords = "California expungement, clear criminal record, DUI expungement, misdemeanor expungement, Prop 47, SB 731, Orange County expungement, Los Angeles expungement, San Diego expungement, criminal record sealing, arrest record removal, background check clean, employment opportunities, housing applications, professional licensing",
  canonicalUrl = "https://www.wipethatrecord.com",
  imageUrl = "https://www.wipethatrecord.com/og-image.jpg",
  noIndex = false,
}: SEOProps): Metadata {
  return {
    title,
    description,
    keywords,
    authors: [{ name: "WipeThatRecord Legal Team" }],
    creator: "WipeThatRecord",
    publisher: "WipeThatRecord",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL('https://www.wipethatrecord.com'),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "WipeThatRecord",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
      creator: "@wipethatrecord",
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      google: "your-google-verification-code",
      other: {
        "facebook-domain-verification": "your-facebook-verification",
        "msvalidate.01": "your-bing-verification",
      },
    },
    category: 'Legal Services',
  };
}

// Pre-defined SEO configurations for common pages
export const seoConfigs = {
  home: {
    title: "WipeThatRecord - #1 California Expungement Service | Clear Your Criminal Record",
    description: "Clear your California criminal record with our professional expungement service. DIY kits from $99. 98.7% success rate. Prop 47 & SB 731 compliant. Free eligibility check.",
    keywords: "California expungement, clear criminal record, DUI expungement, misdemeanor expungement, Prop 47, SB 731, criminal record sealing, background check clean",
  },
  diyKit: {
    title: "DIY California Expungement Kit - $99 | WipeThatRecord",
    description: "Complete DIY California expungement kit for $99. Includes all forms, step-by-step instructions, and legal guidance. Clear your criminal record yourself.",
    keywords: "DIY expungement kit, California expungement forms, self-service expungement, affordable criminal record clearing, do it yourself expungement",
  },
  professionalService: {
    title: "Professional Expungement Filing Service - $299 | WipeThatRecord",
    description: "Our legal experts professionally fill out your expungement paperwork for $299. Includes form completion, document review, and filing instructions.",
    keywords: "professional expungement service, legal experts, expungement paperwork filing, document review, California expungement forms",
  },
  attorneyService: {
    title: "Full Attorney Expungement Service - $1500 | WipeThatRecord",
    description: "Complete attorney-managed expungement service for $1500. Our experienced lawyers handle everything including court representation and legal advocacy.",
    keywords: "attorney expungement service, lawyer representation, court advocacy, full legal service, experienced expungement attorneys",
  },
  losAngeles: {
    title: "Los Angeles Expungement Service | Clear Your LA Criminal Record",
    description: "Professional expungement services in Los Angeles County. Clear your criminal record with our LA-specific legal expertise. Free consultation available.",
    keywords: "Los Angeles expungement, LA County criminal record clearing, Hollywood expungement, Beverly Hills expungement, Pasadena expungement",
  },
  orangeCounty: {
    title: "Orange County Expungement Service | Clear Your OC Criminal Record",
    description: "Professional expungement services in Orange County. Clear your criminal record with our OC-specific legal expertise. Serving Anaheim, Irvine, Santa Ana.",
    keywords: "Orange County expungement, OC criminal record clearing, Anaheim expungement, Irvine expungement, Santa Ana expungement, Newport Beach",
  },
  prop47: {
    title: "Prop 47 Expungement California | Reduce Felony to Misdemeanor",
    description: "Prop 47 allows reduction of certain felonies to misdemeanors in California. Our experts help you navigate Prop 47 expungement process.",
    keywords: "Prop 47 expungement, California Proposition 47, felony to misdemeanor reduction, drug possession expungement, theft expungement",
  },
  sb731: {
    title: "SB 731 Automatic Record Relief California | Criminal Record Sealing",
    description: "SB 731 provides automatic criminal record relief in California. Learn how to get your records sealed under Senate Bill 731.",
    keywords: "SB 731, Senate Bill 731, automatic record relief, California criminal record sealing, automatic expungement",
  },
};

// Schema.org structured data generators
export const generateLocalBusinessSchema = () => ({
  "@context": "https://schema.org",
  "@type": "LegalService",
  "name": "WipeThatRecord",
  "description": "Professional California expungement and criminal record clearing service",
  "url": "https://www.wipethatrecord.com",
  "logo": "https://www.wipethatrecord.com/logo.png",
  "image": "https://www.wipethatrecord.com/og-image.jpg",
  "address": {
    "@type": "PostalAddress",
    "addressRegion": "CA",
    "addressCountry": "US"
  },
  "areaServed": [
    {
      "@type": "State",
      "name": "California"
    },
    {
      "@type": "City",
      "name": "Los Angeles"
    },
    {
      "@type": "City", 
      "name": "Orange County"
    },
    {
      "@type": "City",
      "name": "San Diego"
    }
  ],
  "serviceType": [
    "Criminal Record Expungement",
    "Legal Document Preparation", 
    "Attorney Representation",
    "Prop 47 Services",
    "SB 731 Services"
  ],
  "priceRange": "$99-$1500",
  "telephone": "+1-XXX-XXX-XXXX",
  "email": "info@wipethatrecord.com",
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Expungement Services",
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "DIY Self Expunge Kit",
          "description": "Complete do-it-yourself expungement kit"
        },
        "price": "99",
        "priceCurrency": "USD"
      },
      {
        "@type": "Offer", 
        "itemOffered": {
          "@type": "Service",
          "name": "Professional Filing Service",
          "description": "Expert form completion and filing guidance"
        },
        "price": "299",
        "priceCurrency": "USD"
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service", 
          "name": "Full Attorney Service",
          "description": "Complete attorney-managed expungement"
        },
        "price": "1500",
        "priceCurrency": "USD"
      }
    ]
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "265",
    "bestRating": "5",
    "worstRating": "1"
  },
  "review": [
    {
      "@type": "Review",
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": "5",
        "bestRating": "5"
      },
      "author": {
        "@type": "Person",
        "name": "Sarah M."
      },
      "reviewBody": "WipeThatRecord helped me clear my criminal record quickly and affordably. Highly recommended!"
    }
  ]
});

export const generateProductSchema = (product: {
  name: string;
  description: string;
  price: number;
  rating?: number;
  reviewCount?: number;
}) => ({
  "@context": "https://schema.org",
  "@type": "Product",
  "name": product.name,
  "description": product.description,
  "brand": {
    "@type": "Brand",
    "name": "WipeThatRecord"
  },
  "offers": {
    "@type": "Offer",
    "price": product.price.toString(),
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock",
    "seller": {
      "@type": "Organization",
      "name": "WipeThatRecord"
    }
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": product.rating?.toString() || "4.8",
    "reviewCount": product.reviewCount?.toString() || "50"
  }
});

export const generateFAQSchema = (faqs: Array<{question: string; answer: string}>) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqs.map(faq => ({
    "@type": "Question",
    "name": faq.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": faq.answer
    }
  }))
});