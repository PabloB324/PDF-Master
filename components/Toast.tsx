"use client";

import { useEffect } from "react";

interface ToastProps {
  message: string;
  onClose: () => void;
}

export function Toast({ message, onClose }: ToastProps) {
  useEffect(() => {
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-3 rounded-xl border border-emerald-200 bg-white px-4 py-3 shadow-lg">
      <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-emerald-100">
        <svg xmlns="http://www.w3.org/2000/svg" className="size-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
        </svg>
      </div>
      <span className="text-sm font-medium text-gray-700">{message}</span>
      <button onClick={onClose} className="ml-1 text-gray-300 hover:text-gray-500 text-lg leading-none transition-colors">×</button>
    </div>
  );
}
