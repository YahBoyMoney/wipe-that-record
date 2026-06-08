import Link from 'next/link';

const columns = [
  {
    heading: 'Services',
    links: [
      { href: '/services', label: 'All Services' },
      { href: '/services/misdemeanor-dismissal', label: 'Misdemeanor Dismissal' },
      { href: '/services/dui-record-relief', label: 'DUI Record Relief' },
      { href: '/services/felony-reduction', label: 'Felony Reduction' },
      { href: '/services/record-sealing', label: 'Arrest Record Sealing' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { href: '/how-it-works', label: 'How It Works' },
      { href: '/#plans', label: 'Pricing' },
      { href: '/locations', label: 'Locations' },
      { href: '/faq', label: 'FAQ' },
      { href: '/contact', label: 'Contact' },
    ],
  },
  {
    heading: 'Legal',
    links: [
      { href: '/privacy', label: 'Privacy Policy' },
      { href: '/terms', label: 'Terms of Service' },
      { href: '/refund-policy', label: 'Refund Policy' },
      { href: '/contact', label: 'Support' },
    ],
  },
];

export default function SiteFooter() {
  return (
    <footer className="ink-texture border-t border-[var(--brass)]/30 text-[var(--text-ink-muted)]">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-2.5">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-[var(--brass)] font-display text-sm font-semibold text-[#2a1f0c]">
                W
              </span>
              <span className="font-display text-lg font-semibold text-white">Wipe That Record</span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-[var(--text-ink-muted)]">
              California-focused record-cleaning support. We help Californians pursue dismissal,
              record sealing, felony reduction, and other forms of record relief.
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.heading}>
              <h3 className="eyebrow text-[var(--brass)]">{col.heading}</h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.href + link.label}>
                    <Link href={link.href} className="text-sm text-[var(--text-ink-muted)] transition-colors hover:text-white">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 border-t border-[var(--line-ink)] pt-8 text-xs leading-relaxed text-[var(--text-ink-muted)]">
          <p className="eyebrow mb-3 text-[var(--brass)]">Attorney Advertising</p>
          <p className="mb-3">
            Wipe That Record provides legal document preparation and record-cleaning support. Use of
            this site does not create an attorney-client relationship; an attorney-client relationship
            is formed only after a written engagement agreement is signed. The information on this site
            is general and is not legal advice for your specific situation. &ldquo;True expungement&rdquo;
            does not exist in California; eligible cases may qualify for dismissal, sealing, felony
            reduction, or other relief. Results vary by case, and court timelines vary by county.
          </p>
          <p>&copy; {new Date().getFullYear()} Wipe That Record. All rights reserved. Serving California.</p>
        </div>
      </div>
    </footer>
  );
}
