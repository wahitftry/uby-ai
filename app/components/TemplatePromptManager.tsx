'use client';

import React, { useState, useEffect } from 'react';
import { TemplatePromptType } from '../types/chat';
import TemplatePromptEditor from './TemplatePromptEditor';

interface TemplatePromptManagerProps {
  isOpen: boolean;
  onClose: () => void;
  daftarTemplate: TemplatePromptType[];
  onSaveTemplate: (template: TemplatePromptType) => void;
  onDeleteTemplate: (id: string) => void;
  onSelectTemplate: (template: TemplatePromptType) => void;
}

const TemplatePromptManager: React.FC<TemplatePromptManagerProps> = ({
  isOpen,
  onClose,
  daftarTemplate,
  onSaveTemplate,
  onDeleteTemplate,
  onSelectTemplate
}) => {
  const [showEditor, setShowEditor] = useState<boolean>(false);
  const [templateEdit, setTemplateEdit] = useState<TemplatePromptType | null>(null);
  const [filterKategori, setFilterKategori] = useState<string>('');
  const [pencarian, setPencarian] = useState<string>('');
  const [daftarKategori, setDaftarKategori] = useState<string[]>([]);
  
  useEffect(() => {
    const categories = daftarTemplate
      .map(template => template.kategori)
      .filter((kategori): kategori is string => Boolean(kategori));
    
    const uniqueCategories = Array.from(new Set(categories));
    setDaftarKategori(uniqueCategories);
  }, [daftarTemplate]);
  
  const handleEdit = (template: TemplatePromptType) => {
    setTemplateEdit(template);
    setShowEditor(true);
  };
  
  const handleCreate = () => {
    setTemplateEdit(null);
    setShowEditor(true);
  };
  
  const handleDelete = (id: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus template prompt ini?")) {
      onDeleteTemplate(id);
    }
  };
  
  const handleSave = (template: TemplatePromptType) => {
    onSaveTemplate(template);
    setShowEditor(false);
  };
  
  const filteredTemplates = daftarTemplate.filter(template => {
    const matchesCategory = filterKategori ? template.kategori === filterKategori : true;
    const matchesSearch = pencarian.trim() === '' ? true : 
      (template.nama.toLowerCase().includes(pencarian.toLowerCase()) || 
       template.deskripsi.toLowerCase().includes(pencarian.toLowerCase()) ||
       template.template.toLowerCase().includes(pencarian.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center p-4">
        <div className="bg-background rounded-xl shadow-lg w-full max-w-2xl overflow-hidden">
          <div className="p-4 border-b border-white/10 flex justify-between items-center">
            <h2 className="text-lg font-semibold">Template Prompt</h2>
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
            <button
              onClick={handleCreate}
              className="mb-4 w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
              </svg>
              Buat Template Prompt
            </button>
            
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
                {daftarKategori.map((kategori) => (
                  <option key={kategori} value={kategori}>{kategori}</option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredTemplates.length === 0 ? (
                <div className="text-center py-8 text-foreground/60">
                  {pencarian || filterKategori ? 
                    'Tidak ada template yang cocok dengan pencarian.' : 
                    'Anda belum membuat template prompt.'}
                </div>
              ) : (
                filteredTemplates.map((template) => (
                  <div key={template.id} className="border border-black/5 dark:border-white/10 rounded-lg p-3 hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
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
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => onSelectTemplate(template)}
                          className="p-1 text-blue-500 hover:bg-blue-500/10 rounded transition-colors"
                          title="Gunakan Template"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                            <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleEdit(template)}
                          className="p-1 text-foreground/60 hover:bg-black/5 dark:hover:bg-white/5 rounded transition-colors"
                          title="Edit"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                            <path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" />
                            <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(template.id)}
                          className="p-1 text-red-500 hover:bg-red-500/10 rounded transition-colors"
                          title="Hapus"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                            <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    
                    <div className="mt-2 text-xs bg-black/5 dark:bg-white/5 rounded p-2 max-h-20 overflow-y-auto whitespace-pre-wrap">
                      {template.template}
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

      <TemplatePromptEditor 
        isOpen={showEditor}
        onClose={() => setShowEditor(false)}
        onSave={handleSave}
        templateEdit={templateEdit}
        kategoriTersedia={daftarKategori}
      />
    </>
  );
};

export default TemplatePromptManager;
