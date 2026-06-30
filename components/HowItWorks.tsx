interface Step {
  title: string;
  description: string;
}

interface HowItWorksProps {
  steps: Step[];
  note?: string;
}

export function HowItWorks({ steps, note }: HowItWorksProps) {
  return (
    <aside className="space-y-4">
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-sm font-semibold text-gray-800">¿Cómo funciona?</h2>
        <ol className="space-y-4">
          {steps.map((step, i) => (
            <li key={i} className="flex gap-3">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-orange-500 text-xs font-bold text-white">
                {i + 1}
              </span>
              <div>
                <p className="text-sm font-semibold text-gray-700">{step.title}</p>
                <p className="mt-0.5 text-xs text-gray-400 leading-relaxed">{step.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      {note && (
        <div className="rounded-2xl border border-orange-100 bg-orange-50 p-4 flex gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="size-4 text-orange-500 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="currentColor">
            <path fillRule="evenodd" d="M12.516 2.17a.75.75 0 0 0-1.032 0 11.209 11.209 0 0 1-7.877 3.08.75.75 0 0 0-.722.515A12.74 12.74 0 0 0 2.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.749.749 0 0 0 .374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 0 0-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.734-3.08Zm3.094 8.016a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
          </svg>
          <p className="text-xs text-orange-700 leading-relaxed">{note}</p>
        </div>
      )}
    </aside>
  );
}
