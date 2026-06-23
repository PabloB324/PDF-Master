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
    setStatus("loading"); setProgress(10); setResultBlob(null);
    const form = new FormData();
    for (const f of files) form.append("files", f);
    try {
      setProgress(40);
      const res = await fetch("/api/merge", { method: "POST", body: form });
      setProgress(90);
      if (!res.ok) { const d = await res.json() as { error: string }; throw new Error(d.error); }
      setResultBlob(await res.blob());
      setStatus("success"); setProgress(100);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Error inesperado.");
      setStatus("error"); setProgress(0);
    }
  };

  return (
    <main>
      <PageHeader title="Unir PDFs" description="Combina varios archivos PDF en uno solo, en el orden que elijas." />
      <form onSubmit={handleSubmit} className="space-y-5">
        <FileDropzone onFilesSelected={(inc) => setFiles((p) => [...p, ...inc])} multiple />

        {files.length > 0 && (
          <ul className="space-y-2">
            {files.map((f, i) => (
              <li key={i} className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900 px-4 py-2.5 text-sm">
                <div className="flex items-center gap-3">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-slate-800 text-xs font-mono text-slate-400">{i + 1}</span>
                  <span className="truncate text-slate-300">{f.name}</span>
                </div>
                <button type="button" onClick={() => setFiles((p) => p.filter((_, j) => j !== i))} className="ml-4 shrink-0 text-slate-600 hover:text-red-400 transition-colors" aria-label={`Eliminar ${f.name}`}>✕</button>
              </li>
            ))}
          </ul>
        )}

        {status === "loading" && <ProgressBar value={progress} label="Uniendo PDFs..." />}
        {status === "error" && <StatusMessage status="error" message={errorMsg} />}
        {status === "success" && <StatusMessage status="success" message="¡PDFs unidos correctamente!" />}

        <div className="flex items-center gap-3">
          <button type="submit" disabled={status === "loading" || files.length < 2} className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-200">
            Unir PDFs
          </button>
          <DownloadButton blob={resultBlob} filename="merged.pdf" />
        </div>
      </form>
    </main>
  );
}
