import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Mock customer data
    const customers = [
      {
        id: '1',
        name: 'John Smith',
        email: 'john.smith@email.com',
        phone: '(555) 123-4567',
        status: 'active',
        totalOrders: 3,
        totalSpent: 1650,
        lastOrderDate: '2024-06-25T10:30:00Z',
        registrationDate: '2024-01-15T14:20:00Z',
        leadSource: 'Google Ads',
        leadScore: 85,
        tags: ['DUI', 'Urgent', 'High Value']
      },
      {
        id: '2',
        name: 'Sarah Johnson',
        email: 'sarah.j@email.com',
        phone: '(555) 987-6543',
        status: 'vip',
        totalOrders: 8,
        totalSpent: 3200,
        lastOrderDate: '2024-06-27T09:15:00Z',
        registrationDate: '2023-08-10T11:45:00Z',
        leadSource: 'Referral',
        leadScore: 95,
        tags: ['VIP', 'Referrer', 'Multiple Cases']
      },
      {
        id: '3',
        name: 'Michael Brown',
        email: 'mike.brown@email.com',
        status: 'lead',
        totalOrders: 0,
        totalSpent: 0,
        registrationDate: '2024-06-27T08:45:00Z',
        leadSource: 'Facebook',
        leadScore: 45,
        tags: ['New Lead', 'Price Sensitive']
      }
    ];

    return NextResponse.json({ customers, total: customers.length });
  } catch (error) {
    console.error('Customers API error:', error);
    return NextResponse.json({ error: 'Failed to fetch customers' }, { status: 500 });
  }
}