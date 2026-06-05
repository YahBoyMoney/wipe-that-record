'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

export default function Contact() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus('sending')
    setError('')

    const form = e.currentTarget
    const data = new FormData(form)
    const payload = {
      name: data.get('name'),
      email: data.get('email'),
      phone: data.get('phone'),
      subject: data.get('subject'),
      message: data.get('message'),
      source: 'contact-page',
    }

    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error('Failed to send')
      setStatus('success')
      form.reset()
    } catch (err) {
      console.error(err)
      setStatus('error')
      setError('Something went wrong. Please call us at (909) 609-6685.')
    }
  }

  return (
    <main className="bg-white dark:bg-slate-900 min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Get in touch
          </h1>
          <p className="text-lg text-slate-700 dark:text-slate-300 max-w-2xl mx-auto">
            Have a question about your case, our pricing, or the expungement process? Send us a
            message — we usually reply within one business day.
          </p>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-10">
          {/* Contact info */}
          <div className="lg:col-span-1 space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">Office</h2>
              <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                The Berhe Law Firm, APC
                <br />
                901 Via Piemonte, Suite 230
                <br />
                Ontario, CA 91764
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">Phone</h2>
              <a
                href="tel:+19096096685"
                className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
              >
                (909) 609-6685
              </a>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Mon–Fri, 9 AM – 6 PM Pacific
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">Email</h2>
              <a
                href="mailto:support@wipethatrecord.com"
                className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium break-all"
              >
                support@wipethatrecord.com
              </a>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
              <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                <strong className="text-slate-900 dark:text-white">Important:</strong> Contacting
                us through this form does not create an attorney-client relationship. Please do
                not send confidential information about your case until you have a signed
                engagement agreement with us.
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            <motion.form
              onSubmit={handleSubmit}
              className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 sm:p-8 shadow-sm"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {status === 'success' ? (
                <div className="text-center py-12">
                  <div className="text-5xl mb-4">✅</div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                    Message sent
                  </h3>
                  <p className="text-slate-700 dark:text-slate-300">
                    Thanks for reaching out. We&rsquo;ll get back to you within one business day.
                  </p>
                </div>
              ) : (
                <>
                  <div className="grid sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5"
                      >
                        Full name
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        className="w-full px-3 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5"
                      >
                        Email
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        className="w-full px-3 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5"
                      >
                        Phone <span className="text-slate-400 font-normal">(optional)</span>
                      </label>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        className="w-full px-3 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="subject"
                        className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5"
                      >
                        Topic
                      </label>
                      <select
                        id="subject"
                        name="subject"
                        defaultValue="General question"
                        className="w-full px-3 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option>General question</option>
                        <option>Eligibility check</option>
                        <option>DIY kit support</option>
                        <option>Refund request</option>
                        <option>Press / media</option>
                        <option>Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="mb-5">
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5"
                    >
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={6}
                      required
                      placeholder="Briefly describe your question. Please do not share confidential case details."
                      className="w-full px-3 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
                    />
                  </div>

                  {status === 'error' && (
                    <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-700 dark:text-red-300">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
                  >
                    {status === 'sending' ? 'Sending…' : 'Send message'}
                  </button>
                </>
              )}
            </motion.form>
          </div>
        </div>
      </section>
    </main>
  )
}
