import Link from "next/link";

interface PageHeaderProps {
  title: string;
  description: string;
}

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <header className="mb-10">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-300 transition-colors duration-200"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
        </svg>
        Inicio
      </Link>
      <h1 className="text-3xl font-bold text-white">{title}</h1>
      <p className="mt-2 text-sm text-slate-400">{description}</p>
    </header>
  );
}
