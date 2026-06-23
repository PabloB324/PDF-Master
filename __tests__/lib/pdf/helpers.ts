import { PDFDocument } from "pdf-lib";

export async function createTestPdf(pageCount = 1): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  for (let i = 0; i < pageCount; i++) {
    doc.addPage([595, 842]);
  }
  return doc.save();
}

export async function createProtectedPdf(password: string): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  doc.addPage([595, 842]);
  return doc.save({ userPassword: password, ownerPassword: password });
}
