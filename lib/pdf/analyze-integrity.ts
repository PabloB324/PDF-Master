import type { AnalyzeIntegrityResult, IntegrityCheck } from "@/types/api";

export async function analyzeIntegrity(buffer: Buffer): Promise<AnalyzeIntegrityResult> {
  const checks: IntegrityCheck[] = [];

  // 1. PDF header
  const header = buffer.slice(0, 8).toString("ascii");
  if (header.startsWith("%PDF-")) {
    const version = header.slice(5, 8);
    checks.push({ label: "Encabezado PDF", status: "ok", detail: `Versión ${version}` });
  } else {
    checks.push({ label: "Encabezado PDF", status: "fail", detail: "No se encontró el encabezado %PDF-" });
  }

  // 2. EOF marker
  const tail = buffer.slice(-1024).toString("ascii");
  if (tail.includes("%%EOF")) {
    checks.push({ label: "Marcador de fin de archivo", status: "ok" });
  } else {
    checks.push({ label: "Marcador de fin de archivo", status: "warn", detail: "No se encontró %%EOF al final del archivo" });
  }

  // 3. Load with pdfjs-dist
  let pageCount = 0;
  let isEncrypted = false;
  let hasMetadata = false;
  let loadError: string | null = null;

  try {
    const { getDocument } = await import("pdfjs-dist/legacy/build/pdf.mjs");
    const task = getDocument({
      data: new Uint8Array(buffer),
      useWorkerFetch: false,
      isEvalSupported: false,
      useSystemFonts: true,
    });
    const pdf = await task.promise;
    pageCount = pdf.numPages;

    const meta = await pdf.getMetadata();
    const info = (meta.info ?? {}) as Record<string, unknown>;

    isEncrypted = info["IsEncrypted"] === true;
    hasMetadata = !!(meta.metadata);

    checks.push({ label: "Estructura del documento", status: "ok", detail: `${pageCount} página(s) accesibles` });

    if (pageCount === 0) {
      checks.push({ label: "Páginas", status: "fail", detail: "El documento no contiene páginas" });
    } else {
      checks.push({ label: "Páginas", status: "ok", detail: `${pageCount} página(s)` });
    }

    checks.push({
      label: "Cifrado",
      status: isEncrypted ? "warn" : "ok",
      detail: isEncrypted ? "El documento está cifrado" : "Sin cifrado",
    });

    checks.push({
      label: "Metadatos XMP",
      status: hasMetadata ? "ok" : "warn",
      detail: hasMetadata ? "Metadatos XMP presentes" : "Sin metadatos XMP",
    });

    // Check for JavaScript actions (potential security risk indicator)
    const jsPresent = typeof info["IsAcroFormPresent"] === "boolean" && info["IsAcroFormPresent"];
    checks.push({
      label: "Formularios AcroForm",
      status: jsPresent ? "warn" : "ok",
      detail: jsPresent ? "El documento contiene formularios AcroForm" : "Sin formularios AcroForm",
    });

  } catch (err) {
    loadError = err instanceof Error ? err.message : "Error desconocido";
    checks.push({ label: "Estructura del documento", status: "fail", detail: loadError });
  }

  // 5. File size sanity
  const sizeKb = buffer.length / 1024;
  if (sizeKb < 1) {
    checks.push({ label: "Tamaño del archivo", status: "warn", detail: `${sizeKb.toFixed(1)} KB — archivo muy pequeño` });
  } else {
    checks.push({ label: "Tamaño del archivo", status: "ok", detail: `${sizeKb >= 1024 ? (sizeKb / 1024).toFixed(2) + " MB" : sizeKb.toFixed(1) + " KB"}` });
  }

  // Score: percentage of ok checks
  const okCount = checks.filter((c) => c.status === "ok").length;
  const score = Math.round((okCount / checks.length) * 100);

  return { checks, score, pageCount, fileSize: buffer.length };
}
