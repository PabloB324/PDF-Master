"use client";

import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { FileDropzone } from "@/components/FileDropzone";
import { ProgressBar } from "@/components/ProgressBar";
import { StatusMessage } from "@/components/StatusMessage";
import { DownloadButton } from "@/components/DownloadButton";

export default function MergePage() {
  const [files, setFiles] = useState<File[]>([]);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (files.length < 2) {
      setErrorMsg("Selecciona al menos 2 archivos PDF.");
      setStatus("error");
      return;
    }

    setStatus("loading");
    setProgress(10);
    setResultBlob(null);

    const form = new FormData();
    for (const f of files) form.append("files", f);

    try {
      setProgress(40);
      const res = await fetch("/api/merge", { method: "POST", body: form });
      setProgress(90);

      if (!res.ok) {
        const data = await res.json() as { error: string };
        throw new Error(data.error);
      }

      const blob = await res.blob();
      setResultBlob(blob);
      setStatus("success");
      setProgress(100);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Error inesperado.");
      setStatus("error");
      setProgress(0);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <main>
      <PageHeader title="Unir PDFs" description="Combina varios archivos PDF en uno solo, en el orden que elijas." />

      <form onSubmit={handleSubmit} className="space-y-6">
        <FileDropzone
          onFilesSelected={(incoming) => setFiles((prev) => [...prev, ...incoming])}
          multiple
          label="Arrastra tus PDFs aquí o haz clic para seleccionarlos"
        />

        {files.length > 0 && (
          <ul className="space-y-2">
            {files.map((f, i) => (
              <li key={i} className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm">
                <span className="truncate text-slate-700">{f.name}</span>
                <button
                  type="button"
                  onClick={() => removeFile(i)}
                  className="ml-4 shrink-0 text-slate-400 hover:text-red-500 transition-colors"
                  aria-label={`Eliminar ${f.name}`}
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )}

        {status === "loading" && <ProgressBar value={progress} label="Procesando..." />}
        {status === "error" && <StatusMessage status="error" message={errorMsg} />}
        {status === "success" && <StatusMessage status="success" message="¡PDFs unidos correctamente!" />}

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={status === "loading" || files.length < 2}
            className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Unir PDFs
          </button>
          <DownloadButton blob={resultBlob} filename="merged.pdf" />
        </div>
      </form>
    </main>
  );
}
