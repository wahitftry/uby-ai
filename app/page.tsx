'use client';
import dynamic from 'next/dynamic';
import Image from "next/image";

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
  return (
    <div className="grid grid-rows-[auto_1fr] min-h-screen bg-gradient-to-b from-background to-background/95">
      <header className="flex items-center justify-between p-4 border-b border-black/5 dark:border-white/5 backdrop-blur-sm bg-background/70 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md">W</div>
          </div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80">Wahit AI</h1>
        </div>
        <div className="text-xs text-foreground/50 font-light">
          Dibuat oleh Wahit Fitriyanto dengan Next.js dan Tailwind CSS
        </div>
      </header>
      
      <main className="flex-1 flex overflow-hidden p-4">
        <div className="w-full max-w-4xl mx-auto rounded-2xl shadow-lg border border-black/5 dark:border-white/5 overflow-hidden backdrop-blur-sm bg-background/70">
          <ChatContainer />
        </div>
      </main>
    </div>
  );
}
