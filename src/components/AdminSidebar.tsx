import Link from 'next/link';
import { BarChart3, Users, FileText, DollarSign, TrendingUp, Menu } from 'lucide-react';
import React from 'react';

interface SidebarProps {
  activeSection?: string;
}

export default function AdminSidebar({ activeSection = 'overview' }: SidebarProps) {
  const items = [
    { name: 'Overview', href: '/admin-dashboard', icon: BarChart3, section: 'overview' },
    { name: 'Leads', href: '/admin-dashboard?view=leads', icon: Users, section: 'leads' },
    { name: 'Products', href: '/admin-dashboard?view=products', icon: FileText, section: 'products' },
    { name: 'Orders', href: '/admin-dashboard?view=orders', icon: DollarSign, section: 'orders' },
    { name: 'Marketing', href: '/admin-dashboard?view=marketing', icon: TrendingUp, section: 'marketing' },
    { name: 'Analytics', href: '/admin/collections/analytics', icon: BarChart3, section: 'analytics' },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen bg-white border-r shadow-sm">
      <div className="h-14 px-6 flex items-center border-b">
        <Link href="/admin-dashboard" className="flex items-center space-x-2 font-semibold text-gray-800">
          <Menu className="h-5 w-5 text-blue-600" />
          <span>Wipe Admin</span>
        </Link>
      </div>
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {items.map(({ name, href, icon: Icon, section }) => (
          <Link
            key={section}
            href={href}
            className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              activeSection === section
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Icon className="h-4 w-4" />
            {name}
          </Link>
        ))}
      </nav>
    </aside>
  );
} 