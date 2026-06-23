import { PDFDocument } from "pdf-lib";
import { ERROR_MESSAGES } from "@/lib/constants";

export async function extractPages(
  buffer: Uint8Array,
  pageNumbers: number[]
): Promise<Uint8Array> {
  const source = await PDFDocument.load(buffer);
  const totalPages = source.getPageCount();

  const validPages = [...new Set(pageNumbers)].filter(
    (n) => n >= 1 && n <= totalPages
  );

  if (validPages.length === 0) {
    throw new RangeError(ERROR_MESSAGES.INVALID_PAGE_RANGE);
  }

  const output = await PDFDocument.create();
  const zeroIndexed = validPages.map((n) => n - 1);
  const copied = await output.copyPages(source, zeroIndexed);

  for (const page of copied) {
    output.addPage(page);
  }

  return output.save();
}
