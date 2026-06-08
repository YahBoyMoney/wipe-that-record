'use client';

import Link from 'next/link';
import { track } from '@/lib/track';

interface ServiceCardLinkProps {
  href: string;
  service: string;
  children: React.ReactNode;
  className?: string;
}

export function ServiceCardLink({ href, service, children, className }: ServiceCardLinkProps) {
  return (
    <Link
      href={href}
      onClick={() => track('service_card_click', { source_page: '/services', service })}
      className={className}
    >
      {children}
    </Link>
  );
}
