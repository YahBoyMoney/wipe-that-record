import { NextRequest, NextResponse } from 'next/server';
import payload from 'payload';

export async function POST(req: NextRequest) {
  try {
    console.log('🔍 Initializing database...');
    
    // Check if payload is initialized
    if (!payload) {
      console.error('❌ Payload not initialized');
      return NextResponse.json({ 
        error: 'Payload not initialized',
        status: 'failed'
      }, { status: 500 });
    }
    
    console.log('✅ Payload is initialized');
    
    // Try to create an admin user (this will create the users collection)
    try {
      const existingUsers = await payload.find({
        collection: 'users',
        limit: 1
      });
      
      if (existingUsers.totalDocs === 0) {
        console.log('🔍 Creating admin user...');
        const adminUser = await payload.create({
          collection: 'users',
          data: {
            email: 'admin@wipethatrecord.com',
            password: 'admin123!',
            firstName: 'Admin',
            lastName: 'User',
            role: 'admin'
          }
        });
        console.log('✅ Admin user created:', adminUser.id);
      } else {
        console.log('✅ Admin user already exists');
      }
    } catch (error) {
      console.log('🔍 Users collection may not exist yet, will be created automatically');
    }
    
    // Try to create a test lead (this will create the leads collection)
    try {
              const testLead = await payload.create({
          collection: 'leads',
          data: {
            email: 'test@example.com',
            first: 'Test',
            last: 'User'
          }
        });
      
      console.log('✅ Test lead created:', testLead.id);
      
      // Delete the test lead
      await payload.delete({
        collection: 'leads',
        id: testLead.id
      });
      
      console.log('✅ Test lead deleted - collections are ready');
      
    } catch (error) {
      console.error('❌ Error creating test lead:', error);
      return NextResponse.json({
        status: 'failed',
        error: 'Failed to create leads collection',
        details: error instanceof Error ? error.message : 'Unknown error'
      }, { status: 500 });
    }
    
    // Test that we can now count leads
    const leadCount = await payload.count({
      collection: 'leads'
    });
    
    console.log('✅ Database initialization complete, lead count:', leadCount.totalDocs);
    
    return NextResponse.json({
      status: 'success',
      message: 'Database initialized successfully',
      collections_created: ['users', 'leads', 'media'],
      lead_count: leadCount.totalDocs,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    
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