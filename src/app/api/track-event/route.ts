import { NextRequest, NextResponse } from 'next/server';
import { getPayload } from 'payload';
import config from '../../../../payload.config';

export async function POST(request: NextRequest) {
  try {
    const {
      event,
      page,
      product_id,
      user_id,
      session_id,
      utm_source,
      utm_medium,
      utm_campaign,
      referrer,
      user_agent,
      ip_address,
      value,
      currency = 'USD',
      metadata = {}
    } = await request.json();

    // Get real IP if not provided
    const clientIP = ip_address || 
      request.headers.get('x-forwarded-for')?.split(',')[0] || 
      request.headers.get('x-real-ip') || 
      'unknown';

    // Get real user agent if not provided
    const clientUserAgent = user_agent || request.headers.get('user-agent') || 'unknown';

    const payload = await getPayload({ config });

    // Create analytics record
    const analyticsData = {
      event,
      page,
      product_id,
      user_id,
      session_id,
      utm_source,
      utm_medium,
      utm_campaign,
      referrer,
      user_agent: clientUserAgent,
      ip_address: clientIP,
      value: value || 0,
      currency,
      metadata,
      timestamp: new Date().toISOString(),
    };

    // Store in analytics collection
    await payload.create({
      collection: 'analytics',
      data: analyticsData,
    });

    // Update product analytics if product_id is provided
    if (product_id && event) {
      try {
        const product = await payload.findByID({
          collection: 'products',
          id: product_id,
        });

        if (product) {
          const updates: any = {};
          
          switch (event) {
            case 'page_view':
            case 'product_view':
              updates['analytics.views'] = (product.analytics?.views || 0) + 1;
              break;
            case 'add_to_cart':
              // Track add to cart events
              break;
            case 'purchase':
              updates['analytics.totalSales'] = (product.analytics?.totalSales || 0) + 1;
              updates['analytics.revenue'] = (product.analytics?.revenue || 0) + (value || 0);
              // Recalculate conversion rate
              const newViews = product.analytics?.views || 0;
              const newSales = (product.analytics?.totalSales || 0) + 1;
              if (newViews > 0) {
                updates['analytics.conversionRate'] = (newSales / newViews) * 100;
              }
              break;
          }

          if (Object.keys(updates).length > 0) {
            await payload.update({
              collection: 'products',
              id: product_id,
              data: updates,
            });
          }
        }
      } catch (error) {
        console.error('Error updating product analytics:', error);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Event tracked successfully',
    });

  } catch (error) {
    console.error('Analytics tracking error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to track event',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve analytics data
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const event = searchParams.get('event');
    const page = searchParams.get('page');
    const product_id = searchParams.get('product_id');
    const limit = parseInt(searchParams.get('limit') || '100');
    const days = parseInt(searchParams.get('days') || '30');

    const payload = await getPayload({ config });

    // Build where conditions
    const where: any = {};
    
    if (event) where.event = { equals: event };
    if (page) where.page = { equals: page };
    if (product_id) where.product_id = { equals: product_id };

    // Date range filter
    const dateFrom = new Date();
    dateFrom.setDate(dateFrom.getDate() - days);
    where.createdAt = { greater_than_equal: dateFrom.toISOString() };

    const analytics = await payload.find({
      collection: 'analytics',
      where,
      limit,
      sort: '-createdAt',
    });

    // Generate summary stats
    const events = analytics.docs;
    const summary = {
      totalEvents: events.length,
      uniqueUsers: new Set(events.map(e => e.user_id || e.session_id).filter(Boolean)).size,
      uniqueSessions: new Set(events.map(e => e.session_id).filter(Boolean)).size,
      totalValue: events.reduce((sum, e) => sum + (e.value || 0), 0),
      eventTypes: events.reduce((acc, e) => {
        acc[e.event] = (acc[e.event] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      topPages: events.reduce((acc, e) => {
        if (e.page) {
          acc[e.page] = (acc[e.page] || 0) + 1;
        }
        return acc;
      }, {} as Record<string, number>),
    };

    return NextResponse.json({
      success: true,
      data: {
        events: analytics.docs,
        summary,
        pagination: {
          page: analytics.page,
          totalPages: analytics.totalPages,
          totalDocs: analytics.totalDocs,
        },
      },
    });

  } catch (error) {
    console.error('Analytics retrieval error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to retrieve analytics',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}