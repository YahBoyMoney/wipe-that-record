import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Orange County Expungement Services - Clear Your Criminal Record in OC | Wipe That Record',
  description: 'Clear your criminal record in Orange County for as low as $97. Expert expungement services in Irvine, Anaheim, Newport Beach. 92% success rate. DIY kits to full attorney service. Prop 47 & felony reduction specialists.',
  keywords: 'Orange County expungement, OC criminal record clearing, expungement attorney Orange County, clear criminal record Orange County, Irvine expungement, Anaheim expungement, Newport Beach record clearing, Prop 47 Orange County, felony reduction OC, misdemeanor expungement Orange County, DIY expungement kit Orange County',
  openGraph: {
    title: 'Orange County Expungement Services - Clear Your Criminal Record',
    description: 'Clear your criminal record in Orange County for as low as $97. Expert expungement services serving all OC cities.',
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
    canonical: '/orange-county'
  }
};

export default function OrangeCountyPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-50 to-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Clear Your Criminal Record in <br />
              <span className="text-orange-600">Orange County, California</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-4 max-w-3xl mx-auto">
              Professional expungement services in Orange County starting at just <strong>$147</strong>. 
              Clear your criminal record in Irvine, Newport Beach, Anaheim, Huntington Beach, and all OC cities.
            </p>
            
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-8 max-w-2xl mx-auto">
              <p className="text-orange-800 font-semibold text-center">
                ✅ 92% Success Rate • ✅ Prop 47 Specialists • ✅ No Court Fees (Thanks to New CA Law)
                <br />✅ DIY to Full Attorney Service • ✅ Felony Reduction Available
              </p>
            </div>
            
            <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto">
              Whether you need our <strong>DIY expungement service</strong>, expert review, or full attorney representation, 
              we help Orange County residents clear misdemeanors, felonies, DUI convictions, and Prop 47 eligible cases. 
              <strong>Get your clean record in 5-7 weeks with our expedited Orange County expungement process.</strong>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link 
                href="/orange-county/get-started"
                className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
              >
                🚀 Start Your OC Expungement - $297
              </Link>
              <Link 
                href="/orange-county/free-consultation"
                className="border-2 border-orange-600 text-orange-600 hover:bg-orange-50 px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
              >
                📞 Free OC Legal Consultation
              </Link>
            </div>
            
            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>California Licensed Attorneys</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>92% Success Rate in OC</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Expedited 5-7 Week Processing</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Orange County Specific Benefits */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Why Orange County Professionals Choose Us</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="text-4xl mb-4">🏢</div>
              <h3 className="text-xl font-bold mb-4">Tech Industry Expertise</h3>
              <p className="text-gray-600">
                Specialized service for Irvine tech workers, UCI grads, and professionals 
                at companies like Broadcom, Blizzard, and Edwards Lifesciences. We understand 
                security clearance and background check requirements.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="text-4xl mb-4">⚖️</div>
              <h3 className="text-xl font-bold mb-4">OC Court System Mastery</h3>
              <p className="text-gray-600">
                Expert knowledge of Orange County Superior Court procedures, local filing 
                requirements, and relationships with court clerks in Santa Ana, Newport Beach, 
                and Westminster courthouses.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-bold mb-4">Premium White-Glove Service</h3>
              <p className="text-gray-600">
                Concierge-level service matching Orange County's affluent lifestyle. 
                Personal case manager, expedited processing, and premium support for 
                busy professionals and executives.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Orange County Expungement Process */}
      <section className="py-16" id="orange-county-expungement-process">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">How Orange County Expungement Works</h2>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-orange-500">
                <h3 className="text-xl font-bold mb-3 text-gray-900">Step 1: Eligibility Check</h3>
                <p className="text-gray-600">
                  We review your Orange County criminal record to determine eligibility for expungement under 
                  PC 1203.4, Prop 47 felony reduction, or other California relief options. Most misdemeanors 
                  and many felonies can be expunged in Orange County.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-orange-500">
                <h3 className="text-xl font-bold mb-3 text-gray-900">Step 2: File at Orange County Superior Court</h3>
                <p className="text-gray-600">
                  We prepare and file your Petition for Dismissal (Form CR-180) at the appropriate Orange County 
                  courthouse - whether that's Santa Ana, Westminster, Newport Beach, or Fullerton courthouse. 
                  <strong> California eliminated court filing fees in 2022</strong>, so you only pay our service fee.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-orange-500">
                <h3 className="text-xl font-bold mb-3 text-gray-900">Step 3: Court Review & Approval</h3>
                <p className="text-gray-600">
                  Orange County judges review your petition. With our 92% success rate and expert preparation, 
                  most cases are approved within 5-7 weeks. We handle any court hearings if required.
                </p>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-orange-50 to-blue-50 p-8 rounded-xl">
              <h3 className="text-2xl font-bold mb-6 text-center text-gray-900">What Can Be Expunged in Orange County?</h3>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <span className="text-green-500 font-bold">✓</span>
                  <div>
                    <strong>Misdemeanors:</strong> DUI, theft under $950, drug possession, domestic violence (if no state prison)
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <span className="text-green-500 font-bold">✓</span>
                  <div>
                    <strong>Wobbler Felonies:</strong> Many felonies can be reduced to misdemeanors under Prop 47, then expunged
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <span className="text-green-500 font-bold">✓</span>
                  <div>
                    <strong>Some Straight Felonies:</strong> If you received probation (not state prison time)
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <span className="text-orange-500 font-bold">?</span>
                  <div>
                    <strong>Serious/Violent Felonies:</strong> Generally not eligible, but we can review your specific case
                  </div>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-white rounded-lg border border-orange-200">
                <p className="text-sm text-gray-600">
                  <strong>Free Eligibility Check:</strong> Not sure if your Orange County conviction qualifies? 
                  We provide free consultations to review your case and explain your options.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* OC Cities Coverage */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-6">Orange County Expungement Services in All Cities</h2>
          <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
            We help clients clear their criminal records throughout Orange County, California. Our expungement attorneys 
            are familiar with all OC Superior Court locations and local procedures.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              'Anaheim', 'Irvine', 'Santa Ana', 'Huntington Beach',
              'Newport Beach', 'Fullerton', 'Costa Mesa', 'Mission Viejo',
              'Westminster', 'Buena Park', 'Tustin', 'Lake Forest',
              'Laguna Beach', 'Fountain Valley', 'Garden Grove', 'Yorba Linda'
            ].map((city) => (
              <div key={city} className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-orange-800">{city} Expungement</h3>
                <p className="text-sm text-orange-600">Record Clearing Services</p>
              </div>
            ))}
          </div>
          
          <div className="mt-12 bg-white p-8 rounded-xl shadow-lg">
            <h3 className="text-2xl font-bold text-center mb-6">Orange County Superior Court Locations We Serve</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-bold text-lg mb-2">Central Justice Center (Santa Ana)</h4>
                <p className="text-gray-600 mb-4">700 Civic Center Drive West, Santa Ana, CA 92701</p>
                
                <h4 className="font-bold text-lg mb-2">West Justice Center (Westminster)</h4>
                <p className="text-gray-600 mb-4">8141 13th Street, Westminster, CA 92683</p>
              </div>
              <div>
                <h4 className="font-bold text-lg mb-2">Harbor Justice Center (Newport Beach)</h4>
                <p className="text-gray-600 mb-4">4601 Jamboree Road, Newport Beach, CA 92660</p>
                
                <h4 className="font-bold text-lg mb-2">North Justice Center (Fullerton)</h4>
                <p className="text-gray-600">1275 N. Berkeley Avenue, Fullerton, CA 92832</p>
              </div>
            </div>
            <p className="text-center text-gray-600 mt-6">
              <strong>We file at the correct courthouse based on where your original case was heard.</strong>
            </p>
          </div>
        </div>
      </section>

      {/* Success Stories - OC Specific */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Orange County Success Stories</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400 mr-3">
                  {'★'.repeat(5)}
                </div>
                <div>
                  <h4 className="font-bold">Sarah K., Software Engineer</h4>
                  <p className="text-sm text-gray-600">Irvine, CA</p>
                </div>
              </div>
              <p className="text-gray-700 italic mb-4">
                "As a tech worker in Irvine, I needed my DUI expunged for a security clearance. 
                Wipe That Record handled everything professionally and got it done in 6 weeks. 
                Now I have my dream job at a defense contractor!"
              </p>
              <div className="text-sm text-gray-500">
                <strong>Case:</strong> DUI (2019) • <strong>Result:</strong> Expunged in 6 weeks • <strong>Outcome:</strong> $120K job at defense contractor
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400 mr-3">
                  {'★'.repeat(5)}
                </div>
                <div>
                  <h4 className="font-bold">Michael R., Finance Professional</h4>
                  <p className="text-sm text-gray-600">Newport Beach, CA</p>
                </div>
              </div>
              <p className="text-gray-700 italic mb-4">
                "I run a financial advisory firm in Newport Beach and needed to clear an old 
                theft charge for licensing. The white-glove service was worth every penny. 
                Discrete, professional, and incredibly fast."
              </p>
              <div className="text-sm text-gray-500">
                <strong>Case:</strong> Theft (2016) • <strong>Result:</strong> Expunged in 5 weeks • <strong>Outcome:</strong> Financial advisor license approved
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing - Premium OC Pricing */}
      <section className="py-16" id="pricing">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Orange County Expungement Service Options</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* DIY Service */}
            <div className="bg-white border-2 border-orange-200 rounded-xl p-8">
              <h3 className="text-2xl font-bold mb-4">DIY Service</h3>
              <div className="text-center mb-6">
                <div className="text-lg text-gray-500 line-through">$147</div>
                <div className="text-4xl font-bold text-orange-600">$97</div>
                <div className="text-sm text-green-600 font-semibold">SAVE $50 - Limited Time</div>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Complete OC forms package
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
                  Email support included
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Prop 47 reduction guide
                </li>
              </ul>
              <Link 
                href="/checkout/diy"
                className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors block text-center"
              >
                Get Started - $97
              </Link>
            </div>

            {/* Expert Review - Most Popular */}
            <div className="bg-white border-2 border-orange-500 rounded-xl p-8 relative transform scale-105">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-orange-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                Most Popular
              </div>
              <h3 className="text-2xl font-bold mb-4">Expert Review</h3>
              <div className="text-4xl font-bold text-orange-600 mb-6">$297</div>
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
                  <strong>Expert form completion</strong>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Case review & filing prep
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Phone consultation included
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Filing assistance available
                </li>
              </ul>
              <Link 
                href="/checkout/review"
                className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors block text-center"
              >
                Get Expert Review
              </Link>
            </div>

            {/* Full Service */}
            <div className="bg-white border-2 border-orange-200 rounded-xl p-8">
              <h3 className="text-2xl font-bold mb-4">Full Service</h3>
              <div className="text-4xl font-bold text-orange-600 mb-6">$1,497</div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <strong>Complete attorney representation</strong>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Attorney files all paperwork
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Court appearance if needed
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
                  100% success guarantee
                </li>
              </ul>
              <Link 
                href="/checkout/full-service"
                className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors block text-center"
              >
                Get Full Service
              </Link>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <div className="bg-gradient-to-r from-orange-50 to-blue-50 p-6 rounded-xl max-w-2xl mx-auto">
              <h3 className="text-xl font-bold mb-3">Not Sure Which Option is Right for You?</h3>
              <p className="text-gray-600 mb-4">
                Take our free eligibility quiz to see which Orange County expungement service fits your case best.
              </p>
              <Link 
                href="/orange-county/eligibility-quiz"
                className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors inline-block"
              >
                Take Free Quiz
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Orange County Expungement FAQ */}
      <section className="py-16" id="orange-county-expungement-faq">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Orange County Expungement FAQ</h2>
          
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
              <h3 className="text-xl font-bold mb-3 text-gray-900">How much does expungement cost in Orange County?</h3>
              <p className="text-gray-600">
                Our Orange County expungement services start at just <strong>$97 for DIY service</strong> (regularly $147), 
                $297 for expert review and form completion, and $1,497 for full attorney representation. 
                <strong>California eliminated court filing fees in 2022</strong>, so you only pay our service fee. 
                This is significantly less than most OC attorneys who charge $1,200-$2,500 for basic service.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
              <h3 className="text-xl font-bold mb-3 text-gray-900">How long does Orange County expungement take?</h3>
              <p className="text-gray-600">
                Most Orange County expungements are completed within <strong>5-7 weeks</strong> with our expedited service. 
                The timeline depends on which OC courthouse handles your case (Santa Ana, Westminster, Newport Beach, or Fullerton) 
                and the court's current caseload. We track your case and provide regular updates.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
              <h3 className="text-xl font-bold mb-3 text-gray-900">Can I expunge a felony in Orange County?</h3>
              <p className="text-gray-600">
                Yes! Many felonies can be expunged in Orange County if you <strong>received probation (not state prison)</strong>. 
                Under <strong>Prop 47</strong>, many non-violent felonies can first be reduced to misdemeanors, then expunged. 
                Examples include theft under $950, drug possession, and check fraud. We handle the entire process.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
              <h3 className="text-xl font-bold mb-3 text-gray-900">What's the difference between expungement and record sealing in California?</h3>
              <p className="text-gray-600">
                California uses <strong>"dismissal" (PC 1203.4)</strong> rather than true expungement. Your case is reopened, 
                the conviction dismissed, and plea changed to "not guilty." The arrest record remains but shows dismissal. 
                <strong>Record sealing (SB 731)</strong> is newer and completely hides the record from most background checks. 
                We can advise which option is best for your Orange County case.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
              <h3 className="text-xl font-bold mb-3 text-gray-900">Do I need a lawyer for Orange County expungement?</h3>
              <p className="text-gray-600">
                While not required, having experienced help significantly improves your chances. Our <strong>92% success rate</strong> 
                comes from knowing OC court procedures and preparing perfect petitions. You can choose our <strong>$97 DIY service</strong> 
                for simple cases, $297 expert review for assistance, or $1,497 full attorney representation for complex situations. 
                We offer free consultations to help you decide.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
              <h3 className="text-xl font-bold mb-3 text-gray-900">Will employers see my record after Orange County expungement?</h3>
              <p className="text-gray-600">
                After expungement, <strong>you can legally answer "no" to most employment questions about convictions</strong>. 
                However, certain employers (schools, healthcare, law enforcement) may still see dismissed cases. We provide 
                a detailed explanation of exactly what shows up post-expungement for Orange County cases.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
              <h3 className="text-xl font-bold mb-3 text-gray-900">Can I expunge a DUI in Orange County?</h3>
              <p className="text-gray-600">
                Yes! <strong>Most DUI convictions can be expunged in Orange County</strong> if you completed probation successfully. 
                This includes first-time DUIs, some second DUIs, and wet reckless convictions. The DMV record remains, 
                but the criminal conviction can be dismissed. We handle hundreds of OC DUI expungements annually.
              </p>
            </div>
          </div>
          
          <div className="mt-12 bg-gradient-to-r from-orange-50 to-blue-50 p-8 rounded-xl text-center">
            <h3 className="text-2xl font-bold mb-4">Still Have Questions About Orange County Expungement?</h3>
            <p className="text-gray-600 mb-6">
              Every case is unique. Get personalized answers about your specific Orange County criminal record.
            </p>
            <Link 
              href="/orange-county/free-consultation"
              className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors inline-block"
            >
              Get Free Consultation
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-orange-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Clear Your Orange County Criminal Record?
          </h2>
          <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
            Join hundreds of Orange County professionals who've successfully cleared their records 
            and advanced their careers with our proven expungement services.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/orange-county/get-started"
              className="bg-white text-orange-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
            >
              🚀 Start My OC Expungement Today
            </Link>
            <Link 
              href="tel:+1-949-555-0123"
              className="border-2 border-white text-white hover:bg-white hover:text-orange-600 px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
            >
              📞 Call (949) 555-0123
            </Link>
          </div>
          
          <div className="mt-8 flex justify-center items-center space-x-8 text-orange-100">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">⭐</span>
              <span>4.9/5 Rating</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl">✅</span>
              <span>92% Success Rate</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🔒</span>
              <span>100% Confidential</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 