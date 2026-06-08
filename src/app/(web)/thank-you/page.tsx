'use client';
import Link from 'next/link';

const SUPPORT_EMAIL = process.env.NEXT_PUBLIC_SUPPORT_EMAIL || 'support@wipethatrecord.com';

const reviewFeatures = [
  'Case record lookup',
  'Specialist completes your California forms',
  'Eligibility verification & case review',
  'Filing guidance and email support',
];

const fullFeatures = [
  'Attorney-managed from preparation through filing',
  'Attorney prepares and files your paperwork',
  'Court appearances handled if required',
  'Direct attorney access',
  'Written engagement agreement',
];

function Check() {
  return (
    <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-[var(--brass-600)]" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
  );
}

export default function ThankYouPage() {
  return (
    <div className="min-h-screen bg-[var(--parchment)]">
      {/* Confirmation */}
      <section className="ink-texture py-20 text-center text-[var(--text-ink)]">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="mx-auto mb-7 flex h-16 w-16 items-center justify-center rounded-full border border-[var(--brass)]">
            <svg className="h-8 w-8 text-[var(--brass)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="font-display text-4xl font-semibold text-white sm:text-5xl">Thank you — check your email</h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-[var(--text-ink-muted)]">
            Your DIY record-cleaning kit has been sent to the email you used at checkout, with your
            California forms, instructions, and samples.
          </p>
          <p className="mx-auto mt-3 max-w-2xl text-[var(--text-ink-muted)]">
            If your case turns out to be more complex than expected, you can add more help below.
          </p>
        </div>
      </section>

      {/* Upgrade options */}
      <section className="py-20 px-4 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <div className="mx-auto max-w-2xl text-center">
            <span className="eyebrow text-[var(--brass-600)]">Optional upgrades</span>
            <h2 className="font-display mt-3 text-3xl font-semibold text-[var(--ink)] sm:text-4xl">
              Want more hands-on help?
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-[var(--text-muted)]">
              The DIY kit covers straightforward cases. If you would rather have a specialist or
              attorney handle more of the work, choose the level that fits your situation.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {/* Expert Review */}
            <div className="card-paper relative flex flex-col p-8">
              <span className="eyebrow absolute -top-3 left-8 rounded-full bg-[var(--brass)] px-3 py-1 text-[10px] text-[#2a1f0c]">
                Most chosen
              </span>
              <h3 className="font-display text-2xl font-semibold text-[var(--ink)]">$297 — Expert Review</h3>
              <p className="mt-2 text-[var(--text-muted)]">
                A specialist looks up your case, completes your paperwork, and reviews it before you file.
              </p>
              <ul className="mt-6 space-y-3">
                {reviewFeatures.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm text-[var(--text)]">
                    <Check /> {f}
                  </li>
                ))}
              </ul>
              <Link href="/api/checkout/upgrade?type=review" className="btn btn-outline mt-8 w-full">
                Upgrade for $297
              </Link>
            </div>

            {/* Full Service */}
            <div className="section-ink relative flex flex-col rounded-xl p-8 text-[var(--text-ink)] ring-1 ring-[var(--brass)]/40">
              <span className="eyebrow absolute -top-3 left-8 rounded-full bg-[var(--brass)] px-3 py-1 text-[10px] text-[#2a1f0c]">
                Premium
              </span>
              <h3 className="font-display text-2xl font-semibold text-white">$1,497 — Full Service</h3>
              <p className="mt-2 text-[var(--text-ink-muted)]">
                Attorney-managed support that takes your case from preparation through filing.
              </p>
              <ul className="mt-6 space-y-3">
                {fullFeatures.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm text-[var(--text-ink)]">
                    <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-[var(--brass)]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/api/checkout/upgrade?type=full" className="btn btn-brass mt-8 w-full">
                Explore Full Service — $1,497
              </Link>
            </div>
          </div>

          <p className="mx-auto mt-8 max-w-3xl text-center text-sm leading-relaxed text-[var(--text-muted)]">
            Results vary by case. With Full Service, an attorney-client relationship is formed only
            after a written engagement agreement is signed. We do not control court schedules and
            cannot guarantee a specific outcome or timeline.
          </p>
        </div>
      </section>

      {/* Support footer */}
      <section className="border-t border-[var(--line)] bg-[var(--paper)] py-14 px-4 text-center sm:px-6">
        <div className="mx-auto max-w-3xl">
          <h3 className="font-display text-xl font-semibold text-[var(--ink)]">
            Questions about which option fits?
          </h3>
          <p className="mt-3 text-[var(--text-muted)]">
            Our team can help you choose the right level of support for your situation.
          </p>
          <a href={`mailto:${SUPPORT_EMAIL}`} className="link-ink mt-5 inline-flex items-center gap-2">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            {SUPPORT_EMAIL}
          </a>
        </div>
      </section>
    </div>
  );
}
