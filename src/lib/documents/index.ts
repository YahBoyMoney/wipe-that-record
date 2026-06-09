// Typed entry point for the document-automation modules. The pure logic lives in
// sibling .mjs files (so it can be unit-tested with zero-dependency `node --test`
// on Node 20, which cannot import .ts directly). This shim adds TypeScript types.

import type {
  AuditEntry,
  DocumentStatus,
  PacketInput,
  TemplateDefinition,
  TemplateKey,
} from './types';

// The .mjs modules carry no type declarations; treat them as untyped at this boundary
// and expose typed wrappers below as the public surface.
import * as statusImplTyped from './status.mjs';
import * as registryImplTyped from './registry.mjs';
import * as pdfImplTyped from './pdf.mjs';
import * as redactImplTyped from './redact.mjs';
import { DISCLAIMERS as DISCLAIMERS_IMPL } from './disclaimers.mjs';

const statusImpl = statusImplTyped as any;
const registryImpl = registryImplTyped as any;
const pdfImpl = pdfImplTyped as any;
const redactImpl = redactImplTyped as any;

export const STATUSES = statusImpl.STATUSES as DocumentStatus[];
export const TRANSITIONS = statusImpl.TRANSITIONS as Record<DocumentStatus, DocumentStatus[]>;
export const InvalidTransitionError = statusImpl.InvalidTransitionError as typeof Error;

export const canTransition = (from: DocumentStatus, to: DocumentStatus): boolean =>
  statusImpl.canTransition(from, to);
export const assertTransition = (from: DocumentStatus, to: DocumentStatus): void =>
  statusImpl.assertTransition(from, to);
export const transition = (args: {
  from: DocumentStatus;
  to: DocumentStatus;
  actor?: string;
  detail?: string;
}): { status: DocumentStatus; entry: AuditEntry } => statusImpl.transition(args);
export const appendAudit = (log: AuditEntry[] | undefined, entry: AuditEntry): AuditEntry[] =>
  statusImpl.appendAudit(log, entry);
export const buildAuditEntry = (args: {
  action: string;
  fromStatus?: DocumentStatus | null;
  toStatus?: DocumentStatus | null;
  actor?: string;
  detail?: string;
}): AuditEntry => statusImpl.buildAuditEntry(args);

export const TEMPLATE_KEYS = registryImpl.TEMPLATE_KEYS as TemplateKey[];
export const TEMPLATES = registryImpl.TEMPLATES as Record<TemplateKey, TemplateDefinition>;
export const getTemplate = (key: TemplateKey): TemplateDefinition => registryImpl.getTemplate(key);
export const templateKeyForSession = (args: {
  type?: string;
  upgradeType?: string;
}): TemplateKey => registryImpl.templateKeyForSession(args);
export const templateKeyForProduct = (args: {
  category?: string;
  serviceType?: string;
}): TemplateKey => registryImpl.templateKeyForProduct(args);

export const buildPacketPdf = (input: PacketInput): Uint8Array => pdfImpl.buildPacketPdf(input);

export const redactEmail = (email?: string): string => redactImpl.redactEmail(email);
export const safeLog = (scope: string, fields?: Record<string, unknown>): void =>
  redactImpl.safeLog(scope, fields);

export const DISCLAIMERS = DISCLAIMERS_IMPL as string[];

export type { AuditEntry, DocumentStatus, PacketInput, TemplateDefinition, TemplateKey };
