import { NextRequest, NextResponse } from "next/server";
import { compareMetadata } from "@/lib/pdf/compare-metadata";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const fileA = formData.get("fileA");
  const fileB = formData.get("fileB");

  if (!(fileA instanceof File) || !(fileB instanceof File)) {
    return NextResponse.json({ error: "Se requieren dos archivos PDF." }, { status: 400 });
  }
  if (fileA.type !== "application/pdf" || fileB.type !== "application/pdf") {
    return NextResponse.json({ error: "Ambos archivos deben ser PDFs." }, { status: 400 });
  }
  if (fileA.size > 10 * 1024 * 1024 || fileB.size > 10 * 1024 * 1024) {
    return NextResponse.json({ error: "Un archivo supera el límite de 10 MB." }, { status: 413 });
  }

  try {
    const [bufA, bufB] = await Promise.all([
      fileA.arrayBuffer().then(Buffer.from),
      fileB.arrayBuffer().then(Buffer.from),
    ]);
    const result = await compareMetadata(bufA, bufB);
    return NextResponse.json(result);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Error al comparar metadatos.";
    const isPdfError = msg.toLowerCase().includes("corrupt") || msg.toLowerCase().includes("invalid");
    return NextResponse.json({ error: msg }, { status: isPdfError ? 422 : 500 });
  }
}
