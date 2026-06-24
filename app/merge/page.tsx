"use client";

import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { FileDropzone } from "@/components/FileDropzone";
import { ProgressBar } from "@/components/ProgressBar";
import { StatusMessage } from "@/components/StatusMessage";
import { DownloadButton } from "@/components/DownloadButton";

const btnPrimary = "rounded-lg bg-[#1e3a5f] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#16304f] disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-200";

export default function MergePage() {
  const [files, setFiles] = useState<File[]>([]);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (files.length < 2) { setErrorMsg("Selecciona al menos 2 archivos PDF."); setStatus("error"); return; }
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
    } catch (err) { setErrorMsg(err instanceof Error ? err.message : "Error inesperado."); setStatus("error"); setProgress(0); }
  };

  return (
    <main className="max-w-2xl">
      <PageHeader title="Unir PDFs" description="Combine múltiples archivos PDF en un solo documento de forma secuencial." />

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <FileDropzone onFilesSelected={(inc) => setFiles((p) => [...p, ...inc])} multiple />
        </div>

        {files.length > 0 && (
          <div className="rounded-2xl bg-white p-4 shadow-sm space-y-2">
            {files.map((f, i) => (
              <div key={i} className="flex items-center gap-3 rounded-lg border border-slate-100 px-3 py-2.5">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-slate-100 text-xs font-mono text-slate-500">{i + 1}</span>
                <span className="flex-1 truncate text-sm text-slate-700">{f.name}</span>
                <button type="button" onClick={() => setFiles((p) => p.filter((_, j) => j !== i))} className="text-slate-300 hover:text-red-400 transition-colors text-lg leading-none">×</button>
              </div>
            ))}
          </div>
        )}

        {status === "loading" && <ProgressBar value={progress} label="Uniendo PDFs..." />}
        {status === "error" && <StatusMessage status="error" message={errorMsg} />}
        {status === "success" && <StatusMessage status="success" message="¡PDFs unidos correctamente!" />}

        <div className="flex items-center gap-3">
          <button type="submit" disabled={status === "loading" || files.length < 2} className={btnPrimary}>Unir PDFs</button>
          <DownloadButton blob={resultBlob} filename="merged.pdf" />
        </div>
      </form>
    </main>
  );
}
