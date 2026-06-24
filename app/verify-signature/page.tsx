"use client";

import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { FileDropzone } from "@/components/FileDropzone";
import { ProgressBar } from "@/components/ProgressBar";
import { StatusMessage } from "@/components/StatusMessage";
import type { VerifySignatureResult } from "@/types/api";

const btnPrimary = "rounded-lg bg-[#1e3a5f] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#16304f] disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-200";

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
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Error inesperado.");
      setStatus("error"); setProgress(0);
    }
  };

  return (
    <main className="max-w-2xl">
      <PageHeader title="Verificar firma digital" description="Detecta campos de firma digital en un PDF." />
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="rounded-2xl bg-white p-6 shadow-sm space-y-4">
          <FileDropzone onFilesSelected={([f]) => setFile(f)} />
          {file && <p className="text-sm text-slate-500">Seleccionado: <span className="font-medium text-slate-700">{file.name}</span></p>}
        </div>

        {status === "loading" && <ProgressBar value={progress} label="Analizando firmas..." />}
        {status === "error" && <StatusMessage status="error" message={errorMsg} />}

        {status === "success" && result && (
          <div className="space-y-3">
            <StatusMessage
              status={result.hasDSS ? "info" : "success"}
              message={result.hasDSS ? `Se encontraron ${result.signatures.length} campo(s) de firma digital.` : "Este PDF no contiene campos de firma digital."}
            />
            {result.warning && <StatusMessage status="info" message={result.warning} />}
            {result.signatures.length > 0 && (
              <ul className="space-y-2">
                {result.signatures.map((sig, i) => (
                  <li key={i} className="rounded-xl border border-slate-200 bg-white p-4 text-sm space-y-2 shadow-sm">
                    <div className="flex items-center gap-2">
                      <span className="size-2 rounded-full bg-cyan-400 shrink-0" />
                      <span className="font-semibold text-[#1e3a5f]">{sig.fieldName}</span>
                    </div>
                    {sig.subFilter && <p className="text-slate-400 text-xs">Formato: <span className="text-slate-600 font-mono">{sig.subFilter}</span></p>}
                    {sig.reason && <p className="text-slate-400 text-xs">Motivo: <span className="text-slate-600">{sig.reason}</span></p>}
                    {sig.location && <p className="text-slate-400 text-xs">Ubicación: <span className="text-slate-600">{sig.location}</span></p>}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        <button type="submit" disabled={status === "loading"} className={btnPrimary}>Verificar</button>
      </form>
    </main>
  );
}
