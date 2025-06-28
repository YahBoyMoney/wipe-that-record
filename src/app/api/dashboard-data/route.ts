import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Mock data for the professional dashboard
    const dashboardData = {
      kpis: [
        {
          title: 'Total Revenue',
          value: '$45,231',
          change: '+20.1%',
          changeType: 'increase',
          icon: 'currency'
        },
        {
          title: 'Orders',
          value: '1,234',
          change: '+15%',
          changeType: 'increase',
          icon: 'shopping'
        },
        {
          title: 'Customers',
          value: '2,432',
          change: '+12%',
          changeType: 'increase',
          icon: 'users'
        },
        {
          title: 'Conversion Rate',
          value: '3.24%',
          change: '+0.5%',
          changeType: 'increase',
          icon: 'chart'
        }
      ],
      revenueData: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
          label: 'Revenue',
          data: [12000, 19000, 15000, 25000, 32000, 45000],
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.4
        }]
      },
      ordersData: {
        labels: ['DIY Kit', 'Review Service', 'Full Service', 'Consultation'],
        datasets: [{
          data: [45, 25, 20, 10],
          backgroundColor: [
            'rgba(59, 130, 246, 0.8)',
            'rgba(16, 185, 129, 0.8)',
            'rgba(245, 158, 11, 0.8)',
            'rgba(239, 68, 68, 0.8)'
          ]
        }]
      },
      recentOrders: [
        {
          id: 'WR-001',
          customer: 'John Smith',
          service: 'Full Service Expungement',
          amount: '$1,500',
          status: 'processing',
          date: '2024-06-28'
        },
        {
          id: 'WR-002',
          customer: 'Sarah Johnson',
          service: 'DIY Kit',
          amount: '$50',
          status: 'completed',
          date: '2024-06-27'
        },
        {
          id: 'WR-003',
          customer: 'Mike Davis',
          service: 'Review Service',
          amount: '$100',
          status: 'pending',
          date: '2024-06-27'
        }
      ],
      recentActivity: [
        {
          type: 'order',
          message: 'New order from John Smith',
          time: '2 hours ago'
        },
        {
          type: 'payment',
          message: 'Payment received for WR-002',
          time: '4 hours ago'
        },
        {
          type: 'customer',
          message: 'New customer registration',
          time: '6 hours ago'
        }
      ]
    };

    return NextResponse.json(dashboardData);
  } catch (error) {
    console.error('Dashboard data error:', error);
    return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 });
  }
}