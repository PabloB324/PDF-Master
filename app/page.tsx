import Link from "next/link";

interface Tool {
  href: string;
  label: string;
  description: string;
  icon: React.ReactNode;
}

interface Section {
  title: string;
  sectionIcon: React.ReactNode;
  tools: Tool[];
}

const SECTIONS: Section[] = [
  {
    title: "Edición",
    sectionIcon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="size-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125" />
      </svg>
    ),
    tools: [
      {
        href: "/merge",
        label: "Unir PDFs",
        description: "Combina varios documentos PDF en uno solo.",
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="size-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" /></svg>,
      },
      {
        href: "/extract",
        label: "Extraer páginas",
        description: "Separa y extrae las páginas que necesitas.",
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="size-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>,
      },
      {
        href: "/rotate",
        label: "Rotar páginas",
        description: "Gira las páginas al ángulo que prefieras.",
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="size-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" /></svg>,
      },
      {
        href: "/number-pages",
        label: "Numerar páginas",
        description: "Agrega numeración de página en la posición seleccionada.",
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="size-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5.25 8.25h15m-16.5 7.5h15m-1.8-13.5-3.9 19.5m-2.1-19.5-3.9 19.5" /></svg>,
      },
    ],
  },
  {
    title: "Optimización y Protección",
    sectionIcon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="size-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
      </svg>
    ),
    tools: [
      {
        href: "/protect",
        label: "Proteger PDF",
        description: "Cifra el documento con una contraseña.",
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="size-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" /></svg>,
      },
      {
        href: "/unlock",
        label: "Desbloquear PDF",
        description: "Remueve la protección de un PDF cifrado.",
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="size-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 1 1 9 0v3.75M3.75 21.75h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H3.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" /></svg>,
      },
    ],
  },
  {
    title: "Análisis",
    sectionIcon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="size-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0 0 20.25 18V6A2.25 2.25 0 0 0 18 3.75H6A2.25 2.25 0 0 0 3.75 6v12A2.25 2.25 0 0 0 6 20.25Z" />
      </svg>
    ),
    tools: [
      {
        href: "/verify-signature",
        label: "Verificar firma",
        description: "Verifica firmas digitales en un PDF.",
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="size-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" /></svg>,
      },
      {
        href: "/verify-metadata",
        label: "Metadata",
        description: "Inspecciona la información interna del documento.",
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="size-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" /></svg>,
      },
    ],
  },
];

export default function Home() {
  return (
    <div className="max-w-4xl space-y-10">
      {SECTIONS.map((section) => (
        <section key={section.title}>
          {/* Section header */}
          <div className="flex items-center gap-2 mb-4">
            {section.sectionIcon}
            <h2 className="text-base font-semibold text-gray-800">{section.title}</h2>
            <div className="flex-1 border-t border-gray-200 ml-2" />
          </div>

          {/* Cards grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {section.tools.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="flex flex-col items-center rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm hover:border-orange-200 hover:shadow-md transition-all duration-200 group"
              >
                <div className="mb-3 text-orange-500 group-hover:scale-110 transition-transform duration-200">
                  {tool.icon}
                </div>
                <p className="text-sm font-bold text-gray-800 mb-1">{tool.label}</p>
                <p className="text-xs text-gray-500 leading-relaxed">{tool.description}</p>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
