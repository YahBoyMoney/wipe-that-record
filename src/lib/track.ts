'use client';

import { track as vercelTrack } from '@vercel/analytics';

/**
 * Funnel event names. Kept as a closed union so event naming stays consistent
 * across the conversion path and analytics dashboards don't fragment.
 */
export type FunnelEvent =
  | 'eligibility_cta_click'
  | 'pricing_cta_click'
  | 'process_cta_click'
  | 'service_card_click'
  | 'plan_cta_click'
  | 'eligibility_quiz_start'
  | 'eligibility_quiz_step'
  | 'eligibility_quiz_complete'
  | 'checkout_view'
  | 'checkout_cta_click';

/**
 * Allowed, non-PII property values. Only funnel metadata is permitted here:
 * source page, CTA label, plan, step number, and similar. Never pass emails,
 * phone numbers, names, criminal-record details, or quiz answers.
 */
export type FunnelProps = Record<string, string | number | boolean>;

const PII_KEY = /(email|phone|name|first|last|street|address|zip|case|conviction|county|ssn|dob|birth)/i;

/**
 * Strip any property that looks like it could carry personal information. This
 * is a guardrail so an accidental PII field never reaches the analytics
 * provider, even if a caller passes one by mistake.
 */
function sanitize(props?: FunnelProps): FunnelProps | undefined {
  if (!props) return undefined;
  const clean: FunnelProps = {};
  for (const [key, value] of Object.entries(props)) {
    if (PII_KEY.test(key)) continue;
    if (typeof value === 'string' && value.length > 80) continue;
    clean[key] = value;
  }
  return clean;
}

/**
 * Track a funnel event. Safe to call on the server (no-op) and never throws —
 * analytics must never break the conversion path.
 */
export function track(event: FunnelEvent, props?: FunnelProps): void {
  if (typeof window === 'undefined') return;
  try {
    vercelTrack(event, sanitize(props));
  } catch {
    // Swallow — analytics failures must not affect the user.
  }
}
