'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { STATUS_LABELS, STATUS_CHIP_CLASS, TEMPLATE_LABELS } from './constants';
import OfficialPackageReview from './OfficialPackageReview';

export interface PackageListItem {
  id: string | number;
  sourceSessionId?: string;
  templateKey?: string;
  status?: string;
  customerEmail?: string | null;
  isOfficial?: boolean;
  reviewApproved?: boolean;
  validationOk?: boolean;
  validationIssueCount?: number;
  hasArtifact?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

function StatusChip({ status }: { status?: string }) {
  if (!status) return null;
  return (
    <span
      data-testid="status-chip"
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
        STATUS_CHIP_CLASS[status] || 'bg-gray-100 text-gray-800'
      }`}
    >
      {STATUS_LABELS[status] || status}
    </span>
  );
}

export default function DocumentPackagesDashboard() {
  const [docs, setDocs] = useState<PackageListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [officialOnly, setOfficialOnly] = useState(false);
  const [selectedId, setSelectedId] = useState<string | number | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.set('status', statusFilter);
      if (officialOnly) params.set('official', '1');
      const res = await fetch(`/api/staff/document-packages?${params.toString()}`, {
        credentials: 'include',
      });
      if (res.status === 401 || res.status === 403) {
        setError('Your session is not authorized. Please sign in to the admin panel.');
        setDocs([]);
        return;
      }
      if (!res.ok) throw new Error('Failed to load');
      const data = await res.json();
      setDocs(data.docs || []);
    } catch {
      setError('Could not load document packages. Please retry.');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, officialOnly]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="min-h-screen bg-gray-50" data-testid="staff-dashboard">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-xl font-bold text-gray-900">Document Packages</h1>
          <p className="text-xs text-gray-500 mt-1">
            Review paid-order document packages and generate official CA dismissal packets.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* List */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 flex flex-wrap items-center gap-3">
                <select
                  data-testid="status-filter"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="text-sm border border-gray-300 rounded-lg px-3 py-1.5"
                >
                  <option value="">All statuses</option>
                  {Object.entries(STATUS_LABELS).map(([v, l]) => (
                    <option key={v} value={v}>
                      {l}
                    </option>
                  ))}
                </select>
                <label className="flex items-center gap-1.5 text-sm text-gray-700">
                  <input
                    data-testid="official-filter"
                    type="checkbox"
                    checked={officialOnly}
                    onChange={(e) => setOfficialOnly(e.target.checked)}
                  />
                  Official only
                </label>
                <button
                  data-testid="refresh-list"
                  onClick={load}
                  className="ml-auto text-xs font-medium text-blue-600 hover:text-blue-800"
                >
                  Refresh
                </button>
              </div>

              {loading ? (
                <div className="p-8 text-center text-sm text-gray-500" data-testid="list-loading">
                  Loading document packages…
                </div>
              ) : error ? (
                <div className="p-8 text-center text-sm text-red-600" data-testid="list-error">
                  {error}
                </div>
              ) : docs.length === 0 ? (
                <div className="p-8 text-center text-sm text-gray-500" data-testid="list-empty">
                  No document packages match this filter.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Reference</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Checks</th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Action</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200" data-testid="package-rows">
                      {docs.map((d) => (
                        <tr
                          key={String(d.id)}
                          className={`hover:bg-gray-50 ${selectedId === d.id ? 'bg-blue-50' : ''}`}
                        >
                          <td className="px-4 py-3">
                            <p className="text-sm font-medium text-gray-900 truncate max-w-[180px]">
                              {d.sourceSessionId}
                            </p>
                            {d.customerEmail && (
                              <p className="text-xs text-gray-500 truncate max-w-[180px]">{d.customerEmail}</p>
                            )}
                          </td>
                          <td className="px-4 py-3 text-xs text-gray-700">
                            {TEMPLATE_LABELS[d.templateKey || ''] || d.templateKey}
                          </td>
                          <td className="px-4 py-3">
                            <StatusChip status={d.status} />
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex flex-col gap-1 text-xs">
                              <span className={d.reviewApproved ? 'text-green-700' : 'text-gray-400'}>
                                {d.reviewApproved ? '✓ Approved' : '○ Not approved'}
                              </span>
                              {d.isOfficial && (
                                <span className={d.validationOk ? 'text-green-700' : 'text-amber-700'}>
                                  {d.validationOk
                                    ? '✓ Intake valid'
                                    : `${d.validationIssueCount ?? 0} issue(s)`}
                                </span>
                              )}
                              {d.hasArtifact && <span className="text-emerald-700">✓ Packet</span>}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <button
                              data-testid={`open-${d.id}`}
                              onClick={() => setSelectedId(d.id)}
                              className="px-3 py-1 text-xs font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
                            >
                              Open
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Detail / review */}
          <div className="lg:col-span-2">
            {selectedId == null ? (
              <div
                data-testid="detail-empty"
                className="bg-white rounded-xl border border-gray-200 p-8 text-center text-sm text-gray-500"
              >
                Select a package to review its intake and generate the official packet.
              </div>
            ) : (
              <OfficialPackageReview
                key={String(selectedId)}
                packageId={selectedId}
                onChanged={load}
                onClose={() => setSelectedId(null)}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
