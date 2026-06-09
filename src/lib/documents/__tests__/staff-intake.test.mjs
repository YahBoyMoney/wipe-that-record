import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  createPackageForSession,
  approvePackage,
  saveOfficialIntake,
  generateOfficialPacket,
  intakeFromStored,
} from '../service-core.mjs';

// Reuses the same in-memory fake-payload shape as official-service.test.mjs.
function makeFakePayload() {
  const store = new Map();
  let seq = 0;
  const get = (c) => {
    if (!store.has(c)) store.set(c, []);
    return store.get(c);
  };
  return {
    async find({ collection, where }) {
      const docs = get(collection);
      if (where?.sourceSessionId?.equals !== undefined) {
        return { docs: docs.filter((d) => d.sourceSessionId === where.sourceSessionId.equals) };
      }
      return { docs };
    },
    async create({ collection, data }) {
      const doc = { id: ++seq, ...data };
      get(collection).push(doc);
      return doc;
    },
    async findByID({ collection, id }) {
      return get(collection).find((d) => d.id === id);
    },
    async update({ collection, id, data }) {
      const doc = get(collection).find((d) => d.id === id);
      Object.assign(doc, data);
      return doc;
    },
  };
}

// Mirrors the shape the staff dashboard posts (canonical OfficialIntake), passed through
// service.saveOfficialIntake which stores it under officialIntake.caseInfo.
const fullIntake = () => ({
  staffReviewed: true,
  selfRepresented: true,
  petitioner: { fullName: 'DOE, JANE', email: 'jane@example.com', phone: '9095551234' },
  court: { county: 'san_bernardino' },
  case: { caseNumber: 'FSB-2020-0001', convictionDate: '2019-03-01', charges: [{ code: 'PC', section: '459', type: 'felony' }] },
  relief: { dismissalBasis: '1203.4' },
});

async function newOfficial(payload, sessionId = 'manual:staff-1') {
  const { id } = await createPackageForSession(payload, {
    sourceSessionId: sessionId,
    templateKey: 'official_ca_dismissal_packet',
  });
  return id;
}

test('saveOfficialIntake persists intake and reports valid when complete', async () => {
  const payload = makeFakePayload();
  const id = await newOfficial(payload);
  const res = await saveOfficialIntake(payload, { id, actor: 'staff@x.com', intake: fullIntake() });

  assert.equal(res.validation.ok, true);
  assert.deepEqual(res.validation.reasons, []);

  const doc = await payload.findByID({ collection: 'document-packages', id });
  assert.equal(doc.officialIntake.staffReviewed, true);
  // Stored under caseInfo (Payload-friendly key), not `case`.
  assert.equal(doc.officialIntake.caseInfo.caseNumber, 'FSB-2020-0001');
  assert.equal(doc.officialIntake.savedBy, 'staff@x.com');
  assert.equal(doc.validation.ok, true);
  // Audit trail must record the save without leaking PII into the detail string.
  const last = doc.auditLog[doc.auditLog.length - 1];
  assert.equal(last.action, 'intake_saved');
  assert.ok(!last.detail.includes('FSB-2020-0001'));
});

test('saveOfficialIntake reports validation issues for incomplete intake without throwing', async () => {
  const payload = makeFakePayload();
  const id = await newOfficial(payload, 'manual:staff-2');
  const incomplete = fullIntake();
  incomplete.staffReviewed = false;
  incomplete.relief.dismissalBasis = '';

  const res = await saveOfficialIntake(payload, { id, actor: 'staff@x.com', intake: incomplete });
  assert.equal(res.validation.ok, false);
  assert.ok(res.validation.reasons.length >= 2);
  // Reasons are short non-PII strings.
  for (const r of res.validation.reasons) {
    assert.equal(typeof r, 'string');
    assert.ok(!r.includes('FSB-2020-0001'));
  }
});

test('generate uses saved intake when no intake arg is passed (dashboard path)', async () => {
  const payload = makeFakePayload();
  const id = await newOfficial(payload, 'manual:staff-3');
  await saveOfficialIntake(payload, { id, actor: 'staff@x.com', intake: fullIntake() });
  await approvePackage(payload, { id, actor: 'staff@x.com' });

  // No `intake` passed — must fall back to the stored officialIntake.
  const res = await generateOfficialPacket(payload, { id, actor: 'staff@x.com' });
  assert.equal(res.status, 'generated');
  assert.ok(!res.blocked);

  const doc = await payload.findByID({ collection: 'document-packages', id });
  assert.ok(doc.generatedFile);
  assert.ok(doc.generatedArtifact.fileName.endsWith('.pdf'));
  assert.equal(doc.generatedArtifact.sample, false);
  assert.ok(doc.generatedArtifact.byteSize > 0);
});

test('generate stays blocked when saved intake is incomplete', async () => {
  const payload = makeFakePayload();
  const id = await newOfficial(payload, 'manual:staff-4');
  const incomplete = fullIntake();
  incomplete.relief.dismissalBasis = '';
  await saveOfficialIntake(payload, { id, actor: 'staff@x.com', intake: incomplete });
  await approvePackage(payload, { id, actor: 'staff@x.com' });

  const res = await generateOfficialPacket(payload, { id, actor: 'staff@x.com' });
  assert.equal(res.blocked, true);
  assert.ok(res.reasons.length >= 1);

  const doc = await payload.findByID({ collection: 'document-packages', id });
  assert.ok(!doc.generatedFile);
});

test('generate stays blocked before review approval even with valid saved intake', async () => {
  const payload = makeFakePayload();
  const id = await newOfficial(payload, 'manual:staff-5');
  await saveOfficialIntake(payload, { id, actor: 'staff@x.com', intake: fullIntake() });

  const res = await generateOfficialPacket(payload, { id, actor: 'staff@x.com' });
  assert.equal(res.blocked, true);
  assert.match(res.reasons[0], /review required/i);
});

test('intakeFromStored maps caseInfo back to canonical case shape', () => {
  const canonical = intakeFromStored({
    staffReviewed: true,
    selfRepresented: false,
    petitioner: { fullName: 'DOE, JANE' },
    court: { county: 'riverside' },
    caseInfo: { caseNumber: 'X-1', charges: [{ code: 'PC', section: '459', type: 'felony' }] },
    relief: { dismissalBasis: '1203.4' },
  });
  assert.equal(canonical.case.caseNumber, 'X-1');
  assert.equal(canonical.case.charges[0].section, '459');
  assert.equal(canonical.relief.dismissalBasis, '1203.4');
});
