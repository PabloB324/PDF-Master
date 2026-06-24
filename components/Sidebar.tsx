"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

const NAV_ITEMS: NavItem[] = [
  {
    href: "/merge",
    label: "Unir PDFs",
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" /></svg>,
  },
  {
    href: "/extract",
    label: "Extraer páginas",
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>,
  },
  {
    href: "/rotate",
    label: "Rotar páginas",
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" /></svg>,
  },
  {
    href: "/number-pages",
    label: "Numerar páginas",
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5.25 8.25h15m-16.5 7.5h15m-1.8-13.5-3.9 19.5m-2.1-19.5-3.9 19.5" /></svg>,
  },
  {
    href: "/protect",
    label: "Proteger PDF",
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" /></svg>,
  },
  {
    href: "/unlock",
    label: "Desbloquear PDF",
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 1 1 9 0v3.75M3.75 21.75h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H3.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" /></svg>,
  },
  {
    href: "/verify-signature",
    label: "Verificar firma",
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" /></svg>,
  },
  {
    href: "/verify-metadata",
    label: "Metadata",
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" /></svg>,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 flex w-60 flex-col bg-[#1e3a5f]">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-white/10">
        <div className="flex size-8 items-center justify-center rounded-lg bg-cyan-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="size-4 text-[#1e3a5f]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-bold tracking-widest text-white uppercase leading-none">PDF Master</p>
          <p className="text-[10px] text-white/40 mt-0.5">Gestor de PDF</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={[
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150",
                isActive
                  ? "bg-white/15 text-cyan-300"
                  : "text-white/60 hover:bg-white/8 hover:text-white/90",
              ].join(" ")}
            >
              <span className={isActive ? "text-cyan-400" : ""}>{item.icon}</span>
              {item.label}
              {isActive && (
                <span className="ml-auto size-1.5 rounded-full bg-cyan-400" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Trust badge */}
      <div className="mx-3 mb-3 rounded-xl bg-white/8 p-4">
        <div className="flex items-center gap-2 mb-1.5">
          <svg xmlns="http://www.w3.org/2000/svg" className="size-4 text-cyan-400 shrink-0" viewBox="0 0 24 24" fill="currentColor">
            <path fillRule="evenodd" d="M12.516 2.17a.75.75 0 0 0-1.032 0 11.209 11.209 0 0 1-7.877 3.08.75.75 0 0 0-.722.515A12.74 12.74 0 0 0 2.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.749.749 0 0 0 .374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 0 0-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.734-3.08Zm3.094 8.016a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
          </svg>
          <span className="text-xs font-semibold text-white/80">100% Seguro</span>
        </div>
        <p className="text-xs text-white/40 leading-relaxed">Tus archivos se procesan en el servidor sin almacenamiento permanente.</p>
      </div>

      {/* Status */}
      <div className="border-t border-white/10 px-5 py-3 flex items-center gap-2">
        <span className="size-2 rounded-full bg-emerald-400 shrink-0" />
        <p className="text-xs text-white/35">Procesados en servidor · Sin almacenamiento</p>
      </div>
    </aside>
  );
}
