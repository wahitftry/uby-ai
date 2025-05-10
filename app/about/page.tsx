'use client';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function About() {
  return (
    <div className="grid grid-rows-[auto_1fr] min-h-screen bg-gradient-to-b from-background to-background/95">
      <Navbar />
      
      <main className="flex-1 flex overflow-hidden p-4">
        <div className="w-full max-w-4xl mx-auto rounded-2xl shadow-lg border border-black/5 dark:border-white/5 overflow-hidden backdrop-blur-sm bg-background/70 p-8">
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold shadow-lg">
              W
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold mb-2">UBY Informatics Engineering</h1>
              <p className="text-foreground/70 mb-4">Web Developer & Pengembang AI</p>
              
              <h2 className="text-xl font-semibold mb-2 mt-6">Profil</h2>
              <p className="text-foreground/80 mb-4">
                Kami adalah seorang pengembang web berpengalaman dengan keahlian khusus dalam teknologi Next.js, React, dan pengembangan aplikasi AI. Dengan latar belakang yang kuat dalam bidang teknologi informasi, kami selalu berusaha mengembangkan solusi inovatif yang menggabungkan desain yang menarik dengan fungsionalitas yang powerful.
              </p>
              
              <h2 className="text-xl font-semibold mb-2 mt-6">Keahlian</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-background/50 p-3 rounded-lg border border-black/5 dark:border-white/5">
                  <span className="font-medium">Next.js</span>
                </div>
                <div className="bg-background/50 p-3 rounded-lg border border-black/5 dark:border-white/5">
                  <span className="font-medium">React</span>
                </div>
                <div className="bg-background/50 p-3 rounded-lg border border-black/5 dark:border-white/5">
                  <span className="font-medium">Tailwind CSS</span>
                </div>
                <div className="bg-background/50 p-3 rounded-lg border border-black/5 dark:border-white/5">
                  <span className="font-medium">TypeScript</span>
                </div>
                <div className="bg-background/50 p-3 rounded-lg border border-black/5 dark:border-white/5">
                  <span className="font-medium">AI Development</span>
                </div>
                <div className="bg-background/50 p-3 rounded-lg border border-black/5 dark:border-white/5">
                  <span className="font-medium">UI/UX Design</span>
                </div>
              </div>
              
              <h2 className="text-xl font-semibold mb-2 mt-6">Projek Terbaru</h2>
              <div className="mb-6">
                <div className="mb-4 p-4 bg-background/50 rounded-lg border border-black/5 dark:border-white/5">
                  <h3 className="font-medium mb-1">UBY AI</h3>
                  <p className="text-sm text-foreground/70">Aplikasi chatbot AI yang dikembangkan dengan Next.js 15 dan TailwindCSS 4, dirancang untuk memberikan pengalaman pengguna yang responsif dan intuitif.</p>
                </div>
              </div>
              
              <h2 className="text-xl font-semibold mb-2 mt-6">Kontak</h2>
              <div className="flex flex-col sm:flex-row gap-4">
                <a href="mailto:wahitfitriyanto@gmail.com" className="flex items-center justify-center sm:justify-start gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                  </svg>
                  <span>Email</span>
                </a>
                <a href="https://github.com/wahitftry/wahit-ai" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center sm:justify-start gap-2 px-4 py-2 bg-black text-white rounded-lg hover:opacity-90 transition-opacity">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
                    <path d="M9 18c-4.51 2-5-2-7-2"></path>
                  </svg>
                  <span>GitHub</span>
                </a>
              </div>
            </div>
          </div>
        </div>      </main>
      
      <Footer />
    </div>
  );
}
