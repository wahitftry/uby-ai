'use client';

import React, { useState, useEffect } from 'react';
import { CodeSnippetType } from '../types/chat';

interface CodeSnippetEditorProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (snippet: CodeSnippetType) => void;
  snippetEdit?: CodeSnippetType | null;
  kategoriTersedia?: string[];
}

const CodeSnippetEditor: React.FC<CodeSnippetEditorProps> = ({
  isOpen,
  onClose,
  onSave,
  snippetEdit,
  kategoriTersedia = []
}) => {
  const [snippet, setSnippet] = useState<CodeSnippetType>(
    snippetEdit || {
      id: `snippet-${Date.now()}`,
      nama: '',
      deskripsi: '',
      kode: '',
      bahasa: '',
      kategori: '',
      tag: [],
      createdAt: Date.now(),
      updatedAt: Date.now()
    }
  );

  const [errors, setErrors] = useState<{
    nama?: string;
    kode?: string;
    bahasa?: string;
  }>({});
  
  const [kategoriLain, setKategoriLain] = useState<string>('');
  const [tagInput, setTagInput] = useState<string>('');
  
  const daftarBahasa = [
    'javascript', 'typescript', 'python', 'java', 'csharp', 'php', 'ruby', 
    'go', 'rust', 'swift', 'kotlin', 'sql', 'html', 'css', 'bash', 'json',
    'yaml', 'markdown', 'plaintext'
  ];

  useEffect(() => {
    if (isOpen && snippetEdit) {
      setSnippet(snippetEdit);
    } else if (isOpen) {
      setSnippet({
        id: `snippet-${Date.now()}`,
        nama: '',
        deskripsi: '',
        kode: '',
        bahasa: '',
        kategori: '',
        tag: [],
        createdAt: Date.now(),
        updatedAt: Date.now()
      });
      setKategoriLain('');
      setTagInput('');
    }
  }, [isOpen, snippetEdit]);

  const validateForm = (): boolean => {
    const newErrors: {
      nama?: string;
      kode?: string;
      bahasa?: string;
    } = {};

    if (!snippet.nama.trim()) {
      newErrors.nama = 'Nama snippet tidak boleh kosong';
    }

    if (!snippet.kode.trim()) {
      newErrors.kode = 'Kode tidak boleh kosong';
    }

    if (!snippet.bahasa.trim()) {
      newErrors.bahasa = 'Bahasa pemrograman harus dipilih';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSnippet(prev => ({ ...prev, [name]: value }));
    
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let finalSnippet = {...snippet};
    
    if (snippet.kategori === 'lainnya' && kategoriLain) {
      finalSnippet = { ...snippet, kategori: kategoriLain };
    }
    
    if (validateForm()) {
      onSave(finalSnippet);
      onClose();
    }
  };
  
  const handleAddTag = () => {
    if (tagInput.trim() && !snippet.tag?.includes(tagInput.trim())) {
      setSnippet(prev => ({
        ...prev,
        tag: [...(prev.tag || []), tagInput.trim()]
      }));
      setTagInput('');
    }
  };
  
  const handleRemoveTag = (tagToRemove: string) => {
    setSnippet(prev => ({
      ...prev,
      tag: prev.tag?.filter(tag => tag !== tagToRemove) || []
    }));
  };
  
  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white/90 dark:bg-gray-900/90 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden backdrop-blur-md border border-black/10 dark:border-white/10">
        <div className="p-4 border-b border-black/10 dark:border-white/10 flex justify-between items-center bg-gradient-to-r from-white/50 to-white/30 dark:from-gray-800/50 dark:to-gray-900/30">
          <h2 className="text-lg font-semibold">
            {snippetEdit ? 'Edit Snippet Kode' : 'Tambah Snippet Kode'}
          </h2>
          <button 
            onClick={onClose}
            className="text-foreground/70 hover:text-foreground transition-colors p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">Nama Snippet</label>
            <input
              type="text"
              name="nama"
              value={snippet.nama}
              onChange={handleChange}
              className={`w-full bg-white dark:bg-gray-800 border ${
                errors.nama ? 'border-red-500 ring-1 ring-red-500' : 'border-black/10 dark:border-white/20'
              } rounded-xl p-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 transition-all shadow-sm`}
              placeholder="cth. Function JWT, Setup Express, dll"
            />
            {errors.nama && <p className="text-red-500 text-sm mt-1.5 flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
              </svg>
              {errors.nama}
            </p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Deskripsi (Opsional)</label>
            <input
              type="text"
              name="deskripsi"
              value={snippet.deskripsi || ''}
              onChange={handleChange}
              className="w-full bg-white dark:bg-gray-800 border border-black/10 dark:border-white/20 rounded-xl p-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 transition-all shadow-sm"
              placeholder="cth. Function untuk membuat JWT token dengan expiry time"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1.5">Kategori</label>
              <select
                name="kategori"
                value={snippet.kategori}
                onChange={handleChange}
                className="w-full bg-white dark:bg-gray-800 border border-black/10 dark:border-white/20 rounded-xl p-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 transition-all shadow-sm"
              >
                <option value="">Pilih Kategori</option>
                {kategoriTersedia.map((kategori) => (
                  <option key={kategori} value={kategori}>{kategori}</option>
                ))}
                <option value="lainnya">Lainnya</option>
              </select>
            </div>

            {snippet.kategori === 'lainnya' && (
              <div>
                <label className="block text-sm font-medium mb-1.5">Kategori Baru</label>
                <input
                  type="text"
                  value={kategoriLain}
                  onChange={(e) => setKategoriLain(e.target.value)}
                  className="w-full bg-white dark:bg-gray-800 border border-black/10 dark:border-white/20 rounded-xl p-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 transition-all shadow-sm"
                  placeholder="Masukkan kategori baru"
                />
              </div>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1.5">Bahasa Pemrograman</label>
            <select
              name="bahasa"
              value={snippet.bahasa}
              onChange={handleChange}
              className={`w-full bg-white dark:bg-gray-800 border ${
                errors.bahasa ? 'border-red-500 ring-1 ring-red-500' : 'border-black/10 dark:border-white/20'
              } rounded-xl p-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 transition-all shadow-sm`}
            >
              <option value="">Pilih Bahasa</option>
              {daftarBahasa.map((bahasa) => (
                <option key={bahasa} value={bahasa}>{bahasa.charAt(0).toUpperCase() + bahasa.slice(1)}</option>
              ))}
            </select>
            {errors.bahasa && <p className="text-red-500 text-sm mt-1.5 flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
              </svg>
              {errors.bahasa}
            </p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1.5">Tag (Opsional)</label>
            <div className="flex">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagInputKeyDown}
                className="flex-1 bg-white dark:bg-gray-800 border border-black/10 dark:border-white/20 rounded-l-xl p-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 transition-all shadow-sm"
                placeholder="Tambahkan tag"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 rounded-r-xl text-sm font-medium transition-colors"
              >
                Tambah
              </button>
            </div>
            
            {snippet.tag && snippet.tag.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {snippet.tag.map((tag) => (
                  <span 
                    key={tag} 
                    className="inline-flex items-center gap-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full text-xs"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="text-blue-700 dark:text-blue-300 hover:text-blue-900 dark:hover:text-blue-100 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                        <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
            )}
            
            <p className="text-xs text-foreground/60 mt-1.5">
              Tekan Enter atau klik Tambah untuk menambahkan tag
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Kode</label>
            <textarea
              name="kode"
              value={snippet.kode}
              onChange={handleChange}
              rows={8}
              className={`w-full bg-white dark:bg-gray-800 border ${
                errors.kode ? 'border-red-500 ring-1 ring-red-500' : 'border-black/10 dark:border-white/20'
              } rounded-xl p-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 transition-all shadow-sm font-mono`}
              placeholder="Masukkan kode snippet di sini"
            />
            {errors.kode && <p className="text-red-500 text-sm mt-1.5 flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
              </svg>
              {errors.kode}
            </p>}
          </div>

          <div className="pt-3 flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm border border-black/10 dark:border-white/10 rounded-xl bg-white/50 dark:bg-gray-800/50 hover:bg-black/5 dark:hover:bg-white/5 transition-colors font-medium"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-sm bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl transition-colors font-medium shadow-sm hover:shadow-md"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CodeSnippetEditor;
