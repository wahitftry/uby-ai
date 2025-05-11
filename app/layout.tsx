import type { Metadata, Viewport } from "next";
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
  title: "UBY AI - Asisten Kecerdasan Buatan Pribadi",
  description: "Asisten AI pribadi yang membantu Anda menjawab pertanyaan, membuat konten, menganalisis data, dan banyak lagi.",
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased selection:bg-purple-500/30 dark:selection:text-purple-300`}
      >
        {children}
      </body>
    </html>
  );
}
