"use client";

import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { FileDropzone } from "@/components/FileDropzone";
import { ProgressBar } from "@/components/ProgressBar";
import { StatusMessage } from "@/components/StatusMessage";
import { Toast } from "@/components/Toast";
import { ToolLayout } from "@/components/ToolLayout";

const btnSubmit = "w-full rounded-xl bg-orange-500 py-3 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-200";
const inputCls = "w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400/20 transition-colors";

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

type Degrees = 90 | 180 | 270;
interface RotationEntry { pageIndex: number; degrees: Degrees; }

const STEPS = [
  { title: "Sube el PDF", description: "Selecciona el documento cuyas páginas quieres rotar." },
  { title: "Agrega rotaciones", description: "Indica el número de página, selecciona el ángulo (90°, 180° o 270°) y pulsa '+ Agregar'." },
  { title: "Descarga el resultado", description: "Haz clic en 'Procesar y descargar' una vez configuradas todas las rotaciones." },
];

export default function RotatePage() {
  const [file, setFile] = useState<File | null>(null);
  const [pageInput, setPageInput] = useState("");
  const [deg, setDeg] = useState<Degrees>(90);
  const [rotations, setRotations] = useState<RotationEntry[]>([]);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [showToast, setShowToast] = useState(false);

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
    setStatus("loading"); setProgress(20);
    const form = new FormData();
    form.append("file", file); form.append("rotations", JSON.stringify(rotations));
    try {
      setProgress(50);
      const res = await fetch("/api/rotate", { method: "POST", body: form });
      setProgress(90);
      if (!res.ok) { const d = await res.json() as { error: string }; throw new Error(d.error); }
      triggerDownload(await res.blob(), "rotated.pdf");
      setProgress(100); setStatus("idle"); setShowToast(true);
    } catch (err) { setErrorMsg(err instanceof Error ? err.message : "Error inesperado."); setStatus("error"); setProgress(0); }
  };

  return (
    <>
      {showToast && <Toast message="Documento generado correctamente" onClose={() => setShowToast(false)} />}
      <ToolLayout steps={STEPS} note="Puedes rotar múltiples páginas a distintos ángulos en una sola operación. Si agregas una página ya existente, su ángulo se actualiza.">
        <PageHeader title="Rotar páginas" description="Gira las páginas indicadas al ángulo elegido." />
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="rounded-2xl bg-white p-6 shadow-sm space-y-4">
            <p className="text-sm font-medium text-gray-700">Documento PDF</p>
            <FileDropzone onFilesSelected={([f]) => setFile(f)} />
            <p className="text-xs text-gray-400">Solo archivos PDF · Máx. 10 MB</p>
            {file && (
              <div className="flex items-center gap-3 rounded-xl border border-gray-100 px-4 py-3">
                <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-orange-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="size-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                </div>
                <span className="flex-1 truncate text-sm text-gray-700">{file.name}</span>
                <button type="button" onClick={() => setFile(null)} className="text-gray-300 hover:text-red-400 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>
                </button>
              </div>
            )}
            <div className="flex gap-3 items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Página</label>
                <input type="number" min={1} value={pageInput} onChange={(e) => setPageInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addRotation())} placeholder="1" className={inputCls} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Grados</label>
                <select value={deg} onChange={(e) => setDeg(parseInt(e.target.value, 10) as Degrees)} className={inputCls}>
                  <option value={90}>90°</option><option value={180}>180°</option><option value={270}>270°</option>
                </select>
              </div>
              <button type="button" onClick={addRotation} className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors">+ Agregar</button>
            </div>
            {rotations.length > 0 && (
              <ul className="space-y-1.5">
                {rotations.map((r) => (
                  <li key={r.pageIndex} className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm">
                    <span className="text-gray-700">Pág. <span className="font-mono font-semibold text-gray-900">{r.pageIndex + 1}</span> → <span className="text-orange-500 font-medium">{r.degrees}°</span></span>
                    <button type="button" onClick={() => setRotations((p) => p.filter((x) => x.pageIndex !== r.pageIndex))} className="text-gray-300 hover:text-red-400 transition-colors text-lg leading-none">×</button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {rotations.length > 0 && <StatusMessage status="info" message="Se aplicarán las rotaciones indicadas a las páginas correspondientes." />}
          {status === "error" && <StatusMessage status="error" message={errorMsg} />}
          {status === "loading" && <ProgressBar value={progress} label="Procesando tu documento..." />}
          <button type="submit" disabled={status === "loading"} className={btnSubmit}>
            {status === "loading" ? "Procesando..." : "Procesar y descargar"}
          </button>
        </form>
      </ToolLayout>
    </>
  );
}
