'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Hero } from '@/components/Hero';
import { PlanCard } from '@/components/PlanCard';
import Image from 'next/image';

export default function LandingPage() {
  const [showExitModal, setShowExitModal] = useState(false);
  const [hasSeenExitModal, setHasSeenExitModal] = useState(false);
  const [showCookieBanner, setShowCookieBanner] = useState(false);

  // Exit intent detection
  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !hasSeenExitModal) {
        setShowExitModal(true);
        setHasSeenExitModal(true);
      }
    };

    // Cookie banner
    const hasAcceptedCookies = localStorage.getItem('cookiesAccepted');
    if (!hasAcceptedCookies) {
      setShowCookieBanner(true);
    }

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, [hasSeenExitModal]);

  const acceptCookies = () => {
    localStorage.setItem('cookiesAccepted', 'true');
    setShowCookieBanner(false);
  };

  return (
    <>
      {/* Cookie Banner */}
      {showCookieBanner && (
        <motion.div 
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="fixed bottom-0 left-0 right-0 bg-slate-900 text-white p-4 z-50"
        >
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm">
              We use cookies to enhance your experience and analyze our traffic. By continuing, you consent to our use of cookies.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={acceptCookies}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
              >
                Accept
              </button>
              <button 
                onClick={() => setShowCookieBanner(false)}
                className="border border-slate-600 hover:border-slate-500 px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
              >
                Decline
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Exit Intent Modal */}
      {showExitModal && (
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
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-2xl font-bold mb-4 text-slate-900">Wait! Special Offer</h3>
            <p className="text-slate-600 mb-6">
              Get 10% off your DIY Expungement Kit - Limited time offer for first-time visitors!
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => {
                  setShowExitModal(false);
                  window.location.href = '/api/checkout/diy?discount=10';
                }}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors"
              >
                Get 10% Off - $45
              </button>
              <button 
                onClick={() => setShowExitModal(false)}
                className="flex-1 border border-slate-300 hover:bg-slate-50 py-3 rounded-lg font-semibold text-slate-700 transition-colors"
              >
                No Thanks
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Sticky notification bar */}
      <motion.div 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="sticky top-0 z-40 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-900 text-center py-2 px-4"
      >
        <p className="text-sm font-semibold">
          🔥 Limited Time: DIY Expungement Kit - Only $50 (Save $200)
        </p>
      </motion.div>

      <main className="min-h-screen bg-white dark:bg-slate-900 overflow-x-hidden">
        {/* Hero section */}
        <Hero variant="a" />

        {/* Live counter */}
        <motion.section 
          className="py-12 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-8 flex-wrap">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-lg font-semibold">Live Counter</span>
              </div>
              
              <div className="text-center">
                <motion.div 
                  className="text-4xl font-bold"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  1,847
                </motion.div>
                <div className="text-blue-100">Californians Served</div>
              </div>
              
              <div className="flex items-center gap-6 text-sm">
                <div className="text-center">
                  <div className="font-semibold">98.7%</div>
                  <div className="text-blue-100">Success Rate</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold">21 Days</div>
                  <div className="text-blue-100">Avg. Processing</div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Value proposition cards */}
        <section id="plans" className="py-20 px-4 bg-slate-50 dark:bg-slate-800">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <motion.h2 
                className="text-4xl font-bold mb-4 text-slate-900 dark:text-white"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                Choose Your Path to Freedom
              </motion.h2>
              <motion.p 
                className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                viewport={{ once: true }}
              >
                Two proven options to clear your California record and unlock new opportunities
              </motion.p>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <PlanCard
                title="DIY Expungement Kit"
                price="$50"
                originalPrice="$250"
                description="Perfect for straightforward misdemeanor cases"
                features={[
                  "Step-by-step video tutorials",
                  "All required court forms",
                  "Email support included",
                  "30-day money-back guarantee",
                  "Average completion: 2-3 weeks"
                ]}
                cta="Start DIY for $50"
                ctaVariant="primary"
                popular={false}
                savings="Save $200"
                href="/api/checkout/diy"
              />
              <PlanCard
                title="Full-Service Expungement"
                price="$1,500"
                description="Attorney-handled with guaranteed results"
                features={[
                  "Licensed CA attorney representation",
                  "Complete case management",
                  "Court appearances included",
                  "100% success guarantee",
                  "Completed in 30-60 days"
                ]}
                cta="Free Eligibility Check"
                ctaVariant="secondary"
                popular={true}
                badge="Most Successful"
                href="/api/checkout/upgrade?type=full"
              />
            </div>
          </div>
        </section>

        {/* Process timeline */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <motion.h2 
                className="text-4xl font-bold mb-4 text-slate-900 dark:text-white"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                Simple 3-Step Process
              </motion.h2>
              <motion.p 
                className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                viewport={{ once: true }}
              >
                From application to approval, we make expungement straightforward and stress-free
              </motion.p>
            </div>
            
            <div className="relative">
              {/* Connection line */}
              <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-200 via-blue-400 to-blue-200 dark:from-blue-800 dark:via-blue-600 dark:to-blue-800 transform -translate-y-1/2"></div>
              
              <div className="grid md:grid-cols-3 gap-8 relative z-10">
                {[
                  {
                    number: 1,
                    title: "Check Eligibility",
                    description: "Quick 2-minute form to see if your record qualifies for expungement",
                    icon: "📋",
                    duration: "2 minutes"
                  },
                  {
                    number: 2,
                    title: "File Paperwork",
                    description: "We handle all court filings and legal documentation for you",
                    icon: "📄",
                    duration: "1-2 weeks"
                  },
                  {
                    number: 3,
                    title: "Court Approval",
                    description: "Judge reviews and approves your expungement petition",
                    icon: "⚖️",
                    duration: "2-4 weeks"
                  }
                ].map((step, index) => (
                  <motion.div
                    key={step.number}
                    className="text-center relative"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.2 }}
                    viewport={{ once: true }}
                  >
                    <motion.div 
                      className="relative mx-auto mb-6"
                      whileHover={{ scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto shadow-lg">
                        {step.number}
                      </div>
                      <div className="absolute -top-2 -right-2 text-2xl">
                        {step.icon}
                      </div>
                    </motion.div>
                    
                    <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">
                      {step.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
                      {step.description}
                    </p>
                    <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-sm font-medium">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {step.duration}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 px-4 bg-slate-50 dark:bg-slate-800">
          <div className="max-w-6xl mx-auto">
            <motion.h2 
              className="text-4xl font-bold text-center mb-16 text-slate-900 dark:text-white"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              What Our Clients Say
            </motion.h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  quote: "The DIY kit was incredibly detailed and easy to follow. Had my misdemeanor expunged in just 3 weeks!",
                  author: "Sarah M.",
                  location: "Los Angeles, CA",
                  avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=100&h=100&fit=crop&crop=face"
                },
                {
                  quote: "Professional service and amazing results. Finally got that old DUI off my record. Life-changing!",
                  author: "Michael R.",
                  location: "San Diego, CA",
                  avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
                },
                {
                  quote: "The full-service option was worth every penny. They handled everything while I focused on my life.",
                  author: "Jennifer K.",
                  location: "San Francisco, CA",
                  avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face"
                }
              ].map((testimonial, index) => (
                <motion.div
                  key={index}
                  className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-lg"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                >
                  <div className="flex justify-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-yellow-400 text-xl">★</span>
                    ))}
                  </div>
                  
                  <blockquote className="text-slate-700 dark:text-slate-300 mb-6 italic text-center">
                    "{testimonial.quote}"
                  </blockquote>
                  
                  <div className="flex items-center justify-center gap-3">
                    <Image
                      src={testimonial.avatar}
                      alt={testimonial.author}
                      width={50}
                      height={50}
                      className="rounded-full"
                    />
                    <div className="text-center">
                      <div className="font-semibold text-slate-900 dark:text-white">
                        {testimonial.author}
                      </div>
                      <div className="text-sm text-slate-500 dark:text-slate-400">
                        {testimonial.location}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <motion.h2 
              className="text-4xl font-bold text-center mb-16 text-slate-900 dark:text-white"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Frequently Asked Questions
            </motion.h2>
            
            <div className="space-y-4">
              {[
                {
                  question: "What records can be expunged in California?",
                  answer: "Most misdemeanor convictions and some felony convictions can be expunged, including DUI, theft, drug possession, and domestic violence cases. We'll check your specific case during the eligibility review."
                },
                {
                  question: "How long does the expungement process take?",
                  answer: "DIY cases typically take 2-4 weeks, while full-service cases are completed in 30-60 days depending on court schedules."
                },
                {
                  question: "Will employers be able to see my expunged record?",
                  answer: "No, expunged records are sealed from most background checks. However, certain government positions and professional licenses may still have access."
                },
                {
                  question: "What's the difference between DIY and full-service?",
                  answer: "DIY provides you with all forms and instructions to file yourself. Full-service means our attorney handles everything including court appearances."
                },
                {
                  question: "Is there a money-back guarantee?",
                  answer: "Yes, if your case doesn't qualify for expungement after our review, we'll refund your payment in full."
                }
              ].map((faq, index) => (
                <motion.details 
                  key={index} 
                  className="group border border-slate-200 dark:border-slate-700 rounded-lg"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <summary className="flex justify-between items-center p-6 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg">
                    <h3 className="font-semibold text-slate-900 dark:text-white pr-4">
                      {faq.question}
                    </h3>
                    <span className="text-slate-500 group-open:rotate-180 transition-transform">
                      ▼
                    </span>
                  </summary>
                  <div className="px-6 pb-6">
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </motion.details>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA section */}
        <section className="py-20 px-4 bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <motion.h2 
              className="text-4xl font-bold text-white mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Your Fresh Start Begins Today
            </motion.h2>
            <motion.p 
              className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              viewport={{ once: true }}
            >
              Join thousands of Californians who've successfully cleared their records and transformed their lives
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-6 justify-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
            >
              <button 
                onClick={() => window.location.href = '/api/checkout/diy'}
                className="group bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
              >
                <span className="flex items-center justify-center gap-2">
                  Start DIY for $50
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </button>
              <button 
                onClick={() => window.location.href = '/api/checkout/upgrade?type=full'}
                className="group border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105"
              >
                Free Eligibility Check
              </button>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-slate-900 text-white py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8 mb-12">
              <div className="col-span-2">
                <h3 className="text-2xl font-bold mb-4">Wipe That Record</h3>
                <p className="text-slate-300 mb-6 max-w-md">
                  Professional California expungement services helping you clear your record and reclaim your future.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">Services</h4>
                <ul className="space-y-2 text-slate-300">
                  <li><a href="#" className="hover:text-white transition-colors">DIY Expungement</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Full Service</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Eligibility Check</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">Legal</h4>
                <ul className="space-y-2 text-slate-300">
                  <li><a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a></li>
                  <li><a href="/terms" className="hover:text-white transition-colors">Terms of Service</a></li>
                  <li><a href="/accessibility" className="hover:text-white transition-colors">Accessibility</a></li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-sm text-slate-400">
                <p>Attorney: Tam Berhe, State Bar #298992</p>
                <p className="mt-1">This site is attorney advertising. Prior results do not guarantee a similar outcome.</p>
              </div>
            </div>
          </div>
        </footer>
      </main>

      {/* Sticky bottom CTA for mobile */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 p-4 md:hidden z-40">
        <div className="flex gap-3">
          <button 
            onClick={() => window.location.href = '/api/checkout/diy'}
            className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-lg font-semibold text-sm"
          >
            Start DIY $50
          </button>
          <button 
            onClick={() => window.location.href = '/api/checkout/upgrade?type=full'}
            className="flex-1 border border-blue-600 text-blue-600 px-4 py-3 rounded-lg font-semibold text-sm"
          >
            Free Check
          </button>
        </div>
      </div>
    </>
  );
}
