import { PDFDocument, degrees } from "pdf-lib";
import { ERROR_MESSAGES } from "@/lib/constants";

export interface PageRotation {
  pageIndex: number;
  degrees: 90 | 180 | 270;
}

export async function rotatePages(
  buffer: Uint8Array,
  rotations: PageRotation[]
): Promise<Uint8Array> {
  const doc = await PDFDocument.load(buffer);
  const totalPages = doc.getPageCount();

  for (const { pageIndex, degrees: deg } of rotations) {
    if (pageIndex < 0 || pageIndex >= totalPages) {
      throw new RangeError(ERROR_MESSAGES.INVALID_PAGE_RANGE);
    }
    const page = doc.getPage(pageIndex);
    const currentRotation = page.getRotation().angle;
    page.setRotation(degrees((currentRotation + deg) % 360));
  }

  return doc.save();
}
