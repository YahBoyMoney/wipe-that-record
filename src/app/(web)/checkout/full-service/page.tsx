'use client';
import { useState } from 'react';
import Link from 'next/link';

const included = [
  'A licensed attorney manages your entire case',
  'All paperwork prepared and filed for you',
  'Court appearances handled if required',
  'Direct attorney communication throughout',
  'Case tracking and status updates',
  'Written engagement agreement',
];

export default function FullServiceCheckoutPage() {
  const [paymentPlan, setPaymentPlan] = useState<'full' | 'payment'>('full');

  const handleCheckout = async () => {
    try {
      const amount = paymentPlan === 'full' ? 1497 : 300;
      const leadData = JSON.parse(sessionStorage.getItem('leadData') || '{}');

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product: 'full-service',
          amount: amount,
          email: leadData?.email || 'customer@example.com',
          fullName: leadData?.fullName || 'Customer',
          paymentPlan: paymentPlan,
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

      {/* Hero */}
      <section className="ink-texture py-16 text-[var(--text-ink)]">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <span className="eyebrow text-[var(--brass)]">Full Service &mdash; $1,497</span>
          <h1 className="font-display mt-3 text-4xl font-semibold leading-tight text-white sm:text-5xl">
            Attorney-managed from preparation through filing
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-[var(--text-ink-muted)]">
            For complex cases, or when you would rather not handle the paperwork yourself, an attorney
            takes your case from preparation through filing and handles court appearances if required.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* What's included */}
          <div className="space-y-6">
            <div className="card-paper p-8">
              <h2 className="font-display text-2xl font-semibold text-[var(--ink)]">
                Everything handled for you
              </h2>
              <ul className="mt-6 space-y-4">
                {included.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-[var(--text)]">
                    <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-[var(--brass-600)]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Comparison */}
            <div className="card-paper p-8">
              <h3 className="font-display text-xl font-semibold text-[var(--ink)]">
                How the service levels compare
              </h3>
              <div className="mt-5 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[var(--line)] text-left">
                      <th className="py-3 pr-4 font-semibold text-[var(--ink)]">Feature</th>
                      <th className="px-3 py-3 text-center font-semibold text-[var(--text-muted)]">DIY</th>
                      <th className="px-3 py-3 text-center font-semibold text-[var(--text-muted)]">Review</th>
                      <th className="px-3 py-3 text-center font-semibold text-[var(--brass-600)]">Full Service</th>
                    </tr>
                  </thead>
                  <tbody className="text-[var(--text)]">
                    <tr className="border-b border-[var(--line)]">
                      <td className="py-3 pr-4 font-medium">Who prepares the forms</td>
                      <td className="px-3 py-3 text-center">You</td>
                      <td className="px-3 py-3 text-center">Specialist</td>
                      <td className="px-3 py-3 text-center font-semibold text-[var(--brass-600)]">Attorney</td>
                    </tr>
                    <tr className="border-b border-[var(--line)]">
                      <td className="py-3 pr-4 font-medium">Who files with the court</td>
                      <td className="px-3 py-3 text-center">You</td>
                      <td className="px-3 py-3 text-center">You</td>
                      <td className="px-3 py-3 text-center font-semibold text-[var(--brass-600)]">Attorney</td>
                    </tr>
                    <tr className="border-b border-[var(--line)]">
                      <td className="py-3 pr-4 font-medium">Court appearances</td>
                      <td className="px-3 py-3 text-center">You</td>
                      <td className="px-3 py-3 text-center">You</td>
                      <td className="px-3 py-3 text-center font-semibold text-[var(--brass-600)]">Handled if required</td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-4 font-medium">Direct attorney access</td>
                      <td className="px-3 py-3 text-center">&mdash;</td>
                      <td className="px-3 py-3 text-center">&mdash;</td>
                      <td className="px-3 py-3 text-center font-semibold text-[var(--brass-600)]">Yes</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Checkout */}
          <div className="lg:sticky lg:top-8 lg:self-start">
            <div className="card-paper p-8 ring-1 ring-[var(--brass)]/40">
              <span className="eyebrow text-[var(--brass-600)]">Premium &middot; attorney-managed</span>
              <h2 className="font-display mt-2 text-2xl font-semibold text-[var(--ink)]">
                Choose your payment option
              </h2>

              <div className="mt-6 space-y-3">
                <button
                  type="button"
                  onClick={() => setPaymentPlan('full')}
                  className={`w-full rounded-lg border-2 p-4 text-left transition-colors ${
                    paymentPlan === 'full'
                      ? 'border-[var(--ink)] bg-[var(--brass-100)]/40'
                      : 'border-[var(--line)] hover:border-[var(--brass)]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-[var(--ink)]">Pay in full</div>
                      <div className="text-sm text-[var(--text-muted)]">Complete attorney service</div>
                    </div>
                    <div className="text-right">
                      <div className="font-display text-2xl font-semibold text-[var(--ink)]">$1,497</div>
                      <div className="text-sm text-[var(--text-muted)]">one-time</div>
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentPlan('payment')}
                  className={`w-full rounded-lg border-2 p-4 text-left transition-colors ${
                    paymentPlan === 'payment'
                      ? 'border-[var(--ink)] bg-[var(--brass-100)]/40'
                      : 'border-[var(--line)] hover:border-[var(--brass)]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-[var(--ink)]">Payment plan</div>
                      <div className="text-sm text-[var(--text-muted)]">$300 down, then $299/month &times; 4</div>
                    </div>
                    <div className="text-right">
                      <div className="font-display text-2xl font-semibold text-[var(--ink)]">$300</div>
                      <div className="text-sm text-[var(--text-muted)]">down payment</div>
                    </div>
                  </div>
                </button>
              </div>

              <button
                onClick={handleCheckout}
                className="btn btn-primary mt-6 w-full text-lg"
              >
                {paymentPlan === 'full'
                  ? 'Get Full Service — $1,497'
                  : 'Start with $300 — Payment Plan'}
              </button>

              <div className="mt-5 space-y-3 text-sm text-[var(--text)]">
                <div className="flex items-center gap-3">
                  <svg className="h-5 w-5 flex-shrink-0 text-[var(--brass-600)]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  <span>Secure 256-bit SSL encryption</span>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="h-5 w-5 flex-shrink-0 text-[var(--brass-600)]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Work begins after a written engagement agreement</span>
                </div>
              </div>
            </div>

            <p className="mt-6 text-xs leading-relaxed text-[var(--text-muted)]">
              An attorney-client relationship is formed only after a written engagement agreement is
              signed. Results vary by case. We do not control court schedules and cannot guarantee a
              specific outcome or timeline.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
