// Dependency-free PDF generator.
//
// We hand-emit a minimal but valid PDF (PDF 1.4, Helvetica base-14 font, no embedded
// fonts) so the build has ZERO native/runtime dependencies. Heavy generators
// (puppeteer/pdfkit) risk breaking the Vercel build, so they are intentionally avoided.
// This produces a branded cover sheet + checklist packet from NON-SENSITIVE data and
// is structured to be swapped for official-form rendering in a later phase.

import { getTemplate } from './registry.mjs';
import { DISCLAIMERS } from './disclaimers.mjs';

const PAGE_WIDTH = 612; // US Letter @ 72dpi
const PAGE_HEIGHT = 792;
const MARGIN = 56;
const LINE_HEIGHT = 16;
const MAX_CHARS_PER_LINE = 92; // conservative for Helvetica 11pt within margins
const LINES_PER_PAGE = Math.floor((PAGE_HEIGHT - MARGIN * 2) / LINE_HEIGHT) - 1;

// Escape text for a PDF literal string and drop anything outside printable ASCII
// (we only use the standard Helvetica WinAnsi range).
export function escapePdfText(text) {
  return String(text)
    .replace(/[^\x20-\x7E]/g, ' ')
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)');
}

// Greedy word-wrap to a max character width.
export function wrapLines(text, maxChars = MAX_CHARS_PER_LINE) {
  const words = String(text).split(/\s+/).filter(Boolean);
  const lines = [];
  let current = '';
  for (const word of words) {
    if (!current.length) {
      current = word;
    } else if (current.length + 1 + word.length <= maxChars) {
      current += ' ' + word;
    } else {
      lines.push(current);
      current = word;
    }
  }
  if (current.length) lines.push(current);
  return lines.length ? lines : [''];
}

// Build the flat list of styled lines for the whole document.
function buildStyledLines(template, { recipientLabel, referenceCode, generatedAt }) {
  const lines = [];
  const push = (text, size = 11) => lines.push({ text, size });

  push(template.title, 18);
  push('WipeThatRecord — California Record Relief', 11);
  push('', 11);
  if (recipientLabel) push(`Prepared for: ${recipientLabel}`, 11);
  if (referenceCode) push(`Reference: ${referenceCode}`, 11);
  push(`Generated: ${generatedAt || new Date().toISOString().slice(0, 10)}`, 11);
  push('', 11);

  for (const section of template.sections) {
    push(section.heading, 13);
    for (const paragraph of section.body) {
      for (const wrapped of wrapLines(paragraph)) push(wrapped, 11);
    }
    push('', 11);
  }

  push('Checklist', 13);
  for (const item of template.checklist) {
    const wrapped = wrapLines(`[ ] ${item}`);
    wrapped.forEach((w) => push(w, 11));
  }
  push('', 11);

  push('Important disclaimers', 13);
  for (const disclaimer of DISCLAIMERS) {
    for (const wrapped of wrapLines(disclaimer)) push(wrapped, 10);
  }

  return lines;
}

function paginate(lines) {
  const pages = [];
  for (let i = 0; i < lines.length; i += LINES_PER_PAGE) {
    pages.push(lines.slice(i, i + LINES_PER_PAGE));
  }
  return pages.length ? pages : [[{ text: '', size: 11 }]];
}

function buildContentStream(pageLines) {
  let stream = 'BT\n';
  stream += `1 0 0 1 ${MARGIN} ${PAGE_HEIGHT - MARGIN} Tm\n`;
  stream += `${LINE_HEIGHT} TL\n`;
  let currentSize = 0;
  for (const line of pageLines) {
    if (line.size !== currentSize) {
      stream += `/F1 ${line.size} Tf\n`;
      currentSize = line.size;
    }
    stream += `(${escapePdfText(line.text)}) Tj\n`;
    stream += 'T*\n';
  }
  stream += 'ET';
  return stream;
}

// Assemble the PDF objects with a correct cross-reference table.
export function buildPacketPdf(input = {}) {
  const { templateKey, recipientLabel, referenceCode, generatedAt } = input;
  const template = getTemplate(templateKey);

  const styledLines = buildStyledLines(template, { recipientLabel, referenceCode, generatedAt });
  const pages = paginate(styledLines);

  // Object layout:
  // 1: Catalog, 2: Pages, 3: Font.
  // Then for each page: a Page object and a Contents stream object.
  const fontObjNum = 3;
  const pagesObjNum = 2;
  const firstPageObj = 4;

  const pageObjNums = [];
  const contentObjNums = [];
  for (let i = 0; i < pages.length; i++) {
    pageObjNums.push(firstPageObj + i * 2);
    contentObjNums.push(firstPageObj + i * 2 + 1);
  }

  const objects = [];
  objects[1] = `<< /Type /Catalog /Pages ${pagesObjNum} 0 R >>`;
  objects[pagesObjNum] =
    `<< /Type /Pages /Kids [${pageObjNums.map((n) => `${n} 0 R`).join(' ')}] /Count ${pages.length} >>`;
  objects[fontObjNum] =
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>';

  pages.forEach((pageLines, idx) => {
    const pageObj = pageObjNums[idx];
    const contentObj = contentObjNums[idx];
    objects[pageObj] =
      `<< /Type /Page /Parent ${pagesObjNum} 0 R ` +
      `/MediaBox [0 0 ${PAGE_WIDTH} ${PAGE_HEIGHT}] ` +
      `/Resources << /Font << /F1 ${fontObjNum} 0 R >> >> ` +
      `/Contents ${contentObj} 0 R >>`;

    const content = buildContentStream(pageLines);
    objects[contentObj] =
      `<< /Length ${Buffer.byteLength(content, 'latin1')} >>\nstream\n${content}\nendstream`;
  });

  // Serialize with byte-offset tracking for the xref table.
  const totalObjects = objects.length - 1; // index 0 unused
  let pdf = '%PDF-1.4\n';
  const offsets = [];
  for (let n = 1; n <= totalObjects; n++) {
    offsets[n] = Buffer.byteLength(pdf, 'latin1');
    pdf += `${n} 0 obj\n${objects[n]}\nendobj\n`;
  }

  const xrefOffset = Buffer.byteLength(pdf, 'latin1');
  pdf += `xref\n0 ${totalObjects + 1}\n`;
  pdf += '0000000000 65535 f \n';
  for (let n = 1; n <= totalObjects; n++) {
    pdf += `${String(offsets[n]).padStart(10, '0')} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${totalObjects + 1} /Root 1 0 R >>\n`;
  pdf += `startxref\n${xrefOffset}\n%%EOF`;

  return new Uint8Array(Buffer.from(pdf, 'latin1'));
}
