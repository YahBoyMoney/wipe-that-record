'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface LeadCaptureFormProps {
  variant?: 'modal' | 'inline' | 'exit-intent'
  leadMagnet?: string
  onClose?: () => void
  className?: string
}

export function LeadCaptureForm({ 
  variant = 'inline', 
  leadMagnet = 'eligibility-check',
  onClose,
  className = ''
}: LeadCaptureFormProps) {
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [leadScore, setLeadScore] = useState(0)
  const [qualification, setQualification] = useState<'qualified' | 'maybe' | 'disqualified' | null>(null)
  const [formData, setFormData] = useState({
    // Basic Info
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    
    // Address Info (for paperwork)
    street: '',
    city: '',
    state: '',
    zipCode: '',
    
    // Qualification Questions
    hasConviction: '',
    inCalifornia: '',
    convictionType: '',
    convictionYear: '',
    
    // Goals & Impact
    interests: [] as string[],
    urgency: '',
    budget: '',
    previousAttempts: '',
    employmentGoals: '',
    
    // Additional Legal Info
    county: '',
    caseNumber: '',
    employmentImpact: '',
    professionalLicense: '',
    
    // Analytics
    source: '',
    utmCampaign: '',
    utmSource: '',
    utmMedium: ''
  })

  // Capture analytics data
  const [analyticsData, setAnalyticsData] = useState({
    timeOnSite: 0,
    pagesViewed: 1,
    deviceType: 'desktop',
    referrer: ''
  })

  useEffect(() => {
    // Capture analytics data
    const startTime = Date.now()
    const deviceType = /Mobile|Android|iPhone|iPad/.test(navigator.userAgent) ? 'mobile' : 'desktop'
    
    setAnalyticsData(prev => ({
      ...prev,
      deviceType,
      referrer: document.referrer || 'direct',
      pagesViewed: parseInt(sessionStorage.getItem('pagesViewed') || '1')
    }))

    // Track time on site
    const interval = setInterval(() => {
      setAnalyticsData(prev => ({
        ...prev,
        timeOnSite: Date.now() - startTime
      }))
    }, 5000)

    // Capture UTM parameters
    const urlParams = new URLSearchParams(window.location.search)
    setFormData(prev => ({
      ...prev,
      source: urlParams.get('utm_source') || prev.source,
      utmCampaign: urlParams.get('utm_campaign') || '',
      utmSource: urlParams.get('utm_source') || '',
      utmMedium: urlParams.get('utm_medium') || ''
    }))

    return () => clearInterval(interval)
  }, [])

  // Real-time lead scoring and qualification
  useEffect(() => {
    let score = 0
    let qualificationStatus: 'qualified' | 'maybe' | 'disqualified' | null = null

    // Basic qualification
    if (formData.hasConviction === 'yes') score += 25
    if (formData.inCalifornia === 'yes') score += 20
    else if (formData.inCalifornia === 'no') score -= 50

    // Conviction type scoring
    if (formData.convictionType === 'DUI') score += 20
    else if (formData.convictionType === 'misdemeanor') score += 15
    else if (formData.convictionType === 'drug-possession') score += 12

    // Contact completeness
    if (formData.email) score += 5
    if (formData.phone) score += 10

    // Urgency scoring
    if (formData.urgency === 'immediate') score += 20
    else if (formData.urgency === 'within-month') score += 15

    // Budget scoring
    if (formData.budget === 'flexible' || formData.budget === 'over-2000') score += 15
    else if (formData.budget === '1000-2000') score += 10

    // Goals impact
    score += formData.interests.length * 3

    // Determine qualification
    if (formData.hasConviction === 'no' || formData.inCalifornia === 'no') {
      qualificationStatus = 'disqualified'
    } else if (score >= 60) {
      qualificationStatus = 'qualified'
    } else if (score >= 30) {
      qualificationStatus = 'maybe'
    }

    setLeadScore(Math.min(100, Math.max(0, score)))
    setQualification(qualificationStatus)
  }, [formData, step])

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleInterestToggle = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }))
  }

  const validateStep = (stepNumber: number) => {
    switch (stepNumber) {
      case 1:
        return formData.hasConviction && formData.firstName && formData.lastName && formData.email && 
               (formData.hasConviction === 'no' || formData.inCalifornia)
      case 2:
        return formData.convictionType && formData.urgency && formData.street && formData.city && formData.state && formData.zipCode
      case 3:
        return formData.interests.length > 0 // At least one goal selected
      default:
        return true
    }
  }

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1)
    } else {
      setMessage('Please fill in all required fields')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage('')

    try {
      const leadPayload = {
        // Core lead information
        first: formData.firstName,
        last: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        
        // Address information
        street: formData.street,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        
        // Qualification data
        hasConviction: formData.hasConviction,
        inCalifornia: formData.inCalifornia,
        convictionType: formData.convictionType,
        convictionYear: formData.convictionYear,
        county: formData.county,
        caseNumber: formData.caseNumber,
        
        // Impact and goals
        interests: formData.interests.join(', '),
        urgency: formData.urgency,
        budget: formData.budget,
        previousAttempts: formData.previousAttempts,
        employmentImpact: formData.employmentImpact,
        professionalLicense: formData.professionalLicense,
        
        // Scoring and qualification
        leadScore,
        qualification,
        
        // Analytics
        leadMagnet,
        ...analyticsData,
        source: formData.source,
        utmCampaign: formData.utmCampaign,
        utmSource: formData.utmSource,
        utmMedium: formData.utmMedium
      }

      console.log('🚀 Submitting lead with data:', leadPayload)

      const response = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadPayload)
      })

      const result = await response.json()

      if (response.ok) {
        console.log('✅ Lead created:', result)
        
        // Personalized success message based on qualification
        if (qualification === 'qualified') {
          setMessage(`✅ Excellent News! Your case looks very promising (Score: ${leadScore}/100). Check your email for your custom expungement roadmap.`)
        } else if (qualification === 'maybe') {
          setMessage(`✅ Good News! You may qualify for expungement (Score: ${leadScore}/100). Check your email for next steps.`)
        } else {
          setMessage('✅ Assessment complete! Check your email for alternative options and resources.')
        }
        
        // Store enhanced lead data for checkout flow
        sessionStorage.setItem('leadData', JSON.stringify({
          leadId: result.leadId,
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          leadScore: result.leadScore || leadScore,
          leadSegment: result.leadSegment,
          qualification,
          convictionType: formData.convictionType,
          urgency: formData.urgency,
          budget: formData.budget
        }))

        // Enhanced redirect logic based on comprehensive scoring
        setTimeout(() => {
          if (qualification === 'qualified' && leadScore >= 70) {
            // High-value leads go straight to full service
            window.location.href = '/api/checkout/upgrade?type=full'
          } else if (qualification === 'qualified' && leadScore >= 45) {
            // Qualified leads get DIY option first
            window.location.href = '/api/checkout/diy'
          } else if (qualification === 'maybe') {
            // Maybe qualified leads get consultation
            window.location.href = '/thank-you?type=consultation'
          } else {
            // Disqualified leads get resources page
            window.location.href = '/thank-you?type=resources'
          }
        }, 3000)

      } else {
        console.error('❌ Lead creation failed:', result)
        setMessage(`❌ ${result.error || 'Something went wrong. Please try again.'}`)
      }
    } catch (error) {
      console.error('❌ Submission error:', error)
      setMessage('❌ Network error. Please check your connection and try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const getStepTitle = () => {
    switch (step) {
      case 1: return 'Do You Qualify for California Expungement?'
      case 2: return 'Tell Us About Your Conviction'
      case 3: return 'How Will This Transform Your Life?'
      default: return 'Complete Your Assessment'
    }
  }

  const getStepDescription = () => {
    switch (step) {
      case 1: return 'Most Californians qualify - let\'s check your situation'
      case 2: return 'This helps us prepare your specific legal paperwork'
      case 3: return 'Understanding your goals helps us recommend the best solution'
      default: return ''
    }
  }

  const getQualificationMessage = () => {
    if (!qualification) return null
    
    switch (qualification) {
      case 'qualified':
        return (
          <div className="mb-6 p-4 rounded-lg bg-green-50 border-2 border-green-200">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <div className="font-semibold text-green-800 text-lg">Excellent! You Likely Qualify</div>
                <div className="text-green-700">Score: {leadScore}/100 - Strong potential for expungement</div>
              </div>
            </div>
          </div>
        )
      case 'maybe':
        return (
          <div className="mb-6 p-4 rounded-lg bg-yellow-50 border-2 border-yellow-200">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <div className="font-semibold text-yellow-800 text-lg">You May Qualify</div>
                <div className="text-yellow-700">Score: {leadScore}/100 - Let's review your case details</div>
              </div>
            </div>
          </div>
        )
      case 'disqualified':
        return (
          <div className="mb-6 p-4 rounded-lg bg-red-50 border-2 border-red-200">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <div className="font-semibold text-red-800 text-lg">Limited Options Available</div>
                <div className="text-red-700">We can explore alternatives or refer you to specialists</div>
              </div>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className={`bg-white rounded-2xl shadow-2xl p-4 sm:p-8 max-w-md w-full max-h-[90vh] overflow-y-auto ${className}`}>
      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-slate-800">Step {step} of 3</span>
          <span className="text-sm text-slate-700">{Math.round((step / 3) * 100)}% Complete</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-slate-900 mb-2">{getStepTitle()}</h3>
        <p className="text-slate-800">{getStepDescription()}</p>
      </div>

      {/* Social proof - only show on first step */}
      {step === 1 && (
        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
              </svg>
              <span className="text-blue-800 font-semibold">1,847 Californians helped this month</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
              <span className="text-blue-800 font-semibold">98.7% success rate</span>
            </div>
          </div>
        </div>
      )}

      {/* Qualification Status */}
      {qualification && step > 1 && getQualificationMessage()}

      {message && (
        <div className={`mb-6 p-4 rounded-lg text-sm font-medium ${
          message.includes('✅') 
            ? 'bg-green-50 text-green-800 border border-green-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Step 1: Qualification Questions */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <label className="block text-base font-semibold text-slate-900 mb-3">
                Do you have a criminal conviction on your record? *
              </label>
              <div className="space-y-3">
                {[
                  { value: 'yes', label: 'Yes, I have a conviction I want cleared', icon: '✓' },
                  { value: 'arrest-only', label: 'Only an arrest (no conviction)', icon: '⚖️' },
                  { value: 'no', label: 'No criminal record', icon: '✗' }
                ].map((option) => (
                  <label key={option.value} className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    formData.hasConviction === option.value ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'
                  }`}>
                    <input
                      type="radio"
                      name="hasConviction"
                      value={option.value}
                      checked={formData.hasConviction === option.value}
                      onChange={(e) => handleInputChange('hasConviction', e.target.value)}
                      className="sr-only"
                    />
                    <span className="text-2xl mr-3">{option.icon}</span>
                    <span className="font-medium text-slate-900">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {formData.hasConviction && formData.hasConviction !== 'no' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-base font-semibold text-slate-900 mb-3">
                    Was this conviction in California? *
                  </label>
                  <div className="space-y-2">
                    {[
                      { value: 'yes', label: 'Yes, in California', icon: '🏛️' },
                      { value: 'no', label: 'No, in another state', icon: '🗺️' }
                    ].map((option) => (
                      <label key={option.value} className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all ${
                        formData.inCalifornia === option.value ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'
                      }`}>
                        <input
                          type="radio"
                          name="inCalifornia"
                          value={option.value}
                          checked={formData.inCalifornia === option.value}
                          onChange={(e) => handleInputChange('inCalifornia', e.target.value)}
                          className="sr-only"
                        />
                        <span className="text-xl mr-3">{option.icon}</span>
                        <span className="font-medium text-slate-900">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    placeholder="First name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    placeholder="Last name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Phone Number 
                  <span className="text-blue-600 font-normal">(Priority support)</span>
                </label>
                <input
                  type="tel"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="(555) 123-4567"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleNext}
              disabled={!formData.hasConviction || !formData.firstName || !formData.lastName || !formData.email}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-4 rounded-lg text-lg font-semibold transition-colors"
            >
              Continue Assessment →
            </button>
          </motion.div>
        )}

        {/* Step 2: Detailed Case Information */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <label className="block text-base font-semibold text-slate-700 mb-3">
                What type of conviction do you have? *
              </label>
              <select
                required
                className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-lg"
                value={formData.convictionType}
                onChange={(e) => handleInputChange('convictionType', e.target.value)}
              >
                <option value="">Select your conviction type</option>
                <option value="DUI">DUI/DWI (89% success rate)</option>
                <option value="felony">Felony (Requires special handling)</option>
                <option value="misdemeanor">Misdemeanor (Theft, Vandalism, etc.)</option>
                <option value="drug-possession">Drug Possession</option>
                <option value="theft">Theft/Shoplifting</option>
                <option value="domestic-violence">Domestic Violence</option>
                <option value="assault">Assault</option>
                <option value="other">Other/Multiple</option>
                <option value="not-sure">I'm not sure</option>
              </select>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  County of Conviction
                </label>
                <select
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  value={formData.county}
                  onChange={(e) => handleInputChange('county', e.target.value)}
                >
                  <option value="">Select county</option>
                  <option value="Los Angeles">Los Angeles</option>
                  <option value="San Bernardino">San Bernardino</option>
                  <option value="Riverside">Riverside</option>
                  <option value="Orange">Orange</option>
                  <option value="San Diego">San Diego</option>
                  <option value="Sacramento">Sacramento</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Year of Conviction
                </label>
                <select
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  value={formData.convictionYear}
                  onChange={(e) => handleInputChange('convictionYear', e.target.value)}
                >
                  <option value="">Select year</option>
                  {Array.from({ length: 30 }, (_, i) => {
                    const year = new Date().getFullYear() - i
                    return <option key={year} value={year}>{year}</option>
                  })}
                  <option value="before-1994">Before 1994</option>
                  <option value="not-sure">I'm not sure</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-base font-semibold text-slate-700 mb-3">
                How urgent is clearing your record? *
              </label>
              <div className="space-y-2">
                {[
                  { value: 'immediate', label: 'Immediate - Job application pending', icon: '🚨' },
                  { value: 'within-month', label: 'Within a month', icon: '📅' },
                  { value: 'within-3months', label: 'Within 3 months', icon: '⏰' },
                  { value: 'within-year', label: 'Within a year', icon: '📆' },
                  { value: 'just-exploring', label: 'Just exploring options', icon: '🔍' }
                ].map((option) => (
                  <label key={option.value} className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all ${
                    formData.urgency === option.value ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'
                  }`}>
                    <input
                      type="radio"
                      name="urgency"
                      value={option.value}
                      checked={formData.urgency === option.value}
                      onChange={(e) => handleInputChange('urgency', e.target.value)}
                      className="sr-only"
                    />
                    <span className="text-xl mr-3">{option.icon}</span>
                    <span className="font-medium text-slate-700">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Case Number (if known)
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                value={formData.caseNumber}
                onChange={(e) => handleInputChange('caseNumber', e.target.value)}
                placeholder="e.g., 21CR12345"
              />
              <p className="text-xs text-slate-500 mt-1">This helps us locate your records faster</p>
            </div>

            {/* Address Information - Required for Legal Paperwork */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                <span>📋</span>
                Address Information (Required for Legal Paperwork)
              </h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    value={formData.street}
                    onChange={(e) => handleInputChange('street', e.target.value)}
                    placeholder="123 Main Street"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      placeholder="Los Angeles"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      State *
                    </label>
                    <select
                      required
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      value={formData.state}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                    >
                      <option value="">Select state</option>
                      <option value="CA">California</option>
                      <option value="Other">Other State</option>
                    </select>
                  </div>
                </div>
                
                <div className="w-1/2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    ZIP Code *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    value={formData.zipCode}
                    onChange={(e) => handleInputChange('zipCode', e.target.value)}
                    placeholder="90210"
                  />
                </div>
                
                <p className="text-xs text-blue-700">
                  This address will be used for legal paperwork and court filings.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 border-2 border-slate-300 text-slate-700 py-3 rounded-lg font-semibold hover:bg-slate-50 transition-colors"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={handleNext}
                disabled={!validateStep(2)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 rounded-lg font-semibold transition-colors"
              >
                Continue →
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 3: Impact Assessment & Goals */}
        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <label className="block text-base font-semibold text-slate-700 mb-3">
                How has your record affected your life? (Select all that apply) *
              </label>
              <div className="space-y-3">
                {[
                  { value: 'employment', label: 'Job applications rejected', icon: '💼' },
                  { value: 'housing', label: 'Housing/rental denials', icon: '🏠' },
                  { value: 'professional', label: 'Professional licensing blocked', icon: '🏅' },
                  { value: 'education', label: 'Educational opportunities limited', icon: '🎓' },
                  { value: 'volunteer', label: 'Volunteer work restrictions', icon: '🤝' },
                  { value: 'peace-of-mind', label: 'Personal stress and anxiety', icon: '😰' },
                  { value: 'relationships', label: 'Family/relationship impacts', icon: '❤️' },
                  { value: 'travel', label: 'Travel/visa restrictions', icon: '✈️' }
                ].map((impact) => (
                  <label key={impact.value} className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all ${
                    formData.interests.includes(impact.value) ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'
                  }`}>
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={formData.interests.includes(impact.value)}
                      onChange={() => handleInterestToggle(impact.value)}
                    />
                    <span className="text-2xl mr-3">{impact.icon}</span>
                    <span className="font-medium text-slate-700">{impact.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                What's your employment situation?
              </label>
              <select
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                value={formData.employmentImpact}
                onChange={(e) => handleInputChange('employmentImpact', e.target.value)}
              >
                <option value="">Select current situation</option>
                <option value="unemployed-record">Unemployed due to background checks</option>
                <option value="underemployed">Stuck in low-paying jobs</option>
                <option value="employed-better">Employed but want better opportunities</option>
                <option value="self-employed">Self-employed</option>
                <option value="student">Student</option>
                <option value="retired">Retired</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Do you need professional licensing?
              </label>
              <select
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                value={formData.professionalLicense}
                onChange={(e) => handleInputChange('professionalLicense', e.target.value)}
              >
                <option value="">Select option</option>
                <option value="need">Yes, I need professional licensing</option>
                <option value="yes">Yes, I already have a license to protect</option>
                <option value="no">No professional license needed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Investment Range for Your Fresh Start
              </label>
              <select
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                value={formData.budget}
                onChange={(e) => handleInputChange('budget', e.target.value)}
              >
                <option value="">Select investment range</option>
                <option value="100-500">$100 - $500 (DIY with guidance)</option>
                <option value="500-1000">$500 - $1,000 (Partial assistance)</option>
                <option value="1000-2000">$1,000 - $2,000 (Full service)</option>
                <option value="over-2000">Over $2,000 (Premium service)</option>
                <option value="flexible">Whatever it takes</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Previous expungement attempts?
              </label>
              <select
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                value={formData.previousAttempts}
                onChange={(e) => handleInputChange('previousAttempts', e.target.value)}
              >
                <option value="">Select your experience</option>
                <option value="never">Never tried - this is my first time</option>
                <option value="tried-myself">Tried DIY but got overwhelmed</option>
                <option value="hired-lawyer">Hired a lawyer but nothing happened</option>
                <option value="partial-success">Had partial success elsewhere</option>
              </select>
            </div>

            {/* Urgency reminder for high-scoring leads */}
            {leadScore >= 50 && (
              <div className="bg-orange-50 p-4 rounded-lg border-2 border-orange-200">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">⚡</span>
                  <span className="font-semibold text-orange-800">Act Fast - Limited Time Offer</span>
                </div>
                <p className="text-orange-700 text-sm">
                  Based on your case, you're eligible for our fast-track expungement service. 
                  Complete this assessment to lock in priority processing.
                </p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="flex-1 border-2 border-slate-300 text-slate-700 py-3 rounded-lg font-semibold hover:bg-slate-50 transition-colors"
              >
                ← Back
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !validateStep(3)}
                className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-4 rounded-lg text-lg font-semibold transition-colors"
              >
                {isSubmitting ? 'Processing...' : qualification === 'qualified' ? 
                  '🚀 Get My Custom Expungement Plan' : 
                  '📋 Complete My Assessment'
                }
              </button>
            </div>
          </motion.div>
        )}
      </form>

      {/* Trust indicators */}
      <div className="mt-6 pt-6 border-t border-slate-200">
        <div className="flex items-center justify-center gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            Secure & Confidential
          </div>
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            No Spam
          </div>
        </div>
      </div>

      {/* Close button for modal variant */}
      {variant === 'modal' && onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  )
} 