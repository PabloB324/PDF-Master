"use client";

import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { FileDropzone } from "@/components/FileDropzone";
import { ProgressBar } from "@/components/ProgressBar";
import { StatusMessage } from "@/components/StatusMessage";
import { DownloadButton } from "@/components/DownloadButton";
import { ToolLayout } from "@/components/ToolLayout";

const btnPrimary = "rounded-lg bg-[#1e3a5f] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#16304f] disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-200";
const inputCls = "w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 transition-colors";

const STEPS = [
  { title: "Sube tu PDF", description: "Arrastra o selecciona el archivo PDF desde tu dispositivo." },
  { title: "Indica las páginas", description: "Escribe los números o rangos de páginas que deseas extraer. Ej: 1, 3, 5-8." },
  { title: "Descarga el resultado", description: "Obtén un nuevo PDF con las páginas seleccionadas." },
];

const parsePages = (raw: string): number[] => {
  const pages = new Set<number>();
  for (const part of raw.split(",")) {
    const t = part.trim();
    const range = t.match(/^(\d+)-(\d+)$/);
    if (range) { for (let p = parseInt(range[1], 10); p <= parseInt(range[2], 10); p++) pages.add(p); }
    else if (/^\d+$/.test(t)) pages.add(parseInt(t, 10));
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
      setResultBlob(await res.blob()); setStatus("success"); setProgress(100);
    } catch (err) { setErrorMsg(err instanceof Error ? err.message : "Error inesperado."); setStatus("error"); setProgress(0); }
  };

  return (
    <ToolLayout breadcrumb="Extraer páginas" steps={STEPS} note="Tus archivos se procesan de forma segura y no se almacenan en nuestros servidores.">
      <PageHeader title="Extraer páginas" description="Selecciona las páginas que deseas extraer de un PDF." />
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="rounded-2xl bg-white p-6 shadow-sm space-y-4">
          <FileDropzone onFilesSelected={([f]) => setFile(f)} />
          {file && <p className="text-sm text-slate-500">Seleccionado: <span className="font-medium text-slate-700">{file.name}</span></p>}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Páginas a extraer <span className="text-slate-400 font-normal">(ej: 1, 3, 5-8)</span></label>
            <input type="text" value={pagesInput} onChange={(e) => setPagesInput(e.target.value)} placeholder="Ej: 1, 3, 5-8, 11-13" className={inputCls} />
            <p className="mt-1 text-xs text-slate-400">Ejemplos: 1, 3, 5-8</p>
          </div>
        </div>
        {status === "loading" && <ProgressBar value={progress} label="Extrayendo páginas..." />}
        {status === "error" && <StatusMessage status="error" message={errorMsg} />}
        {status === "success" && <StatusMessage status="success" message="¡Páginas extraídas correctamente!" />}
        <div className="flex items-center gap-3">
          <button type="submit" disabled={status === "loading"} className={btnPrimary}>Extraer páginas</button>
          <DownloadButton blob={resultBlob} filename="extracted.pdf" />
        </div>
      </form>
    </ToolLayout>
  );
}
