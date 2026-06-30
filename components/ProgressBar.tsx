"use client";

interface ProgressBarProps {
  value: number;
  label?: string;
}

export function ProgressBar({ value, label }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div className="w-full space-y-2">
      {label && (
        <p className="text-sm font-medium text-orange-500">{label}</p>
      )}
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
        <div
          role="progressbar"
          aria-valuenow={clamped}
          aria-valuemin={0}
          aria-valuemax={100}
          style={{ width: `${clamped}%` }}
          className="h-full rounded-full bg-orange-500 transition-all duration-500"
        />
      </div>
    </div>
  );
}
