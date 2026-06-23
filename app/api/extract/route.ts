import { NextRequest } from "next/server";
import { extractPages } from "@/lib/pdf/extract";
import { validatePdfFile, buildErrorResponse } from "@/lib/validation";
import { pdfResponse } from "@/lib/pdf-response";
import { HTTP_STATUS, ERROR_MESSAGES } from "@/lib/constants";

export async function POST(request: NextRequest): Promise<Response> {
  let file: File;
  let pages: number[];

  try {
    const form = await request.formData();
    file = form.get("file") as File;
    const pagesRaw = form.get("pages") as string;
    pages = JSON.parse(pagesRaw) as number[];
    if (!Array.isArray(pages) || pages.length === 0) throw new Error();
  } catch {
    return buildErrorResponse(HTTP_STATUS.BAD_REQUEST, ERROR_MESSAGES.MISSING_PAGES);
  }

  const validationError = validatePdfFile(file);
  if (validationError) {
    return Response.json(validationError.body, { status: validationError.status });
  }

  try {
    const buffer = new Uint8Array(await file.arrayBuffer());
    const result = await extractPages(buffer, pages);

    console.info({ op: "extract", pages, outputBytes: result.byteLength });

    return pdfResponse(result, "extracted.pdf");
  } catch (err) {
    const message = err instanceof Error ? err.message : "";
    if (err instanceof RangeError) {
      return buildErrorResponse(HTTP_STATUS.BAD_REQUEST, message);
    }
    console.error({ op: "extract", error: message });
    return buildErrorResponse(HTTP_STATUS.UNPROCESSABLE_ENTITY, ERROR_MESSAGES.CORRUPT_PDF);
  }
}
