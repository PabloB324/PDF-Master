import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import type { PageNumberPosition } from "@/types/api";

interface NumberPagesOptions {
  startAt?: number;
  position?: PageNumberPosition;
  fontSize?: number;
}

const MARGIN = 24;

function computePosition(
  position: PageNumberPosition,
  pageWidth: number,
  pageHeight: number,
  textWidth: number,
  fontSize: number
): { x: number; y: number } {
  const isBottom = position.startsWith("bottom");
  const y = isBottom ? MARGIN : pageHeight - MARGIN - fontSize;

  if (position.endsWith("center")) {
    return { x: (pageWidth - textWidth) / 2, y };
  }
  if (position.endsWith("left")) {
    return { x: MARGIN, y };
  }
  return { x: pageWidth - textWidth - MARGIN, y };
}

export async function numberPages(
  buffer: Uint8Array,
  options: NumberPagesOptions = {}
): Promise<Uint8Array> {
  const { startAt = 1, position = "bottom-center", fontSize = 12 } = options;

  const doc = await PDFDocument.load(buffer);
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const pages = doc.getPages();

  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];
    const { width, height } = page.getSize();
    const label = String(startAt + i);
    const textWidth = font.widthOfTextAtSize(label, fontSize);
    const { x, y } = computePosition(position, width, height, textWidth, fontSize);

    page.drawText(label, {
      x,
      y,
      size: fontSize,
      font,
      color: rgb(0, 0, 0),
    });
  }

  return doc.save();
}
