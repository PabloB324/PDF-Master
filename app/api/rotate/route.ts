import { NextRequest } from "next/server";
import { rotatePages } from "@/lib/pdf/rotate";
import type { PageRotation } from "@/lib/pdf/rotate";
import { validatePdfFile, buildErrorResponse } from "@/lib/validation";
import { pdfResponse } from "@/lib/pdf-response";
import { HTTP_STATUS, ERROR_MESSAGES } from "@/lib/constants";

export async function POST(request: NextRequest): Promise<Response> {
  let file: File;
  let rotations: PageRotation[];

  try {
    const form = await request.formData();
    file = form.get("file") as File;
    const rotationsRaw = form.get("rotations") as string;
    rotations = JSON.parse(rotationsRaw) as PageRotation[];
    if (!Array.isArray(rotations) || rotations.length === 0) throw new Error();
  } catch {
    return buildErrorResponse(
      HTTP_STATUS.BAD_REQUEST,
      "Debes proporcionar al menos una rotación."
    );
  }

  const validationError = validatePdfFile(file);
  if (validationError) {
    return Response.json(validationError.body, { status: validationError.status });
  }

  try {
    const buffer = new Uint8Array(await file.arrayBuffer());
    const result = await rotatePages(buffer, rotations);

    console.info({ op: "rotate", rotations: rotations.length, outputBytes: result.byteLength });

    return pdfResponse(result, "rotated.pdf");
  } catch (err) {
    const message = err instanceof Error ? err.message : "";
    if (err instanceof RangeError) {
      return buildErrorResponse(HTTP_STATUS.BAD_REQUEST, message);
    }
    console.error({ op: "rotate", error: message });
    return buildErrorResponse(HTTP_STATUS.UNPROCESSABLE_ENTITY, ERROR_MESSAGES.CORRUPT_PDF);
  }
}
