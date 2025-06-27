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
  ChartBarIcon,
  UsersIcon,
  ShoppingBagIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  CalendarDaysIcon,
  GlobeAltIcon,
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
  FunnelIcon,
  EyeIcon,
  CursorArrowRaysIcon,
  DocumentArrowDownIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  ArrowUpIcon as TrendingUpIcon,
  ArrowDownIcon as TrendingDownIcon,
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

interface AnalyticsMetric {
  title: string;
  value: string;
  change: string;
  changeType: 'increase' | 'decrease' | 'neutral';
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

interface ConversionFunnelData {
  stage: string;
  visitors: number;
  conversionRate: number;
  color: string;
}

interface TrafficSource {
  source: string;
  visitors: number;
  percentage: number;
  conversionRate: number;
  revenue: number;
}

interface DeviceData {
  device: string;
  sessions: number;
  percentage: number;
  bounceRate: number;
}

const AnalyticsReporting: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30d');
  const [selectedTab, setSelectedTab] = useState('overview');

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, [dateRange]);

  // Analytics data
  const metricsData: AnalyticsMetric[] = [
    {
      title: 'Total Revenue',
      value: '$127,540',
      change: '+12.5%',
      changeType: 'increase',
      icon: CurrencyDollarIcon,
      color: 'bg-green-500',
    },
    {
      title: 'Total Visitors',
      value: '45,890',
      change: '+8.3%',
      changeType: 'increase',
      icon: UsersIcon,
      color: 'bg-blue-500',
    },
    {
      title: 'Conversion Rate',
      value: '3.2%',
      change: '-0.4%',
      changeType: 'decrease',
      icon: TrendingUpIcon,
      color: 'bg-purple-500',
    },
    {
      title: 'Avg. Order Value',
      value: '$89.32',
      change: '+5.7%',
      changeType: 'increase',
      icon: ShoppingBagIcon,
      color: 'bg-orange-500',
    },
  ];

  // Revenue trend data
  const revenueData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: '2024 Revenue',
        data: [45000, 52000, 48000, 61000, 55000, 67000, 72000, 68000, 75000, 82000, 89000, 95000],
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: '2023 Revenue',
        data: [38000, 45000, 42000, 55000, 48000, 58000, 62000, 59000, 65000, 71000, 76000, 82000],
        borderColor: 'rgb(156, 163, 175)',
        backgroundColor: 'rgba(156, 163, 175, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  // Traffic sources data
  const trafficSources: TrafficSource[] = [
    { source: 'Organic Search', visitors: 18500, percentage: 40.3, conversionRate: 4.2, revenue: 52400 },
    { source: 'Google Ads', visitors: 12300, percentage: 26.8, conversionRate: 6.8, revenue: 38900 },
    { source: 'Direct', visitors: 8900, percentage: 19.4, conversionRate: 2.1, revenue: 18700 },
    { source: 'Social Media', visitors: 4200, percentage: 9.2, conversionRate: 1.8, revenue: 7600 },
    { source: 'Referral', visitors: 2000, percentage: 4.3, conversionRate: 3.5, revenue: 9900 },
  ];

  const trafficSourcesChart = {
    labels: trafficSources.map(source => source.source),
    datasets: [
      {
        data: trafficSources.map(source => source.visitors),
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(139, 92, 246, 0.8)',
        ],
        borderColor: [
          'rgb(59, 130, 246)',
          'rgb(34, 197, 94)',
          'rgb(245, 158, 11)',
          'rgb(239, 68, 68)',
          'rgb(139, 92, 246)',
        ],
        borderWidth: 2,
      },
    ],
  };

  // Conversion funnel data
  const conversionFunnel: ConversionFunnelData[] = [
    { stage: 'Website Visitors', visitors: 45890, conversionRate: 100, color: 'bg-blue-500' },
    { stage: 'Page Views', visitors: 32100, conversionRate: 70, color: 'bg-green-500' },
    { stage: 'Contact Form', visitors: 5800, conversionRate: 18, color: 'bg-yellow-500' },
    { stage: 'Consultation Booked', visitors: 2900, conversionRate: 50, color: 'bg-orange-500' },
    { stage: 'Service Purchased', visitors: 1467, conversionRate: 51, color: 'bg-purple-500' },
  ];

  // Device data
  const deviceData: DeviceData[] = [
    { device: 'Desktop', sessions: 25600, percentage: 55.8, bounceRate: 42.3 },
    { device: 'Mobile', sessions: 18400, percentage: 40.1, bounceRate: 58.7 },
    { device: 'Tablet', sessions: 1890, percentage: 4.1, bounceRate: 45.2 },
  ];

  // Weekly performance data
  const weeklyPerformance = {
    labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    datasets: [
      {
        label: 'Orders',
        data: [28, 35, 42, 38, 45, 22, 18],
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
        borderColor: 'rgb(34, 197, 94)',
        borderWidth: 1,
      },
      {
        label: 'Visitors',
        data: [1200, 1450, 1680, 1520, 1890, 980, 720],
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1,
        yAxisID: 'y1',
      },
    ],
  };

  const MetricCard: React.FC<{ metric: AnalyticsMetric }> = ({ metric }) => (
    <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
      <div className="p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className={`p-3 rounded-lg ${metric.color}`}>
              <metric.icon className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="ml-4 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{metric.title}</dt>
              <dd className="text-2xl font-semibold text-gray-900">{metric.value}</dd>
            </dl>
          </div>
        </div>
        <div className="mt-4 flex items-center">
          {metric.changeType === 'increase' && (
            <ArrowUpIcon className="h-4 w-4 text-green-500 mr-1" />
          )}
          {metric.changeType === 'decrease' && (
            <ArrowDownIcon className="h-4 w-4 text-red-500 mr-1" />
          )}
          <span
            className={`text-sm font-medium ${
              metric.changeType === 'increase'
                ? 'text-green-600'
                : metric.changeType === 'decrease'
                ? 'text-red-600'
                : 'text-gray-600'
            }`}
          >
            {metric.change}
          </span>
          <span className="text-sm text-gray-500 ml-1">vs last period</span>
        </div>
      </div>
    </div>
  );

  const ConversionFunnel: React.FC = () => (
    <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
      <h3 className="text-lg font-medium text-gray-900 mb-6">Conversion Funnel</h3>
      <div className="space-y-4">
        {conversionFunnel.map((stage, index) => (
          <div key={stage.stage} className="relative">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-900">{stage.stage}</span>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">{stage.visitors.toLocaleString()}</span>
                <span className="text-sm font-medium text-gray-900">{stage.conversionRate}%</span>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full ${stage.color}`}
                style={{ width: `${stage.conversionRate}%` }}
              ></div>
            </div>
            {index < conversionFunnel.length - 1 && (
              <div className="flex justify-center mt-2">
                <ArrowDownIcon className="h-4 w-4 text-gray-400" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics & Reporting</h1>
          <p className="text-gray-600">Comprehensive insights into your business performance</p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <button className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
            Export Report
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', name: 'Overview', icon: ChartBarIcon },
            { id: 'traffic', name: 'Traffic', icon: GlobeAltIcon },
            { id: 'conversion', name: 'Conversion', icon: FunnelIcon },
            { id: 'revenue', name: 'Revenue', icon: CurrencyDollarIcon },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              className={`${
                selectedTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center`}
            >
              <tab.icon className="h-4 w-4 mr-2" />
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {selectedTab === 'overview' && (
        <>
          {/* Key Metrics */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {metricsData.map((metric, index) => (
              <MetricCard key={index} metric={metric} />
            ))}
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Trend */}
            <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Revenue Trend</h3>
                <span className="text-sm text-gray-500">Year over year</span>
              </div>
              <div className="h-64">
                <Line
                  data={revenueData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'top' as const,
                      },
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

            {/* Weekly Performance */}
            <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Weekly Performance</h3>
                <span className="text-sm text-gray-500">This week</span>
              </div>
              <div className="h-64">
                <Bar
                  data={weeklyPerformance}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    interaction: {
                      mode: 'index' as const,
                      intersect: false,
                    },
                    scales: {
                      y: {
                        type: 'linear' as const,
                        display: true,
                        position: 'left' as const,
                      },
                      y1: {
                        type: 'linear' as const,
                        display: true,
                        position: 'right' as const,
                        grid: {
                          drawOnChartArea: false,
                        },
                      },
                    },
                  }}
                />
              </div>
            </div>
          </div>

          {/* Bottom Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Conversion Funnel */}
            <ConversionFunnel />

            {/* Device Breakdown */}
            <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-6">Device Breakdown</h3>
              <div className="space-y-4">
                {deviceData.map((device) => (
                  <div key={device.device} className="flex items-center justify-between">
                    <div className="flex items-center">
                      {device.device === 'Desktop' && <ComputerDesktopIcon className="h-5 w-5 text-gray-400 mr-3" />}
                      {device.device === 'Mobile' && <DevicePhoneMobileIcon className="h-5 w-5 text-gray-400 mr-3" />}
                      {device.device === 'Tablet' && <ComputerDesktopIcon className="h-5 w-5 text-gray-400 mr-3" />}
                      <div>
                        <div className="text-sm font-medium text-gray-900">{device.device}</div>
                        <div className="text-sm text-gray-500">{device.percentage}%</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">{device.sessions.toLocaleString()}</div>
                      <div className="text-sm text-gray-500">{device.bounceRate}% bounce</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {selectedTab === 'traffic' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Traffic Sources Chart */}
          <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Traffic Sources</h3>
            <div className="h-64">
              <Doughnut
                data={trafficSourcesChart}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom' as const,
                      labels: {
                        boxWidth: 12,
                        padding: 15,
                      },
                    },
                  },
                }}
              />
            </div>
          </div>

          {/* Traffic Sources Table */}
          <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Source Performance</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider pb-2">Source</th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider pb-2">Visitors</th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider pb-2">Conv. Rate</th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider pb-2">Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {trafficSources.map((source) => (
                    <tr key={source.source}>
                      <td className="py-3 text-sm font-medium text-gray-900">{source.source}</td>
                      <td className="py-3 text-sm text-gray-900">{source.visitors.toLocaleString()}</td>
                      <td className="py-3 text-sm text-gray-900">{source.conversionRate}%</td>
                      <td className="py-3 text-sm font-medium text-gray-900">${source.revenue.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {selectedTab === 'conversion' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ConversionFunnel />
          </div>
          <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Conversion Insights</h3>
            <div className="space-y-4">
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-600 mr-2" />
                  <span className="text-sm font-medium text-green-900">Strong Performance</span>
                </div>
                <p className="text-sm text-green-700 mt-1">
                  51% consultation-to-purchase rate exceeds industry average
                </p>
              </div>
              <div className="p-4 bg-yellow-50 rounded-lg">
                <div className="flex items-center">
                  <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 mr-2" />
                  <span className="text-sm font-medium text-yellow-900">Opportunity</span>
                </div>
                <p className="text-sm text-yellow-700 mt-1">
                  Only 18% of visitors complete contact form - consider optimizing
                </p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center">
                  <TrendingUpIcon className="h-5 w-5 text-blue-600 mr-2" />
                  <span className="text-sm font-medium text-blue-900">Recommendation</span>
                </div>
                <p className="text-sm text-blue-700 mt-1">
                  Focus on page experience improvements to increase initial engagement
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedTab === 'revenue' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Revenue Analysis</h3>
            <div className="h-96">
              <Line
                data={revenueData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'top' as const,
                    },
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
        </div>
      )}
    </div>
  );
};

export default AnalyticsReporting;