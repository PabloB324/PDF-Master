"use client";

import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { FileDropzone } from "@/components/FileDropzone";
import { ProgressBar } from "@/components/ProgressBar";
import { StatusMessage } from "@/components/StatusMessage";
import { DownloadButton } from "@/components/DownloadButton";
import { ToolLayout } from "@/components/ToolLayout";

const btnPrimary = "rounded-lg bg-[#1e3a5f] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#16304f] disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-200";
const inputCls = "w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 transition-colors";

const STEPS = [
  { title: "Sube tu PDF protegido", description: "Arrastra o selecciona el archivo PDF que tiene contraseña." },
  { title: "Ingresa la contraseña", description: "Escribe la contraseña actual del PDF para desbloquearlo." },
  { title: "Descarga sin contraseña", description: "Obtén el mismo PDF sin restricciones de acceso." },
];

export default function UnlockPage() {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) { setErrorMsg("Selecciona un PDF."); setStatus("error"); return; }
    if (!password) { setErrorMsg("Ingresa la contraseña del PDF."); setStatus("error"); return; }
    setStatus("loading"); setProgress(20); setResultBlob(null);
    const form = new FormData();
    form.append("file", file);
    form.append("password", password);
    try {
      setProgress(50);
      const res = await fetch("/api/unlock", { method: "POST", body: form });
      setProgress(90);
      if (!res.ok) { const d = await res.json() as { error: string }; throw new Error(d.error); }
      setResultBlob(await res.blob());
      setStatus("success"); setProgress(100);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Error inesperado.");
      setStatus("error"); setProgress(0);
    }
  };

  return (
    <ToolLayout breadcrumb="Desbloquear PDF" steps={STEPS}>
      <PageHeader title="Desbloquear PDF" description="Elimina la protección de contraseña de un PDF cifrado." />
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="rounded-2xl bg-white p-6 shadow-sm space-y-4">
          <FileDropzone onFilesSelected={([f]) => setFile(f)} />
          {file && <p className="text-sm text-slate-500">Seleccionado: <span className="font-medium text-slate-700">{file.name}</span></p>}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Contraseña del PDF</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Contraseña actual" className={inputCls} />
          </div>
        </div>
        {status === "loading" && <ProgressBar value={progress} label="Desbloqueando PDF..." />}
        {status === "error" && <StatusMessage status="error" message={errorMsg} />}
        {status === "success" && <StatusMessage status="success" message="¡PDF desbloqueado correctamente!" />}
        <div className="flex items-center gap-3">
          <button type="submit" disabled={status === "loading"} className={btnPrimary}>Desbloquear</button>
          <DownloadButton blob={resultBlob} filename="unlocked.pdf" />
        </div>
      </form>
    </ToolLayout>
  );
}
