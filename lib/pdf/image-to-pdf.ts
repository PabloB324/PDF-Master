import { PDFDocument } from "pdf-lib";

type ImageInput = { buffer: Buffer; mimeType: "image/jpeg" | "image/png" };

export async function imagesToPdf(images: ImageInput[]): Promise<Uint8Array> {
  if (images.length === 0) throw new Error("No se recibieron imágenes.");

  const doc = await PDFDocument.create();

  for (const { buffer, mimeType } of images) {
    const embedded =
      mimeType === "image/png"
        ? await doc.embedPng(buffer)
        : await doc.embedJpg(buffer);

    const page = doc.addPage([embedded.width, embedded.height]);
    page.drawImage(embedded, {
      x: 0,
      y: 0,
      width: embedded.width,
      height: embedded.height,
    });
  }

  return doc.save();
}
