import { NextRequest, NextResponse } from "next/server";
import { insertPdf } from "@/lib/pdf/insert";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const base = formData.get("base");
  const insert = formData.get("insert");
  const afterPageRaw = formData.get("afterPage");

  if (!(base instanceof File) || !(insert instanceof File)) {
    return NextResponse.json({ error: "Se requieren dos archivos PDF." }, { status: 400 });
  }
  if (base.type !== "application/pdf" || insert.type !== "application/pdf") {
    return NextResponse.json({ error: "Ambos archivos deben ser PDFs." }, { status: 400 });
  }
  if (base.size > 10 * 1024 * 1024 || insert.size > 10 * 1024 * 1024) {
    return NextResponse.json({ error: "Un archivo supera el límite de 10 MB." }, { status: 413 });
  }

  const afterPage = afterPageRaw !== null ? parseInt(String(afterPageRaw), 10) : 0;
  if (isNaN(afterPage) || afterPage < 0) {
    return NextResponse.json({ error: "La posición de inserción no es válida." }, { status: 400 });
  }

  try {
    const [bufBase, bufInsert] = await Promise.all([
      base.arrayBuffer().then(Buffer.from),
      insert.arrayBuffer().then(Buffer.from),
    ]);
    const result = await insertPdf(bufBase, bufInsert, afterPage);
    return new NextResponse(Buffer.from(result), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="combinado.pdf"',
      },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Error al insertar el PDF.";
    const isPdfError = msg.toLowerCase().includes("corrupt") || msg.toLowerCase().includes("posición");
    return NextResponse.json({ error: msg }, { status: isPdfError ? 422 : 500 });
  }
}
