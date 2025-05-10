'use client';

import React, { useState } from 'react';
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
    if (template.kategori === 'lainnya' && kategoriLain) {
      setTemplate(prev => ({ ...prev, kategori: kategoriLain }));
    }
    
    if (validateForm()) {
      const finalTemplate = template.kategori === 'lainnya' && kategoriLain ? 
        { ...template, kategori: kategoriLain } : template;
      
      onSave(finalTemplate);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-background rounded-xl shadow-lg w-full max-w-lg overflow-hidden">
        <div className="p-4 border-b border-black/10 dark:border-white/10 flex justify-between items-center">
          <h2 className="text-lg font-semibold">
            {templateEdit ? 'Edit Template Prompt' : 'Buat Template Prompt'}
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
            <label className="block text-sm font-medium mb-1">Nama Template</label>
            <input
              type="text"
              name="nama"
              value={template.nama}
              onChange={handleChange}
              className={`w-full bg-black/5 dark:bg-white/5 border ${
                errors.nama ? 'border-red-500' : 'border-black/5 dark:border-white/10'
              } rounded-lg p-2 text-sm outline-none focus:ring-1 focus:ring-blue-500`}
              placeholder="cth. Analisis SEO, Tulis Email, Review Kode, dll"
            />
            {errors.nama && <p className="text-red-500 text-xs mt-1">{errors.nama}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Deskripsi (Opsional)</label>
            <input
              type="text"
              name="deskripsi"
              value={template.deskripsi}
              onChange={handleChange}
              className="w-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-lg p-2 text-sm outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="cth. Template untuk menganalisis halaman web dari segi SEO"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Kategori</label>
              <select
                name="kategori"
                value={template.kategori}
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

            {template.kategori === 'lainnya' && (
              <div>
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
            <label className="block text-sm font-medium mb-1">Template Prompt</label>
            <textarea
              name="template"
              value={template.template}
              onChange={handleChange}
              rows={8}
              className={`w-full bg-black/5 dark:bg-white/5 border ${
                errors.template ? 'border-red-500' : 'border-black/5 dark:border-white/10'
              } rounded-lg p-2 text-sm outline-none focus:ring-1 focus:ring-blue-500`}
              placeholder="Tulis prompt template. Gunakan [input] untuk bagian yang akan diisi oleh pengguna."
            />
            {errors.template && <p className="text-red-500 text-xs mt-1">{errors.template}</p>}
            <p className="text-xs text-foreground/50 mt-1">
              Gunakan [input] untuk bagian yang perlu diisi pengguna.
              Contoh: "Analisis artikel berikut: [input]"
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Model AI Disarankan (Opsional)</label>
              <input
                type="text"
                name="modelDisarankan"
                value={template.modelDisarankan}
                onChange={handleChange}
                className="w-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-lg p-2 text-sm outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="cth. gpt-4o"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Gaya Respons (Opsional)</label>
              <input
                type="text"
                name="gayaResponsDisarankan"
                value={template.gayaResponsDisarankan}
                onChange={handleChange}
                className="w-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-lg p-2 text-sm outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="cth. formal, pendek"
              />
            </div>
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

export default TemplatePromptEditor;
