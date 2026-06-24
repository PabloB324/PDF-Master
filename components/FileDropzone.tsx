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
        "flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed p-14 cursor-pointer transition-all duration-200 bg-white",
        isDragging
          ? "border-cyan-400 bg-cyan-50/50"
          : "border-slate-200 hover:border-cyan-300 hover:bg-cyan-50/30",
      ].join(" ")}
    >
      <div className={`flex size-14 items-center justify-center rounded-full transition-colors duration-200 ${isDragging ? "bg-cyan-100 text-cyan-600" : "bg-slate-100 text-slate-400"}`}>
        <svg xmlns="http://www.w3.org/2000/svg" className="size-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" />
        </svg>
      </div>
      <div className="text-center">
        <p className="text-sm font-medium text-slate-700">
          {label ?? (multiple ? "Arrastra tus PDFs aquí" : "Arrastra un PDF aquí")}
        </p>
        <p className="mt-1 text-xs text-slate-400">o haz clic para seleccionar · PDF · Máx {MAX_FILE_SIZE_MB}MB</p>
      </div>
      <span className="rounded-full bg-[#1e3a5f] px-5 py-2 text-xs font-semibold uppercase tracking-wider text-white hover:bg-[#16304f] transition-colors">
        Seleccionar {multiple ? "archivos" : "archivo"}
      </span>
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
