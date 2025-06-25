import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    if (!type || (type !== 'review' && type !== 'full')) {
      return NextResponse.json({ error: 'Invalid upgrade type' }, { status: 400 });
    }

    // Redirect to high-converting checkout pages instead of direct Stripe
    const checkoutUrl = type === 'review' 
      ? `${request.nextUrl.origin}/checkout/review`
      : `${request.nextUrl.origin}/checkout/full-service`;

    return NextResponse.redirect(checkoutUrl, 303);
  } catch (error) {
    console.error('Error redirecting to checkout:', error);
    return NextResponse.json({ 
      error: 'Failed to redirect to checkout',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 