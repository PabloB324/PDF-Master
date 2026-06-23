import { describe, it, expect } from "vitest";
import { PDFDocument } from "pdf-lib";
import { numberPages } from "@/lib/pdf/number-pages";
import { createTestPdf } from "./helpers";

describe("numberPages", () => {
  it("returns a valid PDF without throwing", async () => {
    const source = await createTestPdf(3);
    const result = await numberPages(source);

    expect(result).toBeInstanceOf(Uint8Array);
    expect(result.length).toBeGreaterThan(0);
  });

  it("preserves page count", async () => {
    const source = await createTestPdf(4);
    const result = await numberPages(source, { startAt: 1 });
    const doc = await PDFDocument.load(result);

    expect(doc.getPageCount()).toBe(4);
  });

  it("accepts all valid position values without throwing", async () => {
    const source = await createTestPdf(1);
    const positions = [
      "bottom-center",
      "bottom-left",
      "bottom-right",
      "top-center",
      "top-left",
      "top-right",
    ] as const;

    for (const position of positions) {
      await expect(numberPages(source, { position })).resolves.toBeInstanceOf(Uint8Array);
    }
  });

  it("accepts custom startAt value", async () => {
    const source = await createTestPdf(2);
    const result = await numberPages(source, { startAt: 5 });

    expect(result).toBeInstanceOf(Uint8Array);
  });
});
