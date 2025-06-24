import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function POST(req: NextRequest) {
  const { priceId, email, first, last } = await req.json();

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${req.nextUrl.origin}/thank-you?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url:  `${req.nextUrl.origin}/cancelled`,
    customer_email: email,
    metadata: { first, last },
  });

  return NextResponse.json({ url: session.url });
} 