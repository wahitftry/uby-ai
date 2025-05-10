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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center p-4">
      <div className="bg-background rounded-xl shadow-lg w-full max-w-lg overflow-hidden">
        <div className="p-4 border-b border-black/10 dark:border-white/10 flex justify-between items-center">
          <h2 className="text-lg font-semibold">Pilih Template</h2>
          <button 
            onClick={onClose}
            className="text-foreground/70 hover:text-foreground transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        
        <div className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Cari template..."
                className="w-full px-8 py-2 bg-black/5 dark:bg-white/5 rounded-lg placeholder:text-foreground/40 text-sm"
                value={pencarian}
                onChange={(e) => setPencarian(e.target.value)}
              />
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="absolute left-2 top-2.5 w-4 h-4 text-foreground/40">
                <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
              </svg>
            </div>
            
            <select
              value={filterKategori}
              onChange={(e) => setFilterKategori(e.target.value)}
              className="bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-lg p-2 text-sm outline-none"
            >
              <option value="">Semua Kategori</option>
              {categories.map((kategori) => (
                <option key={kategori} value={kategori}>{kategori}</option>
              ))}
            </select>
          </div>
          
          <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
            {filteredTemplates.length === 0 ? (
              <div className="text-center py-8 text-foreground/60">
                Tidak ada template yang cocok dengan pencarian.
              </div>
            ) : (
              filteredTemplates.map((template) => (
                <div 
                  key={template.id} 
                  onClick={() => handleSelectTemplate(template)}
                  className="border border-black/5 dark:border-white/10 rounded-lg p-3 hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{template.nama}</h3>
                      {template.deskripsi && <p className="text-sm text-foreground/70">{template.deskripsi}</p>}
                      {template.kategori && (
                        <div className="mt-1">
                          <span className="inline-block bg-black/5 dark:bg-white/5 px-2 py-0.5 rounded text-xs text-foreground/70">
                            {template.kategori}
                          </span>
                        </div>
                      )}
                    </div>
                    <button
                      className="p-1 text-blue-500 hover:bg-blue-500/10 rounded transition-colors"
                      title="Gunakan Template"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectTemplate(template);
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                        <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                  
                  {(template.modelDisarankan || template.gayaResponsDisarankan) && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {template.modelDisarankan && (
                        <span className="text-xs px-1.5 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded">
                          Model: {template.modelDisarankan}
                        </span>
                      )}
                      {template.gayaResponsDisarankan && (
                        <span className="text-xs px-1.5 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded">
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
