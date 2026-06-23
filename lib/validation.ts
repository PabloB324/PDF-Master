import {
  MAX_FILE_SIZE_BYTES,
  MAX_FILES_PER_REQUEST,
  PDF_MIME_TYPE,
  ERROR_MESSAGES,
  HTTP_STATUS,
} from "@/lib/constants";
import type { ApiError } from "@/types/api";

interface ValidationError {
  status: number;
  body: ApiError;
}

export function validatePdfFile(
  file: File | null | undefined
): ValidationError | null {
  if (!file) {
    return { status: HTTP_STATUS.BAD_REQUEST, body: { error: ERROR_MESSAGES.NO_FILE } };
  }
  if (file.type !== PDF_MIME_TYPE) {
    return {
      status: HTTP_STATUS.BAD_REQUEST,
      body: { error: ERROR_MESSAGES.INVALID_MIME_TYPE },
    };
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      status: HTTP_STATUS.REQUEST_TOO_LARGE,
      body: { error: ERROR_MESSAGES.FILE_TOO_LARGE },
    };
  }
  return null;
}

export function validatePdfFiles(
  files: File[]
): ValidationError | null {
  if (files.length === 0) {
    return { status: HTTP_STATUS.BAD_REQUEST, body: { error: ERROR_MESSAGES.NO_FILE } };
  }
  if (files.length > MAX_FILES_PER_REQUEST) {
    return {
      status: HTTP_STATUS.BAD_REQUEST,
      body: { error: ERROR_MESSAGES.TOO_MANY_FILES },
    };
  }
  for (const file of files) {
    const err = validatePdfFile(file);
    if (err) return err;
  }
  return null;
}

export function buildErrorResponse(status: number, error: string): Response {
  return Response.json({ error } satisfies ApiError, { status });
}
