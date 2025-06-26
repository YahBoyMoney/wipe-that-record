import { NextRequest, NextResponse } from 'next/server';
import { getPayload } from 'payload';
import config from '../../../../payload.config';

// GET /api/products - List all products with filtering, sorting, and pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse query parameters
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const category = searchParams.get('category') || '';
    const featured = searchParams.get('featured') || '';
    const sortBy = searchParams.get('sortBy') || 'name';
    const sortOrder = (searchParams.get('sortOrder') || 'asc') as 'asc' | 'desc';

    const payload = await getPayload({ config });

    // Build where conditions
    const whereConditions: any = {};

    if (search) {
      whereConditions.or = [
        { name: { contains: search } },
        { description: { contains: search } },
        { shortDescription: { contains: search } }
      ];
    }

    if (status && status !== 'all') {
      whereConditions.status = { equals: status };
    }

    if (category && category !== 'all') {
      whereConditions.category = { equals: category };
    }

    if (featured === 'true') {
      whereConditions.featured = { equals: true };
    }

    // Fetch products
    const products = await payload.find({
      collection: 'products',
      where: Object.keys(whereConditions).length > 0 ? whereConditions : undefined,
      page,
      limit,
      sort: sortOrder === 'desc' ? `-${sortBy}` : sortBy,
      depth: 2, // Include related data
    });

    // Calculate summary statistics
    const totalActiveProducts = await payload.count({
      collection: 'products',
      where: { status: { equals: 'active' } }
    });

    const lowStockProducts = await payload.find({
      collection: 'products',
      where: {
        and: [
          { status: { equals: 'active' } },
          { 'inventory.trackInventory': { equals: true } },
          { 'inventory.quantity': { less_than_equal: 5 } }
        ]
      },
      limit: 1000
    });

    const totalRevenue = products.docs.reduce((sum: number, product: any) => {
      return sum + (product.analytics?.revenue || 0);
    }, 0);

    return NextResponse.json({
      success: true,
      data: {
        products: products.docs,
        pagination: {
          page: products.page,
          limit: products.limit,
          totalPages: products.totalPages,
          totalDocs: products.totalDocs,
          hasNextPage: products.hasNextPage,
          hasPrevPage: products.hasPrevPage
        },
        summary: {
          totalProducts: products.totalDocs,
          activeProducts: totalActiveProducts.totalDocs,
          lowStockCount: lowStockProducts.docs.length,
          totalRevenue: totalRevenue
        }
      }
    });

  } catch (error) {
    console.error('Products GET error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch products',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// POST /api/products - Create new product
export async function POST(request: NextRequest) {
  try {
    const productData = await request.json();
    const payload = await getPayload({ config });

    // Auto-generate slug if not provided
    if (!productData.slug && productData.name) {
      productData.slug = productData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }

    // Create the product
    const newProduct = await payload.create({
      collection: 'products',
      data: {
        ...productData,
        analytics: {
          views: 0,
          totalSales: 0,
          revenue: 0,
          conversionRate: 0,
          averageRating: 0,
          totalReviews: 0
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: newProduct,
      message: 'Product created successfully'
    });

  } catch (error) {
    console.error('Product creation error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create product',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// PUT /api/products - Bulk update products
export async function PUT(request: NextRequest) {
  try {
    const { productIds, updateData } = await request.json();
    
    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Product IDs are required' },
        { status: 400 }
      );
    }

    const payload = await getPayload({ config });
    const updatedProducts = [];

    for (const productId of productIds) {
      try {
        const updatedProduct = await payload.update({
          collection: 'products',
          id: productId,
          data: updateData
        });
        updatedProducts.push(updatedProduct);
      } catch (error) {
        console.error(`Failed to update product ${productId}:`, error);
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        updatedProducts,
        count: updatedProducts.length
      },
      message: `Successfully updated ${updatedProducts.length} product(s)`
    });

  } catch (error) {
    console.error('Bulk product update error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update products',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// DELETE /api/products - Bulk delete products
export async function DELETE(request: NextRequest) {
  try {
    const { productIds } = await request.json();
    
    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Product IDs are required' },
        { status: 400 }
      );
    }

    const payload = await getPayload({ config });
    const deletedProducts = [];

    for (const productId of productIds) {
      try {
        // Get product info before deletion
        const product = await payload.findByID({
          collection: 'products',
          id: productId
        });

        await payload.delete({
          collection: 'products',
          id: productId
        });

        deletedProducts.push({ id: productId, name: product.name });
      } catch (error) {
        console.error(`Failed to delete product ${productId}:`, error);
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        deletedProducts,
        count: deletedProducts.length
      },
      message: `Successfully deleted ${deletedProducts.length} product(s)`
    });

  } catch (error) {
    console.error('Bulk product deletion error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to delete products',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 