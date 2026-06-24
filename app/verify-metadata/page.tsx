"use client";

import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { FileDropzone } from "@/components/FileDropzone";
import { ProgressBar } from "@/components/ProgressBar";
import { StatusMessage } from "@/components/StatusMessage";
import { ToolLayout } from "@/components/ToolLayout";
import type { VerifyMetadataResult } from "@/types/api";

const btnPrimary = "rounded-lg bg-[#1e3a5f] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#16304f] disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-200";

const STEPS = [
  { title: "Sube tu PDF", description: "Arrastra o selecciona el archivo PDF que deseas inspeccionar." },
  { title: "Análisis automático", description: "El sistema extrae la información interna del documento." },
  { title: "Revisa la metadata", description: "Verás título, autor, fechas, versión PDF, cifrado y más." },
];

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

interface MetaRowProps { label: string; value: string | number | boolean | undefined; }

function MetaRow({ label, value }: MetaRowProps) {
  if (value === undefined || value === null) return null;
  const display = typeof value === "boolean" ? (value ? "Sí" : "No") : String(value);
  return (
    <div className="flex gap-4 border-b border-slate-100 py-3 text-sm last:border-0">
      <span className="w-44 shrink-0 text-slate-500">{label}</span>
      <span className="text-slate-700 break-all font-mono text-xs leading-relaxed">{display}</span>
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
    setStatus("loading"); setProgress(30); setResult(null);
    const form = new FormData();
    form.append("file", file);
    try {
      setProgress(60);
      const res = await fetch("/api/verify-metadata", { method: "POST", body: form });
      setProgress(90);
      if (!res.ok) { const d = await res.json() as { error: string }; throw new Error(d.error); }
      setResult(await res.json() as VerifyMetadataResult);
      setStatus("success"); setProgress(100);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Error inesperado.");
      setStatus("error"); setProgress(0);
    }
  };

  return (
    <ToolLayout breadcrumb="Metadata" steps={STEPS}>
      <PageHeader title="Ver metadata" description="Inspecciona la información interna de un PDF." />
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <FileDropzone onFilesSelected={([f]) => setFile(f)} />
          {file && <p className="mt-3 text-sm text-slate-500">Seleccionado: <span className="font-medium text-slate-700">{file.name}</span></p>}
        </div>
        {status === "loading" && <ProgressBar value={progress} label="Leyendo metadata..." />}
        {status === "error" && <StatusMessage status="error" message={errorMsg} />}
        {status === "success" && result && (
          <div className="rounded-2xl border border-slate-200 bg-white px-5 py-1 shadow-sm">
            <MetaRow label="Páginas" value={result.pageCount} />
            <MetaRow label="Tamaño" value={formatBytes(result.fileSize)} />
            <MetaRow label="Versión PDF" value={result.pdfVersion} />
            <MetaRow label="Cifrado" value={result.isEncrypted} />
            <MetaRow label="Tagged" value={result.isTagged} />
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
        <button type="submit" disabled={status === "loading"} className={btnPrimary}>Analizar</button>
      </form>
    </ToolLayout>
  );
}
