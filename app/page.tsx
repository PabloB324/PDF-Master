import { FeatureCard } from "@/components/FeatureCard";

import type { AccentColor } from "@/components/FeatureCard";

const FEATURES: { href: string; title: string; description: string; icon: React.ReactNode; color: AccentColor }[] = [
  {
    href: "/merge",
    title: "Unir PDFs",
    description: "Combina varios archivos PDF en un solo documento.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
      </svg>
    ),
    color: "blue",
  },
  {
    href: "/extract",
    title: "Extraer páginas",
    description: "Selecciona y extrae páginas específicas de un PDF.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
      </svg>
    ),
    color: "violet",
  },
  {
    href: "/rotate",
    title: "Rotar páginas",
    description: "Rota páginas 90°, 180° o 270° con precisión.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
      </svg>
    ),
    color: "cyan",
  },
  {
    href: "/number-pages",
    title: "Numerar páginas",
    description: "Agrega números de página con posición y tamaño personalizables.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 8.25h15m-16.5 7.5h15m-1.8-13.5-3.9 19.5m-2.1-19.5-3.9 19.5" />
      </svg>
    ),
    color: "emerald",
  },
  {
    href: "/protect",
    title: "Proteger PDF",
    description: "Cifra un PDF con contraseña para restringir su acceso.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
      </svg>
    ),
    color: "amber",
  },
  {
    href: "/unlock",
    title: "Desbloquear PDF",
    description: "Elimina la protección de contraseña de un PDF cifrado.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 1 1 9 0v3.75M3.75 21.75h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H3.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
      </svg>
    ),
    color: "orange",
  },
  {
    href: "/verify-signature",
    title: "Verificar firma",
    description: "Detecta y lista campos de firma digital en un PDF.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
      </svg>
    ),
    color: "teal",
  },
  {
    href: "/verify-metadata",
    title: "Ver metadata",
    description: "Inspecciona autor, fechas, páginas y más de un PDF.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
      </svg>
    ),
    color: "rose",
  },
];

export default function Home() {
  return (
    <main>
      {/* Hero */}
      <header className="mb-14 text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-400">
          <span className="size-1.5 rounded-full bg-blue-400 animate-pulse" />
          Procesamiento 100% en servidor — tus archivos nunca se guardan
        </div>
        <h1 className="text-5xl font-bold tracking-tight text-white">
          PDF{" "}
          <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
            Master
          </span>
        </h1>
        <p className="mt-4 text-lg text-slate-400 max-w-xl mx-auto">
          Ocho herramientas para gestionar tus PDFs. Sin registro, sin límites artificiales, sin subir tus archivos a terceros.
        </p>
      </header>

      {/* Feature grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map((f) => (
          <FeatureCard key={f.href} {...f} />
        ))}
      </div>

      {/* Footer */}
      <footer className="mt-16 text-center text-xs text-slate-600">
        Construido con Next.js 15 · TypeScript · Tailwind CSS · Desplegado en Vercel
      </footer>
    </main>
  );
}
