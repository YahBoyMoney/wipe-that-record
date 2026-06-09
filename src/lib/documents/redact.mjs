// PII-safe logging helpers. Sensitive client / criminal-record data must never reach
// application logs or analytics events. Use safeLog instead of console.log when any
// field could carry PII.

export const SENSITIVE_KEYS = [
  'email',
  'phone',
  'dob',
  'dateofbirth',
  'ssn',
  'casenumber',
  'case_number',
  'charges',
  'charge',
  'conviction',
  'convictiontype',
  'first',
  'last',
  'firstname',
  'lastname',
  'name',
  'fullname',
  'street',
  'address',
];

// a***@e***.com  — keeps enough to correlate without exposing the address.
export function redactEmail(email) {
  if (typeof email !== 'string' || !email.includes('@')) return '[redacted]';
  const [local, domain] = email.split('@');
  const dotIdx = domain.lastIndexOf('.');
  const tld = dotIdx >= 0 ? domain.slice(dotIdx) : '';
  const domainName = dotIdx >= 0 ? domain.slice(0, dotIdx) : domain;
  const mask = (s) => (s.length ? `${s[0]}***` : '***');
  return `${mask(local)}@${mask(domainName)}${tld}`;
}

function isSensitiveKey(key) {
  return SENSITIVE_KEYS.includes(String(key).toLowerCase());
}

// Returns a shallow copy of `fields` with sensitive values replaced by '[redacted]'.
export function redactFields(fields) {
  if (!fields || typeof fields !== 'object') return fields;
  const out = {};
  for (const [k, v] of Object.entries(fields)) {
    out[k] = isSensitiveKey(k) ? '[redacted]' : v;
  }
  return out;
}

// Structured, PII-safe console log. `scope` is a short event name; `fields` are
// non-sensitive identifiers/flags (sensitive keys are auto-redacted as a safety net).
export function safeLog(scope, fields) {
  if (fields === undefined) {
    console.log(`[documents] ${scope}`);
    return;
  }
  console.log(`[documents] ${scope}`, redactFields(fields));
}
