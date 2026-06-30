"use client";

import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { FileDropzone } from "@/components/FileDropzone";
import { ProgressBar } from "@/components/ProgressBar";
import { StatusMessage } from "@/components/StatusMessage";
import type { VerifySignatureResult } from "@/types/api";

const btnSubmit = "w-full rounded-xl bg-orange-500 py-3 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-200";

export default function VerifySignaturePage() {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [result, setResult] = useState<VerifySignatureResult | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) { setErrorMsg("Selecciona un PDF."); setStatus("error"); return; }
    setStatus("loading"); setProgress(30); setResult(null);
    const form = new FormData();
    form.append("file", file);
    try {
      setProgress(60);
      const res = await fetch("/api/verify-signature", { method: "POST", body: form });
      setProgress(90);
      if (!res.ok) { const d = await res.json() as { error: string }; throw new Error(d.error); }
      setResult(await res.json() as VerifySignatureResult);
      setStatus("success"); setProgress(100);
    } catch (err) { setErrorMsg(err instanceof Error ? err.message : "Error inesperado."); setStatus("error"); setProgress(0); }
  };

  return (
    <div className="max-w-2xl">
      <PageHeader title="Verificar firma digital" description="Detecta campos de firma digital en un PDF." />
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="rounded-2xl bg-white p-6 shadow-sm space-y-4">
          <p className="text-sm font-medium text-gray-700">Documento PDF</p>
          <FileDropzone onFilesSelected={([f]) => setFile(f)} />
          <p className="text-xs text-gray-400">Solo archivos PDF · Máx. 50MB</p>
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
        </div>
        {status === "error" && <StatusMessage status="error" message={errorMsg} />}
        {status === "loading" && <ProgressBar value={progress} label="Analizando firmas..." />}
        {status === "success" && result && (
          <div className="space-y-3">
            <StatusMessage
              status={result.hasDSS ? "info" : "success"}
              message={result.hasDSS ? `Se encontraron ${result.signatures.length} campo(s) de firma digital.` : "Este PDF no contiene campos de firma digital."}
            />
            {result.warning && <StatusMessage status="info" message={result.warning} />}
            {result.signatures.map((sig, i) => (
              <div key={i} className="rounded-xl border border-gray-200 bg-white p-4 text-sm shadow-sm space-y-2">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-orange-400 shrink-0" />
                  <span className="font-semibold text-gray-800">{sig.fieldName}</span>
                </div>
                {sig.subFilter && <p className="text-gray-400 text-xs">Formato: <span className="text-gray-600 font-mono">{sig.subFilter}</span></p>}
                {sig.reason && <p className="text-gray-400 text-xs">Motivo: <span className="text-gray-600">{sig.reason}</span></p>}
                {sig.location && <p className="text-gray-400 text-xs">Ubicación: <span className="text-gray-600">{sig.location}</span></p>}
              </div>
            ))}
          </div>
        )}
        <button type="submit" disabled={status === "loading"} className={btnSubmit}>
          {status === "loading" ? "Analizando..." : "Verificar firma"}
        </button>
      </form>
    </div>
  );
}
