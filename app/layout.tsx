import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Sidebar } from "@/components/Sidebar";
import { TopBar } from "@/components/TopBar";
import "./globals.css";

const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PDF Master",
  description: "Herramientas para gestionar tus PDFs: unir, extraer, rotar, proteger y más.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={`${geist.variable} font-sans antialiased bg-slate-100`}>
        <Sidebar />
        <div className="ml-60 flex min-h-screen flex-col">
          <TopBar />
          <main className="flex-1 p-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
