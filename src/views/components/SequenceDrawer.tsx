'use client';
import React, { useEffect, useState } from 'react';

interface Seq {
  id?: string;
  name: string;
  segment: string;
  delayMinutes: number;
  subject: string;
  body: string;
  active: boolean;
}

interface Props {
  open: boolean;
  onClose: () => void;
  sequence?: Seq | null;
  onSaved: () => void;
}

const segments = [
  { label: 'All', value: 'all' },
  { label: 'Hot', value: 'hot' },
  { label: 'Warm', value: 'warm' },
  { label: 'Customers', value: 'customers' },
];

export default function SequenceDrawer({ open, onClose, sequence, onSaved }: Props) {
  const [form, setForm] = useState<Seq>({
    name: '',
    segment: 'all',
    delayMinutes: 1440,
    subject: '',
    body: '',
    active: true,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (sequence) setForm(sequence);
    else setForm({ name:'', segment:'all', delayMinutes:1440, subject:'', body:'', active:true });
  }, [sequence, open]);

  if (!open) return null;

  const save = async () => {
    if (!form.name || !form.subject) return;
    setSaving(true);
    const method = sequence?.id ? 'PUT' : 'POST';
    const url = sequence?.id ? `/api/payload/collections/email_sequences/${sequence.id}` : '/api/payload/collections/email_sequences';
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setSaving(false);
    onSaved();
    onClose();
  };

  return (
    <div className="fixed inset-0 flex justify-end z-50 bg-black bg-opacity-40" onClick={onClose}>
      <div className="bg-white w-full max-w-md h-full p-6 overflow-y-auto" onClick={(e)=>e.stopPropagation()}>
        <h2 className="text-lg font-semibold mb-4">{sequence ? 'Edit' : 'New'} Sequence</h2>
        <div className="space-y-4 text-sm">
          <div>
            <label className="block mb-1">Name</label>
            <input className="border rounded w-full px-2 py-1" value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})} />
          </div>
          <div>
            <label className="block mb-1">Segment</label>
            <select className="border rounded w-full px-2 py-1" value={form.segment} onChange={(e)=>setForm({...form,segment:e.target.value})}>
              {segments.map(s=> (<option key={s.value} value={s.value}>{s.label}</option>))}
            </select>
          </div>
          <div>
            <label className="block mb-1">Delay after previous email (minutes)</label>
            <input type="number" className="border rounded w-full px-2 py-1" value={form.delayMinutes} onChange={(e)=>setForm({...form,delayMinutes:Number(e.target.value)})} />
          </div>
          <div>
            <label className="block mb-1">Subject</label>
            <input className="border rounded w-full px-2 py-1" value={form.subject} onChange={(e)=>setForm({...form,subject:e.target.value})} />
          </div>
          <div>
            <label className="block mb-1">Body (HTML)</label>
            <textarea rows={8} className="border rounded w-full px-2 py-1" value={form.body} onChange={(e)=>setForm({...form,body:e.target.value})} />
          </div>
          <label className="inline-flex items-center">
            <input type="checkbox" className="mr-2" checked={form.active} onChange={(e)=>setForm({...form,active:e.target.checked})} /> Active
          </label>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button className="px-3 py-1 text-sm" onClick={onClose}>Cancel</button>
          <button className="px-4 py-1 bg-blue-600 text-white rounded text-sm" disabled={saving} onClick={save}>{saving?'Saving…':'Save'}</button>
        </div>
      </div>
    </div>
  );
} 