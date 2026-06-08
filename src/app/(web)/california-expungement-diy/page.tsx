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
    canonical: '/california-expungement-diy',
  },
};

const included = [
  {
    title: 'Complete California forms package',
    items: [
      'CR-180 Petition for Dismissal (PC 1203.4)',
      'CR-181 Order for Dismissal',
      'Prop 47 reduction forms (if applicable)',
      'SB 731 record sealing forms',
      'Local court cover sheets for CA counties',
    ],
  },
  {
    title: 'Step-by-step instructions',
    items: [
      'How to obtain your criminal record',
      'Eligibility requirements by case type',
      'Form completion with examples',
      'Where and how to file in your county',
      'What to expect during the court process',
    ],
  },
  {
    title: 'Sample completed forms',
    items: [
      'Real examples of properly filled forms',
      'Common case scenarios with solutions',
      'Tips to avoid rejection by the court',
    ],
  },
  {
    title: 'Email support',
    items: [
      'Questions answered promptly by email',
      'Guidance on complex situations',
      'Support throughout the process',
    ],
  },
  {
    title: 'County-specific information',
    items: [
      'Los Angeles County court locations',
      'Orange County filing requirements',
      'Riverside & San Bernardino specifics',
      'All 58 California counties covered',
    ],
  },
  {
    title: 'Updated for current California law',
    items: [
      'Recent Clean Slate changes',
      'Prop 47 & Prop 64 guidance',
      'SB 731 automatic sealing info',
    ],
  },
];

const goodFit = [
  'Misdemeanor convictions (DUI, theft under $950, drug possession, etc.)',
  'Felonies eligible for Prop 47 reduction to misdemeanors',
  'Simple cases where you completed probation successfully',
  'Budget-conscious individuals who want to save on attorney fees',
  'People comfortable with paperwork and detailed instructions',
  'Single convictions in one California county',
];

const considerHelp = [
  'Multiple convictions across different counties',
  'Serious or violent felonies that may not be eligible',
  'Cases with probation violations or complex issues',
  'Federal convictions (this kit is for California state cases only)',
  'Situations where you prefer someone else handle everything',
];

const steps = [
  {
    title: 'Determine eligibility',
    body: 'Most California misdemeanors and many felonies can be addressed if you completed probation successfully. Under Prop 47, many felonies can first be reduced to misdemeanors. Our kit includes a detailed eligibility checker.',
  },
  {
    title: 'Obtain your criminal record',
    body: 'Get your complete California criminal history. Our kit explains exactly how to request your records and what information you need for the petition.',
  },
  {
    title: 'Complete the forms',
    body: 'Fill out the CR-180 Petition for Dismissal and supporting documents using our step-by-step instructions and sample forms, which show you how to avoid common mistakes.',
  },
  {
    title: 'File at the court',
    body: 'Submit your petition to the same court where you were originally convicted. No filing fees are required in California since 2022. Our kit includes instructions for each major county.',
  },
  {
    title: 'Court review',
    body: 'The court reviews your petition on its own schedule, which varies by county and case type. If relief is granted, your record is updated to reflect the dismissal.',
  },
];

const faqs = [
  {
    q: 'How much does it cost to clean a record in California?',
    a: 'Our DIY kit costs $97 (regularly $147), compared to the $1,200–$2,500 many attorneys charge. California eliminated court filing fees in 2022, so you only pay our service fee.',
  },
  {
    q: 'What convictions can be dismissed in California?',
    a: 'Most misdemeanors and many felonies can be dismissed if you completed probation successfully, including DUI, theft under $950, and drug possession. Under Prop 47, many felonies can first be reduced to misdemeanors. Our kit includes a detailed eligibility checker. Results vary by case.',
  },
  {
    q: 'How long does the court take?',
    a: "You can prepare and file your paperwork quickly, but court timelines vary by county, case type, and the court's caseload. We do not control court schedules and cannot guarantee a specific approval date.",
  },
  {
    q: 'Do I need a lawyer?',
    a: 'No, you do not need a lawyer for straightforward cases. Our DIY kit includes the same forms attorneys use, plus instructions and email support. For multiple convictions or complex issues, our Expert Review ($297) or Full Service ($1,497) options are available.',
  },
  {
    q: "What's the difference between dismissal and record sealing?",
    a: 'A PC 1203.4 dismissal reopens your case, dismisses the conviction, and changes your plea. The arrest record remains but shows dismissal. SB 731 record sealing hides the record from most background checks. True expungement does not exist in California. Our kit explains which option fits your situation.',
  },
  {
    q: 'What happens after relief is granted?',
    a: 'If a dismissal is granted, your record is updated to show the case as dismissed, which can limit what many private employers and landlords see on background checks. It does not erase the record, and certain employers and agencies (such as law enforcement, schools, and some licensing bodies) may still access it.',
  },
];

const plans = [
  {
    name: 'DIY Kit',
    price: '$97',
    strike: '$147',
    href: '/checkout/diy',
    cta: 'Get DIY Kit — $97',
    popular: true,
    features: [
      'Complete California forms package',
      'Step-by-step instructions',
      'Sample completed forms',
      'Email support included',
      'Prop 47 & SB 731 guidance',
    ],
  },
  {
    name: 'Expert Review',
    price: '$297',
    href: '/checkout/review',
    cta: 'Get Expert Review',
    features: [
      'Everything in DIY',
      'Specialist completes your forms',
      'Case review & eligibility check',
      'Filing guidance',
    ],
  },
  {
    name: 'Full Service',
    price: '$1,497',
    href: '/checkout/full-service',
    cta: 'Get Full Service',
    features: [
      'Attorney-managed from prep to filing',
      'Attorney files your paperwork',
      'Court appearances handled if required',
      'Direct attorney access',
    ],
  },
];

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
  );
}

export default function CaliforniaExpungementDIYPage() {
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
            Clear your California record yourself
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-[var(--text-ink-muted)]">
            A complete DIY record-cleaning kit with all California forms, step-by-step instructions, and
            samples. Prepare your own petition for $97 (regularly $147) &mdash; a fraction of typical
            attorney fees. Results vary by case.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/checkout/diy" className="btn btn-brass">
              Get DIY kit &mdash; $97
            </Link>
            <Link href="#what-included" className="btn btn-ghost-ink">
              See what&rsquo;s included
            </Link>
          </div>
          <p className="mx-auto mt-6 max-w-xl text-sm text-[var(--text-ink-muted)]">
            No court filing fees in California since 2022 &middot; covers misdemeanors and many felonies
            &middot; Prop 47 &amp; SB 731 guidance included
          </p>
        </div>
      </section>

      {/* What's included */}
      <section className="py-16" id="what-included">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <h2 className="font-display text-center text-3xl font-semibold text-[var(--ink)]">
            What&rsquo;s included in your DIY kit
          </h2>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {included.map((block) => (
              <div key={block.title} className="card-paper p-7">
                <h3 className="font-display text-lg font-semibold text-[var(--ink)]">{block.title}</h3>
                <ul className="mt-4 space-y-2 text-sm text-[var(--text-muted)]">
                  {block.items.map((i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-[var(--brass)]" />
                      {i}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who it's for */}
      <section className="bg-[var(--paper)] py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <h2 className="font-display text-center text-3xl font-semibold text-[var(--ink)]">
            Is DIY right for you?
          </h2>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            <div className="card-paper p-8">
              <h3 className="font-display text-xl font-semibold text-[var(--ink)]">A good fit for</h3>
              <ul className="mt-5 space-y-3">
                {goodFit.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm text-[var(--text)]">
                    <CheckIcon className="mt-0.5 h-4 w-4 flex-shrink-0 text-[var(--brass-600)]" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
            <div className="card-paper p-8">
              <h3 className="font-display text-xl font-semibold text-[var(--ink)]">Consider more help for</h3>
              <ul className="mt-5 space-y-3">
                {considerHelp.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm text-[var(--text)]">
                    <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-[var(--text-muted)]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <div className="mt-6 rounded-lg border border-[var(--brass)]/30 bg-[var(--brass-100)]/40 p-4 text-sm text-[var(--text)]">
                Need more help? We also offer Expert Review ($297) and Full Service ($1,497).{' '}
                <Link href="#pricing" className="link-ink">
                  See all options
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="font-display text-center text-3xl font-semibold text-[var(--ink)]">
            How California record cleaning works
          </h2>
          <div className="mt-12 space-y-8">
            {steps.map((step, i) => (
              <div key={step.title} className="flex items-start gap-5">
                <div className="font-display flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-[var(--ink)] text-lg font-semibold text-white">
                  {i + 1}
                </div>
                <div>
                  <h3 className="font-display text-lg font-semibold text-[var(--ink)]">{step.title}</h3>
                  <p className="mt-1 text-[var(--text-muted)]">{step.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="bg-[var(--paper)] py-16" id="pricing">
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
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`card-paper relative flex flex-col p-8 ${
                  plan.popular ? 'ring-1 ring-[var(--brass)]/50' : ''
                }`}
              >
                {plan.popular && (
                  <span className="eyebrow absolute -top-3 left-8 rounded-full bg-[var(--brass)] px-3 py-1 text-[10px] text-[#2a1f0c]">
                    Most chosen
                  </span>
                )}
                <h3 className="font-display text-xl font-semibold text-[var(--ink)]">{plan.name}</h3>
                <div className="mt-3">
                  {plan.strike && (
                    <span className="text-[var(--text-muted)] line-through">{plan.strike}</span>
                  )}
                  <span className="font-display ml-2 text-4xl font-semibold text-[var(--ink)]">
                    {plan.price}
                  </span>
                </div>
                <ul className="mt-6 flex-1 space-y-3 text-sm text-[var(--text)]">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-3">
                      <CheckIcon className="mt-0.5 h-4 w-4 flex-shrink-0 text-[var(--brass-600)]" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={plan.href}
                  className={`mt-8 w-full ${plan.popular ? 'btn btn-primary' : 'btn btn-outline'}`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>

          <p className="mx-auto mt-10 max-w-3xl text-center text-sm leading-relaxed text-[var(--text-muted)]">
            True expungement does not exist in California; a granted petition results in a dismissal that
            limits what many private employers and landlords see, but does not erase the record. Results
            vary by case, and court timelines vary by county. With Full Service, an attorney-client
            relationship is formed only after a written engagement agreement is signed.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16" id="faq">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="font-display text-center text-3xl font-semibold text-[var(--ink)]">
            DIY California record cleaning FAQ
          </h2>
          <div className="mt-10 space-y-4">
            {faqs.map((faq) => (
              <details key={faq.q} className="card-paper group p-6">
                <summary className="flex cursor-pointer items-center justify-between font-semibold text-[var(--ink)]">
                  {faq.q}
                  <svg className="h-5 w-5 flex-shrink-0 text-[var(--brass-600)] transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <p className="mt-3 text-[var(--text-muted)]">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="ink-texture py-16 px-4 text-center text-[var(--text-ink)] sm:px-6">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display text-3xl font-semibold text-white">
            Ready to clear your California record?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-[var(--text-ink-muted)]">
            Get the complete DIY record-cleaning kit and start your petition today &mdash; currently $50
            off the regular $147 price.
          </p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/checkout/diy" className="btn btn-brass">
              Get DIY Kit &mdash; $97
            </Link>
            <Link href="/eligibility" className="btn btn-ghost-ink">
              Check eligibility free
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
