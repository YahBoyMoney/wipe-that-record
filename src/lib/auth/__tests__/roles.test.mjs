import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isStaffRole, isSuperadmin, isValidBearer, STAFF_ROLES } from '../roles.mjs';

test('isStaffRole allows admin and superadmin only', () => {
  assert.equal(isStaffRole('admin'), true);
  assert.equal(isStaffRole('superadmin'), true);
});

test('isStaffRole rejects non-staff and missing roles', () => {
  for (const role of ['user', 'manager', 'editor', '', undefined, null]) {
    assert.equal(isStaffRole(role), false, `role ${String(role)} must be rejected`);
  }
});

test('isSuperadmin is stricter than isStaffRole', () => {
  assert.equal(isSuperadmin('superadmin'), true);
  assert.equal(isSuperadmin('admin'), false);
  assert.equal(isSuperadmin('user'), false);
  assert.equal(isSuperadmin(undefined), false);
});

test('STAFF_ROLES contains exactly admin and superadmin', () => {
  assert.deepEqual([...STAFF_ROLES].sort(), ['admin', 'superadmin']);
});

test('isValidBearer accepts the exact matching bearer token', () => {
  assert.equal(isValidBearer('Bearer s3cr3t', 's3cr3t'), true);
});

test('isValidBearer rejects wrong, malformed, or missing tokens', () => {
  assert.equal(isValidBearer('Bearer wrong', 's3cr3t'), false);
  assert.equal(isValidBearer('s3cr3t', 's3cr3t'), false);
  assert.equal(isValidBearer('Bearer ', 's3cr3t'), false);
  assert.equal(isValidBearer(null, 's3cr3t'), false);
  assert.equal(isValidBearer(undefined, 's3cr3t'), false);
});

test('isValidBearer fails closed when server secret is unset', () => {
  assert.equal(isValidBearer('Bearer anything', ''), false);
  assert.equal(isValidBearer('Bearer anything', undefined), false);
  assert.equal(isValidBearer(undefined, undefined), false);
});
