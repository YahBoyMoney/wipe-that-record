import { NextRequest, NextResponse } from 'next/server';
import payload from 'payload';

export async function POST(req: NextRequest) {
  try {
    const { fullName, email } = await req.json();
    
    console.log('🔍 Received lead data:', { fullName, email });
    
    // Validate input
    if (!fullName || !email) {
      console.log('❌ Missing required fields');
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    // Split full name into first and last
    const nameParts = fullName.trim().split(' ');
    const first = nameParts[0] || '';
    const last = nameParts.slice(1).join(' ') || '';

    console.log('🔍 Split name:', { first, last });

    // Check if payload is initialized
    if (!payload) {
      console.log('❌ Payload not initialized');
      return NextResponse.json({ error: 'System not initialized' }, { status: 500 });
    }

    console.log('🔍 Attempting to create lead in database...');

    // Create lead in Payload
    const lead = await payload.create({
      collection: 'leads',
      data: {
        email,
        first,
        last,
        paid: false,
        source: 'direct',
        conversionStage: 'lead',
      },
    });

    console.log('✅ Lead created successfully:', lead.id);

    return NextResponse.json({ success: true, leadId: lead.id });
  } catch (error) {
    console.error('❌ Error creating lead:', error);
    
    // More detailed error response
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      
      return NextResponse.json({ 
        error: 'Failed to create lead',
        details: error.message,
        type: error.constructor.name
      }, { status: 500 });
    }
    
    return NextResponse.json({ 
      error: 'Failed to create lead',
      details: 'Unknown error occurred'
    }, { status: 500 });
  }
} 