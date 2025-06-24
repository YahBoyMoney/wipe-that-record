import { NextRequest, NextResponse } from 'next/server';
import payload from 'payload';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  // Fetch all leads (you can paginate for >10k)
  const leadsRes = await payload.find({ collection: 'leads', limit: 1000, depth: 0 });
  const leads = leadsRes.docs as any[];

  /* ────────── aggregate ────────── */
  const totalLeads = leadsRes.totalDocs;
  let totalRevenue = 0;
  let diy = 0;
  let review = 0;
  let full = 0;

  leads.forEach((l) => {
    totalRevenue += l.amount || 0;
    switch (l.conversionStage) {
      case 'diy_purchased':
        diy += 1;
        break;
      case 'review_upgrade':
        review += 1;
        break;
      case 'full_service':
        full += 1;
        break;
      default:
        break;
    }
  });

  const overview = {
    totalLeads,
    totalRevenue,
    averageOrderValue: totalLeads ? (totalRevenue / totalLeads).toFixed(2) : '0',
    conversionRates: {
      leadToDiy: totalLeads ? ((diy / totalLeads) * 100).toFixed(1) : '0',
      diyToReview: diy ? ((review / diy) * 100).toFixed(1) : '0',
      diyToFull: diy ? ((full / diy) * 100).toFixed(1) : '0',
    },
  };

  return NextResponse.json({
    overview,
    funnel: {
      leads: totalLeads,
      diyPurchases: diy,
      reviewUpgrades: review,
      fullServiceUpgrades: full,
    },
  });
} 