'use client';
import dynamic from 'next/dynamic';
import Image from "next/image";
import Link from "next/link";

const ChatContainer = dynamic(() => import('./components/ChatContainer'), { 
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full">
      <div className="flex flex-col items-center">
        <div className="h-12 w-12 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 animate-pulse flex items-center justify-center">
          <span className="text-white font-bold text-xl">W</span>
        </div>
        <div className="mt-4 text-foreground/70 animate-pulse">Memuat Wahit AI...</div>
      </div>
    </div>
  )
});

export default function Home() {
  return (    <div className="grid grid-rows-[auto_1fr] min-h-screen bg-gradient-to-b from-background to-background/95">
      <header className="flex items-center justify-between p-4 border-b border-black/5 dark:border-white/5 backdrop-blur-sm bg-background/70 sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md">W</div>
          </div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80">Wahit AI</h1>
        </div>
        <div className="flex gap-4">
          <Link href="/" className="text-sm font-medium text-foreground transition-colors">
            Beranda
          </Link>
          <Link href="/about" className="text-sm text-foreground/70 hover:text-foreground transition-colors">
            Tentang Saya
          </Link>
        </div>
      </header>
      
      <main className="flex-1 flex overflow-hidden p-4">
        <div className="w-full max-w-4xl mx-auto rounded-2xl shadow-lg border border-black/5 dark:border-white/5 overflow-hidden backdrop-blur-sm bg-background/70">
          <ChatContainer />
        </div>
      </main>
      
      <footer className="mt-auto py-4 text-center text-xs text-foreground/50">
        © {new Date().getFullYear()} Wahit Fitriyanto - Semua hak dilindungi
      </footer>
    </div>
  );
}
