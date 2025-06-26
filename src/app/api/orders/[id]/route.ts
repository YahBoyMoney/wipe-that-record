import { NextRequest, NextResponse } from 'next/server';
import { getPayload } from 'payload';
import config from '@payload-config';

// PATCH /api/orders/[id] - Update order status and handle actions
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { action, status, ...updateData } = await request.json();
    
    const payload = await getPayload({ config });

    // Map actions to statuses
    let newStatus = status;
    if (action) {
      switch (action) {
        case 'process':
          newStatus = 'processing';
          break;
        case 'complete':
          newStatus = 'completed';
          break;
        case 'cancel':
          newStatus = 'cancelled';
          break;
        case 'refund':
          newStatus = 'refunded';
          break;
        default:
          newStatus = action;
      }
    }

    // If status present, update order status directly
    if (updateData.status) {
      const updated = await payload.update({
        collection: 'orders',
        id,
        data: { status: updateData.status, updatedAt: new Date().toISOString() }
      });
      return NextResponse.json({ success: true, order: updated });
    }

    // Update the order
    const updatedOrder = await payload.update({
      collection: 'orders',
      id,
      data: {
        status: newStatus,
        ...updateData,
        updatedAt: new Date().toISOString()
      }
    });

    // Log the action for audit trail
    if (action) {
      await payload.create({
        collection: 'analytics',
        data: {
          eventType: 'form_submitted',
          source: 'admin',
          category: 'system',
          relatedObject: {
            type: 'order',
            id: id,
            name: `Order #${id}`
          },
          properties: {
            action,
            newStatus,
            timestamp: new Date().toISOString(),
            adminAction: true
          }
        }
      });
    }

    return NextResponse.json({
      success: true,
      order: updatedOrder,
      message: `Order ${action ? action + 'ed' : 'updated'} successfully`
    });

  } catch (error) {
    console.error('Order update error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update order',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// GET /api/orders/[id] - Get order details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const payload = await getPayload({ config });

    const order = await payload.findByID({
      collection: 'orders',
      id
    });

    return NextResponse.json({
      success: true,
      order
    });

  } catch (error) {
    console.error('Order fetch error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch order',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 