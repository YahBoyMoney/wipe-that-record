'use client';

import React from 'react';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function SimpleDashboard() {
  const { data, isLoading, error } = useSWR('/api/analytics', fetcher);

  if (isLoading) {
    return (
      <div style={{ padding: '32px', textAlign: 'center' }}>
        <h1>Loading Analytics...</h1>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div style={{ padding: '32px', textAlign: 'center' }}>
        <h1 style={{ color: 'red' }}>Error loading analytics</h1>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  const { overview, funnel, sources, email, highValueLeads } = data;

  return (
    <div style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '32px' }}>📊 Wipe That Record Analytics</h1>
      
      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        <div style={{ background: 'white', padding: '24px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3>Total Leads</h3>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#3b82f6' }}>
            {overview.totalLeads.toLocaleString()}
          </div>
        </div>
        
        <div style={{ background: 'white', padding: '24px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3>Total Revenue</h3>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#10b981' }}>
            ${overview.totalRevenue.toLocaleString()}
          </div>
        </div>
        
        <div style={{ background: 'white', padding: '24px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3>Conversion Rate</h3>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#8b5cf6' }}>
            {overview.conversionRate}%
          </div>
        </div>
        
        <div style={{ background: 'white', padding: '24px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3>Avg Order Value</h3>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#f59e0b' }}>
            ${overview.averageOrderValue}
          </div>
        </div>
      </div>

      {/* Conversion Funnel */}
      <div style={{ background: 'white', padding: '24px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: '32px' }}>
        <h2 style={{ marginBottom: '24px' }}>🔄 Conversion Funnel</h2>
        <div style={{ display: 'grid', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span>Leads</span>
              <span>{funnel.leads}</span>
            </div>
            <div style={{ background: '#e5e7eb', borderRadius: '4px', height: '8px' }}>
              <div style={{ background: '#3b82f6', borderRadius: '4px', height: '8px', width: '100%' }}></div>
            </div>
          </div>
          
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span>DIY Purchases</span>
              <span>{funnel.diyPurchases}</span>
            </div>
            <div style={{ background: '#e5e7eb', borderRadius: '4px', height: '8px' }}>
              <div style={{ 
                background: '#10b981', 
                borderRadius: '4px', 
                height: '8px', 
                width: `${funnel.leads > 0 ? (funnel.diyPurchases / funnel.leads) * 100 : 0}%` 
              }}></div>
            </div>
          </div>
          
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span>Review Upgrades</span>
              <span>{funnel.reviewUpgrades}</span>
            </div>
            <div style={{ background: '#e5e7eb', borderRadius: '4px', height: '8px' }}>
              <div style={{ 
                background: '#f59e0b', 
                borderRadius: '4px', 
                height: '8px', 
                width: `${funnel.leads > 0 ? (funnel.reviewUpgrades / funnel.leads) * 100 : 0}%` 
              }}></div>
            </div>
          </div>
          
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span>Full Service</span>
              <span>{funnel.fullServiceUpgrades}</span>
            </div>
            <div style={{ background: '#e5e7eb', borderRadius: '4px', height: '8px' }}>
              <div style={{ 
                background: '#8b5cf6', 
                borderRadius: '4px', 
                height: '8px', 
                width: `${funnel.leads > 0 ? (funnel.fullServiceUpgrades / funnel.leads) * 100 : 0}%` 
              }}></div>
            </div>
          </div>
        </div>
        
        <div style={{ marginTop: '16px', fontSize: '14px', color: '#6b7280' }}>
          <div>Lead → DIY: {funnel.conversionRates.leadToDiy}%</div>
          <div>DIY → Review: {funnel.conversionRates.diyToReview}%</div>
          <div>DIY → Full: {funnel.conversionRates.diyToFull}%</div>
        </div>
      </div>

      {/* Email Performance */}
      <div style={{ background: 'white', padding: '24px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: '32px' }}>
        <h2 style={{ marginBottom: '24px' }}>📧 Email Performance</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#3b82f6' }}>{email.totalSent}</div>
            <div style={{ fontSize: '14px', color: '#6b7280' }}>Total Sent</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981' }}>{email.delivered}</div>
            <div style={{ fontSize: '14px', color: '#6b7280' }}>Delivered</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f59e0b' }}>{email.pending}</div>
            <div style={{ fontSize: '14px', color: '#6b7280' }}>Pending</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ef4444' }}>{email.failed}</div>
            <div style={{ fontSize: '14px', color: '#6b7280' }}>Failed</div>
          </div>
        </div>
      </div>

      {/* High Value Leads */}
      <div style={{ background: 'white', padding: '24px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h2 style={{ marginBottom: '24px' }}>💎 Recent High-Value Leads</h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                <th style={{ padding: '12px', textAlign: 'left' }}>Customer</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Revenue</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Stage</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Source</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {highValueLeads.map((lead: any, index: number) => (
                <tr key={lead.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '12px' }}>{lead.name}</td>
                  <td style={{ padding: '12px', fontWeight: 'bold', color: '#10b981' }}>${lead.revenue}</td>
                  <td style={{ padding: '12px' }}>{lead.stage}</td>
                  <td style={{ padding: '12px', textTransform: 'capitalize' }}>{lead.source}</td>
                  <td style={{ padding: '12px' }}>{new Date(lead.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 