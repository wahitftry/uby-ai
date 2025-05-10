import React, { useState, useRef, useEffect } from 'react';
import { daftarGayaRespons, getGayaResponsSekarang, setGayaResponsSekarang } from '../api/chatService';

interface GayaResponsSelectorProps {
  mengubahGayaRespons: (gayaId: string) => void;
  gayaResponsTerpilih: string;
  disabled?: boolean;
}

const GayaResponsSelector: React.FC<GayaResponsSelectorProps> = ({
  mengubahGayaRespons,
  gayaResponsTerpilih,
  disabled = false
}) => {
  const [menuTerbuka, setMenuTerbuka] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  
  const gayaTerpilih = daftarGayaRespons.find(g => g.id === gayaResponsTerpilih);
  
  useEffect(() => {
    const handleKlikLuar = (event: MouseEvent) => {
      if (
        menuRef.current && 
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node) 
      ) {
        setMenuTerbuka(false);
      }
    };
    
    document.addEventListener('mousedown', handleKlikLuar);
    return () => {
      document.removeEventListener('mousedown', handleKlikLuar);
    };
  }, []);
  
  const toggleMenu = () => {
    if (!disabled) {
      setMenuTerbuka(!menuTerbuka);
    }
  };
  
  const pilihGayaRespons = (gayaId: string) => {
    mengubahGayaRespons(gayaId);
    setMenuTerbuka(false);
  };
  
  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={toggleMenu}
        disabled={disabled}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
          disabled
            ? 'opacity-50 cursor-not-allowed bg-black/5 dark:bg-white/5'
            : 'hover:bg-black/10 dark:hover:bg-white/10 bg-black/5 dark:bg-white/5'
        }`}
        title="Pilih gaya respons AI"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="4 17 10 11 4 5"></polyline>
          <line x1="12" y1="19" x2="20" y2="19"></line>
        </svg>
        <span className="text-sm">
          {gayaTerpilih?.nama || 'Santai'}
        </span>
      </button>
      
      {menuTerbuka && (
        <div
          ref={menuRef}
          className="absolute bottom-full left-0 mb-2 w-64 bg-background/95 border border-black/10 dark:border-white/10 rounded-lg shadow-lg backdrop-blur-sm z-20 overflow-hidden"
        >
          <div className="p-2">
            <h3 className="text-xs text-center font-medium mb-1">Gaya Respons AI</h3>
            <p className="text-xs text-foreground/50 text-center mb-2">
              Pilih bagaimana AI harus menjawab
            </p>
          </div>
          <ul className="max-h-56 overflow-y-auto">
            {daftarGayaRespons.map((gaya) => (
              <li
                key={gaya.id}
                className={`px-3 py-2 cursor-pointer transition-colors hover:bg-black/5 dark:hover:bg-white/5 ${
                  gayaResponsTerpilih === gaya.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                }`}
                onClick={() => pilihGayaRespons(gaya.id)}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm">{gaya.nama}</span>
                  {gayaResponsTerpilih === gaya.id && (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  )}
                </div>
                <p className="text-xs text-foreground/70 mt-1">{gaya.deskripsi}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default GayaResponsSelector;
