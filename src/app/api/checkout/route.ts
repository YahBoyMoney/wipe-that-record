import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { 
      email, 
      amount, 
      product, 
      promoCode, 
      leadId,
      fullName 
    } = await req.json();

    console.log(`💳 Checkout initiated: ${email} - $${amount} ${product}`);

    let finalAmount = amount;
    let discountAmount = 0;
    let appliedPromoCode = null;

    // 🎯 APPLY PROMO CODE DISCOUNT
    if (promoCode) {
      console.log(`🔍 Applying promo code: ${promoCode}`);
      
      try {
        const promoResponse = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'}/api/promo-codes?code=${promoCode}&amount=${amount}&product=${product}`);
        
        if (promoResponse.ok) {
          const promoResult = await promoResponse.json();
          
          if (promoResult.valid) {
            finalAmount = promoResult.finalAmount;
            discountAmount = promoResult.discountAmount;
            appliedPromoCode = promoResult;
            
            console.log(`✅ Promo code applied: ${promoCode} - $${discountAmount} discount`);
            
            // Apply the promo code (increment usage)
            await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'}/api/promo-codes`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ code: promoCode, amount, product, email })
            });
          } else {
            console.log(`❌ Invalid promo code: ${promoCode} - ${promoResult.error}`);
            return NextResponse.json({
              error: `Promo code error: ${promoResult.error}`
            }, { status: 400 });
          }
        }
      } catch (promoError) {
        console.error('❌ Promo code validation failed:', promoError);
        return NextResponse.json({
          error: 'Failed to validate promo code'
        }, { status: 400 });
      }
    }

    // Convert to cents for Stripe
    const stripeAmount = Math.round(finalAmount * 100);

    // Create product description
    const productNames = {
      'diy': 'DIY Expungement Package',
      'review': 'Expert Review Service', 
      'full-service': 'Full Service Expungement'
    };

    const productName = productNames[product as keyof typeof productNames] || 'Expungement Service';
    
    let description = `${productName} - ${fullName || email}`;
    if (appliedPromoCode) {
      description += ` (${appliedPromoCode.code}: -$${discountAmount})`;
    }

    // 💳 CREATE STRIPE CHECKOUT SESSION
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: productName,
              description: description,
            },
            unit_amount: stripeAmount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.nextUrl.origin}/thank-you?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.nextUrl.origin}/`,
      customer_email: email,
      metadata: {
        email,
        product,
        leadId: leadId || '',
        originalAmount: amount.toString(),
        finalAmount: finalAmount.toString(),
        promoCode: promoCode || '',
        discountAmount: discountAmount.toString(),
        fullName: fullName || ''
      },
      allow_promotion_codes: true,
    });

    console.log(`✅ Checkout Session created: ${session.id} for $${finalAmount}`);

    // 📊 TRACKING ANALYTICS
    const analytics = {
      event: 'checkout_started',
      email,
      product,
      originalAmount: amount,
      finalAmount,
      promoCode: promoCode || null,
      discountAmount,
      sessionId: session.id,
      timestamp: new Date().toISOString()
    };

    console.log(`📊 Checkout analytics:`, analytics);

    return NextResponse.json({
      url: session.url,
      sessionId: session.id,
      amount: finalAmount,
      originalAmount: amount,
      discountAmount,
      appliedPromoCode,
      product,
      description
    });

  } catch (error) {
    console.error('❌ Checkout error:', error);
    
    return NextResponse.json({
      error: 'Failed to create payment intent'
    }, { status: 500 });
  }
} 