import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Orange County Record Cleaning - Clear Your Criminal Record in OC | Wipe That Record',
  description:
    'California record-cleaning help for Orange County, with a DIY kit from $97. Serving Irvine, Anaheim, and Newport Beach. DIY kits to full attorney service. Prop 47 and felony reduction where eligible. Court timelines vary by county.',
  keywords:
    'Orange County expungement, OC criminal record clearing, clear criminal record Orange County, Irvine expungement, Anaheim expungement, Prop 47 Orange County, felony reduction OC, DIY expungement kit Orange County',
  openGraph: {
    title: 'Orange County Record Cleaning - Clear Your Criminal Record',
    description:
      'Clear your criminal record in Orange County from $97. California record-relief help serving all OC cities.',
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
    canonical: '/orange-county',
  },
};

const benefits = [
  {
    title: 'Built for working professionals',
    body: 'Many Irvine and OC professionals pursue record relief to help with background checks and licensing. Our materials explain what relief does and does not change.',
  },
  {
    title: 'Orange County court guidance',
    body: 'We provide guidance on Orange County Superior Court procedures and local filing requirements for the Santa Ana, Westminster, Newport Beach, and Fullerton courthouses.',
  },
  {
    title: 'Choose your level of help',
    body: 'Start with the DIY kit and upgrade to Expert Review or Full Service at any time if your case is more complex or you want it managed for you.',
  },
];

const steps = [
  {
    title: 'Eligibility check',
    body: 'We help you review your Orange County record to assess eligibility under PC 1203.4 dismissal, Prop 47 felony reduction, or other California relief. Most misdemeanors and many felonies may qualify.',
  },
  {
    title: 'File at Orange County Superior Court',
    body: 'Your Petition for Dismissal (Form CR-180) is prepared for the correct OC courthouse — Santa Ana, Westminster, Newport Beach, or Fullerton. California eliminated court filing fees in 2022, so you only pay our service fee.',
  },
  {
    title: 'Court review',
    body: "Orange County judges review your petition on the court's own schedule, which varies by case type and caseload. With Full Service, an attorney handles any required hearings.",
  },
];

const eligible = [
  { mark: 'yes', text: 'Misdemeanors: DUI, theft under $950, drug possession, domestic violence (if no state prison)' },
  { mark: 'yes', text: 'Wobbler felonies: many can be reduced to misdemeanors under Prop 47, then dismissed' },
  { mark: 'yes', text: 'Some straight felonies: if you received probation (not state prison time)' },
  { mark: 'maybe', text: 'Serious/violent felonies: generally not eligible, but we can review your specific case' },
];

const cities = [
  'Anaheim', 'Irvine', 'Santa Ana', 'Huntington Beach',
  'Newport Beach', 'Fullerton', 'Costa Mesa', 'Mission Viejo',
  'Westminster', 'Buena Park', 'Tustin', 'Lake Forest',
  'Laguna Beach', 'Fountain Valley', 'Garden Grove', 'Yorba Linda',
];

const courthouses = [
  { name: 'Central Justice Center (Santa Ana)', addr: '700 Civic Center Drive West, Santa Ana, CA 92701' },
  { name: 'West Justice Center (Westminster)', addr: '8141 13th Street, Westminster, CA 92683' },
  { name: 'Harbor Justice Center (Newport Beach)', addr: '4601 Jamboree Road, Newport Beach, CA 92660' },
  { name: 'North Justice Center (Fullerton)', addr: '1275 N. Berkeley Avenue, Fullerton, CA 92832' },
];

const plans = [
  {
    name: 'DIY Service',
    price: '$97',
    strike: '$147',
    href: '/checkout/diy',
    cta: 'Get Started — $97',
    features: [
      'Complete OC forms package',
      'Step-by-step instructions',
      'Email support included',
      'Prop 47 reduction guide',
    ],
  },
  {
    name: 'Expert Review',
    price: '$297',
    href: '/checkout/review',
    cta: 'Get Expert Review',
    popular: true,
    features: [
      'Everything in DIY',
      'Specialist completes your forms',
      'Case review & filing prep',
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
      'Attorney files all paperwork',
      'Court appearances handled if required',
      'Direct attorney access',
    ],
  },
];

const faqs = [
  {
    q: 'How much does record cleaning cost in Orange County?',
    a: 'Our Orange County options start at $97 for DIY (regularly $147), $297 for Expert Review with form completion, and $1,497 for full attorney service. California eliminated court filing fees in 2022, so you only pay our service fee — significantly less than the $1,200–$2,500 many OC attorneys charge.',
  },
  {
    q: 'How long does the court take in Orange County?',
    a: "You can prepare and file your paperwork quickly, but the court reviews it on its own schedule. Timelines depend on which OC courthouse handles your case and the court's current caseload. We cannot guarantee a specific approval date.",
  },
  {
    q: 'Can I clear a felony in Orange County?',
    a: 'Many felonies may be eligible if you received probation (not state prison). Under Prop 47, many non-violent felonies can first be reduced to misdemeanors, then dismissed — examples include theft under $950 and drug possession. Eligibility depends on your case.',
  },
  {
    q: "What's the difference between dismissal and record sealing?",
    a: 'California uses dismissal (PC 1203.4) rather than true expungement: your case is reopened, the conviction dismissed, and plea changed. The arrest record remains but shows dismissal. Record sealing (SB 731) is newer and hides the record from most background checks. We can advise which fits your case.',
  },
  {
    q: 'Do I need a lawyer for Orange County record cleaning?',
    a: 'Many straightforward OC cases can be handled with the DIY kit. Experienced help can be valuable for complex situations. Choose $97 DIY for simple cases, $297 Expert Review for assistance, or $1,497 Full Service for complex situations. Start with a free eligibility check.',
  },
  {
    q: 'Will employers see my record after relief?',
    a: 'A dismissal can limit what many private employers see on background checks, but it does not erase the record. Certain employers and agencies (schools, healthcare, law enforcement, and some licensing bodies) may still access dismissed cases.',
  },
  {
    q: 'Can I get DUI relief in Orange County?',
    a: 'Many DUI convictions may be eligible for dismissal if you completed probation successfully, including some first and second DUIs and wet reckless convictions. The DMV record remains, but the criminal conviction may be dismissed where eligible.',
  },
];

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
  );
}

export default function OrangeCountyPage() {
  return (
    <main className="min-h-screen bg-[var(--parchment)]">
      {/* Hero */}
      <section className="ink-texture py-20 text-[var(--text-ink)]">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="h-px w-10 bg-[var(--brass)]" />
            <span className="eyebrow text-[var(--brass)]">Orange County, California</span>
          </div>
          <h1 className="font-display mt-6 max-w-2xl text-4xl font-semibold leading-tight text-white sm:text-5xl">
            Clear your criminal record in Orange County
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[var(--text-ink-muted)]">
            California record-cleaning help for Orange County, with a DIY kit starting at $97. We help
            OC residents pursue relief for misdemeanors, eligible felonies, DUI convictions, and Prop 47
            cases &mdash; serving Irvine, Newport Beach, Anaheim, Huntington Beach, and all OC cities.
            Court timelines vary by county and case type.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/checkout/diy" className="btn btn-brass">
              Get DIY kit &mdash; $97
            </Link>
            <Link href="/eligibility" className="btn btn-ghost-ink">
              Check eligibility free
            </Link>
          </div>
          <p className="mt-6 max-w-2xl text-sm text-[var(--text-ink-muted)]">
            Prop 47 reductions &middot; no court filing fees (2022 CA law) &middot; DIY to full attorney
            service &middot; felony reduction where eligible
          </p>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <h2 className="font-display text-center text-3xl font-semibold text-[var(--ink)]">
            Why Orange County residents choose us
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {benefits.map((b) => (
              <div key={b.title} className="card-paper p-7">
                <h3 className="font-display text-lg font-semibold text-[var(--ink)]">{b.title}</h3>
                <p className="mt-2 text-[var(--text-muted)]">{b.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process + eligibility */}
      <section className="bg-[var(--paper)] py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <h2 className="font-display text-center text-3xl font-semibold text-[var(--ink)]">
            How Orange County record cleaning works
          </h2>
          <div className="mt-12 grid gap-10 lg:grid-cols-2">
            <div className="space-y-6">
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

            <div className="rounded-xl border border-[var(--brass)]/30 bg-[var(--brass-100)]/40 p-8">
              <h3 className="font-display text-xl font-semibold text-[var(--ink)]">
                What may be eligible in Orange County?
              </h3>
              <ul className="mt-5 space-y-4">
                {eligible.map((e) => (
                  <li key={e.text} className="flex items-start gap-3 text-sm text-[var(--text)]">
                    {e.mark === 'yes' ? (
                      <CheckIcon className="mt-0.5 h-4 w-4 flex-shrink-0 text-[var(--brass-600)]" />
                    ) : (
                      <span className="mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full border border-[var(--text-muted)] text-[10px] font-bold text-[var(--text-muted)]">
                        ?
                      </span>
                    )}
                    <span>{e.text}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 rounded-lg border border-[var(--line)] bg-[var(--paper)] p-4 text-sm text-[var(--text-muted)]">
                Not sure if your conviction qualifies? Our free eligibility check reviews your case and
                explains your options.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cities + courthouses */}
      <section className="py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <h2 className="font-display text-center text-3xl font-semibold text-[var(--ink)]">
            Serving every Orange County city
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-[var(--text-muted)]">
            We help clients across Orange County and prepare filings for all OC Superior Court locations.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {cities.map((city) => (
              <span
                key={city}
                className="rounded-full border border-[var(--line)] bg-[var(--paper)] px-4 py-2 text-sm font-medium text-[var(--text)]"
              >
                {city}
              </span>
            ))}
          </div>

          <div className="card-paper mt-12 p-8">
            <h3 className="font-display text-center text-xl font-semibold text-[var(--ink)]">
              Orange County Superior Court locations we prepare filings for
            </h3>
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              {courthouses.map((c) => (
                <div key={c.name}>
                  <h4 className="font-semibold text-[var(--ink)]">{c.name}</h4>
                  <p className="mt-1 text-sm text-[var(--text-muted)]">{c.addr}</p>
                </div>
              ))}
            </div>
            <p className="mt-6 text-center text-sm text-[var(--text-muted)]">
              We help you file at the correct courthouse based on where your original case was heard.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="bg-[var(--paper)] py-16" id="pricing">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <h2 className="font-display text-center text-3xl font-semibold text-[var(--ink)]">
            Orange County service options
          </h2>
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
            This page is general information, not legal advice. True expungement does not exist in
            California; eligible cases may qualify for dismissal, sealing, felony reduction, or other
            relief. Outcomes and timelines are not guaranteed and vary by case and court. With Full
            Service, an attorney-client relationship is formed only after a written engagement agreement
            is signed.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="font-display text-center text-3xl font-semibold text-[var(--ink)]">
            Orange County record cleaning FAQ
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
            Ready to clear your Orange County record?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-[var(--text-ink-muted)]">
            Start with a free eligibility check, then choose the option that fits your case.
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
