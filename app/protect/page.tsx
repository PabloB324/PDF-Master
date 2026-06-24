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
  { title: "Sube tu PDF", description: "Arrastra o selecciona el archivo PDF que deseas proteger." },
  { title: "Define una contraseña", description: "La contraseña de usuario es obligatoria. La de propietario restringe la edición." },
  { title: "Descarga el PDF cifrado", description: "Obtén tu PDF protegido con cifrado AES." },
];

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
    setStatus("loading"); setProgress(20); setResultBlob(null);
    const form = new FormData();
    form.append("file", file);
    form.append("userPassword", userPassword);
    if (ownerPassword) form.append("ownerPassword", ownerPassword);
    try {
      setProgress(50);
      const res = await fetch("/api/protect", { method: "POST", body: form });
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
    <ToolLayout breadcrumb="Proteger PDF" steps={STEPS} note="Las contraseñas no se almacenan. El cifrado ocurre en el servidor y el archivo se descarta inmediatamente.">
      <PageHeader title="Proteger PDF" description="Cifra un PDF con contraseña para restringir su acceso." />
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="rounded-2xl bg-white p-6 shadow-sm space-y-4">
          <FileDropzone onFilesSelected={([f]) => setFile(f)} />
          {file && <p className="text-sm text-slate-500">Seleccionado: <span className="font-medium text-slate-700">{file.name}</span></p>}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Contraseña de usuario <span className="text-red-400">*</span></label>
            <input type="password" value={userPassword} onChange={(e) => setUserPassword(e.target.value)} placeholder="Contraseña para abrir el PDF" className={inputCls} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Contraseña de propietario <span className="text-slate-400 font-normal">(opcional)</span></label>
            <input type="password" value={ownerPassword} onChange={(e) => setOwnerPassword(e.target.value)} placeholder="Para editar permisos del PDF" className={inputCls} />
          </div>
        </div>
        {status === "loading" && <ProgressBar value={progress} label="Protegiendo PDF..." />}
        {status === "error" && <StatusMessage status="error" message={errorMsg} />}
        {status === "success" && <StatusMessage status="success" message="¡PDF protegido con contraseña!" />}
        <div className="flex items-center gap-3">
          <button type="submit" disabled={status === "loading"} className={btnPrimary}>Proteger</button>
          <DownloadButton blob={resultBlob} filename="protected.pdf" />
        </div>
      </form>
    </ToolLayout>
  );
}
