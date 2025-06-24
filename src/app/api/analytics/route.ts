import { NextRequest, NextResponse } from 'next/server';
import payload from 'payload';

export async function GET(req: NextRequest) {
  try {
    // Get all leads
    const allLeads = await payload.find({
      collection: 'leads',
      limit: 10000,
    });

    const leads = allLeads.docs;
    
    // Calculate basic metrics
    const totalLeads = leads.length;
    const paidLeads = leads.filter(lead => lead.paid);
    const diyPurchases = paidLeads.filter(lead => 
      lead.conversionStage === 'diy_purchased' || 
      lead.conversionStage === 'review_upgrade' || 
      lead.conversionStage === 'full_service'
    );
    const reviewUpgrades = leads.filter(lead => lead.conversionStage === 'review_upgrade');
    const fullServiceUpgrades = leads.filter(lead => lead.conversionStage === 'full_service');
    
    const totalRevenue = leads.reduce((sum, lead) => sum + (lead.totalRevenue || 0), 0);
    
    // Calculate conversion rates
    const conversionRates = {
      leadToDiy: totalLeads > 0 ? (diyPurchases.length / totalLeads * 100).toFixed(1) : '0',
      diyToReview: diyPurchases.length > 0 ? (reviewUpgrades.length / diyPurchases.length * 100).toFixed(1) : '0',
      diyToFull: diyPurchases.length > 0 ? (fullServiceUpgrades.length / diyPurchases.length * 100).toFixed(1) : '0',
    };

    // Revenue by source
    const revenueBySource: { [key: string]: number } = {};
    paidLeads.forEach(lead => {
      const source = lead.source || 'direct';
      revenueBySource[source] = (revenueBySource[source] || 0) + (lead.totalRevenue || 0);
    });

    // Email analytics
    const emailStats = {
      totalSent: leads.reduce((sum, lead) => sum + (lead.emailsSent || 0), 0),
      byStatus: leads.reduce((acc: { [key: string]: number }, lead) => {
        const status = lead.emailStatus || 'not_sent';
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {}),
    };

    const analytics = {
      overview: {
        totalLeads,
        totalRevenue,
        averageOrderValue: diyPurchases.length > 0 ? (totalRevenue / diyPurchases.length).toFixed(2) : '0',
        conversionRates,
      },
      funnel: {
        leads: totalLeads,
        diyPurchases: diyPurchases.length,
        reviewUpgrades: reviewUpgrades.length,
        fullServiceUpgrades: fullServiceUpgrades.length,
      },
      revenue: {
        total: totalRevenue,
        bySource: Object.entries(revenueBySource).map(([source, revenue]) => ({
          source,
          revenue,
        })).sort((a, b) => b.revenue - a.revenue),
      },
      email: emailStats,
      recent: leads
        .filter(lead => lead.paid)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 10)
        .map(lead => ({
          email: lead.email,
          stage: lead.conversionStage,
          revenue: lead.totalRevenue,
          source: lead.source,
          createdAt: lead.createdAt,
        })),
    };

    return NextResponse.json(analytics);

  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
} 