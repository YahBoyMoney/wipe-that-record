// Typed wrapper over the runtime core (service-core.mjs). The core is .mjs so it can
// be unit-tested with zero-dependency `node --test` on Node 20 (which cannot import
// .ts directly). All persistence goes through the injected Payload Local API client.

import type { Payload } from 'payload';
import * as coreTyped from './service-core.mjs';
import type { DocumentStatus, TemplateKey } from './types';

const core = coreTyped as any;

interface CreateForSessionArgs {
  sourceSessionId: string;
  templateKey: TemplateKey;
  customerEmail?: string;
  linkedLeadId?: string | number;
  linkedOrderId?: string | number;
}

export function createPackageForSession(
  payload: Payload,
  args: CreateForSessionArgs,
): Promise<{ created: boolean; id: string | number }> {
  return core.createPackageForSession(payload, args);
}

export function createDocumentPackageForOrder(
  payload: Payload,
  args: { orderId: string | number; templateKey: TemplateKey; customerEmail?: string },
): Promise<{ created: boolean; id: string | number }> {
  return core.createDocumentPackageForOrder(payload, args);
}

export function approvePackage(
  payload: Payload,
  args: { id: string | number; actor: string; notes?: string },
): Promise<{ status: DocumentStatus }> {
  return core.approvePackage(payload, args);
}

export function generatePackage(
  payload: Payload,
  args: { id: string | number; actor?: string },
): Promise<{ status: DocumentStatus; blocked?: boolean }> {
  return core.generatePackage(payload, args);
}
