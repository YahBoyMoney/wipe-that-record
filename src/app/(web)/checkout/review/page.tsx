'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const included = [
  'A specialist looks up your case record',
  'Eligibility verification and case review',
  'Your California forms completed for you',
  'Accuracy check before you file',
  'Filing guidance and email support',
];

const diyRisks = [
  'Choosing the wrong form for your relief path',
  'Missing signatures or required attachments',
  'Filing at the wrong courthouse',
  'Re-filing delays if paperwork is rejected',
];

export default function ReviewCheckoutPage() {
  const [leadData, setLeadData] = useState<any>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem('leadData');
    if (stored) {
      setLeadData(JSON.parse(stored));
    }
  }, []);

  const handleCheckout = async () => {
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product: 'review',
          amount: 297,
          email: leadData?.email || 'customer@example.com',
          fullName: leadData?.fullName || 'Customer',
          leadId: leadData?.id || '',
        }),
      });

      const result = await response.json();

      if (result.url) {
        window.location.href = result.url;
      } else {
        console.error('No checkout URL received:', result);
        alert('There was an error processing your request. Please try again.');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('There was an error processing your request. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-[var(--parchment)]">
      {/* Header */}
      <header className="border-b border-[var(--line)] bg-[var(--paper)]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="font-display text-xl font-semibold text-[var(--ink)]">
            Wipe That Record
          </Link>
          <div className="flex items-center gap-2 text-[var(--brass-600)]">
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            <span className="font-semibold">Secure checkout</span>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow text-[var(--brass-600)]">Expert Review &mdash; $297</span>
          <h1 className="font-display mt-3 text-3xl font-semibold text-[var(--ink)] sm:text-4xl">
            {leadData?.fullName ? `${leadData.fullName}, have ` : 'Have '}
            a specialist review your case before you file
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-[var(--text-muted)]">
            A small mistake on your paperwork can lead to a rejection and weeks of delay. Expert Review
            adds a specialist case look-up, completed forms, and an accuracy check before filing.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {/* Common DIY pitfalls */}
          <div className="card-paper p-7">
            <h2 className="font-display text-lg font-semibold text-[var(--ink)]">
              Common filing pitfalls Expert Review helps you avoid
            </h2>
            <ul className="mt-5 space-y-3">
              {diyRisks.map((r) => (
                <li key={r} className="flex items-start gap-3 text-sm text-[var(--text)]">
                  <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-[var(--brass-600)]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {r}
                </li>
              ))}
            </ul>
          </div>

          {/* What's included */}
          <div className="section-ink rounded-xl p-7 text-[var(--text-ink)] ring-1 ring-[var(--brass)]/40">
            <h2 className="font-display text-lg font-semibold text-white">What Expert Review includes</h2>
            <ul className="mt-5 space-y-3">
              {included.map((f) => (
                <li key={f} className="flex items-start gap-3 text-sm text-[var(--text-ink)]">
                  <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-[var(--brass)]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Checkout box */}
        <div className="mx-auto mt-10 max-w-md">
          <div className="card-paper p-8 text-center ring-1 ring-[var(--brass)]/40">
            <div className="font-display text-4xl font-semibold text-[var(--ink)]">$297</div>
            <div className="mt-1 text-[var(--text-muted)]">One-time payment &middot; Expert Review</div>
            <button
              onClick={handleCheckout}
              className="btn btn-primary mt-6 w-full text-lg"
            >
              Get Expert Review &mdash; $297
            </button>
            <div className="mt-4 flex items-center justify-center gap-2 text-sm text-[var(--text-muted)]">
              <svg className="h-4 w-4 text-[var(--brass-600)]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              <span>Secure 256-bit SSL encryption</span>
            </div>
          </div>
        </div>

        {/* Compare options */}
        <div className="mt-14">
          <h2 className="font-display text-center text-2xl font-semibold text-[var(--ink)]">
            Compare your options
          </h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {/* DIY */}
            <div className="card-paper flex flex-col p-7">
              <h3 className="font-display text-lg font-semibold text-[var(--ink)]">DIY Kit &mdash; $97</h3>
              <ul className="mt-4 space-y-2 text-sm text-[var(--text-muted)]">
                <li>California forms and instructions</li>
                <li>Samples to guide your paperwork</li>
                <li>You prepare and file yourself</li>
              </ul>
              <button
                onClick={() => (window.location.href = '/checkout/diy')}
                className="btn btn-outline mt-auto w-full pt-3"
              >
                Choose DIY
              </button>
            </div>

            {/* Expert Review */}
            <div className="card-paper relative flex flex-col p-7 ring-1 ring-[var(--brass)]/50">
              <span className="eyebrow absolute -top-3 left-7 rounded-full bg-[var(--brass)] px-3 py-1 text-[10px] text-[#2a1f0c]">
                Most chosen
              </span>
              <h3 className="font-display text-lg font-semibold text-[var(--ink)]">Expert Review &mdash; $297</h3>
              <ul className="mt-4 space-y-2 text-sm text-[var(--text-muted)]">
                <li>Everything in DIY</li>
                <li>Specialist case look-up</li>
                <li>Forms completed and checked for you</li>
              </ul>
              <button onClick={handleCheckout} className="btn btn-primary mt-auto w-full">
                Get Expert Review
              </button>
            </div>

            {/* Full Service */}
            <div className="card-paper flex flex-col p-7">
              <h3 className="font-display text-lg font-semibold text-[var(--ink)]">Full Service &mdash; $1,497</h3>
              <ul className="mt-4 space-y-2 text-sm text-[var(--text-muted)]">
                <li>Attorney-managed from prep to filing</li>
                <li>Court appearances handled if required</li>
                <li>Direct attorney access</li>
              </ul>
              <button
                onClick={() => (window.location.href = '/checkout/full-service')}
                className="btn btn-outline mt-auto w-full"
              >
                Go Full Service
              </button>
            </div>
          </div>
        </div>

        <p className="mx-auto mt-10 max-w-3xl text-center text-sm leading-relaxed text-[var(--text-muted)]">
          Results vary by case. Expert Review is a document-preparation and review service and does not
          by itself create an attorney-client relationship. We do not control court schedules and cannot
          guarantee a specific outcome or timeline.
        </p>
      </div>
    </div>
  );
}
