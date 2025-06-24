'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import useSWR from 'swr';
import { 
  Users, 
  DollarSign, 
  Mail, 
  Target, 
  Clock,
  ArrowUp,
  ArrowDown,
  BarChart3
} from 'lucide-react';

// Dynamically import charts to avoid SSR issues
const Line = dynamic(() => import('react-chartjs-2').then((m) => m.Line), { ssr: false });
const Bar = dynamic(() => import('react-chartjs-2').then((m) => m.Bar), { ssr: false });
const Doughnut = dynamic(() => import('react-chartjs-2').then((m) => m.Doughnut), { ssr: false });

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

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function AdminDashboard() {
  const { data, isLoading, error } = useSWR('/api/analytics', fetcher, {
    refreshInterval: 30000 // Refresh every 30 seconds
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics data...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">Failed to load analytics data</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const { overview, funnel, sources, trends, devices, email, campaigns, highValueLeads, performance } = data;

  return (
    <div className="p-6 max-w-[1600px] mx-auto bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">📊 Wipe That Record Analytics</h1>
        <p className="text-gray-600">Comprehensive insights into your expungement service performance</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KPICard
          title="Total Leads"
          value={overview.totalLeads.toLocaleString()}
          change={performance.todayVsYesterday.leads}
          icon={<Users className="h-6 w-6" />}
          color="blue"
        />
        <KPICard
          title="Total Revenue"
          value={`$${overview.totalRevenue.toLocaleString()}`}
          change={performance.todayVsYesterday.revenue}
          icon={<DollarSign className="h-6 w-6" />}
          color="green"
          isCurrency
        />
        <KPICard
          title="Conversion Rate"
          value={`${overview.conversionRate}%`}
          change={null}
          icon={<Target className="h-6 w-6" />}
          color="purple"
        />
        <KPICard
          title="Avg Order Value"
          value={`$${overview.averageOrderValue}`}
          change={null}
          icon={<BarChart3 className="h-6 w-6" />}
          color="orange"
          isCurrency
        />
      </div>

      {/* Today's Performance */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">📈 Today's Performance</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{overview.todayLeads}</div>
            <div className="text-sm text-gray-600">Today's Leads</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">${overview.todayRevenue.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Today's Revenue</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{overview.weekLeads}</div>
            <div className="text-sm text-gray-600">This Week</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{overview.monthLeads}</div>
            <div className="text-sm text-gray-600">This Month</div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Daily Trends */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">📅 7-Day Trends</h3>
          <Line data={getDailyTrendsData(trends.daily)} options={getLineChartOptions()} />
        </div>

        {/* Conversion Funnel */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">🔄 Conversion Funnel</h3>
          <Bar data={getFunnelData(funnel)} options={getBarChartOptions()} />
          <div className="mt-4 text-sm text-gray-600">
            <div>Lead → DIY: {funnel.conversionRates.leadToDiy}%</div>
            <div>DIY → Review: {funnel.conversionRates.diyToReview}%</div>
            <div>DIY → Full: {funnel.conversionRates.diyToFull}%</div>
          </div>
        </div>

        {/* Lead Sources */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">🎯 Lead Sources</h3>
          <Doughnut data={getSourcesData(sources.breakdown)} options={getDoughnutOptions()} />
        </div>

        {/* Device Breakdown */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">📱 Device Types</h3>
          <Doughnut data={getDeviceData(devices)} options={getDoughnutOptions()} />
        </div>
      </div>

      {/* Email Performance */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <Mail className="h-5 w-5 mr-2" />
          Email Marketing Performance
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{email.totalSent}</div>
            <div className="text-sm text-gray-600">Total Sent</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{email.delivered}</div>
            <div className="text-sm text-gray-600">Delivered</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">{email.pending}</div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{email.failed}</div>
            <div className="text-sm text-gray-600">Failed</div>
          </div>
        </div>
      </div>

      {/* High Value Leads Table */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">💎 Recent High-Value Leads</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-2 text-left">Customer</th>
                <th className="px-4 py-2 text-left">Revenue</th>
                <th className="px-4 py-2 text-left">Stage</th>
                <th className="px-4 py-2 text-left">Source</th>
                <th className="px-4 py-2 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {highValueLeads.map((lead: any, index: number) => (
                <tr key={lead.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                  <td className="px-4 py-2">{lead.name}</td>
                  <td className="px-4 py-2 font-semibold text-green-600">${lead.revenue}</td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded text-xs ${getStageColor(lead.stage)}`}>
                      {formatStage(lead.stage)}
                    </span>
                  </td>
                  <td className="px-4 py-2 capitalize">{lead.source}</td>
                  <td className="px-4 py-2 text-sm text-gray-600">
                    {new Date(lead.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Campaign Performance */}
      {Object.keys(campaigns).length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">🚀 Campaign Performance</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left">Campaign</th>
                  <th className="px-4 py-2 text-left">Leads</th>
                  <th className="px-4 py-2 text-left">Conversions</th>
                  <th className="px-4 py-2 text-left">Revenue</th>
                  <th className="px-4 py-2 text-left">Conversion Rate</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(campaigns).map(([campaign, data]: [string, any], index) => (
                  <tr key={campaign} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="px-4 py-2 font-medium">{campaign}</td>
                    <td className="px-4 py-2">{data.leads}</td>
                    <td className="px-4 py-2">{data.conversions}</td>
                    <td className="px-4 py-2 font-semibold text-green-600">${data.revenue}</td>
                    <td className="px-4 py-2">
                      {data.leads > 0 ? ((data.conversions / data.leads) * 100).toFixed(1) : 0}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Upgrade Timing Insight */}
      {trends.avgUpgradeTime > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Clock className="h-5 w-5 mr-2" />
            Upgrade Timing Insights
          </h2>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {Math.round(trends.avgUpgradeTime)} min
            </div>
            <p className="text-gray-600">
              Average time from DIY purchase to upgrade
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// KPI Card Component
function KPICard({ title, value, change, icon, color, isCurrency = false }: {
  title: string;
  value: string;
  change: number | null;
  icon: React.ReactNode;
  color: string;
  isCurrency?: boolean;
}) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600',
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change !== null && (
            <div className="flex items-center mt-1">
              {change >= 0 ? (
                <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
              ) : (
                <ArrowDown className="h-4 w-4 text-red-500 mr-1" />
              )}
              <span className={`text-sm ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {isCurrency ? '$' : ''}{Math.abs(change).toLocaleString()} today
              </span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-full ${colorClasses[color as keyof typeof colorClasses]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

// Chart Data Functions
function getDailyTrendsData(dailyData: any[]) {
  return {
    labels: dailyData.map(d => new Date(d.date).toLocaleDateString()),
    datasets: [
      {
        label: 'Leads',
        data: dailyData.map(d => d.leads),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
      },
      {
        label: 'Revenue',
        data: dailyData.map(d => d.revenue),
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
        yAxisID: 'y1',
      },
    ],
  };
}

function getFunnelData(funnel: any) {
  return {
    labels: ['Leads', 'DIY Purchases', 'Review Upgrades', 'Full Service'],
    datasets: [
      {
        label: 'Count',
        data: [funnel.leads, funnel.diyPurchases, funnel.reviewUpgrades, funnel.fullServiceUpgrades],
        backgroundColor: ['#3b82f6', '#f59e0b', '#10b981', '#8b5cf6'],
        borderColor: ['#2563eb', '#d97706', '#059669', '#7c3aed'],
        borderWidth: 1,
      },
    ],
  };
}

function getSourcesData(sources: Record<string, number>) {
  return {
    labels: Object.keys(sources).map(s => s.charAt(0).toUpperCase() + s.slice(1)),
    datasets: [
      {
        data: Object.values(sources),
        backgroundColor: [
          '#3b82f6',
          '#ef4444',
          '#10b981',
          '#f59e0b',
          '#8b5cf6',
          '#06b6d4',
        ],
        borderWidth: 2,
        borderColor: '#ffffff',
      },
    ],
  };
}

function getDeviceData(devices: Record<string, number>) {
  return {
    labels: Object.keys(devices).map(d => d.charAt(0).toUpperCase() + d.slice(1)),
    datasets: [
      {
        data: Object.values(devices),
        backgroundColor: ['#3b82f6', '#10b981', '#f59e0b'],
        borderWidth: 2,
        borderColor: '#ffffff',
      },
    ],
  };
}

// Chart Options
function getLineChartOptions() {
  return {
    responsive: true,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Date',
        },
      },
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        title: {
          display: true,
          text: 'Leads',
        },
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        title: {
          display: true,
          text: 'Revenue ($)',
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };
}

function getBarChartOptions() {
  return {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };
}

function getDoughnutOptions() {
  return {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
  };
}

// Utility Functions
function getStageColor(stage: string) {
  switch (stage) {
    case 'lead':
      return 'bg-gray-100 text-gray-800';
    case 'diy_purchased':
      return 'bg-blue-100 text-blue-800';
    case 'review_upgrade':
      return 'bg-yellow-100 text-yellow-800';
    case 'full_service':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

function formatStage(stage: string) {
  switch (stage) {
    case 'lead':
      return 'Lead';
    case 'diy_purchased':
      return 'DIY';
    case 'review_upgrade':
      return 'Review';
    case 'full_service':
      return 'Full Service';
    default:
      return stage;
  }
} 