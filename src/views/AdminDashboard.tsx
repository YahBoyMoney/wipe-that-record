'use client';

import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import useSWR from 'swr';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function AdminDashboard() {
  const { data, isLoading } = useSWR('/api/analytics', fetcher);

  // Fallbacks while loading
  if (isLoading) return <p style={{ padding: 32 }}>Loading …</p>;
  if (!data) return <p style={{ padding: 32 }}>No analytics data available.</p>;

  const leads = data?.overview?.totalLeads ?? 0;
  const revenue = data?.overview?.totalRevenue ?? 0;

  const chartData: any = {
    labels: ['DIY', 'Review', 'Full'],
    datasets: [
      {
        label: 'Count',
        data: [
          data?.funnel?.diyPurchases ?? 0,
          data?.funnel?.reviewUpgrades ?? 0,
          data?.funnel?.fullServiceUpgrades ?? 0,
        ],
        backgroundColor: ['#3b82f6', '#f59e0b', '#10b981'],
      },
    ],
  } as const;

  return (
    <div style={{ padding: 32, maxWidth: 1200, margin: '0 auto' }}>
      <h1 style={{ marginBottom: 24 }}>📊 Analytics Dashboard</h1>

      <div style={{ display: 'flex', gap: 24, marginBottom: 40 }}>
        <KpiCard label="Total Leads" value={leads.toLocaleString()} />
        <KpiCard label="Total Revenue" value={`$${revenue.toLocaleString()}`} />
      </div>

      <div style={{ background: '#fff', padding: 24, borderRadius: 8 }}>
        <h3 style={{ marginBottom: 16 }}>Conversion Funnel</h3>
        <Bar data={chartData} />
      </div>
    </div>
  );
}

function KpiCard({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ flex: 1, background: '#fff', padding: 24, borderRadius: 8 }}>
      <div style={{ fontSize: 32, fontWeight: 700 }}>{value}</div>
      <div style={{ opacity: 0.6 }}>{label}</div>
    </div>
  );
} 