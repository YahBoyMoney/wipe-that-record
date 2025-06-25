import { NextRequest, NextResponse } from 'next/server';
import { getPayload } from 'payload';
import config from '../../../../payload.config';

export async function POST(req: NextRequest) {
  try {
    console.log('🔄 Initializing admin user...');
    
    const payload = await getPayload({ config });
    
    // Check if admin user already exists
    const existingUser = await payload.find({
      collection: 'users',
      where: {
        email: {
          equals: 'admin@wipethatrecord.com',
        },
      },
    });

    if (existingUser.docs.length > 0) {
      // Update existing user to superadmin
      const user = existingUser.docs[0];
      await payload.update({
        collection: 'users',
        id: user.id,
        data: {
          role: 'superadmin',
          department: 'executive',
          permissions: [
            {
              resource: 'all',
              actions: [
                { action: 'create' },
                { action: 'read' },
                { action: 'update' },
                { action: 'delete' },
                { action: 'export' },
              ],
            },
          ],
          isActive: true,
          lastLogin: new Date().toISOString(),
          loginCount: (user.loginCount || 0) + 1,
        },
      });
      
      console.log('✅ Updated existing admin user to superadmin');
      return NextResponse.json({ 
        success: true, 
        message: 'Admin user updated to superadmin',
        userId: user.id 
      });
    } else {
      // Create new superadmin user
      const newUser = await payload.create({
        collection: 'users',
        data: {
          email: 'admin@wipethatrecord.com',
          password: 'agj21990', // User's preferred password
          firstName: 'Super',
          lastName: 'Admin',
          role: 'superadmin',
          department: 'executive',
          permissions: [
            {
              resource: 'all',
              actions: [
                { action: 'create' },
                { action: 'read' },
                { action: 'update' },
                { action: 'delete' },
                { action: 'export' },
              ],
            },
          ],
          isActive: true,
          lastLogin: new Date().toISOString(),
          loginCount: 1,
          notes: 'Auto-created superadmin user with full system access',
        },
      });

      console.log('✅ Created new superadmin user');
      return NextResponse.json({ 
        success: true, 
        message: 'Superadmin user created successfully',
        userId: newUser.id,
        credentials: {
          email: 'admin@wipethatrecord.com',
          password: 'WipeRecord2024!',
          note: 'Please change this password immediately after first login'
        }
      });
    }

  } catch (error) {
    console.error('❌ Error initializing admin user:', error);
    return NextResponse.json({ 
      error: 'Failed to initialize admin user',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Use POST to initialize admin user',
    endpoint: '/api/init-admin',
    method: 'POST'
  });
} 