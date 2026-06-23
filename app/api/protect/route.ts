import { NextRequest } from "next/server";
import { protectPdf } from "@/lib/pdf/protect";
import { validatePdfFile, buildErrorResponse } from "@/lib/validation";
import { pdfResponse } from "@/lib/pdf-response";
import { HTTP_STATUS, ERROR_MESSAGES } from "@/lib/constants";

export async function POST(request: NextRequest): Promise<Response> {
  let file: File;
  let userPassword: string;
  let ownerPassword: string | undefined;

  try {
    const form = await request.formData();
    file = form.get("file") as File;
    userPassword = (form.get("userPassword") as string)?.trim();
    ownerPassword = (form.get("ownerPassword") as string)?.trim() || undefined;
    if (!userPassword) throw new Error();
  } catch {
    return buildErrorResponse(
      HTTP_STATUS.BAD_REQUEST,
      "Debes proporcionar una contraseña de usuario."
    );
  }

  const validationError = validatePdfFile(file);
  if (validationError) {
    return Response.json(validationError.body, { status: validationError.status });
  }

  try {
    const buffer = new Uint8Array(await file.arrayBuffer());
    const result = await protectPdf(buffer, { userPassword, ownerPassword });

    console.info({ op: "protect", outputBytes: result.byteLength });

    return pdfResponse(result, "protected.pdf");
  } catch (err) {
    const message = err instanceof Error ? err.message : "";
    console.error({ op: "protect", error: message });
    return buildErrorResponse(HTTP_STATUS.UNPROCESSABLE_ENTITY, ERROR_MESSAGES.CORRUPT_PDF);
  }
}
