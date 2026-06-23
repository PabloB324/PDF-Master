import type { VerifySignatureResult, SignatureInfo } from "@/types/api";

// pdfjs-dist is loaded dynamically to avoid bundling issues with Next.js server components
async function getPdfJs() {
  const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
  return pdfjs;
}

export async function verifySignature(
  buffer: Uint8Array
): Promise<VerifySignatureResult> {
  const pdfjs = await getPdfJs();

  const loadingTask = pdfjs.getDocument({ data: buffer });
  const pdfDoc = await loadingTask.promise;

  // pdfjs-dist exposes signature fields via the AcroForm structure
  const numPages = pdfDoc.numPages;
  const signatures: SignatureInfo[] = [];
  let hasDSS = false;

  // Check document-level AcroForm for signature fields
  const fieldObjects = await pdfDoc.getFieldObjects().catch(() => null);

  if (fieldObjects) {
    for (const [fieldName, fields] of Object.entries(fieldObjects)) {
      for (const field of fields as { type: string; subtype?: string }[]) {
        if (field.type === "signature") {
          hasDSS = true;
          signatures.push({
            fieldName,
            subFilter: (field as Record<string, string>).subFilter,
          });
        }
      }
    }
  }

  // Also scan annotations page by page for Widget annotations of subtype Sig
  for (let pageNum = 1; pageNum <= numPages; pageNum++) {
    const page = await pdfDoc.getPage(pageNum);
    const annotations = await page.getAnnotations();

    for (const ann of annotations as Record<string, unknown>[]) {
      if (ann["subtype"] === "Widget" && ann["fieldType"] === "Sig") {
        hasDSS = true;
        const fieldName = String(ann["fieldName"] ?? `sig_p${pageNum}`);
        if (!signatures.some((s) => s.fieldName === fieldName)) {
          signatures.push({
            fieldName,
            reason: ann["reason"] ? String(ann["reason"]) : undefined,
            location: ann["location"] ? String(ann["location"]) : undefined,
            contactInfo: ann["contactInfo"]
              ? String(ann["contactInfo"])
              : undefined,
          });
        }
      }
    }
  }

  const warning =
    signatures.length > 0
      ? "Se detectaron campos de firma digital. La validación criptográfica requiere los certificados del firmante."
      : undefined;

  return { hasDSS, signatures, warning };
}
