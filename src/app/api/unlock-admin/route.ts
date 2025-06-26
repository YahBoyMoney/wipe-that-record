import { NextRequest, NextResponse } from 'next/server';
import { getPayload } from 'payload';
import config from '../../../../payload.config';

export async function POST(req: NextRequest) {
  try {
    const payload = await getPayload({ config });
    
    // Find the admin user
    const users = await payload.find({
      collection: 'users',
      where: {
        email: { equals: 'admin@wipethatrecord.com' }
      },
      limit: 1
    });

    if (users.docs.length === 0) {
      return NextResponse.json({ 
        success: false, 
        message: 'Admin user not found' 
      }, { status: 404 });
    }

    const adminUser = users.docs[0];

    // Reset login attempts and unlock the user
    await payload.update({
      collection: 'users',
      id: adminUser.id,
      data: {
        loginAttempts: 0,
        lockUntil: null
      }
    });

    console.log('✅ Admin user unlocked successfully');

    return NextResponse.json({ 
      success: true, 
      message: 'Admin user unlocked successfully. You can now log in.',
      email: 'admin@wipethatrecord.com'
    });

  } catch (error) {
    console.error('Error unlocking admin user:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to unlock admin user',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  return NextResponse.json({ 
    message: 'Use POST to unlock admin user',
    endpoint: '/api/unlock-admin'
  });
} 