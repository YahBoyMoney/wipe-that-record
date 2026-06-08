'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function DIYCheckoutPage() {
  const [leadData, setLeadData] = useState<any>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem('leadData');
    if (stored) {
      setLeadData(JSON.parse(stored));
    }
  }, []);

  const handleCheckout = async (promoCode?: string) => {
    try {
      const response = await fetch('/api/checkout/diy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: leadData?.email || 'customer@example.com',
          fullName: leadData?.fullName || 'Customer',
          promoCode: promoCode || undefined,
          leadId: leadData?.id || '',
          utmSource: new URLSearchParams(window.location.search).get('utm_source') || '',
          utmCampaign: new URLSearchParams(window.location.search).get('utm_campaign') || '',
          utmMedium: new URLSearchParams(window.location.search).get('utm_medium') || ''
        })
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

  const handleUpgrade = () => {
    window.location.href = '/checkout/review';
  };

  return (
    <div className="min-h-screen bg-[var(--parchment)]">
      {/* Header */}
      <header className="border-b border-[var(--line)] bg-[var(--paper)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="font-display text-xl font-semibold text-[var(--ink)]">
              Wipe That Record
            </Link>
            <div className="flex items-center space-x-2 text-[var(--brass-600)]">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              <span className="font-semibold">Secure checkout</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Product Details */}
          <div className="space-y-6">
            {/* Offer Banner */}
            <div className="ink-texture text-[var(--text-ink)] p-5 rounded-xl text-center">
              <div className="font-display text-lg font-semibold text-white">
                DIY Record-Cleaning Kit &mdash; $97 (save $50 from $147)
              </div>
              <div className="text-sm text-[var(--text-ink-muted)] mt-1">
                Instant access &middot; 30-day refund if your case does not qualify after review
              </div>
            </div>

            {/* Product Overview */}
            <div className="card-paper p-7">
              <h1 className="font-display text-2xl font-semibold text-[var(--ink)] mb-5">
                DIY Record-Cleaning Kit &mdash; complete package
              </h1>

              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <svg className="w-5 h-5 text-[var(--brass-600)] mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h3 className="font-semibold text-[var(--ink)]">Complete filing guide</h3>
                    <p className="text-[var(--text-muted)]">Plain-language, step-by-step instructions for filing in California courts</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <svg className="w-5 h-5 text-[var(--brass-600)] mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h3 className="font-semibold text-[var(--ink)]">California court forms</h3>
                    <p className="text-[var(--text-muted)]">The California forms package for your relief path, with samples</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <svg className="w-5 h-5 text-[var(--brass-600)] mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h3 className="font-semibold text-[var(--ink)]">30-day refund</h3>
                    <p className="text-[var(--text-muted)]">Refund if your case does not qualify after review</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <svg className="w-5 h-5 text-[var(--brass-600)] mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h3 className="font-semibold text-[var(--ink)]">Instant download</h3>
                    <p className="text-[var(--text-muted)]">Get everything immediately after purchase</p>
                  </div>
                </div>
              </div>
            </div>

            {/* What customers say */}
            <div className="card-paper p-7">
              <h3 className="font-display text-lg font-semibold text-[var(--ink)] mb-4">What customers say</h3>

              <div className="space-y-4">
                <div className="border-l-2 border-[var(--brass)] pl-4">
                  <p className="text-[var(--text-muted)] italic">
                    "The instructions were clear and the sample forms made it much easier to prepare my own paperwork."
                  </p>
                  <span className="mt-1 block text-sm font-semibold text-[var(--ink)]">Sarah M.</span>
                </div>

                <div className="border-l-2 border-[var(--brass)] pl-4">
                  <p className="text-[var(--text-muted)] italic">
                    "Walked me through addressing my old DUI record step by step. I always knew what to do next."
                  </p>
                  <span className="mt-1 block text-sm font-semibold text-[var(--ink)]">Marcus T.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Checkout Form */}
          <div className="space-y-6">
            {/* Price Box */}
            <div className="card-paper p-7 ring-1 ring-[var(--brass)]/40">
              <div className="text-center mb-6">
                <div className="text-[var(--text-muted)] text-lg line-through font-medium">Regular: $147</div>
                <div className="font-display text-5xl font-semibold text-[var(--ink)]">$97</div>
                <div className="text-[var(--text-muted)]">One-time payment &middot; instant access</div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center py-2 border-b border-[var(--line)]">
                  <span>DIY Expungement Kit</span>
                  <span className="font-semibold">$97.00</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-[var(--line)]">
                  <span className="text-[var(--brass-600)]">Launch discount</span>
                  <span className="font-semibold text-[var(--brass-600)]">-$50.00</span>
                </div>
                <div className="flex justify-between items-center py-2 text-lg font-bold">
                  <span>Total Today</span>
                  <span>$97.00</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button 
                onClick={() => {
                  // Track conversion event
                  if (typeof window !== 'undefined' && (window as any).gtag) {
                    (window as any).gtag('event', 'begin_checkout', {
                      currency: 'USD',
                      value: 97,
                      items: [{
                        item_id: 'diy-kit',
                        item_name: 'DIY Expungement Kit',
                        price: 97,
                        quantity: 1
                      }]
                    });
                  }
                  
                  // Use the proper checkout handler
                  handleCheckout();
                }}
                className="btn btn-primary w-full text-lg"
              >
                Get Instant Access - $97
              </button>

              <div className="text-center text-sm text-[var(--text-muted)] mt-4 font-medium">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <svg className="w-4 h-4 text-[var(--brass-600)]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  <span>Secure 256-bit SSL encryption</span>
                </div>
                <div>We accept all major credit cards</div>
              </div>
            </div>

            {/* Upsell Teasers */}
            <div className="rounded-xl border border-[var(--brass)]/30 bg-[var(--brass-100)]/40 p-7">
              <h3 className="font-display text-lg font-semibold text-[var(--ink)] mb-3">Have a more complex case?</h3>
              <p className="text-[var(--text-muted)] mb-4">
                If your case turns out to be complex, you can upgrade after purchase. Expert Review adds a specialist check before you file; Full Service is attorney-managed from preparation through filing.
              </p>
              <div className="text-sm text-[var(--brass-600)] font-medium">
                Available as an upgrade after purchase
              </div>
            </div>

            {/* Guarantees */}
            <div className="card-paper p-7">
              <h3 className="font-display text-lg font-semibold text-[var(--ink)] mb-4">Your peace of mind</h3>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <svg className="w-5 h-5 text-[var(--brass-600)]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-[var(--text)]">30-day refund if your case does not qualify after review</span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <svg className="w-5 h-5 text-[var(--brass-600)]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-[var(--text)]">Instant download after payment</span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <svg className="w-5 h-5 text-[var(--brass-600)]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-[var(--text)]">Email support included</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Page view tracking */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            if (window.gtag) {
              window.gtag('event', 'page_view', {
                page_title: 'DIY Checkout',
                page_location: window.location.href
              });
            }
          `
        }}
      />
    </div>
  );
}