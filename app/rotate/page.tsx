"use client";

import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { FileDropzone } from "@/components/FileDropzone";
import { ProgressBar } from "@/components/ProgressBar";
import { StatusMessage } from "@/components/StatusMessage";
import { DownloadButton } from "@/components/DownloadButton";

const btnPrimary = "rounded-lg bg-[#1e3a5f] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#16304f] disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-200";
const inputCls = "w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 transition-colors";

type Degrees = 90 | 180 | 270;
interface RotationEntry { pageIndex: number; degrees: Degrees; }

export default function RotatePage() {
  const [file, setFile] = useState<File | null>(null);
  const [pageInput, setPageInput] = useState("");
  const [deg, setDeg] = useState<Degrees>(90);
  const [rotations, setRotations] = useState<RotationEntry[]>([]);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);

  const addRotation = () => {
    const n = parseInt(pageInput, 10);
    if (isNaN(n) || n < 1) return;
    const entry = { pageIndex: n - 1, degrees: deg };
    setRotations((p) => [...p.filter((r) => r.pageIndex !== entry.pageIndex), entry].sort((a, b) => a.pageIndex - b.pageIndex));
    setPageInput("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) { setErrorMsg("Selecciona un PDF."); setStatus("error"); return; }
    if (rotations.length === 0) { setErrorMsg("Agrega al menos una rotación."); setStatus("error"); return; }
    setStatus("loading"); setProgress(20); setResultBlob(null);
    const form = new FormData();
    form.append("file", file);
    form.append("rotations", JSON.stringify(rotations));
    try {
      setProgress(50);
      const res = await fetch("/api/rotate", { method: "POST", body: form });
      setProgress(90);
      if (!res.ok) { const d = await res.json() as { error: string }; throw new Error(d.error); }
      setResultBlob(await res.blob()); setStatus("success"); setProgress(100);
    } catch (err) { setErrorMsg(err instanceof Error ? err.message : "Error inesperado."); setStatus("error"); setProgress(0); }
  };

  return (
    <main className="max-w-2xl">
      <PageHeader title="Rotar páginas" description="Rota una o varias páginas de un PDF 90°, 180° o 270°." />
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="rounded-2xl bg-white p-6 shadow-sm space-y-4">
          <FileDropzone onFilesSelected={([f]) => setFile(f)} />
          {file && <p className="text-sm text-slate-500">Seleccionado: <span className="font-medium text-slate-700">{file.name}</span></p>}
          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Página</label>
              <input type="number" min={1} value={pageInput} onChange={(e) => setPageInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addRotation())} placeholder="1" className={inputCls} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Grados</label>
              <select value={deg} onChange={(e) => setDeg(parseInt(e.target.value, 10) as Degrees)} className={inputCls}>
                <option value={90}>90°</option><option value={180}>180°</option><option value={270}>270°</option>
              </select>
            </div>
            <button type="button" onClick={addRotation} className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors">+ Agregar</button>
          </div>
          {rotations.length > 0 && (
            <ul className="space-y-1.5">
              {rotations.map((r) => (
                <li key={r.pageIndex} className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-sm">
                  <span className="text-slate-700">Página <span className="font-mono font-semibold text-[#1e3a5f]">{r.pageIndex + 1}</span> → <span className="text-cyan-600 font-medium">{r.degrees}°</span></span>
                  <button type="button" onClick={() => setRotations((p) => p.filter((x) => x.pageIndex !== r.pageIndex))} className="text-slate-300 hover:text-red-400 transition-colors text-lg leading-none">×</button>
                </li>
              ))}
            </ul>
          )}
        </div>
        {status === "loading" && <ProgressBar value={progress} label="Rotando páginas..." />}
        {status === "error" && <StatusMessage status="error" message={errorMsg} />}
        {status === "success" && <StatusMessage status="success" message="¡Páginas rotadas correctamente!" />}
        <div className="flex items-center gap-3">
          <button type="submit" disabled={status === "loading"} className={btnPrimary}>Rotar PDF</button>
          <DownloadButton blob={resultBlob} filename="rotated.pdf" />
        </div>
      </form>
    </main>
  );
}
