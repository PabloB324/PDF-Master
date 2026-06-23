import { NextRequest } from "next/server";
import { numberPages } from "@/lib/pdf/number-pages";
import { validatePdfFile, buildErrorResponse } from "@/lib/validation";
import { pdfResponse } from "@/lib/pdf-response";
import { HTTP_STATUS, ERROR_MESSAGES } from "@/lib/constants";
import type { PageNumberPosition } from "@/types/api";

const VALID_POSITIONS: PageNumberPosition[] = [
  "bottom-center",
  "bottom-left",
  "bottom-right",
  "top-center",
  "top-left",
  "top-right",
];

export async function POST(request: NextRequest): Promise<Response> {
  let file: File;
  let startAt: number;
  let position: PageNumberPosition;
  let fontSize: number;

  try {
    const form = await request.formData();
    file = form.get("file") as File;
    startAt = parseInt(form.get("startAt") as string, 10) || 1;
    const rawPosition = (form.get("position") as string) ?? "bottom-center";
    position = VALID_POSITIONS.includes(rawPosition as PageNumberPosition)
      ? (rawPosition as PageNumberPosition)
      : "bottom-center";
    fontSize = parseInt(form.get("fontSize") as string, 10) || 12;
  } catch {
    return buildErrorResponse(HTTP_STATUS.BAD_REQUEST, ERROR_MESSAGES.NO_FILE);
  }

  const validationError = validatePdfFile(file);
  if (validationError) {
    return Response.json(validationError.body, { status: validationError.status });
  }

  try {
    const buffer = new Uint8Array(await file.arrayBuffer());
    const result = await numberPages(buffer, { startAt, position, fontSize });

    console.info({ op: "number-pages", startAt, position, outputBytes: result.byteLength });

    return pdfResponse(result, "numbered.pdf");
  } catch (err) {
    const message = err instanceof Error ? err.message : "";
    console.error({ op: "number-pages", error: message });
    return buildErrorResponse(HTTP_STATUS.UNPROCESSABLE_ENTITY, ERROR_MESSAGES.CORRUPT_PDF);
  }
}
