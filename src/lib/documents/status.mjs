// Document-package status machine. Pure functions only — no database access — so it
// can be unit-tested with zero dependencies and reused by the service layer.

export const STATUSES = [
  'intake_needed',
  'ready_for_review',
  'needs_manual_review',
  'generated',
  'delivered',
  'blocked',
];

// Allowed transitions: from -> [to...]. `generated` is reachable only from
// `ready_for_review`, which (for review-required templates) the service layer only
// permits after a human approval is recorded.
export const TRANSITIONS = {
  intake_needed: ['ready_for_review', 'needs_manual_review', 'blocked'],
  ready_for_review: ['generated', 'needs_manual_review', 'blocked'],
  needs_manual_review: ['ready_for_review', 'blocked'],
  generated: ['delivered', 'needs_manual_review', 'blocked'],
  delivered: ['needs_manual_review', 'blocked'],
  blocked: ['intake_needed', 'needs_manual_review'],
};

export class InvalidTransitionError extends Error {
  constructor(from, to) {
    super(`Invalid document-package status transition: ${from} -> ${to}`);
    this.name = 'InvalidTransitionError';
    this.from = from;
    this.to = to;
  }
}

export function canTransition(from, to) {
  if (from === to) return true; // idempotent re-set is allowed (e.g. regenerate)
  const allowed = TRANSITIONS[from];
  return Array.isArray(allowed) && allowed.includes(to);
}

export function assertTransition(from, to) {
  if (!canTransition(from, to)) throw new InvalidTransitionError(from, to);
}

// Builds an audit entry. `detail` must never contain PII — callers pass short,
// non-sensitive descriptions only.
export function buildAuditEntry({ action, fromStatus, toStatus, actor, detail }) {
  return {
    at: new Date().toISOString(),
    action,
    fromStatus: fromStatus ?? null,
    toStatus: toStatus ?? null,
    actor: actor ?? 'system',
    detail: detail ?? '',
  };
}

// Validates a transition and returns the new status plus the audit entry to append.
// Does not touch persistence.
export function transition({ from, to, actor, detail }) {
  assertTransition(from, to);
  return {
    status: to,
    entry: buildAuditEntry({
      action: 'status_change',
      fromStatus: from,
      toStatus: to,
      actor,
      detail,
    }),
  };
}

export function appendAudit(log, entry) {
  return [...(Array.isArray(log) ? log : []), entry];
}
