import { NextRequest } from "next/server";
import { mergePdfs } from "@/lib/pdf/merge";
import { validatePdfFiles, buildErrorResponse } from "@/lib/validation";
import { pdfResponse } from "@/lib/pdf-response";
import { HTTP_STATUS, ERROR_MESSAGES } from "@/lib/constants";

export async function POST(request: NextRequest): Promise<Response> {
  let files: File[];

  try {
    const form = await request.formData();
    files = form.getAll("files") as File[];
  } catch {
    return buildErrorResponse(HTTP_STATUS.BAD_REQUEST, ERROR_MESSAGES.NO_FILE);
  }

  const validationError = validatePdfFiles(files);
  if (validationError) {
    return Response.json(validationError.body, { status: validationError.status });
  }

  try {
    const buffers = await Promise.all(
      files.map(async (f) => new Uint8Array(await f.arrayBuffer()))
    );
    const result = await mergePdfs(buffers);

    console.info({ op: "merge", fileCount: files.length, outputBytes: result.byteLength });

    return pdfResponse(result, "merged.pdf");
  } catch (err) {
    const message = err instanceof Error ? err.message : "";
    const isCorrupt = message.toLowerCase().includes("encrypt") || message.toLowerCase().includes("corrupt");
    if (isCorrupt) {
      return buildErrorResponse(HTTP_STATUS.UNPROCESSABLE_ENTITY, ERROR_MESSAGES.CORRUPT_PDF);
    }
    console.error({ op: "merge", error: message });
    return buildErrorResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, ERROR_MESSAGES.INTERNAL_ERROR);
  }
}
