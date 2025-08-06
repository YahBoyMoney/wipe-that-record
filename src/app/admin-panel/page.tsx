'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  UserGroupIcon, 
  DocumentTextIcon, 
  CurrencyDollarIcon,
  ChartBarIcon,
  BellIcon,
  PhoneIcon,
  EnvelopeIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  MagnifyingGlassIcon,
  ArrowPathIcon,
  ChatBubbleLeftRightIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  UserIcon,
  CalendarIcon,
  FunnelIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';
import { FireIcon, StarIcon } from '@heroicons/react/24/solid';

interface Lead {
  id: string;
  created_at: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  eligibility_score: number;
  conversion_stage: string;
  recommended_service: string;
  city: string;
  conviction_type: string;
  lead_source: string;
}

interface CaseTracking {
  id: string;
  case_number: string;
  service_type: string;
  status: string;
  filed_date: string;
  lead: Lead;
}

interface Order {
  id: string;
  order_number: string;
  amount: number;
  status: string;
  service_type: string;
  created_at: string;
  lead: Lead;
}

interface Stats {
  totalLeads: number;
  hotLeads: number;
  totalRevenue: number;
  conversionRate: number;
  activeCases: number;
  completedCases: number;
  todayLeads: number;
  weekRevenue: number;
}

export default function UnifiedAdminDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'leads' | 'cases' | 'analytics' | 'customer-service'>('overview');
  const [stats, setStats] = useState<Stats>({
    totalLeads: 0,
    hotLeads: 0,
    totalRevenue: 0,
    conversionRate: 0,
    activeCases: 0,
    completedCases: 0,
    todayLeads: 0,
    weekRevenue: 0
  });
  const [leads, setLeads] = useState<Lead[]>([]);
  const [cases, setCases] = useState<CaseTracking[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  // Real-time subscriptions
  useEffect(() => {
    fetchAllData();
    
    // Subscribe to real-time updates
    const leadsSubscription = supabase
      .channel('leads-changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'leads' 
      }, () => {
        fetchLeads();
        fetchStats();
      })
      .subscribe();

    const casesSubscription = supabase
      .channel('cases-changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'case_tracking' 
      }, () => {
        fetchCases();
        fetchStats();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(leadsSubscription);
      supabase.removeChannel(casesSubscription);
    };
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    await Promise.all([
      fetchStats(),
      fetchLeads(),
      fetchCases(),
      fetchOrders()
    ]);
    setLoading(false);
  };

  const fetchStats = async () => {
    try {
      // Get leads stats
      const { data: allLeads } = await supabase
        .from('leads')
        .select('*');

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);

      const todayLeads = allLeads?.filter(lead => 
        new Date(lead.created_at) >= today
      ).length || 0;

      const hotLeads = allLeads?.filter(lead => 
        lead.eligibility_score >= 75
      ).length || 0;

      // Get orders stats
      const { data: allOrders } = await supabase
        .from('orders')
        .select('*');

      const totalRevenue = allOrders?.reduce((sum, order) => 
        sum + (parseFloat(order.amount) || 0), 0
      ) || 0;

      const weekRevenue = allOrders?.filter(order => 
        new Date(order.created_at) >= weekAgo
      ).reduce((sum, order) => sum + (parseFloat(order.amount) || 0), 0) || 0;

      // Get cases stats
      const { data: allCases } = await supabase
        .from('case_tracking')
        .select('*');

      const activeCases = allCases?.filter(c => 
        !['completed', 'denied'].includes(c.status)
      ).length || 0;

      const completedCases = allCases?.filter(c => 
        c.status === 'completed'
      ).length || 0;

      // Calculate conversion rate
      const convertedLeads = allLeads?.filter(lead => 
        lead.conversion_stage === 'converted'
      ).length || 0;
      
      const conversionRate = allLeads && allLeads.length > 0 
        ? (convertedLeads / allLeads.length) * 100 
        : 0;

      setStats({
        totalLeads: allLeads?.length || 0,
        hotLeads,
        totalRevenue,
        conversionRate,
        activeCases,
        completedCases,
        todayLeads,
        weekRevenue
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchLeads = async () => {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      setLeads(data || []);
    } catch (error) {
      console.error('Error fetching leads:', error);
    }
  };

  const fetchCases = async () => {
    try {
      const { data, error } = await supabase
        .from('case_tracking')
        .select(`
          *,
          lead:leads(*)
        `)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setCases(data || []);
    } catch (error) {
      console.error('Error fetching cases:', error);
    }
  };

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          lead:leads(*)
        `)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const updateLeadStage = async (leadId: string, newStage: string) => {
    try {
      const { error } = await supabase
        .from('leads')
        .update({ conversion_stage: newStage })
        .eq('id', leadId);

      if (error) throw error;
      fetchLeads();
    } catch (error) {
      console.error('Error updating lead:', error);
    }
  };

  const updateCaseStatus = async (caseId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('case_tracking')
        .update({ status: newStatus })
        .eq('id', caseId);

      if (error) throw error;
      fetchCases();
    } catch (error) {
      console.error('Error updating case:', error);
    }
  };

  const filteredLeads = leads.filter(lead => 
    searchTerm === '' || 
    `${lead.first_name} ${lead.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.phone?.includes(searchTerm)
  );

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Grid - Cleaner design with smaller icons */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Today's Leads</p>
              <p className="mt-2 text-3xl font-semibold text-gray-900">{stats.todayLeads}</p>
              <p className="mt-1 text-sm text-green-600 flex items-center">
                <ArrowTrendingUpIcon className="h-3 w-3 mr-1" />
                +12% from yesterday
              </p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <UserGroupIcon className="h-5 w-5 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Hot Leads</p>
              <p className="mt-2 text-3xl font-semibold text-gray-900">{stats.hotLeads}</p>
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <FireIcon className="h-3 w-3 mr-1" />
                Score ≥75%
              </p>
            </div>
            <div className="bg-red-50 p-3 rounded-lg">
              <FireIcon className="h-5 w-5 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Week Revenue</p>
              <p className="mt-2 text-3xl font-semibold text-gray-900">${(stats.weekRevenue / 1000).toFixed(1)}k</p>
              <p className="mt-1 text-sm text-green-600 flex items-center">
                <ArrowTrendingUpIcon className="h-3 w-3 mr-1" />
                +8% from last week
              </p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <CurrencyDollarIcon className="h-5 w-5 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Conversion Rate</p>
              <p className="mt-2 text-3xl font-semibold text-gray-900">{stats.conversionRate.toFixed(1)}%</p>
              <p className="mt-1 text-sm text-purple-600 flex items-center">
                <ChartBarIcon className="h-3 w-3 mr-1" />
                Industry avg: 2.5%
              </p>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg">
              <ChartBarIcon className="h-5 w-5 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Hot Leads - Cleaner table design */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FireIcon className="h-4 w-4 text-red-500" />
              <h3 className="text-sm font-semibold text-gray-900">Hot Leads</h3>
              <span className="px-2 py-0.5 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                {leads.filter(l => l.eligibility_score >= 75).length} total
              </span>
            </div>
            <button className="text-xs text-blue-600 hover:text-blue-800 font-medium">
              View All →
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {leads.filter(l => l.eligibility_score >= 75).slice(0, 5).map(lead => (
                <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-xs font-medium text-gray-600">
                          {lead.first_name[0]}{lead.last_name[0]}
                        </span>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">
                          {lead.first_name} {lead.last_name}
                        </p>
                        <p className="text-xs text-gray-500">{lead.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        lead.eligibility_score >= 90 ? 'bg-red-100 text-red-800' :
                        lead.eligibility_score >= 75 ? 'bg-orange-100 text-orange-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        <FireIcon className="h-3 w-3 mr-1" />
                        {lead.eligibility_score}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                      {lead.recommended_service?.toUpperCase() || 'DIY'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {lead.city}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => window.location.href = `tel:${lead.phone}`}
                        className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      >
                        <PhoneIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => window.location.href = `mailto:${lead.email}`}
                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <EnvelopeIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setSelectedLead(lead)}
                        className="px-3 py-1 text-xs font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        View
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Active Cases - Compact design */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <DocumentTextIcon className="h-4 w-4 text-blue-500" />
              <h3 className="text-sm font-semibold text-gray-900">Active Cases</h3>
              <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                {stats.activeCases} in progress
              </span>
            </div>
            <button className="text-xs text-blue-600 hover:text-blue-800 font-medium">
              Manage Cases →
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Case</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timeline</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {cases.filter(c => !['completed', 'denied'].includes(c.status)).slice(0, 5).map(case_ => (
                <tr key={case_.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm font-medium text-gray-900">{case_.case_number}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm text-gray-900">
                      {case_.lead?.first_name} {case_.lead?.last_name}
                    </p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                      {case_.service_type?.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={case_.status}
                      onChange={(e) => updateCaseStatus(case_.id, e.target.value)}
                      className="text-xs border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="filed">Filed</option>
                      <option value="pending_review">Pending Review</option>
                      <option value="submitted_to_court">Submitted</option>
                      <option value="court_review">Court Review</option>
                      <option value="approved">Approved</option>
                      <option value="completed">Completed</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-xs text-gray-500">
                      <CalendarIcon className="h-3 w-3 mr-1" />
                      {new Date(case_.filed_date || case_.created_at).toLocaleDateString()}
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

  const renderLeads = () => (
    <div className="space-y-4">
      {/* Enhanced Search and Filter Bar */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-3 lg:space-y-0">
          <div className="flex-1 max-w-lg">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, or phone..."
                className="pl-10 pr-4 py-2 w-full text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Stages</option>
              <option value="qualified_lead">Qualified</option>
              <option value="contacted">Contacted</option>
              <option value="quoted">Quoted</option>
              <option value="converted">Converted</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="date">Latest First</option>
              <option value="score">Highest Score</option>
              <option value="name">Name A-Z</option>
            </select>
            <button
              onClick={fetchLeads}
              className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <ArrowPathIcon className="h-4 w-4" />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900">
              All Leads ({filteredLeads.length})
            </h3>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-500">
                Showing {Math.min(filteredLeads.length, 100)} of {filteredLeads.length}
              </span>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stage</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLeads.slice(0, 100).map(lead => (
                <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                        <span className="text-xs font-medium text-white">
                          {lead.first_name[0]}{lead.last_name[0]}
                        </span>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">
                          {lead.first_name} {lead.last_name}
                        </p>
                        <p className="text-xs text-gray-500">{lead.city}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <p className="text-xs text-gray-900">{lead.email}</p>
                      <p className="text-xs text-gray-500">{lead.phone}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {lead.eligibility_score >= 75 && (
                        <FireIcon className="h-3 w-3 text-red-500 mr-1" />
                      )}
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        lead.eligibility_score >= 75 ? 'bg-red-100 text-red-800' :
                        lead.eligibility_score >= 50 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {lead.eligibility_score}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={lead.conversion_stage}
                      onChange={(e) => updateLeadStage(lead.id, e.target.value)}
                      className="text-xs border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="qualified_lead">Qualified</option>
                      <option value="contacted">Contacted</option>
                      <option value="quoted">Quoted</option>
                      <option value="converted">Converted</option>
                      <option value="lost">Lost</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                      {lead.recommended_service?.toUpperCase() || 'DIY'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                    {lead.lead_source}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end space-x-1">
                      <button
                        onClick={() => setSelectedLead(lead)}
                        className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      >
                        <UserIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => window.location.href = `tel:${lead.phone}`}
                        className="p-1 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
                      >
                        <PhoneIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => window.location.href = `mailto:${lead.email}`}
                        className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      >
                        <EnvelopeIcon className="h-4 w-4" />
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
  );

  const renderCases = () => (
    <div className="space-y-6">
      {/* Case Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Active</p>
              <p className="mt-1 text-2xl font-semibold text-gray-900">{stats.activeCases}</p>
            </div>
            <ClockIcon className="h-5 w-5 text-yellow-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Completed</p>
              <p className="mt-1 text-2xl font-semibold text-gray-900">{stats.completedCases}</p>
            </div>
            <CheckCircleIcon className="h-5 w-5 text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">In Review</p>
              <p className="mt-1 text-2xl font-semibold text-gray-900">
                {cases.filter(c => c.status === 'court_review').length}
              </p>
            </div>
            <DocumentTextIcon className="h-5 w-5 text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Total</p>
              <p className="mt-1 text-2xl font-semibold text-gray-900">{cases.length}</p>
            </div>
            <FunnelIcon className="h-5 w-5 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Cases Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-sm font-semibold text-gray-900">Case Management</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Case</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timeline</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {cases.map(case_ => (
                <tr key={case_.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm font-medium text-gray-900">{case_.case_number}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <p className="text-sm text-gray-900">
                        {case_.lead?.first_name} {case_.lead?.last_name}
                      </p>
                      <p className="text-xs text-gray-500">{case_.lead?.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                      case_.service_type === 'professional' ? 'bg-purple-100 text-purple-800' :
                      case_.service_type === 'attorney' ? 'bg-indigo-100 text-indigo-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {case_.service_type?.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={case_.status}
                      onChange={(e) => updateCaseStatus(case_.id, e.target.value)}
                      className="text-xs border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="filed">Filed</option>
                      <option value="pending_review">Pending Review</option>
                      <option value="submitted_to_court">Submitted</option>
                      <option value="court_review">Court Review</option>
                      <option value="approved">Approved</option>
                      <option value="denied">Denied</option>
                      <option value="completed">Completed</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-xs text-gray-500">
                      <p>Filed: {case_.filed_date ? new Date(case_.filed_date).toLocaleDateString() : '-'}</p>
                      <p>Court: {case_.court_date ? new Date(case_.court_date).toLocaleDateString() : '-'}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button className="text-xs font-medium text-blue-600 hover:text-blue-800">
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Total Revenue</h4>
            <CurrencyDollarIcon className="h-4 w-4 text-green-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">${(stats.totalRevenue / 1000).toFixed(1)}k</p>
          <p className="text-xs text-green-600 mt-1">All time earnings</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Total Leads</h4>
            <UserGroupIcon className="h-4 w-4 text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.totalLeads}</p>
          <p className="text-xs text-gray-500 mt-1">All time captures</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Conversion</h4>
            <ChartBarIcon className="h-4 w-4 text-purple-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.conversionRate.toFixed(1)}%</p>
          <p className="text-xs text-purple-600 mt-1">Lead to customer</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Value</h4>
            <StarIcon className="h-4 w-4 text-yellow-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            ${orders.length > 0 ? (stats.totalRevenue / orders.length).toFixed(0) : '0'}
          </p>
          <p className="text-xs text-gray-500 mt-1">Per customer</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lead Sources */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Lead Sources</h3>
          <div className="space-y-3">
            {Object.entries(
              leads.reduce((acc, lead) => {
                acc[lead.lead_source] = (acc[lead.lead_source] || 0) + 1;
                return acc;
              }, {} as Record<string, number>)
            ).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([source, count]) => (
              <div key={source} className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-700">{source}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-1.5">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-1.5 rounded-full"
                      style={{ width: `${(count / leads.length) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-600 w-8 text-right">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Service Distribution */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Service Type Distribution</h3>
          <div className="grid grid-cols-3 gap-4">
            {['diy', 'professional', 'attorney'].map(service => {
              const count = leads.filter(l => l.recommended_service === service).length;
              const percentage = leads.length > 0 ? (count / leads.length) * 100 : 0;
              
              return (
                <div key={service} className="text-center">
                  <div className="relative w-16 h-16 mx-auto mb-2">
                    <svg className="w-16 h-16 transform -rotate-90">
                      <circle
                        cx="32"
                        cy="32"
                        r="28"
                        stroke="#e5e7eb"
                        strokeWidth="8"
                        fill="none"
                      />
                      <circle
                        cx="32"
                        cy="32"
                        r="28"
                        stroke={service === 'attorney' ? '#6366f1' : service === 'professional' ? '#8b5cf6' : '#3b82f6'}
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={`${percentage * 1.76} 176`}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs font-bold text-gray-900">{count}</span>
                    </div>
                  </div>
                  <p className="text-xs font-medium text-gray-700">{service.toUpperCase()}</p>
                  <p className="text-xs text-gray-500">{percentage.toFixed(0)}%</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Conversion Funnel */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Conversion Funnel</h3>
        <div className="space-y-2">
          {['qualified_lead', 'contacted', 'quoted', 'converted'].map((stage, index) => {
            const count = leads.filter(l => l.conversion_stage === stage).length;
            const percentage = leads.length > 0 ? (count / leads.length) * 100 : 0;
            
            return (
              <div key={stage} className="flex items-center space-x-3">
                <span className="text-xs font-medium text-gray-700 w-24">
                  {stage.replace('_', ' ').toUpperCase()}
                </span>
                <div className="flex-1 bg-gray-200 rounded-full h-6">
                  <div 
                    className={`h-6 rounded-full flex items-center justify-end pr-2 ${
                      index === 0 ? 'bg-blue-500' :
                      index === 1 ? 'bg-indigo-500' :
                      index === 2 ? 'bg-purple-500' :
                      'bg-green-500'
                    }`}
                    style={{ width: `${Math.max(percentage, 5)}%` }}
                  >
                    <span className="text-xs font-medium text-white">{count}</span>
                  </div>
                </div>
                <span className="text-xs text-gray-600 w-12 text-right">{percentage.toFixed(0)}%</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderCustomerService = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer Details */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Customer Details</h3>
            
            {selectedLead ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                    <span className="text-lg font-medium text-white">
                      {selectedLead.first_name[0]}{selectedLead.last_name[0]}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {selectedLead.first_name} {selectedLead.last_name}
                    </p>
                    <p className="text-xs text-gray-500">{selectedLead.city}</p>
                  </div>
                </div>
                
                <div className="space-y-2 pt-4 border-t">
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-sm text-gray-900">{selectedLead.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Phone</p>
                    <p className="text-sm text-gray-900">{selectedLead.phone}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Eligibility Score</p>
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        selectedLead.eligibility_score >= 75 ? 'bg-red-100 text-red-800' :
                        selectedLead.eligibility_score >= 50 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {selectedLead.eligibility_score}%
                      </span>
                      {selectedLead.eligibility_score >= 75 && (
                        <FireIcon className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2 pt-4 border-t">
                  <button className="w-full flex items-center justify-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm">
                    <PhoneIcon className="h-4 w-4" />
                    <span>Call Customer</span>
                  </button>
                  
                  <button className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm">
                    <EnvelopeIcon className="h-4 w-4" />
                    <span>Send Email</span>
                  </button>
                  
                  <button className="w-full flex items-center justify-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm">
                    <ChatBubbleLeftRightIcon className="h-4 w-4" />
                    <span>Send SMS</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <UserIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-500">
                  Select a lead to view details
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Communication Center */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Communication Center</h3>
            
            {selectedLead ? (
              <div className="space-y-4">
                {/* Quick Actions */}
                <div className="grid grid-cols-2 gap-3">
                  <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                    Send CR-180 Packet
                  </button>
                  <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                    Schedule Consultation
                  </button>
                  <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                    Send Payment Link
                  </button>
                  <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                    Update Case Status
                  </button>
                </div>

                {/* Message Composer */}
                <div className="border-t pt-4">
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Compose Message
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={4}
                    placeholder="Type your message here..."
                  />
                  <div className="flex justify-end mt-3 space-x-2">
                    <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                      Save Draft
                    </button>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                      Send Message
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <ChatBubbleLeftRightIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-500">
                  Select a customer to start communication
                </p>
              </div>
            )}
          </div>

          {/* Recent Communications */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 mt-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Recent Communications</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <EnvelopeIcon className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Email sent to John Smith</p>
                  <p className="text-xs text-gray-500">CR-180 completion notification • 2 hours ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-green-50 rounded-lg">
                  <PhoneIcon className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Call with Sarah Johnson</p>
                  <p className="text-xs text-gray-500">Eligibility consultation • 4 hours ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-purple-50 rounded-lg">
                  <ChatBubbleLeftRightIcon className="h-4 w-4 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">SMS to Mike Davis</p>
                  <p className="text-xs text-gray-500">Payment reminder • Yesterday</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <ArrowPathIcon className="h-10 w-10 text-blue-600 animate-spin mx-auto" />
          <p className="mt-3 text-sm text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-xs text-gray-500 mt-1">Real-time data & analytics</p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={fetchAllData}
                className="flex items-center space-x-1 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <ArrowPathIcon className="h-4 w-4" />
                <span>Refresh</span>
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 relative">
                <BellIcon className="h-5 w-5" />
                {stats.hotLeads > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                    {stats.hotLeads}
                  </span>
                )}
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <Cog6ToothIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-6">
            {[
              { id: 'overview', label: 'Overview', icon: ChartBarIcon },
              { id: 'leads', label: 'Leads', icon: UserGroupIcon },
              { id: 'cases', label: 'Cases', icon: DocumentTextIcon },
              { id: 'analytics', label: 'Analytics', icon: ChartBarIcon },
              { id: 'customer-service', label: 'Customer Service', icon: PhoneIcon }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3 px-1 border-b-2 font-medium text-sm flex items-center space-x-1.5 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'leads' && renderLeads()}
        {activeTab === 'cases' && renderCases()}
        {activeTab === 'analytics' && renderAnalytics()}
        {activeTab === 'customer-service' && renderCustomerService()}
      </div>

      {/* Lead Details Modal */}
      {selectedLead && activeTab !== 'customer-service' && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Lead Details</h3>
              <button
                onClick={() => setSelectedLead(null)}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Name</p>
                  <p className="mt-1 text-sm text-gray-900">{selectedLead.first_name} {selectedLead.last_name}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Email</p>
                  <p className="mt-1 text-sm text-gray-900">{selectedLead.email}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</p>
                  <p className="mt-1 text-sm text-gray-900">{selectedLead.phone}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">City</p>
                  <p className="mt-1 text-sm text-gray-900">{selectedLead.city}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Score</p>
                  <p className="mt-1 text-sm text-gray-900">{selectedLead.eligibility_score}%</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Conviction</p>
                  <p className="mt-1 text-sm text-gray-900">{selectedLead.conviction_type}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Service</p>
                  <p className="mt-1 text-sm text-gray-900">{selectedLead.recommended_service?.toUpperCase()}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Source</p>
                  <p className="mt-1 text-sm text-gray-900">{selectedLead.lead_source}</p>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200 flex justify-end space-x-3">
                <button
                  onClick={() => {
                    window.location.href = `tel:${selectedLead.phone}`;
                  }}
                  className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
                >
                  Call
                </button>
                <button
                  onClick={() => {
                    window.location.href = `mailto:${selectedLead.email}`;
                  }}
                  className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Email
                </button>
                <button
                  onClick={() => setSelectedLead(null)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}