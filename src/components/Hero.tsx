'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { LeadCaptureForm } from './LeadCaptureForm'

interface HeroProps {
  variant?: 'a' | 'b'
}

export function Hero({ variant = 'a' }: HeroProps) {
  const [showModal, setShowModal] = useState(false)

  const headline =
    variant === 'b'
      ? 'Clean Up Your California Record the Right Way'
      : 'Find Out How to Clean Up Your California Record'

  return (
    <section className="relative flex items-center overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-20 lg:py-28">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          {/* Left column - Hero content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-7"
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-1.5 text-sm font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-200">
              <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
              California-focused record-cleaning support
            </div>

            <h1 className="text-4xl font-bold leading-tight tracking-tight text-slate-900 dark:text-white lg:text-5xl">
              {headline}
            </h1>

            <p className="max-w-xl text-lg leading-relaxed text-slate-600 dark:text-slate-300">
              Take a private 2-minute eligibility check to see which California record-cleaning
              options may apply to your case &mdash; including dismissal, sealing, felony reduction,
              or attorney-managed support.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowModal(true)}
                className="group rounded-xl bg-[#0f2747] px-8 py-4 text-lg font-semibold text-white shadow-sm transition-all duration-300 hover:bg-[#163a66]"
                autoFocus
              >
                <span className="flex items-center justify-center gap-2">
                  Check Eligibility Free
                  <svg
                    className="h-5 w-5 transition-transform group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </motion.button>

              <Link
                href="/#plans"
                className="rounded-xl border-2 border-slate-300 px-8 py-4 text-center text-lg font-semibold text-slate-800 transition-all duration-300 hover:border-slate-400 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                See Pricing
              </Link>
            </div>

            <p className="text-sm text-slate-500 dark:text-slate-400">
              Private assessment. California-focused forms. Attorney review available.
            </p>

            {/* Trust indicators */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-slate-200 pt-7 dark:border-slate-700">
              <div className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
                <svg className="h-5 w-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Refund if your case does not qualify after review
              </div>
              <div className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
                <svg className="h-5 w-5 text-[#0f2747] dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                100% confidential
              </div>
            </div>
          </motion.div>

          {/* Right column - process / proof card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="relative"
          >
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xl dark:border-slate-700 dark:bg-slate-800">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                How the process works
              </h2>
              <ol className="mt-6 space-y-5">
                {[
                  {
                    title: 'Check your eligibility',
                    body: 'Answer a few private questions about your case and county.',
                  },
                  {
                    title: 'Get your recommended path',
                    body: 'See whether a DIY kit, expert review, or full service fits your situation.',
                  },
                  {
                    title: 'Prepare and file',
                    body: 'Get California-focused forms and instructions. Court timelines vary by county.',
                  },
                ].map((step, i) => (
                  <li key={step.title} className="flex gap-4">
                    <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#0f2747] text-sm font-semibold text-white">
                      {i + 1}
                    </span>
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">{step.title}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-300">{step.body}</p>
                    </div>
                  </li>
                ))}
              </ol>

              <div className="mt-7 rounded-xl bg-slate-50 p-4 text-sm text-slate-600 dark:bg-slate-900/40 dark:text-slate-300">
                DIY Record-Cleaning Kit &mdash; <span className="font-semibold text-slate-900 dark:text-white">$97</span>{' '}
                <span className="text-slate-400 line-through">$147</span>. Instant access. 30-day refund if
                your case does not qualify after review.
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Eligibility modal with lead capture form */}
      {showModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
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
