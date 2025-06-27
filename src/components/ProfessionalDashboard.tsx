'use client';

import React, { useState, useEffect } from 'react';
import { Line, Bar, Doughnut, Area } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import {
  CurrencyDollarIcon,
  ShoppingBagIcon,
  UsersIcon,
  ChartBarIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  EyeIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  PhoneIcon,
  EnvelopeIcon,
} from '@heroicons/react/24/outline';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface KPICardProps {
  title: string;
  value: string;
  change: string;
  changeType: 'increase' | 'decrease' | 'neutral';
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

interface RecentActivity {
  id: string;
  type: 'order' | 'customer' | 'payment' | 'support';
  title: string;
  description: string;
  time: string;
  amount?: string;
  status: 'success' | 'pending' | 'warning' | 'error';
}

interface TopProduct {
  id: string;
  name: string;
  revenue: number;
  orders: number;
  growth: number;
}

const KPICard: React.FC<KPICardProps> = ({ title, value, change, changeType, icon: Icon, color }) => (
  <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
    <div className="p-6">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <div className={`p-3 rounded-lg ${color}`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
        </div>
        <div className="ml-4 flex-1">
          <dl>
            <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
            <dd className="text-2xl font-semibold text-gray-900">{value}</dd>
          </dl>
        </div>
      </div>
      <div className="mt-4 flex items-center">
        {changeType === 'increase' && (
          <ArrowUpIcon className="h-4 w-4 text-green-500 mr-1" />
        )}
        {changeType === 'decrease' && (
          <ArrowDownIcon className="h-4 w-4 text-red-500 mr-1" />
        )}
        <span
          className={`text-sm font-medium ${
            changeType === 'increase'
              ? 'text-green-600'
              : changeType === 'decrease'
              ? 'text-red-600'
              : 'text-gray-600'
          }`}
        >
          {change}
        </span>
        <span className="text-sm text-gray-500 ml-1">from last month</span>
      </div>
    </div>
  </div>
);

const ActivityItem: React.FC<{ activity: RecentActivity }> = ({ activity }) => {
  const getIcon = () => {
    switch (activity.type) {
      case 'order':
        return <ShoppingBagIcon className="h-5 w-5" />;
      case 'customer':
        return <UsersIcon className="h-5 w-5" />;
      case 'payment':
        return <CurrencyDollarIcon className="h-5 w-5" />;
      case 'support':
        return <PhoneIcon className="h-5 w-5" />;
      default:
        return <ChartBarIcon className="h-5 w-5" />;
    }
  };

  const getStatusColor = () => {
    switch (activity.status) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'warning':
        return 'bg-orange-100 text-orange-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex items-center space-x-4 p-4 hover:bg-gray-50 transition-colors">
      <div className={`p-2 rounded-full ${getStatusColor()}`}>
        {getIcon()}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">{activity.title}</p>
        <p className="text-sm text-gray-500 truncate">{activity.description}</p>
      </div>
      <div className="text-right">
        {activity.amount && (
          <p className="text-sm font-medium text-gray-900">{activity.amount}</p>
        )}
        <p className="text-xs text-gray-500">{activity.time}</p>
      </div>
    </div>
  );
};

const ProfessionalDashboard: React.FC = () => {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('/api/analytics');
        const data = await response.json();
        setAnalytics(data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Mock data for demonstration
  const kpiData = [
    {
      title: 'Total Revenue',
      value: '$127,540',
      change: '+12.5%',
      changeType: 'increase' as const,
      icon: CurrencyDollarIcon,
      color: 'bg-blue-500',
    },
    {
      title: 'Total Orders',
      value: '1,429',
      change: '+8.3%',
      changeType: 'increase' as const,
      icon: ShoppingBagIcon,
      color: 'bg-green-500',
    },
    {
      title: 'Active Customers',
      value: '892',
      change: '+15.2%',
      changeType: 'increase' as const,
      icon: UsersIcon,
      color: 'bg-purple-500',
    },
    {
      title: 'Conversion Rate',
      value: '24.8%',
      change: '-2.1%',
      changeType: 'decrease' as const,
      icon: ChartBarIcon,
      color: 'bg-orange-500',
    },
  ];

  const recentActivities: RecentActivity[] = [
    {
      id: '1',
      type: 'order',
      title: 'New Order #1247',
      description: 'Full Service Expungement - John D.',
      time: '2 minutes ago',
      amount: '$1,500',
      status: 'success',
    },
    {
      id: '2',
      type: 'customer',
      title: 'New Customer Registration',
      description: 'Sarah M. signed up for DIY package',
      time: '15 minutes ago',
      amount: '$50',
      status: 'success',
    },
    {
      id: '3',
      type: 'payment',
      title: 'Payment Received',
      description: 'Review & Filing service payment',
      time: '1 hour ago',
      amount: '$100',
      status: 'success',
    },
    {
      id: '4',
      type: 'support',
      title: 'Support Ticket',
      description: 'Customer inquiry about DUI expungement',
      time: '2 hours ago',
      status: 'pending',
    },
    {
      id: '5',
      type: 'order',
      title: 'Order Upgrade',
      description: 'DIY → Full Service upgrade',
      time: '3 hours ago',
      amount: '$1,450',
      status: 'success',
    },
  ];

  const topProducts: TopProduct[] = [
    { id: '1', name: 'Full Service Expungement', revenue: 45600, orders: 32, growth: 12.5 },
    { id: '2', name: 'Review & Filing Service', revenue: 23400, orders: 234, growth: 8.3 },
    { id: '3', name: 'DIY Expungement Kit', revenue: 18900, orders: 378, growth: 15.2 },
    { id: '4', name: 'Legal Consultation', revenue: 12300, orders: 82, growth: -2.1 },
  ];

  // Chart data
  const revenueChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Revenue',
        data: [45000, 52000, 48000, 61000, 55000, 67000],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const ordersChartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Orders',
        data: [12, 19, 15, 25, 22, 18, 8],
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
        borderColor: 'rgb(16, 185, 129)',
        borderWidth: 1,
      },
    ],
  };

  const conversionChartData = {
    labels: ['DIY Package', 'Review Service', 'Full Service', 'Consultation'],
    datasets: [
      {
        data: [45, 25, 20, 10],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
        ],
        borderColor: [
          'rgb(59, 130, 246)',
          'rgb(16, 185, 129)',
          'rgb(245, 158, 11)',
          'rgb(239, 68, 68)',
        ],
        borderWidth: 2,
      },
    ],
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-gray-200 pb-6">
        <h1 className="text-3xl font-bold leading-tight text-gray-900">Dashboard Overview</h1>
        <p className="mt-2 text-sm text-gray-600">
          Welcome back! Here's what's happening with your business today.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {kpiData.map((kpi, index) => (
          <KPICard key={index} {...kpi} />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Revenue Trend</h3>
            <select className="text-sm border-gray-300 rounded-md">
              <option>Last 6 months</option>
              <option>Last 12 months</option>
              <option>This year</option>
            </select>
          </div>
          <div className="h-64">
            <Line
              data={revenueChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      callback: function(value) {
                        return '$' + Number(value).toLocaleString();
                      },
                    },
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Orders Chart */}
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Weekly Orders</h3>
            <span className="text-sm text-gray-500">This week</span>
          </div>
          <div className="h-64">
            <Bar
              data={ordersChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                  },
                },
              }}
            />
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
          </div>
          <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
            {recentActivities.map((activity) => (
              <ActivityItem key={activity.id} activity={activity} />
            ))}
          </div>
          <div className="px-6 py-3 border-t border-gray-200">
            <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
              View all activity →
            </button>
          </div>
        </div>

        {/* Conversion Breakdown */}
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Service Breakdown</h3>
          <div className="h-48 mb-4">
            <Doughnut
              data={conversionChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom' as const,
                    labels: {
                      boxWidth: 12,
                      padding: 15,
                      font: {
                        size: 11,
                      },
                    },
                  },
                },
              }}
            />
          </div>
        </div>
      </div>

      {/* Top Products */}
      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Top Performing Products</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Revenue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Orders
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Growth
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {topProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {product.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${product.revenue.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.orders}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      {product.growth > 0 ? (
                        <ArrowUpIcon className="h-4 w-4 text-green-500 mr-1" />
                      ) : (
                        <ArrowDownIcon className="h-4 w-4 text-red-500 mr-1" />
                      )}
                      <span
                        className={
                          product.growth > 0 ? 'text-green-600' : 'text-red-600'
                        }
                      >
                        {Math.abs(product.growth)}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalDashboard;