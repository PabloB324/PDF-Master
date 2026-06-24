interface BreadcrumbProps {
  current: string;
}

export function Breadcrumb({ current }: BreadcrumbProps) {
  return (
    <nav aria-label="Migas de pan" className="flex items-center gap-1.5 text-sm text-slate-400">
      <span className="hover:text-slate-600 transition-colors cursor-default">Inicio</span>
      <svg xmlns="http://www.w3.org/2000/svg" className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
      </svg>
      <span className="font-medium text-slate-600">{current}</span>
    </nav>
  );
}
