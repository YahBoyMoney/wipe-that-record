import { NextRequest, NextResponse } from 'next/server';
import { requireStaff } from '@/app/api/staff/_session';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Mutates lead records — staff-only (admin/superadmin).
  const auth = await requireStaff(request);
  if ('response' in auth) return auth.response;
  const { payload } = auth.session;

  try {
    const { id } = await params;
    const { conversionStage } = await request.json();
    if (!conversionStage) {
      return NextResponse.json({ success: false, error: 'conversionStage required' }, { status: 400 });
    }

    const updated = await payload.update({ collection: 'leads', id, data: { conversionStage } });
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('Lead update error:', error);
    return NextResponse.json({ success: false, error: 'Update failed' }, { status: 500 });
  }
} 