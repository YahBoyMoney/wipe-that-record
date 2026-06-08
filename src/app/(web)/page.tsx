'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Hero } from '@/components/Hero';
import { PlanCard } from '@/components/PlanCard';
import { LeadCaptureForm } from '@/components/LeadCaptureForm';
import { LocalCourthouses } from '@/components/LocalCourthouses';
import { track } from '@/lib/track';

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

export default function LandingPage() {
  const [showExitModal, setShowExitModal] = useState(false);
  const [hasSeenExitModal, setHasSeenExitModal] = useState(false);
  const [showCookieBanner, setShowCookieBanner] = useState(false);
  const [showQualificationModal, setShowQualificationModal] = useState(false);

  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !hasSeenExitModal) {
        setShowExitModal(true);
        setHasSeenExitModal(true);
      }
    };

    const hasAcceptedCookies = localStorage.getItem('cookiesAccepted');
    if (!hasAcceptedCookies) setShowCookieBanner(true);

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, [hasSeenExitModal]);

  const acceptCookies = () => {
    localStorage.setItem('cookiesAccepted', 'true');
    setShowCookieBanner(false);
  };

  const openQualificationModal = (ctaLabel = 'unknown') => {
    track('eligibility_cta_click', { source_page: '/', cta_label: ctaLabel });
    setShowQualificationModal(true);
  };

  return (
    <>
      {/* Cookie Banner */}
      {showCookieBanner && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="fixed bottom-0 left-0 right-0 z-50 section-ink p-4 text-[var(--text-ink)]"
        >
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-[var(--text-ink-muted)]">
              We use cookies to improve your experience and understand site traffic. By continuing,
              you consent to our use of cookies.
            </p>
            <div className="flex gap-3">
              <button onClick={acceptCookies} className="btn btn-brass text-sm">
                Accept
              </button>
              <button onClick={() => setShowCookieBanner(false)} className="btn btn-ghost-ink text-sm">
                Decline
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Qualification Modal */}
      {showQualificationModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/55 p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative w-full max-w-md"
          >
            <LeadCaptureForm
              variant="modal"
              leadMagnet="landing-page-qualification"
              onClose={() => setShowQualificationModal(false)}
            />
          </motion.div>
        </motion.div>
      )}

      {/* Exit Intent Modal */}
      {showExitModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="card-paper w-full max-w-md p-8 text-center shadow-2xl"
          >
            <h3 className="font-display text-2xl font-semibold text-[var(--ink)]">Before you go</h3>
            <p className="mt-3 text-[var(--text-muted)]">
              Not sure if your case qualifies? Take the free 2-minute eligibility check first &mdash;
              no payment required.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => {
                  setShowExitModal(false);
                  openQualificationModal('exit_intent_modal');
                }}
                className="btn btn-primary flex-1"
              >
                Check eligibility free
              </button>
              <button onClick={() => setShowExitModal(false)} className="btn btn-outline flex-1">
                No thanks
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      <main className="overflow-x-hidden bg-[var(--parchment)]">
        <Hero variant="a" />

        {/* The stakes — why a record matters (asymmetric editorial layout) */}
        <section className="section-paper border-y border-[var(--line)] py-20 px-4 sm:px-6">
          <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[5fr_7fr] lg:gap-16">
            <motion.div {...fadeUp} className="lg:sticky lg:top-28 lg:self-start">
              <span className="eyebrow-line eyebrow text-[var(--brass-600)]">What&rsquo;s at stake</span>
              <h2 className="font-display display-lg mt-4 font-semibold text-[var(--ink)]">
                A closed case can still follow you for years.
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-[var(--text-muted)]">
                Long after a sentence is served, a record keeps showing up where it matters most.
                Relief won&rsquo;t rewrite the past &mdash; but for many Californians it changes what
                others can see going forward.
              </p>
            </motion.div>

            <motion.div {...fadeUp} className="divide-y divide-[var(--line)]">
              {[
                {
                  n: '01',
                  label: 'Employment',
                  body: 'Background checks can stall hiring and promotions, even for roles you are qualified for.',
                },
                {
                  n: '02',
                  label: 'Housing',
                  body: 'Landlords routinely screen applicants, and a record can quietly remove you from the list.',
                },
                {
                  n: '03',
                  label: 'Licensing',
                  body: 'Professional and occupational boards may weigh a conviction when reviewing your application.',
                },
              ].map((item) => (
                <div key={item.label} className="grid grid-cols-[auto_1fr] gap-x-6 py-7 first:pt-0">
                  <span className="font-display text-2xl font-semibold text-[var(--brass)]">{item.n}</span>
                  <div>
                    <h3 className="font-display text-xl font-semibold text-[var(--ink)]">{item.label}</h3>
                    <p className="mt-2 leading-relaxed text-[var(--text-muted)]">{item.body}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Diagnosis / pathway — the quiz routes you */}
        <section className="ink-texture py-20 px-4 text-[var(--text-ink)] sm:px-6">
          <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
            <motion.div {...fadeUp}>
              <span className="eyebrow text-[var(--brass)]">Find your path</span>
              <h2 className="font-display mt-3 text-3xl font-semibold leading-tight text-white sm:text-4xl">
                California has several relief paths. The quiz finds yours.
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-[var(--text-ink-muted)]">
                Dismissal, record sealing, felony reduction, automatic relief &mdash; eligibility
                turns on your conviction type, county, and timeline. Our private 2-minute review
                points you to the options that may actually apply, then to the service that fits.
              </p>
              <button onClick={() => openQualificationModal('find_your_path')} className="btn btn-brass mt-8 text-base">
                Start the free eligibility review
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
              <p className="mt-4 text-sm text-[var(--text-ink-muted)]">
                Private &middot; No payment to see your options &middot; Results sent to your email
              </p>
            </motion.div>

            <motion.ol {...fadeUp} className="space-y-5">
              {[
                { n: '01', t: 'Tell us about your case', b: 'Conviction type, county, probation status, and what you are trying to unlock.' },
                { n: '02', t: 'We map your relief options', b: 'You see which California paths may apply and what each one realistically does.' },
                { n: '03', t: 'You get a service recommendation', b: 'DIY for straightforward cases, review before filing, or full service for complex ones.' },
              ].map((step) => (
                <li key={step.n} className="flex gap-5 rounded-xl border border-[var(--line-ink)] bg-white/[0.04] p-6">
                  <span className="font-display text-2xl font-semibold text-[var(--brass)]">{step.n}</span>
                  <div>
                    <p className="font-semibold text-white">{step.t}</p>
                    <p className="mt-1 text-sm text-[var(--text-ink-muted)]">{step.b}</p>
                  </div>
                </li>
              ))}
            </motion.ol>
          </div>
        </section>

        {/* Plans */}
        <section id="plans" className="section-parchment py-20 px-4 sm:px-6">
          <div className="mx-auto max-w-6xl">
            <motion.div {...fadeUp} className="max-w-2xl">
              <span className="eyebrow text-[var(--brass-600)]">Choose your path</span>
              <h2 className="font-display mt-3 text-3xl font-semibold leading-tight text-[var(--ink)] sm:text-4xl">
                Three levels of help. Matched to how complex your case is.
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-[var(--text-muted)]">
                Not sure which one fits? The eligibility review recommends a path before you pay
                anything.
              </p>
            </motion.div>

            <div className="mt-12 grid gap-6 lg:grid-cols-3">
              <PlanCard
                title="DIY Kit"
                price="$97"
                originalPrice="$147"
                description="For straightforward cases where you want the right forms and clear instructions."
                features={[
                  'Complete California forms package',
                  'Step-by-step filing instructions',
                  'Sample completed forms',
                  'Email support included',
                  'Instant access after purchase',
                ]}
                cta="Get the DIY Kit — $97"
                ctaVariant="primary"
                popular={true}
                badge="Most chosen"
                href="/checkout/diy"
                plan="diy"
              />
              <PlanCard
                title="Expert Review"
                price="$297"
                description="Before you file: a specialist reviews your case and paperwork to reduce mistakes."
                features={[
                  'Everything in the DIY Kit',
                  'Specialist completes your forms',
                  'Case-specific review & analysis',
                  'Phone consultation',
                  'Filing guidance',
                ]}
                cta="Get Expert Review"
                ctaVariant="secondary"
                popular={false}
                href="/checkout/review"
                plan="review"
              />
              <PlanCard
                title="Full Service"
                price="$1,497"
                description="For complex cases: attorney-managed support from preparation through filing."
                features={[
                  'Attorney-managed service',
                  'Attorney prepares and files paperwork',
                  'Court appearances handled if required',
                  'Direct attorney access',
                  'Written engagement agreement',
                ]}
                cta="Explore Full Service"
                ctaVariant="secondary"
                popular={false}
                badge="Premium"
                href="/checkout/full-service"
                plan="full_service"
              />
            </div>

            <div className="mt-8 flex justify-center">
              <button onClick={() => openQualificationModal('plans_helper')} className="link-ink inline-flex items-center gap-2 text-sm">
                Not sure which fits your case? Find out free
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </div>
          </div>
        </section>

        {/* Comparison matrix */}
        <section className="section-paper border-y border-[var(--line)] py-20 px-4 sm:px-6">
          <div className="mx-auto max-w-4xl">
            <motion.h2 {...fadeUp} className="font-display text-center text-3xl font-semibold text-[var(--ink)]">
              Compare your options
            </motion.h2>
            <div className="mt-10 overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b-2 border-[var(--ink)]">
                    <th className="py-3 pr-4 font-semibold text-[var(--text-muted)]">Feature</th>
                    <th className="font-display px-3 py-3 text-center text-base font-semibold text-[var(--ink)]">DIY Kit</th>
                    <th className="font-display px-3 py-3 text-center text-base font-semibold text-[var(--ink)]">Expert Review</th>
                    <th className="font-display px-3 py-3 text-center text-base font-semibold text-[var(--ink)]">Full Service</th>
                  </tr>
                </thead>
                <tbody className="text-[var(--text)]">
                  {[
                    ['Forms and instructions', 'Yes', 'Yes', 'Yes'],
                    ['Case-specific review', '—', 'Yes', 'Yes'],
                    ['Attorney-managed filing', '—', '—', 'Yes'],
                    ['Court appearances handled', '—', '—', 'If required'],
                    ['Best for', 'Simple cases', 'Unsure cases', 'Complex cases'],
                  ].map((row) => (
                    <tr key={row[0]} className="border-b border-[var(--line)]">
                      <td className="py-3.5 pr-4 font-medium text-[var(--text-muted)]">{row[0]}</td>
                      <td className="px-3 py-3.5 text-center">{row[1]}</td>
                      <td className="px-3 py-3.5 text-center">{row[2]}</td>
                      <td className="px-3 py-3.5 text-center">{row[3]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* What happens after purchase */}
        <section className="section-parchment py-20 px-4 sm:px-6">
          <div className="mx-auto max-w-5xl">
            <motion.div {...fadeUp} className="max-w-2xl">
              <span className="eyebrow text-[var(--brass-600)]">After you buy</span>
              <h2 className="font-display mt-3 text-3xl font-semibold leading-tight text-[var(--ink)] sm:text-4xl">
                What happens once you have the DIY kit
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-[var(--text-muted)]">
                No waiting and no surprises &mdash; you get everything you need to prepare your
                California paperwork the moment you check out.
              </p>
            </motion.div>

            <div className="mt-12 grid gap-6 md:grid-cols-2">
              {[
                { title: 'Instant access to your kit', body: 'Right after checkout you receive the California forms package, step-by-step instructions, and sample completed forms.' },
                { title: 'Clear filing instructions', body: 'Plain-language guidance walks you through completing your forms and filing with the correct court for your county.' },
                { title: 'Email support included', body: 'Questions while you work through the kit? Reach our support team by email for help with the process.' },
                { title: 'Upgrade any time', body: 'If your case turns out to be more complex, add expert review or full service so a specialist handles more for you.' },
              ].map((item) => (
                <div key={item.title} className="card-paper p-7">
                  <h3 className="font-display text-lg font-semibold text-[var(--ink)]">{item.title}</h3>
                  <p className="mt-2 leading-relaxed text-[var(--text-muted)]">{item.body}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-xl border border-[var(--brass)]/30 bg-[var(--brass-100)]/40 p-6">
              <p className="font-semibold text-[var(--ink)]">Eligibility &amp; refund reassurance</p>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--text-muted)]">
                Not sure you qualify? Start with the free eligibility check. If you buy the kit and
                your case does not match your eligibility after review, you are covered by our 30-day
                refund. Court timelines and outcomes vary by county and case type.
              </p>
            </div>
          </div>
        </section>

        {/* Objection handling */}
        <section className="section-paper border-y border-[var(--line)] py-20 px-4 sm:px-6">
          <div className="mx-auto max-w-5xl">
            <motion.div {...fadeUp} className="max-w-2xl">
              <span className="eyebrow text-[var(--brass-600)]">Honest answers</span>
              <h2 className="font-display mt-3 text-3xl font-semibold leading-tight text-[var(--ink)] sm:text-4xl">
                The questions people actually hesitate on
              </h2>
            </motion.div>
            <div className="mt-12 grid gap-x-12 gap-y-8 md:grid-cols-2">
              {[
                { q: 'Is this just expensive paperwork I could do myself?', a: 'For straightforward cases, the DIY kit gives you exactly the right California forms and instructions for far less than hiring a firm. The value is knowing which forms apply and filing them correctly the first time.' },
                { q: 'What if I file it wrong?', a: 'That is what Expert Review exists for. A specialist checks your case and paperwork before you file, which reduces the kind of mistakes that lead to delays or rejections.' },
                { q: 'My case feels complicated.', a: 'Some cases involve felonies, multiple counties, or prior denials. Full Service is attorney-managed for exactly these situations, from preparation through any court appearances.' },
                { q: 'Will this actually erase my record?', a: 'True expungement does not exist in California. Eligible cases may qualify for dismissal, sealing, or reduction, which limits what most background checks show. We are upfront about what relief can and cannot do.' },
              ].map((item) => (
                <div key={item.q} className="border-l-2 border-[var(--brass)] pl-5">
                  <h3 className="font-semibold text-[var(--ink)]">{item.q}</h3>
                  <p className="mt-2 leading-relaxed text-[var(--text-muted)]">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Credibility & compliance */}
        <section className="section-parchment py-20 px-4 sm:px-6">
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-2">
            <motion.div {...fadeUp} className="card-paper p-8">
              <span className="eyebrow text-[var(--brass-600)]">Why people trust us with this</span>
              <h3 className="font-display mt-3 text-2xl font-semibold text-[var(--ink)]">
                Built specifically for California record relief
              </h3>
              <ul className="mt-6 space-y-4">
                {[
                  'Forms and guidance built around California statutes and county court procedures — not a generic national template.',
                  'Three transparent service levels so you only pay for the help your case actually needs.',
                  'Clear, compliant explanations of what each relief path does and does not change.',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-[var(--text)]">
                    <svg className="mt-1 h-4 w-4 flex-shrink-0 text-[var(--brass-600)]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div {...fadeUp} className="rounded-xl border border-[var(--line)] bg-[var(--paper)] p-8">
              <span className="eyebrow text-[var(--brass-600)]">Important, in plain language</span>
              <h3 className="font-display mt-3 text-2xl font-semibold text-[var(--ink)]">
                How we work, and what we promise
              </h3>
              <div className="mt-6 space-y-4 text-sm leading-relaxed text-[var(--text-muted)]">
                <p>
                  The DIY kit is legal document-preparation support, not legal advice. Using this
                  site does not create an attorney-client relationship.
                </p>
                <p>
                  With Full Service, an attorney-client relationship is formed only after a written
                  engagement agreement is signed.
                </p>
                <p>
                  Results vary by case. We do not control court schedules, and we cannot guarantee a
                  specific outcome or approval date. Court timelines vary by county.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Local trust — Inland Empire courthouse coverage */}
        <LocalCourthouses sourcePage="/" />

        {/* FAQ tied to conversion */}
        <section className="section-paper border-t border-[var(--line)] py-20 px-4 sm:px-6">
          <div className="mx-auto max-w-3xl">
            <motion.div {...fadeUp} className="text-center">
              <span className="eyebrow text-[var(--brass-600)]">Before you decide</span>
              <h2 className="font-display mt-3 text-3xl font-semibold text-[var(--ink)] sm:text-4xl">
                Frequently asked questions
              </h2>
            </motion.div>

            <div className="mt-12 space-y-3">
              {[
                { question: 'Is this legal advice?', answer: 'The DIY kit is document-preparation support, not legal advice. Using this site does not create an attorney-client relationship. If you choose full service, an attorney-client relationship is formed only after a written engagement agreement is signed.' },
                { question: 'Will this erase my record completely?', answer: 'True expungement does not exist in California. Depending on your case, you may be eligible for relief such as dismissal, record sealing, felony reduction, or automatic record relief. We help you identify and pursue the options that may apply to your situation.' },
                { question: 'Can employers still see my record?', answer: 'Record relief can limit what appears in many public and employment background checks, but some government agencies, licensing bodies, and legally authorized employers may still access certain records.' },
                { question: 'How long does the court take?', answer: 'You can get started and prepare paperwork quickly, but court timelines vary by county, case type, and eligibility. We do not control court schedules and cannot guarantee a specific approval date.' },
                { question: 'What if I don’t qualify?', answer: 'Start with the free eligibility check before paying. If you buy the DIY kit and your case does not match your eligibility after review, you are covered by our 30-day refund policy.' },
              ].map((faq) => (
                <details key={faq.question} className="group card-paper">
                  <summary className="flex cursor-pointer items-center justify-between p-6">
                    <h3 className="pr-4 font-semibold text-[var(--ink)]">{faq.question}</h3>
                    <span className="text-[var(--brass-600)] transition-transform group-open:rotate-45 text-xl leading-none">+</span>
                  </summary>
                  <p className="px-6 pb-6 leading-relaxed text-[var(--text-muted)]">{faq.answer}</p>
                </details>
              ))}
            </div>

            <motion.div {...fadeUp} className="mt-10 rounded-xl border border-[var(--brass)]/30 bg-[var(--brass-100)]/40 p-7 text-center">
              <h3 className="font-display text-xl font-semibold text-[var(--ink)]">
                Still unsure about your specific case?
              </h3>
              <p className="mt-2 text-[var(--text-muted)]">
                The free eligibility review gives you answers based on your conviction type and county.
              </p>
              <button onClick={() => openQualificationModal('faq_cta')} className="btn btn-primary mt-5">
                Get my eligibility review
              </button>
            </motion.div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="ink-texture py-24 px-4 text-center sm:px-6">
          <div className="mx-auto max-w-3xl">
            <motion.h2 {...fadeUp} className="font-display text-3xl font-semibold leading-tight text-white sm:text-4xl">
              Take the first step today
            </motion.h2>
            <motion.p {...fadeUp} className="mx-auto mt-5 max-w-2xl text-lg text-[var(--text-ink-muted)]">
              Start with a free, private eligibility check to see which California record-cleaning
              options may apply to your case.
            </motion.p>
            <motion.div {...fadeUp} className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <button onClick={() => openQualificationModal('final_cta')} className="btn btn-brass text-base">
                Check if I qualify — free
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
              <a
                href="/checkout/diy"
                onClick={() => track('plan_cta_click', { source_page: '/', plan: 'diy', cta_label: 'final_cta' })}
                className="btn btn-ghost-ink text-base"
              >
                Get the DIY Kit — $97
              </a>
            </motion.div>
            <motion.p {...fadeUp} className="mt-6 text-sm text-[var(--text-ink-muted)]">
              Instant access &middot; 30-day refund if your case does not qualify after review
            </motion.p>
          </div>
        </section>
      </main>
    </>
  );
}
