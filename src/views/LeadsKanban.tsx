'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Lead {
  id: string;
  first: string;
  last: string;
  email: string;
  conversionStage: string;
  leadScore?: number;
}

const STAGES: { key: string; title: string }[] = [
  { key: 'lead', title: 'New' },
  { key: 'diy_purchased', title: 'DIY Purchased' },
  { key: 'review_upgrade', title: 'Review Upgrade' },
  { key: 'full_service', title: 'Full Service' },
];

export default function LeadsKanban() {
  const [leads, setLeads] = useState<Record<string, Lead[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all(
      STAGES.map(async ({ key }) => {
        const res = await fetch(`/api/leads?stage=${key}`);
        const { data } = await res.json();
        return { key, data } as { key: string; data: Lead[] };
      })
    ).then((results) => {
      const obj: Record<string, Lead[]> = {};
      results.forEach(({ key, data }) => (obj[key] = data));
      setLeads(obj);
      setLoading(false);
    });
  }, []);

  const handleDragEnd = async (
    lead: Lead,
    from: string,
    to: string
  ) => {
    if (from === to) return;
    // optimistic UI
    setLeads((prev) => {
      const next = { ...prev };
      next[from] = next[from].filter((l) => l.id !== lead.id);
      next[to] = [lead, ...next[to]];
      return next;
    });
    try {
      await fetch(`/api/leads/${lead.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversionStage: to }),
      });
    } catch (err) {
      console.error(err);
      // revert on fail
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 overflow-x-auto">
      <div className="flex gap-6 min-w-max">
        {STAGES.map(({ key, title }) => (
          <div key={key} className="w-64 bg-white border rounded-lg shadow-sm flex flex-col">
            <div className="px-3 py-2 border-b bg-gray-50 font-medium text-sm flex justify-between items-center">
              {title}
              <span className="text-xs text-gray-500">{leads[key]?.length || 0}</span>
            </div>
            <div className="flex-1 p-2 space-y-2 overflow-y-auto" style={{ maxHeight: '80vh' }}>
              <AnimatePresence>
                {leads[key]?.map((lead) => (
                  <motion.div
                    role="listitem"
                    aria-label={`${lead.first} ${lead.last}`}
                    key={lead.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    draggable
                    onDragStart={(e: React.DragEvent) => {
                      e.dataTransfer.setData('leadId', lead.id);
                      e.dataTransfer.setData('fromStage', key);
                    }}
                    className="bg-blue-50 border border-blue-200 rounded p-2 text-xs cursor-grab"
                  >
                    <div className="font-semibold text-gray-800">
                      {lead.first} {lead.last}
                    </div>
                    <div className="text-gray-600">{lead.email}</div>
                    {lead.leadScore !== undefined && (
                      <div className="mt-1 text-gray-500">Score: {lead.leadScore}</div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            <div
              className="h-10"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e: React.DragEvent<HTMLDivElement>) => {
                const id = e.dataTransfer.getData('leadId');
                const from = e.dataTransfer.getData('fromStage');
                const leadObj = leads[from].find((l) => l.id === id);
                if (leadObj) {
                  handleDragEnd(leadObj, from, key);
                }
              }}
            ></div>
          </div>
        ))}
      </div>
    </div>
  );
} 