'use client';

import React, { useState } from 'react';

interface EncryptionAlertProps {
  onUnlock: (kunci: string) => void;
  onCancel: () => void;
}

const EncryptionAlert: React.FC<EncryptionAlertProps> = ({ onUnlock, onCancel }) => {
  const [kunci, setKunci] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!kunci || kunci.length < 1) {
      setError('Masukkan kunci untuk membuka percakapan');
      return;
    }
    
    setError(null);
    onUnlock(kunci);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-background rounded-lg shadow-lg p-6 max-w-md w-full mx-4">
        <div className="mb-4 flex items-center text-amber-500">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            <path d="M8 11h8"></path>
            <path d="M12 15V7"></path>
          </svg>
          <h3 className="text-lg font-medium">Percakapan Terenkripsi</h3>
        </div>
        
        <p className="text-sm text-foreground/70 mb-4">
          Percakapan ini diproteksi dan memerlukan kunci untuk membukanya. Masukkan kunci yang benar untuk melihat isi percakapan.
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="password"
              placeholder="Masukkan kunci enkripsi"
              value={kunci}
              onChange={(e) => setKunci(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-md bg-background border border-white/10 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
          </div>
          
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm rounded-md border border-black/10 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm rounded-md bg-blue-500 text-white hover:bg-blue-600 transition-colors"
            >
              Buka
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EncryptionAlert;
