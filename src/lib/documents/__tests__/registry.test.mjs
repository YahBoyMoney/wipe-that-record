import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  templateKeyForSession,
  templateKeyForProduct,
  getTemplate,
  TEMPLATE_KEYS,
} from '../registry.mjs';

test('session metadata maps to the correct template key', () => {
  assert.equal(templateKeyForSession({ type: 'diy' }), 'diy_kit');
  assert.equal(templateKeyForSession({ type: 'upgrade', upgradeType: 'review' }), 'expert_review');
  assert.equal(templateKeyForSession({ type: 'upgrade', upgradeType: 'full' }), 'full_service');
  assert.equal(templateKeyForSession({}), 'diy_kit'); // safe default
});

test('product fields map to the correct template key', () => {
  assert.equal(templateKeyForProduct({ serviceType: 'full_service' }), 'full_service');
  assert.equal(templateKeyForProduct({ category: 'legal' }), 'full_service');
  assert.equal(templateKeyForProduct({ category: 'review' }), 'expert_review');
  assert.equal(templateKeyForProduct({ category: 'diy' }), 'diy_kit');
});

test('review-required flags match business rules', () => {
  assert.equal(getTemplate('diy_kit').requiresHumanReview, false);
  assert.equal(getTemplate('expert_review').requiresHumanReview, true);
  assert.equal(getTemplate('full_service').requiresHumanReview, true);
});

test('every template requires official court forms and has a checklist', () => {
  for (const key of TEMPLATE_KEYS) {
    const tpl = getTemplate(key);
    assert.equal(tpl.requiresOfficialCourtForms, true);
    assert.ok(tpl.checklist.length > 0);
    assert.ok(tpl.sections.length > 0);
  }
});

test('unknown template key throws', () => {
  assert.throws(() => getTemplate('nope'));
});
