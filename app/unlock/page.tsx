"use client";

import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { FileDropzone } from "@/components/FileDropzone";
import { ProgressBar } from "@/components/ProgressBar";
import { StatusMessage } from "@/components/StatusMessage";
import { DownloadButton } from "@/components/DownloadButton";

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

    setStatus("loading");
    setProgress(20);
    setResultBlob(null);

    const form = new FormData();
    form.append("file", file);
    form.append("password", password);

    try {
      setProgress(50);
      const res = await fetch("/api/unlock", { method: "POST", body: form });
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
      <PageHeader title="Desbloquear PDF" description="Elimina la protección de contraseña de un PDF cifrado." />

      <form onSubmit={handleSubmit} className="space-y-6">
        <FileDropzone onFilesSelected={([f]) => setFile(f)} />
        {file && <p className="text-sm text-slate-600">Archivo: <strong>{file.name}</strong></p>}

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Contraseña del PDF</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Contraseña actual" className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
        </div>

        {status === "loading" && <ProgressBar value={progress} label="Desbloqueando PDF..." />}
        {status === "error" && <StatusMessage status="error" message={errorMsg} />}
        {status === "success" && <StatusMessage status="success" message="¡PDF desbloqueado correctamente!" />}

        <div className="flex items-center gap-4">
          <button type="submit" disabled={status === "loading"} className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
            Desbloquear
          </button>
          <DownloadButton blob={resultBlob} filename="unlocked.pdf" />
        </div>
      </form>
    </main>
  );
}
