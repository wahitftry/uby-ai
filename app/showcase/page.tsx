'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

interface FiturAIProps {
  judul: string;
  deskripsi: string;
  contoh: string;
  ikon: React.ReactNode;
  warna: string;
}

const FiturAI: React.FC<FiturAIProps> = ({ judul, deskripsi, contoh, ikon, warna }) => {
  return (
    <div className="flex flex-col gap-4 p-6 rounded-2xl border border-white/5 bg-background/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300 modern-card">
      <div className={`p-3 rounded-xl w-12 h-12 flex items-center justify-center ${warna}`}>
        {ikon}
      </div>
      <h3 className="text-xl font-semibold">{judul}</h3>
      <p className="text-foreground/70">{deskripsi}</p>
      <div className="mt-2 p-3 rounded-xl bg-white/5 text-sm">
        <div className="font-medium text-xs uppercase text-foreground/50 mb-1">Contoh:</div>
        {contoh}
      </div>
    </div>
  );
};

export default function ShowcasePage() {
  const fiturList = [
    {
      judul: "Penulisan Kreatif",
      deskripsi: "Hasilkan artikel, cerita pendek, puisi, dan konten kreatif lainnya dengan berbagai gaya penulisan",
      contoh: "Buatkan puisi tentang keindahan alam Indonesia dengan gaya romantis",
      ikon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
        </svg>
      ),
      warna: "bg-gradient-to-br from-pink-500 to-rose-500 text-white",
    },
    {
      judul: "Asisten Coding",
      deskripsi: "Dapatkan bantuan dalam menulis, debugging, dan optimasi kode di berbagai bahasa pemrograman",
      contoh: "Bagaimana cara membuat fungsi rekursif untuk menghitung bilangan Fibonacci di Python?",
      ikon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="16 18 22 12 16 6"></polyline>
          <polyline points="8 6 2 12 8 18"></polyline>
        </svg>
      ),
      warna: "bg-gradient-to-br from-blue-500 to-indigo-600 text-white",
    },
    {
      judul: "Analisis Data",
      deskripsi: "Ekstraksi insight, interpretasi statistik, dan visualisasi dari data kompleks",
      contoh: "Bantu saya menginterpretasikan hasil survei kepuasan pelanggan dengan 500 responden",
      ikon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="20" x2="18" y2="10"></line>
          <line x1="12" y1="20" x2="12" y2="4"></line>
          <line x1="6" y1="20" x2="6" y2="14"></line>
        </svg>
      ),
      warna: "bg-gradient-to-br from-emerald-500 to-green-600 text-white",
    },
    {
      judul: "Terjemahan Multibahasa",
      deskripsi: "Terjemahkan teks antar bahasa dengan hasil yang natural dan memperhatikan konteks",
      contoh: "Terjemahkan 'Selamat datang di Indonesia, negeri yang indah' ke Bahasa Inggris, Jepang, dan Prancis",
      ikon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 12h20"></path>
          <path d="M12 2v20"></path>
          <path d="m4.93 4.93 14.14 14.14"></path>
          <path d="m19.07 4.93-14.14 14.14"></path>
        </svg>
      ),
      warna: "bg-gradient-to-br from-purple-500 to-violet-600 text-white",
    },
    {
      judul: "Riset & Pembelajaran",
      deskripsi: "Dapatkan informasi mendalam tentang berbagai topik untuk riset dan pembelajaran",
      contoh: "Jelaskan penyebab dan dampak pemanasan global dengan sumber terpercaya",
      ikon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
        </svg>
      ),
      warna: "bg-gradient-to-br from-orange-500 to-amber-500 text-white",
    },
    {
      judul: "Konsultasi Bisnis",
      deskripsi: "Dapatkan saran, strategi, dan analisis untuk pengembangan bisnis dan entrepreneurship",
      contoh: "Bagaimana cara meningkatkan retensi pelanggan untuk bisnis e-commerce?",
      ikon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
        </svg>
      ),
      warna: "bg-gradient-to-br from-cyan-500 to-blue-500 text-white",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/95">
      <Navbar />

      <main className="container mx-auto px-6 py-12">
        <div className="text-center mb-12 max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600">Kemampuan UBY AI</h1>
          <p className="text-xl text-foreground/70">Jelajahi berbagai fitur dan kemampuan yang dapat membantu produktivitas Anda</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {fiturList.map((fitur, index) => (
            <FiturAI
              key={index}
              judul={fitur.judul}
              deskripsi={fitur.deskripsi}
              contoh={fitur.contoh}
              ikon={fitur.ikon}
              warna={fitur.warna}
            />
          ))}
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-6">Siap untuk mencoba UBY AI?</h2>
          <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 text-white font-medium rounded-xl hover:opacity-90 transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-95">
            <span>Mulai Sekarang</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m9 18 6-6-6-6"></path>
            </svg>
          </Link>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
