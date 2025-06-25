import { NextRequest, NextResponse } from 'next/server';
import { getPayload } from 'payload';
import config from '../../../../payload.config';

export async function GET(req: NextRequest) {
  try {
    console.log('📊 Fetching comprehensive analytics data...');
    
    const payload = await getPayload({ config });
    
    // Get all leads for analysis
    const allLeads = await payload.find({
      collection: 'leads',
      limit: 10000, // Get all leads
      sort: '-createdAt',
    });

    const leads = allLeads.docs;
    console.log(`📈 Analyzing ${leads.length} leads...`);

    // Date calculations
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Filter leads by time periods
    const todayLeads = leads.filter(lead => new Date(lead.createdAt) >= today);
    const yesterdayLeads = leads.filter(lead => {
      const date = new Date(lead.createdAt);
      return date >= yesterday && date < today;
    });
    const weekLeads = leads.filter(lead => new Date(lead.createdAt) >= weekAgo);
    const monthLeads = leads.filter(lead => new Date(lead.createdAt) >= monthAgo);

    // Revenue calculations
    const totalRevenue = leads.reduce((sum, lead) => sum + (lead.totalRevenue || 0), 0);
    const todayRevenue = todayLeads.reduce((sum, lead) => sum + (lead.totalRevenue || 0), 0);
    const yesterdayRevenue = yesterdayLeads.reduce((sum, lead) => sum + (lead.totalRevenue || 0), 0);
    const weekRevenue = weekLeads.reduce((sum, lead) => sum + (lead.totalRevenue || 0), 0);
    const monthRevenue = monthLeads.reduce((sum, lead) => sum + (lead.totalRevenue || 0), 0);

    // Conversion calculations
    const paidLeads = leads.filter(lead => lead.paid);
    const conversionRate = leads.length > 0 ? ((paidLeads.length / leads.length) * 100).toFixed(1) : '0';
    const averageOrderValue = paidLeads.length > 0 ? Math.round(totalRevenue / paidLeads.length) : 0;

    // Funnel analysis
    const leadCount = leads.length;
    const diyPurchases = leads.filter(lead => lead.conversionStage === 'diy_purchased' || lead.paid).length;
    const reviewUpgrades = leads.filter(lead => lead.conversionStage === 'review_upgrade' || lead.lookup).length;
    const fullServiceUpgrades = leads.filter(lead => lead.conversionStage === 'full_service' || lead.fullService).length;

    // Source breakdown
    const sourceBreakdown = leads.reduce((acc, lead) => {
      const source = lead.source || 'unknown';
      acc[source] = (acc[source] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Device breakdown
    const deviceBreakdown = leads.reduce((acc, lead) => {
      const device = lead.deviceType || 'unknown';
      acc[device] = (acc[device] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Conviction type breakdown
    const convictionBreakdown = leads.reduce((acc, lead) => {
      const type = lead.convictionType || 'unknown';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Lead score analysis
    const leadScores = leads.filter(lead => lead.leadScore).map(lead => lead.leadScore!);
    const avgLeadScore = leadScores.length > 0 ? Math.round(leadScores.reduce((sum, score) => sum + score, 0) / leadScores.length) : 0;
    const highQualityLeads = leads.filter(lead => (lead.leadScore || 0) >= 60).length;

    // Daily trends (last 7 days)
    const dailyTrends = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
      const nextDate = new Date(date.getTime() + 24 * 60 * 60 * 1000);
      
      const dayLeads = leads.filter(lead => {
        const leadDate = new Date(lead.createdAt);
        return leadDate >= date && leadDate < nextDate;
      });
      
      const dayRevenue = dayLeads.reduce((sum, lead) => sum + (lead.totalRevenue || 0), 0);
      
      dailyTrends.push({
        date: date.toISOString(),
        leads: dayLeads.length,
        revenue: dayRevenue,
        conversions: dayLeads.filter(lead => lead.paid).length,
      });
    }

    // Email performance
    const emailStats = {
      totalSent: leads.filter(lead => lead.emailStatus === 'sent' || lead.emailStatus === 'delivered').length,
      delivered: leads.filter(lead => lead.emailStatus === 'delivered').length,
      pending: leads.filter(lead => lead.emailStatus === 'not_sent').length,
      failed: leads.filter(lead => lead.emailStatus === 'failed').length,
    };

    // Campaign analysis
    const campaigns = leads.reduce((acc, lead) => {
      if (lead.utmCampaign) {
        if (!acc[lead.utmCampaign]) {
          acc[lead.utmCampaign] = { leads: 0, conversions: 0, revenue: 0 };
        }
        acc[lead.utmCampaign].leads++;
        if (lead.paid) {
          acc[lead.utmCampaign].conversions++;
          acc[lead.utmCampaign].revenue += lead.totalRevenue || 0;
        }
      }
      return acc;
    }, {} as Record<string, { leads: number; conversions: number; revenue: number }>);

    // High value leads (recent)
    const highValueLeads = leads
      .filter(lead => (lead.totalRevenue || 0) >= 100)
      .slice(0, 10)
      .map(lead => ({
        id: lead.id,
        name: `${lead.first || ''} ${lead.last || ''}`.trim() || 'Anonymous',
        email: lead.email,
        revenue: lead.totalRevenue || 0,
        stage: lead.conversionStage || 'lead',
        source: lead.source || 'unknown',
        convictionType: lead.convictionType || 'unknown',
        leadScore: lead.leadScore || 0,
        createdAt: lead.createdAt,
      }));

    // Urgency analysis
    const urgencyBreakdown = leads.reduce((acc, lead) => {
      const urgency = lead.urgency || 'unknown';
      acc[urgency] = (acc[urgency] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Budget analysis
    const budgetBreakdown = leads.reduce((acc, lead) => {
      const budget = lead.budget || 'unknown';
      acc[budget] = (acc[budget] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

         // Geographic analysis (by state/city)
     const geographicBreakdown = leads.reduce((acc, lead) => {
       if ((lead as any).city && (lead as any).state) {
         const location = `${(lead as any).city}, ${(lead as any).state}`;
         acc[location] = (acc[location] || 0) + 1;
       }
       return acc;
     }, {} as Record<string, number>);

    // Conversion timing analysis
    const upgradeTimings = leads
      .filter(lead => lead.timeToUpgrade && lead.timeToUpgrade > 0)
      .map(lead => lead.timeToUpgrade!);
    const avgUpgradeTime = upgradeTimings.length > 0 
      ? Math.round(upgradeTimings.reduce((sum, time) => sum + time, 0) / upgradeTimings.length) 
      : 0;

    // Lead quality distribution
    const leadQualityDistribution = {
      hot: leads.filter(lead => lead.leadSegment === 'hot').length,
      warm: leads.filter(lead => lead.leadSegment === 'warm').length,
      lukewarm: leads.filter(lead => lead.leadSegment === 'lukewarm').length,
      cold: leads.filter(lead => lead.leadSegment === 'cold').length,
    };

    // Monthly revenue trend (last 6 months)
    const monthlyRevenue = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const nextMonth = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
      
      const monthLeads = leads.filter(lead => {
        const leadDate = new Date(lead.createdAt);
        return leadDate >= date && leadDate < nextMonth;
      });
      
      const monthRev = monthLeads.reduce((sum, lead) => sum + (lead.totalRevenue || 0), 0);
      
      monthlyRevenue.push({
        month: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        revenue: monthRev,
        leads: monthLeads.length,
        conversions: monthLeads.filter(lead => lead.paid).length,
      });
    }

    // Performance metrics
    const performance = {
      todayVsYesterday: {
        leads: todayLeads.length - yesterdayLeads.length,
        revenue: todayRevenue - yesterdayRevenue,
      },
      weekOverWeek: {
        leads: weekLeads.length,
        revenue: weekRevenue,
      },
      monthOverMonth: {
        leads: monthLeads.length,
        revenue: monthRevenue,
      },
    };

    // Comprehensive analytics response
    const analyticsData = {
      overview: {
        totalLeads: leads.length,
        totalRevenue,
        conversionRate: parseFloat(conversionRate),
        averageOrderValue,
        todayLeads: todayLeads.length,
        todayRevenue,
        weekLeads: weekLeads.length,
        weekRevenue,
        monthLeads: monthLeads.length,
        monthRevenue,
        avgLeadScore,
        highQualityLeads,
      },
      funnel: {
        leads: leadCount,
        diyPurchases,
        reviewUpgrades,
        fullServiceUpgrades,
        conversionRates: {
          leadToDiy: leadCount > 0 ? ((diyPurchases / leadCount) * 100).toFixed(1) : '0',
          diyToReview: diyPurchases > 0 ? ((reviewUpgrades / diyPurchases) * 100).toFixed(1) : '0',
          diyToFull: diyPurchases > 0 ? ((fullServiceUpgrades / diyPurchases) * 100).toFixed(1) : '0',
        },
      },
      sources: {
        breakdown: sourceBreakdown,
        top: Object.entries(sourceBreakdown)
          .sort(([,a], [,b]) => b - a)
          .slice(0, 5)
          .map(([source, count]) => ({ source, count })),
      },
      devices: deviceBreakdown,
      convictions: convictionBreakdown,
      urgency: urgencyBreakdown,
      budget: budgetBreakdown,
      geographic: Object.entries(geographicBreakdown)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10)
        .map(([location, count]) => ({ location, count })),
      trends: {
        daily: dailyTrends,
        monthly: monthlyRevenue,
        avgUpgradeTime,
      },
      email: emailStats,
      campaigns,
      highValueLeads,
      leadQuality: leadQualityDistribution,
      performance,
    };

    console.log('✅ Comprehensive analytics data compiled');
    return NextResponse.json(analyticsData);

  } catch (error) {
    console.error('❌ Error fetching analytics:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch analytics',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 