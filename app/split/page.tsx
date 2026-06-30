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

export default function SplitPage() {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [showToast, setShowToast] = useState(false);

  const handleFile = useCallback((f: File) => setFile(f), []);

  const handleRemove = useCallback(() => setFile(null), []);

  async function handleSubmit() {
    if (!file) return;
    setStatus("loading");
    setProgress(20);

    try {
      const formData = new FormData();
      formData.append("file", file);
      setProgress(50);

      const res = await fetch("/api/split", { method: "POST", body: formData });
      setProgress(80);

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Error al dividir el PDF.");
      }

      const blob = await res.blob();
      setProgress(100);
      triggerDownload(blob, "paginas.zip");
      setStatus("idle");
      setFile(null);
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
        title="Dividir PDF"
        description="Separa cada página del PDF en archivos individuales y descárgalos todos en un ZIP."
      />

      {showToast && (
        <Toast message="ZIP descargado correctamente." onClose={() => setShowToast(false)} />
      )}

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-5">
        <FileDropzone
          accept=".pdf,application/pdf"
          label="Arrastra tu PDF aquí, o"
          onFilesSelected={(files) => { if (files[0]) handleFile(files[0]); }}
        />

        {file && (
          <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-orange-100">
                <svg className="size-3.5 text-orange-500" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.75.75 0 0 1 1.06-1.06L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0z" />
                </svg>
              </div>
              <span className="truncate text-sm font-medium text-gray-700">{file.name}</span>
            </div>
            <button
              onClick={handleRemove}
              className="ml-3 shrink-0 text-gray-300 hover:text-red-400 transition-colors"
              aria-label="Eliminar archivo"
            >
              <svg className="size-4" viewBox="0 0 16 16" fill="currentColor">
                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
              </svg>
            </button>
          </div>
        )}

        {status === "loading" && <ProgressBar value={progress} label="Dividiendo páginas…" />}

        {status === "error" && (
          <div className="rounded-xl border-l-4 border-red-400 bg-red-50 px-4 py-3 text-sm text-red-700">
            {errorMsg}
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={!file || status === "loading"}
          className="w-full rounded-xl bg-orange-500 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-orange-600 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
        >
          {status === "loading" ? "Procesando…" : "Procesar y descargar"}
        </button>
      </div>
    </div>
  );
}
