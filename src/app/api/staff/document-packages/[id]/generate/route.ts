import { NextRequest, NextResponse } from 'next/server';
import { requireStaff } from '../../../_session';
import { generateOfficialPacket } from '@/lib/documents/service';

// POST /api/staff/document-packages/[id]/generate — trigger official CR-180/CR-181 packet
// generation from the staff dashboard. Session-authenticated (admin/superadmin).
//
// The intake is NOT taken from the request body — it is read from the staff-reviewed
// `officialIntake` already saved on the package (see save-intake). Generation stays blocked
// (409) unless the human-review gate is approved AND the saved intake validates. The packet
// is left at `generated` (never auto-delivered). Body: { sample?: boolean }
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
    const sample = body.sample === true;
    const result = await generateOfficialPacket(payload, { id, actor, sample });

    if (result.blocked) {
      return NextResponse.json(
        {
          success: false,
          blocked: true,
          status: result.status,
          reasons: result.reasons,
          error: 'Official packet not generated; see reasons',
        },
        { status: 409 },
      );
    }
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Official generation failed';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
