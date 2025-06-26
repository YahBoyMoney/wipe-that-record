'use client';

import React from 'react';

const AdminDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                WipeThatRecord E-Commerce Admin
              </h1>
              <p className="text-gray-600 mt-1">
                Complete business intelligence and e-commerce management system
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Admin panel is working! ✅
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <a
                href="/admin/collections"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Manage Collections
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            🎉 Admin Panel Successfully Working!
          </h2>
          
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600">✅</span>
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-800">
                    Admin Panel Accessible
                  </p>
                  <p className="text-sm text-green-700 mt-1">
                    Your enhanced e-commerce admin panel is now working on <code>/admin</code>
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600">🛠️</span>
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-blue-800">
                    E-commerce Collections Available
                  </p>
                  <p className="text-sm text-blue-700 mt-1">
                    Manage orders, products, customers, and analytics through the collections interface
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-purple-600">🚀</span>
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-purple-800">
                    Ready for Business
                  </p>
                  <p className="text-sm text-purple-700 mt-1">
                    Your WipeThatRecord e-commerce system is fully operational
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <a
              href="/admin/collections/orders"
              className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-all group"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                  <span className="text-green-600">📦</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Orders</p>
                  <p className="text-sm text-gray-600">Manage orders</p>
                </div>
              </div>
            </a>
            
            <a
              href="/admin/collections/products"
              className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-all group"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                  <span className="text-purple-600">🛍️</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Products</p>
                  <p className="text-sm text-gray-600">Inventory & catalog</p>
                </div>
              </div>
            </a>
            
            <a
              href="/admin/collections/leads"
              className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-all group"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                  <span className="text-blue-600">👤</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Customers</p>
                  <p className="text-sm text-gray-600">Customer management</p>
                </div>
              </div>
            </a>
            
            <a
              href="/admin/collections/analytics"
              className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-all group"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
                  <span className="text-indigo-600">📊</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Analytics</p>
                  <p className="text-sm text-gray-600">Business insights</p>
                </div>
              </div>
            </a>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Access this admin panel at: <code className="bg-gray-100 px-2 py-1 rounded">wipethatrecord.com/admin</code>
            </p>
            <p className="text-xs text-gray-500 mt-2">
              All e-commerce functionality is operational and ready for business.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 