import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../../lib/supabase';

export async function GET(req: NextRequest) {
  try {
    // Fetch all leads
    const { data: leads, error: leadsError } = await supabase
      .from('leads')
      .select('*');

    if (leadsError) throw leadsError;

    // Fetch all orders
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('*');

    if (ordersError) throw ordersError;

    // Fetch all cases
    const { data: cases, error: casesError } = await supabase
      .from('case_tracking')
      .select('*');

    if (casesError) throw casesError;

    // Calculate statistics
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);

    // Today's leads
    const todayLeads = leads?.filter(lead => 
      new Date(lead.created_at) >= today
    ).length || 0;

    // This week's leads
    const weekLeads = leads?.filter(lead => 
      new Date(lead.created_at) >= weekAgo
    ).length || 0;

    // Hot leads (score >= 75)
    const hotLeads = leads?.filter(lead => 
      lead.eligibility_score >= 75
    ).length || 0;

    // Warm leads (score 50-74)
    const warmLeads = leads?.filter(lead => 
      lead.eligibility_score >= 50 && lead.eligibility_score < 75
    ).length || 0;

    // Revenue calculations
    const totalRevenue = orders?.reduce((sum, order) => 
      sum + (parseFloat(order.amount) || 0), 0
    ) || 0;

    const weekRevenue = orders?.filter(order => 
      new Date(order.created_at) >= weekAgo
    ).reduce((sum, order) => sum + (parseFloat(order.amount) || 0), 0) || 0;

    const monthRevenue = orders?.filter(order => 
      new Date(order.created_at) >= monthAgo
    ).reduce((sum, order) => sum + (parseFloat(order.amount) || 0), 0) || 0;

    // Conversion metrics
    const convertedLeads = leads?.filter(lead => 
      lead.conversion_stage === 'converted'
    ).length || 0;
    
    const conversionRate = leads && leads.length > 0 
      ? (convertedLeads / leads.length) * 100 
      : 0;

    // Case metrics
    const activeCases = cases?.filter(c => 
      !['completed', 'denied'].includes(c.status)
    ).length || 0;

    const completedCases = cases?.filter(c => 
      c.status === 'completed'
    ).length || 0;

    const pendingCases = cases?.filter(c => 
      c.status === 'pending_review'
    ).length || 0;

    // Lead source analysis
    const leadSources = leads?.reduce((acc, lead) => {
      acc[lead.lead_source] = (acc[lead.lead_source] || 0) + 1;
      return acc;
    }, {} as Record<string, number>) || {};

    // Service type distribution
    const serviceTypes = {
      diy: leads?.filter(l => l.recommended_service === 'diy').length || 0,
      professional: leads?.filter(l => l.recommended_service === 'professional').length || 0,
      attorney: leads?.filter(l => l.recommended_service === 'attorney').length || 0
    };

    // Geographic distribution (top cities)
    const cityDistribution = leads?.reduce((acc, lead) => {
      if (lead.city) {
        acc[lead.city] = (acc[lead.city] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>) || {};

    const topCities = Object.entries(cityDistribution)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([city, count]) => ({ city, count }));

    // Average metrics
    const avgLeadScore = leads && leads.length > 0
      ? leads.reduce((sum, lead) => sum + (lead.eligibility_score || 0), 0) / leads.length
      : 0;

    const avgOrderValue = orders && orders.length > 0
      ? totalRevenue / orders.length
      : 0;

    // Response
    return NextResponse.json({
      success: true,
      data: {
        overview: {
          totalLeads: leads?.length || 0,
          todayLeads,
          weekLeads,
          hotLeads,
          warmLeads,
          totalRevenue,
          weekRevenue,
          monthRevenue,
          conversionRate,
          convertedLeads,
          avgLeadScore,
          avgOrderValue
        },
        cases: {
          total: cases?.length || 0,
          active: activeCases,
          completed: completedCases,
          pending: pendingCases
        },
        orders: {
          total: orders?.length || 0,
          totalValue: totalRevenue,
          avgValue: avgOrderValue
        },
        analytics: {
          leadSources,
          serviceTypes,
          topCities,
          conversionFunnel: {
            leads: leads?.length || 0,
            qualified: leads?.filter(l => l.conversion_stage === 'qualified_lead').length || 0,
            contacted: leads?.filter(l => l.conversion_stage === 'contacted').length || 0,
            quoted: leads?.filter(l => l.conversion_stage === 'quoted').length || 0,
            converted: convertedLeads
          }
        },
        recentActivity: {
          recentLeads: leads?.slice(0, 5).map(lead => ({
            id: lead.id,
            name: `${lead.first_name} ${lead.last_name}`,
            email: lead.email,
            score: lead.eligibility_score,
            created: lead.created_at
          })) || [],
          recentOrders: orders?.slice(0, 5).map(order => ({
            id: order.id,
            orderNumber: order.order_number,
            amount: order.amount,
            status: order.status,
            created: order.created_at
          })) || [],
          recentCases: cases?.slice(0, 5).map(case_ => ({
            id: case_.id,
            caseNumber: case_.case_number,
            status: case_.status,
            serviceType: case_.service_type,
            created: case_.created_at
          })) || []
        }
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Admin stats error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch admin statistics',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// Real-time stats update endpoint
export async function POST(req: NextRequest) {
  try {
    const { type, data } = await req.json();

    // Log the event for analytics
    await supabase.from('admin_activity').insert({
      event_type: type,
      event_data: data,
      timestamp: new Date().toISOString()
    });

    return NextResponse.json({
      success: true,
      message: `Event ${type} logged successfully`
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to log activity'
    }, { status: 500 });
  }
}