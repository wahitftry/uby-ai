'use client';

import React, { useState, useEffect } from 'react';
import { CodeSnippetType } from '../types/chat';
import CodeSnippetEditor from './CodeSnippetEditor';

interface CodeSnippetManagerProps {
  isOpen: boolean;
  onClose: () => void;
  daftarSnippet: CodeSnippetType[];
  onSaveSnippet: (snippet: CodeSnippetType) => void;
  onDeleteSnippet: (id: string) => void;
  onSelectSnippet: (snippet: CodeSnippetType) => void;
}

const CodeSnippetManager: React.FC<CodeSnippetManagerProps> = ({
  isOpen,
  onClose,
  daftarSnippet,
  onSaveSnippet,
  onDeleteSnippet,
  onSelectSnippet
}) => {
  const [showEditor, setShowEditor] = useState<boolean>(false);
  const [snippetEdit, setSnippetEdit] = useState<CodeSnippetType | null>(null);
  const [filterKategori, setFilterKategori] = useState<string>('');
  const [filterBahasa, setFilterBahasa] = useState<string>('');
  const [pencarian, setPencarian] = useState<string>('');
  const [daftarKategori, setDaftarKategori] = useState<string[]>([]);
  const [daftarBahasa, setDaftarBahasa] = useState<string[]>([]);
  
  useEffect(() => {
    const categories = daftarSnippet
      .map(snippet => snippet.kategori)
      .filter((kategori): kategori is string => Boolean(kategori)); 
    
    const languages = daftarSnippet
      .map(snippet => snippet.bahasa)
      .filter((bahasa): bahasa is string => Boolean(bahasa));
    
    const uniqueCategories = Array.from(new Set(categories));
    const uniqueLanguages = Array.from(new Set(languages));
    
    setDaftarKategori(uniqueCategories);
    setDaftarBahasa(uniqueLanguages);
  }, [daftarSnippet]);
  
  const handleEdit = (snippet: CodeSnippetType) => {
    setSnippetEdit(snippet);
    setShowEditor(true);
  };
  
  const handleCreate = () => {
    setSnippetEdit(null);
    setShowEditor(true);
  };
  
  const handleDelete = (id: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus snippet kode ini?")) {
      onDeleteSnippet(id);
    }
  };
  
  const handleSave = (snippet: CodeSnippetType) => {
    onSaveSnippet(snippet);
    setShowEditor(false);
  };
  
  const filteredSnippets = daftarSnippet.filter(snippet => {
    const matchesCategory = filterKategori ? snippet.kategori === filterKategori : true;
    const matchesLanguage = filterBahasa ? snippet.bahasa === filterBahasa : true;
    const matchesSearch = pencarian.trim() === '' ? true : 
      (snippet.nama.toLowerCase().includes(pencarian.toLowerCase()) || 
       (snippet.deskripsi || '').toLowerCase().includes(pencarian.toLowerCase()) ||
       snippet.kode.toLowerCase().includes(pencarian.toLowerCase()) ||
       (snippet.tag || []).some(tag => tag.toLowerCase().includes(pencarian.toLowerCase())));
    
    return matchesCategory && matchesLanguage && matchesSearch;
  });

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden border border-black/10 dark:border-white/10">
          <div className="p-4 border-b border-black/10 dark:border-white/10 flex justify-between items-center bg-white/70 dark:bg-black/70 backdrop-blur-md">
            <h2 className="text-lg font-semibold">Kumpulan Snippet Kode</h2>
            <button 
              onClick={onClose}
              className="text-foreground/70 hover:text-foreground transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          
          <div className="p-4 bg-white/50 dark:bg-gray-900/50 backdrop-blur-md">
            <button
              onClick={handleCreate}
              className="mb-4 w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
              </svg>
              Tambah Snippet Kode
            </button>
            
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Cari snippet..."
                  className="w-full px-8 py-2 bg-black/5 dark:bg-white/5 rounded-lg placeholder:text-foreground/40 text-sm border border-black/5 dark:border-white/10"
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
              
              <select
                value={filterBahasa}
                onChange={(e) => setFilterBahasa(e.target.value)}
                className="bg-black/5 dark:bg.white/5 border border-black/5 dark:border-white/10 rounded-lg p-2 text-sm outline-none"
              >
                <option value="">Semua Bahasa</option>
                {daftarBahasa.map((bahasa) => (
                  <option key={bahasa} value={bahasa}>{bahasa}</option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2 max-h-96 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700">
              {filteredSnippets.length === 0 ? (
                <div className="text-center py-8 text-foreground/60">
                  {pencarian || filterKategori || filterBahasa ? 
                    'Tidak ada snippet yang cocok dengan pencarian.' : 
                    'Anda belum membuat snippet kode.'}
                </div>
              ) : (
                filteredSnippets.map((snippet) => (
                  <div key={snippet.id} className="border border-black/5 dark:border-white/10 rounded-lg p-3 hover:bg-black/5 dark:hover:bg-white/10 transition-colors bg-white/20 dark:bg-white/5">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{snippet.nama}</h3>
                        {snippet.deskripsi && <p className="text-sm text-foreground/70">{snippet.deskripsi}</p>}
                        <div className="mt-1 flex flex-wrap gap-2">
                          {snippet.kategori && (
                            <span className="inline-block bg-black/5 dark:bg.white/10 px-2 py-0.5 rounded text-xs text-foreground/70">
                              {snippet.kategori}
                            </span>
                          )}
                          <span className="inline-block bg-purple-100 dark:bg-purple-900/30 px-2 py-0.5 rounded text-xs text-purple-700 dark:text-purple-300">
                            {snippet.bahasa}
                          </span>
                          {snippet.tag && snippet.tag.map(tag => (
                            <span key={tag} className="inline-block bg-blue-100 dark:bg-blue-900/30 px-2 py-0.5 rounded-full text-xs text-blue-700 dark:text-blue-300">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => onSelectSnippet(snippet)}
                          className="p-1 text-blue-500 hover:bg-blue-500/10 rounded transition-colors"
                          title="Gunakan Snippet"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                            <path d="M7 3.5A1.5 1.5 0 018.5 2h3.879a1.5 1.5 0 011.06.44l3.122 3.12A1.5 1.5 0 0117 6.622V12.5a1.5 1.5 0 01-1.5 1.5h-1v-3.379a3 3 0 00-.879-2.121L10.5 5.379A3 3 0 008.379 4.5H7v-1z" />
                            <path d="M4.5 6A1.5 1.5 0 003 7.5v9A1.5 1.5 0 004.5 18h7a1.5 1.5 0 001.5-1.5v-5.879a1.5 1.5 0 00-.44-1.06L9.44 6.439A1.5 1.5 0 008.378 6H4.5z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleEdit(snippet)}
                          className="p-1 text-foreground/60 hover:bg-black/5 dark:hover:bg-white/10 rounded transition-colors"
                          title="Edit"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                            <path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" />
                            <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(snippet.id)}
                          className="p-1 text-red-500 hover:bg-red-500/10 rounded transition-colors"
                          title="Hapus"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                            <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    
                    <div className="mt-2">
                      <pre className="text-xs bg-black/10 dark:bg-white/5 rounded p-2 max-h-32 overflow-y-auto font-mono whitespace-pre-wrap">
                        {snippet.kode}
                      </pre>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <CodeSnippetEditor 
        isOpen={showEditor}
        onClose={() => setShowEditor(false)}
        onSave={handleSave}
        snippetEdit={snippetEdit}
        kategoriTersedia={daftarKategori}
      />
    </>
  );
};

export default CodeSnippetManager;
