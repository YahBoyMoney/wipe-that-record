import { NextRequest, NextResponse } from 'next/server';
import { requireStaff } from '../_session';
import { serializeListItem } from './_serialize';

// GET /api/staff/document-packages — list document packages for the staff dashboard.
// Session-authenticated (admin/superadmin). Returns PII-light list items only.
//
// Query: ?status=<status>&official=1&limit=<n>&page=<n>
export async function GET(request: NextRequest) {
  const auth = await requireStaff(request);
  if ('response' in auth) return auth.response;
  const { payload } = auth.session;

  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const officialOnly = searchParams.get('official') === '1';
  const limit = Math.min(Number(searchParams.get('limit')) || 50, 200);
  const page = Math.max(Number(searchParams.get('page')) || 1, 1);

  const where: Record<string, unknown> = {};
  if (status) where.status = { equals: status };
  if (officialOnly) where.templateKey = { equals: 'official_ca_dismissal_packet' };

  try {
    const result = await payload.find({
      collection: 'document-packages' as any,
      where,
      limit,
      page,
      sort: '-createdAt',
      depth: 0,
    });
    return NextResponse.json({
      success: true,
      docs: result.docs.map(serializeListItem),
      totalDocs: result.totalDocs,
      page: result.page,
      totalPages: result.totalPages,
    });
  } catch {
    return NextResponse.json({ error: 'Failed to load document packages' }, { status: 500 });
  }
}
