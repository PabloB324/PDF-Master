"use client";

import { useState, useCallback } from "react";
import { PageHeader } from "@/components/PageHeader";
import { FileDropzone } from "@/components/FileDropzone";
import { ProgressBar } from "@/components/ProgressBar";
import { ToolLayout } from "@/components/ToolLayout";
import type { AnalyzeIntegrityResult } from "@/types/api";

const STATUS_CONFIG = {
  ok: { bg: "bg-emerald-100", text: "text-emerald-700", label: "OK" },
  warn: { bg: "bg-yellow-100", text: "text-yellow-700", label: "Aviso" },
  fail: { bg: "bg-red-100", text: "text-red-600", label: "Error" },
} as const;

const STEPS = [
  { title: "Sube el PDF", description: "Selecciona el documento que deseas analizar." },
  { title: "Inicia el análisis", description: "Haz clic en 'Analizar integridad' para revisar la estructura interna del PDF." },
  { title: "Revisa el reporte", description: "Se mostrarán un score general y verificaciones individuales en estado OK / Aviso / Error." },
];

function ScoreRing({ score }: { score: number }) {
  const color = score >= 80 ? "text-emerald-500" : score >= 50 ? "text-yellow-500" : "text-red-500";
  const ringColor = score >= 80 ? "stroke-emerald-500" : score >= 50 ? "stroke-yellow-500" : "stroke-red-500";
  const circumference = 2 * Math.PI * 30;
  const dashOffset = circumference - (score / 100) * circumference;
  return (
    <div className="relative flex items-center justify-center">
      <svg className="size-20 -rotate-90" viewBox="0 0 80 80">
        <circle cx="40" cy="40" r="30" fill="none" stroke="#f3f4f6" strokeWidth="8" />
        <circle
          cx="40" cy="40" r="30" fill="none"
          className={ringColor}
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.6s ease" }}
        />
      </svg>
      <span className={`absolute text-lg font-bold ${color}`}>{score}</span>
    </div>
  );
}

export default function AnalyzeIntegrityPage() {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "done">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [result, setResult] = useState<AnalyzeIntegrityResult | null>(null);

  const handleFile = useCallback((f: File) => setFile(f), []);

  async function handleSubmit() {
    if (!file) return;
    setStatus("loading");
    setProgress(30);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      setProgress(60);

      const res = await fetch("/api/analyze-integrity", { method: "POST", body: formData });
      setProgress(90);

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Error al analizar el PDF.");
      }

      const data: AnalyzeIntegrityResult = await res.json();
      setProgress(100);
      setResult(data);
      setStatus("done");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Error inesperado.");
      setStatus("error");
      setProgress(0);
    }
  }

  const scoreLabel = result
    ? result.score >= 80 ? "Archivo íntegro" : result.score >= 50 ? "Posibles anomalías" : "Integridad comprometida"
    : "";

  return (
    <ToolLayout steps={STEPS} note="Un score bajo no implica necesariamente manipulación maliciosa, pero señala anomalías estructurales que merecen atención.">
      <PageHeader
        title="Analizar integridad"
        description="Analiza la estructura del PDF y detecta posibles anomalías o signos de manipulación."
      />

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-5">
        <FileDropzone
          accept=".pdf,application/pdf"
          label="Arrastra tu PDF aquí, o"
          onFilesSelected={(files) => { if (files[0]) handleFile(files[0]); }}
        />

        {file && (
          <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-orange-100">
                <svg className="size-3.5 text-orange-500" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.75.75 0 0 1 1.06-1.06L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0z" />
                </svg>
              </div>
              <span className="truncate text-sm font-medium text-gray-700">{file.name}</span>
            </div>
            <button
              onClick={() => { setFile(null); setStatus("idle"); setResult(null); }}
              className="ml-3 shrink-0 text-gray-300 hover:text-red-400 transition-colors"
            >
              <svg className="size-4" viewBox="0 0 16 16" fill="currentColor">
                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
              </svg>
            </button>
          </div>
        )}

        {status === "loading" && <ProgressBar value={progress} label="Analizando estructura…" />}

        {status === "error" && (
          <div className="rounded-xl border-l-4 border-red-400 bg-red-50 px-4 py-3 text-sm text-red-700">
            {errorMsg}
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={!file || status === "loading"}
          className="w-full rounded-xl bg-orange-500 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-orange-600 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
        >
          {status === "loading" ? "Analizando…" : "Analizar integridad"}
        </button>
      </div>

      {result && (
        <div className="mt-6 space-y-4">
          <div className="flex items-center gap-5 rounded-2xl border border-gray-200 bg-white px-6 py-5 shadow-sm">
            <ScoreRing score={result.score} />
            <div>
              <p className="text-base font-bold text-gray-800">{scoreLabel}</p>
              <p className="text-sm text-gray-400">{result.pageCount} página(s) · {(result.fileSize / 1024).toFixed(1)} KB</p>
              <p className="mt-1 text-xs text-gray-400">
                {result.checks.filter((c) => c.status === "ok").length} verificaciones OK ·{" "}
                {result.checks.filter((c) => c.status === "warn").length} avisos ·{" "}
                {result.checks.filter((c) => c.status === "fail").length} errores
              </p>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm divide-y divide-gray-50">
            {result.checks.map((check) => {
              const cfg = STATUS_CONFIG[check.status];
              return (
                <div key={check.label} className="flex items-start gap-4 px-5 py-3.5 hover:bg-gray-50/50">
                  <span className={`mt-0.5 shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ${cfg.bg} ${cfg.text}`}>
                    {cfg.label}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-700">{check.label}</p>
                    {check.detail && <p className="text-xs text-gray-400">{check.detail}</p>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
