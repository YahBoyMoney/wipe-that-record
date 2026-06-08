'use client'

import { track } from '@/lib/track'

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
  plan?: string
}

export function PlanCard({
  title,
  price,
  originalPrice,
  description,
  features,
  cta,
  popular,
  badge,
  href,
  plan,
}: PlanCardProps) {
  return (
    <div
      className={`relative flex h-full flex-col rounded-xl p-8 ${
        popular
          ? 'section-ink text-[var(--text-ink)] shadow-[0_24px_60px_-30px_rgba(17,32,47,0.55)] ring-1 ring-[var(--brass)]/40'
          : 'card-paper card-lift shadow-sm'
      }`}
    >
      {popular && (
        <span className="eyebrow absolute -top-3 left-8 rounded-full bg-[var(--brass)] px-3 py-1 text-[10px] text-[#2a1f0c]">
          {badge || 'Most chosen'}
        </span>
      )}

      <div>
        <h3 className={`font-display text-xl font-semibold ${popular ? 'text-white' : 'text-[var(--ink)]'}`}>
          {title}
        </h3>
        <p className={`mt-2 text-sm leading-relaxed ${popular ? 'text-[var(--text-ink-muted)]' : 'text-[var(--text-muted)]'}`}>
          {description}
        </p>
      </div>

      <div className="mt-6 flex items-baseline gap-2">
        <span className={`font-display text-4xl font-semibold ${popular ? 'text-[var(--brass)]' : 'text-[var(--ink)]'}`}>
          {price}
        </span>
        {originalPrice && (
          <span className={`text-base line-through ${popular ? 'text-[var(--text-ink-muted)]' : 'text-[var(--text-muted)]/70'}`}>
            {originalPrice}
          </span>
        )}
      </div>

      <ul className="mt-7 space-y-3 text-left">
        {features.map((feature) => (
          <li key={feature} className="flex items-start gap-3 text-sm">
            <svg
              className={`mt-0.5 h-4 w-4 flex-shrink-0 ${popular ? 'text-[var(--brass)]' : 'text-[var(--brass-600)]'}`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className={popular ? 'text-[var(--text-ink)]' : 'text-[var(--text)]'}>{feature}</span>
          </li>
        ))}
      </ul>

      <a
        href={href}
        onClick={() =>
          track('plan_cta_click', {
            source_page: '/',
            plan: plan || title.toLowerCase().replace(/\s+/g, '_'),
            cta_label: 'plan_card',
          })
        }
        className={`btn mt-8 w-full ${popular ? 'btn-brass' : 'btn-outline'}`}
      >
        {cta}
      </a>
    </div>
  )
}
