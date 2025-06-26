import { NextRequest, NextResponse } from 'next/server';
import { getPayload } from 'payload';
import config from '../../../../../payload.config';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { conversionStage } = await request.json();
    if (!conversionStage) {
      return NextResponse.json({ success: false, error: 'conversionStage required' }, { status: 400 });
    }

    const payload = await getPayload({ config });
    const updated = await payload.update({ collection: 'leads', id, data: { conversionStage } });
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('Lead update error:', error);
    return NextResponse.json({ success: false, error: 'Update failed' }, { status: 500 });
  }
} 