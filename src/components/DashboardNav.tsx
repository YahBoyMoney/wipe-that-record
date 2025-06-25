'use client';

import React from 'react';
import Link from 'next/link';
import { 
  BarChart3, 
  Users, 
  Mail, 
  DollarSign, 
  Settings, 
  Target, 
  TrendingUp,
  FileText,
  MapPin,
  Clock,
  Award,
  AlertTriangle,
  Download,
  RefreshCw
} from 'lucide-react';

interface DashboardNavProps {
  activeSection?: string;
  userRole?: string;
}

export default function DashboardNav({ activeSection = 'overview', userRole = 'admin' }: DashboardNavProps) {
  const navigationItems = [
    {
      name: 'Overview',
      href: '/admin/dashboard',
      icon: BarChart3,
      section: 'overview',
      description: 'Key metrics and performance',
      roles: ['superadmin', 'admin', 'manager'],
    },
    {
      name: 'Lead Management',
      href: '/admin/collections/leads',
      icon: Users,
      section: 'leads',
      description: 'All leads and customers',
      roles: ['superadmin', 'admin', 'manager'],
    },
    {
      name: 'Revenue Analytics',
      href: '/admin/dashboard/revenue',
      icon: DollarSign,
      section: 'revenue',
      description: 'Financial performance',
      roles: ['superadmin', 'admin'],
    },
    {
      name: 'Conversion Funnel',
      href: '/admin/dashboard/funnel',
      icon: Target,
      section: 'funnel',
      description: 'Sales funnel analysis',
      roles: ['superadmin', 'admin', 'manager'],
    },
    {
      name: 'Email Marketing',
      href: '/admin/dashboard/email',
      icon: Mail,
      section: 'email',
      description: 'Email campaigns & automation',
      roles: ['superadmin', 'admin', 'marketing'],
    },
    {
      name: 'Geographic Data',
      href: '/admin/dashboard/geographic',
      icon: MapPin,
      section: 'geographic',
      description: 'Location-based insights',
      roles: ['superadmin', 'admin'],
    },
    {
      name: 'Performance Trends',
      href: '/admin/dashboard/trends',
      icon: TrendingUp,
      section: 'trends',
      description: 'Historical performance',
      roles: ['superadmin', 'admin'],
    },
    {
      name: 'Quality Scoring',
      href: '/admin/dashboard/quality',
      icon: Award,
      section: 'quality',
      description: 'Lead quality metrics',
      roles: ['superadmin', 'admin', 'manager'],
    },
    {
      name: 'Real-time Monitor',
      href: '/admin/dashboard/realtime',
      icon: Clock,
      section: 'realtime',
      description: 'Live activity feed',
      roles: ['superadmin', 'admin'],
    },
    {
      name: 'Reports & Export',
      href: '/admin/dashboard/reports',
      icon: FileText,
      section: 'reports',
      description: 'Generate custom reports',
      roles: ['superadmin', 'admin'],
    },
    {
      name: 'Alert Center',
      href: '/admin/dashboard/alerts',
      icon: AlertTriangle,
      section: 'alerts',
      description: 'System notifications',
      roles: ['superadmin', 'admin'],
    },
    {
      name: 'User Management',
      href: '/admin/collections/users',
      icon: Settings,
      section: 'users',
      description: 'Manage system users',
      roles: ['superadmin'],
    },
  ];

  // Filter items based on user role
  const visibleItems = navigationItems.filter(item => 
    item.roles.includes(userRole) || userRole === 'superadmin'
  );

  // Quick actions for superadmin
  const quickActions = [
    {
      name: 'Export All Data',
      action: 'export-all',
      icon: Download,
      roles: ['superadmin', 'admin'],
    },
    {
      name: 'Refresh Analytics',
      action: 'refresh',
      icon: RefreshCw,
      roles: ['superadmin', 'admin', 'manager'],
    },
    {
      name: 'Initialize Admin',
      action: 'init-admin',
      icon: Settings,
      roles: ['superadmin'],
    },
  ];

  const handleQuickAction = async (action: string) => {
    switch (action) {
      case 'export-all':
        window.open('/api/analytics?export=csv', '_blank');
        break;
      case 'refresh':
        window.location.reload();
        break;
      case 'init-admin':
        try {
          const response = await fetch('/api/init-admin', { method: 'POST' });
          const result = await response.json();
          alert(result.message || 'Admin user initialized');
        } catch (error) {
          alert('Error initializing admin user');
        }
        break;
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          🎛️ Admin Control Center
        </h2>
        <p className="text-gray-600">
          Comprehensive business intelligence and management dashboard
        </p>
        {userRole === 'superadmin' && (
          <div className="mt-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
            <Award className="h-3 w-3 mr-1" />
            Super Administrator
          </div>
        )}
      </div>

      {/* Quick Actions */}
      {userRole === 'superadmin' && (
        <div className="mb-6 p-4 bg-purple-50 rounded-lg">
          <h3 className="text-sm font-semibold text-purple-900 mb-3">Quick Actions</h3>
          <div className="flex flex-wrap gap-2">
            {quickActions
              .filter(action => action.roles.includes(userRole))
              .map((action) => (
                <button
                  key={action.action}
                  onClick={() => handleQuickAction(action.action)}
                  className="inline-flex items-center px-3 py-1 rounded-md text-xs font-medium bg-purple-100 text-purple-700 hover:bg-purple-200 transition-colors"
                >
                  <action.icon className="h-3 w-3 mr-1" />
                  {action.name}
                </button>
              ))
            }
          </div>
        </div>
      )}

      {/* Navigation Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {visibleItems.map((item) => {
          const isActive = activeSection === item.section;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.section}
              href={item.href}
              className={`group relative p-4 rounded-lg border-2 transition-all duration-200 ${
                isActive
                  ? 'border-blue-500 bg-blue-50 shadow-md'
                  : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className={`flex-shrink-0 p-2 rounded-lg ${
                  isActive 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100 text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-600'
                }`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className={`text-sm font-semibold ${
                    isActive ? 'text-blue-900' : 'text-gray-900'
                  }`}>
                    {item.name}
                  </h3>
                  <p className={`text-xs mt-1 ${
                    isActive ? 'text-blue-700' : 'text-gray-500'
                  }`}>
                    {item.description}
                  </p>
                </div>
              </div>
              
              {/* Active indicator */}
              {isActive && (
                <div className="absolute top-2 right-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                </div>
              )}
            </Link>
          );
        })}
      </div>

      {/* Stats Summary for Quick Reference */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-gray-900" id="quick-leads">-</div>
            <div className="text-xs text-gray-500">Total Leads</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600" id="quick-revenue">-</div>
            <div className="text-xs text-gray-500">Total Revenue</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600" id="quick-conversion">-</div>
            <div className="text-xs text-gray-500">Conversion Rate</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600" id="quick-today">-</div>
            <div className="text-xs text-gray-500">Today's Leads</div>
          </div>
        </div>
      </div>

      {/* Auto-refresh stats */}
      <script dangerouslySetInnerHTML={{
        __html: `
          async function refreshQuickStats() {
            try {
              const response = await fetch('/api/analytics');
              const data = await response.json();
              
              document.getElementById('quick-leads').textContent = data.overview.totalLeads.toLocaleString();
              document.getElementById('quick-revenue').textContent = '$' + data.overview.totalRevenue.toLocaleString();
              document.getElementById('quick-conversion').textContent = data.overview.conversionRate + '%';
              document.getElementById('quick-today').textContent = data.overview.todayLeads.toLocaleString();
            } catch (error) {
              console.error('Failed to refresh stats:', error);
            }
          }
          
          // Refresh on load and every 30 seconds
          refreshQuickStats();
          setInterval(refreshQuickStats, 30000);
        `
      }} />
    </div>
  );
} 