interface PageHeaderProps {
  title: string;
  description: string;
}

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <header className="mb-8">
      <h1 className="text-3xl font-bold text-[#1e3a5f]">{title}</h1>
      <p className="mt-1.5 text-sm text-slate-500">{description}</p>
    </header>
  );
}
