import { NextRequest, NextResponse } from 'next/server';
import { requireStaff } from '../../_session';
import { serializeDetail } from '../_serialize';

// GET /api/staff/document-packages/[id] — single package detail for the staff review view.
// Session-authenticated (admin/superadmin). Returns stored intake + validation + audit log.
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireStaff(request);
  if ('response' in auth) return auth.response;
  const { payload } = auth.session;

  try {
    const { id } = await params;
    const doc = await payload.findByID({
      collection: 'document-packages' as any,
      id,
      depth: 0,
    });
    return NextResponse.json({ success: true, doc: serializeDetail(doc as any) });
  } catch {
    return NextResponse.json({ error: 'Document package not found' }, { status: 404 });
  }
}
