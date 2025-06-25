'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function FullServiceCheckoutPage() {
  const [timeLeft, setTimeLeft] = useState(1800);
  const [paymentPlan, setPaymentPlan] = useState('full'); // 'full' or 'payment'
  
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => prev <= 1 ? 0 : prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCheckout = async () => {
    try {
      const amount = paymentPlan === 'full' ? 1497 : 300; // $300 down payment
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Premium Banner */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 px-4 text-center">
        <div className="flex items-center justify-center gap-4 text-sm font-semibold">
          <span>👑 PREMIUM SERVICE DISCOUNT ENDS IN:</span>
          <div className="bg-purple-700 px-3 py-1 rounded font-mono">
            {formatTime(timeLeft)}
          </div>
          <span>Save $500 - Limited Time Only!</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                White-Glove Service
              </span>
              <br />We Handle Everything For You
            </h1>
            <p className="text-2xl text-gray-800 mb-6 font-medium">
              Sit back and relax while licensed attorneys clear your record
            </p>
            <div className="bg-yellow-100 border-2 border-yellow-300 rounded-xl p-4 max-w-2xl mx-auto">
              <p className="text-yellow-800 font-semibold">
                🎉 <strong>Professional Service:</strong> Complete attorney representation for $1,497!
              </p>
            </div>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left Side - Value Proposition */}
          <div className="space-y-8">
            {/* What's Included */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-8 rounded-2xl shadow-xl border-2 border-purple-200"
            >
              <h3 className="text-3xl font-bold mb-6 text-center text-purple-800">
                👑 Everything Handled For You
              </h3>
              <div className="space-y-4">
                {[
                  { item: "Licensed attorney manages your entire case", value: "$500" },
                  { item: "All paperwork completed and filed for you", value: "$300" },
                  { item: "Court appearances handled (if needed)", value: "$400" },
                  { item: "Direct attorney communication throughout", value: "$200" },
                  { item: "Case tracking and status updates", value: "$150" },
                  { item: "Guarantee: 99% success rate or full refund", value: "$450" }
                ].map((item, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + index * 0.1 }}
                    className="flex justify-between items-center p-4 bg-purple-50 rounded-lg border-l-4 border-purple-500"
                  >
                    <span className="font-semibold text-gray-900">✅ {item.item}</span>
                    <span className="font-bold text-purple-600">{item.value}</span>
                  </motion.div>
                ))}
              </div>
              <div className="mt-6 p-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border-2 border-yellow-300">
                <div className="text-center text-yellow-800">
                  <div className="text-xl font-bold">Complete Attorney Service</div>
                  <div className="text-3xl font-bold text-green-600 mt-2">Your Price: $1,497</div>
                  <div className="text-lg font-semibold">Professional White-Glove Service</div>
                </div>
              </div>
            </motion.div>

            {/* Comparison */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white p-8 rounded-2xl shadow-lg"
            >
              <h3 className="text-2xl font-bold mb-6 text-center">📊 Why Full Service Wins</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="py-3 px-4 text-left font-bold text-gray-900">Feature</th>
                      <th className="py-3 px-4 text-center text-red-600 font-bold">DIY ($97)</th>
                      <th className="py-3 px-4 text-center text-orange-600 font-bold">Review ($297)</th>
                      <th className="py-3 px-4 text-center text-purple-600 bg-purple-50 font-bold">Full Service ($1,497)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-3 px-4 font-semibold text-gray-900">Your Work Required</td>
                      <td className="py-3 px-4 text-center text-red-600 font-semibold">All of it</td>
                      <td className="py-3 px-4 text-center text-orange-600 font-semibold">Most of it</td>
                      <td className="py-3 px-4 text-center bg-purple-50 text-purple-600 font-bold">ZERO ✨</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4 font-semibold text-gray-900">Success Rate</td>
                      <td className="py-3 px-4 text-center text-red-600 font-semibold">65%</td>
                      <td className="py-3 px-4 text-center text-orange-600 font-semibold">96%</td>
                      <td className="py-3 px-4 text-center bg-purple-50 text-purple-600 font-bold">99% 🏆</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4 font-semibold text-gray-900">Time to Complete</td>
                      <td className="py-3 px-4 text-center text-red-600 font-semibold">6+ months</td>
                      <td className="py-3 px-4 text-center text-orange-600 font-semibold">4-6 months</td>
                      <td className="py-3 px-4 text-center bg-purple-50 text-purple-600 font-bold">2-3 months ⚡</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-semibold text-gray-900">Stress Level</td>
                      <td className="py-3 px-4 text-center text-red-600 font-semibold">High 😰</td>
                      <td className="py-3 px-4 text-center text-orange-600 font-semibold">Medium 😐</td>
                      <td className="py-3 px-4 text-center bg-purple-50 text-purple-600 font-bold">Zero 😌</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </motion.div>

            {/* Success Stories */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white p-8 rounded-2xl shadow-lg"
            >
              <h3 className="text-2xl font-bold mb-6 text-center">⭐ Full Service Success Stories</h3>
              <div className="space-y-6">
                <div className="border-l-4 border-purple-500 pl-4 bg-purple-50 p-4 rounded-r-lg">
                  <div className="flex mb-2">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-yellow-400 text-lg">★</span>
                    ))}
                  </div>
                  <p className="text-gray-800 italic mb-3 font-medium">
                    "I literally did NOTHING except pay. Attorney handled everything - forms, filing, court appearances. 
                    My record was cleared in 2 months. Worth every penny!"
                  </p>
                  <div className="text-sm">
                    <div className="font-bold text-gray-900">Jennifer R., Marketing Executive</div>
                    <div className="text-gray-800 font-medium">Los Angeles, CA • Completed in 8 weeks</div>
                  </div>
                </div>
                <div className="border-l-4 border-purple-500 pl-4 bg-purple-50 p-4 rounded-r-lg">
                  <div className="flex mb-2">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-yellow-400 text-lg">★</span>
                    ))}
                  </div>
                  <p className="text-gray-800 italic mb-3 font-medium">
                    "Best investment I've ever made. Got promoted 3 months after my record was cleared. 
                    The attorney was amazing - kept me updated every step."
                  </p>
                  <div className="text-sm">
                    <div className="font-bold text-gray-900">Michael T., Software Engineer</div>
                    <div className="text-gray-800 font-medium">San Francisco, CA • $40k salary increase</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Side - Checkout */}
          <div className="lg:sticky lg:top-8">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white p-8 rounded-2xl shadow-2xl border-2 border-purple-200"
            >
              <div className="text-center mb-8">
                <div className="bg-purple-100 text-purple-800 px-4 py-2 rounded-full inline-block mb-4 font-semibold">
                  👑 PREMIUM WHITE-GLOVE SERVICE
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Zero Work For You
                </h2>
                <p className="text-gray-800 font-medium">
                  99% success rate • Completed in 2-3 months
                </p>
              </div>

              {/* Payment Options */}
              <div className="mb-8">
                <h3 className="font-bold text-lg mb-4 text-gray-900">Choose Your Payment Option:</h3>
                <div className="space-y-3">
                  <div 
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      paymentPlan === 'full' 
                        ? 'border-purple-500 bg-purple-50' 
                        : 'border-gray-300 hover:border-purple-300'
                    }`}
                    onClick={() => setPaymentPlan('full')}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-bold text-lg text-gray-900">Pay in Full</div>
                        <div className="text-sm text-gray-800 font-medium">Complete attorney service</div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-600">$1,497</div>
                        <div className="text-sm text-gray-700 font-medium">One-time payment</div>
                      </div>
                    </div>
                  </div>
                  
                  <div 
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      paymentPlan === 'payment' 
                        ? 'border-purple-500 bg-purple-50' 
                        : 'border-gray-300 hover:border-purple-300'
                    }`}
                    onClick={() => setPaymentPlan('payment')}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-bold text-lg text-gray-900">Payment Plan</div>
                        <div className="text-sm text-gray-800 font-medium">$300 down, then $299/month × 4</div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600">$300</div>
                        <div className="text-sm text-gray-800 font-medium">down payment</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-4 px-6 rounded-lg font-bold text-lg transition-all transform hover:scale-105 mb-6"
              >
                {paymentPlan === 'full' 
                  ? '👑 Get White-Glove Service - $1,497'
                  : '👑 Start with $300 - Payment Plan'
                }
              </button>

              {/* Guarantees */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl">💰</div>
                  <div>
                    <div className="font-semibold text-green-800">100% Money-Back Guarantee</div>
                    <div className="text-sm text-green-800 font-medium">If we don't clear your record, full refund</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl">⚡</div>
                  <div>
                    <div className="font-semibold text-blue-800">Fast-Track Processing</div>
                    <div className="text-sm text-blue-800 font-medium">Priority handling, completed in 2-3 months</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                  <div className="text-2xl">🎯</div>
                  <div>
                    <div className="font-semibold text-purple-800">99% Success Rate</div>
                    <div className="text-sm text-purple-800 font-medium">Industry-leading success rate with full service</div>
                  </div>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-3 gap-4 text-center text-xs text-gray-800 font-medium">
                  <div className="flex flex-col items-center">
                    <svg className="w-6 h-6 text-green-500 mb-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    <span>SSL Secured</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <svg className="w-6 h-6 text-purple-500 mb-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Licensed Attorneys</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <svg className="w-6 h-6 text-yellow-500 mb-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>99% Success</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Urgency */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-6 bg-red-50 p-6 rounded-xl border-2 border-red-200 text-center"
            >
              <h4 className="font-bold text-red-800 mb-2">⏰ Professional Service!</h4>
              <p className="text-red-800 text-sm font-medium">
                Complete white-glove attorney service for just $1,497. 
                Zero work required - we handle everything for you.
              </p>
              <div className="mt-3 text-xs text-red-700 font-semibold">
                ⚡ Only 5 premium slots available this month
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
} 