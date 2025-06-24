import { NextRequest, NextResponse } from 'next/server';
import payload from 'payload';

export async function POST(req: NextRequest) {
  try {
    console.log('🔍 Simple database initialization...');
    
    // Just try to create a basic lead - this will create the collection
    const testLead = await payload.create({
      collection: 'leads',
      data: {
        email: 'test@example.com'
      }
    });
    
    console.log('✅ Test lead created:', testLead.id);
    
    // Delete the test lead
    await payload.delete({
      collection: 'leads',
      id: testLead.id
    });
    
    console.log('✅ Collections initialized successfully');
    
    return NextResponse.json({
      status: 'success',
      message: 'Database collections created'
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
    
    return NextResponse.json({
      status: 'failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 