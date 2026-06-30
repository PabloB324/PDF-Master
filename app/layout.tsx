import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Sidebar } from "@/components/Sidebar";
import "./globals.css";

const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PDF Master",
  description: "Herramientas para gestionar tus PDFs: unir, extraer, rotar, proteger y más.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={`${geist.variable} font-sans antialiased bg-gray-100`}>
        <Sidebar />
        <main className="ml-60 min-h-screen p-8">
          {children}
        </main>
      </body>
    </html>
  );
}
