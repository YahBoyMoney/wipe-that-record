import { NextRequest, NextResponse } from 'next/server';
import { requireStaff } from '../../../_session';
import { approvePackage } from '@/lib/documents/service';

// POST /api/staff/document-packages/[id]/approve — record human-review approval from the
// staff dashboard. Session-authenticated (admin/superadmin). The reviewer is the logged-in
// staff user (actor), not a client-supplied value. Body: { notes?: string }
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireStaff(request);
  if ('response' in auth) return auth.response;
  const { payload, actor } = auth.session;

  try {
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const notes = typeof body.notes === 'string' ? body.notes : undefined;
    const result = await approvePackage(payload, { id, actor, notes });
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Approval failed';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
