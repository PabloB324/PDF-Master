"use client";

import { useState, useCallback } from "react";
import { PageHeader } from "@/components/PageHeader";
import { FileDropzone } from "@/components/FileDropzone";
import { ProgressBar } from "@/components/ProgressBar";
import { Toast } from "@/components/Toast";

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function InsertPage() {
  const [baseFile, setBaseFile] = useState<File | null>(null);
  const [insertFile, setInsertFile] = useState<File | null>(null);
  const [afterPage, setAfterPage] = useState<string>("0");
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [showToast, setShowToast] = useState(false);

  const handleBase = useCallback((f: File) => setBaseFile(f), []);
  const handleInsert = useCallback((f: File) => setInsertFile(f), []);

  async function handleSubmit() {
    if (!baseFile || !insertFile) return;
    setStatus("loading");
    setProgress(20);

    try {
      const formData = new FormData();
      formData.append("base", baseFile);
      formData.append("insert", insertFile);
      formData.append("afterPage", afterPage);
      setProgress(50);

      const res = await fetch("/api/insert", { method: "POST", body: formData });
      setProgress(80);

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Error al insertar el PDF.");
      }

      const blob = await res.blob();
      setProgress(100);
      triggerDownload(blob, "combinado.pdf");
      setStatus("idle");
      setBaseFile(null);
      setInsertFile(null);
      setAfterPage("0");
      setShowToast(true);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Error inesperado.");
      setStatus("error");
      setProgress(0);
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader
        title="Insertar en PDF"
        description="Inserta las páginas de un segundo PDF dentro de un PDF base en la posición que elijas."
      />

      {showToast && (
        <Toast message="PDF combinado y descargado correctamente." onClose={() => setShowToast(false)} />
      )}

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-5">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">PDF base</p>
          <FileDropzone
            accept=".pdf,application/pdf"
            label="Arrastra el PDF base aquí, o"
            onFilesSelected={(files) => { if (files[0]) handleBase(files[0]); }}
          />
          {baseFile && (
            <div className="mt-2 flex items-center gap-2 rounded-lg bg-orange-50 px-3 py-2 text-sm text-orange-700">
              <svg className="size-4 shrink-0" viewBox="0 0 16 16" fill="currentColor">
                <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.75.75 0 0 1 1.06-1.06L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0z" />
              </svg>
              <span className="truncate font-medium">{baseFile.name}</span>
              <button onClick={() => setBaseFile(null)} className="ml-auto text-orange-300 hover:text-red-400">×</button>
            </div>
          )}
        </div>

        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">PDF a insertar</p>
          <FileDropzone
            accept=".pdf,application/pdf"
            label="Arrastra el PDF a insertar aquí, o"
            onFilesSelected={(files) => { if (files[0]) handleInsert(files[0]); }}
          />
          {insertFile && (
            <div className="mt-2 flex items-center gap-2 rounded-lg bg-orange-50 px-3 py-2 text-sm text-orange-700">
              <svg className="size-4 shrink-0" viewBox="0 0 16 16" fill="currentColor">
                <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.75.75 0 0 1 1.06-1.06L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0z" />
              </svg>
              <span className="truncate font-medium">{insertFile.name}</span>
              <button onClick={() => setInsertFile(null)} className="ml-auto text-orange-300 hover:text-red-400">×</button>
            </div>
          )}
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-400">
            Insertar después de la página
          </label>
          <input
            type="number"
            min={0}
            value={afterPage}
            onChange={(e) => setAfterPage(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-800 focus:border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-100"
            placeholder="0 = al inicio"
          />
          <p className="mt-1 text-xs text-gray-400">Escribe 0 para insertar al inicio del PDF base.</p>
        </div>

        {status === "loading" && <ProgressBar value={progress} label="Combinando páginas…" />}

        {status === "error" && (
          <div className="rounded-xl border-l-4 border-red-400 bg-red-50 px-4 py-3 text-sm text-red-700">
            {errorMsg}
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={!baseFile || !insertFile || status === "loading"}
          className="w-full rounded-xl bg-orange-500 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-orange-600 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
        >
          {status === "loading" ? "Procesando…" : "Procesar y descargar"}
        </button>
      </div>
    </div>
  );
}
