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
        "flex flex-col items-center rounded-xl border-2 border-dashed py-10 px-8 cursor-pointer transition-all duration-200",
        isDragging
          ? "border-orange-400 bg-orange-50"
          : "border-gray-200 bg-white hover:border-orange-300 hover:bg-orange-50/30",
      ].join(" ")}
    >
      <div className={`mb-4 flex size-14 items-center justify-center rounded-full transition-colors duration-200 ${isDragging ? "bg-orange-100" : "bg-orange-50"}`}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="size-7 text-orange-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m6.75 12-3-3m0 0-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
        </svg>
      </div>

      <p className="text-sm text-gray-500 mb-4">
        {label ?? "Arrastra y suelta aquí, o"}
      </p>

      <span className="rounded-full bg-orange-400 px-8 py-2.5 text-sm font-semibold text-white hover:bg-orange-500 transition-colors">
        Seleccione {multiple ? "archivos" : "un archivo"}
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
