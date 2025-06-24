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
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    convictionType: '',
    convictionYear: '',
    interests: [] as string[],
    urgency: '',
    budget: '',
    previousAttempts: '',
    employmentGoals: '',
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
        return formData.fullName && formData.email
      case 2:
        return formData.convictionType
      case 3:
        return true // Optional step
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
        ...formData,
        leadMagnet,
        ...analyticsData,
        interests: formData.interests
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
        setMessage('✅ Success! Check your email for next steps.')
        
        // Store lead data for checkout flow
        sessionStorage.setItem('leadData', JSON.stringify({
          leadId: result.leadId,
          email: formData.email,
          fullName: formData.fullName,
          leadScore: result.leadScore,
          leadSegment: result.leadSegment
        }))

        // Redirect based on lead score and magnet type
        setTimeout(() => {
          if (leadMagnet === 'free-consultation' || result.leadScore >= 50) {
            window.location.href = '/api/checkout/upgrade?type=full'
          } else if (result.leadSegment === 'warm') {
            window.location.href = '/api/checkout/diy'
          } else {
            // Show thank you message or redirect to nurture page
            if (onClose) onClose()
          }
        }, 2000)

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
      case 1: return 'Get Your Free Assessment'
      case 2: return 'Tell Us About Your Case'
      case 3: return 'Help Us Personalize Your Experience'
      default: return 'Complete Your Assessment'
    }
  }

  const getStepDescription = () => {
    switch (step) {
      case 1: return 'Enter your details to get started'
      case 2: return 'This helps us provide accurate guidance'
      case 3: return 'Optional: Help us serve you better'
      default: return ''
    }
  }

  return (
    <div className={`bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full ${className}`}>
      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-slate-600">Step {step} of 3</span>
          <span className="text-sm text-slate-500">{Math.round((step / 3) * 100)}% Complete</span>
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
        <p className="text-slate-600">{getStepDescription()}</p>
      </div>

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
        {/* Step 1: Basic Information */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                placeholder="Enter your full name"
              />
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
                Phone Number (Optional)
              </label>
              <input
                type="tel"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="(555) 123-4567"
              />
              <p className="text-xs text-slate-500 mt-1">For faster service and priority support</p>
            </div>

            <button
              type="button"
              onClick={handleNext}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors"
            >
              Continue →
            </button>
          </motion.div>
        )}

        {/* Step 2: Case Details */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Type of Conviction *
              </label>
              <select
                required
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                value={formData.convictionType}
                onChange={(e) => handleInputChange('convictionType', e.target.value)}
              >
                <option value="">Select conviction type</option>
                <option value="DUI">DUI/DWI</option>
                <option value="misdemeanor">Misdemeanor</option>
                <option value="drug-possession">Drug Possession</option>
                <option value="theft">Theft/Shoplifting</option>
                <option value="domestic-violence">Domestic Violence</option>
                <option value="assault">Assault</option>
                <option value="other">Other</option>
                <option value="not-sure">Not Sure</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Year of Conviction (Optional)
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
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                How urgent is this for you?
              </label>
              <select
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                value={formData.urgency}
                onChange={(e) => handleInputChange('urgency', e.target.value)}
              >
                <option value="">Select urgency</option>
                <option value="immediate">Immediate (job application pending)</option>
                <option value="within-month">Within a month</option>
                <option value="within-3months">Within 3 months</option>
                <option value="within-year">Within a year</option>
                <option value="just-exploring">Just exploring options</option>
              </select>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 border border-slate-300 text-slate-700 py-3 rounded-lg font-semibold hover:bg-slate-50 transition-colors"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors"
              >
                Continue →
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 3: Personalization */}
        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">
                What are your main goals? (Select all that apply)
              </label>
              <div className="space-y-2">
                {[
                  'Better job opportunities',
                  'Housing/rental applications',
                  'Professional licensing',
                  'Peace of mind',
                  'Education/student loans',
                  'Travel/visa applications'
                ].map((interest) => (
                  <label key={interest} className="flex items-center">
                    <input
                      type="checkbox"
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      checked={formData.interests.includes(interest)}
                      onChange={() => handleInterestToggle(interest)}
                    />
                    <span className="ml-2 text-sm text-slate-700">{interest}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Budget Range (Optional)
              </label>
              <select
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                value={formData.budget}
                onChange={(e) => handleInputChange('budget', e.target.value)}
              >
                <option value="">Select budget range</option>
                <option value="under-100">Under $100</option>
                <option value="100-500">$100 - $500</option>
                <option value="500-1000">$500 - $1,000</option>
                <option value="1000-2000">$1,000 - $2,000</option>
                <option value="over-2000">Over $2,000</option>
                <option value="flexible">Flexible</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Have you tried to clear your record before?
              </label>
              <select
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                value={formData.previousAttempts}
                onChange={(e) => handleInputChange('previousAttempts', e.target.value)}
              >
                <option value="">Select option</option>
                <option value="never">Never tried</option>
                <option value="tried-myself">Tried myself but failed</option>
                <option value="hired-lawyer">Hired a lawyer before</option>
                <option value="partial-success">Had partial success</option>
              </select>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="flex-1 border border-slate-300 text-slate-700 py-3 rounded-lg font-semibold hover:bg-slate-50 transition-colors"
              >
                ← Back
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Processing...' : 'Get My Assessment'}
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