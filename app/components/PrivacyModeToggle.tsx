'use client';

import React from 'react';

interface PrivacyModeToggleProps {
  isPrivacyMode: boolean;
  togglePrivacyMode: () => void;
}

const PrivacyModeToggle: React.FC<PrivacyModeToggleProps> = ({ 
  isPrivacyMode, 
  togglePrivacyMode 
}) => {
  return (
    <div className="flex items-center">
      <label className="inline-flex items-center cursor-pointer">
        <input 
          type="checkbox" 
          className="sr-only peer" 
          checked={isPrivacyMode}
          onChange={togglePrivacyMode}
        />
        <div className={`
          relative w-11 h-6 rounded-full 
          peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300
          ${isPrivacyMode ? 'bg-blue-500' : 'bg-gray-600'}
          after:content-[''] after:absolute after:top-[2px] after:left-[2px]
          after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all
          ${isPrivacyMode ? 'after:translate-x-5' : ''}
        `}></div>
        <span className="ml-3 text-sm font-medium text-foreground/70">
          Mode Privasi
          <span className={`ml-1.5 px-2 py-0.5 text-xs rounded-full ${isPrivacyMode ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'}`}>
            {isPrivacyMode ? 'Aktif' : 'Nonaktif'}
          </span>
        </span>
      </label>
      <div className="relative ml-1 group">
        <button className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
        </button>
        <div className="absolute z-10 -right-4 bottom-full mb-2 hidden group-hover:block w-64 bg-foreground text-background text-xs rounded-md p-2 shadow-lg">
          <p>Mode Privasi: Ketika diaktifkan, percakapan tidak akan disimpan di localStorage. Perubahan ini akan berlaku untuk semua percakapan baru.</p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyModeToggle;
