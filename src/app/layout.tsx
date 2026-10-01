import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Ciencia & Química de los Alimentos — Base de Conocimiento Científica",
  description:
    "Alfabetización científica avanzada en química de alimentos, bioquímica, procesamiento térmico, digestión, ingredientes, aditivos y regulación comparada (Colombia, Codex, UE, FDA).",
  keywords: [
    "ciencia de los alimentos",
    "química de alimentos",
    "reacción de maillard",
    "aditivos alimentarios",
    "sellos frontales colombia",
    "calculadora atwater",
    "clostridium botulinum",
    "bioquímica nutricional",
  ],
  authors: [{ name: "Jhon Jairo Cruz Jiménez" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" data-theme="dark" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col antialiased">
        <ThemeProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
