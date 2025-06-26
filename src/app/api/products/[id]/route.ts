import { NextRequest, NextResponse } from 'next/server';
import { getPayload } from 'payload';
import config from '@payload-config';

// PATCH /api/products/[id] - Update product including inventory
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const updateData = await request.json();
    
    const payload = await getPayload({ config });

    // Get current product data for comparison
    const currentProduct = await payload.findByID({
      collection: 'products',
      id
    });

    // Update the product
    const updatedProduct = await payload.update({
      collection: 'products',
      id,
      data: {
        ...updateData,
        updatedAt: new Date().toISOString()
      }
    });

    // Log inventory changes
    if (updateData.inventory) {
      const oldQuantity = currentProduct.inventory?.quantity || 0;
      const newQuantity = updateData.inventory.quantity || 0;
      
      if (oldQuantity !== newQuantity) {
        await payload.create({
          collection: 'analytics',
          data: {
            eventType: 'form_submitted',
            source: 'admin',
            category: 'product',
            value: newQuantity - oldQuantity,
            relatedObject: {
              type: 'product',
              id: id,
              name: updatedProduct.name
            },
            properties: {
              action: 'inventory_update',
              oldQuantity,
              newQuantity,
              difference: newQuantity - oldQuantity,
              timestamp: new Date().toISOString(),
              adminAction: true
            }
          }
        });
      }

      // Check for low stock alert
      const lowStockThreshold = 5; // You can make this configurable
      if (newQuantity <= lowStockThreshold && newQuantity > 0) {
        await payload.create({
          collection: 'analytics',
          data: {
            eventType: 'error_occurred',
            source: 'system',
            category: 'product',
            value: newQuantity,
            relatedObject: {
              type: 'product',
              id: id,
              name: updatedProduct.name
            },
            properties: {
              alert: 'low_stock',
              quantity: newQuantity,
              threshold: lowStockThreshold,
              timestamp: new Date().toISOString()
            }
          }
        });
      }
    }

    return NextResponse.json({
      success: true,
      product: updatedProduct,
      message: 'Product updated successfully'
    });

  } catch (error) {
    console.error('Product update error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update product',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// GET /api/products/[id] - Get product details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const payload = await getPayload({ config });

    const product = await payload.findByID({
      collection: 'products',
      id
    });

    return NextResponse.json({
      success: true,
      product
    });

  } catch (error) {
    console.error('Product fetch error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch product',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 