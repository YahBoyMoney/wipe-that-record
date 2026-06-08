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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              Wipe That Record
            </Link>
            <div className="flex items-center space-x-2 text-green-600">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-semibold">Secure Checkout</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Product Details */}
          <div className="space-y-6">
            {/* Offer Banner */}
            <div className="bg-[#0f2747] text-white p-4 rounded-lg text-center">
              <div className="text-lg font-semibold">
                DIY Record-Cleaning Kit &mdash; $97 (Save $50 from $147)
              </div>
              <div className="text-sm text-slate-300 mt-1">
                Instant access &bull; 30-day refund if your case does not qualify after review
              </div>
            </div>

            {/* Product Overview */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                DIY Record-Cleaning Kit - Complete Package
              </h1>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <svg className="w-6 h-6 text-green-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h3 className="font-semibold text-gray-900">Complete Filing Guide</h3>
                    <p className="text-gray-600">Step-by-step instructions with screenshots for every court in California</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <svg className="w-6 h-6 text-green-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h3 className="font-semibold text-gray-900">Pre-Filled Court Forms</h3>
                    <p className="text-gray-600">All necessary paperwork customized for your case</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <svg className="w-6 h-6 text-green-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h3 className="font-semibold text-gray-900">30-Day Refund</h3>
                    <p className="text-gray-600">Refund if your case does not qualify after review</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <svg className="w-6 h-6 text-green-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h3 className="font-semibold text-gray-900">Instant Download</h3>
                    <p className="text-gray-600">Get everything immediately after purchase</p>
                  </div>
                </div>
              </div>
            </div>

            {/* What customers say */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">What customers say</h3>

              <div className="space-y-4">
                <div className="border-l-4 border-[#0f2747] pl-4">
                  <p className="text-gray-600 italic">
                    "The instructions were clear and the sample forms made it much easier to prepare my own paperwork."
                  </p>
                  <span className="mt-1 block text-sm font-semibold text-gray-900">Sarah M.</span>
                </div>

                <div className="border-l-4 border-[#0f2747] pl-4">
                  <p className="text-gray-600 italic">
                    "Walked me through addressing my old DUI record step by step. I always knew what to do next."
                  </p>
                  <span className="mt-1 block text-sm font-semibold text-gray-900">Marcus T.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Checkout Form */}
          <div className="space-y-6">
            {/* Price Box */}
            <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-green-500">
              <div className="text-center mb-6">
                <div className="text-gray-700 text-lg line-through font-medium">Regular: $147</div>
                <div className="text-4xl font-bold text-green-600">$97</div>
                <div className="text-gray-600">One-time payment • Instant access</div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span>DIY Expungement Kit</span>
                  <span className="font-semibold">$97.00</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-green-600">Limited Time Discount</span>
                  <span className="font-semibold text-green-600">-$50.00</span>
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
                className="w-full bg-[#0f2747] hover:bg-[#163a66] text-white font-bold py-4 px-6 rounded-lg text-lg transition-colors duration-200 shadow-lg"
              >
                Get Instant Access - $97
              </button>

              <div className="text-center text-sm text-gray-800 mt-4 font-medium">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  <span>Secure 256-bit SSL encryption</span>
                </div>
                <div>💳 We accept all major credit cards</div>
              </div>
            </div>

            {/* Upsell Teasers */}
            <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
              <h3 className="text-lg font-bold text-blue-900 mb-3">🚀 Want Us to Handle Everything?</h3>
              <p className="text-blue-800 mb-4">
                Skip the paperwork entirely! Our Expert Review service handles all filing and court interactions for you.
              </p>
              <div className="text-sm text-blue-700">
                ✨ Available as upgrade after purchase
              </div>
            </div>

            {/* Guarantees */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Your Peace of Mind</h3>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">30-day money-back guarantee</span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Instant download after payment</span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Free email support included</span>
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