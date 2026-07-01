import React from 'react'
import Link from 'next/link'
import { headers as nextHeaders } from 'next/headers'
import { getPayload } from 'payload'
import config from '@payload-config'
import { isStaffRole } from '@/lib/auth/roles.mjs'

export const dynamic = 'force-dynamic'

// Server-side auth gate for the custom operational dashboard. /admin-panel renders lead,
// order, and customer PII, so it must never be served to an unauthenticated visitor.
// We authenticate the logged-in Payload user via the session cookie and require an
// admin/superadmin role — the same model used by the staff API routes
// (src/app/api/staff/_session.ts) and the Payload admin UI. When the visitor is not an
// authorized staff member we render a "sign-in required" screen and never render the
// dashboard children (which fetch data on mount).
async function getStaffUser() {
  try {
    const payload = await getPayload({ config })
    const requestHeaders = await nextHeaders()
    const { user } = await payload.auth({ headers: requestHeaders })
    if (user && isStaffRole((user as { role?: string }).role)) {
      return user
    }
  } catch {
    // Fall through to the sign-in-required screen on any auth/service error.
  }
  return null
}

function SignInRequired() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0f172a',
        color: '#e2e8f0',
        fontFamily: 'system-ui, sans-serif',
        padding: '1.5rem',
      }}
    >
      <div style={{ maxWidth: 420, textAlign: 'center' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.75rem' }}>
          Staff sign-in required
        </h1>
        <p style={{ color: '#94a3b8', marginBottom: '1.5rem' }}>
          The admin panel is restricted to authorized staff. Please sign in with an
          administrator account to continue.
        </p>
        <Link
          href="/admin"
          style={{
            display: 'inline-block',
            background: '#2563eb',
            color: '#fff',
            padding: '0.6rem 1.25rem',
            borderRadius: '0.5rem',
            fontWeight: 600,
            textDecoration: 'none',
          }}
        >
          Go to sign in
        </Link>
      </div>
    </div>
  )
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getStaffUser()
  if (!user) {
    return <SignInRequired />
  }
  return <>{children}</>
}
