'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="flex items-center justify-between p-4 border-b border-black/5 dark:border-white/5 backdrop-blur-lg bg-background/60 sticky top-0 z-20 nav-animation">
      <div className="flex items-center gap-3">
        <Link href="/">
          <div className="relative h-10 w-10 overflow-hidden cursor-pointer group">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500 via-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md transition-all duration-300 group-hover:shadow-lg group-hover:scale-105">U</div>
          </div>
        </Link>
        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600">UBY AI</h1>
      </div>
      <nav className="flex gap-6">
        <Link href="/" className={`text-sm relative ${pathname === '/' ? 'font-medium text-foreground' : 'text-foreground/70 hover:text-foreground'} transition-colors`}>
          Beranda
          {pathname === '/' && <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></span>}
        </Link>
        <Link href="/showcase" className={`text-sm relative ${pathname === '/showcase' ? 'font-medium text-foreground' : 'text-foreground/70 hover:text-foreground'} transition-colors`}>
          Showcase
          {pathname === '/showcase' && <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></span>}
        </Link>
        <Link href="/faq" className={`text-sm relative ${pathname === '/faq' ? 'font-medium text-foreground' : 'text-foreground/70 hover:text-foreground'} transition-colors`}>
          FAQ
          {pathname === '/faq' && <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></span>}
        </Link>
        <Link href="/about" className={`text-sm relative ${pathname === '/about' ? 'font-medium text-foreground' : 'text-foreground/70 hover:text-foreground'} transition-colors`}>
          Tentang
          {pathname === '/about' && <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></span>}
        </Link>
      </nav>
    </header>
  );
}
