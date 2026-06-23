import { NextRequest } from "next/server";
import { unlockPdf } from "@/lib/pdf/unlock";
import { validatePdfFile, buildErrorResponse } from "@/lib/validation";
import { pdfResponse } from "@/lib/pdf-response";
import { HTTP_STATUS, ERROR_MESSAGES } from "@/lib/constants";

export async function POST(request: NextRequest): Promise<Response> {
  let file: File;
  let password: string;

  try {
    const form = await request.formData();
    file = form.get("file") as File;
    password = (form.get("password") as string)?.trim();
    if (!password) throw new Error();
  } catch {
    return buildErrorResponse(
      HTTP_STATUS.BAD_REQUEST,
      "Debes proporcionar la contraseña del PDF."
    );
  }

  const validationError = validatePdfFile(file);
  if (validationError) {
    return Response.json(validationError.body, { status: validationError.status });
  }

  try {
    const buffer = new Uint8Array(await file.arrayBuffer());
    const result = await unlockPdf(buffer, password);

    console.info({ op: "unlock", outputBytes: result.byteLength });

    return pdfResponse(result, "unlocked.pdf");
  } catch (err) {
    const message = err instanceof Error ? err.message : "";
    if (message === ERROR_MESSAGES.WRONG_PASSWORD) {
      return buildErrorResponse(HTTP_STATUS.UNPROCESSABLE_ENTITY, ERROR_MESSAGES.WRONG_PASSWORD);
    }
    console.error({ op: "unlock", error: message });
    return buildErrorResponse(HTTP_STATUS.UNPROCESSABLE_ENTITY, ERROR_MESSAGES.CORRUPT_PDF);
  }
}
