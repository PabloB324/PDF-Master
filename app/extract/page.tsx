"use client";

import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { FileDropzone } from "@/components/FileDropzone";
import { ProgressBar } from "@/components/ProgressBar";
import { StatusMessage } from "@/components/StatusMessage";
import { DownloadButton } from "@/components/DownloadButton";

export default function ExtractPage() {
  const [file, setFile] = useState<File | null>(null);
  const [pagesInput, setPagesInput] = useState("");
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);

  const parsePages = (raw: string): number[] => {
    const pages = new Set<number>();
    for (const part of raw.split(",")) {
      const trimmed = part.trim();
      const range = trimmed.match(/^(\d+)-(\d+)$/);
      if (range) {
        const start = parseInt(range[1], 10);
        const end = parseInt(range[2], 10);
        for (let p = start; p <= end; p++) pages.add(p);
      } else if (/^\d+$/.test(trimmed)) {
        pages.add(parseInt(trimmed, 10));
      }
    }
    return Array.from(pages).sort((a, b) => a - b);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) { setErrorMsg("Selecciona un PDF."); setStatus("error"); return; }

    const pages = parsePages(pagesInput);
    if (pages.length === 0) { setErrorMsg("Ingresa páginas válidas (ej: 1,3,5-8)."); setStatus("error"); return; }

    setStatus("loading");
    setProgress(20);
    setResultBlob(null);

    const form = new FormData();
    form.append("file", file);
    form.append("pages", JSON.stringify(pages));

    try {
      setProgress(50);
      const res = await fetch("/api/extract", { method: "POST", body: form });
      setProgress(90);

      if (!res.ok) {
        const data = await res.json() as { error: string };
        throw new Error(data.error);
      }

      setResultBlob(await res.blob());
      setStatus("success");
      setProgress(100);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Error inesperado.");
      setStatus("error");
      setProgress(0);
    }
  };

  return (
    <main>
      <PageHeader title="Extraer páginas" description="Extrae páginas específicas de un PDF." />

      <form onSubmit={handleSubmit} className="space-y-6">
        <FileDropzone onFilesSelected={([f]) => setFile(f)} />
        {file && <p className="text-sm text-slate-600">Archivo: <strong>{file.name}</strong></p>}

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Páginas <span className="text-slate-400 font-normal">(ej: 1, 3, 5-8)</span>
          </label>
          <input
            type="text"
            value={pagesInput}
            onChange={(e) => setPagesInput(e.target.value)}
            placeholder="1, 3, 5-8"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {status === "loading" && <ProgressBar value={progress} label="Extrayendo páginas..." />}
        {status === "error" && <StatusMessage status="error" message={errorMsg} />}
        {status === "success" && <StatusMessage status="success" message="¡Páginas extraídas correctamente!" />}

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={status === "loading"}
            className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Extraer
          </button>
          <DownloadButton blob={resultBlob} filename="extracted.pdf" />
        </div>
      </form>
    </main>
  );
}
