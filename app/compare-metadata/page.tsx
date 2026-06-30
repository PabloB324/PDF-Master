"use client";

import { useState, useCallback } from "react";
import { PageHeader } from "@/components/PageHeader";
import { FileDropzone } from "@/components/FileDropzone";
import { ProgressBar } from "@/components/ProgressBar";
import { ToolLayout } from "@/components/ToolLayout";
import type { CompareMetadataResult } from "@/types/api";

const STEPS = [
  { title: "Sube el PDF A", description: "El documento de referencia o el original." },
  { title: "Sube el PDF B", description: "La copia, versión modificada o documento a comparar." },
  { title: "Compara los metadatos", description: "Haz clic en 'Comparar metadatos' para ver la tabla campo por campo." },
];

export default function CompareMetadataPage() {
  const [fileA, setFileA] = useState<File | null>(null);
  const [fileB, setFileB] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "done">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [result, setResult] = useState<CompareMetadataResult | null>(null);

  const handleFileA = useCallback((f: File) => setFileA(f), []);
  const handleFileB = useCallback((f: File) => setFileB(f), []);

  async function handleSubmit() {
    if (!fileA || !fileB) return;
    setStatus("loading");
    setProgress(30);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("fileA", fileA);
      formData.append("fileB", fileB);
      setProgress(60);

      const res = await fetch("/api/compare-metadata", { method: "POST", body: formData });
      setProgress(90);

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Error al comparar metadatos.");
      }

      const data: CompareMetadataResult = await res.json();
      setProgress(100);
      setResult(data);
      setStatus("done");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Error inesperado.");
      setStatus("error");
      setProgress(0);
    }
  }

  const matchPct = result ? Math.round((result.matchingFields / result.totalFields) * 100) : 0;

  return (
    <ToolLayout steps={STEPS} note="Los campos con ✗ indican diferencias. Útil para detectar si un PDF fue alterado respecto a un original.">
      <PageHeader
        title="Comparar metadatos"
        description="Compara los metadatos de dos PDFs campo a campo para detectar diferencias."
      />

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">PDF A</p>
            <FileDropzone accept=".pdf,application/pdf" label="PDF A" onFilesSelected={(files) => { if (files[0]) handleFileA(files[0]); }} />
            {fileA && (
              <div className="mt-2 flex items-center gap-2 rounded-lg bg-orange-50 px-3 py-2 text-sm text-orange-700">
                <span className="truncate font-medium">{fileA.name}</span>
                <button onClick={() => setFileA(null)} className="ml-auto text-orange-300 hover:text-red-400 shrink-0">×</button>
              </div>
            )}
          </div>
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">PDF B</p>
            <FileDropzone accept=".pdf,application/pdf" label="PDF B" onFilesSelected={(files) => { if (files[0]) handleFileB(files[0]); }} />
            {fileB && (
              <div className="mt-2 flex items-center gap-2 rounded-lg bg-orange-50 px-3 py-2 text-sm text-orange-700">
                <span className="truncate font-medium">{fileB.name}</span>
                <button onClick={() => setFileB(null)} className="ml-auto text-orange-300 hover:text-red-400 shrink-0">×</button>
              </div>
            )}
          </div>
        </div>

        {status === "loading" && <ProgressBar value={progress} label="Comparando metadatos…" />}

        {status === "error" && (
          <div className="rounded-xl border-l-4 border-red-400 bg-red-50 px-4 py-3 text-sm text-red-700">
            {errorMsg}
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={!fileA || !fileB || status === "loading"}
          className="w-full rounded-xl bg-orange-500 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-orange-600 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
        >
          {status === "loading" ? "Analizando…" : "Comparar metadatos"}
        </button>
      </div>

      {result && (
        <div className="mt-6 space-y-4">
          <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-sm">
            <div className={`flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-bold ${matchPct === 100 ? "bg-emerald-100 text-emerald-600" : matchPct >= 50 ? "bg-orange-100 text-orange-600" : "bg-red-100 text-red-600"}`}>
              {matchPct}%
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">
                {result.matchingFields} de {result.totalFields} campos coinciden
              </p>
              <p className="text-xs text-gray-400">
                {matchPct === 100 ? "Los metadatos son idénticos." : matchPct >= 50 ? "Hay diferencias parciales." : "Los metadatos difieren significativamente."}
              </p>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="grid grid-cols-[1fr_2fr_2fr_auto] border-b border-gray-100 bg-gray-50 px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-gray-400">
              <span>Campo</span>
              <span>PDF A</span>
              <span>PDF B</span>
              <span>Estado</span>
            </div>
            {result.fields.map((field) => (
              <div
                key={field.label}
                className="grid grid-cols-[1fr_2fr_2fr_auto] border-b border-gray-50 px-4 py-3 last:border-0 hover:bg-gray-50/50"
              >
                <span className="text-xs font-medium text-gray-600">{field.label}</span>
                <span className="truncate text-xs text-gray-700 pr-2">{field.a ?? <span className="text-gray-300 italic">—</span>}</span>
                <span className="truncate text-xs text-gray-700 pr-2">{field.b ?? <span className="text-gray-300 italic">—</span>}</span>
                <span>
                  {field.match ? (
                    <span className="inline-flex size-5 items-center justify-center rounded-full bg-emerald-100">
                      <svg className="size-3 text-emerald-600" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.75.75 0 0 1 1.06-1.06L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0z" />
                      </svg>
                    </span>
                  ) : (
                    <span className="inline-flex size-5 items-center justify-center rounded-full bg-red-100">
                      <svg className="size-3 text-red-500" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                      </svg>
                    </span>
                  )}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
