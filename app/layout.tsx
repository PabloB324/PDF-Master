import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PDF Master",
  description: "Herramientas para gestionar tus PDFs: unir, extraer, rotar, proteger y más.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-slate-50 font-sans antialiased`}>
        <div className="mx-auto max-w-4xl px-4 py-10">{children}</div>
      </body>
    </html>
  );
}
