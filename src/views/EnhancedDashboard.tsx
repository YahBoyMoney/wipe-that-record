'use client';

import React, { useEffect, useState } from 'react';

interface DashboardMetrics {
  revenue: {
    today: number;
    yesterday: number;
    week: number;
    month: number;
  };
  orders: {
    today: number;
    yesterday: number;
    pending: number;
    completed: number;
  };
  products: {
    total: number;
    lowStock: number;
    outOfStock: number;
  };
  customers: {
    total: number;
    new: number;
    returning: number;
  };
  topProducts: Array<{
    name: string;
    sales: number;
    revenue: number;
  }>;
  recentOrders: Array<{
    id: string;
    customer: string;
    total: number;
    status: string;
    date: string;
  }>;
  alerts: Array<{
    type: 'success' | 'warning' | 'error' | 'info';
    message: string;
    action?: string;
  }>;
}

export default function EnhancedDashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/dashboard-metrics');
      const data = await response.json();
      setMetrics(data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const calculateGrowth = (current: number, previous: number) => {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                WipeThatRecord Dashboard
              </h1>
              <p className="text-gray-600">
                Comprehensive business analytics and management
              </p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={fetchDashboardData}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Refresh Data
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="px-6">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'orders', label: 'Orders' },
              { id: 'products', label: 'Products' },
              { id: 'customers', label: 'Customers' },
              { id: 'analytics', label: 'Analytics' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="px-6 py-6">
        {/* Alerts */}
        {metrics?.alerts && metrics.alerts.length > 0 && (
          <div className="mb-6">
            <div className="space-y-2">
              {metrics.alerts.map((alert, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg ${
                    alert.type === 'success' ? 'bg-green-50 border border-green-200' :
                    alert.type === 'warning' ? 'bg-yellow-50 border border-yellow-200' :
                    alert.type === 'error' ? 'bg-red-50 border border-red-200' :
                    'bg-blue-50 border border-blue-200'
                  }`}
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      {alert.type === 'success' && (
                        <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      )}
                      {alert.type === 'warning' && (
                        <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <div className="ml-3">
                      <p className={`text-sm font-medium ${
                        alert.type === 'success' ? 'text-green-800' :
                        alert.type === 'warning' ? 'text-yellow-800' :
                        alert.type === 'error' ? 'text-red-800' :
                        'text-blue-800'
                      }`}>
                        {alert.message}
                      </p>
                      {alert.action && (
                        <p className={`mt-1 text-sm ${
                          alert.type === 'success' ? 'text-green-700' :
                          alert.type === 'warning' ? 'text-yellow-700' :
                          alert.type === 'error' ? 'text-red-700' :
                          'text-blue-700'
                        }`}>
                          Action: {alert.action}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Main Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Key Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Revenue Card */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Today's Revenue
                      </dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">
                          {formatCurrency(metrics?.revenue.today || 0)}
                        </div>
                        <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                          calculateGrowth(metrics?.revenue.today || 0, metrics?.revenue.yesterday || 0) >= 0
                            ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {calculateGrowth(metrics?.revenue.today || 0, metrics?.revenue.yesterday || 0) >= 0 ? '↗' : '↘'}
                          {Math.abs(calculateGrowth(metrics?.revenue.today || 0, metrics?.revenue.yesterday || 0)).toFixed(1)}%
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>

              {/* Orders Card */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Today's Orders
                      </dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">
                          {metrics?.orders.today || 0}
                        </div>
                        <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                          calculateGrowth(metrics?.orders.today || 0, metrics?.orders.yesterday || 0) >= 0
                            ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {calculateGrowth(metrics?.orders.today || 0, metrics?.orders.yesterday || 0) >= 0 ? '↗' : '↘'}
                          {Math.abs(calculateGrowth(metrics?.orders.today || 0, metrics?.orders.yesterday || 0)).toFixed(1)}%
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>

              {/* Products Card */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Active Products
                      </dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">
                          {metrics?.products.total || 0}
                        </div>
                        {(metrics?.products.lowStock || 0) > 0 && (
                          <div className="ml-2 flex items-baseline text-sm font-semibold text-orange-600">
                            {metrics?.products.lowStock} low stock
                          </div>
                        )}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>

              {/* Customers Card */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-indigo-500 rounded-md flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Total Customers
                      </dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">
                          {metrics?.customers.total || 0}
                        </div>
                        <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                          +{metrics?.customers.new || 0} new
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Products */}
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Top Products</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {metrics?.topProducts?.map((product, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-blue-600">{index + 1}</span>
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">{product.name}</p>
                            <p className="text-sm text-gray-500">{product.sales} sales</p>
                          </div>
                        </div>
                        <div className="text-sm font-medium text-gray-900">
                          {formatCurrency(product.revenue)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recent Orders */}
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Recent Orders</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {metrics?.recentOrders?.map((order, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">#{order.id}</p>
                          <p className="text-sm text-gray-500">{order.customer}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">
                            {formatCurrency(order.total)}
                          </p>
                          <p className={`text-xs ${
                            order.status === 'completed' ? 'text-green-600' :
                            order.status === 'processing' ? 'text-yellow-600' :
                            'text-gray-600'
                          }`}>
                            {order.status}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Other tab content would go here */}
        {activeTab !== 'overview' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Management
            </h3>
            <p className="text-gray-600">
              This section is under development. Use the Payload admin interface for detailed {activeTab} management.
            </p>
            <div className="mt-4">
              <a
                href={`/admin/collections/${activeTab === 'customers' ? 'leads' : activeTab}`}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                Manage {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 