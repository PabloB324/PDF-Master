import { NextRequest } from "next/server";
import { verifySignature } from "@/lib/pdf/verify-signature";
import { validatePdfFile, buildErrorResponse } from "@/lib/validation";
import { HTTP_STATUS, ERROR_MESSAGES } from "@/lib/constants";

export async function POST(request: NextRequest): Promise<Response> {
  let file: File;

  try {
    const form = await request.formData();
    file = form.get("file") as File;
  } catch {
    return buildErrorResponse(HTTP_STATUS.BAD_REQUEST, ERROR_MESSAGES.NO_FILE);
  }

  const validationError = validatePdfFile(file);
  if (validationError) {
    return Response.json(validationError.body, { status: validationError.status });
  }

  try {
    const buffer = new Uint8Array(await file.arrayBuffer());
    const result = await verifySignature(buffer);

    console.info({ op: "verify-signature", hasDSS: result.hasDSS, signatureCount: result.signatures.length });

    return Response.json(result, { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "";
    console.error({ op: "verify-signature", error: message });
    return buildErrorResponse(HTTP_STATUS.UNPROCESSABLE_ENTITY, ERROR_MESSAGES.CORRUPT_PDF);
  }
}
