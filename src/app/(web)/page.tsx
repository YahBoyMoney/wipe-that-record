'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Hero } from '@/components/Hero';
import { PlanCard } from '@/components/PlanCard';
import { LeadCaptureForm } from '@/components/LeadCaptureForm';
import Image from 'next/image';

export default function LandingPage() {
  const [showExitModal, setShowExitModal] = useState(false);
  const [hasSeenExitModal, setHasSeenExitModal] = useState(false);
  const [showCookieBanner, setShowCookieBanner] = useState(false);
  const [showQualificationModal, setShowQualificationModal] = useState(false);

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

  const openQualificationModal = () => {
    setShowQualificationModal(true);
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

      {/* Qualification Modal */}
      {showQualificationModal && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto"
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative w-full max-w-md"
          >
            <LeadCaptureForm 
              variant="modal" 
              leadMagnet="landing-page-qualification"
              onClose={() => setShowQualificationModal(false)}
            />
          </motion.div>
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
            <h3 className="text-2xl font-bold mb-4 text-slate-900">Before you go</h3>
            <p className="text-slate-800 mb-6">
              Not sure if your case qualifies? Take the free 2-minute eligibility check first &mdash;
              no payment required.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowExitModal(false);
                  openQualificationModal();
                }}
                className="flex-1 bg-[#0f2747] hover:bg-[#163a66] text-white py-3 rounded-lg font-semibold transition-colors"
              >
                Check Eligibility Free
              </button>
              <button 
                onClick={() => setShowExitModal(false)}
                className="flex-1 border border-slate-300 hover:bg-slate-50 py-3 rounded-lg font-semibold text-slate-900 transition-colors"
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
        className="relative z-30 bg-slate-100 text-slate-800 text-center py-2 px-4 border-b border-slate-200"
      >
        <p className="text-sm font-medium">
          DIY Record-Cleaning Kit &mdash; $97 (Save $50 from $147) |
          <button
            onClick={openQualificationModal}
            className="ml-2 underline hover:no-underline font-semibold"
          >
            Check if you qualify
          </button>
        </p>
      </motion.div>

      <main className="min-h-screen bg-white dark:bg-slate-900 overflow-x-hidden">
        {/* Hero section */}
        <Hero variant="a" />

        {/* Qualification CTA Section */}
        <motion.section
          className="py-16 px-4 bg-[#0f2747] text-white"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="max-w-4xl mx-auto text-center">
            <motion.h2
              className="text-3xl sm:text-4xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Find Out Which Options May Apply in 2 Minutes
            </motion.h2>
            <motion.p
              className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              viewport={{ once: true }}
            >
              Many California cases qualify for some form of record relief. Take our quick assessment to see which options may apply to your situation and get a personalized roadmap.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
            >
              <button
                onClick={openQualificationModal}
                className="group bg-white text-[#0f2747] hover:bg-slate-100 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:shadow-xl"
              >
                <span className="flex items-center justify-center gap-2">
                  Check My Eligibility &mdash; Free
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </button>
              <div className="text-slate-300 text-sm">
                Get results instantly &bull; Custom roadmap sent to your email
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Trust strip */}
        <motion.section
          className="py-12 px-4 bg-slate-900 text-white"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="max-w-5xl mx-auto">
            <div className="grid gap-6 sm:grid-cols-3 text-center">
              <div>
                <div className="text-lg font-semibold">California-focused</div>
                <div className="text-slate-400 text-sm">Forms and guidance built around California courts and procedures</div>
              </div>
              <div>
                <div className="text-lg font-semibold">Three clear paths</div>
                <div className="text-slate-400 text-sm">DIY kit, expert review, and attorney-managed full service</div>
              </div>
              <div>
                <div className="text-lg font-semibold">Refund protection</div>
                <div className="text-slate-400 text-sm">Refund if the kit does not match your eligibility after review</div>
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
                Choose the Right Path for Your Case
              </motion.h2>
              <motion.p
                className="text-xl text-slate-800 dark:text-slate-300 max-w-2xl mx-auto mb-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                viewport={{ once: true }}
              >
                Three service levels to help you pursue California record relief &mdash; pick what fits your situation
              </motion.p>
              
              {/* Qualification CTA in plans section */}
              <motion.div 
                className="inline-block"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                viewport={{ once: true }}
              >
                <button
                  onClick={openQualificationModal}
                  className="bg-[#0f2747] hover:bg-[#163a66] text-white px-6 py-3 rounded-lg font-semibold transition-colors inline-flex items-center gap-2"
                >
                  Find out which option fits your case
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
              </motion.div>
            </div>
            
            <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <PlanCard
                title="DIY Kit"
                price="$97"
                originalPrice="$147"
                description="Best for straightforward cases where you want the forms and instructions"
                features={[
                  "Complete California forms package",
                  "Step-by-step instructions",
                  "Sample completed forms",
                  "Email support included",
                  "Instant access after purchase"
                ]}
                cta="Get DIY Kit - $97"
                ctaVariant="primary"
                popular={true}
                savings="Save $50"
                href="/checkout/diy"
              />
              <PlanCard
                title="Expert Review"
                price="$297"
                description="Best before you file: a specialist reviews your case and paperwork"
                features={[
                  "Everything in DIY +",
                  "Expert form completion",
                  "Case-specific review & analysis",
                  "Phone consultation",
                  "Filing guidance"
                ]}
                cta="Get Expert Review"
                ctaVariant="secondary"
                popular={false}
                href="/checkout/review"
              />
              <PlanCard
                title="Full Service"
                price="$1,497"
                description="Best for complex cases: attorney-managed support from start to finish"
                features={[
                  "Attorney-managed service",
                  "Attorney prepares and files paperwork",
                  "Court appearances handled if required",
                  "Direct attorney access",
                  "Engagement agreement required"
                ]}
                cta="Get Full Service"
                ctaVariant="secondary"
                popular={false}
                badge="Premium"
                href="/checkout/full-service"
              />
            </div>
          </div>
        </section>

        {/* Plan comparison */}
        <section className="py-16 px-4 bg-white dark:bg-slate-900">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-10 text-slate-900 dark:text-white">
              Compare your options
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b-2 border-slate-200 dark:border-slate-700">
                    <th className="py-3 pr-4 font-semibold text-slate-700 dark:text-slate-200">Feature</th>
                    <th className="py-3 px-3 text-center font-semibold text-slate-900 dark:text-white">DIY Kit</th>
                    <th className="py-3 px-3 text-center font-semibold text-slate-900 dark:text-white">Expert Review</th>
                    <th className="py-3 px-3 text-center font-semibold text-slate-900 dark:text-white">Full Service</th>
                  </tr>
                </thead>
                <tbody className="text-slate-700 dark:text-slate-300">
                  {[
                    ['Forms and instructions', 'Yes', 'Yes', 'Yes'],
                    ['Case-specific review', 'No', 'Yes', 'Yes'],
                    ['Attorney-managed filing', 'No', 'No', 'Yes'],
                    ['Court appearances handled', 'No', 'No', 'Yes, if required'],
                    ['Best for', 'Simple cases', 'Unsure cases', 'Complex cases'],
                  ].map((row) => (
                    <tr key={row[0]} className="border-b border-slate-100 dark:border-slate-800">
                      <td className="py-3 pr-4 font-medium">{row[0]}</td>
                      <td className="py-3 px-3 text-center">{row[1]}</td>
                      <td className="py-3 px-3 text-center">{row[2]}</td>
                      <td className="py-3 px-3 text-center">{row[3]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* What happens after purchase */}
        <section className="py-20 px-4 bg-slate-50 dark:bg-slate-800">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-slate-900 dark:text-white">
                What happens after you buy the DIY kit
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                No waiting and no surprises. You get instant access to everything you need to prepare
                your California paperwork.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {[
                {
                  title: 'Instant access to your kit',
                  body: 'Right after checkout you receive the California forms package, step-by-step instructions, and sample completed forms.',
                },
                {
                  title: 'Clear filing instructions',
                  body: 'Plain-language guidance walks you through completing your forms and filing with the correct court for your county.',
                },
                {
                  title: 'Email support included',
                  body: 'Questions while you work through the kit? Reach our support team by email for help with the process.',
                },
                {
                  title: 'Upgrade any time',
                  body: 'If your case turns out to be more complex, you can add expert review or full service so a specialist handles more for you.',
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900"
                >
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{item.title}</h3>
                  <p className="mt-2 text-slate-600 dark:text-slate-300">{item.body}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-2xl bg-[#0f2747] p-6 text-center text-white">
              <p className="font-semibold">Eligibility &amp; refund reassurance</p>
              <p className="mt-2 text-slate-300 text-sm max-w-2xl mx-auto">
                Not sure you qualify? Start with the free eligibility check. If you buy the kit and your
                case does not match your eligibility after review, you are covered by our 30-day refund.
                Court timelines and outcomes vary by county and case type.
              </p>
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
                className="text-xl text-slate-800 dark:text-slate-300 max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                viewport={{ once: true }}
              >
                From eligibility check to filing, we make record cleaning straightforward and clear
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
                    description: "A quick 2-minute assessment to see which record-cleaning options may apply to your case",
                    duration: "About 2 minutes",
                    cta: true
                  },
                  {
                    number: 2,
                    title: "Prepare Your Petition",
                    description: "Get California-focused forms and instructions, or have a specialist or attorney prepare them for you",
                    duration: "Get started in minutes"
                  },
                  {
                    number: 3,
                    title: "File With the Court",
                    description: "File your petition with the correct court. Review and timelines depend on the court and your case",
                    duration: "Court timelines vary by county"
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
                      <div className="w-20 h-20 bg-[#0f2747] text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto shadow-lg">
                        {step.number}
                      </div>
                    </motion.div>
                    
                    <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">
                      {step.title}
                    </h3>
                    <p className="text-slate-800 dark:text-slate-300 mb-4 leading-relaxed">
                      {step.description}
                    </p>
                    <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-sm font-medium mb-4">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {step.duration}
                    </div>
                    
                    {step.cta && (
                      <button 
                        onClick={openQualificationModal}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                      >
                        Start Here - Check Eligibility
                      </button>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
            
            {/* Additional CTA after process */}
            <motion.div 
              className="text-center mt-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <button 
                onClick={openQualificationModal}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl inline-flex items-center gap-2"
              >
                Get My Eligibility Report
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
              <p className="text-slate-800 dark:text-slate-300 mt-2 text-sm">
                Free • Takes 2 minutes • Results sent to your email
              </p>
            </motion.div>
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
                  quote: "The DIY kit was detailed and easy to follow. The instructions made preparing my misdemeanor paperwork far less intimidating.",
                  author: "Sarah M.",
                  location: "Los Angeles, CA",
                  avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=100&h=100&fit=crop&crop=face"
                },
                {
                  quote: "Clear, professional guidance through the whole process of addressing my old DUI. I always knew what the next step was.",
                  author: "Michael R.",
                  location: "San Diego, CA",
                  avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
                },
                {
                  quote: "The full-service option was worth it for my situation. Having a specialist handle the paperwork and filing gave me peace of mind.",
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
                  
                  <blockquote className="text-slate-800 dark:text-slate-300 mb-6 italic text-center">
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
                      <div className="text-sm text-gray-800 dark:text-gray-200 font-medium">
                        {testimonial.location}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            {/* CTA after testimonials */}
            <motion.div 
              className="text-center mt-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <p className="text-slate-600 dark:text-slate-300 mb-4">
                Ready to join thousands of Californians who've cleared their records?
              </p>
              <button 
                onClick={openQualificationModal}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors inline-flex items-center gap-2"
              >
                See If Your Case Qualifies
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </motion.div>
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
                  question: "Is this legal advice?",
                  answer: "The DIY kit is document-preparation support, not legal advice. Using this site does not create an attorney-client relationship. If you choose full service, an attorney-client relationship is formed only after a written engagement agreement is signed."
                },
                {
                  question: "Will this erase my record completely?",
                  answer: "True expungement does not exist in California. Depending on your case, you may be eligible for relief such as dismissal, record sealing, felony reduction, or automatic record relief. We help you identify and pursue the options that may apply to your situation."
                },
                {
                  question: "Can employers still see my record?",
                  answer: "Record relief can limit what appears in many public and employment background checks, but some government agencies, licensing bodies, and legally authorized employers may still access certain records. We explain what relief does and does not do for your case."
                },
                {
                  question: "How long does the court take?",
                  answer: "You can get started and prepare paperwork quickly, but court timelines vary by county, case type, and eligibility. We do not control court schedules and cannot guarantee a specific approval date."
                },
                {
                  question: "What happens after I buy the DIY kit?",
                  answer: "You get instant access to the California forms package, step-by-step instructions, and sample completed forms, plus email support. If your case is more complex, you can upgrade to expert review or full service."
                },
                {
                  question: "What if I don't qualify?",
                  answer: "Start with the free eligibility check before paying. If you buy the DIY kit and your case does not match your eligibility after review, you're covered by our 30-day refund policy."
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
                    <span className="text-gray-700 group-open:rotate-180 transition-transform">
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
            
            {/* FAQ CTA */}
            <motion.div 
              className="text-center mt-12 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                Still Have Questions About Your Specific Case?
              </h3>
              <p className="text-slate-600 dark:text-slate-300 mb-4">
                Get personalized answers based on your conviction type and circumstances
              </p>
              <button 
                onClick={openQualificationModal}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors inline-flex items-center gap-2"
              >
                Get My Custom Case Assessment
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </motion.div>
          </div>
        </section>

        {/* Final CTA section */}
        <section className="py-20 px-4 bg-[#0f2747] relative overflow-hidden">
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <motion.h2
              className="text-4xl font-bold text-white mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Take the First Step Today
            </motion.h2>
            <motion.p
              className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              viewport={{ once: true }}
            >
              Start with a free, private eligibility check to see which California record-cleaning options may apply to your case.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-6 justify-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
            >
              <button
                onClick={openQualificationModal}
                className="group bg-white text-[#0f2747] hover:bg-slate-100 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:shadow-xl"
              >
                <span className="flex items-center justify-center gap-2">
                  Check If I Qualify &mdash; Free
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </button>
              <button
                onClick={() => window.location.href = '/checkout/diy'}
                className="group border-2 border-white text-white hover:bg-white hover:text-[#0f2747] px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300"
              >
                Get the DIY Kit &mdash; $97
              </button>
            </motion.div>

            <motion.p
              className="text-slate-400 mt-6 text-sm"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              viewport={{ once: true }}
            >
              Instant access &bull; 30-day refund if your case does not qualify after review
            </motion.p>
          </div>
        </section>

        {/* Floating CTA Button - appears after scrolling */}
        <motion.div 
          className="fixed bottom-6 right-6 z-40"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 3 }}
        >
          <button
            onClick={openQualificationModal}
            className="bg-[#0f2747] hover:bg-[#163a66] text-white px-5 py-3 rounded-full shadow-xl transition-all duration-300 group"
          >
            <span className="text-sm font-semibold whitespace-nowrap">
              Check Eligibility Free
            </span>
          </button>
        </motion.div>
      </main>
    </>
  );
}
