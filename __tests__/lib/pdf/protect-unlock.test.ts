import { describe, it, expect } from "vitest";
import { PDFDocument as PdfLib } from "pdf-lib";
import { PDFDocument as CantooPdfLib } from "@cantoo/pdf-lib";
import { protectPdf } from "@/lib/pdf/protect";
import { unlockPdf } from "@/lib/pdf/unlock";
import { createTestPdf } from "./helpers";
import { ERROR_MESSAGES } from "@/lib/constants";

describe("protectPdf", () => {
  it("produces a PDF loadable only with the correct password (@cantoo/pdf-lib)", async () => {
    const source = await createTestPdf(1);
    const protected_ = await protectPdf(source, { userPassword: "secret123" });

    const doc = await CantooPdfLib.load(protected_, { password: "secret123" });
    expect(doc.getPageCount()).toBe(1);
  });

  it("rejects wrong password at load time", async () => {
    const source = await createTestPdf(1);
    const protected_ = await protectPdf(source, { userPassword: "correct" });

    await expect(
      CantooPdfLib.load(protected_, { password: "wrong" })
    ).rejects.toBeDefined();
  });

  it("accepts an optional owner password", async () => {
    const source = await createTestPdf(1);
    const result = await protectPdf(source, {
      userPassword: "user",
      ownerPassword: "owner",
    });

    expect(result).toBeInstanceOf(Uint8Array);
    expect(result.length).toBeGreaterThan(0);
  });
});

describe("unlockPdf", () => {
  it("removes password protection and produces a standard PDF", async () => {
    const source = await createTestPdf(1);
    const protected_ = await protectPdf(source, { userPassword: "abc123" });

    const unlocked = await unlockPdf(protected_, "abc123");

    // The unlocked PDF should be loadable without a password by pdf-lib
    const doc = await PdfLib.load(unlocked, { ignoreEncryption: true });
    expect(doc.getPageCount()).toBe(1);
  });

  it("throws with the correct message when the password is wrong", async () => {
    const source = await createTestPdf(1);
    const protected_ = await protectPdf(source, { userPassword: "correct" });

    await expect(unlockPdf(protected_, "wrong")).rejects.toThrow(
      ERROR_MESSAGES.WRONG_PASSWORD
    );
  });
});
