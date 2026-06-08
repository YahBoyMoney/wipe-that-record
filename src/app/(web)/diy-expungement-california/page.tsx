import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'DIY California Expungement Kit - Clear Your Criminal Record Yourself | Wipe That Record',
  description:
    'Clear your California criminal record yourself with our DIY record-cleaning kit. Complete forms, step-by-step instructions, and guidance for just $97 (reg. $147). Prop 47, misdemeanor, and felony dismissal. Serving Los Angeles, Orange County, Riverside, San Bernardino.',
  keywords:
    'DIY expungement California, expungement kit California, clear criminal record California, California expungement forms, Prop 47, misdemeanor dismissal California, PC 1203.4 petition',
  openGraph: {
    title: 'DIY California Expungement Kit - Clear Your Record for $97',
    description:
      'DIY record-cleaning kit with all California forms, instructions, and support. A fraction of typical attorney fees.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Wipe That Record',
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
  alternates: {
    canonical: '/diy-expungement-california',
  },
};

const diyFeatures = [
  'Complete California forms package',
  'Step-by-step instructions',
  'Sample completed forms',
  'Email support included',
  'Prop 47 & SB 731 guidance',
];

const reviewFeatures = [
  'Everything in DIY',
  'Specialist completes your forms',
  'Case review & eligibility check',
  'Filing guidance',
];

const fullFeatures = [
  'Attorney-managed from prep to filing',
  'Attorney files your paperwork',
  'Court appearances handled if required',
  'Direct attorney access',
];

export default function DIYExpungementCaliforniaPage() {
  return (
    <main className="min-h-screen bg-[var(--parchment)]">
      {/* Hero */}
      <section className="ink-texture py-20 text-[var(--text-ink)]">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <div className="mb-5 flex items-center justify-center gap-3">
            <span className="h-px w-10 bg-[var(--brass)]" />
            <span className="eyebrow text-[var(--brass)]">DIY California record cleaning</span>
            <span className="h-px w-10 bg-[var(--brass)]" />
          </div>
          <h1 className="font-display text-4xl font-semibold leading-tight text-white sm:text-5xl">
            DIY California expungement kit
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-[var(--text-ink-muted)]">
            A complete DIY record-cleaning kit with California forms, step-by-step instructions, and
            samples. Prepare your own petition for $97 (regularly $147) &mdash; a fraction of typical
            attorney fees. Results vary by case.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/checkout/diy" className="btn btn-brass">
              Get DIY kit &mdash; $97
            </Link>
            <Link href="#pricing" className="btn btn-ghost-ink">
              Compare options
            </Link>
          </div>
          <p className="mx-auto mt-6 max-w-md text-sm text-[var(--text-ink-muted)]">
            No court filing fees in California since 2022 &middot; covers misdemeanors and many felonies
          </p>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16" id="pricing">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-semibold text-[var(--ink)]">
              Choose your level of help
            </h2>
            <p className="mt-3 text-[var(--text-muted)]">
              Start with DIY and upgrade anytime if your case turns out to be more complex.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {/* DIY */}
            <div className="card-paper relative flex flex-col p-8 ring-1 ring-[var(--brass)]/50">
              <span className="eyebrow absolute -top-3 left-8 rounded-full bg-[var(--brass)] px-3 py-1 text-[10px] text-[#2a1f0c]">
                Most chosen
              </span>
              <h3 className="font-display text-xl font-semibold text-[var(--ink)]">DIY Kit</h3>
              <div className="mt-3">
                <span className="text-[var(--text-muted)] line-through">$147</span>
                <span className="font-display ml-2 text-4xl font-semibold text-[var(--ink)]">$97</span>
              </div>
              <ul className="mt-6 flex-1 space-y-3 text-sm text-[var(--text)]">
                {diyFeatures.map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-[var(--brass-600)]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/checkout/diy" className="btn btn-primary mt-8 w-full">
                Get DIY Kit &mdash; $97
              </Link>
            </div>

            {/* Expert Review */}
            <div className="card-paper flex flex-col p-8">
              <h3 className="font-display text-xl font-semibold text-[var(--ink)]">Expert Review</h3>
              <div className="font-display mt-3 text-4xl font-semibold text-[var(--ink)]">$297</div>
              <ul className="mt-6 flex-1 space-y-3 text-sm text-[var(--text)]">
                {reviewFeatures.map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-[var(--brass-600)]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/checkout/review" className="btn btn-outline mt-8 w-full">
                Get Expert Review
              </Link>
            </div>

            {/* Full Service */}
            <div className="card-paper flex flex-col p-8">
              <h3 className="font-display text-xl font-semibold text-[var(--ink)]">Full Service</h3>
              <div className="font-display mt-3 text-4xl font-semibold text-[var(--ink)]">$1,497</div>
              <ul className="mt-6 flex-1 space-y-3 text-sm text-[var(--text)]">
                {fullFeatures.map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-[var(--brass-600)]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/checkout/full-service" className="btn btn-outline mt-8 w-full">
                Get Full Service
              </Link>
            </div>
          </div>

          <p className="mx-auto mt-10 max-w-3xl text-center text-sm leading-relaxed text-[var(--text-muted)]">
            True expungement does not exist in California; a granted petition results in a dismissal that
            limits what many private employers and landlords see, but does not erase the record. Results
            vary by case, and court timelines vary by county. With Full Service, an attorney-client
            relationship is formed only after a written engagement agreement is signed.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-[var(--line)] bg-[var(--paper)] py-16 px-4 text-center sm:px-6">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display text-2xl font-semibold text-[var(--ink)] sm:text-3xl">
            Ready to start your California petition?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-[var(--text-muted)]">
            Get the complete DIY record-cleaning kit today &mdash; currently $50 off the regular $147
            price.
          </p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/checkout/diy" className="btn btn-primary">
              Get DIY Kit &mdash; $97
            </Link>
            <Link href="/eligibility" className="btn btn-outline">
              Check eligibility free
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
