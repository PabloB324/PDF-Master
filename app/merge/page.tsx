"use client";

import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { FileDropzone } from "@/components/FileDropzone";
import { ProgressBar } from "@/components/ProgressBar";
import { StatusMessage } from "@/components/StatusMessage";
import { Toast } from "@/components/Toast";

const btnSubmit = "w-full rounded-xl bg-orange-500 py-3 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-200";

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function MergePage() {
  const [files, setFiles] = useState<File[]>([]);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [showToast, setShowToast] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (files.length < 2) { setErrorMsg("Selecciona al menos 2 archivos PDF."); setStatus("error"); return; }
    setStatus("loading"); setProgress(10);
    const form = new FormData();
    for (const f of files) form.append("files", f);
    try {
      setProgress(40);
      const res = await fetch("/api/merge", { method: "POST", body: form });
      setProgress(90);
      if (!res.ok) { const d = await res.json() as { error: string }; throw new Error(d.error); }
      triggerDownload(await res.blob(), "merged.pdf");
      setProgress(100); setStatus("idle"); setShowToast(true); setFiles([]);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Error inesperado.");
      setStatus("error"); setProgress(0);
    }
  };

  return (
    <>
      {showToast && <Toast message="Documento generado correctamente" onClose={() => setShowToast(false)} />}
      <div className="max-w-2xl">
        <PageHeader title="Unir PDFs" description="Combina varios documentos PDF en uno solo, en el orden seleccionado." />
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-700 mb-3">Documentos PDF</p>
            <FileDropzone onFilesSelected={(inc) => setFiles((p) => [...p, ...inc])} multiple />
            <p className="mt-2 text-xs text-gray-400">Solo archivos PDF · Máx. 50MB por archivo</p>
          </div>

          {files.length > 0 && (
            <div className="space-y-2">
              {files.map((f, i) => (
                <div key={i} className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white px-4 py-3 shadow-sm">
                  <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-orange-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="size-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                  </div>
                  <span className="flex-1 truncate text-sm text-gray-700">{f.name}</span>
                  <button type="button" onClick={() => setFiles((p) => p.filter((_, j) => j !== i))} className="text-gray-300 hover:text-red-400 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}

          {files.length >= 2 && (
            <StatusMessage status="info" message="Se generará un nuevo PDF que une todos los documentos en el orden en que los cargaste: el primero al inicio y el último al final." />
          )}

          {status === "error" && <StatusMessage status="error" message={errorMsg} />}
          {status === "loading" && <ProgressBar value={progress} label="Procesando tu documento..." />}

          <button type="submit" disabled={status === "loading" || files.length < 2} className={btnSubmit}>
            {status === "loading" ? "Procesando..." : "Procesar y descargar"}
          </button>
        </form>
      </div>
    </>
  );
}
