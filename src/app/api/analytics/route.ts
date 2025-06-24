import { NextResponse } from 'next/server';
import payload from 'payload';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Fetch all leads with full data
    const leadsRes = await payload.find({ 
      collection: 'leads', 
      limit: 1000, 
      depth: 0,
      sort: '-createdAt'
    });
    const leads = leadsRes.docs as any[];
    
    // Calculate time-based metrics
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);
    const lastMonth = new Date(today);
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    
    // Filter leads by time periods
    const todayLeads = leads.filter(l => new Date(l.createdAt) >= today);
    const yesterdayLeads = leads.filter(l => new Date(l.createdAt) >= yesterday && new Date(l.createdAt) < today);
    const weekLeads = leads.filter(l => new Date(l.createdAt) >= lastWeek);
    const monthLeads = leads.filter(l => new Date(l.createdAt) >= lastMonth);
    
    // Basic metrics
    const totalLeads = leadsRes.totalDocs;
    const totalRevenue = leads.reduce((sum, l) => sum + (l.totalRevenue || l.amount || 0), 0);
    const averageOrderValue = totalLeads ? (totalRevenue / totalLeads) : 0;
    
    // Conversion funnel
    const leadCount = leads.length;
    const diyCount = leads.filter(l => l.conversionStage === 'diy_purchased' || l.paid).length;
    const reviewCount = leads.filter(l => l.conversionStage === 'review_upgrade' || l.lookup).length;
    const fullCount = leads.filter(l => l.conversionStage === 'full_service' || l.fullService).length;
    
    // Lead source analysis
    const sourceBreakdown = leads.reduce((acc, lead) => {
      const source = lead.source || 'direct';
      acc[source] = (acc[source] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    // Revenue by source
    const revenueBySource = leads.reduce((acc, lead) => {
      const source = lead.source || 'direct';
      acc[source] = (acc[source] || 0) + (lead.totalRevenue || lead.amount || 0);
      return acc;
    }, {} as Record<string, number>);
    
    // Time-based trends (last 7 days)
    const dailyTrends = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dayStart = new Date(date);
      const dayEnd = new Date(date);
      dayEnd.setDate(dayEnd.getDate() + 1);
      
      const dayLeads = leads.filter(l => {
        const leadDate = new Date(l.createdAt);
        return leadDate >= dayStart && leadDate < dayEnd;
      });
      
      dailyTrends.push({
        date: date.toISOString().split('T')[0],
        leads: dayLeads.length,
        revenue: dayLeads.reduce((sum, l) => sum + (l.totalRevenue || l.amount || 0), 0),
        conversions: dayLeads.filter(l => l.paid).length
      });
    }
    
    // Upgrade timing analysis
    const upgradeTimingData = leads
      .filter(l => l.timeToUpgrade && l.timeToUpgrade > 0)
      .map(l => l.timeToUpgrade);
    
    const avgUpgradeTime = upgradeTimingData.length > 0 
      ? upgradeTimingData.reduce((sum, time) => sum + time, 0) / upgradeTimingData.length 
      : 0;
    
    // Device type breakdown
    const deviceBreakdown = leads.reduce((acc, lead) => {
      const device = lead.deviceType || 'unknown';
      acc[device] = (acc[device] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    // Email performance
    const emailMetrics = {
      totalSent: leads.reduce((sum, l) => sum + (l.emailsSent || 0), 0),
      delivered: leads.filter(l => l.emailStatus === 'delivered').length,
      failed: leads.filter(l => l.emailStatus === 'failed').length,
      pending: leads.filter(l => l.emailStatus === 'sent').length
    };
    
    // Top performing campaigns
    const campaignPerformance = leads
      .filter(l => l.utmCampaign)
      .reduce((acc, lead) => {
        const campaign = lead.utmCampaign;
        if (!acc[campaign]) {
          acc[campaign] = { leads: 0, revenue: 0, conversions: 0 };
        }
        acc[campaign].leads += 1;
        acc[campaign].revenue += (lead.totalRevenue || lead.amount || 0);
        if (lead.paid) acc[campaign].conversions += 1;
        return acc;
      }, {} as Record<string, { leads: number; revenue: number; conversions: number }>);
    
    // Recent high-value leads
    const highValueLeads = leads
      .filter(l => (l.totalRevenue || l.amount || 0) >= 100)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10)
      .map(l => ({
        id: l.id,
        email: l.email,
        name: l.first && l.last ? `${l.first} ${l.last}` : l.first || l.email,
        revenue: l.totalRevenue || l.amount || 0,
        stage: l.conversionStage,
        source: l.source,
        createdAt: l.createdAt
      }));
    
    // Performance comparisons
    const todayRevenue = todayLeads.reduce((sum, l) => sum + (l.totalRevenue || l.amount || 0), 0);
    const yesterdayRevenue = yesterdayLeads.reduce((sum, l) => sum + (l.totalRevenue || l.amount || 0), 0);
    const weekRevenue = weekLeads.reduce((sum, l) => sum + (l.totalRevenue || l.amount || 0), 0);
    const monthRevenue = monthLeads.reduce((sum, l) => sum + (l.totalRevenue || l.amount || 0), 0);
    
    return NextResponse.json({
      overview: {
        totalLeads,
        totalRevenue,
        averageOrderValue: parseFloat(averageOrderValue.toFixed(2)),
        conversionRate: totalLeads > 0 ? parseFloat(((diyCount / totalLeads) * 100).toFixed(2)) : 0,
        todayLeads: todayLeads.length,
        todayRevenue,
        yesterdayLeads: yesterdayLeads.length,
        yesterdayRevenue,
        weekLeads: weekLeads.length,
        weekRevenue,
        monthLeads: monthLeads.length,
        monthRevenue
      },
      funnel: {
        leads: leadCount,
        diyPurchases: diyCount,
        reviewUpgrades: reviewCount,
        fullServiceUpgrades: fullCount,
        conversionRates: {
          leadToDiy: leadCount > 0 ? parseFloat(((diyCount / leadCount) * 100).toFixed(2)) : 0,
          diyToReview: diyCount > 0 ? parseFloat(((reviewCount / diyCount) * 100).toFixed(2)) : 0,
          diyToFull: diyCount > 0 ? parseFloat(((fullCount / diyCount) * 100).toFixed(2)) : 0
        }
      },
      sources: {
        breakdown: sourceBreakdown,
        revenue: revenueBySource
      },
      trends: {
        daily: dailyTrends,
        avgUpgradeTime: parseFloat(avgUpgradeTime.toFixed(2))
      },
      devices: deviceBreakdown,
      email: emailMetrics,
      campaigns: campaignPerformance,
      highValueLeads,
      performance: {
        todayVsYesterday: {
          leads: todayLeads.length - yesterdayLeads.length,
          revenue: todayRevenue - yesterdayRevenue
        },
        weekOverWeek: {
          leads: weekLeads.length,
          revenue: weekRevenue
        }
      }
    });
  } catch (error) {
    console.error('Analytics API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
} 