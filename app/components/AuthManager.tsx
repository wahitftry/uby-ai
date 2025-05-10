'use client';

import React, { useState, useEffect } from 'react';
import { hashKunci } from '../utils/enkripsi';

interface AuthManagerProps {
  onLogin: (kunci: string) => void;
  onLogout: () => void;
  isAuthenticated: boolean;
}

const AuthManager: React.FC<AuthManagerProps> = ({ onLogin, onLogout, isAuthenticated }) => {
  const [kunci, setKunci] = useState<string>('');
  const [simpanKunci, setSimpanKunci] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const kunciTersimpan = localStorage.getItem('wahit_kunci_hash');
    if (kunciTersimpan) {
      const kunciDecoded = atob(kunciTersimpan);
      if (kunciDecoded && kunciDecoded.length > 0) {
        onLogin(kunciDecoded);
      }
    }
  }, [onLogin]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (kunci.length < 6) {
      setError('Kunci harus minimal 6 karakter');
      return;
    }
    
    setError(null);
    onLogin(kunci);
    
    if (simpanKunci) {
      const kunciEncoded = btoa(kunci);
      localStorage.setItem('wahit_kunci_hash', kunciEncoded);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('wahit_kunci_hash');
    setKunci('');
    onLogout();
  };

  if (isAuthenticated) {
    return (
      <div className="flex items-center gap-2">
        <button 
          onClick={handleLogout}
          className="px-3 py-1 text-xs rounded-md bg-red-500 text-white hover:bg-red-600 transition-colors"
        >
          Keluar
        </button>
        <div className="text-xs text-green-500">
          <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-1"></span>
          Terautentikasi
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-3 bg-background/70 backdrop-blur-sm border border-black/5 dark:border-white/5 rounded-lg shadow-sm">
      <h3 className="text-sm font-medium mb-2">Autentikasi</h3>
      
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <input
            type="password"
            placeholder="Masukkan kunci enkripsi"
            value={kunci}
            onChange={(e) => setKunci(e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-md bg-background border border-black/10 dark:border-white/10 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </div>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            id="simpanKunci"
            checked={simpanKunci}
            onChange={() => setSimpanKunci(!simpanKunci)}
            className="mr-2"
          />
          <label htmlFor="simpanKunci" className="text-xs text-foreground/70">
            Ingat kunci saya
          </label>
        </div>
        
        <button
          type="submit"
          className="w-full px-3 py-2 text-sm rounded-md bg-blue-500 text-white hover:bg-blue-600 transition-colors"
        >
          Masuk
        </button>
      </form>
      
      <p className="mt-3 text-xs text-foreground/60">
        Kunci ini digunakan untuk mengenkripsi data percakapan Anda.
      </p>
    </div>
  );
};

export default AuthManager;
