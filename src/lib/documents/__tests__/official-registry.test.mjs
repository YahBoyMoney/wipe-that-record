import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  getTemplate,
  isOfficialTemplate,
  OFFICIAL_TEMPLATE_KEY,
  templateKeyForSession,
  templateKeyForProduct,
  initialStatusForTemplate,
} from '../registry.mjs';
import { OFFICIAL_FORMS, OFFICIAL_FORM_IDS } from '../official/forms.mjs';

test('official template carries form ids, revisions and source URLs', () => {
  const tpl = getTemplate(OFFICIAL_TEMPLATE_KEY);
  assert.equal(tpl.official, true);
  assert.equal(tpl.requiresHumanReview, true);
  assert.equal(tpl.requiresOfficialCourtForms, true);
  const ids = tpl.forms.map((f) => f.id).sort();
  assert.deepEqual(ids, ['CR-180', 'CR-181']);
  for (const f of tpl.forms) {
    assert.match(f.revision, /Rev\. January 1, 2024/);
    assert.match(f.sourceUrl, /^https:\/\/www\.courts\.ca\.gov\/documents\/cr18[01]\.pdf$/);
    assert.ok(f.title.length > 0);
  }
});

test('OFFICIAL_FORMS metadata is complete', () => {
  assert.deepEqual(OFFICIAL_FORM_IDS.sort(), ['CR-180', 'CR-181']);
  for (const id of OFFICIAL_FORM_IDS) {
    const m = OFFICIAL_FORMS[id];
    assert.equal(m.id, id);
    assert.ok(m.file.endsWith('.pdf'));
    assert.equal(m.revision, 'Rev. January 1, 2024');
    assert.ok(m.penalCodeSections.includes('1203.4'));
    assert.equal(m.formStatus, 'Form Approved for Optional Use');
  }
});

test('official template requires the human-review gate at creation', () => {
  assert.equal(initialStatusForTemplate(OFFICIAL_TEMPLATE_KEY), 'intake_needed');
});

test('isOfficialTemplate only matches the official key', () => {
  assert.equal(isOfficialTemplate(OFFICIAL_TEMPLATE_KEY), true);
  assert.equal(isOfficialTemplate('diy_kit'), false);
  assert.equal(isOfficialTemplate('full_service'), false);
});

test('marketing-driven mappings never resolve to the official packet', () => {
  // Quiz / product mappings must NOT be able to auto-select official court forms.
  for (const args of [
    { type: 'diy' },
    { type: 'upgrade', upgradeType: 'review' },
    { type: 'upgrade', upgradeType: 'full' },
    {},
  ]) {
    assert.notEqual(templateKeyForSession(args), OFFICIAL_TEMPLATE_KEY);
  }
  for (const args of [
    { serviceType: 'full_service' },
    { category: 'legal' },
    { category: 'review' },
    { category: 'diy' },
  ]) {
    assert.notEqual(templateKeyForProduct(args), OFFICIAL_TEMPLATE_KEY);
  }
});
