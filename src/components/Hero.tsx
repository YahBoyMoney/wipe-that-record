'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { LeadCaptureForm } from './LeadCaptureForm'

interface HeroProps {
  variant?: 'a' | 'b'
}

export function Hero({ variant = 'a' }: HeroProps) {
  const [showModal, setShowModal] = useState(false)
  const [typewriterText, setTypewriterText] = useState('')
  
  const headlines = {
    a: "Clear Your California Record—In Days, Not Months",
    b: "Get Your California Record Expunged Fast & Affordable"
  }
  
  const typewriterPhrases = ["In Days... Not Months.", "With Zero Hassle.", "100% Confidential."]
  
  useEffect(() => {
    let phraseIndex = 0
    let charIndex = 0
    let isDeleting = false
    
    const typeWriter = () => {
      const currentPhrase = typewriterPhrases[phraseIndex]
      
      if (isDeleting) {
        setTypewriterText(currentPhrase.substring(0, charIndex - 1))
        charIndex--
      } else {
        setTypewriterText(currentPhrase.substring(0, charIndex + 1))
        charIndex++
      }
      
      if (!isDeleting && charIndex === currentPhrase.length) {
        setTimeout(() => { isDeleting = true }, 2000)
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false
        phraseIndex = (phraseIndex + 1) % typewriterPhrases.length
      }
      
      const speed = isDeleting ? 50 : 100
      setTimeout(typeWriter, speed)
    }
    
    typeWriter()
  }, [])

  const handleDIYClick = () => {
    window.location.href = '/api/checkout/diy'
  }

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Parallax background layers */}
      <div className="absolute inset-0">
        <motion.div 
          className="absolute inset-0 opacity-10"
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#grid)" />
          </svg>
        </motion.div>
        
        <motion.div 
          className="absolute top-20 right-20 w-32 h-32 bg-blue-200 dark:bg-blue-800 rounded-full opacity-20"
          animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        />
        
        <motion.div 
          className="absolute bottom-20 left-20 w-24 h-24 bg-amber-200 dark:bg-amber-800 rounded-full opacity-20"
          animate={{ scale: [1.2, 1, 1.2], rotate: [360, 180, 0] }}
          transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left column - Hero content */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 px-4 py-2 rounded-full text-sm font-semibold"
              >
                <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></span>
                California Licensed Attorney
              </motion.div>
              
              <h1 className="text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white leading-tight">
                {headlines[variant]}
              </h1>
              
              <div className="text-2xl text-blue-600 dark:text-blue-400 font-semibold min-h-[2rem]">
                {typewriterText}
                <span className="animate-pulse">|</span>
              </div>
              
              <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-lg">
                Stop letting past mistakes define your future. Our proven process helps Californians 
                clear misdemeanor and DUI records for better jobs, housing, and opportunities.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleDIYClick}
                className="group bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl"
                autoFocus
              >
                <span className="flex items-center justify-center gap-2">
                  Start DIY for $50
                  <motion.svg 
                    className="w-5 h-5" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </motion.svg>
                </span>
              </motion.button>
              
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowModal(true)}
                className="group border-2 border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300"
              >
                Free Eligibility Check »
              </motion.button>
            </div>
            
            {/* Trust indicators */}
            <div className="flex flex-wrap items-center gap-6 pt-8">
              <div className="flex items-center gap-2 text-sm text-gray-800 dark:text-gray-200 font-medium">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Money-Back Guarantee
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-800 dark:text-gray-200 font-medium">
                <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                100% Confidential
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-800 dark:text-gray-200 font-medium">
                <svg className="w-5 h-5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                4.9/5 Rating
              </div>
            </div>
          </motion.div>

          {/* Right column - Hero image */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative h-96 lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&h=600&fit=crop&crop=center"
                alt="California courthouse representing professional legal services"
                fill
                className="object-cover"
                priority
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
              />
              
              {/* Floating elements */}
              <motion.div 
                className="absolute top-4 right-4 bg-white dark:bg-slate-800 p-3 rounded-lg shadow-lg"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Case Approved</span>
                </div>
              </motion.div>
              
              <motion.div 
                className="absolute bottom-4 left-4 bg-blue-600 text-white p-3 rounded-lg shadow-lg"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 4, repeat: Infinity, delay: 1 }}
              >
                <div className="text-sm font-semibold">Record Cleared!</div>
                <div className="text-xs opacity-90">Processing time: 18 days</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Enhanced eligibility modal with lead capture form */}
      {showModal && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        >
          <LeadCaptureForm 
            variant="modal"
            leadMagnet="eligibility-check"
            onClose={() => setShowModal(false)}
            className="relative"
          />
        </motion.div>
      )}
    </section>
  )
} 