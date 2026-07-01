import React from 'react';
import { headers as nextHeaders } from 'next/headers';
import { getPayload } from 'payload';
import config from '@payload-config';
import DocumentPackagesDashboard from '@/components/staff/DocumentPackagesDashboard';

export const dynamic = 'force-dynamic';

// Staff document-packages dashboard. Server-side authentication gate: only an authenticated
// admin/superadmin Payload user may render the dashboard. This page issues no data itself —
// the client component calls the session-authenticated /api/staff/* routes, which re-check
// authorization on every request (defense in depth).
export default async function DocumentPackagesPage() {
  let role: string | null = null;
  try {
    const payload = await getPayload({ config });
    const { user } = await payload.auth({ headers: await nextHeaders() });
    role = user?.role ?? null;
  } catch {
    role = null;
  }

  const authorized = role === 'admin' || role === 'superadmin';

  if (!authorized) {
    return (
      <div
        data-testid="staff-unauthorized"
        className="min-h-screen flex items-center justify-center bg-gray-50 p-6"
      >
        <div className="max-w-md text-center bg-white border border-gray-200 rounded-xl p-8">
          <h1 className="text-lg font-semibold text-gray-900">Staff sign-in required</h1>
          <p className="mt-2 text-sm text-gray-600">
            This operational dashboard is restricted to authorized staff. Please sign in to the
            admin panel with an admin account to continue.
          </p>
          <a
            href="/admin"
            className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
          >
            Go to admin sign-in
          </a>
        </div>
      </div>
    );
  }

  return <DocumentPackagesDashboard />;
}
