import { test } from 'node:test';
import assert from 'node:assert/strict';
import { redactEmail, redactFields, safeLog } from '../redact.mjs';

test('redactEmail masks local and domain but keeps tld', () => {
  assert.equal(redactEmail('jane.doe@example.com'), 'j***@e***.com');
  assert.equal(redactEmail('not-an-email'), '[redacted]');
  assert.equal(redactEmail(undefined), '[redacted]');
});

test('redactFields strips sensitive keys, keeps safe ones', () => {
  const out = redactFields({
    email: 'a@b.com',
    caseNumber: 'CR-123',
    charges: ['x'],
    status: 'generated',
    templateKey: 'diy_kit',
  });
  assert.equal(out.email, '[redacted]');
  assert.equal(out.caseNumber, '[redacted]');
  assert.equal(out.charges, '[redacted]');
  assert.equal(out.status, 'generated');
  assert.equal(out.templateKey, 'diy_kit');
});

test('safeLog never prints raw sensitive values', () => {
  const original = console.log;
  const captured = [];
  console.log = (...args) => captured.push(args);
  try {
    safeLog('package.created', { email: 'secret@user.com', status: 'ready_for_review' });
  } finally {
    console.log = original;
  }
  const flat = JSON.stringify(captured);
  assert.ok(!flat.includes('secret@user.com'));
  assert.ok(flat.includes('ready_for_review'));
  assert.ok(flat.includes('[redacted]'));
});
