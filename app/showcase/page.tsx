'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface FiturAIProps {
  judul: string;
  deskripsi: string;
  contoh: string;
  ikon: React.ReactNode;
  warna: string;
}

const FiturAI: React.FC<FiturAIProps> = ({ judul, deskripsi, contoh, ikon, warna }) => {
  return (
    <div className="flex flex-col gap-4 p-6 rounded-2xl border border-black/5 dark:border-white/5 bg-background/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-all">
      <div className={`p-3 rounded-xl w-12 h-12 flex items-center justify-center ${warna}`}>
        {ikon}
      </div>
      <h3 className="text-xl font-semibold">{judul}</h3>
      <p className="text-foreground/70">{deskripsi}</p>
      <div className="mt-2 p-3 rounded-xl bg-black/5 dark:bg-white/5 text-sm">
        <div className="font-medium text-xs uppercase text-foreground/50 mb-1">Contoh:</div>
        {contoh}
      </div>
    </div>
  );
};

export default function ShowcasePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/95">
      <header className="flex items-center justify-between p-4 border-b border-black/5 dark:border-white/5 backdrop-blur-sm bg-background/70 sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md">W</div>
          </div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80">Wahit AI</h1>
        </div>
        <div className="flex gap-4">
          <Link href="/" className="text-sm text-foreground/70 hover:text-foreground transition-colors">
            Beranda
          </Link>
          <Link href="/showcase" className="text-sm font-medium text-foreground transition-colors">
            Showcase
          </Link>
          <Link href="/faq" className="text-sm text-foreground/70 hover:text-foreground transition-colors">
            FAQ
          </Link>
          <Link href="/about" className="text-sm text-foreground/70 hover:text-foreground transition-colors">
            Tentang
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-3">Kemampuan Wahit AI</h1>
          <p className="text-xl text-foreground/70 max-w-3xl mx-auto">Wahit AI dapat membantu dalam berbagai tugas. Berikut adalah contoh kemampuan yang dapat dimanfaatkan.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FiturAI 
            judul="Pembuatan Konten" 
            deskripsi="Buat konten kreatif seperti cerita, artikel blog, email, dan caption media sosial." 
            contoh='Tuliskan artikel blogpost singkat tentang "Manfaat Kopi untuk Kesehatan" dengan tone of voice yang santai.' 
            ikon={
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m18 7 4 2v11a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9l4-2"></path>
                <path d="M14 22v-7.5L9 9 4 14v7"></path>
                <path d="M4 2v7.5L9 9"></path>
                <path d="M20 2v7.5L15 9"></path>
              </svg>
            } 
            warna="bg-blue-500/10 text-blue-500"
          />
          
          <FiturAI 
            judul="Penjelasan Konsep" 
            deskripsi="Dapatkan penjelasan yang jelas tentang konsep kompleks dalam beragam bidang." 
            contoh="Tolong jelaskan bagaimana cara kerja blockchain dalam bahasa sederhana untuk pemula." 
            ikon={
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                <path d="M12 17h.01"></path>
              </svg>
            } 
            warna="bg-green-500/10 text-green-500"
          />
          
          <FiturAI 
            judul="Bantuan Koding" 
            deskripsi="Dapatkan bantuan untuk menulis, memahami, atau men-debug kode pemrograman." 
            contoh={`Buatkan fungsi JavaScript untuk memvalidasi format email dengan regex.`}
            ikon={
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="16 18 22 12 16 6"></polyline>
                <polyline points="8 6 2 12 8 18"></polyline>
              </svg>
            } 
            warna="bg-purple-500/10 text-purple-500"
          />
          
          <FiturAI 
            judul="Asisten Bahasa" 
            deskripsi="Dapatkan bantuan dengan terjemahan, koreksi tata bahasa, dan perbaikan teks." 
            contoh="Tolong terjemahkan teks berikut ke dalam bahasa Inggris yang formal: 'Saya akan hadir dalam rapat besok pagi.'" 
            ikon={
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m5 8 6 6"></path>
                <path d="m4 14 7-7"></path>
                <path d="M2 5h12"></path>
                <path d="M7 2h1"></path>
                <path d="m22 22-5-5"></path>
                <path d="M17.5 14h.5"></path>
                <path d="M14 14V9"></path>
                <path d="M14 17h.01"></path>
              </svg>
            } 
            warna="bg-amber-500/10 text-amber-500"
          />
          
          <FiturAI 
            judul="Riset dan Analisis" 
            deskripsi="Dapatkan bantuan untuk menganalisis data, merangkum informasi, dan mengekstrak wawasan." 
            contoh="Berikan ringkasan singkat tentang tren terbaru dalam teknologi kecerdasan buatan pada tahun 2025." 
            ikon={
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
              </svg>
            } 
            warna="bg-pink-500/10 text-pink-500"
          />
          
          <FiturAI 
            judul="Rekomendasi Kreatif" 
            deskripsi="Dapatkan ide untuk proyek, pemasaran, branding, atau pemecahan masalah kreatif." 
            contoh="Berikan 5 ide nama merek untuk kedai kopi lokal yang mengusung tema keberlanjutan dan kearifan lokal Indonesia." 
            ikon={
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 12h10"></path>
                <path d="M9 4v16"></path>
                <path d="m3 9 3 3-3 3"></path>
                <path d="M14 8V6c0-1.1.9-2 2-2h4a2 2 0 0 1 2 2v12c0 1.1-.9 2-2 2h-4a2 2 0 0 1-2-2v-2"></path>
              </svg>
            } 
            warna="bg-cyan-500/10 text-cyan-500"
          />
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-semibold mb-6">Manfaatkan Konteks yang Lebih Besar</h2>
          <div className="max-w-3xl mx-auto bg-gradient-to-r from-blue-500 to-purple-600 p-[1px] rounded-2xl">
            <div className="bg-background rounded-2xl p-8">
              <p className="mb-4 text-xl">Wahit AI kini mendukung context window hingga 30 pesan, sehingga percakapan bisa lebih panjang dan komprehensif.</p>
              <Link href="/" className="inline-block px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-xl hover:opacity-90 transition-opacity">
                Coba Sekarang
              </Link>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="mt-auto py-6 text-center text-sm text-foreground/50 border-t border-black/5 dark:border-white/5">
        © {new Date().getFullYear()} Wahit Fitriyanto - Semua hak dilindungi
      </footer>
    </div>
  );
}
