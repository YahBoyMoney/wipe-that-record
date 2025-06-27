'use client';

import React, { useState, useEffect } from 'react';
import {
  MagnifyingGlassIcon,
  EllipsisVerticalIcon,
  EyeIcon,
  PencilIcon,
  PrinterIcon,
  ArrowDownTrayIcon,
  FunnelIcon,
  CalendarDaysIcon,
  CurrencyDollarIcon,
  ClipboardDocumentListIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  PaperAirplaneIcon,
  PhoneIcon,
  EnvelopeIcon,
  UserIcon,
} from '@heroicons/react/24/outline';

interface Order {
  id: string;
  orderNumber: string;
  customer: {
    name: string;
    email: string;
    phone?: string;
    avatar?: string;
  };
  products: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  status: 'pending' | 'processing' | 'completed' | 'cancelled' | 'refunded';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  total: number;
  createdAt: string;
  updatedAt: string;
  notes?: string;
  shippingAddress?: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
}

interface OrderFilters {
  status: string;
  paymentStatus: string;
  dateRange: string;
  search: string;
}

const OrderManagement: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  
  const [filters, setFilters] = useState<OrderFilters>({
    status: 'all',
    paymentStatus: 'all',
    dateRange: 'all',
    search: '',
  });

  // Mock data - replace with actual API call
  const mockOrders: Order[] = [
    {
      id: '1',
      orderNumber: 'WR-2024-001',
      customer: {
        name: 'John Smith',
        email: 'john.smith@email.com',
        phone: '(555) 123-4567',
      },
      products: [
        { id: '1', name: 'Full Service Expungement', price: 1500, quantity: 1 },
      ],
      status: 'processing',
      paymentStatus: 'paid',
      total: 1500,
      createdAt: '2024-06-27T10:30:00Z',
      updatedAt: '2024-06-27T11:00:00Z',
      notes: 'DUI case from 2019, customer urgent',
      shippingAddress: {
        street: '123 Main St',
        city: 'Los Angeles',
        state: 'CA',
        zip: '90210',
      },
    },
    {
      id: '2',
      orderNumber: 'WR-2024-002',
      customer: {
        name: 'Sarah Johnson',
        email: 'sarah.j@email.com',
        phone: '(555) 987-6543',
      },
      products: [
        { id: '2', name: 'Review & Filing Service', price: 100, quantity: 1 },
      ],
      status: 'completed',
      paymentStatus: 'paid',
      total: 100,
      createdAt: '2024-06-26T14:20:00Z',
      updatedAt: '2024-06-27T09:15:00Z',
      notes: 'Misdemeanor case, completed successfully',
    },
    {
      id: '3',
      orderNumber: 'WR-2024-003',
      customer: {
        name: 'Michael Brown',
        email: 'mike.brown@email.com',
      },
      products: [
        { id: '1', name: 'DIY Expungement Kit', price: 50, quantity: 1 },
      ],
      status: 'pending',
      paymentStatus: 'pending',
      total: 50,
      createdAt: '2024-06-27T08:45:00Z',
      updatedAt: '2024-06-27T08:45:00Z',
    },
    {
      id: '4',
      orderNumber: 'WR-2024-004',
      customer: {
        name: 'Lisa Davis',
        email: 'lisa.davis@email.com',
        phone: '(555) 456-7890',
      },
      products: [
        { id: '3', name: 'Legal Consultation', price: 150, quantity: 1 },
        { id: '2', name: 'Review & Filing Service', price: 100, quantity: 1 },
      ],
      status: 'completed',
      paymentStatus: 'paid',
      total: 250,
      createdAt: '2024-06-25T16:30:00Z',
      updatedAt: '2024-06-26T10:20:00Z',
      notes: 'Multiple offenses, consultation completed',
    },
    {
      id: '5',
      orderNumber: 'WR-2024-005',
      customer: {
        name: 'Robert Wilson',
        email: 'robert.w@email.com',
      },
      products: [
        { id: '1', name: 'Full Service Expungement', price: 1500, quantity: 1 },
      ],
      status: 'cancelled',
      paymentStatus: 'refunded',
      total: 1500,
      createdAt: '2024-06-24T11:15:00Z',
      updatedAt: '2024-06-25T13:45:00Z',
      notes: 'Customer requested cancellation',
    },
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setOrders(mockOrders);
      setFilteredOrders(mockOrders);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = orders.filter(order => {
      const matchesSearch = 
        order.orderNumber.toLowerCase().includes(filters.search.toLowerCase()) ||
        order.customer.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        order.customer.email.toLowerCase().includes(filters.search.toLowerCase());
      
      const matchesStatus = filters.status === 'all' || order.status === filters.status;
      const matchesPaymentStatus = filters.paymentStatus === 'all' || order.paymentStatus === filters.paymentStatus;
      
      // Date range filtering would go here
      
      return matchesSearch && matchesStatus && matchesPaymentStatus;
    });

    // Sort orders
    filtered.sort((a, b) => {
      let aValue = a[sortBy as keyof Order];
      let bValue = b[sortBy as keyof Order];
      
      if (sortBy === 'createdAt' || sortBy === 'updatedAt') {
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

    setFilteredOrders(filtered);
  }, [orders, filters, sortBy, sortOrder]);

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
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      refunded: 'bg-gray-100 text-gray-800',
    };
    
    const icons = {
      pending: ClockIcon,
      processing: ClipboardDocumentListIcon,
      completed: CheckCircleIcon,
      cancelled: XCircleIcon,
      refunded: ArrowDownTrayIcon,
    };
    
    const Icon = icons[status as keyof typeof icons];
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`}>
        <Icon className="h-3 w-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getPaymentStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      paid: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      refunded: 'bg-gray-100 text-gray-800',
    };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const OrderDetailModal: React.FC<{ order: Order; onClose: () => void }> = ({ order, onClose }) => (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity">
          <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={onClose}></div>
        </div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <div className="bg-white px-6 pt-6 pb-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Order {order.orderNumber}</h3>
              <div className="flex items-center space-x-2">
                {getStatusBadge(order.status)}
                {getPaymentStatusBadge(order.paymentStatus)}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Customer Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-lg font-medium text-gray-900 mb-3">Customer Information</h4>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <UserIcon className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-900">{order.customer.name}</span>
                  </div>
                  <div className="flex items-center">
                    <EnvelopeIcon className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-900">{order.customer.email}</span>
                  </div>
                  {order.customer.phone && (
                    <div className="flex items-center">
                      <PhoneIcon className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900">{order.customer.phone}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Order Details */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-lg font-medium text-gray-900 mb-3">Order Details</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Order Date:</span>
                    <span className="text-sm text-gray-900">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Last Updated:</span>
                    <span className="text-sm text-gray-900">
                      {new Date(order.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Amount:</span>
                    <span className="text-sm font-medium text-gray-900">
                      ${order.total.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Products */}
            <div className="mt-6">
              <h4 className="text-lg font-medium text-gray-900 mb-3">Products</h4>
              <div className="bg-gray-50 rounded-lg overflow-hidden">
                <table className="min-w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {order.products.map((product) => (
                      <tr key={product.id}>
                        <td className="px-4 py-2 text-sm text-gray-900">{product.name}</td>
                        <td className="px-4 py-2 text-sm text-gray-900">{product.quantity}</td>
                        <td className="px-4 py-2 text-sm text-gray-900">${product.price}</td>
                        <td className="px-4 py-2 text-sm text-gray-900">${product.price * product.quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Notes */}
            {order.notes && (
              <div className="mt-6">
                <h4 className="text-lg font-medium text-gray-900 mb-3">Notes</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-700">{order.notes}</p>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="mt-6 flex justify-between">
              <div className="flex items-center space-x-2">
                <select className="border-gray-300 rounded-md text-sm">
                  <option value={order.status}>Change Status</option>
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <button className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-700">
                  Update
                </button>
              </div>
              <div className="flex items-center space-x-2">
                <button className="bg-gray-600 text-white px-3 py-1 rounded-md text-sm hover:bg-gray-700">
                  <PrinterIcon className="h-4 w-4 inline mr-1" />
                  Print
                </button>
                <button className="bg-green-600 text-white px-3 py-1 rounded-md text-sm hover:bg-green-700">
                  <PaperAirplaneIcon className="h-4 w-4 inline mr-1" />
                  Email Customer
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
          <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
          <p className="text-gray-600">Track and manage all customer orders</p>
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
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <ClipboardDocumentListIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-2xl font-semibold text-gray-900">{orders.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CurrencyDollarIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-semibold text-gray-900">
                ${orders.reduce((sum, o) => sum + o.total, 0).toLocaleString()}
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
              <p className="text-sm font-medium text-gray-600">Pending Orders</p>
              <p className="text-2xl font-semibold text-gray-900">
                {orders.filter(o => o.status === 'pending').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <CheckCircleIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed Orders</p>
              <p className="text-2xl font-semibold text-gray-900">
                {orders.filter(o => o.status === 'completed').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <div className="relative">
                <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search orders..."
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
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Payment Status</label>
              <select
                value={filters.paymentStatus}
                onChange={(e) => setFilters({...filters, paymentStatus: e.target.value})}
                className="w-full border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Payment Status</option>
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
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
          </div>
        </div>
      )}

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">
              Orders ({filteredOrders.length})
            </h3>
            {selectedOrders.length > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">{selectedOrders.length} selected</span>
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
                  onClick={() => handleSort('orderNumber')}
                >
                  <div className="flex items-center">
                    Order
                    {sortBy === 'orderNumber' && (
                      sortOrder === 'asc' ? <ArrowUpIcon className="h-4 w-4 ml-1" /> : <ArrowDownIcon className="h-4 w-4 ml-1" />
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Products
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('total')}
                >
                  <div className="flex items-center">
                    Total
                    {sortBy === 'total' && (
                      sortOrder === 'asc' ? <ArrowUpIcon className="h-4 w-4 ml-1" /> : <ArrowDownIcon className="h-4 w-4 ml-1" />
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('createdAt')}
                >
                  <div className="flex items-center">
                    Date
                    {sortBy === 'createdAt' && (
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
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{order.orderNumber}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{order.customer.name}</div>
                      <div className="text-sm text-gray-500">{order.customer.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {order.products.map(p => p.name).join(', ')}
                    </div>
                    <div className="text-sm text-gray-500">{order.products.length} item(s)</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ${order.total.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(order.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getPaymentStatusBadge(order.paymentStatus)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setSelectedOrder(order)}
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

      {/* Order Detail Modal */}
      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
};

export default OrderManagement;