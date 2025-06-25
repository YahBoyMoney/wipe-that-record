import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const getStripe = () => {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new Error('STRIPE_SECRET_KEY is required');
  }
  return new Stripe(secretKey);
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { 
      email, 
      promoCode, 
      leadId,
      fullName,
      utmSource,
      utmCampaign,
      utmMedium 
    } = body;

    console.log('🛒 DIY Checkout initiated:', { email, promoCode, leadId });

    // Base price and discount calculation
    const basePrice = 147;  // Regular price
    const salePrice = 97;   // Sale price
    let finalAmount = salePrice;
    let discountAmount = basePrice - salePrice;
    let appliedPromoCode = null;

    // Apply additional promo codes
    if (promoCode) {
      console.log(`🎫 Applying promo code: ${promoCode}`);
      
      const validPromoCodes = {
        'SAVE10': { discount: 0.10, type: 'percentage' },
        'SAVE15': { discount: 0.15, type: 'percentage' },
        'SAVE20': { discount: 0.20, type: 'percentage' },
        'FIRST50': { discount: 50, type: 'fixed' },
        'FRESH48': { discount: 0.25, type: 'percentage' },
        'LASTCHANCE30': { discount: 0.30, type: 'percentage' }
      };

      const promo = validPromoCodes[promoCode as keyof typeof validPromoCodes];
      if (promo) {
        if (promo.type === 'percentage') {
          const promoDiscount = Math.round(finalAmount * promo.discount);
          finalAmount = finalAmount - promoDiscount;
          discountAmount += promoDiscount;
        } else {
          finalAmount = Math.max(finalAmount - promo.discount, 47); // Minimum $47
          discountAmount += promo.discount;
        }
        
        appliedPromoCode = {
          code: promoCode,
          discount: promo.discount,
          type: promo.type
        };
        
        console.log(`✅ Promo applied: ${promoCode} - Total discount: $${discountAmount}`);
      } else {
        console.log(`❌ Invalid promo code: ${promoCode}`);
        return NextResponse.json({
          error: `Invalid promo code: ${promoCode}`
        }, { status: 400 });
      }
    }

    // Convert to cents for Stripe
    const stripeAmount = Math.round(finalAmount * 100);

    // Create Stripe checkout session
    const stripe = getStripe();
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'DIY Expungement Kit - Complete Package',
              description: `Complete DIY expungement kit with step-by-step instructions, pre-filled forms, and success guarantee. ${appliedPromoCode ? `Discount applied: ${appliedPromoCode.code}` : ''}`,
              images: ['https://your-domain.com/images/diy-kit-product.jpg'],
            },
            unit_amount: stripeAmount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.nextUrl.origin}/thank-you?session_id={CHECKOUT_SESSION_ID}&product=diy`,
      cancel_url: `${req.nextUrl.origin}/checkout/diy?cancelled=true`,
      customer_email: email,
      metadata: {
        email: email || '',
        product: 'diy',
        leadId: leadId || '',
        originalAmount: basePrice.toString(),
        finalAmount: finalAmount.toString(),
        promoCode: promoCode || '',
        discountAmount: discountAmount.toString(),
        fullName: fullName || '',
        utmSource: utmSource || '',
        utmCampaign: utmCampaign || '',
        utmMedium: utmMedium || '',
        type: 'diy',
        timestamp: new Date().toISOString()
      },
      allow_promotion_codes: false, // We handle our own promo codes
      billing_address_collection: 'auto',
      shipping_address_collection: {
        allowed_countries: ['US']
      },
      phone_number_collection: {
        enabled: true
      },
      expires_at: Math.floor(Date.now() / 1000) + (30 * 60), // 30 minutes
    });

    console.log(`✅ Stripe checkout session created: ${session.id} for $${finalAmount}`);

    // 📊 TRACK ANALYTICS & CONVERSIONS
    const analyticsData = {
      event: 'checkout_initiated',
      email: email || 'anonymous',
      product: 'diy',
      originalAmount: basePrice,
      finalAmount,
      discountAmount,
      promoCode: promoCode || null,
      sessionId: session.id,
      timestamp: new Date().toISOString(),
      utmSource: utmSource || null,
      utmCampaign: utmCampaign || null,
      utmMedium: utmMedium || null
    };

    console.log(`📊 Analytics tracked:`, analyticsData);

    // 🚀 TRIGGER N8N AUTOMATION (Purchase Intent)
    try {
      if (process.env.N8N_WEBHOOK_URL) {
        await fetch(process.env.N8N_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'purchase_intent',
            email: email || 'anonymous',
            product: 'diy',
            amount: finalAmount,
            sessionId: session.id,
            timestamp: new Date().toISOString(),
            leadId
          })
        });
        console.log('🔗 n8n purchase intent webhook triggered');
      }
    } catch (webhookError) {
      console.error('❌ n8n webhook failed:', webhookError);
      // Don't fail checkout if webhook fails
    }

    return NextResponse.json({
      url: session.url,
      sessionId: session.id,
      amount: finalAmount,
      originalAmount: basePrice,
      discountAmount,
      appliedPromoCode,
      expiresAt: session.expires_at
    });

  } catch (error) {
    console.error('❌ DIY Checkout error:', error);
    
    return NextResponse.json({
      error: 'Failed to create checkout session',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  // Handle direct GET requests to checkout
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email');
  const promoCode = searchParams.get('promo');
  const leadId = searchParams.get('leadId');
  
  // Redirect to POST with default values
  try {
    const response = await fetch(`${req.nextUrl.origin}/api/checkout/diy`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email || '',
        promoCode: promoCode || '',
        leadId: leadId || '',
        fullName: '',
        utmSource: searchParams.get('utm_source') || '',
        utmCampaign: searchParams.get('utm_campaign') || '',
        utmMedium: searchParams.get('utm_medium') || ''
      })
    });
    
    const data = await response.json();
    
    if (data.url) {
      return NextResponse.redirect(data.url, 303);
    } else {
      throw new Error(data.error || 'Checkout creation failed');
    }
    
  } catch (error) {
    console.error('❌ GET checkout redirect failed:', error);
    
    // Fallback to checkout page with error
    const errorUrl = new URL('/checkout/diy', req.nextUrl.origin);
    errorUrl.searchParams.set('error', 'checkout_failed');
    
    return NextResponse.redirect(errorUrl, 303);
  }
} 