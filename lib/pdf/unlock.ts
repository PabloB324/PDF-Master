import { PDFDocument } from "@cantoo/pdf-lib";
import { ERROR_MESSAGES } from "@/lib/constants";

export async function unlockPdf(
  buffer: Uint8Array,
  password: string
): Promise<Uint8Array> {
  let doc: PDFDocument;

  try {
    doc = await PDFDocument.load(buffer, { password });
  } catch {
    throw new Error(ERROR_MESSAGES.WRONG_PASSWORD);
  }

  // Re-save without calling encrypt() to strip encryption
  return doc.save();
}
