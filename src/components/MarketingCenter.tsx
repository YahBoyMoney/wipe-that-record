'use client';

import React, { useState, useEffect } from 'react';
import {
  MegaphoneIcon,
  EnvelopeIcon,
  TagIcon,
  ChartBarIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  PlayIcon,
  PauseIcon,
  StopIcon,
  CalendarDaysIcon,
  UsersIcon,
  CurrencyDollarIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  DocumentArrowDownIcon,
  ShareIcon,
  GlobeAltIcon,
  DevicePhoneMobileIcon,
  ChatBubbleLeftRightIcon,
  PhotoIcon,
  VideoCameraIcon,
  SpeakerWaveIcon,
} from '@heroicons/react/24/outline';

interface Campaign {
  id: string;
  name: string;
  type: 'email' | 'social' | 'google-ads' | 'seo' | 'content';
  status: 'draft' | 'active' | 'paused' | 'completed' | 'scheduled';
  budget: number;
  spent: number;
  startDate: string;
  endDate?: string;
  impressions: number;
  clicks: number;
  conversions: number;
  revenue: number;
  ctr: number;
  cpc: number;
  roas: number;
  audience: string;
  description: string;
}

interface EmailCampaign {
  id: string;
  subject: string;
  status: 'draft' | 'scheduled' | 'sent' | 'sending';
  recipients: number;
  opens: number;
  clicks: number;
  conversions: number;
  revenue: number;
  sentDate?: string;
  scheduledDate?: string;
  template: string;
  segmentName: string;
}

interface MarketingMetric {
  title: string;
  value: string;
  change: string;
  changeType: 'increase' | 'decrease' | 'neutral';
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const MarketingCenter: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [emailCampaigns, setEmailCampaigns] = useState<EmailCampaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);

  // Mock data
  const mockCampaigns: Campaign[] = [
    {
      id: '1',
      name: 'Summer Expungement Special',
      type: 'email',
      status: 'active',
      budget: 5000,
      spent: 2340,
      startDate: '2024-06-01',
      endDate: '2024-07-31',
      impressions: 45000,
      clicks: 1800,
      conversions: 72,
      revenue: 108000,
      ctr: 4.0,
      cpc: 1.30,
      roas: 46.15,
      audience: 'DUI Prospects',
      description: 'Targeted campaign for summer expungement services',
    },
    {
      id: '2',
      name: 'Google Ads - Legal Services',
      type: 'google-ads',
      status: 'active',
      budget: 8000,
      spent: 5600,
      startDate: '2024-05-15',
      impressions: 125000,
      clicks: 3200,
      conversions: 96,
      revenue: 144000,
      ctr: 2.56,
      cpc: 1.75,
      roas: 25.71,
      audience: 'Legal Help Seekers',
      description: 'High-performing Google Ads campaign for legal services',
    },
    {
      id: '3',
      name: 'Social Media Awareness',
      type: 'social',
      status: 'paused',
      budget: 3000,
      spent: 1200,
      startDate: '2024-04-01',
      endDate: '2024-06-30',
      impressions: 89000,
      clicks: 890,
      conversions: 18,
      revenue: 27000,
      ctr: 1.0,
      cpc: 1.35,
      roas: 22.5,
      audience: 'Young Adults 25-35',
      description: 'Brand awareness campaign across social platforms',
    },
    {
      id: '4',
      name: 'SEO Content Strategy',
      type: 'seo',
      status: 'active',
      budget: 4000,
      spent: 2800,
      startDate: '2024-03-01',
      impressions: 67000,
      clicks: 2010,
      conversions: 45,
      revenue: 67500,
      ctr: 3.0,
      cpc: 1.39,
      roas: 24.11,
      audience: 'Organic Searchers',
      description: 'Long-term SEO content and optimization strategy',
    },
  ];

  const mockEmailCampaigns: EmailCampaign[] = [
    {
      id: '1',
      subject: 'Your Second Chance Starts Here - Free Consultation',
      status: 'sent',
      recipients: 12500,
      opens: 3125,
      clicks: 468,
      conversions: 23,
      revenue: 34500,
      sentDate: '2024-06-25T10:00:00Z',
      template: 'Free Consultation',
      segmentName: 'DUI Prospects',
    },
    {
      id: '2',
      subject: 'Limited Time: 20% Off Expungement Services',
      status: 'scheduled',
      recipients: 8900,
      opens: 0,
      clicks: 0,
      conversions: 0,
      revenue: 0,
      scheduledDate: '2024-06-28T14:00:00Z',
      template: 'Promotion',
      segmentName: 'Previous Customers',
    },
    {
      id: '3',
      subject: 'Success Story: How Sarah Got Her Life Back',
      status: 'sent',
      recipients: 15200,
      opens: 4104,
      clicks: 739,
      conversions: 31,
      revenue: 46500,
      sentDate: '2024-06-20T09:00:00Z',
      template: 'Success Story',
      segmentName: 'All Subscribers',
    },
    {
      id: '4',
      subject: 'New: DIY Expungement Kit - 50% Less Cost',
      status: 'draft',
      recipients: 0,
      opens: 0,
      clicks: 0,
      conversions: 0,
      revenue: 0,
      template: 'Product Launch',
      segmentName: 'Price Sensitive',
    },
  ];

  const marketingMetrics: MarketingMetric[] = [
    {
      title: 'Total Ad Spend',
      value: '$11,940',
      change: '+15.3%',
      changeType: 'increase',
      icon: CurrencyDollarIcon,
      color: 'bg-red-500',
    },
    {
      title: 'Total Conversions',
      value: '231',
      change: '+22.8%',
      changeType: 'increase',
      icon: CheckCircleIcon,
      color: 'bg-green-500',
    },
    {
      title: 'Average ROAS',
      value: '29.6x',
      change: '+8.4%',
      changeType: 'increase',
      icon: ChartBarIcon,
      color: 'bg-blue-500',
    },
    {
      title: 'Email Open Rate',
      value: '28.5%',
      change: '-2.1%',
      changeType: 'decrease',
      icon: EnvelopeIcon,
      color: 'bg-purple-500',
    },
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setCampaigns(mockCampaigns);
      setEmailCampaigns(mockEmailCampaigns);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-green-100 text-green-800',
      paused: 'bg-yellow-100 text-yellow-800',
      draft: 'bg-gray-100 text-gray-800',
      completed: 'bg-blue-100 text-blue-800',
      scheduled: 'bg-purple-100 text-purple-800',
      sent: 'bg-green-100 text-green-800',
      sending: 'bg-blue-100 text-blue-800',
    };
    
    const icons = {
      active: PlayIcon,
      paused: PauseIcon,
      draft: PencilIcon,
      completed: CheckCircleIcon,
      scheduled: ClockIcon,
      sent: CheckCircleIcon,
      sending: ClockIcon,
    };
    
    const Icon = icons[status as keyof typeof icons];
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`}>
        <Icon className="h-3 w-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getCampaignTypeIcon = (type: string) => {
    const icons = {
      email: EnvelopeIcon,
      social: ShareIcon,
      'google-ads': GlobeAltIcon,
      seo: MagnifyingGlassIcon,
      content: DocumentArrowDownIcon,
    };
    
    return icons[type as keyof typeof icons] || MegaphoneIcon;
  };

  const MetricCard: React.FC<{ metric: MarketingMetric }> = ({ metric }) => (
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
          <span className="text-sm text-gray-500 ml-1">vs last month</span>
        </div>
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
          <h1 className="text-2xl font-bold text-gray-900">Marketing Center</h1>
          <p className="text-gray-600">Manage campaigns, emails, and track marketing performance</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
            Export Data
          </button>
          <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
            <PlusIcon className="h-4 w-4 mr-2" />
            Create Campaign
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', name: 'Overview', icon: ChartBarIcon },
            { id: 'campaigns', name: 'Campaigns', icon: MegaphoneIcon },
            { id: 'email', name: 'Email Marketing', icon: EnvelopeIcon },
            { id: 'analytics', name: 'Analytics', icon: ChartBarIcon },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`${
                activeTab === tab.id
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

      {activeTab === 'overview' && (
        <>
          {/* Key Metrics */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {marketingMetrics.map((metric, index) => (
              <MetricCard key={index} metric={metric} />
            ))}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Campaigns */}
            <div className="bg-white rounded-lg shadow border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Recent Campaigns</h3>
              </div>
              <div className="divide-y divide-gray-200">
                {campaigns.slice(0, 4).map((campaign) => {
                  const TypeIcon = getCampaignTypeIcon(campaign.type);
                  return (
                    <div key={campaign.id} className="px-6 py-4 hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <TypeIcon className="h-5 w-5 text-gray-400 mr-3" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">{campaign.name}</div>
                            <div className="text-sm text-gray-500">{campaign.type}</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <div className="text-sm font-medium text-gray-900">${campaign.revenue.toLocaleString()}</div>
                            <div className="text-sm text-gray-500">{campaign.roas.toFixed(1)}x ROAS</div>
                          </div>
                          {getStatusBadge(campaign.status)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Email Performance */}
            <div className="bg-white rounded-lg shadow border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Email Performance</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Sent</span>
                    <span className="text-sm font-medium text-gray-900">
                      {emailCampaigns.reduce((sum, campaign) => sum + campaign.recipients, 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Average Open Rate</span>
                    <span className="text-sm font-medium text-gray-900">28.5%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Average Click Rate</span>
                    <span className="text-sm font-medium text-gray-900">4.2%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Revenue</span>
                    <span className="text-sm font-medium text-green-600">
                      ${emailCampaigns.reduce((sum, campaign) => sum + campaign.revenue, 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {activeTab === 'campaigns' && (
        <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">All Campaigns</h3>
              <div className="flex items-center space-x-2">
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  Filter
                </button>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Campaign
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Budget / Spent
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Conversions
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ROAS
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {campaigns.map((campaign) => {
                  const TypeIcon = getCampaignTypeIcon(campaign.type);
                  return (
                    <tr key={campaign.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <TypeIcon className="h-5 w-5 text-gray-400 mr-3" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">{campaign.name}</div>
                            <div className="text-sm text-gray-500">{campaign.audience}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {campaign.type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(campaign.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">${campaign.budget.toLocaleString()}</div>
                        <div className="text-sm text-gray-500">${campaign.spent.toLocaleString()} spent</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{campaign.conversions}</div>
                        <div className="text-sm text-gray-500">{campaign.ctr}% CTR</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-green-600">{campaign.roas.toFixed(1)}x</div>
                        <div className="text-sm text-gray-500">${campaign.revenue.toLocaleString()}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center space-x-2">
                          <button className="text-blue-600 hover:text-blue-800">
                            <EyeIcon className="h-4 w-4" />
                          </button>
                          <button className="text-gray-600 hover:text-gray-800">
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          {campaign.status === 'active' ? (
                            <button className="text-yellow-600 hover:text-yellow-800">
                              <PauseIcon className="h-4 w-4" />
                            </button>
                          ) : (
                            <button className="text-green-600 hover:text-green-800">
                              <PlayIcon className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'email' && (
        <div className="space-y-6">
          {/* Email Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <EnvelopeIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Emails</p>
                  <p className="text-2xl font-semibold text-gray-900">{emailCampaigns.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircleIcon className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Sent Emails</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {emailCampaigns.filter(e => e.status === 'sent').length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <ClockIcon className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Scheduled</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {emailCampaigns.filter(e => e.status === 'scheduled').length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
              <div className="flex items-center">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <CurrencyDollarIcon className="h-6 w-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Email Revenue</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    ${emailCampaigns.reduce((sum, e) => sum + e.revenue, 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Email Campaigns Table */}
          <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Email Campaigns</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subject
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Recipients
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Opens
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Clicks
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Revenue
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {emailCampaigns.map((email) => (
                    <tr key={email.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{email.subject}</div>
                          <div className="text-sm text-gray-500">{email.segmentName}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(email.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {email.recipients.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{email.opens.toLocaleString()}</div>
                        <div className="text-sm text-gray-500">
                          {email.recipients > 0 ? ((email.opens / email.recipients) * 100).toFixed(1) : 0}%
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{email.clicks.toLocaleString()}</div>
                        <div className="text-sm text-gray-500">
                          {email.opens > 0 ? ((email.clicks / email.opens) * 100).toFixed(1) : 0}%
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                        ${email.revenue.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center space-x-2">
                          <button className="text-blue-600 hover:text-blue-800">
                            <EyeIcon className="h-4 w-4" />
                          </button>
                          <button className="text-gray-600 hover:text-gray-800">
                            <PencilIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Marketing Analytics</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="text-md font-medium text-gray-900">Campaign Performance</h4>
              <div className="space-y-3">
                {campaigns.map((campaign) => (
                  <div key={campaign.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{campaign.name}</div>
                      <div className="text-sm text-gray-500">{campaign.type}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">{campaign.roas.toFixed(1)}x ROAS</div>
                      <div className="text-sm text-gray-500">${campaign.revenue.toLocaleString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="text-md font-medium text-gray-900">Email Performance</h4>
              <div className="space-y-3">
                {emailCampaigns.filter(e => e.status === 'sent').map((email) => (
                  <div key={email.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="text-sm font-medium text-gray-900 truncate max-w-xs">{email.subject}</div>
                      <div className="text-sm text-gray-500">{email.segmentName}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">
                        {((email.opens / email.recipients) * 100).toFixed(1)}% open
                      </div>
                      <div className="text-sm text-gray-500">${email.revenue.toLocaleString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketingCenter;