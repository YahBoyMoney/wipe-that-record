import Link from 'next/link'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand & contact */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2 mb-4" aria-label="Wipe That Record home">
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true">
                <rect x="2" y="2" width="32" height="32" rx="8" fill="#2563EB" />
                <path
                  d="M10 18.5L15.5 24L26 13"
                  stroke="white"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="font-bold text-white text-lg">Wipe That Record</span>
            </Link>
            <p className="text-sm leading-relaxed text-slate-400 max-w-md mb-5">
              California criminal record expungement services. We help Californians clear
              eligible convictions under Penal Code §1203.4, Prop 47, and SB 731 — at a fraction
              of traditional attorney fees.
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 mt-0.5 text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>901 Via Piemonte, Suite 230<br />Ontario, CA 91764</span>
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <a href="tel:+19096096685" className="hover:text-white transition-colors">
                  (909) 609-6685
                </a>
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href="mailto:support@wipethatrecord.com" className="hover:text-white transition-colors">
                  support@wipethatrecord.com
                </a>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">
              Services
            </h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/checkout/diy" className="hover:text-white transition-colors">DIY Expungement Kit</Link></li>
              <li><Link href="/checkout/review" className="hover:text-white transition-colors">Expert Review</Link></li>
              <li><Link href="/checkout/full-service" className="hover:text-white transition-colors">Full Attorney Service</Link></li>
              <li><Link href="/california-expungement-diy" className="hover:text-white transition-colors">California Guide</Link></li>
              <li><Link href="/los-angeles" className="hover:text-white transition-colors">Los Angeles</Link></li>
              <li><Link href="/orange-county" className="hover:text-white transition-colors">Orange County</Link></li>
            </ul>
          </div>

          {/* Company / Legal */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">
              Company
            </h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link href="/disclaimer" className="hover:text-white transition-colors">Legal Disclaimer</Link></li>
              <li><Link href="/unsubscribe" className="hover:text-white transition-colors">Unsubscribe</Link></li>
            </ul>
          </div>
        </div>

        {/* Attorney credentials bar */}
        <div className="mt-12 pt-8 border-t border-slate-800">
          <div className="bg-slate-800/50 rounded-lg p-5 mb-8 text-sm">
            <p className="text-slate-300 leading-relaxed">
              <span className="font-semibold text-white">Attorney Advertisement.</span>{' '}
              Legal services provided by The Berhe Law Firm, APC. Attorney Tamerat S. Berhe,
              California State Bar No. 298992. The information on this site is for general
              informational purposes only and does not constitute legal advice. No attorney-client
              relationship is formed by your use of this website. Past results do not guarantee
              future outcomes.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <p>© {year} Wipe That Record. All rights reserved.</p>
            <p>
              Licensed in California · CA State Bar #298992 ·{' '}
              <a
                href="https://apps.calbar.ca.gov/attorney/Licensee/Detail/298992"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors underline"
              >
                Verify
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
