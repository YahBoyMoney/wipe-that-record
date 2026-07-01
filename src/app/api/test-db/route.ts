import { NextRequest, NextResponse } from 'next/server';
import payload from 'payload';
import { authorizeInternal } from '@/app/api/documents/_auth';

export async function GET(req: NextRequest) {
  // Probes DB connectivity and record counts — must never be public. Requires Bearer CRON_SECRET.
  const unauthorized = authorizeInternal(req);
  if (unauthorized) return unauthorized;

  try {
    console.log('🔍 Testing database connection...');
    
    // Check if payload is initialized
    if (!payload) {
      console.error('❌ Payload not initialized');
      return NextResponse.json({ 
        error: 'Payload not initialized',
        status: 'failed'
      }, { status: 500 });
    }
    
    console.log('✅ Payload is initialized');
    
    // Try to count leads to test database connection
    const leadCount = await payload.count({
      collection: 'leads'
    });
    
    console.log('✅ Database connection successful, lead count:', leadCount.totalDocs);
    
    // Get the first few leads to verify schema
    const leads = await payload.find({
      collection: 'leads',
      limit: 3
    });
    
    console.log('✅ Sample leads retrieved:', leads.docs.length);
    
    return NextResponse.json({
      status: 'success',
      payload_initialized: true,
      database_connected: true,
      lead_count: leadCount.totalDocs,
      sample_leads_count: leads.docs.length,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Database test failed:', error);
    
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      
      return NextResponse.json({
        status: 'failed',
        error: error.message,
        error_type: error.name,
        timestamp: new Date().toISOString()
      }, { status: 500 });
    }
    
    return NextResponse.json({
      status: 'failed',
      error: 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
} 