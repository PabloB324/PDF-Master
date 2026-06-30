import { NextRequest, NextResponse } from "next/server";
import { imagesToPdf } from "@/lib/pdf/image-to-pdf";

export const runtime = "nodejs";
export const maxDuration = 60;

const ALLOWED_TYPES = ["image/jpeg", "image/png"] as const;
type AllowedType = (typeof ALLOWED_TYPES)[number];

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const files = formData.getAll("files");

  if (files.length === 0) {
    return NextResponse.json({ error: "Se requiere al menos una imagen." }, { status: 400 });
  }

  const images: { buffer: Buffer; mimeType: AllowedType }[] = [];

  for (const file of files) {
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Todos los archivos deben ser imágenes." }, { status: 400 });
    }
    if (!ALLOWED_TYPES.includes(file.type as AllowedType)) {
      return NextResponse.json({ error: `Tipo no soportado: ${file.type}. Solo JPEG y PNG.` }, { status: 400 });
    }
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: `La imagen "${file.name}" supera el límite de 5 MB.` }, { status: 413 });
    }
    images.push({ buffer: Buffer.from(await file.arrayBuffer()), mimeType: file.type as AllowedType });
  }

  try {
    const pdfBytes = await imagesToPdf(images);
    return new NextResponse(Buffer.from(pdfBytes), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="imagenes.pdf"',
      },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Error al convertir imágenes.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
