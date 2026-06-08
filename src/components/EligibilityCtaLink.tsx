'use client';

import Link from 'next/link';
import { track } from '@/lib/track';

interface EligibilityCtaLinkProps {
  sourcePage: string;
  ctaLabel: string;
  className?: string;
  href?: string;
  children: React.ReactNode;
}

export function EligibilityCtaLink({
  sourcePage,
  ctaLabel,
  className,
  href = '/eligibility',
  children,
}: EligibilityCtaLinkProps) {
  return (
    <Link
      href={href}
      onClick={() => track('eligibility_cta_click', { source_page: sourcePage, cta_label: ctaLabel })}
      className={className}
    >
      {children}
    </Link>
  );
}
