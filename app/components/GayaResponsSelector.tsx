import React, { useState, useRef, useEffect } from 'react';
import { 
  daftarGayaRespons, 
  getGayaResponsSekarang, 
  setGayaResponsSekarang, 
  getDaftarGayaResponsGabungan, 
  getDaftarGayaResponsKustom, 
  simpanGayaResponsKustom,
  hapusGayaResponsKustom 
} from '../api/chatService';
import CustomResponseStyleManager from './CustomResponseStyleManager';
import { GayaResponsKustom } from '../types/chat';

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
  const [managerTerbuka, setManagerTerbuka] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  
  const daftarGayaGabungan = getDaftarGayaResponsGabungan();
  const daftarGayaKustom = getDaftarGayaResponsKustom();
  const gayaTerpilih = daftarGayaGabungan.find(g => g.id === gayaResponsTerpilih);
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
    const handleSimpanGayaKustom = (gaya: GayaResponsKustom) => {
    simpanGayaResponsKustom(gaya);
  };
  
  const handleHapusGayaKustom = (id: string) => {
    hapusGayaResponsKustom(id);
  };
  
  const handleSelectGayaKustom = (id: string) => {
    mengubahGayaRespons(id);
    setManagerTerbuka(false);
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
        {gayaTerpilih?.isKustom && (
          <span className="text-xs px-1 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded">Kustom</span>
        )}
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
          </div>          <div className="p-2 border-t border-black/10 dark:border-white/10">
            <button
              onClick={() => {
                setMenuTerbuka(false);
                setManagerTerbuka(true);
              }}
              className="w-full text-xs flex items-center justify-center gap-1 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 py-1 rounded transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                <path d="M13.5 4.938a7 7 0 11-9.417 1.172 7 7 0 019.416-1.172zM2.5 8a5.5 5.5 0 1111 0 5.5 5.5 0 01-11 0z" />
                <path d="M10.25 8a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5a.75.75 0 01.75-.75zM10.25 5a.75.75 0 01.75.75v.25a.75.75 0 01-1.5 0v-.25a.75.75 0 01.75-.75z" />
              </svg>
              Kelola Gaya Respons
            </button>
          </div>

          <ul className="max-h-56 overflow-y-auto border-t border-black/10 dark:border-white/10">
            {daftarGayaGabungan.map((gaya) => (
              <li
                key={gaya.id}
                className={`px-3 py-2 cursor-pointer transition-colors hover:bg-black/5 dark:hover:bg-white/5 ${
                  gayaResponsTerpilih === gaya.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                }`}
                onClick={() => pilihGayaRespons(gaya.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="font-medium text-sm">{gaya.nama}</span>
                    {gaya.isKustom && (
                      <span className="text-xs px-1 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded">Kustom</span>
                    )}
                  </div>
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
      
      <CustomResponseStyleManager
        isOpen={managerTerbuka}
        onClose={() => setManagerTerbuka(false)}
        daftarGayaResponsKustom={daftarGayaKustom}
        onSaveGayaRespons={handleSimpanGayaKustom}
        onDeleteGayaRespons={handleHapusGayaKustom}
        onSelectGayaRespons={handleSelectGayaKustom}
      />
    </div>
  );
};

export default GayaResponsSelector;
