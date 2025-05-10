'use client';
import dynamic from 'next/dynamic';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

const ChatContainer = dynamic(() => import('./components/ChatContainer'), { 
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full">
      <div className="flex flex-col items-center">
        <div className="h-12 w-12 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 animate-pulse flex items-center justify-center">
          <span className="text-white font-bold text-xl">W</span>
        </div>
        <div className="mt-4 text-foreground/70 animate-pulse">Memuat UBY AI...</div>
      </div>
    </div>
  )
});

export default function Home() {
  return (
    <div className="grid grid-rows-[auto_1fr] min-h-screen bg-gradient-to-b from-background to-background/95">
      <Navbar />
      
      <main className="flex-1 flex overflow-hidden p-4">
        <div className="w-full max-w-4xl mx-auto rounded-2xl shadow-lg border border-black/5 dark:border-white/5 overflow-hidden backdrop-blur-sm bg-background/70">
          <ChatContainer />
        </div>
      </main>
        <Footer />
    </div>
  );
}
