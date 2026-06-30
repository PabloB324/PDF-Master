import { NextRequest, NextResponse } from "next/server";
import { splitPdf } from "@/lib/pdf/split";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Se requiere un archivo PDF." }, { status: 400 });
  }
  if (file.type !== "application/pdf") {
    return NextResponse.json({ error: "El archivo debe ser un PDF." }, { status: 400 });
  }
  if (file.size > 10 * 1024 * 1024) {
    return NextResponse.json({ error: "El archivo supera el límite de 10 MB." }, { status: 413 });
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const zip = await splitPdf(buffer);
    return new NextResponse(Buffer.from(zip), {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": 'attachment; filename="paginas.zip"',
      },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Error al dividir el PDF.";
    const isPdfError = msg.toLowerCase().includes("corrupt") || msg.toLowerCase().includes("invalid");
    return NextResponse.json({ error: msg }, { status: isPdfError ? 422 : 500 });
  }
}
