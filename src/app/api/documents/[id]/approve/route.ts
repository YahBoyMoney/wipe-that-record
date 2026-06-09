import { NextRequest, NextResponse } from 'next/server';
import { getPayload } from 'payload';
import config from '@payload-config';
import { authorizeInternal } from '../../_auth';
import { approvePackage } from '@/lib/documents/service';

// POST /api/documents/[id]/approve — record human-review approval (internal/admin only).
// Body: { actor: string, notes?: string }
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const unauthorized = authorizeInternal(request);
  if (unauthorized) return unauthorized;

  try {
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const actor = typeof body.actor === 'string' && body.actor.trim() ? body.actor.trim() : null;
    if (!actor) {
      return NextResponse.json({ error: 'actor is required' }, { status: 400 });
    }

    const payload = await getPayload({ config });
    const result = await approvePackage(payload, { id, actor, notes: body.notes });
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Approval failed';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
