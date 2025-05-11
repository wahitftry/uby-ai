'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

interface FaqItemProps {
  pertanyaan: string;
  jawaban: string;
  nomorId: string;
}

const FaqItem: React.FC<FaqItemProps> = ({ pertanyaan, jawaban, nomorId }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="border-b border-white/5 last:border-0">
      <button
        className="flex w-full items-center justify-between py-5 text-left"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls={`faq-answer-${nomorId}`}
      >
        <h3 className="font-medium text-lg">{pertanyaan}</h3>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-black/5 dark:bg-white/5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div>
      </button>
      
      <div 
        id={`faq-answer-${nomorId}`}
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-96 opacity-100 pb-5' : 'max-h-0 opacity-0'
        }`}
      >
        <p className="text-foreground/70">{jawaban}</p>
      </div>
    </div>
  );
};

export default function FaqPage() {
  const daftarFaq = [
    {
      pertanyaan: "Apa itu UBY AI?",
      jawaban: "UBY AI adalah asisten kecerdasan buatan (AI) yang dirancang untuk membantu pengguna dalam berbagai tugas seperti menjawab pertanyaan, membuat konten, memberikan analisis, dan banyak lagi. Asisten ini dikembangkan untuk memberikan respons yang akurat, bermanfaat, dan relevan sesuai dengan kebutuhan pengguna.",
    },
    {
      pertanyaan: "Bagaimana cara menggunakan UBY AI?",
      jawaban: "Cukup ketik pertanyaan atau permintaan Anda di kolom input pada halaman beranda, lalu tekan Enter atau klik tombol kirim. UBY AI akan merespons dengan jawaban terbaik berdasarkan pertanyaan tersebut. Anda juga dapat menyesuaikan model AI dan gaya respons sesuai preferensi.",
    },
    {
      pertanyaan: "Model AI apa saja yang tersedia di UBY AI?",
      jawaban: "UBY AI menyediakan beberapa model AI canggih seperti GPT-4o, Gemini Pro, Claude 3 Opus, Llama 3 70B, dan Mistral Large. Setiap model memiliki karakteristik dan kemampuan yang berbeda untuk menyesuaikan dengan kebutuhan Anda.",
    },
    {
      pertanyaan: "Apakah percakapan saya dengan UBY AI disimpan?",
      jawaban: "Ya, percakapan Anda disimpan di browser lokal (localStorage) untuk memudahkan Anda mengakses kembali riwayat percakapan. Namun, data ini hanya tersimpan di perangkat Anda dan tidak dikirimkan ke server kami kecuali saat sedang berkomunikasi dengan API model AI.",
    },
    {
      pertanyaan: "Bagaimana cara mengubah gaya respons AI?",
      jawaban: "Anda dapat mengubah gaya respons AI dengan mengklik tombol gaya di panel kontrol di bawah kolom input chat. Tersedia beberapa gaya seperti Formal (bahasa profesional), Santai (bahasa percakapan), Ringkas (jawaban singkat), dan Informatif (jawaban detail). Anda juga dapat membuat gaya respons kustom dengan mengklik 'Kelola Gaya Respons' dalam menu gaya.",
    },
    {
      pertanyaan: "Bisakah saya mengekspor atau berbagi percakapan saya?",
      jawaban: "Ya, Anda dapat mengekspor percakapan ke PDF atau membagikannya melalui tautan dengan mengklik tombol titik tiga di sudut kanan atas area chat. Opsi ekspor dan berbagi tersedia untuk percakapan yang telah Anda lakukan.",
    },
    {
      pertanyaan: "Berapa banyak konteks yang dapat diingat oleh UBY AI?",
      jawaban: "UBY AI dapat mengingat hingga 30 pesan sebelumnya dalam sebuah percakapan, sehingga memungkinkan Anda untuk memiliki diskusi yang lebih mendalam dan berkelanjutan. Indikator context window di bagian atas chat menunjukkan jumlah pesan yang saat ini digunakan.",
    },
    {
      pertanyaan: "Apakah UBY AI dapat membantu dengan kode pemrograman?",
      jawaban: "Tentu saja! UBY AI dapat membantu menulis, menjelaskan, atau men-debug kode dalam berbagai bahasa pemrograman seperti JavaScript, Python, Java, dan banyak lagi. Cukup jelaskan kebutuhan Anda dengan detail untuk mendapatkan bantuan yang tepat.",
    },
    {
      pertanyaan: "Apakah ada batasan karakter atau token per pesan?",
      jawaban: "Tidak ada batasan ketat untuk jumlah karakter per pesan, namun model AI memiliki batasan maksimum token yang dapat diproses. Untuk hasil terbaik, jika pertanyaan atau respons sangat panjang, pertimbangkan untuk memecahnya menjadi beberapa pesan terpisah.",
    },
    {
      pertanyaan: "Di mana saya bisa memberikan umpan balik atau melaporkan masalah?",
      jawaban: "Anda dapat mengirimkan umpan balik atau melaporkan masalah melalui halaman Tentang Saya atau dengan menghubungi pengembang langsung melalui informasi kontak yang tersedia di halaman tersebut.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/95">
      <Navbar />

      <main className="container mx-auto px-6 py-12 max-w-3xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600">Pertanyaan yang Sering Diajukan</h1>
          <p className="text-xl text-foreground/70">Jawaban untuk pertanyaan umum tentang UBY AI</p>
        </div>

        <div className="modern-card p-6">
          {daftarFaq.map((faq, index) => (
            <FaqItem 
              key={index}
              nomorId={`${index}`} 
              pertanyaan={faq.pertanyaan} 
              jawaban={faq.jawaban} 
            />
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-foreground/70 mb-4">Tidak menemukan jawaban yang Anda cari?</p>
          <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 text-white font-medium rounded-xl hover:opacity-90 transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-95">
            <span>Tanyakan kepada UBY AI</span>
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
