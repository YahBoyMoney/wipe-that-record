'use client';

import React, { useEffect, useState } from 'react';
import DashboardNav from './DashboardNav';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface AnalyticsData {
  overview: {
    totalLeads: number;
    totalRevenue: number;
    conversionRate: number;
    averageOrderValue: number;
    todayLeads: number;
    todayRevenue: number;
    weekLeads: number;
    weekRevenue: number;
    monthLeads: number;
    monthRevenue: number;
    avgLeadScore: number;
    highQualityLeads: number;
  };
  funnel: {
    leads: number;
    diyPurchases: number;
    reviewUpgrades: number;
    fullServiceUpgrades: number;
    conversionRates: {
      leadToDiy: string;
      diyToReview: string;
      diyToFull: string;
    };
  };
  trends: {
    daily: Array<{
      date: string;
      leads: number;
      revenue: number;
      conversions: number;
    }>;
    monthly: Array<{
      month: string;
      revenue: number;
      leads: number;
      conversions: number;
    }>;
  };
  sources: {
    breakdown: Record<string, number>;
    top: Array<{ source: string; count: number }>;
  };
  convictions: Record<string, number>;
  email: {
    totalSent: number;
    delivered: number;
    pending: number;
    failed: number;
  };
  highValueLeads: Array<{
    id: string;
    name: string;
    email: string;
    revenue: number;
    stage: string;
    source: string;
    createdAt: string;
  }>;
}

const MetricCard: React.FC<{ title: string; value: string | number; subtitle?: string; trend?: string }> = ({
  title,
  value,
  subtitle,
  trend
}) => (
  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">{title}</h3>
    <div className="mt-2 flex items-baseline">
      <div className="text-2xl font-semibold text-gray-900">{value}</div>
      {trend && <div className={`ml-2 text-sm ${trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>{trend}</div>}
    </div>
    {subtitle && <div className="text-sm text-gray-500 mt-1">{subtitle}</div>}
  </div>
);

const ProgressBar: React.FC<{ value: number; max: number; label: string; color: string }> = ({
  value,
  max,
  label,
  color
}) => (
  <div className="mb-4">
    <div className="flex justify-between text-sm text-gray-600 mb-1">
      <span>{label}</span>
      <span>{value}</span>
    </div>
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div
        className={`h-2 rounded-full ${color}`}
        style={{ width: `${max > 0 ? (value / max) * 100 : 0}%` }}
      ></div>
    </div>
  </div>
);

const AnalyticsDashboard: React.FC = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAnalytics = async () => {
    try {
      setRefreshing(true);
      const response = await fetch('/api/analytics');
      if (!response.ok) {
        throw new Error('Failed to fetch analytics');
      }
      const analyticsData = await response.json();
      setData(analyticsData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Analytics fetch error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
    const interval = setInterval(fetchAnalytics, 300000); // Refresh every 5 minutes
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error loading analytics</h3>
              <div className="mt-2 text-sm text-red-700">{error}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const formatCurrency = (amount: number) => `$${amount.toLocaleString()}`;
  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString();

  // Chart configurations
  const revenueChartData = {
    labels: data.trends?.daily?.map(d => new Date(d.date).toLocaleDateString()) || [],
    datasets: [
      {
        label: 'Daily Revenue',
        data: data.trends?.daily?.map(d => d.revenue) || [],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const leadsChartData = {
    labels: data.trends?.daily?.map(d => new Date(d.date).toLocaleDateString()) || [],
    datasets: [
      {
        label: 'Daily Leads',
        data: data.trends?.daily?.map(d => d.leads) || [],
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
        borderColor: 'rgb(16, 185, 129)',
        borderWidth: 1,
      },
    ],
  };

  const funnelData = {
    labels: ['Leads', 'DIY Purchases', 'Review Upgrades', 'Full Service'],
    datasets: [
      {
        data: [
          data.funnel.leads,
          data.funnel.diyPurchases,
          data.funnel.reviewUpgrades,
          data.funnel.fullServiceUpgrades,
        ],
        backgroundColor: [
          'rgba(99, 102, 241, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
        ],
        borderColor: [
          'rgb(99, 102, 241)',
          'rgb(16, 185, 129)',
          'rgb(245, 158, 11)',
          'rgb(239, 68, 68)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const sourcesData = {
    labels: data.sources?.top?.map(s => s.source) || [],
    datasets: [
      {
        data: data.sources?.top?.map(s => s.count) || [],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(139, 92, 246, 0.8)',
        ],
      },
    ],
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <DashboardNav />
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
              <p className="text-gray-600 mt-2">Real-time business intelligence and performance metrics</p>
            </div>
            <button
              onClick={fetchAnalytics}
              disabled={refreshing}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {refreshing ? '🔄 Refreshing...' : '🔄 Refresh'}
            </button>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <MetricCard
              title="Total Revenue"
              value={formatCurrency(data.overview.totalRevenue)}
              subtitle={`Today: ${formatCurrency(data.overview.todayRevenue)}`}
            />
            <MetricCard
              title="Total Leads"
              value={data.overview.totalLeads.toLocaleString()}
              subtitle={`Today: ${data.overview.todayLeads}`}
            />
            <MetricCard
              title="Conversion Rate"
              value={`${data.overview.conversionRate.toFixed(1)}%`}
              subtitle={data.overview.conversionRate > 15 ? '🔥 Excellent' : data.overview.conversionRate > 10 ? '✅ Good' : '⚠️ Needs work'}
            />
            <MetricCard
              title="Avg Order Value"
              value={formatCurrency(Math.round(data.overview.averageOrderValue))}
              subtitle={`Revenue per lead: ${formatCurrency(Math.round(data.overview.totalRevenue / data.overview.totalLeads))}`}
            />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Revenue Trend */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend (7 Days)</h3>
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

            {/* Leads Trend */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Leads Trend (7 Days)</h3>
              <div className="h-64">
                <Bar
                  data={leadsChartData}
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

          {/* Funnel and Sources */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Conversion Funnel */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Conversion Funnel</h3>
              <div className="h-64">
                <Doughnut
                  data={funnelData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'bottom' as const,
                      },
                    },
                  }}
                />
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Lead → DIY:</span>
                  <span className="font-semibold">{data.funnel.conversionRates.leadToDiy}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>DIY → Review:</span>
                  <span className="font-semibold">{data.funnel.conversionRates.diyToReview}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>DIY → Full:</span>
                  <span className="font-semibold">{data.funnel.conversionRates.diyToFull}%</span>
                </div>
              </div>
            </div>

            {/* Traffic Sources */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Traffic Sources</h3>
              <div className="h-64">
                <Doughnut
                  data={sourcesData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'bottom' as const,
                      },
                    },
                  }}
                />
              </div>
              <div className="mt-4 space-y-2">
                {data.sources?.top?.slice(0, 5).map((source, index) => (
                  <div key={source.source} className="flex justify-between text-sm">
                    <span>{source.source}:</span>
                    <span className="font-semibold">{source.count} leads</span>
                  </div>
                )) || []}
              </div>
            </div>
          </div>

          {/* High Value Leads */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">High Value Leads</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Name</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Email</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Revenue</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Stage</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Source</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {data.highValueLeads?.map((lead) => (
                    <tr key={lead.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium text-gray-900">{lead.name}</td>
                      <td className="py-3 px-4 text-gray-600">{lead.email}</td>
                      <td className="py-3 px-4 font-semibold text-green-600">${lead.revenue}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          lead.stage === 'full_service' ? 'bg-red-100 text-red-800' :
                          lead.stage === 'review_upgrade' ? 'bg-yellow-100 text-yellow-800' :
                          lead.stage === 'diy_purchased' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {lead.stage.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{lead.source}</td>
                      <td className="py-3 px-4 text-gray-600">{formatDate(lead.createdAt)}</td>
                    </tr>
                  )) || []}
                </tbody>
              </table>
            </div>
          </div>

          {/* Email Performance */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Email Performance</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{data.email.totalSent}</div>
                <div className="text-sm text-gray-500">Total Sent</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{data.email.delivered}</div>
                <div className="text-sm text-gray-500">Delivered</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{data.email.pending}</div>
                <div className="text-sm text-gray-500">Pending</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{data.email.failed}</div>
                <div className="text-sm text-gray-500">Failed</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard; 