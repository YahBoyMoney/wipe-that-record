import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function GET(req: NextRequest) {
  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'DIY Expungement Package',
            description: 'Complete California expungement instructions and forms',
          },
          unit_amount: 5000, // $50.00 in cents
        },
        quantity: 1,
      }],
      success_url: `${req.nextUrl.origin}/thank-you?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.nextUrl.origin}/`,
      allow_promotion_codes: true,
      metadata: {
        type: 'diy',
        package: 'expungement-diy',
      },
    });

    return NextResponse.redirect(session.url!, 303);
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json({ 
      error: 'Failed to create checkout session',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 