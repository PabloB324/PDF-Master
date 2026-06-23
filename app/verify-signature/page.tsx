"use client";

import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { FileDropzone } from "@/components/FileDropzone";
import { ProgressBar } from "@/components/ProgressBar";
import { StatusMessage } from "@/components/StatusMessage";
import type { VerifySignatureResult } from "@/types/api";

export default function VerifySignaturePage() {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [result, setResult] = useState<VerifySignatureResult | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) { setErrorMsg("Selecciona un PDF."); setStatus("error"); return; }

    setStatus("loading");
    setProgress(30);
    setResult(null);

    const form = new FormData();
    form.append("file", file);

    try {
      setProgress(60);
      const res = await fetch("/api/verify-signature", { method: "POST", body: form });
      setProgress(90);

      if (!res.ok) {
        const data = await res.json() as { error: string };
        throw new Error(data.error);
      }

      setResult(await res.json() as VerifySignatureResult);
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
      <PageHeader title="Verificar firma digital" description="Detecta campos de firma digital en un PDF." />

      <form onSubmit={handleSubmit} className="space-y-6">
        <FileDropzone onFilesSelected={([f]) => setFile(f)} />
        {file && <p className="text-sm text-slate-600">Archivo: <strong>{file.name}</strong></p>}

        {status === "loading" && <ProgressBar value={progress} label="Analizando firmas..." />}
        {status === "error" && <StatusMessage status="error" message={errorMsg} />}

        {status === "success" && result && (
          <div className="space-y-4">
            <StatusMessage
              status={result.hasDSS ? "info" : "success"}
              message={result.hasDSS ? `Se encontraron ${result.signatures.length} campo(s) de firma.` : "Este PDF no contiene campos de firma digital."}
            />
            {result.warning && <StatusMessage status="info" message={result.warning} />}
            {result.signatures.length > 0 && (
              <ul className="space-y-2">
                {result.signatures.map((sig, i) => (
                  <li key={i} className="rounded-lg border border-slate-200 bg-white p-4 text-sm space-y-1">
                    <p><span className="font-medium text-slate-700">Campo:</span> {sig.fieldName}</p>
                    {sig.subFilter && <p><span className="font-medium text-slate-700">Formato:</span> {sig.subFilter}</p>}
                    {sig.reason && <p><span className="font-medium text-slate-700">Motivo:</span> {sig.reason}</p>}
                    {sig.location && <p><span className="font-medium text-slate-700">Ubicación:</span> {sig.location}</p>}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        <button type="submit" disabled={status === "loading"} className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
          Verificar
        </button>
      </form>
    </main>
  );
}
