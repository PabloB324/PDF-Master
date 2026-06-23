"use client";

import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { FileDropzone } from "@/components/FileDropzone";
import { ProgressBar } from "@/components/ProgressBar";
import { StatusMessage } from "@/components/StatusMessage";
import { DownloadButton } from "@/components/DownloadButton";
import type { PageNumberPosition } from "@/types/api";

const POSITIONS: { value: PageNumberPosition; label: string }[] = [
  { value: "bottom-center", label: "Abajo al centro" },
  { value: "bottom-left",   label: "Abajo a la izquierda" },
  { value: "bottom-right",  label: "Abajo a la derecha" },
  { value: "top-center",    label: "Arriba al centro" },
  { value: "top-left",      label: "Arriba a la izquierda" },
  { value: "top-right",     label: "Arriba a la derecha" },
];

const inputCls = "w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-colors";

export default function NumberPagesPage() {
  const [file, setFile] = useState<File | null>(null);
  const [startAt, setStartAt] = useState(1);
  const [position, setPosition] = useState<PageNumberPosition>("bottom-center");
  const [fontSize, setFontSize] = useState(12);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) { setErrorMsg("Selecciona un PDF."); setStatus("error"); return; }
    setStatus("loading"); setProgress(20); setResultBlob(null);
    const form = new FormData();
    form.append("file", file);
    form.append("startAt", String(startAt));
    form.append("position", position);
    form.append("fontSize", String(fontSize));
    try {
      setProgress(50);
      const res = await fetch("/api/number-pages", { method: "POST", body: form });
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
      <PageHeader title="Numerar páginas" description="Agrega números de página a tu PDF." />
      <form onSubmit={handleSubmit} className="space-y-5">
        <FileDropzone onFilesSelected={([f]) => setFile(f)} />
        {file && <p className="text-sm text-slate-400">Archivo: <span className="text-slate-200 font-medium">{file.name}</span></p>}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Empezar desde</label>
            <input type="number" min={1} value={startAt} onChange={(e) => setStartAt(parseInt(e.target.value, 10) || 1)} className={inputCls} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Posición</label>
            <select value={position} onChange={(e) => setPosition(e.target.value as PageNumberPosition)} className={inputCls}>
              {POSITIONS.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Tamaño de fuente</label>
            <input type="number" min={6} max={48} value={fontSize} onChange={(e) => setFontSize(parseInt(e.target.value, 10) || 12)} className={inputCls} />
          </div>
        </div>

        {status === "loading" && <ProgressBar value={progress} label="Numerando páginas..." />}
        {status === "error" && <StatusMessage status="error" message={errorMsg} />}
        {status === "success" && <StatusMessage status="success" message="¡Páginas numeradas correctamente!" />}

        <div className="flex items-center gap-3">
          <button type="submit" disabled={status === "loading"} className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-200">Numerar</button>
          <DownloadButton blob={resultBlob} filename="numbered.pdf" />
        </div>
      </form>
    </main>
  );
}
