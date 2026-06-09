import { NextRequest, NextResponse } from 'next/server';
import { getPayload } from 'payload';
import config from '@payload-config';
import { authorizeInternal } from '../_auth';

// GET /api/documents/[id] — fetch a single document package (internal/admin only).
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const unauthorized = authorizeInternal(request);
  if (unauthorized) return unauthorized;

  try {
    const { id } = await params;
    const payload = await getPayload({ config });
    const doc = await payload.findByID({
      collection: 'document-packages' as any,
      id,
      depth: 1,
    });
    return NextResponse.json({ success: true, doc });
  } catch (error) {
    return NextResponse.json({ error: 'Document package not found' }, { status: 404 });
  }
}
