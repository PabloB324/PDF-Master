import { describe, it, expect } from "vitest";
import { PDFDocument } from "pdf-lib";
import { rotatePages } from "@/lib/pdf/rotate";
import { createTestPdf } from "./helpers";

describe("rotatePages", () => {
  it("rotates a page by 90 degrees", async () => {
    const source = await createTestPdf(1);
    const result = await rotatePages(source, [{ pageIndex: 0, degrees: 90 }]);
    const doc = await PDFDocument.load(result);

    expect(doc.getPage(0).getRotation().angle).toBe(90);
  });

  it("rotates a page by 180 degrees", async () => {
    const source = await createTestPdf(1);
    const result = await rotatePages(source, [{ pageIndex: 0, degrees: 180 }]);
    const doc = await PDFDocument.load(result);

    expect(doc.getPage(0).getRotation().angle).toBe(180);
  });

  it("rotates a page by 270 degrees", async () => {
    const source = await createTestPdf(1);
    const result = await rotatePages(source, [{ pageIndex: 0, degrees: 270 }]);
    const doc = await PDFDocument.load(result);

    expect(doc.getPage(0).getRotation().angle).toBe(270);
  });

  it("accumulates existing rotation", async () => {
    const source = await createTestPdf(1);
    const firstPass = await rotatePages(source, [{ pageIndex: 0, degrees: 90 }]);
    const result = await rotatePages(firstPass, [{ pageIndex: 0, degrees: 90 }]);
    const doc = await PDFDocument.load(result);

    expect(doc.getPage(0).getRotation().angle).toBe(180);
  });

  it("throws RangeError for out-of-range page index", async () => {
    const source = await createTestPdf(2);

    await expect(
      rotatePages(source, [{ pageIndex: 99, degrees: 90 }])
    ).rejects.toBeInstanceOf(RangeError);
  });

  it("rotates multiple pages independently", async () => {
    const source = await createTestPdf(3);
    const result = await rotatePages(source, [
      { pageIndex: 0, degrees: 90 },
      { pageIndex: 2, degrees: 270 },
    ]);
    const doc = await PDFDocument.load(result);

    expect(doc.getPage(0).getRotation().angle).toBe(90);
    expect(doc.getPage(1).getRotation().angle).toBe(0);
    expect(doc.getPage(2).getRotation().angle).toBe(270);
  });
});
