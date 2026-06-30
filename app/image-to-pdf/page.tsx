"use client";

import { useState, useCallback } from "react";
import { PageHeader } from "@/components/PageHeader";
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

export default function ImageToPdfPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [dragging, setDragging] = useState(false);

  const addFiles = useCallback((incoming: FileList | null) => {
    if (!incoming) return;
    const valid = Array.from(incoming).filter(
      (f) => f.type === "image/jpeg" || f.type === "image/png"
    );
    if (valid.length === 0) return;
    setFiles((prev) => {
      const names = new Set(prev.map((f) => f.name));
      return [...prev, ...valid.filter((f) => !names.has(f.name))];
    });
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      addFiles(e.dataTransfer.files);
    },
    [addFiles]
  );

  const handleRemove = useCallback((name: string) => {
    setFiles((prev) => prev.filter((f) => f.name !== name));
  }, []);

  async function handleSubmit() {
    if (files.length === 0) return;
    setStatus("loading");
    setProgress(20);

    try {
      const formData = new FormData();
      files.forEach((f) => formData.append("files", f));
      setProgress(50);

      const res = await fetch("/api/image-to-pdf", { method: "POST", body: formData });
      setProgress(80);

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Error al convertir imágenes.");
      }

      const blob = await res.blob();
      setProgress(100);
      triggerDownload(blob, "imagenes.pdf");
      setStatus("idle");
      setFiles([]);
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
        title="Imagen a PDF"
        description="Convierte imágenes JPEG o PNG en un PDF. Cada imagen se convierte en una página."
      />

      {showToast && (
        <Toast message="PDF generado y descargado correctamente." onClose={() => setShowToast(false)} />
      )}

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-5">
        {/* Drop zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          className={`flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors ${
            dragging ? "border-orange-300 bg-orange-50/30" : "border-gray-200 bg-gray-50"
          }`}
        >
          <div className="flex size-12 items-center justify-center rounded-full bg-orange-50">
            <svg className="size-6 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3 21h18M3.75 3h16.5M12 3v10.5m0 0l-3-3m3 3l3-3" />
            </svg>
          </div>
          <div>
            <p className="text-sm text-gray-500">Arrastra imágenes aquí, o</p>
            <label className="mt-2 inline-block cursor-pointer rounded-full bg-orange-400 px-4 py-1.5 text-sm font-medium text-white hover:bg-orange-500 transition-colors">
              Selecciona imágenes
              <input
                type="file"
                accept="image/jpeg,image/png"
                multiple
                className="sr-only"
                onChange={(e) => addFiles(e.target.files)}
              />
            </label>
          </div>
          <p className="text-xs text-gray-400">JPEG y PNG — máx. 20 MB por imagen</p>
        </div>

        {/* File list */}
        {files.length > 0 && (
          <ul className="space-y-2">
            {files.map((f) => (
              <li key={f.name} className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 px-4 py-2.5">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-orange-100">
                    <svg className="size-3.5 text-orange-500" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.75.75 0 0 1 1.06-1.06L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0z" />
                    </svg>
                  </div>
                  <span className="truncate text-sm text-gray-700">{f.name}</span>
                </div>
                <button
                  onClick={() => handleRemove(f.name)}
                  className="ml-3 shrink-0 text-gray-300 hover:text-red-400 transition-colors"
                  aria-label="Eliminar imagen"
                >
                  <svg className="size-4" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                    <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        )}

        {status === "loading" && <ProgressBar value={progress} label="Generando PDF…" />}

        {status === "error" && (
          <div className="rounded-xl border-l-4 border-red-400 bg-red-50 px-4 py-3 text-sm text-red-700">
            {errorMsg}
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={files.length === 0 || status === "loading"}
          className="w-full rounded-xl bg-orange-500 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-orange-600 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
        >
          {status === "loading" ? "Procesando…" : "Procesar y descargar"}
        </button>
      </div>
    </div>
  );
}
