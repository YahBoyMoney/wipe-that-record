'use client';

import React, { useCallback, useEffect, useState } from 'react';
import {
  DISMISSAL_BASIS_OPTIONS,
  SUPPORTED_COUNTY_OPTIONS,
  STATUS_LABELS,
  STATUS_CHIP_CLASS,
  TEMPLATE_LABELS,
} from './constants';

interface Charge {
  code?: string;
  section?: string;
  type?: string;
}

interface IntakeForm {
  staffReviewed: boolean;
  selfRepresented: boolean;
  petitioner: { fullName: string; street: string; city: string; state: string; zip: string; phone: string; email: string };
  court: { county: string; courtName: string; courtStreet: string; courtCityZip: string };
  caseInfo: { caseNumber: string; convictionDate: string; charges: Charge[] };
  relief: { dismissalBasis: string; felonyReductionRequested: boolean };
}

interface Detail {
  id: string | number;
  sourceSessionId?: string;
  templateKey?: string;
  status?: string;
  customerEmail?: string | null;
  isOfficial?: boolean;
  review: { approved: boolean; reviewedBy?: string | null; reviewedAt?: string | null; reviewNotes?: string | null };
  validation: { ok: boolean; reasons: string[]; checkedAt?: string | null };
  officialIntake?: any;
  generatedArtifact?: { fileName?: string | null; byteSize?: number | null; sample?: boolean; generatedAt?: string | null } | null;
  auditLog: Array<{ at?: string; action?: string; actor?: string; detail?: string; fromStatus?: string; toStatus?: string }>;
}

const emptyForm = (): IntakeForm => ({
  staffReviewed: false,
  selfRepresented: false,
  petitioner: { fullName: '', street: '', city: '', state: '', zip: '', phone: '', email: '' },
  court: { county: '', courtName: '', courtStreet: '', courtCityZip: '' },
  caseInfo: { caseNumber: '', convictionDate: '', charges: [{ code: '', section: '', type: '' }] },
  relief: { dismissalBasis: '', felonyReductionRequested: false },
});

function formFromStored(stored: any): IntakeForm {
  const f = emptyForm();
  if (!stored || typeof stored !== 'object') return f;
  f.staffReviewed = stored.staffReviewed === true;
  f.selfRepresented = stored.selfRepresented === true;
  Object.assign(f.petitioner, sanitize(stored.petitioner));
  Object.assign(f.court, sanitize(stored.court));
  const ci = stored.caseInfo || {};
  f.caseInfo.caseNumber = str(ci.caseNumber);
  f.caseInfo.convictionDate = str(ci.convictionDate);
  f.caseInfo.charges =
    Array.isArray(ci.charges) && ci.charges.length
      ? ci.charges.map((c: any) => ({ code: str(c.code), section: str(c.section), type: str(c.type) }))
      : [{ code: '', section: '', type: '' }];
  f.relief.dismissalBasis = str(stored.relief?.dismissalBasis);
  f.relief.felonyReductionRequested = stored.relief?.felonyReductionRequested === true;
  return f;
}

function sanitize(obj: any): Record<string, string> {
  const out: Record<string, string> = {};
  if (obj && typeof obj === 'object') for (const [k, v] of Object.entries(obj)) out[k] = str(v);
  return out;
}
function str(v: unknown): string {
  return typeof v === 'string' ? v : '';
}

export default function OfficialPackageReview({
  packageId,
  onChanged,
  onClose,
}: {
  packageId: string | number;
  onChanged: () => void;
  onClose: () => void;
}) {
  const [detail, setDetail] = useState<Detail | null>(null);
  const [form, setForm] = useState<IntakeForm>(emptyForm());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/staff/document-packages/${packageId}`, { credentials: 'include' });
      if (res.status === 401 || res.status === 403) {
        setError('Not authorized.');
        return;
      }
      if (!res.ok) throw new Error('not found');
      const data = await res.json();
      setDetail(data.doc);
      setForm(formFromStored(data.doc.officialIntake));
    } catch {
      setError('Could not load this package.');
    } finally {
      setLoading(false);
    }
  }, [packageId]);

  useEffect(() => {
    load();
  }, [load]);

  const post = async (path: string, body: any) => {
    setBusy(path);
    setMessage(null);
    setError(null);
    try {
      const res = await fetch(`/api/staff/document-packages/${packageId}${path}`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 401 || res.status === 403) {
        setError('Your session is not authorized.');
        return null;
      }
      if (res.status === 409) {
        setError('Blocked: ' + (data.reasons?.join(' ') || data.error || 'see validation.'));
        await load();
        return data;
      }
      if (!res.ok) {
        setError(data.error || 'Request failed.');
        return null;
      }
      await load();
      onChanged();
      return data;
    } catch {
      setError('Request failed. Please retry.');
      return null;
    } finally {
      setBusy(null);
    }
  };

  const buildIntakeBody = () => ({
    staffReviewed: form.staffReviewed,
    selfRepresented: form.selfRepresented,
    petitioner: { ...form.petitioner },
    court: { ...form.court },
    case: {
      caseNumber: form.caseInfo.caseNumber,
      convictionDate: form.caseInfo.convictionDate,
      charges: form.caseInfo.charges,
    },
    relief: { ...form.relief },
  });

  const saveIntake = async () => {
    const data = await post('/save-intake', buildIntakeBody());
    if (data?.validation) {
      setMessage(data.validation.ok ? 'Intake saved — passes validation.' : 'Intake saved.');
    }
  };
  const approve = async (notes: string) => {
    const data = await post('/approve', { notes });
    if (data?.success) setMessage('Review approved.');
  };
  const generate = async (sample: boolean) => {
    const data = await post('/generate', { sample });
    if (data?.success) setMessage(sample ? 'Sample packet generated.' : 'Official packet generated.');
  };

  if (loading) {
    return (
      <div data-testid="detail-loading" className="bg-white rounded-xl border border-gray-200 p-8 text-center text-sm text-gray-500">
        Loading package…
      </div>
    );
  }
  if (error && !detail) {
    return (
      <div data-testid="detail-error" className="bg-white rounded-xl border border-gray-200 p-8 text-center text-sm text-red-600">
        {error}
      </div>
    );
  }
  if (!detail) return null;

  const isOfficial = detail.isOfficial;

  return (
    <div className="bg-white rounded-xl border border-gray-200" data-testid="package-detail">
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-900 truncate max-w-[260px]">{detail.sourceSessionId}</p>
          <p className="text-xs text-gray-500">{TEMPLATE_LABELS[detail.templateKey || ''] || detail.templateKey}</p>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-sm" data-testid="detail-close">
          Close
        </button>
      </div>

      <div className="p-4 space-y-4">
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${STATUS_CHIP_CLASS[detail.status || ''] || 'bg-gray-100 text-gray-800'}`}>
            {STATUS_LABELS[detail.status || ''] || detail.status}
          </span>
          {detail.review.approved && <span className="text-xs text-green-700">✓ Review approved</span>}
        </div>

        {message && <div data-testid="detail-message" className="text-xs text-green-700 bg-green-50 rounded p-2">{message}</div>}
        {error && <div data-testid="detail-action-error" className="text-xs text-red-700 bg-red-50 rounded p-2">{error}</div>}

        {!isOfficial ? (
          <div className="text-sm text-gray-600">
            This package type ({TEMPLATE_LABELS[detail.templateKey || ''] || detail.templateKey}) does not use
            the official CR-180/CR-181 intake. Manage it from the standard review flow.
          </div>
        ) : (
          <>
            {/* Validation checklist */}
            <div className="rounded-lg border border-gray-200 p-3" data-testid="validation-panel">
              <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Validation</p>
              {detail.validation.ok ? (
                <p className="mt-1 text-sm text-green-700">All required fields present. Ready to generate once approved.</p>
              ) : detail.validation.reasons.length ? (
                <ul className="mt-1 list-disc list-inside text-sm text-amber-700" data-testid="validation-reasons">
                  {detail.validation.reasons.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              ) : (
                <p className="mt-1 text-sm text-gray-500">Save the intake to run validation.</p>
              )}
            </div>

            {/* Intake form */}
            <IntakeFields form={form} setForm={setForm} />

            {/* Actions */}
            <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-200">
              <button
                data-testid="save-review"
                disabled={!!busy}
                onClick={saveIntake}
                className="px-3 py-1.5 text-sm font-medium bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 disabled:opacity-50"
              >
                {busy === '/save-intake' ? 'Saving…' : 'Save Review'}
              </button>
              <button
                data-testid="approve-intake"
                disabled={!!busy || detail.review.approved}
                onClick={() => approve(form.petitioner.fullName ? 'Approved via staff dashboard' : 'Approved')}
                className="px-3 py-1.5 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {detail.review.approved ? 'Approved' : busy === '/approve' ? 'Approving…' : 'Approve Intake'}
              </button>
              <button
                data-testid="generate-packet"
                disabled={!!busy || !detail.review.approved}
                title={!detail.review.approved ? 'Approve the intake first' : undefined}
                onClick={() => generate(false)}
                className="px-3 py-1.5 text-sm font-medium bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50"
              >
                {busy === '/generate' ? 'Generating…' : 'Generate Official Packet'}
              </button>
              <button
                data-testid="generate-sample"
                disabled={!!busy || !detail.review.approved}
                onClick={() => generate(true)}
                className="px-3 py-1.5 text-sm font-medium text-emerald-700 border border-emerald-300 rounded-lg hover:bg-emerald-50 disabled:opacity-50"
              >
                Generate Sample
              </button>
            </div>

            {/* Artifact + next steps */}
            {detail.generatedArtifact && (
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm" data-testid="artifact-panel">
                <p className="font-medium text-emerald-800">
                  Packet generated{detail.generatedArtifact.sample ? ' (SAMPLE — not for filing)' : ''}.
                </p>
                <p className="text-xs text-emerald-700 mt-1">
                  {detail.generatedArtifact.fileName} · {detail.generatedArtifact.byteSize ?? '?'} bytes
                </p>
                <p className="text-xs text-gray-600 mt-2">
                  Next (manual): a reviewer retrieves the PDF from admin-gated media storage, verifies the
                  filled CR-180/CR-181, and handles secure delivery. No public download link exists yet.
                </p>
              </div>
            )}
          </>
        )}

        {/* Audit log */}
        <details className="rounded-lg border border-gray-200 p-3" data-testid="audit-log">
          <summary className="text-xs font-semibold text-gray-700 uppercase tracking-wide cursor-pointer">
            Action history ({detail.auditLog.length})
          </summary>
          <ul className="mt-2 space-y-1 text-xs text-gray-600">
            {detail.auditLog.map((e, i) => (
              <li key={i}>
                <span className="text-gray-400">{e.at?.slice(0, 19).replace('T', ' ')}</span> · {e.action} · {e.detail}{' '}
                <span className="text-gray-400">({e.actor})</span>
              </li>
            ))}
          </ul>
        </details>
      </div>
    </div>
  );
}

function IntakeFields({ form, setForm }: { form: IntakeForm; setForm: (f: IntakeForm) => void }) {
  const set = (patch: Partial<IntakeForm>) => setForm({ ...form, ...patch });
  const setGroup = <K extends keyof IntakeForm>(group: K, patch: Partial<IntakeForm[K]>) =>
    setForm({ ...form, [group]: { ...(form[group] as any), ...patch } });

  const updateCharge = (idx: number, patch: Partial<Charge>) => {
    const charges = form.caseInfo.charges.map((c, i) => (i === idx ? { ...c, ...patch } : c));
    setGroup('caseInfo', { charges });
  };
  const addCharge = () => setGroup('caseInfo', { charges: [...form.caseInfo.charges, { code: '', section: '', type: '' }] });
  const removeCharge = (idx: number) =>
    setGroup('caseInfo', { charges: form.caseInfo.charges.filter((_, i) => i !== idx) });

  const input = 'w-full text-sm border border-gray-300 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500';
  const label = 'block text-xs font-medium text-gray-600 mb-0.5';

  return (
    <div className="space-y-4" data-testid="intake-form">
      <Section title="Petitioner">
        <Field label="Full name"><input className={input} data-testid="f-fullName" value={form.petitioner.fullName} onChange={(e) => setGroup('petitioner', { fullName: e.target.value })} /></Field>
        <div className="grid grid-cols-2 gap-2">
          <Field label="Street"><input className={input} value={form.petitioner.street} onChange={(e) => setGroup('petitioner', { street: e.target.value })} /></Field>
          <Field label="City"><input className={input} value={form.petitioner.city} onChange={(e) => setGroup('petitioner', { city: e.target.value })} /></Field>
          <Field label="State"><input className={input} value={form.petitioner.state} onChange={(e) => setGroup('petitioner', { state: e.target.value })} /></Field>
          <Field label="ZIP"><input className={input} value={form.petitioner.zip} onChange={(e) => setGroup('petitioner', { zip: e.target.value })} /></Field>
          <Field label="Phone"><input className={input} value={form.petitioner.phone} onChange={(e) => setGroup('petitioner', { phone: e.target.value })} /></Field>
          <Field label="Email"><input className={input} value={form.petitioner.email} onChange={(e) => setGroup('petitioner', { email: e.target.value })} /></Field>
        </div>
        <label className="flex items-center gap-1.5 text-sm text-gray-700">
          <input type="checkbox" checked={form.selfRepresented} onChange={(e) => set({ selfRepresented: e.target.checked })} />
          Self-represented (in pro per)
        </label>
      </Section>

      <Section title="Court">
        <Field label="County">
          <select className={input} data-testid="f-county" value={form.court.county} onChange={(e) => setGroup('court', { county: e.target.value })}>
            <option value="">Select county…</option>
            {SUPPORTED_COUNTY_OPTIONS.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
          <p className="text-xs text-gray-400 mt-0.5">Other counties: enter the county slug and supply the court address below.</p>
        </Field>
        <div className="grid grid-cols-2 gap-2">
          <Field label="Court name"><input className={input} value={form.court.courtName} onChange={(e) => setGroup('court', { courtName: e.target.value })} /></Field>
          <Field label="Court street"><input className={input} value={form.court.courtStreet} onChange={(e) => setGroup('court', { courtStreet: e.target.value })} /></Field>
          <Field label="Court city/ZIP"><input className={input} value={form.court.courtCityZip} onChange={(e) => setGroup('court', { courtCityZip: e.target.value })} /></Field>
        </div>
      </Section>

      <Section title="Case">
        <div className="grid grid-cols-2 gap-2">
          <Field label="Case number"><input className={input} data-testid="f-caseNumber" value={form.caseInfo.caseNumber} onChange={(e) => setGroup('caseInfo', { caseNumber: e.target.value })} /></Field>
          <Field label="Conviction date"><input className={input} placeholder="YYYY-MM-DD" value={form.caseInfo.convictionDate} onChange={(e) => setGroup('caseInfo', { convictionDate: e.target.value })} /></Field>
        </div>
        <p className={label}>Charges</p>
        {form.caseInfo.charges.map((c, i) => (
          <div key={i} className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2 items-center mb-1">
            <input className={input} placeholder="Code (e.g. HS)" value={c.code} onChange={(e) => updateCharge(i, { code: e.target.value })} />
            <input className={input} placeholder="Section" value={c.section} onChange={(e) => updateCharge(i, { section: e.target.value })} />
            <input className={input} placeholder="Type" value={c.type} onChange={(e) => updateCharge(i, { type: e.target.value })} />
            <button type="button" onClick={() => removeCharge(i)} className="text-xs text-gray-400 hover:text-red-600 px-1">✕</button>
          </div>
        ))}
        <button type="button" onClick={addCharge} className="text-xs text-blue-600 hover:text-blue-800">+ Add charge</button>
      </Section>

      <Section title="Relief (staff-selected)">
        <Field label="Dismissal basis (Penal Code section)">
          <select className={input} data-testid="f-dismissalBasis" value={form.relief.dismissalBasis} onChange={(e) => setGroup('relief', { dismissalBasis: e.target.value })}>
            <option value="">Reviewer must select…</option>
            {DISMISSAL_BASIS_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </Field>
        <label className="flex items-center gap-1.5 text-sm text-gray-700">
          <input type="checkbox" checked={form.relief.felonyReductionRequested} onChange={(e) => setGroup('relief', { felonyReductionRequested: e.target.checked })} />
          Felony reduction requested
        </label>
      </Section>

      <label className="flex items-center gap-1.5 text-sm font-medium text-gray-900">
        <input type="checkbox" data-testid="f-staffReviewed" checked={form.staffReviewed} onChange={(e) => set({ staffReviewed: e.target.checked })} />
        I confirm this intake was staff-reviewed (required before generation)
      </label>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="rounded-lg border border-gray-200 p-3 space-y-2">
      <legend className="text-xs font-semibold text-gray-700 uppercase tracking-wide px-1">{title}</legend>
      {children}
    </fieldset>
  );
}
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <span className="block text-xs font-medium text-gray-600 mb-0.5">{label}</span>
      {children}
    </div>
  );
}
