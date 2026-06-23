"use client";

import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { FileDropzone } from "@/components/FileDropzone";
import { ProgressBar } from "@/components/ProgressBar";
import { StatusMessage } from "@/components/StatusMessage";
import { DownloadButton } from "@/components/DownloadButton";

const parsePages = (raw: string): number[] => {
  const pages = new Set<number>();
  for (const part of raw.split(",")) {
    const trimmed = part.trim();
    const range = trimmed.match(/^(\d+)-(\d+)$/);
    if (range) { for (let p = parseInt(range[1], 10); p <= parseInt(range[2], 10); p++) pages.add(p); }
    else if (/^\d+$/.test(trimmed)) pages.add(parseInt(trimmed, 10));
  }
  return Array.from(pages).sort((a, b) => a - b);
};

export default function ExtractPage() {
  const [file, setFile] = useState<File | null>(null);
  const [pagesInput, setPagesInput] = useState("");
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) { setErrorMsg("Selecciona un PDF."); setStatus("error"); return; }
    const pages = parsePages(pagesInput);
    if (pages.length === 0) { setErrorMsg("Ingresa páginas válidas (ej: 1,3,5-8)."); setStatus("error"); return; }
    setStatus("loading"); setProgress(20); setResultBlob(null);
    const form = new FormData();
    form.append("file", file);
    form.append("pages", JSON.stringify(pages));
    try {
      setProgress(50);
      const res = await fetch("/api/extract", { method: "POST", body: form });
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
      <PageHeader title="Extraer páginas" description="Extrae páginas específicas de un PDF." />
      <form onSubmit={handleSubmit} className="space-y-5">
        <FileDropzone onFilesSelected={([f]) => setFile(f)} />
        {file && <p className="text-sm text-slate-400">Archivo seleccionado: <span className="text-slate-200 font-medium">{file.name}</span></p>}

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Páginas <span className="text-slate-500 font-normal">(ej: 1, 3, 5-8)</span></label>
          <input type="text" value={pagesInput} onChange={(e) => setPagesInput(e.target.value)} placeholder="1, 3, 5-8" className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-colors" />
        </div>

        {status === "loading" && <ProgressBar value={progress} label="Extrayendo páginas..." />}
        {status === "error" && <StatusMessage status="error" message={errorMsg} />}
        {status === "success" && <StatusMessage status="success" message="¡Páginas extraídas correctamente!" />}

        <div className="flex items-center gap-3">
          <button type="submit" disabled={status === "loading"} className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-200">Extraer</button>
          <DownloadButton blob={resultBlob} filename="extracted.pdf" />
        </div>
      </form>
    </main>
  );
}
