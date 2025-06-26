import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    // This endpoint serves as a redirect or data provider for the admin dashboard
    // It can also provide dashboard configuration data
    
    const dashboardConfig = {
      title: 'WipeThatRecord Admin Dashboard',
      description: 'Complete e-commerce management system',
      features: [
        'Real-time analytics',
        'Order management',
        'Product inventory tracking',
        'Customer insights',
        'Revenue analytics',
        'Conversion funnel tracking'
      ],
      quickActions: [
        {
          title: 'View Dashboard',
          url: '/admin/enhanced-dashboard',
          icon: '📊',
          description: 'Access the enhanced analytics dashboard'
        },
        {
          title: 'Manage Orders',
          url: '/admin/collections/orders',
          icon: '📦',
          description: 'Process and track orders'
        },
        {
          title: 'Manage Products',
          url: '/admin/collections/products',
          icon: '🛍️',
          description: 'Update inventory and pricing'
        },
        {
          title: 'Customer Management',
          url: '/admin/collections/leads',
          icon: '👥',
          description: 'View and manage customers'
        }
      ],
      stats: {
        lastUpdated: new Date().toISOString(),
        systemStatus: 'operational'
      }
    };

    return NextResponse.json(dashboardConfig);

  } catch (error) {
    console.error('Admin dashboard config error:', error);
    return NextResponse.json(
      { error: 'Failed to load dashboard configuration' },
      { status: 500 }
    );
  }
} 