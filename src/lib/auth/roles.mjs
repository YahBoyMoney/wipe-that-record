// Pure authorization predicates shared by the collection access control, the staff-session
// guard (src/app/api/staff/_session.ts), the internal/setup route guard
// (src/app/api/documents/_auth.ts), and the /admin-panel layout. Keeping these as a tiny,
// dependency-free module lets them be unit-tested with `node --test` without a database,
// bundler, or next/server import, while guaranteeing the routes and tests agree on the rule.

export const STAFF_ROLES = ['admin', 'superadmin'];

// True only for staff roles that may read/manage lead, order, and customer PII.
export function isStaffRole(role) {
  return role === 'admin' || role === 'superadmin';
}

// True only for superadmin — used for destructive operations (e.g. deleting leads).
export function isSuperadmin(role) {
  return role === 'superadmin';
}

// Bearer-token check for the internal/setup routes. Fails closed when the server has no
// CRON_SECRET configured, so an unset secret can never authorize a request.
export function isValidBearer(authHeader, secret) {
  if (!secret) return false;
  return authHeader === `Bearer ${secret}`;
}
