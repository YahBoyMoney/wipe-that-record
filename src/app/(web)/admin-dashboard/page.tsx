'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';

// Dynamic import to avoid SSR issues with the admin panel
const ProductsAdminPanel = dynamic(() => import('@/views/ProductsAdminPanel'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  )
});

const EnhancedDashboard = dynamic(() => import('@/views/EnhancedDashboard'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  )
});

function AdminDashboardContent() {
  const searchParams = useSearchParams();
  const view = searchParams?.get('view') || 'dashboard';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <div className="bg-white shadow border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                WipeThatRecord Admin Dashboard
              </h1>
              <p className="text-gray-600">
                Complete business management and analytics platform
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <a
                href="/admin"
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                Payload Admin
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b">
        <div className="px-6">
          <nav className="flex space-x-8">
            <a
              href="/admin-dashboard?view=dashboard"
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                view === 'dashboard'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              📊 Dashboard
            </a>
            <a
              href="/admin-dashboard?view=products"
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                view === 'products'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              📦 Products
            </a>
            <a
              href="/admin/collections/orders"
              className="py-4 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 font-medium text-sm"
              target="_blank"
              rel="noopener noreferrer"
            >
              📋 Orders
            </a>
            <a
              href="/admin/collections/leads"
              className="py-4 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 font-medium text-sm"
              target="_blank"
              rel="noopener noreferrer"
            >
              👥 Customers
            </a>
            <a
              href="/admin/collections/analytics"
              className="py-4 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 font-medium text-sm"
              target="_blank"
              rel="noopener noreferrer"
            >
              📈 Analytics
            </a>
          </nav>
        </div>
      </div>

      {/* Content */}
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      }>
        {view === 'products' ? (
          <ProductsAdminPanel />
        ) : (
          <EnhancedDashboard />
        )}
      </Suspense>
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    }>
      <AdminDashboardContent />
    </Suspense>
  );
} 