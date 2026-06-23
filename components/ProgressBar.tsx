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
        <div className="flex justify-between text-xs text-slate-500">
          <span>{label}</span>
          <span className="font-mono text-slate-400">{clamped}%</span>
        </div>
      )}
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
        <div
          role="progressbar"
          aria-valuenow={clamped}
          aria-valuemin={0}
          aria-valuemax={100}
          style={{ width: `${clamped}%` }}
          className="h-full rounded-full bg-gradient-to-r from-blue-500 to-violet-500 transition-all duration-500"
        />
      </div>
    </div>
  );
}
