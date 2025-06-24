'use client'

import { motion } from 'framer-motion'

interface PlanCardProps {
  title: string
  price: string
  originalPrice?: string
  description: string
  features: string[]
  cta: string
  ctaVariant: 'primary' | 'secondary'
  popular: boolean
  savings?: string
  badge?: string
  href: string
}

export function PlanCard({ 
  title, 
  price, 
  originalPrice, 
  description, 
  features, 
  cta, 
  ctaVariant, 
  popular, 
  savings,
  badge,
  href
}: PlanCardProps) {
  const buttonClasses = ctaVariant === 'primary' 
    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl'
    : 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20'

  const handleClick = () => {
    window.location.href = href
  }

  return (
    <motion.div 
      className={`relative p-8 rounded-2xl border-2 transition-all duration-300 hover:scale-105 ${
        popular 
          ? 'border-amber-400 bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 shadow-xl' 
          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-blue-300 dark:hover:border-blue-600 shadow-lg hover:shadow-xl'
      }`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
    >
      {/* Popular badge */}
      {popular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <span className="bg-gradient-to-r from-amber-400 to-amber-500 text-slate-900 px-6 py-2 rounded-full text-sm font-bold shadow-lg">
            {badge || 'Most Popular'}
          </span>
        </div>
      )}
      
      {/* Savings badge */}
      {savings && (
        <div className="absolute -top-2 -right-2">
          <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
            {savings}
          </span>
        </div>
      )}
      
      <div className="text-center space-y-6">
        <div>
          <h3 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">{title}</h3>
          <p className="text-slate-600 dark:text-slate-300">{description}</p>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-center gap-2">
            <span className="text-5xl font-bold text-blue-600">{price}</span>
            {originalPrice && (
              <span className="text-xl text-slate-400 line-through">{originalPrice}</span>
            )}
          </div>
          {ctaVariant === 'secondary' && (
            <p className="text-sm text-slate-500 dark:text-slate-400">Free consultation included</p>
          )}
        </div>
        
        <ul className="space-y-3 text-left">
          {features.map((feature, index) => (
            <motion.li 
              key={index} 
              className="flex items-start gap-3"
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-slate-700 dark:text-slate-300">{feature}</span>
            </motion.li>
          ))}
        </ul>
        
        <motion.button 
          onClick={handleClick}
          className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 ${buttonClasses}`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {cta}
        </motion.button>
        
        {ctaVariant === 'primary' && (
          <p className="text-xs text-slate-500 dark:text-slate-400">
            30-day money-back guarantee
          </p>
        )}
      </div>
    </motion.div>
  )
} 