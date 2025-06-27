'use client';

import React, { useState, useEffect } from 'react';
import {
  MagnifyingGlassIcon,
  EllipsisVerticalIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  UserPlusIcon,
  FunnelIcon,
  ArrowDownTrayIcon,
  PhoneIcon,
  EnvelopeIcon,
  CalendarDaysIcon,
  CurrencyDollarIcon,
  UserIcon,
  MapPinIcon,
  TagIcon,
  ChartBarIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  StarIcon,
} from '@heroicons/react/24/outline';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  status: 'active' | 'inactive' | 'lead' | 'vip';
  totalOrders: number;
  totalSpent: number;
  lastOrderDate?: string;
  registrationDate: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  leadSource?: string;
  leadScore?: number;
  tags: string[];
  notes?: string;
  avatar?: string;
}

interface CustomerFilters {
  status: string;
  leadSource: string;
  dateRange: string;
  search: string;
  spendingRange: string;
}

const CustomerManagement: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('registrationDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  
  const [filters, setFilters] = useState<CustomerFilters>({
    status: 'all',
    leadSource: 'all',
    dateRange: 'all',
    search: '',
    spendingRange: 'all',
  });

  // Mock data - replace with actual API call
  const mockCustomers: Customer[] = [
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
      address: {
        street: '123 Main St',
        city: 'Los Angeles',
        state: 'CA',
        zip: '90210',
      },
      leadSource: 'Google Ads',
      leadScore: 85,
      tags: ['DUI', 'Urgent', 'High Value'],
      notes: 'Interested in full service package, has multiple violations',
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
      tags: ['VIP', 'Referrer', 'Multiple Cases'],
      notes: 'Excellent customer, refers others frequently',
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
      tags: ['New Lead', 'Price Sensitive'],
      notes: 'Interested in DIY package, price conscious',
    },
    {
      id: '4',
      name: 'Lisa Davis',
      email: 'lisa.davis@email.com',
      phone: '(555) 456-7890',
      status: 'active',
      totalOrders: 2,
      totalSpent: 350,
      lastOrderDate: '2024-06-26T10:20:00Z',
      registrationDate: '2024-05-12T16:30:00Z',
      leadSource: 'Organic Search',
      leadScore: 70,
      tags: ['Consultation', 'Multiple Charges'],
      notes: 'Completed consultation, considering full service',
    },
    {
      id: '5',
      name: 'Robert Wilson',
      email: 'robert.w@email.com',
      status: 'inactive',
      totalOrders: 1,
      totalSpent: 100,
      lastOrderDate: '2024-04-15T13:45:00Z',
      registrationDate: '2024-03-20T11:15:00Z',
      leadSource: 'Social Media',
      leadScore: 30,
      tags: ['Inactive', 'Single Purchase'],
      notes: 'Purchased review service, no follow-up purchases',
    },
    {
      id: '6',
      name: 'Emma Rodriguez',
      email: 'emma.r@email.com',
      phone: '(555) 321-9876',
      status: 'lead',
      totalOrders: 0,
      totalSpent: 0,
      registrationDate: '2024-06-26T14:20:00Z',
      leadSource: 'Email Campaign',
      leadScore: 60,
      tags: ['Engaged Lead', 'Email Subscriber'],
      notes: 'Downloaded guide, active email engagement',
    },
  ];

  const leadSources = ['Google Ads', 'Referral', 'Facebook', 'Organic Search', 'Social Media', 'Email Campaign'];
  const customerTags = ['DUI', 'Urgent', 'High Value', 'VIP', 'Referrer', 'Multiple Cases', 'New Lead', 'Price Sensitive', 'Consultation', 'Multiple Charges', 'Inactive', 'Single Purchase', 'Engaged Lead', 'Email Subscriber'];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setCustomers(mockCustomers);
      setFilteredCustomers(mockCustomers);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = customers.filter(customer => {
      const matchesSearch = 
        customer.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        customer.email.toLowerCase().includes(filters.search.toLowerCase()) ||
        (customer.phone && customer.phone.includes(filters.search));
      
      const matchesStatus = filters.status === 'all' || customer.status === filters.status;
      const matchesLeadSource = filters.leadSource === 'all' || customer.leadSource === filters.leadSource;
      
      // Date range filtering would go here
      
      return matchesSearch && matchesStatus && matchesLeadSource;
    });

    // Sort customers
    filtered.sort((a, b) => {
      let aValue = a[sortBy as keyof Customer];
      let bValue = b[sortBy as keyof Customer];
      
      if (sortBy === 'registrationDate' || sortBy === 'lastOrderDate') {
        aValue = new Date(aValue as string).getTime();
        bValue = new Date(bValue as string).getTime();
      }
      
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = (bValue as string).toLowerCase();
      }
      
      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    setFilteredCustomers(filtered);
  }, [customers, filters, sortBy, sortOrder]);

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      lead: 'bg-blue-100 text-blue-800',
      vip: 'bg-purple-100 text-purple-800',
    };
    
    const icons = {
      active: CheckCircleIcon,
      inactive: ExclamationTriangleIcon,
      lead: ClockIcon,
      vip: StarIcon,
    };
    
    const Icon = icons[status as keyof typeof icons];
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`}>
        <Icon className="h-3 w-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getLeadScoreColor = (score: number = 0) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const CustomerDetailModal: React.FC<{ customer: Customer; onClose: () => void }> = ({ customer, onClose }) => (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity">
          <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={onClose}></div>
        </div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <div className="bg-white px-6 pt-6 pb-4">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <UserIcon className="h-12 w-12 text-gray-400 bg-gray-100 rounded-full p-2" />
                </div>
                <div className="ml-4">
                  <h3 className="text-2xl font-bold text-gray-900">{customer.name}</h3>
                  <p className="text-gray-600">{customer.email}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {getStatusBadge(customer.status)}
                {customer.leadScore && (
                  <span className={`text-sm font-medium ${getLeadScoreColor(customer.leadScore)}`}>
                    Score: {customer.leadScore}
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Contact Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-lg font-medium text-gray-900 mb-3">Contact Information</h4>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <EnvelopeIcon className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-900">{customer.email}</span>
                  </div>
                  {customer.phone && (
                    <div className="flex items-center">
                      <PhoneIcon className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900">{customer.phone}</span>
                    </div>
                  )}
                  {customer.address && (
                    <div className="flex items-center">
                      <MapPinIcon className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900">
                        {customer.address.street}, {customer.address.city}, {customer.address.state} {customer.address.zip}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Customer Stats */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-lg font-medium text-gray-900 mb-3">Customer Stats</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Orders:</span>
                    <span className="text-sm font-medium text-gray-900">{customer.totalOrders}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Spent:</span>
                    <span className="text-sm font-medium text-gray-900">${customer.totalSpent.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Registration Date:</span>
                    <span className="text-sm text-gray-900">
                      {new Date(customer.registrationDate).toLocaleDateString()}
                    </span>
                  </div>
                  {customer.lastOrderDate && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Last Order:</span>
                      <span className="text-sm text-gray-900">
                        {new Date(customer.lastOrderDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Lead Information */}
            {customer.leadSource && (
              <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                <h4 className="text-lg font-medium text-gray-900 mb-3">Lead Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-gray-600">Lead Source:</span>
                    <span className="text-sm font-medium text-gray-900 ml-2">{customer.leadSource}</span>
                  </div>
                  {customer.leadScore && (
                    <div>
                      <span className="text-sm text-gray-600">Lead Score:</span>
                      <span className={`text-sm font-medium ml-2 ${getLeadScoreColor(customer.leadScore)}`}>
                        {customer.leadScore}/100
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tags */}
            {customer.tags.length > 0 && (
              <div className="mt-6">
                <h4 className="text-lg font-medium text-gray-900 mb-3">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {customer.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      <TagIcon className="h-3 w-3 mr-1" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Notes */}
            {customer.notes && (
              <div className="mt-6">
                <h4 className="text-lg font-medium text-gray-900 mb-3">Notes</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-700">{customer.notes}</p>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="mt-6 flex justify-between">
              <div className="flex items-center space-x-2">
                <select className="border-gray-300 rounded-md text-sm">
                  <option value={customer.status}>Change Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="lead">Lead</option>
                  <option value="vip">VIP</option>
                </select>
                <button className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-700">
                  Update
                </button>
              </div>
              <div className="flex items-center space-x-2">
                <button className="bg-gray-600 text-white px-3 py-1 rounded-md text-sm hover:bg-gray-700">
                  <PhoneIcon className="h-4 w-4 inline mr-1" />
                  Call
                </button>
                <button className="bg-green-600 text-white px-3 py-1 rounded-md text-sm hover:bg-green-700">
                  <EnvelopeIcon className="h-4 w-4 inline mr-1" />
                  Email
                </button>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 px-6 py-3 flex justify-end">
            <button
              onClick={onClose}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm hover:bg-gray-400"
            >
              Close
            </button>
          </div>
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
          <h1 className="text-2xl font-bold text-gray-900">Customer Management</h1>
          <p className="text-gray-600">Manage customers, leads, and track relationships</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <FunnelIcon className="h-4 w-4 mr-2" />
            Filters
          </button>
          <button className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
            Export
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <UserPlusIcon className="h-4 w-4 mr-2" />
            Add Customer
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <UsersIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Customers</p>
              <p className="text-2xl font-semibold text-gray-900">{customers.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Customers</p>
              <p className="text-2xl font-semibold text-gray-900">
                {customers.filter(c => c.status === 'active').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <ClockIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Leads</p>
              <p className="text-2xl font-semibold text-gray-900">
                {customers.filter(c => c.status === 'lead').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <StarIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">VIP Customers</p>
              <p className="text-2xl font-semibold text-gray-900">
                {customers.filter(c => c.status === 'vip').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <div className="relative">
                <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search customers..."
                  value={filters.search}
                  onChange={(e) => setFilters({...filters, search: e.target.value})}
                  className="pl-10 w-full border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({...filters, status: e.target.value})}
                className="w-full border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="lead">Lead</option>
                <option value="vip">VIP</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Lead Source</label>
              <select
                value={filters.leadSource}
                onChange={(e) => setFilters({...filters, leadSource: e.target.value})}
                className="w-full border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Sources</option>
                {leadSources.map(source => (
                  <option key={source} value={source}>{source}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
              <select
                value={filters.dateRange}
                onChange={(e) => setFilters({...filters, dateRange: e.target.value})}
                className="w-full border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="quarter">This Quarter</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Spending</label>
              <select
                value={filters.spendingRange}
                onChange={(e) => setFilters({...filters, spendingRange: e.target.value})}
                className="w-full border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Spending</option>
                <option value="0-100">$0 - $100</option>
                <option value="100-500">$100 - $500</option>
                <option value="500-1000">$500 - $1,000</option>
                <option value="1000+">$1,000+</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Customers Table */}
      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">
              Customers ({filteredCustomers.length})
            </h3>
            {selectedCustomers.length > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">{selectedCustomers.length} selected</span>
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  Bulk Actions
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center">
                    Customer
                    {sortBy === 'name' && (
                      sortOrder === 'asc' ? <ArrowUpIcon className="h-4 w-4 ml-1" /> : <ArrowDownIcon className="h-4 w-4 ml-1" />
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lead Score
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('totalOrders')}
                >
                  <div className="flex items-center">
                    Orders
                    {sortBy === 'totalOrders' && (
                      sortOrder === 'asc' ? <ArrowUpIcon className="h-4 w-4 ml-1" /> : <ArrowDownIcon className="h-4 w-4 ml-1" />
                    )}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('totalSpent')}
                >
                  <div className="flex items-center">
                    Spent
                    {sortBy === 'totalSpent' && (
                      sortOrder === 'asc' ? <ArrowUpIcon className="h-4 w-4 ml-1" /> : <ArrowDownIcon className="h-4 w-4 ml-1" />
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Source
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('registrationDate')}
                >
                  <div className="flex items-center">
                    Registered
                    {sortBy === 'registrationDate' && (
                      sortOrder === 'asc' ? <ArrowUpIcon className="h-4 w-4 ml-1" /> : <ArrowDownIcon className="h-4 w-4 ml-1" />
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <UserIcon className="h-10 w-10 text-gray-400 bg-gray-100 rounded-full p-2" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                        <div className="text-sm text-gray-500">{customer.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(customer.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {customer.leadScore ? (
                      <span className={`text-sm font-medium ${getLeadScoreColor(customer.leadScore)}`}>
                        {customer.leadScore}
                      </span>
                    ) : (
                      <span className="text-sm text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {customer.totalOrders}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ${customer.totalSpent.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {customer.leadSource || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(customer.registrationDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setSelectedCustomer(customer)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </button>
                      <button className="text-gray-600 hover:text-gray-800">
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button className="text-gray-600 hover:text-gray-800">
                        <EllipsisVerticalIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Detail Modal */}
      {selectedCustomer && (
        <CustomerDetailModal
          customer={selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
        />
      )}
    </div>
  );
};

export default CustomerManagement;