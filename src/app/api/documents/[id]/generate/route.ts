import { NextRequest, NextResponse } from 'next/server';
import { getPayload } from 'payload';
import config from '@payload-config';
import { authorizeInternal } from '../../_auth';
import { generatePackage } from '@/lib/documents/service';

// POST /api/documents/[id]/generate — generate (or regenerate) the PDF packet
// (internal/admin only). Blocked for review-required templates until approved.
// Body (optional): { actor?: string }
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const unauthorized = authorizeInternal(request);
  if (unauthorized) return unauthorized;

  try {
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const actor = typeof body.actor === 'string' ? body.actor : undefined;

    const payload = await getPayload({ config });
    const result = await generatePackage(payload, { id, actor });

    if (result.blocked) {
      return NextResponse.json(
        { success: false, blocked: true, status: result.status, error: 'Human review required before generation' },
        { status: 409 },
      );
    }
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Generation failed';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
