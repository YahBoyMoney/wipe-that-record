// Fills the official CR-180 / CR-181 AcroForm PDFs from mapped field values and merges
// them into a single packet PDF.
//
// Why pdf-lib: it is pure-JS with zero native dependencies, so it builds and runs on
// Vercel without the risk puppeteer/headless-chrome carry. The stored templates are the
// DECRYPTED Judicial Council PDFs (see ../templates/official/SOURCES.md) — pdf-lib cannot
// read the AcroForm fields out of the original empty-password-encrypted files, so we
// decrypt once at check-in time rather than at runtime. pdf-lib also drops the embedded
// XFA layer on save, which is what we want: the filled static AcroForm then renders in
// every viewer and when flattened/printed.

import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { PDFDocument, rgb, degrees, StandardFonts } from 'pdf-lib';
import { CR180_FIELDS, CR181_FIELDS } from './cr-fields.mjs';
import { OFFICIAL_FORMS } from './forms.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const TEMPLATE_DIR = join(HERE, '..', 'templates', 'official');

async function loadTemplate(formId) {
  const meta = OFFICIAL_FORMS[formId];
  if (!meta) throw new Error(`Unknown official form: ${formId}`);
  const bytes = await readFile(join(TEMPLATE_DIR, meta.file));
  return PDFDocument.load(bytes, { ignoreEncryption: true });
}

// Fill one template's AcroForm from a { logicalKey: value } text map and a list of
// logical checkbox keys, using the field-name lookup for that form. Unknown logical keys
// and fields missing from the PDF are skipped (defensive against revision drift) — they
// simply remain blank rather than throwing.
function fillForm(doc, fieldNames, textValues, checkboxKeys) {
  const form = doc.getForm();
  for (const [logicalKey, value] of Object.entries(textValues || {})) {
    const pdfName = fieldNames[logicalKey];
    if (!pdfName) continue;
    try {
      form.getTextField(pdfName).setText(String(value));
    } catch {
      // Field renamed/removed in this revision — leave blank.
    }
  }
  for (const logicalKey of checkboxKeys || []) {
    const pdfName = fieldNames[logicalKey];
    if (!pdfName) continue;
    try {
      form.getCheckBox(pdfName).check();
    } catch {
      // Leave unchecked if the checkbox cannot be resolved.
    }
  }
  return form;
}

// Stamp a diagonal SAMPLE / NOT FOR FILING watermark across every page. Used for
// test/demo output only — real packets for paid orders are generated without it.
async function watermark(doc, label) {
  const font = await doc.embedFont(StandardFonts.HelveticaBold);
  for (const page of doc.getPages()) {
    const { width, height } = page.getSize();
    page.drawText(label, {
      x: width * 0.12,
      y: height * 0.45,
      size: 44,
      font,
      color: rgb(0.85, 0.1, 0.1),
      rotate: degrees(38),
      opacity: 0.28,
    });
  }
}

async function copyPagesInto(target, source) {
  const pages = await target.copyPages(source, source.getPageIndices());
  for (const p of pages) target.addPage(p);
}

// Build the merged packet (filled CR-180 followed by draft CR-181) as a flattened PDF.
//
// values: output of mapping.buildFieldValues — { cr180Text, cr180Checkboxes, cr181Text,
//   cr181Checkboxes }.
// options.sample: when true, stamps SAMPLE / NOT FOR FILING on every page and disables
//   flattening-related assumptions (still flattens so the value layer is baked in).
export async function buildOfficialDismissalPacket(values, options = {}) {
  const { sample = false } = options;

  const cr180 = await loadTemplate('CR-180');
  fillForm(cr180, CR180_FIELDS, values.cr180Text, values.cr180Checkboxes);
  cr180.getForm().flatten();

  const cr181 = await loadTemplate('CR-181');
  fillForm(cr181, CR181_FIELDS, values.cr181Text, values.cr181Checkboxes);
  cr181.getForm().flatten();

  // Merge into one packet so a single artifact carries both forms.
  const packet = await PDFDocument.create();
  await copyPagesInto(packet, cr180);
  await copyPagesInto(packet, cr181);

  if (sample) await watermark(packet, 'SAMPLE - NOT FOR FILING');

  // Plaintext Info-dictionary metadata documenting exactly what the packet contains. The
  // static form glyphs use custom font encodings (not searchable as plaintext), so this
  // metadata is the reliable, machine-checkable record of which forms are included and
  // whether the output is a sample. Carries no PII.
  packet.setTitle('California Dismissal Packet (CR-180 + CR-181)');
  packet.setSubject(sample ? 'SAMPLE - NOT FOR FILING' : 'Official CA dismissal packet');
  packet.setKeywords(['CR-180', 'CR-181', sample ? 'SAMPLE' : 'OFFICIAL']);
  packet.setProducer('WipeThatRecord document automation');

  // useObjectStreams:false keeps the Info dictionary as uncompressed, scannable bytes.
  const bytes = await packet.save({ useObjectStreams: false });
  return new Uint8Array(bytes);
}
