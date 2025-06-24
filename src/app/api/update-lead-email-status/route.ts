import { NextRequest, NextResponse } from 'next/server';
import payload from 'payload';

export async function POST(req: NextRequest) {
  try {
    const { leadId, emailStatus, lastEmailSent, emailsSent } = await req.json();

    if (!leadId) {
      return NextResponse.json({ error: 'Lead ID is required' }, { status: 400 });
    }

    // Update the lead record with email analytics
    await payload.update({
      collection: 'leads',
      id: leadId,
      data: {
        emailStatus,
        lastEmailSent,
        emailsSent,
      },
    });

    console.log(`📧 Updated email status for lead ${leadId}: ${emailStatus}`);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Email status updated successfully' 
    });

  } catch (error) {
    console.error('Error updating email status:', error);
    return NextResponse.json(
      { error: 'Failed to update email status' }, 
      { status: 500 }
    );
  }
} 