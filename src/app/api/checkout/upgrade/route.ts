import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    if (!type || (type !== 'review' && type !== 'full')) {
      return NextResponse.json({ error: 'Invalid upgrade type' }, { status: 400 });
    }

    // Define pricing inline instead of using env variables
    const packageData = type === 'review' 
      ? {
          name: 'Expert Review Package',
          description: 'Eligibility verification and fast-track your case',
          amount: 10000, // $100.00 in cents
        }
      : {
          name: 'Full Service Package', 
          description: 'Complete case management with attorney representation',
          amount: 150000, // $1500.00 in cents
        };

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: packageData.name,
            description: packageData.description,
          },
          unit_amount: packageData.amount,
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'}/thank-you?upgraded=${type}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'}/thank-you`,
      metadata: {
        type: 'upgrade',
        upgradeType: type,
        package: `expungement-${type}`,
      },
    });

    return NextResponse.redirect(session.url!);
  } catch (error) {
    console.error('Error creating upgrade checkout session:', error);
    return NextResponse.json({ 
      error: 'Failed to create checkout session',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 