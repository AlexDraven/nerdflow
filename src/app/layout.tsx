import type { Metadata } from "next";
import { Rajdhani } from "next/font/google";
import "./globals.css";

const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sheikah",
});

export const metadata: Metadata = {
  title: "Tableta Sheikah — Escáner de Reliquias",
  description: "Homenaje al 40 aniversario de The Legend of Zelda",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${rajdhani.variable} font-[family-name:var(--font-sheikah)]`}>
        {children}
      </body>
    </html>
  );
}
