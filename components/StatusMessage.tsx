"use client";

type Status = "success" | "error" | "info";

interface StatusMessageProps {
  status: Status;
  message: string;
}

const STYLES: Record<Status, string> = {
  success: "bg-green-50 border-green-300 text-green-800",
  error: "bg-red-50 border-red-300 text-red-800",
  info: "bg-blue-50 border-blue-300 text-blue-800",
};

export function StatusMessage({ status, message }: StatusMessageProps) {
  return (
    <div
      role="alert"
      className={`rounded-lg border px-4 py-3 text-sm ${STYLES[status]}`}
    >
      {message}
    </div>
  );
}
