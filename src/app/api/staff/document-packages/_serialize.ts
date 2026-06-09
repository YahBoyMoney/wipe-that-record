// Serializers that shape document-package records for the staff dashboard. The list view
// deliberately omits intake PII (petitioner name, case number, charges); only the detail
// view returns the stored intake so staff can edit it. Generated PDFs are never exposed via
// a URL here — only non-PII artifact metadata is returned.

interface AnyDoc {
  id: string | number;
  sourceSessionId?: string;
  templateKey?: string;
  status?: string;
  customerEmail?: string;
  createdAt?: string;
  updatedAt?: string;
  review?: { approved?: boolean; reviewedBy?: string; reviewedAt?: string; reviewNotes?: string };
  validation?: { ok?: boolean; reasons?: Array<{ reason?: string }>; checkedAt?: string };
  generatedArtifact?: { fileName?: string; byteSize?: number; sample?: boolean; generatedAt?: string };
  generatedFile?: unknown;
  officialIntake?: Record<string, unknown>;
  auditLog?: Array<Record<string, unknown>>;
}

function reasons(doc: AnyDoc): string[] {
  return Array.isArray(doc.validation?.reasons)
    ? doc.validation!.reasons!.map((r) => r?.reason).filter((r): r is string => !!r)
    : [];
}

// List item: no intake PII. customerEmail is an operational lookup already stored on the
// collection and shown only to authorized staff.
export function serializeListItem(doc: AnyDoc) {
  return {
    id: doc.id,
    sourceSessionId: doc.sourceSessionId,
    templateKey: doc.templateKey,
    status: doc.status,
    customerEmail: doc.customerEmail ?? null,
    isOfficial: doc.templateKey === 'official_ca_dismissal_packet',
    reviewApproved: doc.review?.approved === true,
    validationOk: doc.validation?.ok === true,
    validationIssueCount: reasons(doc).length,
    hasArtifact: !!doc.generatedFile,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

// Detail: includes the stored official intake (PII) so staff can review/edit, plus
// validation reasons, review state, artifact metadata, and the non-PII audit log.
export function serializeDetail(doc: AnyDoc) {
  return {
    id: doc.id,
    sourceSessionId: doc.sourceSessionId,
    templateKey: doc.templateKey,
    status: doc.status,
    customerEmail: doc.customerEmail ?? null,
    isOfficial: doc.templateKey === 'official_ca_dismissal_packet',
    review: {
      approved: doc.review?.approved === true,
      reviewedBy: doc.review?.reviewedBy ?? null,
      reviewedAt: doc.review?.reviewedAt ?? null,
      reviewNotes: doc.review?.reviewNotes ?? null,
    },
    validation: {
      ok: doc.validation?.ok === true,
      reasons: reasons(doc),
      checkedAt: doc.validation?.checkedAt ?? null,
    },
    officialIntake: doc.officialIntake ?? null,
    generatedArtifact: doc.generatedFile
      ? {
          fileName: doc.generatedArtifact?.fileName ?? null,
          byteSize: doc.generatedArtifact?.byteSize ?? null,
          sample: doc.generatedArtifact?.sample === true,
          generatedAt: doc.generatedArtifact?.generatedAt ?? null,
        }
      : null,
    auditLog: Array.isArray(doc.auditLog) ? doc.auditLog : [],
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}
