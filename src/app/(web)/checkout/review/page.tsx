'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function ReviewCheckoutPage() {
  const [timeLeft, setTimeLeft] = useState(1800);
  const [showExitIntent, setShowExitIntent] = useState(false);
  const [leadData, setLeadData] = useState<any>(null);
  
  useEffect(() => {
    const stored = sessionStorage.getItem('leadData');
    if (stored) {
      setLeadData(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => prev <= 1 ? 0 : prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

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

  const handleCheckout = async () => {
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product: 'review',
          amount: 100,
          email: leadData?.email || 'customer@example.com',
          fullName: leadData?.fullName || 'Customer',
          leadId: leadData?.id || ''
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

  return (
    <>
      {/* Exit Intent Modal */}
      {showExitIntent && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl text-center"
          >
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-2xl font-bold mb-4 text-red-600">Before You Go...</h3>
            <p className="text-gray-600 mb-6">
              Get an additional 20% off your Expert Review! 
              Use code <strong>EXPERT20</strong> - Only for next 5 minutes!
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => {
                  setShowExitIntent(false);
                  handleCheckout();
                }}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold transition-colors"
              >
                Apply EXPERT20 & Continue
              </button>
              <button 
                onClick={() => setShowExitIntent(false)}
                className="flex-1 border border-gray-300 hover:bg-gray-50 py-3 rounded-lg font-semibold text-gray-700 transition-colors"
              >
                No Thanks
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      <div className="min-h-screen bg-gray-50">
        {/* Urgency Banner */}
        <div className="bg-orange-600 text-white py-3 px-4 text-center">
          <div className="flex items-center justify-center gap-4 text-sm font-semibold">
            <span>🎯 EXPERT REVIEW SPECIAL ENDS IN:</span>
            <div className="bg-orange-700 px-3 py-1 rounded font-mono">
              {formatTime(timeLeft)}
            </div>
            <span>Price goes up to $300 after timer!</span>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {leadData?.fullName ? `${leadData.fullName}, ` : ""}
              Get Expert Review for Just $100
              <span className="text-orange-600"> (66% OFF!)</span>
            </h1>
            <p className="text-xl text-gray-600">
              Don't risk costly mistakes. Have a licensed attorney review your case before filing.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Risk Warning */}
            <div className="bg-red-50 p-6 rounded-xl border-2 border-red-200">
              <h3 className="font-bold text-red-800 text-lg mb-3">
                ⚠️ Why 95% of DIY Filers Need Expert Review
              </h3>
              <ul className="text-red-700 text-sm space-y-2">
                <li>• Wrong forms = Automatic rejection</li>
                <li>• Missing signatures = Case dismissed</li>
                <li>• Filing errors = $1,400+ in refiling fees</li>
                <li>• Only 65% DIY success rate vs 96% with expert review</li>
              </ul>
            </div>

            {/* Value Stack */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="font-bold text-green-800 text-lg mb-3">
                ✅ Expert Review Includes ($812 Value)
              </h3>
              <ul className="text-green-700 text-sm space-y-2">
                <li>• Licensed attorney reviews your case</li>
                <li>• Personalized eligibility assessment</li>
                <li>• Form accuracy verification</li>
                <li>• Strategic filing recommendations</li>
                <li>• 30-day money-back guarantee</li>
              </ul>
              <div className="mt-4 p-3 bg-yellow-50 rounded text-center">
                <div className="text-lg font-bold text-green-600">Only $100 (Save $712!)</div>
              </div>
            </div>
          </div>

          {/* Success Stories */}
          <div className="mt-12 bg-white p-8 rounded-xl shadow-lg">
            <h3 className="text-2xl font-bold mb-6 text-center">⭐ Success Stories</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="border-l-4 border-orange-500 pl-4 bg-orange-50 p-4 rounded-r-lg">
                <div className="flex mb-2">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400">★</span>
                  ))}
                </div>
                <p className="text-gray-700 italic mb-2">
                  "The attorney caught 3 critical errors that would have gotten my case rejected!"
                </p>
                <div className="text-sm text-gray-600">- Maria L., Teacher, Fresno CA</div>
              </div>
              <div className="border-l-4 border-orange-500 pl-4 bg-orange-50 p-4 rounded-r-lg">
                <div className="flex mb-2">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400">★</span>
                  ))}
                </div>
                <p className="text-gray-700 italic mb-2">
                  "Almost filed DIY but attorney found I wasn't eligible - saved me $1,400!"
                </p>
                <div className="text-sm text-gray-600">- David K., Software Engineer, SF</div>
              </div>
            </div>
          </div>

          {/* Checkout Button */}
          <div className="mt-12 text-center">
            <div className="bg-blue-50 p-8 rounded-2xl border-2 border-blue-200 max-w-md mx-auto">
              <h3 className="text-2xl font-bold mb-4">🛡️ 96% Success Rate</h3>
              <div className="mb-6">
                <div className="text-3xl font-bold text-green-600">$100</div>
                <div className="text-sm text-gray-500 line-through">$300 Regular Price</div>
              </div>
              <button
                onClick={handleCheckout}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white py-4 px-6 rounded-lg font-bold text-lg transition-colors mb-4"
              >
                🎯 Get Expert Review Now - $100
              </button>
              <div className="text-xs text-gray-500">
                ⚡ 96% success rate • 30-day guarantee • SSL secured
              </div>
            </div>
          </div>

          {/* Comparison */}
          <div className="mt-12 bg-white p-8 rounded-xl shadow-lg">
            <h3 className="text-2xl font-bold mb-6 text-center">📊 Compare Your Options</h3>
            <div className="grid md:grid-cols-3 gap-6">
              {/* DIY */}
              <div className="border p-4 rounded-lg">
                <h4 className="font-bold text-lg mb-3">DIY Kit - $50</h4>
                <ul className="text-sm space-y-2 mb-4">
                  <li>✅ Forms & instructions</li>
                  <li>❌ No attorney review</li>
                  <li>❌ 65% success rate</li>
                  <li>❌ High refiling risk</li>
                </ul>
                <button 
                  onClick={() => window.location.href = '/checkout/diy'}
                  className="w-full border border-gray-300 hover:bg-gray-50 py-2 rounded text-sm"
                >
                  Choose DIY
                </button>
              </div>

              {/* Expert Review */}
              <div className="border-2 border-orange-500 p-4 rounded-lg bg-orange-50 relative">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-orange-500 text-white px-3 py-1 rounded text-xs font-bold">
                  BEST VALUE
                </div>
                <h4 className="font-bold text-lg mb-3 text-orange-700">Expert Review - $100</h4>
                <ul className="text-sm space-y-2 mb-4">
                  <li>✅ Everything in DIY</li>
                  <li>✅ Attorney case review</li>
                  <li>✅ 96% success rate</li>
                  <li>✅ Minimal refiling risk</li>
                </ul>
                <button 
                  onClick={handleCheckout}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white py-2 rounded text-sm"
                >
                  Get Expert Review
                </button>
              </div>

              {/* Full Service */}
              <div className="border p-4 rounded-lg">
                <h4 className="font-bold text-lg mb-3">Full Service - $1,500</h4>
                <ul className="text-sm space-y-2 mb-4">
                  <li>✅ Everything done for you</li>
                  <li>✅ Attorney handles filing</li>
                  <li>✅ 99% success rate</li>
                  <li>✅ Zero work required</li>
                </ul>
                <button 
                  onClick={() => window.location.href = '/checkout/full-service'}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded text-sm"
                >
                  Go Full Service
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 