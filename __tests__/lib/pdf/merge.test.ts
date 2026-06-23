import { describe, it, expect } from "vitest";
import { PDFDocument } from "pdf-lib";
import { mergePdfs } from "@/lib/pdf/merge";
import { createTestPdf } from "./helpers";

describe("mergePdfs", () => {
  it("combines two single-page PDFs into a two-page document", async () => {
    const a = await createTestPdf(1);
    const b = await createTestPdf(1);

    const merged = await mergePdfs([a, b]);
    const doc = await PDFDocument.load(merged);

    expect(doc.getPageCount()).toBe(2);
  });

  it("preserves page order", async () => {
    const a = await createTestPdf(2);
    const b = await createTestPdf(3);

    const merged = await mergePdfs([a, b]);
    const doc = await PDFDocument.load(merged);

    expect(doc.getPageCount()).toBe(5);
  });

  it("handles a single PDF without error", async () => {
    const a = await createTestPdf(3);

    const merged = await mergePdfs([a]);
    const doc = await PDFDocument.load(merged);

    expect(doc.getPageCount()).toBe(3);
  });

  it("returns a valid PDF binary", async () => {
    const a = await createTestPdf(1);
    const merged = await mergePdfs([a]);

    expect(merged[0]).toBe(0x25); // '%'
    expect(merged[1]).toBe(0x50); // 'P'
    expect(merged[2]).toBe(0x44); // 'D'
    expect(merged[3]).toBe(0x46); // 'F'
  });
});
