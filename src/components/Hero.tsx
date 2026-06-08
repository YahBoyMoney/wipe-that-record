'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { LeadCaptureForm } from './LeadCaptureForm'
import { track } from '@/lib/track'

interface HeroProps {
  variant?: 'a' | 'b'
}

export function Hero({ variant = 'a' }: HeroProps) {
  const [showModal, setShowModal] = useState(false)

  const headline =
    variant === 'b'
      ? 'Your record should not keep deciding your future.'
      : 'An old record is still costing you. California law may let you change that.'

  return (
    <section className="ink-texture relative overflow-hidden text-[var(--text-ink)]">
      <div className="relative z-10 mx-auto grid max-w-7xl gap-14 px-4 py-20 sm:px-6 lg:grid-cols-12 lg:gap-10 lg:py-28">
        {/* Left column — editorial statement */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-7 lg:pr-8"
        >
          <span className="eyebrow-line eyebrow text-[var(--brass)]">
            California Record Relief · Statewide
          </span>

          <h1 className="font-display display-xl mt-7 font-semibold text-white">
            {headline}
          </h1>

          <p className="mt-7 max-w-xl text-lg leading-relaxed text-[var(--text-ink-muted)]">
            A past conviction or arrest can quietly block jobs, housing, and professional licenses
            for years. California offers several relief paths &mdash; dismissal, record sealing,
            felony reduction, and more. A private 2-minute review shows which ones may apply to your
            case.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <motion.button
              whileTap={{ scale: 0.985 }}
              onClick={() => {
                track('eligibility_cta_click', { source_page: '/', cta_label: 'hero_primary' })
                setShowModal(true)
              }}
              className="btn btn-brass text-base"
              autoFocus
            >
              Check your eligibility — free
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </motion.button>

            <Link
              href="/#plans"
              onClick={() => track('pricing_cta_click', { source_page: '/', cta_label: 'hero_secondary' })}
              className="btn btn-ghost-ink text-base"
            >
              See pricing &amp; process
            </Link>
          </div>

          <p className="mt-5 text-sm text-[var(--text-ink-muted)]">
            Private assessment. No payment to find out where you stand.
          </p>

          {/* Trust row */}
          <div className="mt-10 grid max-w-lg grid-cols-1 gap-x-8 gap-y-4 border-t border-[var(--line-ink)] pt-8 sm:grid-cols-2">
            {[
              'California courts & procedures only',
              'Confidential — your details stay private',
              'Three clear paths: DIY, Review, Full Service',
              'Refund if your case does not qualify after review',
            ].map((item) => (
              <div key={item} className="flex items-start gap-2.5 text-sm font-medium text-[var(--text-ink)]">
                <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-[var(--brass)]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                {item}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right column — process card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.12 }}
          className="lg:col-span-5"
        >
          <div className="card-paper p-8 text-[var(--text)] shadow-[0_24px_60px_-30px_rgba(17,32,47,0.55)]">
            <span className="eyebrow text-[var(--brass-600)]">How it works</span>
            <h2 className="font-display mt-2 text-xl font-semibold text-[var(--ink)]">
              From uncertainty to a filing plan
            </h2>
            <ol className="mt-7 space-y-6">
              {[
                {
                  title: 'Tell us about your case',
                  body: 'A few private questions about your conviction, county, and goals.',
                },
                {
                  title: 'See the path that fits',
                  body: 'We route you to DIY, expert review, or full service based on complexity.',
                },
                {
                  title: 'Prepare and file',
                  body: 'California-focused forms and instructions. Court timelines vary by county.',
                },
              ].map((step, i) => (
                <li key={step.title} className="flex gap-4">
                  <span className="font-display flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-[var(--brass)] text-sm font-semibold text-[var(--brass-600)]">
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-semibold text-[var(--ink)]">{step.title}</p>
                    <p className="mt-0.5 text-sm text-[var(--text-muted)]">{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="mt-7 rounded-lg bg-[var(--parchment)] p-4 text-sm text-[var(--text-muted)]">
              DIY Record-Cleaning Kit &mdash;{' '}
              <span className="font-semibold text-[var(--ink)]">$97</span>{' '}
              <span className="text-[var(--text-muted)]/70 line-through">$147</span>. Instant access.
              30-day refund if your case does not qualify after review.
            </div>
          </div>
        </motion.div>
      </div>

      {showModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4"
        >
          <LeadCaptureForm
            variant="modal"
            leadMagnet="eligibility-check"
            onClose={() => setShowModal(false)}
            className="relative"
          />
        </motion.div>
      )}
    </section>
  )
}
