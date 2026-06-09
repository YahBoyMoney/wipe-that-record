import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateOfficialIntake, buildFieldValues } from '../official/mapping.mjs';

const goodIntake = () => ({
  staffReviewed: true,
  selfRepresented: true,
  petitioner: { fullName: 'DOE, JOHN A.', city: 'San Bernardino', state: 'CA', zip: '92401' },
  court: { county: 'san_bernardino' },
  case: { caseNumber: 'FSB-12345', convictionDate: '2019-04-15', charges: [{ code: 'PC', section: '459', type: 'felony' }] },
  relief: { dismissalBasis: '1203.4', felonyReductionRequested: true },
});

test('no intake at all is blocked', () => {
  const r = validateOfficialIntake(undefined);
  assert.equal(r.ok, false);
  assert.equal(r.status, 'blocked');
});

test('unreviewed intake is rejected even if otherwise complete', () => {
  const intake = goodIntake();
  intake.staffReviewed = false;
  const r = validateOfficialIntake(intake);
  assert.equal(r.ok, false);
  assert.equal(r.status, 'needs_manual_review');
  assert.ok(r.reasons.some((x) => /staffReviewed/.test(x)));
});

test('missing required fields block generation with precise reasons', () => {
  const r = validateOfficialIntake({ staffReviewed: true, petitioner: {}, court: {}, case: {}, relief: {} });
  assert.equal(r.ok, false);
  assert.equal(r.status, 'needs_manual_review');
  // name, county, case number, dismissal basis all flagged
  assert.ok(r.reasons.length >= 4);
});

test('dismissal basis outside the supported set is rejected, not guessed', () => {
  const intake = goodIntake();
  intake.relief.dismissalBasis = '1203.999';
  const r = validateOfficialIntake(intake);
  assert.equal(r.ok, false);
  assert.ok(r.reasons.some((x) => /not one of the supported/.test(x)));
});

test('staff-reviewed complete intake validates and maps fields', () => {
  const r = validateOfficialIntake(goodIntake());
  assert.equal(r.ok, true);
  const d = r.data;
  assert.equal(d.cr180Text.defendant, 'DOE, JOHN A.');
  assert.equal(d.cr180Text.caseNumber, 'FSB-12345');
  assert.equal(d.cr180Text.courtCounty, 'SAN BERNARDINO');
  // self-represented -> "in pro per"
  assert.match(d.cr180Text.attyFor, /in pro per/);
  // 1203.4 basis -> the 1203.4 checkbox
  assert.deepEqual(d.cr180Checkboxes, ['basis1203_4']);
  // caption mirrored onto CR-181
  assert.equal(d.cr181Text.defendant, 'DOE, JOHN A.');
});

test('each supported basis maps to its own CR-180 checkbox', () => {
  const map = {
    '1203.4': 'basis1203_4',
    '1203.4a': 'basis1203_4a',
    '1203.41': 'basis1203_41',
    '1203.42': 'basis1203_42',
    '1203.49': 'basis1203_49',
  };
  for (const [basis, cb] of Object.entries(map)) {
    const intake = goodIntake();
    intake.relief.dismissalBasis = basis;
    const r = validateOfficialIntake(intake);
    assert.equal(r.ok, true, `basis ${basis} should validate`);
    assert.deepEqual(r.data.cr180Checkboxes, [cb]);
  }
});

test('buildFieldValues never emits empty strings (they are stripped)', () => {
  const d = buildFieldValues(goodIntake());
  for (const v of Object.values(d.cr180Text)) assert.notEqual(v, '');
  for (const v of Object.values(d.cr181Text)) assert.notEqual(v, '');
});

test('CR-181 (the order) is never pre-checked with a court decision', () => {
  const r = validateOfficialIntake(goodIntake());
  assert.deepEqual(r.data.cr181Checkboxes, []);
});
