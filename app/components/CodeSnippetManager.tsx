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
    const confirmBox = document.createElement('div');
    confirmBox.className = 'fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4';
    
    confirmBox.innerHTML = `
      <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-fadeIn">
        <div class="p-5 border-b border-black/10 dark:border-white/10">
          <h3 class="text-lg font-semibold">Konfirmasi Hapus</h3>
        </div>
        <div class="p-5">
          <p class="mb-6">Apakah Anda yakin ingin menghapus snippet kode ini?</p>
          <div class="flex justify-end gap-3">
            <button id="cancelDelete" class="px-4 py-2.5 rounded-xl border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg.white/5 transition-colors text-foreground/70 hover:text-foreground text-sm font-medium">
              Batal
            </button>
            <button id="confirmDelete" class="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white transition-colors text-sm font-medium">
              Hapus
            </button>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(confirmBox);
    
    document.getElementById('cancelDelete')?.addEventListener('click', () => {
      document.body.removeChild(confirmBox);
    });
    
    document.getElementById('confirmDelete')?.addEventListener('click', () => {
      onDeleteSnippet(id);
      document.body.removeChild(confirmBox);
    });
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
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 flex items-center justify-center p-4 animate-fadeIn">
        <div className="bg-white/90 dark:bg-gray-900/90 rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden backdrop-blur-md border border-black/10 dark:border-white/10">
          <div className="p-4 border-b border-black/10 dark:border-white/10 flex justify-between items-center bg-gradient-to-r from-white/50 to-white/30 dark:from-gray-800/50 dark:to-gray-900/30">
            <h2 className="text-lg font-semibold">Kumpulan Snippet Kode</h2>
            <button 
              onClick={onClose}
              className="text-foreground/70 hover:text-foreground transition-colors p-1 rounded-full hover:bg-black/5 dark:hover:bg.white/10"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          
          <div className="p-5">
            <button
              onClick={handleCreate}
              className="mb-5 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-3 rounded-xl text-sm transition-all font-medium shadow-sm hover:shadow-md"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
              </svg>
              Tambah Snippet Kode
            </button>
            
            <div className="flex items-center gap-2 mb-4">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Cari snippet..."
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
                className="bg-white dark:bg-gray-800 border border-black/5 dark:border-white/10 rounded-xl px-3 py-2.5 text-sm outline-none shadow-sm focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50"
              >
                <option value="">Semua Kategori</option>
                {daftarKategori.map((kategori) => (
                  <option key={kategori} value={kategori}>{kategori}</option>
                ))}
              </select>
              
              <select
                value={filterBahasa}
                onChange={(e) => setFilterBahasa(e.target.value)}
                className="bg-white dark:bg-gray-800 border border-black/5 dark:border-white/10 rounded-xl px-3 py-2.5 text-sm outline-none shadow-sm focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50"
              >
                <option value="">Semua Bahasa</option>
                {daftarBahasa.map((bahasa) => (
                  <option key={bahasa} value={bahasa}>{bahasa.charAt(0).toUpperCase() + bahasa.slice(1)}</option>
                ))}
              </select>
            </div>
            
            <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700">
              {filteredSnippets.length === 0 ? (
                <div className="text-center py-12 text-foreground/60">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mx-auto text-foreground/30 mb-3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 9.75L16.5 12l-2.25 2.25m-4.5 0L7.5 12l2.25-2.25M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />
                  </svg>
                  {pencarian || filterKategori || filterBahasa ? 
                    'Tidak ada snippet yang cocok dengan pencarian.' : 
                    'Anda belum membuat snippet kode.'}
                </div>
              ) : (
                filteredSnippets.map((snippet) => (
                  <div key={snippet.id} className="border border-black/5 dark:border-white/10 rounded-xl p-4 hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all bg-white/60 dark:bg-gray-800/40 group">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{snippet.nama}</h3>
                        {snippet.deskripsi && <p className="text-sm text-foreground/70 mt-0.5">{snippet.deskripsi}</p>}
                        <div className="mt-2 flex flex-wrap gap-2">
                          {snippet.kategori && (
                            <span className="inline-block bg-black/5 dark:bg.white/10 px-2.5 py-1 rounded-md text-xs text-foreground/70 font-medium">
                              {snippet.kategori}
                            </span>
                          )}
                          <span className="inline-block bg-purple-100/80 dark:bg-purple-900/30 px-2.5 py-1 rounded-md text-xs text-purple-700 dark:text-purple-300 font-medium">
                            {snippet.bahasa.charAt(0).toUpperCase() + snippet.bahasa.slice(1)}
                          </span>
                          {snippet.tag && snippet.tag.map(tag => (
                            <span key={tag} className="inline-block bg-blue-100/80 dark:bg-blue-900/30 px-2.5 py-1 rounded-full text-xs text-blue-700 dark:text-blue-300 font-medium">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => onSelectSnippet(snippet)}
                          className="p-2 text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors"
                          title="Gunakan Snippet"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                            <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleEdit(snippet)}
                          className="p-2 text-foreground/60 hover:bg-black/5 dark:hover:bg.white/5 hover:text-foreground/90 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                            <path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" />
                            <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(snippet.id)}
                          className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                          title="Hapus"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                            <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    
                    <div className="mt-3 text-xs bg-black/5 dark:bg.white/5 rounded-lg p-3 max-h-24 overflow-y-auto whitespace-pre-wrap font-mono">
                      {snippet.kode}
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
