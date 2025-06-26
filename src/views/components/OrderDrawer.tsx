'use client';
import React, { useEffect, useState } from 'react';

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  createdAt: string;
  totals?: { total: number };
  customer?: { firstName: string; lastName: string; email: string };
  timeline?: Array<{ date: string; status: string; description: string }>;
}

interface Props {
  order: Order | null;
  onClose: () => void;
  onStatusChange: () => void;
}

const statuses = [
  'pending',
  'processing',
  'review',
  'filing',
  'court_processing',
  'completed',
  'cancelled',
  'refunded',
];

export default function OrderDrawer({ order, onClose, onStatusChange }: Props) {
  const [status, setStatus] = useState(order?.status || 'pending');
  useEffect(()=>{ if(order) setStatus(order.status); }, [order]);

  if (!order) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-end z-50" onClick={onClose}>
      <div
        className="bg-white w-full max-w-md h-full shadow-xl p-6 overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold mb-4">Order #{order.orderNumber}</h2>
        <div className="space-y-2 text-sm">
          <div>
            <span className="font-medium">Customer:</span> {order.customer?.firstName} {order.customer?.lastName}
            <br />
            <span className="text-gray-500 text-xs">{order.customer?.email}</span>
          </div>
          <div>
            <span className="font-medium">Total:</span> ${order.totals?.total.toFixed(2)}
          </div>
          <div>
            <span className="font-medium">Created:</span> {new Date(order.createdAt).toLocaleString()}
          </div>
          <div>
            <label className="font-medium block mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full border rounded px-2 py-1"
            >
              {statuses.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <button
              className="mt-2 px-3 py-1 bg-blue-600 text-white rounded text-sm"
              onClick={async () => {
                await fetch(`/api/orders/${order.id}`, {
                  method: 'PATCH',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ status }),
                });
                onStatusChange();
                onClose();
              }}
            >
              Save
            </button>
          </div>
        </div>
        {order.timeline && order.timeline.length > 0 && (
          <div className="mt-6">
            <h3 className="font-medium mb-2">Timeline</h3>
            <ul className="space-y-2 text-xs">
              {order.timeline.map((t, idx) => (
                <li key={idx} className="border-l pl-2">
                  <div className="font-semibold">{t.status}</div>
                  <div>{t.description}</div>
                  <div className="text-gray-500">{new Date(t.date).toLocaleDateString()}</div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
} 