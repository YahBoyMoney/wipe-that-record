import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import payload from 'payload';

export async function POST(req: NextRequest) {
  const sig  = req.headers.get('stripe-signature') as string;
  const body = await req.text();

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (e) {
    return NextResponse.json({ error: 'Signature error' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const s = event.data.object as any;

    // Handle different payment types
    if (s.metadata.type === 'diy') {
      // Initial DIY payment with analytics data
      await payload.create({
        collection: 'leads',
        data: {
          email: s.customer_details.email,
          first: s.metadata.first,
          last: s.metadata.last,
          amount: s.amount_total / 100,
          paid: true,
          stripeSessionId: s.id,
          
          // Analytics data from Stripe metadata
          source: s.metadata.source || 'direct',
          utmCampaign: s.metadata.utm_campaign,
          utmSource: s.metadata.utm_source,
          utmMedium: s.metadata.utm_medium,
          deviceType: s.metadata.device_type,
          timeOnSite: s.metadata.time_on_site,
          pagesViewed: s.metadata.pages_viewed ? parseInt(s.metadata.pages_viewed) : undefined,
          
          // Set initial analytics values
          conversionStage: 'diy_purchased',
          totalRevenue: s.amount_total / 100,
          emailStatus: 'not_sent',
          emailsSent: 0,
        },
      });
      
      console.log(`💰 DIY purchase: ${s.customer_details.email} - $${s.amount_total / 100}`);
      
      // Send admin notification
      try {
        const { notifyPurchase } = await import('@/lib/notifications');
        await notifyPurchase({
          email: s.customer_details.email,
          fullName: `${s.metadata.first || ''} ${s.metadata.last || ''}`.trim(),
          amount: s.amount_total / 100,
          product: 'DIY Package',
          stripeSessionId: s.id
        });
      } catch (error) {
        console.error('❌ Failed to send purchase notification:', error);
      }
      
      return NextResponse.json({ ok: true });
      
    } else if (s.metadata.type === 'upgrade') {
      // Upgrade payment - create a new lead record for the upgrade
      const upgradeType = s.metadata.upgradeType;
      
      await payload.create({
        collection: 'leads',
        data: {
          first: s.customer_details.name?.split(' ')[0] || 'Customer',
          last: s.customer_details.name?.split(' ').slice(1).join(' ') || '',
          email: s.customer_details.email,
          amount: s.amount_total / 100,
          paid: true,
          stripeSessionId: s.id,
          lookup: upgradeType === 'review',
          fullService: upgradeType === 'full',
          
          // Analytics data
          source: s.metadata.source || 'upgrade_flow',
          conversionStage: upgradeType === 'review' ? 'review_upgrade' : 'full_service',
          upgradeType: upgradeType,
          totalRevenue: s.amount_total / 100,
          emailStatus: 'not_sent',
          emailsSent: 0,
        },
      });
      
      console.log(`🚀 ${upgradeType} upgrade: ${s.customer_details.email} - $${s.amount_total / 100}`);
      return NextResponse.json({ ok: true });
    }

    // Legacy handling for old structure
    if (!s.metadata.upgrade) {
      await payload.create({
        collection: 'leads',
        data: {
          email: s.customer_details.email,
          first: s.metadata.first,
          last:  s.metadata.last,
          amount: s.amount_total / 100,
          paid:  true,
          stripeSessionId: s.id,
        },
      });
      return NextResponse.json({ ok: true });
    }

    // Legacy upgrade handling
    const parent = s.metadata.parent;
    const update: Record<string, any> = {};
    if (s.metadata.upgrade === 'lookup')     update.lookup = true;
    if (s.metadata.upgrade === 'full')       update.fullService = true;

    await payload.update({
      collection: 'leads',
      where: { stripeSessionId: { equals: parent } },
      data: update,
    });

    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ received: true });
} 