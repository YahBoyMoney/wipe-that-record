// Runtime core for document-package orchestration, kept in .mjs so it can be unit
// tested with zero-dependency `node --test` on Node 20. service.ts is a thin typed
// wrapper around these functions.

import { getTemplate, initialStatusForTemplate, isOfficialTemplate } from './registry.mjs';
import { buildAuditEntry, transition } from './status.mjs';
import { buildPacketPdf } from './pdf.mjs';
import { safeLog } from './redact.mjs';
import { validateOfficialIntake } from './official/mapping.mjs';

const COLLECTION = 'document-packages';

async function findBySession(payload, sourceSessionId) {
  const res = await payload.find({
    collection: COLLECTION,
    where: { sourceSessionId: { equals: sourceSessionId } },
    limit: 1,
  });
  return res.docs[0];
}

// Idempotent: safe to call repeatedly for the same session (Stripe webhook retries).
export async function createPackageForSession(payload, args) {
  const { sourceSessionId, templateKey, customerEmail, linkedLeadId, linkedOrderId } = args;

  const existing = await findBySession(payload, sourceSessionId);
  if (existing) {
    safeLog('package.exists', { templateKey, sessionPresent: true });
    return { created: false, id: existing.id };
  }

  const template = getTemplate(templateKey);
  const initialStatus = initialStatusForTemplate(templateKey);

  try {
    const doc = await payload.create({
      collection: COLLECTION,
      data: {
        sourceSessionId,
        templateKey,
        customerEmail,
        status: initialStatus,
        ...(linkedLeadId ? { linkedLead: linkedLeadId } : {}),
        ...(linkedOrderId ? { linkedOrder: linkedOrderId } : {}),
        review: { approved: false },
        auditLog: [
          buildAuditEntry({
            action: 'created',
            toStatus: initialStatus,
            actor: 'system',
            detail: `Created from paid ${template.productLabel} purchase`,
          }),
        ],
      },
    });
    safeLog('package.created', { templateKey, status: initialStatus });
    return { created: true, id: doc.id };
  } catch (err) {
    // Unique-index race (concurrent retries): re-query and treat as existing.
    const race = await findBySession(payload, sourceSessionId);
    if (race) return { created: false, id: race.id };
    throw err;
  }
}

export async function createDocumentPackageForOrder(payload, args) {
  return createPackageForSession(payload, {
    sourceSessionId: `order:${args.orderId}`,
    templateKey: args.templateKey,
    customerEmail: args.customerEmail,
    linkedOrderId: args.orderId,
  });
}

async function loadPackage(payload, id) {
  const doc = await payload.findByID({ collection: COLLECTION, id });
  if (!doc) throw new Error('Document package not found');
  return doc;
}

export async function approvePackage(payload, args) {
  const pkg = await loadPackage(payload, args.id);
  const { status, entry } = transition({
    from: pkg.status,
    to: 'ready_for_review',
    actor: args.actor,
    detail: 'Human review approved',
  });
  await payload.update({
    collection: COLLECTION,
    id: args.id,
    data: {
      status,
      review: {
        approved: true,
        reviewedBy: args.actor,
        reviewedAt: new Date().toISOString(),
        reviewNotes: args.notes,
      },
      auditLog: [...(pkg.auditLog || []), entry],
    },
  });
  safeLog('package.approved', { id: String(args.id) });
  return { status };
}

// Generates the PDF packet and stores it in Payload media. Blocked unless a
// review-required template has been approved.
export async function generatePackage(payload, args) {
  const pkg = await loadPackage(payload, args.id);

  // Official packets are built from real court forms + staff-reviewed intake and must go
  // through generateOfficialPacket (which needs that intake). The informational generator
  // below cannot produce them, so route there explicitly.
  if (isOfficialTemplate(pkg.templateKey)) {
    return generateOfficialPacket(payload, args);
  }

  const template = getTemplate(pkg.templateKey);

  if (template.requiresHumanReview && !(pkg.review && pkg.review.approved)) {
    const { status, entry } = transition({
      from: pkg.status,
      to: 'needs_manual_review',
      actor: args.actor || 'system',
      detail: 'Generation blocked: human review required before delivery',
    });
    await payload.update({
      collection: COLLECTION,
      id: args.id,
      data: { status, auditLog: [...(pkg.auditLog || []), entry] },
    });
    safeLog('package.generate_blocked', { id: String(args.id) });
    return { status, blocked: true };
  }

  const pdf = buildPacketPdf({
    templateKey: pkg.templateKey,
    referenceCode: pkg.sourceSessionId,
    generatedAt: new Date().toISOString().slice(0, 10),
  });

  const media = await payload.create({
    collection: 'media',
    data: { alt: `${template.productLabel} packet` },
    file: {
      data: Buffer.from(pdf),
      mimetype: 'application/pdf',
      name: `packet-${pkg.sourceSessionId}.pdf`.replace(/[^a-zA-Z0-9.-]/g, '_'),
      size: pdf.byteLength,
    },
  });

  const { status, entry } = transition({
    from: pkg.status,
    to: 'generated',
    actor: args.actor || 'system',
    detail: 'Packet generated',
  });

  await payload.update({
    collection: COLLECTION,
    id: args.id,
    data: {
      status,
      generatedFile: media.id,
      auditLog: [...(pkg.auditLog || []), entry],
    },
  });
  safeLog('package.generated', { id: String(args.id), templateKey: pkg.templateKey });
  return { status };
}

// Generates the official CA dismissal packet (filled CR-180 + draft CR-181) for a package.
//
// Safety model:
//  - Always requires the human-review gate to be satisfied first (same as generatePackage).
//  - The `intake` MUST be staff-reviewed structured data supplied by the caller (the staff
//    API / admin), NOT marketing-quiz answers. Validation lives in official/mapping.mjs.
//  - If required data or the staff-reviewed dismissal basis is missing, the package is moved
//    to needs_manual_review / blocked with precise, non-PII reasons — never filled wrong.
//  - Real packets carry no SAMPLE watermark, but are still left at `generated` (not
//    delivered) so a human approves delivery separately. `sample: true` stamps SAMPLE for
//    demos/tests.
//
// pdf-lib is imported dynamically so the heavier dependency is only loaded when an official
// packet is actually generated (the informational packet path stays dependency-free).
export async function generateOfficialPacket(payload, args) {
  const pkg = await loadPackage(payload, args.id);

  if (!isOfficialTemplate(pkg.templateKey)) {
    throw new Error('Package is not an official_ca_dismissal_packet');
  }

  // Human-review gate: official packets always require it.
  if (!(pkg.review && pkg.review.approved)) {
    const { status, entry } = transition({
      from: pkg.status,
      to: 'needs_manual_review',
      actor: args.actor || 'system',
      detail: 'Official packet blocked: human review required before generation',
    });
    await payload.update({
      collection: COLLECTION,
      id: args.id,
      data: { status, auditLog: [...(pkg.auditLog || []), entry] },
    });
    safeLog('official.generate_blocked', { id: String(args.id), reason: 'review_required' });
    return { status, blocked: true, reasons: ['Human review required before generation'] };
  }

  // Validate the staff-reviewed intake. Failure => needs_manual_review / blocked with
  // non-PII reasons. We log only the count and the short rule strings (never the data).
  const validation = validateOfficialIntake(args.intake);
  if (!validation.ok) {
    const { status, entry } = transition({
      from: pkg.status,
      to: validation.status,
      actor: args.actor || 'system',
      detail: `Official packet not generated: ${validation.reasons.length} validation issue(s)`,
    });
    await payload.update({
      collection: COLLECTION,
      id: args.id,
      data: { status, auditLog: [...(pkg.auditLog || []), entry] },
    });
    safeLog('official.generate_invalid', { id: String(args.id), issues: validation.reasons.length });
    return { status, blocked: true, reasons: validation.reasons };
  }

  const { buildOfficialDismissalPacket } = await import('./official/fill.mjs');
  const pdf = await buildOfficialDismissalPacket(validation.data, { sample: args.sample === true });

  const media = await payload.create({
    collection: 'media',
    data: { alt: 'Official CA dismissal packet (CR-180 + CR-181)' },
    file: {
      data: Buffer.from(pdf),
      mimetype: 'application/pdf',
      name: `ca-dismissal-${pkg.sourceSessionId}.pdf`.replace(/[^a-zA-Z0-9.-]/g, '_'),
      size: pdf.byteLength,
    },
  });

  // The package may currently sit in needs_manual_review from a prior failed attempt
  // (missing data / unreviewed basis). Since review is approved and intake now validates,
  // normalize back to ready_for_review before transitioning to generated — the status
  // machine only allows generated from ready_for_review.
  const auditLog = [...(pkg.auditLog || [])];
  let fromStatus = pkg.status;
  if (fromStatus !== 'ready_for_review' && fromStatus !== 'generated') {
    const norm = transition({
      from: fromStatus,
      to: 'ready_for_review',
      actor: args.actor || 'system',
      detail: 'Re-validated after review approval; ready to generate official packet',
    });
    auditLog.push(norm.entry);
    fromStatus = norm.status;
  }

  const { status, entry } = transition({
    from: fromStatus,
    to: 'generated',
    actor: args.actor || 'system',
    detail: args.sample ? 'Official packet generated (SAMPLE watermark)' : 'Official packet generated',
  });
  auditLog.push(entry);

  await payload.update({
    collection: COLLECTION,
    id: args.id,
    data: {
      status,
      generatedFile: media.id,
      auditLog,
    },
  });
  safeLog('official.generated', { id: String(args.id), sample: args.sample === true });
  return { status };
}
