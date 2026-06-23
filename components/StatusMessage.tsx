"use client";

type Status = "success" | "error" | "info";

interface StatusMessageProps {
  status: Status;
  message: string;
}

const STYLES: Record<Status, string> = {
  success: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  error:   "border-red-500/30 bg-red-500/10 text-red-300",
  info:    "border-blue-500/30 bg-blue-500/10 text-blue-300",
};

const ICONS: Record<Status, React.ReactNode> = {
  success: (
    <svg xmlns="http://www.w3.org/2000/svg" className="size-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  ),
  error: (
    <svg xmlns="http://www.w3.org/2000/svg" className="size-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
    </svg>
  ),
  info: (
    <svg xmlns="http://www.w3.org/2000/svg" className="size-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
    </svg>
  ),
};

export function StatusMessage({ status, message }: StatusMessageProps) {
  return (
    <div
      role="alert"
      className={`flex items-start gap-2.5 rounded-lg border px-4 py-3 text-sm ${STYLES[status]}`}
    >
      {ICONS[status]}
      <span>{message}</span>
    </div>
  );
}
