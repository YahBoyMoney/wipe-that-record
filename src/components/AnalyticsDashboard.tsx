'use client';

import React, { useEffect, useState } from 'react';
import DashboardNav from './DashboardNav';

interface AnalyticsData {
  overview: {
    totalLeads: number;
    totalRevenue: number;
    averageOrderValue: string;
    conversionRates: {
      leadToDiy: string;
      diyToReview: string;
      diyToFull: string;
    };
  };
  funnel: {
    leads: number;
    diyPurchases: number;
    reviewUpgrades: number;
    fullServiceUpgrades: number;
  };
  revenue: {
    total: number;
    bySource: Array<{ source: string; revenue: number }>;
  };
  email: {
    totalSent: number;
    byStatus: { [key: string]: number };
  };
  recent: Array<{
    email: string;
    stage: string;
    revenue: number;
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

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch('/api/analytics');
        if (!response.ok) {
          throw new Error('Failed to fetch analytics');
        }
        const analyticsData = await response.json();
        setData(analyticsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
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

  return (
    <div className="bg-gray-50 min-h-screen">
      <DashboardNav />
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Wipe That Record - Analytics Dashboard</h1>
          <p className="text-gray-600 mt-2">Lead conversion and revenue analytics</p>
        </div>

        {/* Overview Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Total Leads"
            value={data.overview.totalLeads.toLocaleString()}
            subtitle="All time"
          />
          <MetricCard
            title="Total Revenue"
            value={formatCurrency(data.overview.totalRevenue)}
            subtitle="All time"
          />
          <MetricCard
            title="Average Order Value"
            value={formatCurrency(parseFloat(data.overview.averageOrderValue))}
            subtitle="Per DIY purchase"
          />
          <MetricCard
            title="Lead to DIY Rate"
            value={`${data.overview.conversionRates.leadToDiy}%`}
            subtitle="Conversion rate"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Conversion Funnel */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Conversion Funnel</h2>
            <div className="space-y-4">
              <ProgressBar
                value={data.funnel.leads}
                max={data.funnel.leads}
                label="Leads"
                color="bg-blue-500"
              />
              <ProgressBar
                value={data.funnel.diyPurchases}
                max={data.funnel.leads}
                label="DIY Purchases ($50)"
                color="bg-green-500"
              />
              <ProgressBar
                value={data.funnel.reviewUpgrades}
                max={data.funnel.leads}
                label="Review Upgrades ($100)"
                color="bg-yellow-500"
              />
              <ProgressBar
                value={data.funnel.fullServiceUpgrades}
                max={data.funnel.leads}
                label="Full Service ($1500)"
                color="bg-purple-500"
              />
            </div>
            <div className="mt-4 text-xs text-gray-500 space-y-1">
              <div>DIY Rate: {data.overview.conversionRates.leadToDiy}%</div>
              <div>DIY → Review: {data.overview.conversionRates.diyToReview}%</div>
              <div>DIY → Full: {data.overview.conversionRates.diyToFull}%</div>
            </div>
          </div>

          {/* Revenue by Source */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Revenue by Source</h2>
            <div className="space-y-3">
              {data.revenue.bySource.map((source, index) => (
                <div key={source.source} className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-3 ${
                      ['bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-pink-500', 'bg-indigo-500'][index % 6]
                    }`}></div>
                    <span className="text-sm font-medium text-gray-900 capitalize">{source.source}</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">{formatCurrency(source.revenue)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Email Performance */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Email Performance</h2>
            <div className="mb-4">
              <div className="text-2xl font-bold text-gray-900">{data.email.totalSent.toLocaleString()}</div>
              <div className="text-sm text-gray-500">Total emails sent</div>
            </div>
            <div className="space-y-2">
              {Object.entries(data.email.byStatus).map(([status, count]) => (
                <div key={status} className="flex justify-between items-center text-sm">
                  <span className="capitalize text-gray-600">{status.replace('_', ' ')}</span>
                  <span className="font-medium text-gray-900">{count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Paid Customers</span>
                <span className="font-semibold">{data.funnel.diyPurchases}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Upgrade Rate</span>
                <span className="font-semibold">
                  {data.funnel.diyPurchases > 0 
                    ? (((data.funnel.reviewUpgrades + data.funnel.fullServiceUpgrades) / data.funnel.diyPurchases) * 100).toFixed(1)
                    : 0}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Revenue/Lead</span>
                <span className="font-semibold">
                  {formatCurrency(data.overview.totalLeads > 0 ? data.overview.totalRevenue / data.overview.totalLeads : 0)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Paid Customers</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stage</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.recent.map((lead, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{lead.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        lead.stage === 'full_service' ? 'bg-purple-100 text-purple-800' :
                        lead.stage === 'review_upgrade' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {lead.stage.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      {formatCurrency(lead.revenue)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{lead.source}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(lead.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default AnalyticsDashboard; 