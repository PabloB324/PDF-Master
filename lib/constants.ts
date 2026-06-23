export const MAX_FILE_SIZE_MB = 50;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
export const MAX_FILES_PER_REQUEST = 20;

export const SUPPORTED_PDF_MIME_TYPES = ["application/pdf"] as const;

export const PDF_MIME_TYPE = "application/pdf";

export const HTTP_STATUS = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  REQUEST_TOO_LARGE: 413,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export const ERROR_MESSAGES = {
  NO_FILE: "No se proporcionó ningún archivo.",
  INVALID_MIME_TYPE: "El archivo no es un PDF válido.",
  FILE_TOO_LARGE: `El archivo excede el límite de ${MAX_FILE_SIZE_MB}MB.`,
  TOO_MANY_FILES: `Se permiten máximo ${MAX_FILES_PER_REQUEST} archivos por operación.`,
  CORRUPT_PDF: "El PDF no pudo ser procesado. Puede estar corrupto o cifrado.",
  WRONG_PASSWORD: "La contraseña proporcionada es incorrecta.",
  MISSING_PAGES: "Debes especificar al menos una página.",
  INVALID_PAGE_RANGE: "El rango de páginas es inválido.",
  INTERNAL_ERROR: "Error interno del servidor.",
} as const;
