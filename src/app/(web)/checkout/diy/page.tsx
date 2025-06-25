'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function DIYCheckoutPage() {
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes
  const [showExitIntent, setShowExitIntent] = useState(false);
  const [leadData, setLeadData] = useState<any>(null);
  
  useEffect(() => {
    const stored = sessionStorage.getItem('leadData');
    if (stored) {
      setLeadData(JSON.parse(stored));
    }
  }, []);

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Exit intent detection
  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) {
        setShowExitIntent(true);
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

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
            {/* Urgency Banner */}
            <div className="bg-red-500 text-white p-4 rounded-lg text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span className="font-bold">LIMITED TIME OFFER</span>
              </div>
              <div className="text-lg font-semibold">
                🔥 Save $50 - Only $97 (Reg. $147) - Expires in 24 Hours!
              </div>
            </div>

            {/* Product Overview */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                DIY Expungement Kit - Complete Package
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
                    <h3 className="font-semibold text-gray-900">Success Guarantee</h3>
                    <p className="text-gray-600">Money-back guarantee if your case doesn't qualify</p>
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

            {/* Social Proof */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">What Our Customers Say</h3>
              
              <div className="space-y-4">
                <div className="border-l-4 border-green-500 pl-4">
                  <div className="flex items-center mb-2">
                    <div className="flex text-yellow-400">
                      {'★'.repeat(5)}
                    </div>
                    <span className="ml-2 font-semibold text-gray-900">Sarah M.</span>
                  </div>
                  <p className="text-gray-600 italic">
                    "This kit saved me thousands! The instructions were so clear that I filed everything myself and got approved in just 6 weeks."
                  </p>
                </div>

                <div className="border-l-4 border-green-500 pl-4">
                  <div className="flex items-center mb-2">
                    <div className="flex text-yellow-400">
                      {'★'.repeat(5)}
                    </div>
                    <span className="ml-2 font-semibold text-gray-900">Marcus T.</span>
                  </div>
                  <p className="text-gray-600 italic">
                    "Finally got my dream job after clearing my DUI record. This kit made it possible!"
                  </p>
                </div>

                <div className="text-center pt-4">
                  <div className="text-2xl font-bold text-green-600">4.9/5 Stars</div>
                  <div className="text-gray-600">from 1,847+ customers</div>
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
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-lg text-lg transition-colors duration-200 shadow-lg"
              >
                🚀 Get Instant Access - $97
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

      {/* Conversion Script */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            // Track page view
            if (window.gtag) {
              window.gtag('event', 'page_view', {
                page_title: 'DIY Checkout',
                page_location: window.location.href
              });
            }
            
            // Exit intent popup
            let exitIntentShown = false;
            document.addEventListener('mouseleave', function(e) {
              if (e.clientY <= 0 && !exitIntentShown) {
                exitIntentShown = true;
                if (confirm('Wait! Get an extra 10% off with code SAVE10 - Stay on this page?')) {
                  // Apply discount code
                  console.log('Apply discount code SAVE10');
                }
              }
            });
          `
        }}
      />
    </div>
  );
} 