"use client";

import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { FileDropzone } from "@/components/FileDropzone";
import { ProgressBar } from "@/components/ProgressBar";
import { StatusMessage } from "@/components/StatusMessage";
import { Toast } from "@/components/Toast";

const btnSubmit = "w-full rounded-xl bg-orange-500 py-3 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-200";
const inputCls = "w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400/20 transition-colors";

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

export default function ProtectPage() {
  const [file, setFile] = useState<File | null>(null);
  const [userPassword, setUserPassword] = useState("");
  const [ownerPassword, setOwnerPassword] = useState("");
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [showToast, setShowToast] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) { setErrorMsg("Selecciona un PDF."); setStatus("error"); return; }
    if (!userPassword) { setErrorMsg("La contraseña de usuario es obligatoria."); setStatus("error"); return; }
    setStatus("loading"); setProgress(20);
    const form = new FormData();
    form.append("file", file); form.append("userPassword", userPassword);
    if (ownerPassword) form.append("ownerPassword", ownerPassword);
    try {
      setProgress(50);
      const res = await fetch("/api/protect", { method: "POST", body: form });
      setProgress(90);
      if (!res.ok) { const d = await res.json() as { error: string }; throw new Error(d.error); }
      triggerDownload(await res.blob(), "protected.pdf");
      setProgress(100); setStatus("idle"); setShowToast(true);
    } catch (err) { setErrorMsg(err instanceof Error ? err.message : "Error inesperado."); setStatus("error"); setProgress(0); }
  };

  return (
    <>
      {showToast && <Toast message="PDF protegido correctamente" onClose={() => setShowToast(false)} />}
      <div className="max-w-2xl">
        <PageHeader title="Proteger PDF" description="Cifra el documento con una contraseña." />
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Contraseña de usuario <span className="text-red-400">*</span></label>
              <input type="password" value={userPassword} onChange={(e) => setUserPassword(e.target.value)} placeholder="Contraseña para abrir el PDF" className={inputCls} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Contraseña de propietario <span className="text-gray-400 font-normal">(opcional)</span></label>
              <input type="password" value={ownerPassword} onChange={(e) => setOwnerPassword(e.target.value)} placeholder="Para editar permisos del PDF" className={inputCls} />
            </div>
          </div>
          <StatusMessage status="info" message="El PDF resultante estará cifrado con AES. Guarda la contraseña, no hay forma de recuperarla." />
          {status === "error" && <StatusMessage status="error" message={errorMsg} />}
          {status === "loading" && <ProgressBar value={progress} label="Procesando tu documento..." />}
          <button type="submit" disabled={status === "loading"} className={btnSubmit}>
            {status === "loading" ? "Procesando..." : "Procesar y descargar"}
          </button>
        </form>
      </div>
    </>
  );
}
