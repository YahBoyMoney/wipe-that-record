import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'DIY California Expungement Kit - Clear Your Criminal Record Yourself | Wipe That Record',
  description: 'Clear your California criminal record yourself with our DIY expungement kit. Complete forms, step-by-step instructions, and expert guidance for just $97 (reg. $147). Prop 47, misdemeanor, and felony expungement. Serving Los Angeles, Orange County, Riverside, San Bernardino.',
  keywords: 'DIY expungement California, expungement kit California, clear criminal record California, California expungement forms, DIY record clearing, Prop 47 expungement, misdemeanor expungement California, felony expungement California, expungement petition California, how to expunge record California, California record dismissal, PC 1203.4 petition',
  openGraph: {
    title: 'DIY California Expungement Kit - Clear Your Record for $97',
    description: 'Professional DIY expungement kit with all California forms, instructions, and expert support. Save thousands compared to attorney fees.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Wipe That Record'
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: '/california-expungement-diy'
  }
};

export default function CaliforniaExpungementDIYPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-green-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              DIY California Expungement Kit<br />
              <span className="text-blue-600">Clear Your Criminal Record Yourself</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-4 max-w-3xl mx-auto">
              Complete DIY expungement kit with all California forms, step-by-step instructions, and expert guidance. 
              Clear your criminal record for just <strong>$97</strong> (regularly $147) - save thousands compared to attorney fees.
            </p>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8 max-w-2xl mx-auto">
              <p className="text-green-800 font-semibold text-center">
                ✅ No Court Filing Fees (Thanks to 2022 CA Law) • ✅ All Required Forms Included
                <br />✅ Prop 47 & SB 731 Compliant • ✅ Works for Misdemeanors & Many Felonies
              </p>
            </div>
            
            <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto">
              Our DIY expungement kit includes everything you need to clear your California criminal record: 
              <strong>CR-180 Petition forms, detailed instructions, sample completed forms, and email support</strong>. 
              Perfect for misdemeanors, many felonies, DUI cases, and Prop 47 reductions.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link 
                href="/checkout/diy"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
              >
                🚀 Get DIY Kit Now - $97
              </Link>
              <Link 
                href="#what-included"
                className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
              >
                📋 See What's Included
              </Link>
            </div>
            
            {/* Special Offer Banner */}
            <div className="bg-red-100 border border-red-300 rounded-lg p-3 max-w-lg mx-auto">
              <p className="text-red-800 font-bold text-center">
                🔥 LIMITED TIME: Save $50 off regular $147 price!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What's Included Section */}
      <section className="py-16" id="what-included">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">What's Included in Your DIY California Expungement Kit</h2>
          
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-blue-500">
                <h3 className="text-xl font-bold mb-3 text-gray-900">📋 Complete California Forms Package</h3>
                <ul className="text-gray-600 space-y-2">
                  <li>• <strong>CR-180 Petition for Dismissal</strong> (PC 1203.4)</li>
                  <li>• <strong>CR-181 Order for Dismissal</strong></li>
                  <li>• <strong>Prop 47 Reduction Forms</strong> (if applicable)</li>
                  <li>• <strong>SB 731 Record Sealing Forms</strong> (2023 update)</li>
                  <li>• Local court cover sheets for all CA counties</li>
                </ul>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-blue-500">
                <h3 className="text-xl font-bold mb-3 text-gray-900">📖 Step-by-Step Instructions</h3>
                <ul className="text-gray-600 space-y-2">
                  <li>• How to obtain your criminal record</li>
                  <li>• Eligibility requirements for each type of case</li>
                  <li>• Form completion with examples</li>
                  <li>• Where and how to file in your county</li>
                  <li>• What to expect during the court process</li>
                </ul>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-blue-500">
                <h3 className="text-xl font-bold mb-3 text-gray-900">🎯 Sample Completed Forms</h3>
                <ul className="text-gray-600 space-y-2">
                  <li>• Real examples of properly filled forms</li>
                  <li>• Common case scenarios with solutions</li>
                  <li>• Tips to avoid rejection by the court</li>
                  <li>• Best practices from successful cases</li>
                </ul>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-green-500">
                <h3 className="text-xl font-bold mb-3 text-gray-900">📧 Expert Email Support</h3>
                <ul className="text-gray-600 space-y-2">
                  <li>• Questions answered within 24 hours</li>
                  <li>• Form review before filing (optional)</li>
                  <li>• Guidance on complex situations</li>
                  <li>• Support throughout the entire process</li>
                </ul>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-green-500">
                <h3 className="text-xl font-bold mb-3 text-gray-900">🏛️ County-Specific Information</h3>
                <ul className="text-gray-600 space-y-2">
                  <li>• <strong>Los Angeles County</strong> court locations & procedures</li>
                  <li>• <strong>Orange County</strong> filing requirements</li>
                  <li>• <strong>Riverside & San Bernardino</strong> (Inland Empire) specifics</li>
                  <li>• All 58 California counties covered</li>
                </ul>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-green-500">
                <h3 className="text-xl font-bold mb-3 text-gray-900">⚖️ Legal Updates & Compliance</h3>
                <ul className="text-gray-600 space-y-2">
                  <li>• Updated for 2024 California laws</li>
                  <li>• Includes recent Clean Slate changes</li>
                  <li>• Prop 47 & Prop 64 compliance</li>
                  <li>• SB 731 automatic record sealing info</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="mt-12 bg-gradient-to-r from-blue-50 to-green-50 p-8 rounded-xl text-center">
            <h3 className="text-2xl font-bold mb-4">Everything You Need to Clear Your California Record</h3>
            <p className="text-gray-600 mb-6 text-lg">
              Our DIY kit includes the same forms and procedures attorneys use, but at a fraction of the cost. 
              <strong>Perfect for straightforward cases</strong> where you want to save money but still get expert guidance.
            </p>
            <Link 
              href="/checkout/diy"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors inline-block"
            >
              Get Your DIY Kit - $97 (Save $50)
            </Link>
          </div>
        </div>
      </section>

      {/* Who It's Perfect For */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Is DIY California Expungement Right for You?</h2>
          
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h3 className="text-2xl font-bold mb-6 text-green-600">✅ Perfect For:</h3>
              <ul className="space-y-4 text-gray-700">
                <li className="flex items-start">
                  <span className="text-green-500 mr-3 font-bold">•</span>
                  <span><strong>Misdemeanor convictions</strong> (DUI, theft under $950, drug possession, etc.)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-3 font-bold">•</span>
                  <span><strong>Felonies eligible for Prop 47</strong> reduction to misdemeanors</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-3 font-bold">•</span>
                  <span><strong>Simple cases</strong> where you completed probation successfully</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-3 font-bold">•</span>
                  <span><strong>Budget-conscious individuals</strong> who want to save on attorney fees</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-3 font-bold">•</span>
                  <span><strong>People comfortable with paperwork</strong> and following detailed instructions</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-3 font-bold">•</span>
                  <span><strong>Single convictions</strong> in one California county</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h3 className="text-2xl font-bold mb-6 text-orange-600">⚠️ Consider Professional Help For:</h3>
              <ul className="space-y-4 text-gray-700">
                <li className="flex items-start">
                  <span className="text-orange-500 mr-3 font-bold">•</span>
                  <span><strong>Multiple convictions</strong> across different counties</span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-500 mr-3 font-bold">•</span>
                  <span><strong>Serious or violent felonies</strong> that may not be eligible</span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-500 mr-3 font-bold">•</span>
                  <span><strong>Cases with probation violations</strong> or complex issues</span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-500 mr-3 font-bold">•</span>
                  <span><strong>Federal convictions</strong> (this kit is for California state cases only)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-500 mr-3 font-bold">•</span>
                  <span><strong>Time-sensitive situations</strong> requiring immediate attention</span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-500 mr-3 font-bold">•</span>
                  <span>If you prefer to have <strong>someone else handle everything</strong></span>
                </li>
              </ul>
              
              <div className="mt-6 p-4 bg-orange-50 rounded-lg border border-orange-200">
                <p className="text-sm text-orange-800">
                  <strong>Need more help?</strong> We also offer expert review ($297) and full attorney service ($1,497). 
                  <Link href="#pricing" className="text-orange-600 underline">See all options</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* California Expungement Process */}
      <section className="py-16" id="process">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">How California Expungement Works</h2>
          
          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              <div className="flex items-start space-x-6">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-3">Determine Eligibility</h3>
                  <p className="text-gray-600">
                    Most California misdemeanors and many felonies can be expunged if you completed probation successfully. 
                    Under <strong>Prop 47</strong>, many felonies can first be reduced to misdemeanors, then expunged. 
                    Our kit includes a detailed eligibility checker.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-6">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-3">Obtain Your Criminal Record</h3>
                  <p className="text-gray-600">
                    Get your complete California criminal history from the Department of Justice. 
                    Our kit explains exactly how to request your records and what information you need for the petition.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-6">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-3">Complete the Forms</h3>
                  <p className="text-gray-600">
                    Fill out the <strong>CR-180 Petition for Dismissal</strong> and supporting documents using our 
                    step-by-step instructions and sample forms. We show you exactly how to avoid common mistakes.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-6">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                  4
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-3">File at the Court</h3>
                  <p className="text-gray-600">
                    Submit your petition to the same court where you were originally convicted. 
                    <strong>No filing fees required since 2022!</strong> Our kit includes specific instructions for each major California county.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-6">
                <div className="flex-shrink-0 w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                  5
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-3">Court Review & Approval</h3>
                  <p className="text-gray-600">
                    Most cases are approved within <strong>2-4 months</strong> without a hearing. 
                    If the court has questions, our email support helps you respond correctly. 
                    Once approved, your conviction is dismissed and your record shows the case as dismissed.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-12 bg-blue-50 p-8 rounded-xl text-center">
              <h3 className="text-2xl font-bold mb-4">After Your California Expungement</h3>
              <div className="grid md:grid-cols-3 gap-6 text-left">
                <div>
                  <h4 className="font-bold text-lg mb-2">✅ Employment</h4>
                  <p className="text-gray-600">You can legally answer "no" to most job application questions about convictions</p>
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-2">🏠 Housing</h4>
                  <p className="text-gray-600">Landlords will see the case as dismissed, greatly improving your rental prospects</p>
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-2">🎓 Education</h4>
                  <p className="text-gray-600">Qualify for financial aid and professional licenses that were previously denied</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Options & Pricing */}
      <section className="py-16 bg-gray-50" id="pricing">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-6">Choose Your California Expungement Service</h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            We offer three service levels to fit every budget and comfort level. Start with DIY and upgrade anytime if you need more help.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* DIY Service - Featured */}
            <div className="bg-white border-2 border-blue-500 rounded-xl p-8 relative transform scale-105">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                Most Popular
              </div>
              <h3 className="text-2xl font-bold mb-4">DIY Service</h3>
              <div className="text-center mb-6">
                <div className="text-lg text-gray-500 line-through">$147</div>
                <div className="text-4xl font-bold text-blue-600">$97</div>
                <div className="text-sm text-green-600 font-semibold">SAVE $50 - Limited Time</div>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Complete California forms package
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Step-by-step instructions
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Sample completed forms
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Email support included
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Prop 47 & SB 731 compliant
                </li>
              </ul>
              <Link 
                href="/checkout/diy"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors block text-center"
              >
                Get DIY Kit - $97
              </Link>
            </div>

            {/* Expert Review */}
            <div className="bg-white border-2 border-gray-200 rounded-xl p-8">
              <h3 className="text-2xl font-bold mb-4">Expert Review</h3>
              <div className="text-4xl font-bold text-gray-600 mb-6">$297</div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <strong>Everything in DIY +</strong>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Expert form completion
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Case review & analysis
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Phone consultation
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Filing guidance
                </li>
              </ul>
              <Link 
                href="/checkout/review"
                className="w-full bg-gray-600 hover:bg-gray-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors block text-center"
              >
                Get Expert Review
              </Link>
            </div>

            {/* Full Service */}
            <div className="bg-white border-2 border-gray-200 rounded-xl p-8">
              <h3 className="text-2xl font-bold mb-4">Full Service</h3>
              <div className="text-4xl font-bold text-gray-600 mb-6">$1,497</div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Complete attorney service
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Attorney files everything
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Court appearances handled
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Direct attorney access
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Success guarantee
                </li>
              </ul>
              <Link 
                href="/checkout/full-service"
                className="w-full bg-gray-600 hover:bg-gray-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors block text-center"
              >
                Get Full Service
              </Link>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-4">
              <strong>Not sure which option is right for you?</strong> Start with the DIY kit and upgrade later if needed.
            </p>
            <div className="inline-flex items-center space-x-2 text-sm text-gray-500">
              <span>💳 Secure payment</span>
              <span>•</span>
              <span>📧 Instant download</span>
              <span>•</span>
              <span>🔒 100% confidential</span>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16" id="faq">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">California DIY Expungement FAQ</h2>
          
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
              <h3 className="text-xl font-bold mb-3">How much does it cost to expunge a record in California?</h3>
              <p className="text-gray-600">
                Our DIY expungement kit costs just <strong>$97</strong> (regularly $147), compared to $1,200-$2,500 that most attorneys charge. 
                <strong>California eliminated court filing fees in 2022</strong>, so you only pay our service fee. 
                This makes it affordable for almost anyone to clear their record.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
              <h3 className="text-xl font-bold mb-3">What convictions can be expunged in California?</h3>
              <p className="text-gray-600">
                Most <strong>misdemeanors</strong> and many <strong>felonies</strong> can be expunged if you completed probation successfully. 
                This includes DUI, theft under $950, drug possession, domestic violence (if no state prison), and many others. 
                Under <strong>Prop 47</strong>, many felonies can first be reduced to misdemeanors, then expunged. 
                Our kit includes a detailed eligibility checker.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
              <h3 className="text-xl font-bold mb-3">How long does California expungement take?</h3>
              <p className="text-gray-600">
                Most California expungements take <strong>2-4 months</strong> from filing to approval. 
                The timeline depends on the court's caseload and whether they need additional information. 
                Some courts are faster (Orange County often processes in 5-7 weeks) while others take longer.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
              <h3 className="text-xl font-bold mb-3">Do I need a lawyer for California expungement?</h3>
              <p className="text-gray-600">
                <strong>No, you don't need a lawyer</strong> for straightforward cases. Our DIY kit includes the same forms attorneys use, 
                plus detailed instructions and email support. However, if you have multiple convictions, complex issues, 
                or prefer professional handling, our expert review ($297) or full attorney service ($1,497) options are available.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
              <h3 className="text-xl font-bold mb-3">What's the difference between expungement and record sealing?</h3>
              <p className="text-gray-600">
                California's <strong>"expungement" (PC 1203.4)</strong> reopens your case, dismisses the conviction, and changes your plea to "not guilty." 
                The arrest record remains but shows dismissal. <strong>Record sealing (SB 731)</strong> completely hides the record from most background checks. 
                Many people are eligible for both - our kit explains which option is best for your situation.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
              <h3 className="text-xl font-bold mb-3">What happens after my California record is expunged?</h3>
              <p className="text-gray-600">
                After expungement, <strong>you can legally answer "no" to most employment questions about convictions</strong>. 
                Your record will show the case as dismissed. This greatly improves job prospects, housing applications, 
                and eligibility for professional licenses. However, certain employers (law enforcement, schools) may still see dismissed cases.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
              <h3 className="text-xl font-bold mb-3">Does the DIY kit work for all California counties?</h3>
              <p className="text-gray-600">
                <strong>Yes!</strong> Our kit includes county-specific information for all 58 California counties, 
                with detailed guidance for major counties like Los Angeles, Orange, Riverside, San Bernardino, and others. 
                The forms are standardized statewide, but filing procedures can vary by county - we cover those differences.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Clear Your California Criminal Record?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Get our complete DIY expungement kit and start your journey to a clean record today. 
            <strong>Save $50 off the regular price</strong> - limited time offer!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link 
              href="/checkout/diy"
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
            >
              🚀 Get DIY Kit - $97 (Save $50)
            </Link>
            <Link 
              href="#what-included"
              className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
            >
              📋 See What's Included
            </Link>
          </div>
          
          <div className="flex justify-center items-center space-x-8 text-blue-100">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">⭐</span>
              <span>4.9/5 Rating</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl">📧</span>
              <span>Instant Download</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🔒</span>
              <span>100% Secure</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 