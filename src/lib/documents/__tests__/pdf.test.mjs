import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildPacketPdf, escapePdfText, wrapLines } from '../pdf.mjs';

function toText(bytes) {
  return Buffer.from(bytes).toString('latin1');
}

test('produces a non-empty valid PDF buffer', () => {
  const bytes = buildPacketPdf({ templateKey: 'diy_kit', referenceCode: 'WTR-TEST-001' });
  assert.ok(bytes instanceof Uint8Array);
  assert.ok(bytes.length > 500);
  const text = toText(bytes);
  assert.ok(text.startsWith('%PDF-1.4'), 'starts with PDF header');
  assert.ok(text.trimEnd().endsWith('%%EOF'), 'ends with EOF');
  assert.ok(text.includes('xref'), 'has xref table');
  assert.ok(text.includes('startxref'), 'has startxref');
});

test('includes mandatory disclaimers', () => {
  const text = toText(buildPacketPdf({ templateKey: 'full_service' }));
  assert.ok(text.includes('not legal advice'));
  assert.ok(text.includes('does not guarantee') || text.includes('not guarantee'));
});

test('works for every template key', () => {
  for (const key of ['diy_kit', 'expert_review', 'full_service']) {
    const text = toText(buildPacketPdf({ templateKey: key }));
    assert.ok(text.startsWith('%PDF-1.4'));
    assert.ok(text.trimEnd().endsWith('%%EOF'));
  }
});

test('escapePdfText escapes parens/backslash and strips non-ascii', () => {
  assert.equal(escapePdfText('a(b)c\\d'), 'a\\(b\\)c\\\\d');
  assert.equal(escapePdfText('café'), 'caf '); // accented char replaced with space
});

test('wrapLines never exceeds max width and never loses words', () => {
  const input = 'word '.repeat(80).trim();
  const lines = wrapLines(input, 40);
  for (const line of lines) assert.ok(line.length <= 40);
  assert.equal(lines.join(' ').split(/\s+/).length, 80);
});
