import type { VerifyMetadataResult } from "@/types/api";

async function getPdfJs() {
  const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
  return pdfjs;
}

export async function verifyMetadata(
  buffer: Uint8Array,
  fileSizeBytes: number
): Promise<VerifyMetadataResult> {
  const pdfjs = await getPdfJs();

  const loadingTask = pdfjs.getDocument({ data: buffer });
  const pdfDoc = await loadingTask.promise;

  const [metadata, permissions] = await Promise.all([
    pdfDoc.getMetadata().catch(() => null),
    pdfDoc.getPermissions().catch(() => null),
  ]);

  const info = metadata?.info as Record<string, string | boolean> | undefined;
  const xmp = metadata?.metadata;

  const safeStr = (val: unknown): string | undefined =>
    typeof val === "string" && val.trim() !== "" ? val.trim() : undefined;

  const formatDate = (val: unknown): string | undefined => {
    if (typeof val !== "string") return undefined;
    // PDF date format: D:YYYYMMDDHHmmSSOHH'mm'
    const match = val.match(/^D:(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/);
    if (!match) return val;
    const [, year, month, day, hour, min, sec] = match;
    return `${year}-${month}-${day}T${hour}:${min}:${sec}`;
  };

  const isTagged =
    xmp != null && String(xmp.get("pdfaid:part") ?? "").length > 0;

  return {
    title: safeStr(info?.["Title"]),
    author: safeStr(info?.["Author"]),
    subject: safeStr(info?.["Subject"]),
    keywords: safeStr(info?.["Keywords"]),
    creator: safeStr(info?.["Creator"]),
    producer: safeStr(info?.["Producer"]),
    creationDate: formatDate(info?.["CreationDate"]),
    modificationDate: formatDate(info?.["ModDate"]),
    pageCount: pdfDoc.numPages,
    pdfVersion: safeStr(info?.["PDFFormatVersion"]),
    fileSize: fileSizeBytes,
    isEncrypted: permissions !== null,
    isTagged,
  };
}
