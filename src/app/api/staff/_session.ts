import { NextRequest, NextResponse } from 'next/server';
import { getPayload } from 'payload';
import config from '@payload-config';
import type { Payload } from 'payload';
import { isStaffRole } from '@/lib/auth/roles.mjs';

// Staff-session authorization for the staff dashboard endpoints.
//
// Unlike the CRON_SECRET-gated internal routes (src/app/api/documents/*), these endpoints
// back a browser-facing operational dashboard, so they authenticate the logged-in Payload
// user via the session cookie and require an admin/superadmin role. This reuses the same
// auth that protects the Payload admin UI — no new, weaker credential is introduced, and
// these routes are never public.
export type StaffRole = 'admin' | 'superadmin';

export interface StaffSession {
  payload: Payload;
  user: { id: string | number; email?: string; role?: string };
  actor: string;
}

// Resolves and authorizes the staff session. Returns either an error `response` to return
// immediately, or the authenticated `session`. Errors are intentionally terse (no internal
// detail) and never echo back request data.
export async function requireStaff(
  request: NextRequest,
): Promise<{ response: NextResponse } | { session: StaffSession }> {
  let payload: Payload;
  try {
    payload = await getPayload({ config });
  } catch {
    return { response: NextResponse.json({ error: 'Service unavailable' }, { status: 503 }) };
  }

  let user: any = null;
  try {
    const result = await payload.auth({ headers: request.headers });
    user = result?.user ?? null;
  } catch {
    user = null;
  }

  if (!user) {
    return { response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
  }
  if (!isStaffRole(user.role)) {
    return { response: NextResponse.json({ error: 'Forbidden' }, { status: 403 }) };
  }

  const actor =
    (typeof user.email === 'string' && user.email) ||
    (user.id != null ? `user:${user.id}` : 'staff');

  return { session: { payload, user, actor } };
}
