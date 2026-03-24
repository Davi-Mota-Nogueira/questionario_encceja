import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Questionário de Avaliação - Abandono Escolar | Recife",
  description: "Questionário interativo para avaliar a probabilidade de abandono escolar de alunos do Encceja em Pernambuco/Recife. Programa de prevenção e apoio estudantil.",
  keywords: ["abandono escolar", "Recife", "Pernambuco", "Encceja", "educação", "questionário", "prevenção"],
  authors: [{ name: "Prefeitura do Recife - Secretaria de Educação" }],
  icons: {
    icon: "../../public/favicon.svg",
  },
  openGraph: {
    title: "Questionário de Avaliação - Abandono Escolar",
    description: "Avalie os fatores de risco de abandono escolar e receba recomendações personalizadas",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/icon.svg"/>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
      </body>
    </html>
  );
}
