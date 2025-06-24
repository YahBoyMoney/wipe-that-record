import { NextResponse } from 'next/server';
import payload from 'payload';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Payload should already be initialized in production

    // Fetch leads with error handling
    let leadsRes;
    try {
      leadsRes = await payload.find({ 
        collection: 'leads', 
        limit: 1000, 
        depth: 0,
        sort: '-createdAt'
      });
    } catch (dbError) {
      console.error('Database query error:', dbError);
      return NextResponse.json({
        error: 'Database connection failed',
        details: dbError instanceof Error ? dbError.message : 'Unknown database error'
      }, { status: 500 });
    }

    const leads = leadsRes?.docs || [];
    console.log(`Found ${leads.length} leads`);
    
    // Handle empty database gracefully
    if (leads.length === 0) {
      return NextResponse.json({
        overview: {
          totalLeads: 0,
          totalRevenue: 0,
          averageOrderValue: 0,
          conversionRate: 0,
          todayLeads: 0,
          todayRevenue: 0,
          yesterdayLeads: 0,
          yesterdayRevenue: 0,
          weekLeads: 0,
          weekRevenue: 0,
          monthLeads: 0,
          monthRevenue: 0
        },
        funnel: {
          leads: 0,
          diyPurchases: 0,
          reviewUpgrades: 0,
          fullServiceUpgrades: 0,
          conversionRates: {
            leadToDiy: 0,
            diyToReview: 0,
            diyToFull: 0
          }
        },
        sources: {
          breakdown: {},
          revenue: {}
        },
        trends: {
          daily: [],
          avgUpgradeTime: 0
        },
        devices: {},
        email: {
          totalSent: 0,
          delivered: 0,
          failed: 0,
          pending: 0
        },
        campaigns: {},
        highValueLeads: [],
        performance: {
          todayVsYesterday: {
            leads: 0,
            revenue: 0
          },
          weekOverWeek: {
            leads: 0,
            revenue: 0
          }
        }
      });
    }
    
    // Calculate time-based metrics
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);
    const lastMonth = new Date(today);
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    
    // Filter leads by time periods with safe date parsing
    const todayLeads = leads.filter(l => {
      try {
        return l.createdAt && new Date(l.createdAt) >= today;
      } catch { return false; }
    });
    const yesterdayLeads = leads.filter(l => {
      try {
        const date = new Date(l.createdAt);
        return l.createdAt && date >= yesterday && date < today;
      } catch { return false; }
    });
    const weekLeads = leads.filter(l => {
      try {
        return l.createdAt && new Date(l.createdAt) >= lastWeek;
      } catch { return false; }
    });
    const monthLeads = leads.filter(l => {
      try {
        return l.createdAt && new Date(l.createdAt) >= lastMonth;
      } catch { return false; }
    });
    
         // Basic metrics with safe calculations
     const totalLeads = leadsRes.totalDocs || leads.length;
     const totalRevenue = leads.reduce((sum, l) => {
       const revenue = (typeof l.totalRevenue === 'string' ? parseFloat(l.totalRevenue) : l.totalRevenue) || 
                      (typeof l.amount === 'string' ? parseFloat(l.amount) : l.amount) || 0;
       return sum + (isNaN(revenue) ? 0 : revenue);
     }, 0);
     const averageOrderValue = totalLeads > 0 ? (totalRevenue / totalLeads) : 0;
     
     // Conversion funnel with safe filtering
     const leadCount = leads.length;
     const diyCount = leads.filter(l => 
       l.conversionStage === 'diy_purchased' || 
       l.paid === true
     ).length;
     const reviewCount = leads.filter(l => 
       l.conversionStage === 'review_upgrade' || 
       l.lookup === true
     ).length;
     const fullCount = leads.filter(l => 
       l.conversionStage === 'full_service' || 
       l.fullService === true
     ).length;
    
    // Lead source analysis
    const sourceBreakdown = leads.reduce((acc, lead) => {
      const source = lead.source || 'direct';
      acc[source] = (acc[source] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
         // Email performance with safe filtering
     const emailMetrics = {
       totalSent: leads.reduce((sum, l) => {
         const sent = typeof l.emailsSent === 'string' ? parseInt(l.emailsSent) : l.emailsSent;
         return sum + (sent || 0);
       }, 0),
       delivered: leads.filter(l => l.emailStatus === 'delivered').length,
       failed: leads.filter(l => l.emailStatus === 'failed').length,
       pending: leads.filter(l => l.emailStatus === 'sent').length
     };
     
     // Recent high-value leads with safe data handling
     const highValueLeads = leads
       .filter(l => {
         const revenue = (typeof l.totalRevenue === 'string' ? parseFloat(l.totalRevenue) : l.totalRevenue) || 
                        (typeof l.amount === 'string' ? parseFloat(l.amount) : l.amount) || 0;
         return !isNaN(revenue) && revenue >= 100;
       })
       .sort((a, b) => {
         try {
           return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
         } catch {
           return 0;
         }
       })
       .slice(0, 10)
       .map(l => ({
         id: l.id,
         email: l.email || 'N/A',
         name: (l.first && l.last) ? `${l.first} ${l.last}` : (l.first || l.email || 'Anonymous'),
         revenue: (typeof l.totalRevenue === 'string' ? parseFloat(l.totalRevenue) : l.totalRevenue) || 
                 (typeof l.amount === 'string' ? parseFloat(l.amount) : l.amount) || 0,
         stage: l.conversionStage || 'lead',
         source: l.source || 'direct',
         createdAt: l.createdAt
       }));
     
     // Performance comparisons with safe calculations
     const todayRevenue = todayLeads.reduce((sum, l) => {
       const revenue = (typeof l.totalRevenue === 'string' ? parseFloat(l.totalRevenue) : l.totalRevenue) || 
                      (typeof l.amount === 'string' ? parseFloat(l.amount) : l.amount) || 0;
       return sum + (isNaN(revenue) ? 0 : revenue);
     }, 0);
     const yesterdayRevenue = yesterdayLeads.reduce((sum, l) => {
       const revenue = (typeof l.totalRevenue === 'string' ? parseFloat(l.totalRevenue) : l.totalRevenue) || 
                      (typeof l.amount === 'string' ? parseFloat(l.amount) : l.amount) || 0;
       return sum + (isNaN(revenue) ? 0 : revenue);
     }, 0);
     const weekRevenue = weekLeads.reduce((sum, l) => {
       const revenue = (typeof l.totalRevenue === 'string' ? parseFloat(l.totalRevenue) : l.totalRevenue) || 
                      (typeof l.amount === 'string' ? parseFloat(l.amount) : l.amount) || 0;
       return sum + (isNaN(revenue) ? 0 : revenue);
     }, 0);
     const monthRevenue = monthLeads.reduce((sum, l) => {
       const revenue = (typeof l.totalRevenue === 'string' ? parseFloat(l.totalRevenue) : l.totalRevenue) || 
                      (typeof l.amount === 'string' ? parseFloat(l.amount) : l.amount) || 0;
       return sum + (isNaN(revenue) ? 0 : revenue);
     }, 0);
    
    return NextResponse.json({
      overview: {
        totalLeads,
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        averageOrderValue: Math.round(averageOrderValue * 100) / 100,
        conversionRate: totalLeads > 0 ? Math.round(((diyCount / totalLeads) * 100) * 100) / 100 : 0,
        todayLeads: todayLeads.length,
        todayRevenue: Math.round(todayRevenue * 100) / 100,
        yesterdayLeads: yesterdayLeads.length,
        yesterdayRevenue: Math.round(yesterdayRevenue * 100) / 100,
        weekLeads: weekLeads.length,
        weekRevenue: Math.round(weekRevenue * 100) / 100,
        monthLeads: monthLeads.length,
        monthRevenue: Math.round(monthRevenue * 100) / 100
      },
      funnel: {
        leads: leadCount,
        diyPurchases: diyCount,
        reviewUpgrades: reviewCount,
        fullServiceUpgrades: fullCount,
        conversionRates: {
          leadToDiy: leadCount > 0 ? Math.round(((diyCount / leadCount) * 100) * 100) / 100 : 0,
          diyToReview: diyCount > 0 ? Math.round(((reviewCount / diyCount) * 100) * 100) / 100 : 0,
          diyToFull: diyCount > 0 ? Math.round(((fullCount / diyCount) * 100) * 100) / 100 : 0
        }
      },
      sources: {
        breakdown: sourceBreakdown,
        revenue: {}
      },
      email: emailMetrics,
      highValueLeads,
      performance: {
        todayVsYesterday: {
          leads: todayLeads.length - yesterdayLeads.length,
          revenue: Math.round((todayRevenue - yesterdayRevenue) * 100) / 100
        },
        weekOverWeek: {
          leads: weekLeads.length,
          revenue: Math.round(weekRevenue * 100) / 100
        }
      }
    });
  } catch (error) {
    console.error('Analytics API Error:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch analytics',
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.stack : undefined) : undefined
    }, { status: 500 });
  }
} 