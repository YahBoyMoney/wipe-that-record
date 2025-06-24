'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function HomePage() {
  const [formData, setFormData] = useState({ fullName: '', email: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');
    
    // Basic validation
    if (!formData.fullName || !formData.email) {
      setMessage('❌ Please fill in all fields');
      setIsSubmitting(false);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setMessage('❌ Please enter a valid email address');
      setIsSubmitting(false);
      return;
    }

    try {
      console.log('💰 SALES READY! Lead data:', formData);
      
      // Show success message
      setMessage('✅ Success! Redirecting to checkout...');
      
      // Store lead data in sessionStorage for later use
      sessionStorage.setItem('leadData', JSON.stringify({
        fullName: formData.fullName,
        email: formData.email,
        timestamp: new Date().toISOString(),
        source: 'direct'
      }));
      
      // Redirect directly to DIY checkout after 1 second
      setTimeout(() => {
        window.location.href = '/api/checkout/diy';
      }, 1000);
      
    } catch (error) {
      console.error('Error:', error);
      setMessage('❌ Something went wrong. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white">
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Clear Your Criminal Record Today
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100">
            California expungement help starting at just $50
          </p>
          <Link
            href="/api/checkout/diy"
            className="inline-block bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-lg text-xl transition-colors"
          >
            Start for $50
          </Link>
        </div>
      </section>

      {/* Step-by-Step Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Fill Out Form</h3>
              <p className="text-gray-600">Provide your basic information to get started</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Pay $50</h3>
              <p className="text-gray-600">Secure payment for your DIY expungement package</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Get Instructions</h3>
              <p className="text-gray-600">Receive detailed filing instructions instantly</p>
            </div>
          </div>
        </div>
      </section>

      {/* DIY Form Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-2xl">
          <h2 className="text-3xl font-bold text-center mb-8">Get Started Now</h2>
          <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg border">
            {message && (
              <div className={`mb-6 p-4 rounded-md text-sm font-medium ${
                message.includes('✅') 
                  ? 'bg-green-50 text-green-800 border border-green-200' 
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                {message}
              </div>
            )}
            
            <div className="mb-6">
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                id="fullName"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="Enter your full name"
              />
            </div>
            <div className="mb-6">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Enter your email address"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Processing...' : '💳 Get Started Now - $50'}
            </button>
          </form>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Clients Say</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
                <div>
                  <h4 className="font-semibold">Sarah M.</h4>
                  <p className="text-sm text-gray-600">Los Angeles, CA</p>
                </div>
              </div>
              <p className="text-gray-700">"The process was so much easier than I expected. Got my record cleared in just 3 months!"</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
                <div>
                  <h4 className="font-semibold">Mike T.</h4>
                  <p className="text-sm text-gray-600">San Diego, CA</p>
                </div>
              </div>
              <p className="text-gray-700">"Finally got that old conviction off my record. Worth every penny!"</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
                <div>
                  <h4 className="font-semibold">Jennifer R.</h4>
                  <p className="text-sm text-gray-600">San Francisco, CA</p>
                </div>
              </div>
              <p className="text-gray-700">"Professional service and great support. Highly recommend!"</p>
            </div>
          </div>
        </div>
      </section>

      {/* Upsell Preview Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Want us to do it for you?</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-amber-50 p-8 rounded-lg border border-amber-200">
              <h3 className="text-2xl font-bold mb-4 text-amber-800">$100 Expert Help</h3>
              <p className="text-gray-700 mb-6">We'll verify your eligibility and fast-track your case.</p>
              <ul className="text-sm text-gray-600 mb-6">
                <li className="mb-2">✓ Eligibility verification</li>
                <li className="mb-2">✓ Record lookup service</li>
                <li className="mb-2">✓ Priority support</li>
              </ul>
              <Link
                href="/api/checkout/upgrade?type=review"
                className="block w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-4 rounded-md transition-colors text-center"
              >
                Upgrade for $100
              </Link>
            </div>
            <div className="bg-green-50 p-8 rounded-lg border border-green-200">
              <h3 className="text-2xl font-bold mb-4 text-green-800">$1500 Full Service</h3>
              <p className="text-gray-700 mb-6">We handle everything, you just sign.</p>
              <ul className="text-sm text-gray-600 mb-6">
                <li className="mb-2">✓ Complete case management</li>
                <li className="mb-2">✓ Attorney representation</li>
                <li className="mb-2">✓ Court filing included</li>
              </ul>
              <Link
                href="/api/checkout/upgrade?type=full"
                className="block w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-md transition-colors text-center"
              >
                Go Full Service
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2">Am I eligible for expungement in California?</h3>
              <p className="text-gray-700">Most misdemeanor and felony convictions are eligible if you completed your sentence and aren't currently charged with a crime.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2">How long does the process take?</h3>
              <p className="text-gray-700">Typically 2-4 months from filing to completion, depending on the court's schedule.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2">What if my petition is denied?</h3>
              <p className="text-gray-700">We offer a full refund if your case is deemed ineligible after our review.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2">Is this service legitimate?</h3>
              <p className="text-gray-700">Yes, we're a registered California legal service provider helping thousands clear their records.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Wipe That Record</h3>
              <p className="text-gray-300">Helping Californians clear their criminal records since 2020.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <p className="text-gray-300">admin@wipethatrecord.com</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <div className="space-y-2">
                <Link href="/privacy" className="block text-gray-300 hover:text-white">Privacy Policy</Link>
                <Link href="/terms" className="block text-gray-300 hover:text-white">Terms of Service</Link>
                <Link href="/about" className="block text-gray-300 hover:text-white">About</Link>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <p className="text-gray-400">&copy; 2024 Wipe That Record. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
