# PDF Master

Full-stack PDF toolkit built with Next.js 15 App Router, TypeScript and Tailwind CSS. All processing happens in-memory on the server — files are never saved to disk.

## Features

| Feature | Library |
|---|---|
| Merge multiple PDFs | `pdf-lib` |
| Extract specific pages | `pdf-lib` |
| Rotate pages | `pdf-lib` |
| Add page numbers | `pdf-lib` |
| Password-protect a PDF | `@cantoo/pdf-lib` |
| Unlock a password-protected PDF | `@cantoo/pdf-lib` |
| Verify digital signatures | `pdfjs-dist` |
| Inspect PDF metadata | `pdfjs-dist` |

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript (strict)
- **Styling:** Tailwind CSS v4
- **PDF processing:** `pdf-lib`, `@cantoo/pdf-lib`, `pdfjs-dist`
- **Testing:** Vitest + React Testing Library
- **Deployment:** Vercel (serverless)

## Architecture

```
app/
├── page.tsx                    # Home — feature grid
├── [feature]/page.tsx          # 8 client pages (drag & drop, progress, download)
└── api/[feature]/route.ts      # 8 Route Handlers — validation + PDF processing

lib/
├── pdf/                        # Pure PDF logic, decoupled from HTTP layer
│   ├── merge.ts
│   ├── extract.ts
│   ├── rotate.ts
│   ├── number-pages.ts
│   ├── protect.ts
│   ├── unlock.ts
│   ├── verify-signature.ts
│   └── verify-metadata.ts
├── constants.ts                # MAX_FILE_SIZE_MB, SUPPORTED_MIME_TYPES, etc.
├── validation.ts               # Input validation (MIME type, file size, count)
└── pdf-response.ts             # Shared Response builder for PDF downloads

components/
├── FileDropzone.tsx            # Drag & drop upload with client-side validation
├── ProgressBar.tsx             # Accessible progress indicator
├── StatusMessage.tsx           # Success / error / info feedback
├── DownloadButton.tsx          # Blob → download trigger
├── FeatureCard.tsx             # Home page navigation cards
└── PageHeader.tsx              # Back link + page title

types/
└── api.ts                      # Shared TypeScript interfaces
```

## Design Decisions

**Files processed in memory** — Route Handlers receive files via `FormData`, convert them to `Uint8Array`, process them with the PDF libraries, and return the result directly as `application/pdf`. Nothing touches the filesystem, which is required for Vercel's serverless environment.

**`@cantoo/pdf-lib` for encryption** — `pdf-lib 1.17.1` does not expose password encryption in its public API. `@cantoo/pdf-lib` is an actively maintained fork that adds AES/RC4 encryption via `doc.encrypt()` and password-based decryption via `LoadOptions.password`, using pure-JS `crypto-js` — no native binaries required.

**Server Components by default** — `"use client"` is used only where browser APIs are needed: drag & drop (`FileDropzone`), progress state, and download triggers.

**Semantic HTTP errors** — `400` invalid input · `413` file too large · `422` corrupt/unprocessable PDF · `500` unexpected server error.

## Running Locally

```bash
# Requires Node >= 20
npm install
npm run dev        # http://localhost:3000
npm test           # 41 tests
npm run build      # production build
```

## Limits

| Constraint | Value |
|---|---|
| Max file size | 50 MB |
| Max files per merge | 20 |
| Vercel function timeout | 10 s |
