'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface SoCalLeadFormProps {
  variant?: 'modal' | 'page' | 'inline';
  source?: string;
  campaign?: string;
  county?: string;
}

export default function SoCalLeadForm({ 
  variant = 'page', 
  source, 
  campaign,
  county: prefilledCounty 
}: SoCalLeadFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  
  const [formData, setFormData] = useState({
    // Basic info
    first: '',
    last: '',
    email: '',
    phone: '',
    
    // Geographic data
    county: prefilledCounty || '',
    city: '',
    zipCode: '',
    
    // Legal specifics
    convictionType: '',
    convictionYear: '',
    convictionCounty: '',
    hasMultipleConvictions: false,
    hasFailedAttempts: false,
    
    // Economic factors
    urgency: '',
    employmentStatus: '',
    industryOfInterest: '',
    annualIncome: '',
    
    // SoCal specific factors
    hasSecurityClearance: false,
    needsHousingAssistance: false,
    inTechIndustry: false,
    inEntertainmentIndustry: false,
    isStudentUCUC: false,
    
    // Marketing attribution
    utmSource: source || '',
    utmCampaign: campaign || '',
    referralSource: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/lead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        // Store results for thank you page
        localStorage.setItem('leadResults', JSON.stringify({
          leadScore: result.leadScore,
          leadQuality: result.leadQuality,
          estimatedLifetimeValue: result.estimatedLifetimeValue,
          recommendedPricing: result.recommendedPricing,
          county: formData.county,
          firstName: formData.first
        }));

        // Redirect based on lead quality and county
        if (result.leadQuality === 'hot' && result.recommendedPricing === 'premium') {
          router.push(`/${formData.county}/checkout/${result.recommendedPricing}?lead=${result.leadId}`);
        } else {
          router.push(`/thank-you?county=${formData.county}&quality=${result.leadQuality}`);
        }
      } else {
        alert('Error submitting form. Please try again.');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      alert('Error submitting form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const getStepProgress = () => (currentStep / 4) * 100;

  return (
    <div className={`max-w-2xl mx-auto ${variant === 'modal' ? 'p-4' : 'p-8'}`}>
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-600">Step {currentStep} of 4</span>
          <span className="text-sm text-gray-800 font-medium">{Math.round(getStepProgress())}% Complete</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
            style={{ width: `${getStepProgress()}%` }}
          ></div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Step 1: Basic Information */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Let's Get Started</h2>
              <p className="text-gray-600">First, tell us a bit about yourself</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name *
                </label>
                <input
                  type="text"
                  name="first"
                  value={formData.first}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your first name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name *
                </label>
                <input
                  type="text"
                  name="last"
                  value={formData.last}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your last name"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="your.email@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="(555) 123-4567"
              />
            </div>

            <div className="pt-4">
              <button
                type="button"
                onClick={nextStep}
                disabled={!formData.first || !formData.last || !formData.email}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white py-3 px-6 rounded-lg font-semibold transition-colors"
              >
                Continue to Location →
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Location & Demographics */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Location</h2>
              <p className="text-gray-600">This helps us provide county-specific guidance</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                County *
              </label>
              <select
                name="county"
                value={formData.county}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select your county</option>
                <option value="los-angeles">Los Angeles County</option>
                <option value="orange">Orange County</option>
                <option value="riverside">Riverside County</option>
                <option value="san-bernardino">San Bernardino County</option>
                <option value="ventura">Ventura County</option>
                <option value="other-california">Other California County</option>
                <option value="outside-california">Outside California</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your city"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Zip Code
                </label>
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="90210"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Employment Status
              </label>
              <select
                name="employmentStatus"
                value={formData.employmentStatus}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select employment status</option>
                <option value="employed">Currently Employed</option>
                <option value="seeking-employment">Seeking Employment</option>
                <option value="self-employed">Self-Employed</option>
                <option value="student">Student</option>
                <option value="unemployed">Currently Unemployed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Industry of Interest
              </label>
              <select
                name="industryOfInterest"
                value={formData.industryOfInterest}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select industry</option>
                <option value="tech">Technology</option>
                <option value="entertainment">Entertainment/Media</option>
                <option value="healthcare">Healthcare</option>
                <option value="finance">Finance/Banking</option>
                <option value="education">Education</option>
                <option value="government">Government</option>
                <option value="hospitality">Hospitality/Tourism</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={prevStep}
                className="flex-1 border border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={nextStep}
                disabled={!formData.county}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white py-3 px-6 rounded-lg font-semibold transition-colors"
              >
                Continue to Legal Details →
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Legal Information */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Legal Information</h2>
              <p className="text-gray-600">Help us understand your specific situation</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type of Conviction *
              </label>
              <select
                name="convictionType"
                value={formData.convictionType}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select conviction type</option>
                <option value="dui">DUI/DWI</option>
                <option value="drug-possession">Drug Possession</option>
                <option value="theft">Theft/Burglary</option>
                <option value="misdemeanor">Other Misdemeanor</option>
                <option value="felony">Felony</option>
                <option value="domestic-violence">Domestic Violence</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Year of Conviction
                </label>
                <input
                  type="text"
                  name="convictionYear"
                  value={formData.convictionYear}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="2020"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  County of Conviction
                </label>
                <input
                  type="text"
                  name="convictionCounty"
                  value={formData.convictionCounty}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Los Angeles"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                How urgent is this for you? *
              </label>
              <select
                name="urgency"
                value={formData.urgency}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select urgency</option>
                <option value="immediate">Immediate (need it ASAP)</option>
                <option value="within-month">Within a month</option>
                <option value="within-3-months">Within 3 months</option>
                <option value="within-6-months">Within 6 months</option>
                <option value="just-researching">Just researching options</option>
              </select>
            </div>

            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="hasMultipleConvictions"
                  checked={formData.hasMultipleConvictions}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-700">
                  I have multiple convictions
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="hasFailedAttempts"
                  checked={formData.hasFailedAttempts}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-700">
                  I've tried to clear my record before and it didn't work
                </label>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={prevStep}
                className="flex-1 border border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={nextStep}
                disabled={!formData.convictionType || !formData.urgency}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white py-3 px-6 rounded-lg font-semibold transition-colors"
              >
                Continue to Final Details →
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Additional Information */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Almost Done!</h2>
              <p className="text-gray-600">These final details help us provide the best service</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Annual Income (Optional)
              </label>
              <select
                name="annualIncome"
                value={formData.annualIncome}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Prefer not to say</option>
                <option value="under-30k">Under $30,000</option>
                <option value="30k-50k">$30,000 - $50,000</option>
                <option value="50k-75k">$50,000 - $75,000</option>
                <option value="75k-100k">$75,000 - $100,000</option>
                <option value="100k-150k">$100,000 - $150,000</option>
                <option value="150k+">Over $150,000</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                How did you hear about us?
              </label>
              <input
                type="text"
                name="referralSource"
                value={formData.referralSource}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Google search, friend referral, social media, etc."
              />
            </div>

            <div className="space-y-4">
              <p className="text-sm font-medium text-gray-700">Additional factors (check all that apply):</p>
              
              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="inTechIndustry"
                    checked={formData.inTechIndustry}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-700">
                    I work in the tech industry
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="inEntertainmentIndustry"
                    checked={formData.inEntertainmentIndustry}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-700">
                    I work in entertainment/media industry
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="hasSecurityClearance"
                    checked={formData.hasSecurityClearance}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-700">
                    I need/have a security clearance
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isStudentUCUC"
                    checked={formData.isStudentUCUC}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-700">
                    I'm a UC/USC/UCLA student or alumni
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="needsHousingAssistance"
                    checked={formData.needsHousingAssistance}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-700">
                    I need this for housing/rental applications
                  </label>
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={prevStep}
                className="flex-1 border border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                ← Back
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white py-3 px-6 rounded-lg font-semibold transition-colors"
              >
                {isSubmitting ? 'Submitting...' : 'Get My Free Analysis →'}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
} 