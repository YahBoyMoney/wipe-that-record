import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  canTransition,
  assertTransition,
  transition,
  appendAudit,
  InvalidTransitionError,
} from '../status.mjs';

test('allowed transitions return true', () => {
  assert.equal(canTransition('intake_needed', 'ready_for_review'), true);
  assert.equal(canTransition('ready_for_review', 'generated'), true);
  assert.equal(canTransition('generated', 'delivered'), true);
});

test('generated is reachable only from ready_for_review', () => {
  assert.equal(canTransition('intake_needed', 'generated'), false);
  assert.equal(canTransition('needs_manual_review', 'generated'), false);
  assert.equal(canTransition('ready_for_review', 'generated'), true);
});

test('same-status transition is idempotent-allowed', () => {
  assert.equal(canTransition('generated', 'generated'), true);
});

test('invalid transition throws InvalidTransitionError', () => {
  assert.throws(() => assertTransition('delivered', 'generated'), InvalidTransitionError);
});

test('transition returns new status and audit entry', () => {
  const { status, entry } = transition({
    from: 'intake_needed',
    to: 'ready_for_review',
    actor: 'tester',
    detail: 'ok',
  });
  assert.equal(status, 'ready_for_review');
  assert.equal(entry.fromStatus, 'intake_needed');
  assert.equal(entry.toStatus, 'ready_for_review');
  assert.equal(entry.actor, 'tester');
  assert.ok(entry.at);
});

test('appendAudit returns a new array with the entry', () => {
  const log = appendAudit([], { action: 'created' });
  assert.equal(log.length, 1);
  const log2 = appendAudit(log, { action: 'status_change' });
  assert.equal(log2.length, 2);
  assert.equal(log.length, 1); // original not mutated
});
