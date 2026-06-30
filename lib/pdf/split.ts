import { PDFDocument } from "pdf-lib";
import { zipSync } from "fflate";

export async function splitPdf(buffer: Buffer): Promise<Uint8Array> {
  const doc = await PDFDocument.load(buffer);
  const pageCount = doc.getPageCount();

  if (pageCount === 0) throw new Error("El PDF no tiene páginas.");

  const entries: Record<string, Uint8Array> = {};

  for (let i = 0; i < pageCount; i++) {
    const single = await PDFDocument.create();
    const [page] = await single.copyPages(doc, [i]);
    single.addPage(page);
    const bytes = await single.save();
    const pad = String(i + 1).padStart(String(pageCount).length, "0");
    entries[`pagina-${pad}.pdf`] = bytes;
  }

  return zipSync(entries);
}
