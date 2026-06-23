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
        "flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-10 cursor-pointer transition-all duration-300",
        isDragging
          ? "border-blue-500 bg-blue-500/5 scale-[1.01]"
          : "border-slate-700 bg-slate-900 hover:border-slate-500 hover:bg-slate-800/50",
      ].join(" ")}
    >
      <div className={`flex size-12 items-center justify-center rounded-xl transition-colors duration-300 ${isDragging ? "bg-blue-500/20 text-blue-400" : "bg-slate-800 text-slate-500"}`}>
        <svg xmlns="http://www.w3.org/2000/svg" className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
        </svg>
      </div>
      <div className="text-center">
        <p className="text-sm font-medium text-slate-300">
          {label ?? (multiple ? "Arrastra tus PDFs aquí" : "Arrastra un PDF aquí")}
        </p>
        <p className="mt-1 text-xs text-slate-600">o haz clic para seleccionar · PDF · Máx {MAX_FILE_SIZE_MB}MB</p>
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
