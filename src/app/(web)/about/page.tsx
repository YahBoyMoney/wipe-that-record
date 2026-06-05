import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About Us | Wipe That Record',
  description:
    'Learn about The Berhe Law Firm, the California attorneys behind Wipe That Record, and our mission to make expungement affordable and accessible.',
  alternates: { canonical: '/about' },
}

const stats = [
  { value: '1,847+', label: 'Californians Served' },
  { value: '98.7%', label: 'Success Rate on Eligible Cases' },
  { value: '21', label: 'Average Days to Approval' },
  { value: '$50', label: 'Starting Price for DIY' },
]

const values = [
  {
    title: 'Access over gatekeeping',
    body:
      'Traditional firms charge $1,500–$3,000 to file a single expungement. We built a tiered system so people who can do the work themselves pay $97 — not thousands.',
    icon: '🔓',
  },
  {
    title: 'Honesty about outcomes',
    body:
      'We will tell you if your case is unlikely to be granted before you pay. A clean refund beats a bad filing.',
    icon: '🎯',
  },
  {
    title: 'California specialists',
    body:
      'We do one thing — California criminal record relief — and we do it under Penal Code §1203.4, Prop 47, and SB 731.',
    icon: '⚖️',
  },
]

export default function About() {
  return (
    <main className="bg-white dark:bg-slate-900">
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="inline-block bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full mb-5">
            About Wipe That Record
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
            Clearing California records, one case at a time.
          </h1>
          <p className="text-lg text-slate-700 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Wipe That Record is a service of <strong>The Berhe Law Firm, APC</strong>, a California
            law firm based in the Inland Empire. We help Californians remove eligible convictions
            from their record so they can get the job, the apartment, and the second chance they
            deserve.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                  {s.value}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Attorney */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-10 items-start">
            <div className="md:col-span-1">
              <div className="aspect-[3/4] rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-white">
                <div className="text-center px-4">
                  <div className="text-6xl mb-3">⚖️</div>
                  <p className="font-semibold">Tamerat S. Berhe, Esq.</p>
                  <p className="text-blue-200 text-sm mt-1">CA Bar No. 298992</p>
                </div>
              </div>
            </div>
            <div className="md:col-span-2">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
                Meet your attorney
              </h2>
              <p className="text-slate-700 dark:text-slate-300 mb-4 leading-relaxed">
                <strong>Tamerat &ldquo;Tam&rdquo; Berhe</strong> is the founder of The Berhe Law
                Firm, APC, a California law firm serving the Inland Empire and all 58 California
                counties. He is admitted to practice in California (Bar No. 298992) and focuses on
                criminal record relief, personal injury, and estate planning.
              </p>
              <p className="text-slate-700 dark:text-slate-300 mb-4 leading-relaxed">
                After watching too many clients lose jobs and housing over old, minor convictions,
                he built Wipe That Record to make expungement accessible to people who can&rsquo;t
                afford a $3,000 retainer.
              </p>
              <div className="flex flex-wrap gap-3 mt-6">
                <a
                  href="https://apps.calbar.ca.gov/attorney/Licensee/Detail/298992"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Verify CA Bar status
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
                <a
                  href="https://berhelaw.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Visit The Berhe Law Firm
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 px-4 bg-slate-50 dark:bg-slate-800/50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-slate-900 dark:text-white mb-12">
            What we believe
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((v) => (
              <div
                key={v.title}
                className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-sm border border-slate-200 dark:border-slate-700"
              >
                <div className="text-4xl mb-4">{v.icon}</div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">{v.title}</h3>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-sm">
                  {v.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
            Ready to clear your record?
          </h2>
          <p className="text-slate-700 dark:text-slate-300 mb-8">
            Take our 2-minute eligibility check to see which option fits your case.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/#plans"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              See Pricing
            </Link>
            <Link
              href="/contact"
              className="border border-slate-300 dark:border-slate-700 hover:border-blue-600 dark:hover:border-blue-400 text-slate-900 dark:text-white font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
