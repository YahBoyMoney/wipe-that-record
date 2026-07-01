import { NextRequest, NextResponse } from 'next/server';
import { requireStaff } from '../../../_session';
import { parseIntakeBody } from '../../_intake';
import { saveOfficialIntake } from '@/lib/documents/service';

// POST /api/staff/document-packages/[id]/save-intake — persist staff-reviewed official
// intake. Session-authenticated (admin/superadmin). Does NOT generate; returns the
// validation result so the UI can render the missing-field checklist.
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
    const intake = parseIntakeBody(body);
    const result = await saveOfficialIntake(payload, { id, actor, intake });
    return NextResponse.json({ success: true, validation: result.validation });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to save intake';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
