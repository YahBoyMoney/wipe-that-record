import { NextRequest, NextResponse } from 'next/server';
import { getPayload } from 'payload';
import config from '@payload-config';
import { authorizeInternal } from '../../_auth';
import { generateOfficialPacket } from '@/lib/documents/service';
import type { OfficialIntake } from '@/lib/documents/types';

// POST /api/documents/[id]/generate-official — generate the official CA dismissal packet
// (filled CR-180 + draft CR-181) for a package (internal/admin only, CRON_SECRET-gated).
//
// The body MUST carry staff-reviewed intake. This endpoint never derives legal choices
// (Penal Code section, felony reduction, dismissal basis) from marketing-quiz answers — the
// caller (staff tooling / admin) supplies a reviewed `intake` object. Generation is blocked
// (409) unless the package's human-review gate is approved AND the intake validates.
//
// Body: { actor?: string, sample?: boolean, intake: OfficialIntake }
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
    const sample = body.sample === true;
    const intake = body.intake as OfficialIntake | undefined;

    if (!intake || typeof intake !== 'object') {
      return NextResponse.json(
        { success: false, error: 'Staff-reviewed intake is required in the request body' },
        { status: 400 },
      );
    }

    const payload = await getPayload({ config });
    const result = await generateOfficialPacket(payload, { id, actor, intake, sample });

    if (result.blocked) {
      // `reasons` are short, non-PII validation strings — safe to return to staff tooling.
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
