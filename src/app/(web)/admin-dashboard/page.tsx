'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import AdminLayout from '@/components/AdminLayout';

// Dynamic import with new professional components
const ProfessionalDashboard = dynamic(() => import('@/components/ProfessionalDashboard'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  )
});

const ProductManagement = dynamic(() => import('@/components/ProductManagement'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  )
});

const OrderManagement = dynamic(() => import('@/components/OrderManagement'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  )
});

const CustomerManagement = dynamic(() => import('@/components/CustomerManagement'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  )
});

const AnalyticsDashboard = dynamic(() => import('@/components/AnalyticsDashboard'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  )
});

const AnalyticsReporting = dynamic(() => import('@/components/AnalyticsReporting'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  )
});

const MarketingCenter = dynamic(() => import('@/components/MarketingCenter'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  )
});

const SettingsConfiguration = dynamic(() => import('@/components/SettingsConfiguration'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  )
});

// Fallback components for existing views during migration
const LeadsKanban = dynamic(() => import('@/views/LeadsKanban'), {
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

  const renderView = () => {
    switch (view) {
      case 'products':
        return <ProductManagement />;
      case 'orders':
        return <OrderManagement />;
      case 'customers':
        return <CustomerManagement />;
      case 'analytics':
        return <AnalyticsReporting />;
      case 'analytics-old':
        return <AnalyticsDashboard />;
      case 'leads':
        return <LeadsKanban />;
      case 'marketing':
        return <MarketingCenter />;
      case 'settings':
        return <SettingsConfiguration />;
      default:
        return <ProfessionalDashboard />;
    }
  };

  return (
    <AdminLayout>
      <Suspense 
        fallback={
          <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        }
      >
        {renderView()}
      </Suspense>
    </AdminLayout>
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