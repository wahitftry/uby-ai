'use client';

import React, { useState } from 'react';
import { TemplatePromptType } from '../types/chat';

interface TemplatePromptSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: TemplatePromptType) => void;
  templates: TemplatePromptType[];
}

const TemplatePromptSelector: React.FC<TemplatePromptSelectorProps> = ({
  isOpen,
  onClose,
  onSelectTemplate,
  templates
}) => {
  const [filterKategori, setFilterKategori] = useState<string>('');
  const [pencarian, setPencarian] = useState<string>('');
  
  const categories = Array.from(new Set(
    templates
      .map(template => template.kategori)
      .filter((kategori): kategori is string => Boolean(kategori))
  ));
  
  const filteredTemplates = templates.filter(template => {
    const matchesCategory = filterKategori ? template.kategori === filterKategori : true;
    const matchesSearch = pencarian.trim() === '' ? true : 
      (template.nama.toLowerCase().includes(pencarian.toLowerCase()) || 
       template.deskripsi.toLowerCase().includes(pencarian.toLowerCase()) ||
       template.template.toLowerCase().includes(pencarian.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });
  
  const handleSelectTemplate = (template: TemplatePromptType) => {
    onSelectTemplate(template);
    onClose();
  };
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white/90 dark:bg-gray-900/90 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-black/10 dark:border-white/10 backdrop-blur-md">
        <div className="p-4 border-b border-black/10 dark:border-white/10 flex justify-between items-center bg-gradient-to-r from-white/50 to-white/30 dark:from-gray-800/50 dark:to-gray-900/30">
          <h2 className="text-lg font-semibold">Pilih Template</h2>
          <button 
            onClick={onClose}
            className="text-foreground/70 hover:text-foreground transition-colors p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        
        <div className="p-5 bg-white/50 dark:bg-gray-900/50 backdrop-blur-md">
          <div className="flex items-center gap-2 mb-4">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Cari template..."
                className="w-full px-10 py-2.5 bg-white dark:bg-gray-800 rounded-xl placeholder:text-foreground/40 text-sm border border-black/5 dark:border-white/10 shadow-sm focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 focus:outline-none transition-all"
                value={pencarian}
                onChange={(e) => setPencarian(e.target.value)}
              />
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="absolute left-3 top-3 w-4 h-4 text-foreground/40">
                <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
              </svg>
              {pencarian && (
                <button 
                  onClick={() => setPencarian('')}
                  className="absolute right-3 top-3 text-foreground/40 hover:text-foreground/70"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                    <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                  </svg>
                </button>
              )}
            </div>
            
            <select
              value={filterKategori}
              onChange={(e) => setFilterKategori(e.target.value)}
              className="bg-white dark:bg-gray-800 border border-black/5 dark:border-white/10 rounded-xl p-2.5 text-sm outline-none shadow-sm focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50"
            >
              <option value="">Semua Kategori</option>
              {categories.map((kategori) => (
                <option key={kategori} value={kategori}>{kategori}</option>
              ))}
            </select>
          </div>
          
          <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700">
            {filteredTemplates.length === 0 ? (
              <div className="text-center py-10 text-foreground/60">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mx-auto text-foreground/30 mb-3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
                Tidak ada template yang cocok dengan pencarian.
              </div>
            ) : (
              filteredTemplates.map((template) => (
                <div 
                  key={template.id} 
                  onClick={() => handleSelectTemplate(template)}
                  className="border border-black/5 dark:border-white/10 rounded-xl p-4 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 hover:border-blue-200 dark:hover:border-blue-800 transition-all cursor-pointer bg-white/80 dark:bg-black/20 group"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{template.nama}</h3>
                      {template.deskripsi && <p className="text-sm text-foreground/70 mt-0.5">{template.deskripsi}</p>}
                      {template.kategori && (
                        <div className="mt-2">
                          <span className="inline-block bg-black/5 dark:bg-white/10 px-2 py-0.5 rounded-md text-xs text-foreground/70 font-medium">
                            {template.kategori}
                          </span>
                        </div>
                      )}
                    </div>
                    <button
                      className="p-1.5 text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                      title="Gunakan Template"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectTemplate(template);
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                        <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                  
                  {(template.modelDisarankan || template.gayaResponsDisarankan) && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {template.modelDisarankan && (
                        <span className="text-xs px-2 py-1 bg-purple-100/80 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full font-medium">
                          Model: {template.modelDisarankan}
                        </span>
                      )}
                      {template.gayaResponsDisarankan && (
                        <span className="text-xs px-2 py-1 bg-green-100/80 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full font-medium">
                          Gaya: {template.gayaResponsDisarankan}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplatePromptSelector;
