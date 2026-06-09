import { NextRequest, NextResponse } from 'next/server';
import { getPayload } from 'payload';
import config from '../../../../payload.config';
import { authorizeInternal } from './_auth';

// GET /api/documents — list document packages (internal/admin only).
export async function GET(request: NextRequest) {
  const unauthorized = authorizeInternal(request);
  if (unauthorized) return unauthorized;

  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '25');
    const status = searchParams.get('status') || '';

    const where: any = {};
    if (status && status !== 'all') where.status = { equals: status };

    const payload = await getPayload({ config });
    const result = await payload.find({
      collection: 'document-packages' as any,
      where: Object.keys(where).length ? where : undefined,
      page,
      limit,
      sort: '-createdAt',
      depth: 0,
    });

    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    console.error('[documents] list error');
    return NextResponse.json({ error: 'Failed to list document packages' }, { status: 500 });
  }
}
