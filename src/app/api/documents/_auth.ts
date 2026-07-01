import { NextRequest, NextResponse } from 'next/server';
import { isValidBearer } from '@/lib/auth/roles.mjs';

// Internal/admin auth for the document endpoints, mirroring the cron routes
// (src/app/api/cron/*). Staff drive these via tooling that holds CRON_SECRET; humans
// can also manage packages through the role-gated Payload admin UI. These endpoints
// expose document status and can generate files, so they must never be public.
export function authorizeInternal(request: NextRequest): NextResponse | null {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: 'CRON_SECRET is not configured on the server' },
      { status: 503 },
    );
  }
  const authHeader = request.headers.get('authorization');
  if (!isValidBearer(authHeader, secret)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return null;
}
