import { PDFDocument } from "pdf-lib";

export async function insertPdf(
  baseBuffer: Buffer,
  insertBuffer: Buffer,
  afterPage: number
): Promise<Uint8Array> {
  const base = await PDFDocument.load(baseBuffer);
  const insert = await PDFDocument.load(insertBuffer);

  const baseCount = base.getPageCount();
  const insertCount = insert.getPageCount();

  if (afterPage < 0 || afterPage > baseCount) {
    throw new Error(`La posición debe estar entre 0 y ${baseCount}.`);
  }

  const result = await PDFDocument.create();

  // Pages before insertion point
  if (afterPage > 0) {
    const before = await result.copyPages(base, range(0, afterPage));
    before.forEach((p) => result.addPage(p));
  }

  // Inserted pages
  const inserted = await result.copyPages(insert, range(0, insertCount));
  inserted.forEach((p) => result.addPage(p));

  // Pages after insertion point
  if (afterPage < baseCount) {
    const after = await result.copyPages(base, range(afterPage, baseCount));
    after.forEach((p) => result.addPage(p));
  }

  return result.save();
}

function range(start: number, end: number): number[] {
  return Array.from({ length: end - start }, (_, i) => i + start);
}
