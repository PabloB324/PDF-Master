"use client";

import { useCallback, useId, useState } from "react";
import { MAX_FILE_SIZE_MB } from "@/lib/constants";

interface FileDropzoneProps {
  onFilesSelected: (files: File[]) => void;
  multiple?: boolean;
  label?: string;
  accept?: string;
}

export function FileDropzone({
  onFilesSelected,
  multiple = false,
  label,
  accept = ".pdf,application/pdf",
}: FileDropzoneProps) {
  const inputId = useId();
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = useCallback(
    (incoming: FileList | null) => {
      if (!incoming) return;
      const files = Array.from(incoming).filter(
        (f) => f.type === "application/pdf" && f.size <= MAX_FILE_SIZE_MB * 1024 * 1024
      );
      if (files.length > 0) onFilesSelected(files);
    },
    [onFilesSelected]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLLabelElement>) => {
      e.preventDefault();
      setIsDragging(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  return (
    <label
      htmlFor={inputId}
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={[
        "flex flex-col items-center rounded-2xl border-2 border-dashed py-10 px-8 cursor-pointer transition-all duration-200",
        isDragging
          ? "border-cyan-400 bg-cyan-50/60"
          : "border-slate-200 bg-slate-50/50 hover:border-cyan-300 hover:bg-cyan-50/30",
      ].join(" ")}
    >
      {/* Illustration */}
      <div className={`relative mb-6 transition-transform duration-200 ${isDragging ? "scale-110" : ""}`}>
        <div className={`flex size-20 items-center justify-center rounded-2xl transition-colors duration-200 ${isDragging ? "bg-cyan-100" : "bg-white shadow-md shadow-slate-200"}`}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`size-10 transition-colors duration-200 ${isDragging ? "text-cyan-500" : "text-[#1e3a5f]"}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m6.75 12-3-3m0 0-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
          </svg>
        </div>
        <span className="absolute -top-1 -right-1 size-3 rounded-full bg-cyan-400 opacity-80" />
        <span className="absolute -bottom-1 -left-1.5 size-2 rounded-full bg-[#1e3a5f] opacity-40" />
      </div>

      <p className="text-base font-semibold text-slate-700 text-center">
        {label ?? (multiple ? "Arrastra tus PDFs aquí" : "Arrastra un PDF aquí")}
      </p>
      <p className="mt-1 text-sm text-slate-400">o haz clic para seleccionar</p>
      <p className="mt-0.5 text-xs text-slate-300">PDF · Máx. {MAX_FILE_SIZE_MB}MB</p>

      <div className={`mt-7 w-full max-w-xs rounded-xl px-5 py-3 text-sm font-semibold text-white text-center flex items-center justify-center gap-2 transition-colors duration-200 ${isDragging ? "bg-cyan-500" : "bg-[#1e3a5f] hover:bg-[#16304f]"}`}>
        <svg xmlns="http://www.w3.org/2000/svg" className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
        </svg>
        Seleccionar {multiple ? "archivos" : "archivo"}
      </div>

      <input
        id={inputId}
        type="file"
        accept={accept}
        multiple={multiple}
        className="sr-only"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </label>
  );
}
