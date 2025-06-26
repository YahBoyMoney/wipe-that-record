import { NextRequest, NextResponse } from 'next/server';
import { getPayload } from 'payload';
import config from '../../../../payload.config';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const stage = searchParams.get('stage') || 'lead';
    const limit = parseInt(searchParams.get('limit') || '100');

    const payload = await getPayload({ config });

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