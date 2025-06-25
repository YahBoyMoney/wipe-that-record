import { NextRequest, NextResponse } from 'next/server';
import payload from 'payload';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email');
  
  if (!email) {
    return NextResponse.json({ error: 'Email parameter required' }, { status: 400 });
  }
  
  return NextResponse.redirect(`${req.nextUrl.origin}/unsubscribe?email=${encodeURIComponent(email)}`);
}

export async function POST(req: NextRequest) {
  try {
    const { email, reason } = await req.json();
    
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }
    
    // Find and update the lead to unsubscribe them
    const leads = await payload.find({
      collection: 'leads',
      where: {
        email: {
          equals: email
        }
      }
    });
    
    if (leads.docs.length > 0) {
      // Update all matching leads to unsubscribed status
      for (const lead of leads.docs) {
        await payload.update({
          collection: 'leads',
          id: lead.id,
                     data: {
             emailStatus: 'failed'
           }
        });
      }
      
      console.log(`✅ Unsubscribed ${email} from all email communications`);
    }
    
    // Also add to a global unsubscribe list if you have one
    // This could be a separate collection or external service
    
    return NextResponse.json({ 
      success: true, 
      message: 'Successfully unsubscribed from all email communications' 
    });
    
  } catch (error) {
    console.error('❌ Unsubscribe error:', error);
    
    return NextResponse.json({ 
      error: 'Failed to process unsubscribe request',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 