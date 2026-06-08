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
    <footer className="border-t border-slate-800 bg-[#0f2747] text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-2 text-lg font-bold text-white">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-white text-sm font-bold text-[#0f2747]">
                WR
              </span>
              Wipe That Record
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-slate-400">
              California-focused record-cleaning support. We help Californians pursue dismissal,
              record sealing, felony reduction, and other forms of record relief.
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.heading}>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-white">{col.heading}</h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.href + link.label}>
                    <Link href={link.href} className="text-sm text-slate-400 transition-colors hover:text-white">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-slate-700/60 pt-8 text-xs leading-relaxed text-slate-400">
          <p className="mb-3 font-semibold text-slate-300">Attorney Advertising</p>
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
