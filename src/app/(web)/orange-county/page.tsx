import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Orange County Expungement Services - Clear Your Criminal Record in OC | Wipe That Record',
  description: 'California record-cleaning help for Orange County, with a DIY kit from $97. Serving Irvine, Anaheim, and Newport Beach. DIY kits to full attorney service. Prop 47 and felony reduction where eligible. Court timelines vary by county.',
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
              California record-cleaning help for Orange County, with a DIY kit starting at <strong>$97</strong>.
              Serving Irvine, Newport Beach, Anaheim, Huntington Beach, and all OC cities.
            </p>

            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-8 max-w-2xl mx-auto">
              <p className="text-orange-800 font-semibold text-center">
                Prop 47 reductions • No court filing fees (2022 CA law) • DIY to full attorney service • Felony reduction where eligible
              </p>
            </div>

            <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto">
              Whether you choose our <strong>DIY kit</strong>, expert review, or full attorney service,
              we help Orange County residents pursue relief for misdemeanors, eligible felonies, DUI
              convictions, and Prop 47 cases. Court timelines vary by county and case type.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link
                href="/checkout/diy"
                className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
              >
                Get DIY Kit - $97
              </Link>
              <Link
                href="/eligibility"
                className="border-2 border-orange-600 text-orange-600 hover:bg-orange-50 px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
              >
                Check Eligibility Free
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>California-focused process</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>30-day refund policy</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Upgrade to expert or attorney help anytime</span>
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
              <h3 className="text-xl font-bold mb-4">Built for working professionals</h3>
              <p className="text-gray-600">
                Many Irvine and OC professionals pursue record relief to help with background checks
                and licensing. Our materials explain what relief does and does not change.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h3 className="text-xl font-bold mb-4">Orange County court guidance</h3>
              <p className="text-gray-600">
                We provide information on Orange County Superior Court procedures and local filing
                requirements for the Santa Ana, Westminster, Newport Beach, and Fullerton courthouses.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h3 className="text-xl font-bold mb-4">Choose your level of help</h3>
              <p className="text-gray-600">
                Start with the DIY kit and upgrade to expert review or full attorney service at any time
                if your case is more complex or you want someone to manage it for you.
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
                <h3 className="text-xl font-bold mb-3 text-gray-900">Step 3: Court Review</h3>
                <p className="text-gray-600">
                  Orange County judges review your petition on the court's own schedule, which varies by
                  case type and caseload. With full service, we handle any court hearings if required.
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
                  Our free eligibility check reviews your case and explains your options.
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

      {/* Common Orange County cases */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Common Orange County Cases We Help With</h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h4 className="font-bold mb-3">DUI and misdemeanor relief</h4>
              <p className="text-gray-700">
                Many people seek a dismissal for an old DUI or misdemeanor to help with background checks
                and licensing. Eligibility generally depends on completing probation and the specifics of
                your case.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h4 className="font-bold mb-3">Felony reduction under Prop 47</h4>
              <p className="text-gray-700">
                Certain felonies may be reduced to misdemeanors under Prop 47, and may then be eligible for
                dismissal. We help you understand whether your case qualifies before you pay.
              </p>
            </div>
          </div>

          <p className="mt-8 text-center text-sm text-gray-500 max-w-3xl mx-auto">
            This page is general information, not legal advice. True expungement does not exist in
            California; eligible cases may qualify for dismissal, sealing, felony reduction, or other
            relief. Outcomes and timelines are not guaranteed and vary by case and court.
          </p>
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
                <div className="text-lg text-gray-700 line-through font-medium">$147</div>
                <div className="text-4xl font-bold text-orange-600">$97</div>
                <div className="text-sm text-green-600 font-semibold">Save $50 from $147</div>
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
                  30-day refund policy
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
                Take our free eligibility check to see which Orange County option fits your case best.
              </p>
              <Link
                href="/eligibility"
                className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors inline-block"
              >
                Check Eligibility Free
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
              <h3 className="text-xl font-bold mb-3 text-gray-900">How long does the court take in Orange County?</h3>
              <p className="text-gray-600">
                You can prepare and file your paperwork quickly, but the court reviews it on its own
                schedule. Timelines depend on which OC courthouse handles your case (Santa Ana,
                Westminster, Newport Beach, or Fullerton) and the court's current caseload. We cannot
                guarantee a specific approval date.
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
                Many straightforward Orange County cases can be handled with the DIY kit. Experienced help
                can be valuable for complex situations. You can choose our <strong>$97 DIY service</strong>
                for simple cases, $297 expert review for assistance, or $1,497 full attorney service for
                complex situations. Start with a free eligibility check to help you decide.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
              <h3 className="text-xl font-bold mb-3 text-gray-900">Will employers see my record after relief?</h3>
              <p className="text-gray-600">
                A dismissal can limit what many private employers see on background checks, but it does not
                erase the record. Certain employers and agencies (schools, healthcare, law enforcement, and
                some licensing bodies) may still access dismissed cases. We explain what a dismissal does
                and does not change.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
              <h3 className="text-xl font-bold mb-3 text-gray-900">Can I get DUI relief in Orange County?</h3>
              <p className="text-gray-600">
                Many DUI convictions may be eligible for dismissal in Orange County if you completed
                probation successfully, including some first and second DUIs and wet reckless convictions.
                The DMV record remains, but the criminal conviction may be dismissed where eligible.
                Eligibility depends on your specific case.
              </p>
            </div>
          </div>
          
          <div className="mt-12 bg-gradient-to-r from-orange-50 to-blue-50 p-8 rounded-xl text-center">
            <h3 className="text-2xl font-bold mb-4">Still Have Questions About Orange County Expungement?</h3>
            <p className="text-gray-600 mb-6">
              Every case is unique. Start with a free eligibility check to see which options may apply to
              your Orange County case.
            </p>
            <Link
              href="/eligibility"
              className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors inline-block"
            >
              Check Eligibility Free
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
            Start with a free eligibility check, then choose the Orange County option that fits your case.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/checkout/diy"
              className="bg-white text-orange-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
            >
              Get DIY Kit - $97
            </Link>
            <Link
              href="/eligibility"
              className="border-2 border-white text-white hover:bg-white hover:text-orange-600 px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
            >
              Check Eligibility Free
            </Link>
          </div>

          <div className="mt-8 flex justify-center items-center space-x-8 text-orange-100">
            <div className="flex items-center space-x-2">
              <span>Instant download</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>30-day refund policy</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>Your information stays private</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 