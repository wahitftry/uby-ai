'use client';

import React, { useState } from 'react';
import { ModelAIType } from '../types/chat';

interface ModelSelectorProps {
  modelTerpilih: string;
  mengubahModel: (modelId: string) => void;
  daftarModel: ModelAIType[];
}

const ModelSelector: React.FC<ModelSelectorProps> = ({ modelTerpilih, mengubahModel, daftarModel }) => {
  const [menuTerbuka, setMenuTerbuka] = useState(false);

  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        className="inline-flex items-center gap-2 px-3 py-1.5 text-xs md:text-sm rounded-lg border border-white/5 bg-white/5 text-foreground/70 hover:bg-white/10 transition-colors"
        onClick={() => setMenuTerbuka(!menuTerbuka)}
      >
        <span>Model: {daftarModel.find(model => model.id === modelTerpilih)?.nama || 'Default'}</span>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
        </svg>      </button>
        
      {menuTerbuka && (
        <div className="absolute right-0 bottom-full mb-1 w-60 origin-bottom-right rounded-xl shadow-xl border border-black/5 dark:border-white/10 bg-white/90 dark:bg-black/90 backdrop-blur-md z-50 max-h-[300px] overflow-y-auto">
          <div className="py-1">
            {daftarModel.map(model => (
              <button
                key={model.id}
                className={`block w-full text-left px-4 py-2 text-sm hover:bg-black/5 dark:hover:bg-white/10 transition-colors ${modelTerpilih === model.id ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 font-medium' : 'text-foreground/70'}`}
                onClick={() => {
                  mengubahModel(model.id);
                  setMenuTerbuka(false);
                }}
              >
                {model.nama}
              </button>
            ))}
          </div>
        </div>
      )}

      {menuTerbuka && (
        <div className="fixed inset-0 z-40" onClick={() => setMenuTerbuka(false)}></div>
      )}
    </div>
  );
};

export default ModelSelector;
