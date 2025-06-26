import { NextRequest, NextResponse } from 'next/server';
import { getPayload } from 'payload';
import config from '../../../../payload.config';

// GET /api/orders - list orders with filtering & pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '25');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = (searchParams.get('sortOrder') || 'desc') as 'asc' | 'desc';

    const where: any = {};

    if (search) {
      where.or = [
        { orderNumber: { contains: search } },
        { 'customer.email': { contains: search } },
        { 'customer.firstName': { contains: search } },
        { 'customer.lastName': { contains: search } },
      ];
    }

    if (status && status !== 'all') {
      where.status = { equals: status };
    }

    const payload = await getPayload({ config });
    const orders = await payload.find({
      collection: 'orders',
      where: Object.keys(where).length ? where : undefined,
      page,
      limit,
      sort: sortOrder === 'desc' ? `-${sortBy}` : sortBy,
      depth: 2,
    });

    // Summary stats
    const totalRevenue = orders.docs.reduce((sum: number, o: any) => sum + (o.totals?.total || 0), 0);

    return NextResponse.json({
      success: true,
      data: {
        orders: orders.docs,
        pagination: {
          page: orders.page,
          totalPages: orders.totalPages,
          totalDocs: orders.totalDocs,
        },
        summary: {
          totalOrders: orders.totalDocs,
          revenue: totalRevenue,
        },
      },
    });
  } catch (error) {
    console.error('Orders GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch orders' },
      { status: 500 },
    );
  }
} 