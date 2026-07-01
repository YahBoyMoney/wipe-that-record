import { NextRequest, NextResponse } from 'next/server';
import { requireStaff } from '@/app/api/staff/_session';

export async function GET(request: NextRequest) {
  // Returns lead PII — staff-only (admin/superadmin).
  const auth = await requireStaff(request);
  if ('response' in auth) return auth.response;
  const { payload } = auth.session;

  try {
    const { searchParams } = new URL(request.url);
    const stage = searchParams.get('stage') || 'lead';
    const limit = parseInt(searchParams.get('limit') || '100');


    const leads = await payload.find({
      collection: 'leads',
      where: {
        conversionStage: { equals: stage },
      },
      depth: 0,
      limit,
      sort: '-createdAt',
    });

    return NextResponse.json({ success: true, data: leads.docs });
  } catch (error) {
    console.error('Leads list error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch leads' }, { status: 500 });
  }
} 