"use client";

import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { FileDropzone } from "@/components/FileDropzone";
import { ProgressBar } from "@/components/ProgressBar";
import { StatusMessage } from "@/components/StatusMessage";
import { DownloadButton } from "@/components/DownloadButton";

type Degrees = 90 | 180 | 270;

interface RotationEntry {
  pageIndex: number;
  degrees: Degrees;
}

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
    const pageNum = parseInt(pageInput, 10);
    if (isNaN(pageNum) || pageNum < 1) return;
    const entry: RotationEntry = { pageIndex: pageNum - 1, degrees: deg };
    setRotations((prev) => {
      const withoutDupe = prev.filter((r) => r.pageIndex !== entry.pageIndex);
      return [...withoutDupe, entry].sort((a, b) => a.pageIndex - b.pageIndex);
    });
    setPageInput("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) { setErrorMsg("Selecciona un PDF."); setStatus("error"); return; }
    if (rotations.length === 0) { setErrorMsg("Agrega al menos una rotación."); setStatus("error"); return; }

    setStatus("loading");
    setProgress(20);
    setResultBlob(null);

    const form = new FormData();
    form.append("file", file);
    form.append("rotations", JSON.stringify(rotations));

    try {
      setProgress(50);
      const res = await fetch("/api/rotate", { method: "POST", body: form });
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
      <PageHeader title="Rotar páginas" description="Rota páginas específicas de un PDF." />

      <form onSubmit={handleSubmit} className="space-y-6">
        <FileDropzone onFilesSelected={([f]) => setFile(f)} />
        {file && <p className="text-sm text-slate-600">Archivo: <strong>{file.name}</strong></p>}

        <div className="flex gap-3 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-700 mb-1">Página (número)</label>
            <input
              type="number"
              min={1}
              value={pageInput}
              onChange={(e) => setPageInput(e.target.value)}
              placeholder="1"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Grados</label>
            <select
              value={deg}
              onChange={(e) => setDeg(parseInt(e.target.value, 10) as Degrees)}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            >
              <option value={90}>90°</option>
              <option value={180}>180°</option>
              <option value={270}>270°</option>
            </select>
          </div>
          <button type="button" onClick={addRotation} className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium hover:bg-slate-200 transition-colors">
            + Agregar
          </button>
        </div>

        {rotations.length > 0 && (
          <ul className="space-y-1.5">
            {rotations.map((r) => (
              <li key={r.pageIndex} className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm">
                <span>Página {r.pageIndex + 1} → {r.degrees}°</span>
                <button type="button" onClick={() => setRotations((prev) => prev.filter((x) => x.pageIndex !== r.pageIndex))} className="text-slate-400 hover:text-red-500 transition-colors">✕</button>
              </li>
            ))}
          </ul>
        )}

        {status === "loading" && <ProgressBar value={progress} label="Rotando páginas..." />}
        {status === "error" && <StatusMessage status="error" message={errorMsg} />}
        {status === "success" && <StatusMessage status="success" message="¡Páginas rotadas correctamente!" />}

        <div className="flex items-center gap-4">
          <button type="submit" disabled={status === "loading"} className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
            Rotar PDF
          </button>
          <DownloadButton blob={resultBlob} filename="rotated.pdf" />
        </div>
      </form>
    </main>
  );
}
