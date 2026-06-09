import { test } from 'node:test';
import assert from 'node:assert/strict';
import { PDFDocument } from 'pdf-lib';
import { validateOfficialIntake } from '../official/mapping.mjs';
import { buildOfficialDismissalPacket } from '../official/fill.mjs';

function toText(bytes) {
  return Buffer.from(bytes).toString('latin1');
}

// The packet's Info-dictionary metadata is the machine-checkable record of its contents
// (the static form glyphs use custom font encodings and are not plaintext-searchable).
async function packetMeta(bytes) {
  const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
  return {
    pages: doc.getPageCount(),
    title: doc.getTitle() || '',
    subject: doc.getSubject() || '',
    keywords: doc.getKeywords() || '',
  };
}

const intake = {
  staffReviewed: true,
  selfRepresented: true,
  petitioner: { fullName: 'ROE, RICHARD' },
  court: { county: 'san_bernardino' },
  case: { caseNumber: 'FSB-SAMPLE-001', convictionDate: '2018-02-02', charges: [{ code: 'PC', section: '459', type: 'felony' }] },
  relief: { dismissalBasis: '1203.4' },
};

test('produces a valid merged CR-180 + CR-181 packet PDF', async () => {
  const v = validateOfficialIntake(intake);
  assert.equal(v.ok, true);
  const bytes = await buildOfficialDismissalPacket(v.data, { sample: true });
  assert.ok(bytes instanceof Uint8Array);
  assert.ok(bytes.length > 2000);
  const text = toText(bytes);
  assert.ok(text.startsWith('%PDF'), 'has PDF header');
  assert.ok(text.includes('%%EOF'), 'has EOF marker');
});

test('packet merges all CR-180 (3pp) and CR-181 (2pp) pages', async () => {
  const v = validateOfficialIntake(intake);
  const bytes = await buildOfficialDismissalPacket(v.data, { sample: true });
  const meta = await packetMeta(bytes);
  assert.equal(meta.pages, 5, 'CR-180 (3) + CR-181 (2) = 5 pages');
});

test('sample packet documents BOTH CR-180 and CR-181 form identifiers', async () => {
  const v = validateOfficialIntake(intake);
  const bytes = await buildOfficialDismissalPacket(v.data, { sample: true });
  const meta = await packetMeta(bytes);
  assert.ok(meta.title.includes('CR-180'), 'title names CR-180');
  assert.ok(meta.title.includes('CR-181'), 'title names CR-181');
  assert.ok(meta.keywords.includes('CR-180') && meta.keywords.includes('CR-181'));
});

test('sample output is labeled SAMPLE - NOT FOR FILING', async () => {
  const v = validateOfficialIntake(intake);
  const bytes = await buildOfficialDismissalPacket(v.data, { sample: true });
  const meta = await packetMeta(bytes);
  assert.ok(/SAMPLE/.test(meta.subject), 'sample label present in subject');
  assert.ok(/SAMPLE/.test(meta.keywords), 'sample label present in keywords');
});

test('real (non-sample) packet carries no SAMPLE label', async () => {
  const v = validateOfficialIntake(intake);
  const bytes = await buildOfficialDismissalPacket(v.data, { sample: false });
  const meta = await packetMeta(bytes);
  assert.ok(!/SAMPLE/.test(meta.subject), 'no SAMPLE in subject');
  assert.ok(!/SAMPLE/.test(meta.keywords), 'no SAMPLE in keywords');
  assert.ok(/OFFICIAL/.test(meta.keywords), 'marked OFFICIAL');
});

test('packet metadata carries no petitioner PII', async () => {
  const v = validateOfficialIntake(intake);
  const bytes = await buildOfficialDismissalPacket(v.data, { sample: false });
  const meta = await packetMeta(bytes);
  const blob = `${meta.title} ${meta.subject} ${meta.keywords}`;
  assert.ok(!blob.includes('ROE'), 'no defendant name in metadata');
  assert.ok(!blob.includes('FSB-SAMPLE-001'), 'no case number in metadata');
});
