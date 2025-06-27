'use client';
import React, { useState } from 'react';
import SequenceDrawer from './components/SequenceDrawer';

export default function MarketingCenter() {
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [segment, setSegment] = useState('all');
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState('');
  const [sequences, setSequences] = useState<Record<string, unknown>[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState<Record<string, unknown> | null>(null);

  const sendEmail = async () => {
    if (!subject || !body) {
      setMessage('Subject and body required');
      return;
    }
    try {
      setSending(true);
      const res = await fetch('/api/email-trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, body, segment }),
      });
      const json = await res.json();
      if (json.success) setMessage('Broadcast queued 👍');
      else setMessage(json.error || 'Failed');
    } catch (err: unknown) {
      console.error('Email send error:', err);
      setMessage('Error sending');
    } finally {
      setSending(false);
    }
  };

  const reload = () => { fetch('/api/payload/collections/email_sequences').then(r => r.json()).then(d => setSequences(d.docs || [])); };
  React.useEffect(()=>{reload();}, []);

  const importLegacy = async () => {
    await fetch('/api/marketing/import-sequences', { method: 'POST' });
    reload();
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Marketing Center</h1>
      <div className="bg-white border rounded p-4 space-y-4 shadow-sm">
        <div>
          <label className="block text-sm font-medium mb-1">Segment</label>
          <select value={segment} onChange={(e)=>setSegment(e.target.value)} className="border rounded w-full px-2 py-1">
            <option value="all">All Leads</option>
            <option value="hot">Hot Leads (Score 60+)</option>
            <option value="warm">Warm Leads (40-59)</option>
            <option value="customers">Customers</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Subject</label>
          <input value={subject} onChange={(e)=>setSubject(e.target.value)} className="border rounded w-full px-2 py-1" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Body (HTML allowed)</label>
          <textarea value={body} onChange={(e)=>setBody(e.target.value)} rows={10} className="border rounded w-full px-2 py-1" />
        </div>
        <button onClick={sendEmail} disabled={sending} className="px-4 py-2 bg-blue-600 text-white rounded">
          {sending ? 'Sending…' : 'Send Broadcast'}
        </button>
        {message && <p className="text-sm mt-2">{message}</p>}
      </div>
      <h2 className="text-lg font-semibold mt-8 mb-2">Email Sequences</h2>
      {sequences.length === 0 && (
        <button className="mb-2 px-3 py-1 bg-purple-600 text-white rounded" onClick={importLegacy}>Import Default Funnels</button>
      )}
      <table className="w-full text-xs border">
        <thead className="bg-gray-50"><tr><th className="p-2">Name</th><th>Segment</th><th>Delay (min)</th><th>Active</th><th>Actions</th></tr></thead>
        <tbody>{sequences.map(seq=>(<tr key={seq.id} className="border-t"><td className="p-2">{seq.name}</td><td>{seq.segment}</td><td>{seq.delayMinutes}</td><td>{seq.active?'✅':'❌'}</td><td><button className="text-blue-600 text-xs" onClick={()=>{setEditing(seq);setDrawerOpen(true);}}>Edit</button></td></tr>))}</tbody>
      </table>
      <button className="mb-2 px-3 py-1 bg-green-600 text-white rounded" onClick={()=>{setEditing(null);setDrawerOpen(true);}}>New Sequence</button>
      <SequenceDrawer open={drawerOpen} sequence={editing} onClose={()=>{setDrawerOpen(false);setEditing(null);}} onSaved={()=>{reload();}} />
    </div>
  );
} 