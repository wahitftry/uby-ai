'use client';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function About() {
  return (
    <div className="grid grid-rows-[auto_1fr] min-h-screen bg-gradient-to-b from-background to-background/95">
      <Navbar />
      
      <main className="flex-1 flex overflow-hidden p-4">
        <div className="w-full max-w-4xl mx-auto modern-card p-8">
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
            <div className="w-32 h-32 rounded-full overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-500 via-indigo-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold shadow-lg transition-all duration-300 group-hover:scale-110">
                U
              </div>
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600">UBY Informatics Engineering</h1>
              <p className="text-foreground/70 mb-4 text-lg">Web Developer & Pengembang AI</p>
              
              <h2 className="text-xl font-semibold mb-2 mt-6">Profil</h2>
              <p className="text-foreground/80 mb-4 leading-relaxed">
                Kami adalah seorang pengembang web berpengalaman dengan keahlian khusus dalam teknologi Next.js, React, dan pengembangan aplikasi AI. Dengan latar belakang yang kuat dalam bidang teknologi informasi, kami selalu berusaha mengembangkan solusi inovatif yang menggabungkan desain yang menarik dengan fungsionalitas yang powerful.
              </p>
              
              <h2 className="text-xl font-semibold mb-3 mt-6">Keahlian</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                {['Next.js', 'React', 'Tailwind CSS', 'TypeScript', 'AI Development', 'UI/UX Design'].map((skill, index) => (
                  <div key={index} className="bg-background/40 p-3 rounded-lg border border-black/5 dark:border-white/5 hover:shadow-md transition-all duration-200 hover:bg-background/70">
                    <span className="font-medium">{skill}</span>
                  </div>
                ))}
              </div>
              
              <h2 className="text-xl font-semibold mb-3 mt-6">Projek Terbaru</h2>
              <div className="mb-6">
                <div className="mb-4 p-4 modern-card">
                  <h3 className="font-medium mb-1 text-lg">UBY AI</h3>
                  <p className="text-foreground/70 leading-relaxed">Aplikasi chatbot AI yang dikembangkan dengan Next.js 15 dan TailwindCSS 4, dirancang untuk memberikan pengalaman pengguna yang responsif dan intuitif.</p>
                </div>
              </div>
              
              <h2 className="text-xl font-semibold mb-3 mt-6">Kontak</h2>
              <div className="flex flex-col sm:flex-row gap-4">
                <a href="mailto:wahitfitriyanto@gmail.com" className="inline-flex items-center justify-center sm:justify-start gap-2 px-5 py-3 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 text-white rounded-xl hover:opacity-90 transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-95">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                  </svg>
                  <span>Email</span>
                </a>
                <a href="https://github.com/wahitftry/wahit-ai" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center sm:justify-start gap-2 px-5 py-3 bg-[#24292e] hover:bg-[#1a1e21] text-white rounded-xl hover:opacity-90 transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-95">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                  </svg>
                  <span>GitHub</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
