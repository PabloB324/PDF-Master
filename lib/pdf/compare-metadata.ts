import type { CompareMetadataResult } from "@/types/api";

interface PdfMeta {
  title?: string;
  author?: string;
  subject?: string;
  keywords?: string;
  creator?: string;
  producer?: string;
  creationDate?: string;
  modificationDate?: string;
  pageCount: number;
  pdfVersion?: string;
  fileSize: number;
  isEncrypted: boolean;
}

async function extractMeta(buffer: Buffer): Promise<PdfMeta> {
  const { getDocument } = await import("pdfjs-dist/legacy/build/pdf.mjs");
  const task = getDocument({ data: new Uint8Array(buffer), useWorkerFetch: false, isEvalSupported: false, useSystemFonts: true });
  const pdf = await task.promise;
  const info = await pdf.getMetadata();
  const pageCount = pdf.numPages;

  const raw = (info.info ?? {}) as Record<string, unknown>;
  const fmt = (v: unknown) => (typeof v === "string" && v.trim() ? v.trim() : undefined);

  function fmtDate(v: unknown): string | undefined {
    if (typeof v !== "string") return undefined;
    const m = v.match(/D:(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/);
    if (!m) return v;
    return `${m[1]}-${m[2]}-${m[3]} ${m[4]}:${m[5]}:${m[6]}`;
  }

  return {
    title: fmt(raw["Title"]),
    author: fmt(raw["Author"]),
    subject: fmt(raw["Subject"]),
    keywords: fmt(raw["Keywords"]),
    creator: fmt(raw["Creator"]),
    producer: fmt(raw["Producer"]),
    creationDate: fmtDate(raw["CreationDate"]),
    modificationDate: fmtDate(raw["ModDate"]),
    pageCount,
    pdfVersion: typeof raw["PDFFormatVersion"] === "string" ? raw["PDFFormatVersion"] : undefined,
    fileSize: buffer.length,
    isEncrypted: !!(info.info as Record<string, unknown>)["IsAcroFormPresent"] === false && false,
  };
}

export async function compareMetadata(bufferA: Buffer, bufferB: Buffer): Promise<CompareMetadataResult> {
  const [a, b] = await Promise.all([extractMeta(bufferA), extractMeta(bufferB)]);

  const FIELDS: { label: string; key: keyof PdfMeta }[] = [
    { label: "Páginas", key: "pageCount" },
    { label: "Tamaño (bytes)", key: "fileSize" },
    { label: "Versión PDF", key: "pdfVersion" },
    { label: "Cifrado", key: "isEncrypted" },
    { label: "Título", key: "title" },
    { label: "Autor", key: "author" },
    { label: "Asunto", key: "subject" },
    { label: "Palabras clave", key: "keywords" },
    { label: "Creador", key: "creator" },
    { label: "Productor", key: "producer" },
    { label: "Fecha de creación", key: "creationDate" },
    { label: "Última modificación", key: "modificationDate" },
  ];

  const fields = FIELDS.map(({ label, key }) => {
    const valA = a[key] !== undefined && a[key] !== null ? String(a[key]) : null;
    const valB = b[key] !== undefined && b[key] !== null ? String(b[key]) : null;
    return { label, a: valA, b: valB, match: valA === valB };
  });

  const matchingFields = fields.filter((f) => f.match).length;

  return { fields, totalFields: fields.length, matchingFields };
}
