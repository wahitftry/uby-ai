'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="flex items-center justify-between p-4 border-b border-black/5 dark:border-white/5 backdrop-blur-sm bg-background/70 sticky top-0 z-20 nav-animation">
      <div className="flex items-center gap-3">
        <Link href="/">
          <div className="relative h-10 w-10 overflow-hidden cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md">W</div>
          </div>
        </Link>
        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80">UBY AI</h1>
      </div>
      <div className="flex gap-4">
        <Link href="/" className={`text-sm ${pathname === '/' ? 'font-medium text-foreground' : 'text-foreground/70 hover:text-foreground'} transition-colors`}>
          Beranda
        </Link>
        <Link href="/showcase" className={`text-sm ${pathname === '/showcase' ? 'font-medium text-foreground' : 'text-foreground/70 hover:text-foreground'} transition-colors`}>
          Showcase
        </Link>
        <Link href="/faq" className={`text-sm ${pathname === '/faq' ? 'font-medium text-foreground' : 'text-foreground/70 hover:text-foreground'} transition-colors`}>
          FAQ
        </Link>
        <Link href="/about" className={`text-sm ${pathname === '/about' ? 'font-medium text-foreground' : 'text-foreground/70 hover:text-foreground'} transition-colors`}>
          Tentang
        </Link>
      </div>
    </header>
  );
}
