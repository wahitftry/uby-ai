'use client';
import dynamic from 'next/dynamic';
import Image from "next/image";

const ChatContainer = dynamic(() => import('./components/ChatContainer'), { 
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full">
      <div className="animate-pulse">Memuat Wahit AI...</div>
    </div>
  )
});

export default function Home() {
  return (
    <div className="grid grid-rows-[auto_1fr] min-h-screen">
      <header className="flex items-center justify-between p-4 border-b border-black/10 dark:border-white/10">
        <div className="flex items-center gap-2">
          <div className="relative h-8 w-8">
            <div className="absolute inset-0 bg-foreground rounded-md flex items-center justify-center text-background font-bold text-lg">W</div>
          </div>
          <h1 className="text-xl font-bold">Wahit AI</h1>
        </div>
        <div className="text-xs text-foreground/50">
          Dibuat oleh Wahit Fitriyanto dengan Next.js dan Tailwind CSS
        </div>
      </header>
      
      <main className="flex-1 flex overflow-hidden">
        <ChatContainer />
      </main>
    </div>
  );
}
