import React from 'react';
import AdminDashboard from './AdminDashboard';

interface DashboardProps {
  user?: any;
  canAccessAdmin?: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ user, canAccessAdmin }) => {
  // Always show the admin dashboard - authentication is handled by Payload
  return (
    <div className="w-full h-full">
      <AdminDashboard />
    </div>
  );
};

export default Dashboard; 