export function pdfResponse(bytes: Uint8Array, filename: string): Response {
  // Buffer.from() ensures the underlying ArrayBuffer type is ArrayBuffer (not
  // ArrayBufferLike), which is required by the BodyInit type in strict mode.
  return new Response(Buffer.from(bytes), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
