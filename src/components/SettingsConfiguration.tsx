'use client';

import React, { useState, useEffect } from 'react';
import {
  Cog6ToothIcon,
  CreditCardIcon,
  EnvelopeIcon,
  UsersIcon,
  ShieldCheckIcon,
  BellIcon,
  GlobeAltIcon,
  DocumentTextIcon,
  KeyIcon,
  EyeIcon,
  EyeSlashIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  PlusIcon,
  TrashIcon,
  PencilIcon,
  CloudArrowUpIcon,
  DocumentArrowDownIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';

interface GeneralSettings {
  companyName: string;
  companyEmail: string;
  companyPhone: string;
  companyAddress: string;
  timezone: string;
  currency: string;
  language: string;
  dateFormat: string;
  businessHours: {
    start: string;
    end: string;
    days: string[];
  };
}

interface PaymentSettings {
  stripePublishableKey: string;
  stripeSecretKey: string;
  paypalClientId: string;
  paypalClientSecret: string;
  enableStripe: boolean;
  enablePaypal: boolean;
  testMode: boolean;
  webhookEndpoint: string;
}

interface EmailSettings {
  smtpHost: string;
  smtpPort: string;
  smtpUsername: string;
  smtpPassword: string;
  smtpEncryption: string;
  fromEmail: string;
  fromName: string;
  replyToEmail: string;
  enableEmailNotifications: boolean;
  emailSignature: string;
}

interface SecuritySettings {
  twoFactorAuth: boolean;
  sessionTimeout: number;
  passwordPolicy: {
    minLength: number;
    requireUppercase: boolean;
    requireNumbers: boolean;
    requireSpecialChars: boolean;
  };
  ipWhitelist: string[];
  enableAuditLog: boolean;
  dataRetentionDays: number;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'staff';
  status: 'active' | 'inactive';
  lastLogin: string;
  permissions: string[];
}

const SettingsConfiguration: React.FC = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showPasswords, setShowPasswords] = useState<{[key: string]: boolean}>({});

  // Settings state
  const [generalSettings, setGeneralSettings] = useState<GeneralSettings>({
    companyName: 'WipeThatRecord',
    companyEmail: 'info@wipethatrecord.com',
    companyPhone: '(555) 123-4567',
    companyAddress: '123 Legal St, Los Angeles, CA 90210',
    timezone: 'America/Los_Angeles',
    currency: 'USD',
    language: 'en',
    dateFormat: 'MM/DD/YYYY',
    businessHours: {
      start: '09:00',
      end: '17:00',
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    },
  });

  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings>({
    stripePublishableKey: 'pk_test_...',
    stripeSecretKey: 'sk_test_...',
    paypalClientId: '',
    paypalClientSecret: '',
    enableStripe: true,
    enablePaypal: false,
    testMode: true,
    webhookEndpoint: 'https://wipethatrecord.com/webhooks/stripe',
  });

  const [emailSettings, setEmailSettings] = useState<EmailSettings>({
    smtpHost: 'smtp.gmail.com',
    smtpPort: '587',
    smtpUsername: 'noreply@wipethatrecord.com',
    smtpPassword: '',
    smtpEncryption: 'tls',
    fromEmail: 'noreply@wipethatrecord.com',
    fromName: 'WipeThatRecord',
    replyToEmail: 'support@wipethatrecord.com',
    enableEmailNotifications: true,
    emailSignature: 'Best regards,\nThe WipeThatRecord Team',
  });

  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    twoFactorAuth: true,
    sessionTimeout: 60,
    passwordPolicy: {
      minLength: 8,
      requireUppercase: true,
      requireNumbers: true,
      requireSpecialChars: true,
    },
    ipWhitelist: ['192.168.1.1', '10.0.0.1'],
    enableAuditLog: true,
    dataRetentionDays: 365,
  });

  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: 'John Admin',
      email: 'admin@wipethatrecord.com',
      role: 'admin',
      status: 'active',
      lastLogin: '2024-06-27T10:30:00Z',
      permissions: ['all'],
    },
    {
      id: '2',
      name: 'Sarah Manager',
      email: 'sarah@wipethatrecord.com',
      role: 'manager',
      status: 'active',
      lastLogin: '2024-06-26T14:20:00Z',
      permissions: ['orders', 'customers', 'analytics'],
    },
    {
      id: '3',
      name: 'Mike Staff',
      email: 'mike@wipethatrecord.com',
      role: 'staff',
      status: 'active',
      lastLogin: '2024-06-25T09:15:00Z',
      permissions: ['orders', 'customers'],
    },
  ]);

  const handleSave = async (section: string) => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoading(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const togglePasswordVisibility = (field: string) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const getRoleBadge = (role: string) => {
    const styles = {
      admin: 'bg-red-100 text-red-800',
      manager: 'bg-blue-100 text-blue-800',
      staff: 'bg-green-100 text-green-800',
    };
    
    return (
      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${styles[role as keyof typeof styles]}`}>
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </span>
    );
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
    };
    
    return (
      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${styles[status as keyof typeof styles]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings & Configuration</h1>
          <p className="text-gray-600">Manage your application settings and configurations</p>
        </div>
        <div className="flex items-center space-x-3">
          {saved && (
            <div className="flex items-center text-green-600">
              <CheckCircleIcon className="h-5 w-5 mr-2" />
              <span className="text-sm font-medium">Settings saved!</span>
            </div>
          )}
          <button className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
            Export Config
          </button>
          <button className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            <CloudArrowUpIcon className="h-4 w-4 mr-2" />
            Import Config
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'general', name: 'General', icon: Cog6ToothIcon },
            { id: 'payment', name: 'Payment', icon: CreditCardIcon },
            { id: 'email', name: 'Email', icon: EnvelopeIcon },
            { id: 'security', name: 'Security', icon: ShieldCheckIcon },
            { id: 'users', name: 'Users', icon: UsersIcon },
            { id: 'notifications', name: 'Notifications', icon: BellIcon },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center`}
            >
              <tab.icon className="h-4 w-4 mr-2" />
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* General Settings */}
      {activeTab === 'general' && (
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">General Settings</h3>
            <p className="text-sm text-gray-500">Basic configuration for your application</p>
          </div>
          <div className="px-6 py-4 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                <input
                  type="text"
                  value={generalSettings.companyName}
                  onChange={(e) => setGeneralSettings({...generalSettings, companyName: e.target.value})}
                  className="w-full border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Company Email</label>
                <input
                  type="email"
                  value={generalSettings.companyEmail}
                  onChange={(e) => setGeneralSettings({...generalSettings, companyEmail: e.target.value})}
                  className="w-full border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Company Phone</label>
                <input
                  type="tel"
                  value={generalSettings.companyPhone}
                  onChange={(e) => setGeneralSettings({...generalSettings, companyPhone: e.target.value})}
                  className="w-full border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                <select
                  value={generalSettings.timezone}
                  onChange={(e) => setGeneralSettings({...generalSettings, timezone: e.target.value})}
                  className="w-full border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="America/Los_Angeles">Pacific Time</option>
                  <option value="America/Denver">Mountain Time</option>
                  <option value="America/Chicago">Central Time</option>
                  <option value="America/New_York">Eastern Time</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Company Address</label>
              <textarea
                value={generalSettings.companyAddress}
                onChange={(e) => setGeneralSettings({...generalSettings, companyAddress: e.target.value})}
                rows={3}
                className="w-full border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                <select
                  value={generalSettings.currency}
                  onChange={(e) => setGeneralSettings({...generalSettings, currency: e.target.value})}
                  className="w-full border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="CAD">CAD ($)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                <select
                  value={generalSettings.language}
                  onChange={(e) => setGeneralSettings({...generalSettings, language: e.target.value})}
                  className="w-full border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date Format</label>
                <select
                  value={generalSettings.dateFormat}
                  onChange={(e) => setGeneralSettings({...generalSettings, dateFormat: e.target.value})}
                  className="w-full border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </select>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <button
                onClick={() => handleSave('general')}
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
              >
                {loading && <ArrowPathIcon className="animate-spin h-4 w-4 mr-2" />}
                Save General Settings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Settings */}
      {activeTab === 'payment' && (
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Payment Settings</h3>
            <p className="text-sm text-gray-500">Configure payment gateways and options</p>
          </div>
          <div className="px-6 py-4 space-y-6">
            {/* Stripe Settings */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="h-8 w-8 bg-blue-100 rounded flex items-center justify-center mr-3">
                    <CreditCardIcon className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Stripe</h4>
                    <p className="text-sm text-gray-500">Accept credit cards and bank transfers</p>
                  </div>
                </div>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={paymentSettings.enableStripe}
                    onChange={(e) => setPaymentSettings({...paymentSettings, enableStripe: e.target.checked})}
                    className="form-checkbox h-4 w-4 text-blue-600"
                  />
                  <span className="ml-2 text-sm text-gray-600">Enable</span>
                </label>
              </div>
              
              {paymentSettings.enableStripe && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Publishable Key</label>
                    <input
                      type="text"
                      value={paymentSettings.stripePublishableKey}
                      onChange={(e) => setPaymentSettings({...paymentSettings, stripePublishableKey: e.target.value})}
                      className="w-full border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Secret Key</label>
                    <div className="relative">
                      <input
                        type={showPasswords.stripeSecret ? "text" : "password"}
                        value={paymentSettings.stripeSecretKey}
                        onChange={(e) => setPaymentSettings({...paymentSettings, stripeSecretKey: e.target.value})}
                        className="w-full border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('stripeSecret')}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showPasswords.stripeSecret ? (
                          <EyeSlashIcon className="h-4 w-4 text-gray-400" />
                        ) : (
                          <EyeIcon className="h-4 w-4 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* PayPal Settings */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="h-8 w-8 bg-yellow-100 rounded flex items-center justify-center mr-3">
                    <CreditCardIcon className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">PayPal</h4>
                    <p className="text-sm text-gray-500">Accept PayPal payments</p>
                  </div>
                </div>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={paymentSettings.enablePaypal}
                    onChange={(e) => setPaymentSettings({...paymentSettings, enablePaypal: e.target.checked})}
                    className="form-checkbox h-4 w-4 text-blue-600"
                  />
                  <span className="ml-2 text-sm text-gray-600">Enable</span>
                </label>
              </div>
              
              {paymentSettings.enablePaypal && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Client ID</label>
                    <input
                      type="text"
                      value={paymentSettings.paypalClientId}
                      onChange={(e) => setPaymentSettings({...paymentSettings, paypalClientId: e.target.value})}
                      className="w-full border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Client Secret</label>
                    <div className="relative">
                      <input
                        type={showPasswords.paypalSecret ? "text" : "password"}
                        value={paymentSettings.paypalClientSecret}
                        onChange={(e) => setPaymentSettings({...paymentSettings, paypalClientSecret: e.target.value})}
                        className="w-full border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('paypalSecret')}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showPasswords.paypalSecret ? (
                          <EyeSlashIcon className="h-4 w-4 text-gray-400" />
                        ) : (
                          <EyeIcon className="h-4 w-4 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Test Mode */}
            <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
              <div className="flex items-center">
                <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400 mr-2" />
                <div>
                  <div className="text-sm font-medium text-yellow-800">Test Mode</div>
                  <div className="text-sm text-yellow-600">Process test payments only</div>
                </div>
              </div>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={paymentSettings.testMode}
                  onChange={(e) => setPaymentSettings({...paymentSettings, testMode: e.target.checked})}
                  className="form-checkbox h-4 w-4 text-yellow-600"
                />
                <span className="ml-2 text-sm text-yellow-800">Enable Test Mode</span>
              </label>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <button
                onClick={() => handleSave('payment')}
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
              >
                {loading && <ArrowPathIcon className="animate-spin h-4 w-4 mr-2" />}
                Save Payment Settings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Email Settings */}
      {activeTab === 'email' && (
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Email Settings</h3>
            <p className="text-sm text-gray-500">Configure SMTP and email preferences</p>
          </div>
          <div className="px-6 py-4 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">SMTP Host</label>
                <input
                  type="text"
                  value={emailSettings.smtpHost}
                  onChange={(e) => setEmailSettings({...emailSettings, smtpHost: e.target.value})}
                  className="w-full border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">SMTP Port</label>
                <input
                  type="text"
                  value={emailSettings.smtpPort}
                  onChange={(e) => setEmailSettings({...emailSettings, smtpPort: e.target.value})}
                  className="w-full border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">SMTP Username</label>
                <input
                  type="text"
                  value={emailSettings.smtpUsername}
                  onChange={(e) => setEmailSettings({...emailSettings, smtpUsername: e.target.value})}
                  className="w-full border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">SMTP Password</label>
                <div className="relative">
                  <input
                    type={showPasswords.smtpPassword ? "text" : "password"}
                    value={emailSettings.smtpPassword}
                    onChange={(e) => setEmailSettings({...emailSettings, smtpPassword: e.target.value})}
                    className="w-full border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('smtpPassword')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPasswords.smtpPassword ? (
                      <EyeSlashIcon className="h-4 w-4 text-gray-400" />
                    ) : (
                      <EyeIcon className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">From Email</label>
                <input
                  type="email"
                  value={emailSettings.fromEmail}
                  onChange={(e) => setEmailSettings({...emailSettings, fromEmail: e.target.value})}
                  className="w-full border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">From Name</label>
                <input
                  type="text"
                  value={emailSettings.fromName}
                  onChange={(e) => setEmailSettings({...emailSettings, fromName: e.target.value})}
                  className="w-full border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Reply To Email</label>
                <input
                  type="email"
                  value={emailSettings.replyToEmail}
                  onChange={(e) => setEmailSettings({...emailSettings, replyToEmail: e.target.value})}
                  className="w-full border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Signature</label>
              <textarea
                value={emailSettings.emailSignature}
                onChange={(e) => setEmailSettings({...emailSettings, emailSignature: e.target.value})}
                rows={4}
                className="w-full border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="pt-4 border-t border-gray-200">
              <button
                onClick={() => handleSave('email')}
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
              >
                {loading && <ArrowPathIcon className="animate-spin h-4 w-4 mr-2" />}
                Save Email Settings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Security Settings */}
      {activeTab === 'security' && (
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Security Settings</h3>
            <p className="text-sm text-gray-500">Configure security policies and access controls</p>
          </div>
          <div className="px-6 py-4 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-900">Two-Factor Authentication</div>
                    <div className="text-sm text-gray-500">Require 2FA for all admin users</div>
                  </div>
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={securitySettings.twoFactorAuth}
                      onChange={(e) => setSecuritySettings({...securitySettings, twoFactorAuth: e.target.checked})}
                      className="form-checkbox h-4 w-4 text-blue-600"
                    />
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-900">Audit Logging</div>
                    <div className="text-sm text-gray-500">Log all admin actions</div>
                  </div>
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={securitySettings.enableAuditLog}
                      onChange={(e) => setSecuritySettings({...securitySettings, enableAuditLog: e.target.checked})}
                      className="form-checkbox h-4 w-4 text-blue-600"
                    />
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Session Timeout (minutes)</label>
                  <input
                    type="number"
                    value={securitySettings.sessionTimeout}
                    onChange={(e) => setSecuritySettings({...securitySettings, sessionTimeout: parseInt(e.target.value)})}
                    className="w-full border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password Policy</label>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Minimum length: {securitySettings.passwordPolicy.minLength}</span>
                      <input
                        type="range"
                        min="6"
                        max="20"
                        value={securitySettings.passwordPolicy.minLength}
                        onChange={(e) => setSecuritySettings({
                          ...securitySettings,
                          passwordPolicy: {
                            ...securitySettings.passwordPolicy,
                            minLength: parseInt(e.target.value)
                          }
                        })}
                        className="w-24"
                      />
                    </div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={securitySettings.passwordPolicy.requireUppercase}
                        onChange={(e) => setSecuritySettings({
                          ...securitySettings,
                          passwordPolicy: {
                            ...securitySettings.passwordPolicy,
                            requireUppercase: e.target.checked
                          }
                        })}
                        className="form-checkbox h-4 w-4 text-blue-600 mr-2"
                      />
                      <span className="text-sm text-gray-600">Require uppercase letters</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={securitySettings.passwordPolicy.requireNumbers}
                        onChange={(e) => setSecuritySettings({
                          ...securitySettings,
                          passwordPolicy: {
                            ...securitySettings.passwordPolicy,
                            requireNumbers: e.target.checked
                          }
                        })}
                        className="form-checkbox h-4 w-4 text-blue-600 mr-2"
                      />
                      <span className="text-sm text-gray-600">Require numbers</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={securitySettings.passwordPolicy.requireSpecialChars}
                        onChange={(e) => setSecuritySettings({
                          ...securitySettings,
                          passwordPolicy: {
                            ...securitySettings.passwordPolicy,
                            requireSpecialChars: e.target.checked
                          }
                        })}
                        className="form-checkbox h-4 w-4 text-blue-600 mr-2"
                      />
                      <span className="text-sm text-gray-600">Require special characters</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <button
                onClick={() => handleSave('security')}
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
              >
                {loading && <ArrowPathIcon className="animate-spin h-4 w-4 mr-2" />}
                Save Security Settings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Users Management */}
      {activeTab === 'users' && (
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">User Management</h3>
                <p className="text-sm text-gray-500">Manage admin users and their permissions</p>
              </div>
              <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
                <PlusIcon className="h-4 w-4 mr-2" />
                Add User
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Login
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <UsersIcon className="h-5 w-5 text-gray-500" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getRoleBadge(user.role)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(user.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(user.lastLogin).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center space-x-2">
                        <button className="text-blue-600 hover:text-blue-800">
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-800">
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Notifications Settings */}
      {activeTab === 'notifications' && (
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Notification Settings</h3>
            <p className="text-sm text-gray-500">Configure system notifications and alerts</p>
          </div>
          <div className="px-6 py-4">
            <div className="space-y-6">
              <div className="space-y-4">
                <h4 className="text-md font-medium text-gray-900">Email Notifications</h4>
                {[
                  { id: 'new-orders', label: 'New Orders', description: 'Get notified when new orders are placed' },
                  { id: 'payment-received', label: 'Payment Received', description: 'Get notified when payments are processed' },
                  { id: 'customer-messages', label: 'Customer Messages', description: 'Get notified when customers send messages' },
                  { id: 'system-alerts', label: 'System Alerts', description: 'Get notified about system issues and updates' },
                ].map((notification) => (
                  <div key={notification.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{notification.label}</div>
                      <div className="text-sm text-gray-500">{notification.description}</div>
                    </div>
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        defaultChecked={true}
                        className="form-checkbox h-4 w-4 text-blue-600"
                      />
                    </label>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-gray-200">
                <button
                  onClick={() => handleSave('notifications')}
                  disabled={loading}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading && <ArrowPathIcon className="animate-spin h-4 w-4 mr-2" />}
                  Save Notification Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsConfiguration;