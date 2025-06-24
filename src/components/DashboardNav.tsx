import React from 'react';

const DashboardNav: React.FC = () => {
  return (
    <nav className="bg-white border-b border-gray-200 px-8 py-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center space-x-4">
          <a 
            href="/admin" 
            className="text-sm font-medium text-gray-500 hover:text-gray-700"
          >
            Admin
          </a>
          <svg className="flex-shrink-0 h-4 w-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
          <span className="text-sm font-medium text-gray-900">Analytics Dashboard</span>
        </div>
        <div className="mt-2">
          <div className="flex space-x-6">
            <a 
              href="/admin/collections/leads" 
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              📧 Leads Collection
            </a>
            <a 
              href="/admin/collections/users" 
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              👤 Users
            </a>
            <a 
              href="/admin/collections/media" 
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              📁 Media
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default DashboardNav; 