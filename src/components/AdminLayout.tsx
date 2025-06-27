'use client';

import React, { useState, ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  HomeIcon,
  ChartBarIcon,
  ShoppingBagIcon,
  ClipboardDocumentListIcon,
  UsersIcon,
  MegaphoneIcon,
  Cog6ToothIcon,
  BellIcon,
  MagnifyingGlassIcon,
  UserCircleIcon,
  CurrencyDollarIcon,
  EnvelopeIcon,
  ChevronDownIcon,
  Bars3Icon,
  XMarkIcon,
  LightBulbIcon,
  CreditCardIcon,
  DocumentTextIcon,
  TagIcon,
  PhoneIcon,
  GlobeAltIcon,
} from '@heroicons/react/24/outline';

interface AdminLayoutProps {
  children: ReactNode;
}

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  children?: NavigationItem[];
}

const navigation: NavigationItem[] = [
  {
    name: 'Dashboard',
    href: '/admin-dashboard',
    icon: HomeIcon,
  },
  {
    name: 'Analytics',
    href: '/admin-dashboard?view=analytics',
    icon: ChartBarIcon,
    children: [
      { name: 'Overview', href: '/admin-dashboard?view=analytics', icon: ChartBarIcon },
      { name: 'Revenue', href: '/admin-dashboard?view=analytics&tab=revenue', icon: CurrencyDollarIcon },
      { name: 'Conversion', href: '/admin-dashboard?view=analytics&tab=conversion', icon: LightBulbIcon },
      { name: 'Traffic', href: '/admin-dashboard?view=analytics&tab=traffic', icon: GlobeAltIcon },
    ],
  },
  {
    name: 'Orders',
    href: '/admin-dashboard?view=orders',
    icon: ClipboardDocumentListIcon,
    badge: '12',
    children: [
      { name: 'All Orders', href: '/admin-dashboard?view=orders', icon: ClipboardDocumentListIcon },
      { name: 'Pending', href: '/admin-dashboard?view=orders&status=pending', icon: ClipboardDocumentListIcon },
      { name: 'Completed', href: '/admin-dashboard?view=orders&status=completed', icon: ClipboardDocumentListIcon },
      { name: 'Refunds', href: '/admin-dashboard?view=orders&status=refunded', icon: CreditCardIcon },
    ],
  },
  {
    name: 'Products',
    href: '/admin-dashboard?view=products',
    icon: ShoppingBagIcon,
    children: [
      { name: 'All Products', href: '/admin-dashboard?view=products', icon: ShoppingBagIcon },
      { name: 'Add Product', href: '/admin-dashboard?view=products&action=new', icon: ShoppingBagIcon },
      { name: 'Categories', href: '/admin-dashboard?view=products&tab=categories', icon: TagIcon },
      { name: 'Inventory', href: '/admin-dashboard?view=products&tab=inventory', icon: DocumentTextIcon },
    ],
  },
  {
    name: 'Customers',
    href: '/admin-dashboard?view=customers',
    icon: UsersIcon,
    children: [
      { name: 'All Customers', href: '/admin-dashboard?view=customers', icon: UsersIcon },
      { name: 'Leads', href: '/admin-dashboard?view=customers&status=lead', icon: UserCircleIcon },
      { name: 'VIP Customers', href: '/admin-dashboard?view=customers&status=vip', icon: UsersIcon },
      { name: 'Support Tickets', href: '/admin-dashboard?view=customers&tab=support', icon: PhoneIcon },
    ],
  },
  {
    name: 'Marketing',
    href: '/admin-dashboard?view=marketing',
    icon: MegaphoneIcon,
    children: [
      { name: 'Campaigns', href: '/admin-dashboard?view=marketing&tab=campaigns', icon: MegaphoneIcon },
      { name: 'Email Marketing', href: '/admin-dashboard?view=marketing&tab=email', icon: EnvelopeIcon },
      { name: 'Promotions', href: '/admin-dashboard?view=marketing&tab=promotions', icon: TagIcon },
      { name: 'SEO Tools', href: '/admin-dashboard?view=marketing&tab=seo', icon: GlobeAltIcon },
    ],
  },
  {
    name: 'Settings',
    href: '/admin-dashboard?view=settings',
    icon: Cog6ToothIcon,
    children: [
      { name: 'General', href: '/admin-dashboard?view=settings&tab=general', icon: Cog6ToothIcon },
      { name: 'Payment', href: '/admin-dashboard?view=settings&tab=payment', icon: CreditCardIcon },
      { name: 'Email', href: '/admin-dashboard?view=settings&tab=email', icon: EnvelopeIcon },
      { name: 'Users', href: '/admin-dashboard?view=settings&tab=users', icon: UsersIcon },
    ],
  },
];

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>(['Dashboard']);
  const pathname = usePathname();

  const toggleExpanded = (itemName: string) => {
    setExpandedItems(prev =>
      prev.includes(itemName)
        ? prev.filter(item => item !== itemName)
        : [...prev, itemName]
    );
  };

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + '/');
  };

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex h-16 shrink-0 items-center px-6 border-b border-gray-200">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="h-8 w-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">WR</span>
            </div>
          </div>
          <div className="ml-3">
            <h1 className="text-lg font-semibold text-gray-900">WipeThatRecord</h1>
            <p className="text-xs text-gray-500">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {navigation.map((item) => (
          <div key={item.name}>
            {item.children ? (
              <>
                <button
                  onClick={() => toggleExpanded(item.name)}
                  className={`w-full group flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    expandedItems.includes(item.name) || item.children.some(child => isActive(child.href))
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center">
                    <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                    {item.name}
                    {item.badge && (
                      <span className="ml-auto inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <ChevronDownIcon
                    className={`h-4 w-4 transition-transform ${
                      expandedItems.includes(item.name) ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {expandedItems.includes(item.name) && (
                  <div className="mt-2 space-y-1 ml-6">
                    {item.children.map((child) => (
                      <Link
                        key={child.name}
                        href={child.href}
                        className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                          isActive(child.href)
                            ? 'bg-blue-100 text-blue-700 border-l-2 border-blue-500'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        <child.icon className="mr-3 h-4 w-4 flex-shrink-0" />
                        {child.name}
                      </Link>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <Link
                href={item.href}
                className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isActive(item.href)
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                {item.name}
                {item.badge && (
                  <span className="ml-auto inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    {item.badge}
                  </span>
                )}
              </Link>
            )}
          </div>
        ))}
      </nav>

      {/* User Profile */}
      <div className="flex-shrink-0 border-t border-gray-200 p-4">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <UserCircleIcon className="h-8 w-8 text-gray-400" />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">Admin User</p>
            <p className="text-xs text-gray-500">admin@wipethatrecord.com</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <div className="lg:hidden">
        {sidebarOpen && (
          <div className="relative z-50 lg:hidden">
            <div className="fixed inset-0 bg-gray-900/80" onClick={() => setSidebarOpen(false)} />
            <div className="fixed inset-0 flex">
              <div className="relative mr-16 flex w-full max-w-xs flex-1">
                <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                  <button
                    type="button"
                    className="-m-2.5 p-2.5"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <span className="sr-only">Close sidebar</span>
                    <XMarkIcon className="h-6 w-6 text-white" />
                  </button>
                </div>
                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-2">
                  <SidebarContent />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Static sidebar for desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white border-r border-gray-200">
          <SidebarContent />
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-72">
        {/* Top navigation */}
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon className="h-6 w-6" />
          </button>

          {/* Separator */}
          <div className="h-6 w-px bg-gray-200 lg:hidden" />

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            {/* Search */}
            <form className="relative flex flex-1" action="#" method="GET">
              <label htmlFor="search-field" className="sr-only">
                Search
              </label>
              <MagnifyingGlassIcon className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-400" />
              <input
                id="search-field"
                className="block h-full w-full border-0 py-0 pl-8 pr-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm"
                placeholder="Search orders, customers, products..."
                type="search"
                name="search"
              />
            </form>

            <div className="flex items-center gap-x-4 lg:gap-x-6">
              {/* Notifications */}
              <button
                type="button"
                className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500 relative"
              >
                <span className="sr-only">View notifications</span>
                <BellIcon className="h-6 w-6" />
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                  3
                </span>
              </button>

              {/* Separator */}
              <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200" />

              {/* Profile dropdown */}
              <div className="relative">
                <button
                  type="button"
                  className="flex items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-gray-900"
                >
                  <UserCircleIcon className="h-8 w-8 text-gray-400" />
                  <span className="hidden lg:flex lg:items-center">
                    <span className="ml-2 text-sm font-medium text-gray-700">Admin</span>
                    <ChevronDownIcon className="ml-2 h-5 w-5 text-gray-400" />
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="py-8">
          <div className="px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;