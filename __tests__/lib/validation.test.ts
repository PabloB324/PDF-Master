import { describe, it, expect } from "vitest";
import { validatePdfFile, validatePdfFiles } from "@/lib/validation";
import { HTTP_STATUS, MAX_FILE_SIZE_BYTES } from "@/lib/constants";

function makeFile(name: string, type: string, size: number): File {
  const content = new Uint8Array(size);
  return new File([content], name, { type });
}

describe("validatePdfFile", () => {
  it("returns null for a valid PDF under the size limit", () => {
    const file = makeFile("test.pdf", "application/pdf", 1024);
    expect(validatePdfFile(file)).toBeNull();
  });

  it("returns 400 when file is null", () => {
    const result = validatePdfFile(null);
    expect(result?.status).toBe(HTTP_STATUS.BAD_REQUEST);
  });

  it("returns 400 when MIME type is not application/pdf", () => {
    const file = makeFile("test.txt", "text/plain", 1024);
    const result = validatePdfFile(file);
    expect(result?.status).toBe(HTTP_STATUS.BAD_REQUEST);
  });

  it("returns 413 when file exceeds size limit", () => {
    const file = makeFile("big.pdf", "application/pdf", MAX_FILE_SIZE_BYTES + 1);
    const result = validatePdfFile(file);
    expect(result?.status).toBe(HTTP_STATUS.REQUEST_TOO_LARGE);
  });
});

describe("validatePdfFiles", () => {
  it("returns null for a valid list of PDFs", () => {
    const files = [
      makeFile("a.pdf", "application/pdf", 1024),
      makeFile("b.pdf", "application/pdf", 2048),
    ];
    expect(validatePdfFiles(files)).toBeNull();
  });

  it("returns 400 for an empty array", () => {
    const result = validatePdfFiles([]);
    expect(result?.status).toBe(HTTP_STATUS.BAD_REQUEST);
  });

  it("returns 400 when any file has wrong MIME type", () => {
    const files = [
      makeFile("a.pdf", "application/pdf", 1024),
      makeFile("b.jpg", "image/jpeg", 1024),
    ];
    const result = validatePdfFiles(files);
    expect(result?.status).toBe(HTTP_STATUS.BAD_REQUEST);
  });

  it("returns 400 when file count exceeds maximum", () => {
    const files = Array.from({ length: 21 }, (_, i) =>
      makeFile(`f${i}.pdf`, "application/pdf", 100)
    );
    const result = validatePdfFiles(files);
    expect(result?.status).toBe(HTTP_STATUS.BAD_REQUEST);
  });
});
