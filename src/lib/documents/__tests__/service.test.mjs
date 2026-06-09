import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  createPackageForSession,
  approvePackage,
  generatePackage,
} from '../service-core.mjs';

// Minimal in-memory fake of the Payload Local API used by the service core.
function makeFakePayload() {
  const store = new Map(); // collection -> array of docs
  let seq = 0;
  const get = (c) => {
    if (!store.has(c)) store.set(c, []);
    return store.get(c);
  };
  return {
    _store: store,
    createCalls: 0,
    async find({ collection, where }) {
      const docs = get(collection);
      if (where?.sourceSessionId?.equals !== undefined) {
        return {
          docs: docs.filter((d) => d.sourceSessionId === where.sourceSessionId.equals),
        };
      }
      return { docs };
    },
    async create({ collection, data }) {
      this.createCalls += 1;
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

test('createPackageForSession is idempotent on sourceSessionId', async () => {
  const payload = makeFakePayload();
  const args = { sourceSessionId: 'cs_test_123', templateKey: 'diy_kit', customerEmail: 'a@b.com' };

  const first = await createPackageForSession(payload, args);
  const second = await createPackageForSession(payload, args);

  assert.equal(first.created, true);
  assert.equal(second.created, false);
  assert.equal(first.id, second.id);
  assert.equal(payload.createCalls, 1); // create only happened once
});

test('DIY packet starts ready_for_review (no human-review gate)', async () => {
  const payload = makeFakePayload();
  const { id } = await createPackageForSession(payload, {
    sourceSessionId: 'cs_diy',
    templateKey: 'diy_kit',
  });
  const doc = await payload.findByID({ collection: 'document-packages', id });
  assert.equal(doc.status, 'ready_for_review');
});

test('review-required packet starts intake_needed and blocks generation until approved', async () => {
  const payload = makeFakePayload();
  const { id } = await createPackageForSession(payload, {
    sourceSessionId: 'cs_full',
    templateKey: 'full_service',
  });
  let doc = await payload.findByID({ collection: 'document-packages', id });
  assert.equal(doc.status, 'intake_needed');

  // Generation is blocked before approval.
  const blocked = await generatePackage(payload, { id });
  assert.equal(blocked.blocked, true);
  assert.equal(blocked.status, 'needs_manual_review');

  // After approval, generation succeeds and produces a media file.
  await approvePackage(payload, { id, actor: 'reviewer@firm.com', notes: 'looks good' });
  doc = await payload.findByID({ collection: 'document-packages', id });
  assert.equal(doc.status, 'ready_for_review');
  assert.equal(doc.review.approved, true);

  const generated = await generatePackage(payload, { id });
  assert.equal(generated.status, 'generated');
  doc = await payload.findByID({ collection: 'document-packages', id });
  assert.ok(doc.generatedFile, 'generatedFile is set');
});

test('DIY packet generates immediately without approval', async () => {
  const payload = makeFakePayload();
  const { id } = await createPackageForSession(payload, {
    sourceSessionId: 'cs_diy2',
    templateKey: 'diy_kit',
  });
  const generated = await generatePackage(payload, { id });
  assert.equal(generated.status, 'generated');
});
