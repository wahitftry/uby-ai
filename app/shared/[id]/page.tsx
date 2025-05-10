'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { PesanType } from '../../types/chat';
import ChatMessage from '../../components/ChatMessage';

interface SharedData {
  judul: string;
  tanggalDibuat: number;
  pesan: PesanType[];
}

export default function SharedPage() {
  const params = useParams();
  const [sharedData, setSharedData] = useState<SharedData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (params?.id) {
      try {
        // Ambil data dari localStorage
        const shareId = params.id as string;
        const data = localStorage.getItem(`wahit_share_${shareId}`);
        
        if (data) {
          const parsedData = JSON.parse(data);
          setSharedData(parsedData);
        } else {
          setError('Percakapan yang dibagikan tidak ditemukan atau telah kedaluwarsa');
        }
      } catch (err) {
        console.error('Error mengambil data berbagi:', err);
        setError('Terjadi kesalahan saat memuat percakapan');
      } finally {
        setLoading(false);
      }
    }
  }, [params]);
  
  if (loading) {
    return (
      <div className="grid grid-rows-[auto_1fr] min-h-screen bg-gradient-to-b from-background to-background/95">
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
          </div>
        </header>
        
        <main className="flex-1 flex overflow-hidden p-4 items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="h-12 w-12 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 animate-pulse flex items-center justify-center">
              <span className="text-white font-bold text-xl">W</span>
            </div>
            <div className="mt-4 text-foreground/70 animate-pulse">Memuat percakapan yang dibagikan...</div>
          </div>
        </main>
      </div>
    );
  }
  
  if (error || !sharedData) {
    return (
      <div className="grid grid-rows-[auto_1fr] min-h-screen bg-gradient-to-b from-background to-background/95">
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
          </div>
        </header>
        
        <main className="flex-1 flex overflow-hidden p-4 items-center justify-center">
          <div className="w-full max-w-4xl mx-auto rounded-2xl shadow-lg border border-black/5 dark:border-white/5 overflow-hidden backdrop-blur-sm bg-background/70 p-8 text-center">
            <div className="flex flex-col items-center">
              <div className="h-16 w-16 rounded-2xl bg-red-500 flex items-center justify-center text-white mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
              </div>
              <h2 className="text-xl font-bold mb-2">Error</h2>
              <p className="text-foreground/70 mb-6">{error || 'Terjadi kesalahan saat memuat percakapan'}</p>
              <Link href="/" className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                Kembali ke Beranda
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }
  
  return (
    <div className="grid grid-rows-[auto_1fr_auto] min-h-screen bg-gradient-to-b from-background to-background/95">
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
        </div>
      </header>
      
      <main className="flex-1 flex overflow-hidden p-4">
        <div className="w-full max-w-4xl mx-auto rounded-2xl shadow-lg border border-black/5 dark:border-white/5 overflow-hidden backdrop-blur-sm bg-background/70">
          <div className="p-4 border-b border-black/5 dark:border-white/5">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium">{sharedData.judul}</h2>
              <div className="text-xs text-foreground/50">
                Dibagikan pada: {new Date(sharedData.tanggalDibuat).toLocaleString('id-ID')}
              </div>
            </div>
          </div>
          
          <div className="px-4 py-6 overflow-y-auto h-[calc(100vh-200px)]">
            {sharedData.pesan.map((pesan, index) => (
              <ChatMessage key={index} pesan={{...pesan, id: `share-${index}`}} />
            ))}
          </div>
        </div>
      </main>
      
      <footer className="mt-auto py-4 text-center text-xs text-foreground/50">
        <div className="flex flex-col items-center gap-2">
          <Link href="/" className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity">
            Mulai Percakapan Baru
          </Link>
          <p>© {new Date().getFullYear()} Wahit Fitriyanto - Semua hak dilindungi</p>
        </div>
      </footer>
    </div>
  );
}
