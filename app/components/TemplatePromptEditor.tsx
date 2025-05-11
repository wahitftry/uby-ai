'use client';

import React, { useState, useEffect } from 'react';
import { TemplatePromptType } from '../types/chat';

interface TemplatePromptEditorProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (template: TemplatePromptType) => void;
  templateEdit?: TemplatePromptType | null;
  kategoriTersedia?: string[];
}

const TemplatePromptEditor: React.FC<TemplatePromptEditorProps> = ({
  isOpen,
  onClose,
  onSave,
  templateEdit,
  kategoriTersedia = []
}) => {
  const [template, setTemplate] = useState<TemplatePromptType>(
    templateEdit || {
      id: `template-${Date.now()}`,
      nama: '',
      deskripsi: '',
      template: '',
      kategori: '',
      modelDisarankan: '',
      gayaResponsDisarankan: ''
    }
  );

  const [errors, setErrors] = useState<{
    nama?: string;
    template?: string;
  }>({});
  
  const [kategoriLain, setKategoriLain] = useState<string>('');

  useEffect(() => {
    if (isOpen && templateEdit) {
      setTemplate(templateEdit);
    } else if (isOpen) {
      setTemplate({
        id: `template-${Date.now()}`,
        nama: '',
        deskripsi: '',
        template: '',
        kategori: '',
        modelDisarankan: '',
        gayaResponsDisarankan: ''
      });
      setKategoriLain('');
    }
  }, [isOpen, templateEdit]);

  const validateForm = (): boolean => {
    const newErrors: {
      nama?: string;
      template?: string;
    } = {};

    if (!template.nama.trim()) {
      newErrors.nama = 'Nama template tidak boleh kosong';
    }

    if (!template.template.trim()) {
      newErrors.template = 'Template prompt tidak boleh kosong';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTemplate(prev => ({ ...prev, [name]: value }));
    
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let finalTemplate = {...template};
    
    if (template.kategori === 'lainnya' && kategoriLain) {
      finalTemplate = { ...template, kategori: kategoriLain };
    }
    
    if (validateForm()) {
      onSave(finalTemplate);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white/90 dark:bg-gray-900/90 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden backdrop-blur-md border border-black/10 dark:border-white/10">
        <div className="p-4 border-b border-black/10 dark:border-white/10 flex justify-between items-center bg-gradient-to-r from-white/50 to-white/30 dark:from-gray-800/50 dark:to-gray-900/30">
          <h2 className="text-lg font-semibold">
            {templateEdit ? 'Edit Template Prompt' : 'Buat Template Prompt'}
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
            <label className="block text-sm font-medium mb-1.5">Nama Template</label>
            <input
              type="text"
              name="nama"
              value={template.nama}
              onChange={handleChange}
              className={`w-full bg-white dark:bg-gray-800 border ${
                errors.nama ? 'border-red-500 ring-1 ring-red-500' : 'border-black/10 dark:border-white/20'
              } rounded-xl p-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 transition-all shadow-sm`}
              placeholder="cth. Analisis SEO, Tulis Email, Review Kode, dll"
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
              value={template.deskripsi}
              onChange={handleChange}
              className="w-full bg-white dark:bg-gray-800 border border-black/10 dark:border-white/20 rounded-xl p-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 transition-all shadow-sm"
              placeholder="cth. Template untuk menganalisis halaman web dari segi SEO"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1.5">Kategori</label>
              <select
                name="kategori"
                value={template.kategori}
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

            {template.kategori === 'lainnya' && (
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
            <label className="block text-sm font-medium mb-1.5">Template Prompt</label>
            <textarea
              name="template"
              value={template.template}
              onChange={handleChange}
              rows={8}
              className={`w-full bg-white dark:bg-gray-800 border ${
                errors.template ? 'border-red-500 ring-1 ring-red-500' : 'border-black/10 dark:border-white/20'
              } rounded-xl p-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 transition-all shadow-sm font-mono`}
              placeholder="Tulis prompt template. Gunakan [input] untuk bagian yang akan diisi oleh pengguna."
            />
            {errors.template && <p className="text-red-500 text-sm mt-1.5 flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
              </svg>
              {errors.template}
            </p>}
            <p className="text-xs text-foreground/60 mt-1.5 flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
              </svg>
              Gunakan [input] untuk bagian yang perlu diisi pengguna. Contoh: "Analisis artikel berikut: [input]"
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1.5">Model AI Disarankan (Opsional)</label>
              <input
                type="text"
                name="modelDisarankan"
                value={template.modelDisarankan}
                onChange={handleChange}
                className="w-full bg-white dark:bg-gray-800 border border-black/10 dark:border-white/20 rounded-xl p-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 transition-all shadow-sm"
                placeholder="cth. gpt-4o"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Gaya Respons (Opsional)</label>
              <input
                type="text"
                name="gayaResponsDisarankan"
                value={template.gayaResponsDisarankan}
                onChange={handleChange}
                className="w-full bg-white dark:bg-gray-800 border border-black/10 dark:border-white/20 rounded-xl p-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 transition-all shadow-sm"
                placeholder="cth. formal, pendek"
              />
            </div>
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

export default TemplatePromptEditor;
