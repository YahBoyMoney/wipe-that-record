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
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
import { FireIcon } from '@heroicons/react/24/solid';

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
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Today's Leads</p>
              <p className="text-2xl font-bold text-gray-900">{stats.todayLeads}</p>
            </div>
            <UserGroupIcon className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Hot Leads</p>
              <p className="text-2xl font-bold text-gray-900">{stats.hotLeads}</p>
            </div>
            <FireIcon className="h-8 w-8 text-red-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Week Revenue</p>
              <p className="text-2xl font-bold text-gray-900">${stats.weekRevenue.toFixed(2)}</p>
            </div>
            <CurrencyDollarIcon className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
              <p className="text-2xl font-bold text-gray-900">{stats.conversionRate.toFixed(1)}%</p>
            </div>
            <ChartBarIcon className="h-8 w-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Recent Hot Leads */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">🔥 Hot Leads (Score ≥ 75)</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {leads.filter(l => l.eligibility_score >= 75).slice(0, 5).map(lead => (
                <tr key={lead.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {lead.first_name} {lead.last_name}
                    </div>
                    <div className="text-sm text-gray-500">{lead.city}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                      {lead.eligibility_score}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {lead.recommended_service?.toUpperCase() || 'DIY'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      <a href={`tel:${lead.phone}`} className="text-blue-600 hover:text-blue-900">
                        <PhoneIcon className="h-5 w-5" />
                      </a>
                      <a href={`mailto:${lead.email}`} className="text-blue-600 hover:text-blue-900">
                        <EnvelopeIcon className="h-5 w-5" />
                      </a>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => setSelectedLead(lead)}
                      className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Active Cases */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">📂 Active Cases</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Case #</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Filed</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {cases.filter(c => !['completed', 'denied'].includes(c.status)).slice(0, 5).map(case_ => (
                <tr key={case_.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {case_.case_number}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {case_.lead?.first_name} {case_.lead?.last_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {case_.service_type?.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={case_.status}
                      onChange={(e) => updateCaseStatus(case_.id, e.target.value)}
                      className="text-sm border-gray-300 rounded-md"
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(case_.filed_date || case_.created_at).toLocaleDateString()}
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
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search leads by name, email, or phone..."
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">All Leads ({filteredLeads.length})</h3>
          <button
            onClick={fetchLeads}
            className="flex items-center space-x-2 text-sm text-indigo-600 hover:text-indigo-900"
          >
            <ArrowPathIcon className="h-4 w-4" />
            <span>Refresh</span>
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lead</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stage</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLeads.map(lead => (
                <tr key={lead.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {lead.first_name} {lead.last_name}
                      </div>
                      <div className="text-sm text-gray-500">{lead.city}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{lead.email}</div>
                    <div className="text-sm text-gray-500">{lead.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      lead.eligibility_score >= 75 ? 'bg-red-100 text-red-800' :
                      lead.eligibility_score >= 50 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {lead.eligibility_score}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={lead.conversion_stage}
                      onChange={(e) => updateLeadStage(lead.id, e.target.value)}
                      className="text-sm border-gray-300 rounded-md"
                    >
                      <option value="qualified_lead">Qualified</option>
                      <option value="contacted">Contacted</option>
                      <option value="quoted">Quoted</option>
                      <option value="converted">Converted</option>
                      <option value="lost">Lost</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {lead.recommended_service?.toUpperCase() || 'DIY'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {lead.lead_source}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(lead.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setSelectedLead(lead)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        View
                      </button>
                      <a
                        href={`tel:${lead.phone}`}
                        className="text-green-600 hover:text-green-900"
                      >
                        Call
                      </a>
                      <a
                        href={`mailto:${lead.email}`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Email
                      </a>
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Cases</p>
              <p className="text-2xl font-bold text-gray-900">{stats.activeCases}</p>
            </div>
            <ClockIcon className="h-8 w-8 text-yellow-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">{stats.completedCases}</p>
            </div>
            <CheckCircleIcon className="h-8 w-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Cases</p>
              <p className="text-2xl font-bold text-gray-900">{cases.length}</p>
            </div>
            <DocumentTextIcon className="h-8 w-8 text-blue-500" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Case Management</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Case Number</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Filed Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Court Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {cases.map(case_ => (
                <tr key={case_.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {case_.case_number}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {case_.lead?.first_name} {case_.lead?.last_name}
                    </div>
                    <div className="text-sm text-gray-500">{case_.lead?.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
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
                      className="text-sm border-gray-300 rounded-md"
                    >
                      <option value="filed">Filed</option>
                      <option value="pending_review">Pending Review</option>
                      <option value="submitted_to_court">Submitted to Court</option>
                      <option value="court_review">Court Review</option>
                      <option value="approved">Approved</option>
                      <option value="denied">Denied</option>
                      <option value="completed">Completed</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {case_.filed_date ? new Date(case_.filed_date).toLocaleDateString() : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {case_.court_date ? new Date(case_.court_date).toLocaleDateString() : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button className="text-indigo-600 hover:text-indigo-900">
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <h4 className="text-sm font-medium text-gray-600 mb-2">Total Revenue</h4>
          <p className="text-3xl font-bold text-gray-900">${stats.totalRevenue.toFixed(2)}</p>
          <p className="text-sm text-green-600 mt-2">All time</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h4 className="text-sm font-medium text-gray-600 mb-2">Total Leads</h4>
          <p className="text-3xl font-bold text-gray-900">{stats.totalLeads}</p>
          <p className="text-sm text-gray-500 mt-2">All time</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h4 className="text-sm font-medium text-gray-600 mb-2">Conversion Rate</h4>
          <p className="text-3xl font-bold text-gray-900">{stats.conversionRate.toFixed(1)}%</p>
          <p className="text-sm text-gray-500 mt-2">Lead to customer</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h4 className="text-sm font-medium text-gray-600 mb-2">Avg Case Value</h4>
          <p className="text-3xl font-bold text-gray-900">
            ${orders.length > 0 ? (stats.totalRevenue / orders.length).toFixed(2) : '0.00'}
          </p>
          <p className="text-sm text-gray-500 mt-2">Per customer</p>
        </div>
      </div>

      {/* Lead Source Analysis */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Lead Sources</h3>
        <div className="space-y-3">
          {Object.entries(
            leads.reduce((acc, lead) => {
              acc[lead.lead_source] = (acc[lead.lead_source] || 0) + 1;
              return acc;
            }, {} as Record<string, number>)
          ).map(([source, count]) => (
            <div key={source} className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">{source}</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-indigo-600 h-2 rounded-full"
                    style={{ width: `${(count / leads.length) * 100}%` }}
                  />
                </div>
                <span className="text-sm text-gray-600">{count}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Service Type Distribution */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Type Distribution</h3>
        <div className="grid grid-cols-3 gap-4">
          {['diy', 'professional', 'attorney'].map(service => {
            const count = leads.filter(l => l.recommended_service === service).length;
            const percentage = leads.length > 0 ? (count / leads.length) * 100 : 0;
            
            return (
              <div key={service} className="text-center">
                <div className="text-2xl font-bold text-gray-900">{count}</div>
                <div className="text-sm text-gray-600">{service.toUpperCase()}</div>
                <div className="text-xs text-gray-500">{percentage.toFixed(1)}%</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderCustomerService = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Communication Center</h3>
        
        {selectedLead ? (
          <div className="space-y-4">
            <div className="border-b pb-4">
              <h4 className="font-medium text-gray-900">
                {selectedLead.first_name} {selectedLead.last_name}
              </h4>
              <p className="text-sm text-gray-600">{selectedLead.email}</p>
              <p className="text-sm text-gray-600">{selectedLead.phone}</p>
            </div>
            
            <div className="space-y-3">
              <button className="w-full flex items-center justify-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
                <PhoneIcon className="h-5 w-5" />
                <span>Call Customer</span>
              </button>
              
              <button className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                <EnvelopeIcon className="h-5 w-5" />
                <span>Send Email</span>
              </button>
              
              <button className="w-full flex items-center justify-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700">
                <ChatBubbleLeftRightIcon className="h-5 w-5" />
                <span>Send SMS</span>
              </button>
            </div>
            
            <div className="mt-6">
              <h5 className="font-medium text-gray-900 mb-2">Quick Actions</h5>
              <div className="space-y-2">
                <button className="text-sm text-indigo-600 hover:text-indigo-900">
                  → Send CR-180 Packet
                </button>
                <button className="text-sm text-indigo-600 hover:text-indigo-900">
                  → Schedule Consultation
                </button>
                <button className="text-sm text-indigo-600 hover:text-indigo-900">
                  → Send Payment Link
                </button>
                <button className="text-sm text-indigo-600 hover:text-indigo-900">
                  → Update Case Status
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            Select a lead from the Overview or Leads tab to begin customer service
          </div>
        )}
      </div>

      {/* Recent Communications */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Communications</h3>
        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <EnvelopeIcon className="h-5 w-5 text-gray-400 mt-1" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Email sent to John Smith</p>
              <p className="text-xs text-gray-500">CR-180 completion notification - 2 hours ago</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <PhoneIcon className="h-5 w-5 text-gray-400 mt-1" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Call with Sarah Johnson</p>
              <p className="text-xs text-gray-500">Eligibility consultation - 4 hours ago</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <ChatBubbleLeftRightIcon className="h-5 w-5 text-gray-400 mt-1" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">SMS to Mike Davis</p>
              <p className="text-xs text-gray-500">Payment reminder - Yesterday</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <ArrowPathIcon className="h-12 w-12 text-indigo-600 animate-spin mx-auto" />
          <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">WipeThatRecord Admin</h1>
              <p className="text-sm text-gray-600">Real-time dashboard with live data</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={fetchAllData}
                className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                <ArrowPathIcon className="h-4 w-4" />
                <span>Refresh All</span>
              </button>
              <div className="relative">
                <BellIcon className="h-6 w-6 text-gray-600" />
                {stats.hotLeads > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                    {stats.hotLeads}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
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
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-5 w-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'leads' && renderLeads()}
        {activeTab === 'cases' && renderCases()}
        {activeTab === 'analytics' && renderAnalytics()}
        {activeTab === 'customer-service' && renderCustomerService()}
      </div>

      {/* Lead Details Modal */}
      {selectedLead && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Lead Details</h3>
              <button
                onClick={() => setSelectedLead(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Name</p>
                  <p className="text-sm text-gray-900">{selectedLead.first_name} {selectedLead.last_name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Email</p>
                  <p className="text-sm text-gray-900">{selectedLead.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Phone</p>
                  <p className="text-sm text-gray-900">{selectedLead.phone}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">City</p>
                  <p className="text-sm text-gray-900">{selectedLead.city}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Eligibility Score</p>
                  <p className="text-sm text-gray-900">{selectedLead.eligibility_score}%</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Conviction Type</p>
                  <p className="text-sm text-gray-900">{selectedLead.conviction_type}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Recommended Service</p>
                  <p className="text-sm text-gray-900">{selectedLead.recommended_service?.toUpperCase()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Lead Source</p>
                  <p className="text-sm text-gray-900">{selectedLead.lead_source}</p>
                </div>
              </div>
              
              <div className="pt-4 border-t flex justify-end space-x-3">
                <button
                  onClick={() => {
                    window.location.href = `tel:${selectedLead.phone}`;
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Call
                </button>
                <button
                  onClick={() => {
                    window.location.href = `mailto:${selectedLead.email}`;
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Email
                </button>
                <button
                  onClick={() => setSelectedLead(null)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
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