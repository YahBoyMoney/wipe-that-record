import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  createPackageForSession,
  approvePackage,
  generateOfficialPacket,
  generatePackage,
} from '../service-core.mjs';

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

const sensitiveIntake = () => ({
  staffReviewed: true,
  selfRepresented: true,
  petitioner: { fullName: 'SECRETNAME, PERSON', email: 'secret-person@example.com', phone: '5551234567' },
  court: { county: 'riverside' },
  case: { caseNumber: 'SUPERSECRETCASE-42', convictionDate: '2017-07-07', charges: [{ code: 'HS', section: '11350', type: 'felony' }] },
  relief: { dismissalBasis: '1203.4a' },
});

async function newOfficialPackage(payload, sessionId = 'manual:official-1') {
  const { id } = await createPackageForSession(payload, {
    sourceSessionId: sessionId,
    templateKey: 'official_ca_dismissal_packet',
  });
  return id;
}

test('official package starts intake_needed and blocks generation before approval', async () => {
  const payload = makeFakePayload();
  const id = await newOfficialPackage(payload);
  let doc = await payload.findByID({ collection: 'document-packages', id });
  assert.equal(doc.status, 'intake_needed');

  const r = await generateOfficialPacket(payload, { id, intake: sensitiveIntake() });
  assert.equal(r.blocked, true);
  assert.equal(r.status, 'needs_manual_review');
});

test('missing required fields block generation even after approval', async () => {
  const payload = makeFakePayload();
  const id = await newOfficialPackage(payload, 'manual:official-2');
  await approvePackage(payload, { id, actor: 'reviewer' });

  const r = await generateOfficialPacket(payload, { id, intake: { staffReviewed: true, petitioner: {}, court: {}, case: {}, relief: {} } });
  assert.equal(r.blocked, true);
  assert.equal(r.status, 'needs_manual_review');
  assert.ok(r.reasons.length >= 4);
});

test('approved + staff-reviewed intake generates a packet and stores media', async () => {
  const payload = makeFakePayload();
  const id = await newOfficialPackage(payload, 'manual:official-3');
  await approvePackage(payload, { id, actor: 'reviewer' });

  const r = await generateOfficialPacket(payload, { id, intake: sensitiveIntake(), sample: true });
  assert.equal(r.status, 'generated');
  const doc = await payload.findByID({ collection: 'document-packages', id });
  assert.ok(doc.generatedFile, 'generatedFile media id set');
});

test('regeneration is idempotent (generated -> generated allowed)', async () => {
  const payload = makeFakePayload();
  const id = await newOfficialPackage(payload, 'manual:official-4');
  await approvePackage(payload, { id, actor: 'reviewer' });
  await generateOfficialPacket(payload, { id, intake: sensitiveIntake(), sample: true });
  const r = await generateOfficialPacket(payload, { id, intake: sensitiveIntake(), sample: true });
  assert.equal(r.status, 'generated');
});

test('recovers from needs_manual_review once intake is fixed', async () => {
  const payload = makeFakePayload();
  const id = await newOfficialPackage(payload, 'manual:official-5');
  await approvePackage(payload, { id, actor: 'reviewer' });
  // First attempt fails -> needs_manual_review
  await generateOfficialPacket(payload, { id, intake: { staffReviewed: true, petitioner: {}, court: {}, case: {}, relief: {} } });
  let doc = await payload.findByID({ collection: 'document-packages', id });
  assert.equal(doc.status, 'needs_manual_review');
  // Fixed intake now generates
  const r = await generateOfficialPacket(payload, { id, intake: sensitiveIntake(), sample: true });
  assert.equal(r.status, 'generated');
});

test('generatePackage routes official template to the official generator', async () => {
  const payload = makeFakePayload();
  const id = await newOfficialPackage(payload, 'manual:official-6');
  await approvePackage(payload, { id, actor: 'reviewer' });
  const r = await generatePackage(payload, { id, intake: sensitiveIntake(), sample: true });
  assert.equal(r.status, 'generated');
});

test('no PII reaches logs during official generation', async () => {
  const payload = makeFakePayload();
  const id = await newOfficialPackage(payload, 'manual:official-7');
  await approvePackage(payload, { id, actor: 'reviewer' });

  const original = console.log;
  const captured = [];
  console.log = (...args) => captured.push(args);
  try {
    await generateOfficialPacket(payload, { id, intake: sensitiveIntake(), sample: true });
  } finally {
    console.log = original;
  }
  const flat = JSON.stringify(captured);
  // None of the sensitive intake values may appear in logs.
  assert.ok(!flat.includes('SECRETNAME'), 'no defendant name in logs');
  assert.ok(!flat.includes('secret-person@example.com'), 'no email in logs');
  assert.ok(!flat.includes('SUPERSECRETCASE-42'), 'no case number in logs');
  assert.ok(!flat.includes('5551234567'), 'no phone in logs');
});
