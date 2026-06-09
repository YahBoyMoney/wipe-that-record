// Runtime core for document-package orchestration, kept in .mjs so it can be unit
// tested with zero-dependency `node --test` on Node 20. service.ts is a thin typed
// wrapper around these functions.

import { getTemplate, initialStatusForTemplate } from './registry.mjs';
import { buildAuditEntry, transition } from './status.mjs';
import { buildPacketPdf } from './pdf.mjs';
import { safeLog } from './redact.mjs';

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
