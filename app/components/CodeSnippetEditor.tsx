'use client';

import React, { useState } from 'react';
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
      bahasa: 'javascript',
      kategori: '',
      tag: [],
      createdAt: Date.now(),
      updatedAt: Date.now()
    }
  );

  const [errors, setErrors] = useState<{
    nama?: string;
    kode?: string;
  }>({});
  
  const [kategoriLain, setKategoriLain] = useState<string>('');
  const [tagInput, setTagInput] = useState<string>('');

  const validateForm = (): boolean => {
    const newErrors: {
      nama?: string;
      kode?: string;
    } = {};

    if (!snippet.nama.trim()) {
      newErrors.nama = 'Nama snippet tidak boleh kosong';
    }

    if (!snippet.kode.trim()) {
      newErrors.kode = 'Kode snippet tidak boleh kosong';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSnippet(prev => ({ ...prev, [name]: value, updatedAt: Date.now() }));
    
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };
  
  const addTag = () => {
    if (!tagInput.trim()) return;
    
    setSnippet(prev => {
      const newTags = [...(prev.tag || [])];
      if (!newTags.includes(tagInput.trim())) {
        newTags.push(tagInput.trim());
      }
      return { ...prev, tag: newTags };
    });
    
    setTagInput('');
  };
  
  const removeTag = (tag: string) => {
    setSnippet(prev => ({
      ...prev, 
      tag: (prev.tag || []).filter(t => t !== tag)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (snippet.kategori === 'lainnya' && kategoriLain) {
      setSnippet(prev => ({ ...prev, kategori: kategoriLain }));
    }
    
    if (validateForm()) {
      const finalSnippet = snippet.kategori === 'lainnya' && kategoriLain ? 
        { ...snippet, kategori: kategoriLain } : snippet;
      
      onSave(finalSnippet);
      onClose();
    }
  };

  if (!isOpen) return null;

  const languageOptions = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'html', label: 'HTML' },
    { value: 'css', label: 'CSS' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'csharp', label: 'C#' },
    { value: 'php', label: 'PHP' },
    { value: 'go', label: 'Go' },
    { value: 'rust', label: 'Rust' },
    { value: 'ruby', label: 'Ruby' },
    { value: 'bash', label: 'Bash/Shell' },
    { value: 'sql', label: 'SQL' },
    { value: 'markdown', label: 'Markdown' },
    { value: 'json', label: 'JSON' },
    { value: 'xml', label: 'XML' },
    { value: 'yaml', label: 'YAML' },
    { value: 'plaintext', label: 'Plain Text' },
    { value: 'other', label: 'Lainnya' }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-background rounded-xl shadow-lg w-full max-w-lg overflow-hidden">
        <div className="p-4 border-b border-black/10 dark:border-white/10 flex justify-between items-center">
          <h2 className="text-lg font-semibold">
            {snippetEdit ? 'Edit Snippet Kode' : 'Buat Snippet Kode Baru'}
          </h2>
          <button 
            onClick={onClose}
            className="text-foreground/70 hover:text-foreground transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nama Snippet</label>
            <input
              type="text"
              name="nama"
              value={snippet.nama}
              onChange={handleChange}
              className={`w-full bg-black/5 dark:bg-white/5 border ${
                errors.nama ? 'border-red-500' : 'border-black/5 dark:border-white/10'
              } rounded-lg p-2 text-sm outline-none focus:ring-1 focus:ring-blue-500`}
              placeholder="cth. React Component, Express Route, dll"
            />
            {errors.nama && <p className="text-red-500 text-xs mt-1">{errors.nama}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Deskripsi (Opsional)</label>
            <input
              type="text"
              name="deskripsi"
              value={snippet.deskripsi || ''}
              onChange={handleChange}
              className="w-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-lg p-2 text-sm outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="cth. Template komponen React dengan TypeScript"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Bahasa</label>
              <select
                name="bahasa"
                value={snippet.bahasa}
                onChange={handleChange}
                className="w-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-lg p-2 text-sm outline-none focus:ring-1 focus:ring-blue-500"
              >
                {languageOptions.map((lang) => (
                  <option key={lang.value} value={lang.value}>{lang.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Kategori</label>
              <select
                name="kategori"
                value={snippet.kategori}
                onChange={handleChange}
                className="w-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-lg p-2 text-sm outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Pilih Kategori</option>
                {kategoriTersedia.map((kategori) => (
                  <option key={kategori} value={kategori}>{kategori}</option>
                ))}
                <option value="lainnya">Lainnya</option>
              </select>
            </div>

            {snippet.kategori === 'lainnya' && (
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1">Kategori Baru</label>
                <input
                  type="text"
                  value={kategoriLain}
                  onChange={(e) => setKategoriLain(e.target.value)}
                  className="w-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-lg p-2 text-sm outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Masukkan kategori baru"
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Tag (Opsional)</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                className="flex-1 bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-lg p-2 text-sm outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Tambahkan tag..."
              />
              <button
                type="button"
                onClick={addTag}
                className="px-3 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Tambah
              </button>
            </div>
            
            {snippet.tag && snippet.tag.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {snippet.tag.map(tag => (
                  <span key={tag} className="inline-flex items-center px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-full">
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-1.5 text-blue-500 hover:text-blue-700"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                        <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Kode</label>
            <textarea
              name="kode"
              value={snippet.kode}
              onChange={handleChange}
              rows={12}
              className={`w-full bg-black/5 dark:bg-white/5 border ${
                errors.kode ? 'border-red-500' : 'border-black/5 dark:border-white/10'
              } rounded-lg p-2 text-sm outline-none focus:ring-1 focus:ring-blue-500 font-mono`}
              placeholder="// Masukkan kode snippet di sini..."
            />
            {errors.kode && <p className="text-red-500 text-xs mt-1">{errors.kode}</p>}
          </div>

          <div className="pt-2 flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm border border-black/10 dark:border-white/10 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
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
