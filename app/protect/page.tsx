"use client";

import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { FileDropzone } from "@/components/FileDropzone";
import { ProgressBar } from "@/components/ProgressBar";
import { StatusMessage } from "@/components/StatusMessage";
import { DownloadButton } from "@/components/DownloadButton";

export default function ProtectPage() {
  const [file, setFile] = useState<File | null>(null);
  const [userPassword, setUserPassword] = useState("");
  const [ownerPassword, setOwnerPassword] = useState("");
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) { setErrorMsg("Selecciona un PDF."); setStatus("error"); return; }
    if (!userPassword) { setErrorMsg("La contraseña de usuario es obligatoria."); setStatus("error"); return; }

    setStatus("loading");
    setProgress(20);
    setResultBlob(null);

    const form = new FormData();
    form.append("file", file);
    form.append("userPassword", userPassword);
    if (ownerPassword) form.append("ownerPassword", ownerPassword);

    try {
      setProgress(50);
      const res = await fetch("/api/protect", { method: "POST", body: form });
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
      <PageHeader title="Proteger PDF" description="Cifra un PDF con contraseña para restringir su acceso." />

      <form onSubmit={handleSubmit} className="space-y-6">
        <FileDropzone onFilesSelected={([f]) => setFile(f)} />
        {file && <p className="text-sm text-slate-600">Archivo: <strong>{file.name}</strong></p>}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Contraseña de usuario <span className="text-red-500">*</span>
            </label>
            <input type="password" value={userPassword} onChange={(e) => setUserPassword(e.target.value)} placeholder="Contraseña para abrir el PDF" className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Contraseña de propietario <span className="text-slate-400 font-normal">(opcional)</span>
            </label>
            <input type="password" value={ownerPassword} onChange={(e) => setOwnerPassword(e.target.value)} placeholder="Para editar permisos del PDF" className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
          </div>
        </div>

        {status === "loading" && <ProgressBar value={progress} label="Protegiendo PDF..." />}
        {status === "error" && <StatusMessage status="error" message={errorMsg} />}
        {status === "success" && <StatusMessage status="success" message="¡PDF protegido con contraseña correctamente!" />}

        <div className="flex items-center gap-4">
          <button type="submit" disabled={status === "loading"} className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
            Proteger
          </button>
          <DownloadButton blob={resultBlob} filename="protected.pdf" />
        </div>
      </form>
    </main>
  );
}
