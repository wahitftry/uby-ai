'use client';

import React, { useState } from 'react';
import { ModelAIType } from '../types/chat';

interface SearchAdvancedProps {
  onSearch: (filter: SearchFilter) => void;
  daftarModel: ModelAIType[];
  isOpen: boolean;
  onClose: () => void;
}

export interface SearchFilter {
  keyword: string;
  tanggalMulai: string | null;
  tanggalSelesai: string | null;
  modelAI: string[];
  bookmark: boolean | null;
}

const SearchAdvanced: React.FC<SearchAdvancedProps> = ({
  onSearch,
  daftarModel,
  isOpen,
  onClose
}) => {
  const [filter, setFilter] = useState<SearchFilter>({
    keyword: '',
    tanggalMulai: null,
    tanggalSelesai: null,
    modelAI: [],
    bookmark: null
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox' && e.target instanceof HTMLInputElement) {
      const { checked } = e.target;
      if (name === 'bookmark') {
        setFilter(prev => ({ ...prev, [name]: checked ? true : null }));
      } else if (name.startsWith('model-')) {
        const modelId = name.replace('model-', '');
        
        setFilter(prev => {
          const newModelAI = [...prev.modelAI];
          
          if (checked) {
            if (!newModelAI.includes(modelId)) {
              newModelAI.push(modelId);
            }
          } else {
            const index = newModelAI.indexOf(modelId);
            if (index !== -1) {
              newModelAI.splice(index, 1);
            }
          }
          
          return { ...prev, modelAI: newModelAI };
        });
      }
    } else {
      setFilter(prev => ({ ...prev, [name]: value || null }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(filter);
    onClose();
  };

  const resetFilter = () => {
    setFilter({
      keyword: '',
      tanggalMulai: null,
      tanggalSelesai: null,
      modelAI: [],
      bookmark: null
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-background rounded-xl shadow-lg w-full max-w-md overflow-hidden">
        <div className="p-4 border-b border-black/10 dark:border-white/10 flex justify-between items-center">
          <h2 className="text-lg font-semibold">Pencarian Lanjutan</h2>
          <button 
            onClick={onClose}
            className="text-foreground/70 hover:text-foreground transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Kata Kunci</label>
              <input
                type="text"
                name="keyword"
                value={filter.keyword || ''}
                onChange={handleChange}
                className="w-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-lg p-2 text-sm outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Cari berdasarkan kata kunci..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Tanggal Mulai</label>
                <input
                  type="date"
                  name="tanggalMulai"
                  value={filter.tanggalMulai || ''}
                  onChange={handleChange}
                  className="w-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-lg p-2 text-sm outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Tanggal Selesai</label>
                <input
                  type="date"
                  name="tanggalSelesai"
                  value={filter.tanggalSelesai || ''}
                  onChange={handleChange}
                  className="w-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-lg p-2 text-sm outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Model AI</label>
              <div className="grid grid-cols-2 gap-2">
                {daftarModel.map(model => (
                  <label key={model.id} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name={`model-${model.id}`}
                      checked={filter.modelAI.includes(model.id)}
                      onChange={handleChange}
                      className="rounded text-blue-500 focus:ring-blue-500"
                    />
                    <span className="text-sm">{model.nama}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="bookmark"
                  checked={filter.bookmark === true}
                  onChange={handleChange}
                  className="rounded text-blue-500 focus:ring-blue-500"
                />
                <span className="text-sm">Hanya percakapan yang dibookmark</span>
              </label>
            </div>
          </div>

          <div className="mt-6 flex justify-between">
            <button
              type="button"
              onClick={resetFilter}
              className="px-4 py-2 text-sm border border-black/10 dark:border-white/10 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            >
              Reset
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Cari
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SearchAdvanced;
