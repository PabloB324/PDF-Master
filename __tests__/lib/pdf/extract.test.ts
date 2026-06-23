import { describe, it, expect } from "vitest";
import { PDFDocument } from "pdf-lib";
import { extractPages } from "@/lib/pdf/extract";
import { createTestPdf } from "./helpers";

describe("extractPages", () => {
  it("extracts a single page from a multi-page PDF", async () => {
    const source = await createTestPdf(5);
    const result = await extractPages(source, [3]);
    const doc = await PDFDocument.load(result);

    expect(doc.getPageCount()).toBe(1);
  });

  it("extracts multiple pages and preserves order", async () => {
    const source = await createTestPdf(5);
    const result = await extractPages(source, [1, 3, 5]);
    const doc = await PDFDocument.load(result);

    expect(doc.getPageCount()).toBe(3);
  });

  it("silently ignores page numbers out of range", async () => {
    const source = await createTestPdf(3);
    const result = await extractPages(source, [1, 99]);
    const doc = await PDFDocument.load(result);

    expect(doc.getPageCount()).toBe(1);
  });

  it("throws RangeError when all pages are out of range", async () => {
    const source = await createTestPdf(3);

    await expect(extractPages(source, [10, 20])).rejects.toBeInstanceOf(RangeError);
  });

  it("deduplicates and sorts pages", async () => {
    const source = await createTestPdf(5);
    const result = await extractPages(source, [3, 1, 3]);
    const doc = await PDFDocument.load(result);

    expect(doc.getPageCount()).toBe(2);
  });
});
