import { PDFDocument } from "@cantoo/pdf-lib";

interface ProtectOptions {
  userPassword: string;
  ownerPassword?: string;
}

export async function protectPdf(
  buffer: Uint8Array,
  options: ProtectOptions
): Promise<Uint8Array> {
  const { userPassword, ownerPassword } = options;

  const doc = await PDFDocument.load(buffer);

  doc.encrypt({
    userPassword,
    ownerPassword: ownerPassword ?? userPassword,
  });

  return doc.save();
}
