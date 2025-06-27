import { NextRequest, NextResponse } from 'next/server';
import payload from 'payload';

export async function POST(req: NextRequest) {
  try {
    const { leadId, behaviorData } = await req.json();

    if (!leadId) {
      return NextResponse.json({ error: 'Lead ID is required' }, { status: 400 });
    }

    await payload.update({
      collection: 'leads',
      id: leadId,
      data: {
        timeOnSite: behaviorData.timeOnSite?.toString(),
        pagesViewed: behaviorData.pageViews,
        deviceType: behaviorData.deviceType,
        scrollDepth: behaviorData.scrollDepth,
        clickThroughs: behaviorData.clickThroughs,
      },
    });

    console.log(`📊 Updated behavior data for lead ${leadId}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating lead behavior:', error);
    return NextResponse.json(
      { error: 'Failed to update lead behavior' },
      { status: 500 }
    );
  }
}
