"use client";

import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { FileDropzone } from "@/components/FileDropzone";
import { ProgressBar } from "@/components/ProgressBar";
import { StatusMessage } from "@/components/StatusMessage";
import type { VerifyMetadataResult } from "@/types/api";

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

interface MetaRowProps {
  label: string;
  value: string | number | boolean | undefined;
}

function MetaRow({ label, value }: MetaRowProps) {
  if (value === undefined || value === null) return null;
  const display = typeof value === "boolean" ? (value ? "Sí" : "No") : String(value);
  return (
    <div className="flex gap-4 border-b border-slate-100 py-2.5 text-sm last:border-0">
      <span className="w-44 shrink-0 font-medium text-slate-600">{label}</span>
      <span className="text-slate-800 break-all">{display}</span>
    </div>
  );
}

export default function VerifyMetadataPage() {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [result, setResult] = useState<VerifyMetadataResult | null>(null);

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
      const res = await fetch("/api/verify-metadata", { method: "POST", body: form });
      setProgress(90);

      if (!res.ok) {
        const data = await res.json() as { error: string };
        throw new Error(data.error);
      }

      setResult(await res.json() as VerifyMetadataResult);
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
      <PageHeader title="Ver metadata" description="Inspecciona la información interna de un PDF." />

      <form onSubmit={handleSubmit} className="space-y-6">
        <FileDropzone onFilesSelected={([f]) => setFile(f)} />
        {file && <p className="text-sm text-slate-600">Archivo: <strong>{file.name}</strong></p>}

        {status === "loading" && <ProgressBar value={progress} label="Leyendo metadata..." />}
        {status === "error" && <StatusMessage status="error" message={errorMsg} />}

        {status === "success" && result && (
          <div className="rounded-xl border border-slate-200 bg-white px-6 py-2">
            <MetaRow label="Páginas" value={result.pageCount} />
            <MetaRow label="Tamaño" value={formatBytes(result.fileSize)} />
            <MetaRow label="Versión PDF" value={result.pdfVersion} />
            <MetaRow label="Cifrado" value={result.isEncrypted} />
            <MetaRow label="Tagged (accesible)" value={result.isTagged} />
            <MetaRow label="Título" value={result.title} />
            <MetaRow label="Autor" value={result.author} />
            <MetaRow label="Asunto" value={result.subject} />
            <MetaRow label="Palabras clave" value={result.keywords} />
            <MetaRow label="Creador" value={result.creator} />
            <MetaRow label="Productor" value={result.producer} />
            <MetaRow label="Fecha de creación" value={result.creationDate} />
            <MetaRow label="Última modificación" value={result.modificationDate} />
          </div>
        )}

        <button type="submit" disabled={status === "loading"} className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
          Analizar
        </button>
      </form>
    </main>
  );
}
