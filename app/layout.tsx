import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pogoda w Przedwojowie",
  description: "Aktualna prognoza pogody dla Przedwojowa z codzienną aktualizacją.",
  openGraph: {
    title: "Pogoda w Przedwojowie",
    description:
      "Prognoza godzinowa i dzienna dla Przedwojowa oparta na danych Open-Meteo.",
    url: "https://agentic-77985a02.vercel.app",
    siteName: "Pogoda Przedwojów",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pl">
      <body>{children}</body>
    </html>
  );
}
