'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import AdminSidebar from '@/components/AdminSidebar';

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

const OrdersAdminPanel = dynamic(() => import('@/views/OrdersAdminPanel'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  )
});

const LeadsKanban = dynamic(() => import('@/views/LeadsKanban'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  )
});

const MarketingCenter = dynamic(() => import('@/views/MarketingCenter'), {
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
    <div className="min-h-screen flex bg-gray-50">
      <AdminSidebar activeSection={view === 'products' ? 'products' : view === 'orders' ? 'orders' : view === 'leads' ? 'leads' : view === 'marketing' ? 'marketing' : 'overview'} />
      <main className="flex-1 overflow-y-auto">
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>}>
          {view === 'products' ? (
            <ProductsAdminPanel />
          ) : view === 'orders' ? (
            <OrdersAdminPanel />
          ) : view === 'marketing' ? (
            <MarketingCenter />
          ) : view === 'leads' ? (
            <LeadsKanban />
          ) : (
            <EnhancedDashboard />
          )}
        </Suspense>
      </main>
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