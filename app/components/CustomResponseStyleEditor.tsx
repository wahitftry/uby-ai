'use client';

import React, { useState } from 'react';
import { GayaResponsKustom } from '../types/chat';

interface CustomResponseStyleEditorProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (gayaRespons: GayaResponsKustom) => void;
  gayaResponsEdit?: GayaResponsKustom | null;
}

const CustomResponseStyleEditor: React.FC<CustomResponseStyleEditorProps> = ({
  isOpen,
  onClose,
  onSave,
  gayaResponsEdit
}) => {
  const [gaya, setGaya] = useState<GayaResponsKustom>(
    gayaResponsEdit || {
      id: `custom-${Date.now()}`,
      nama: '',
      deskripsi: '',
      petunjuk: ''
    }
  );

  const [errors, setErrors] = useState<{
    nama?: string;
    petunjuk?: string;
  }>({});

  const validateForm = (): boolean => {
    const newErrors: {
      nama?: string;
      petunjuk?: string;
    } = {};

    if (!gaya.nama.trim()) {
      newErrors.nama = 'Nama gaya respons tidak boleh kosong';
    }

    if (!gaya.petunjuk.trim()) {
      newErrors.petunjuk = 'Petunjuk untuk AI tidak boleh kosong';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setGaya(prev => ({ ...prev, [name]: value }));
    
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSave(gaya);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-background rounded-xl shadow-lg w-full max-w-lg overflow-hidden">
        <div className="p-4 border-b border-black/10 dark:border-white/10 flex justify-between items-center">
          <h2 className="text-lg font-semibold">
            {gayaResponsEdit ? 'Edit Gaya Respons' : 'Buat Gaya Respons Baru'}
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
            <label className="block text-sm font-medium mb-1">Nama Gaya Respons</label>
            <input
              type="text"
              name="nama"
              value={gaya.nama}
              onChange={handleChange}
              className={`w-full bg-black/5 dark:bg-white/5 border ${
                errors.nama ? 'border-red-500' : 'border-black/5 dark:border-white/10'
              } rounded-lg p-2 text-sm outline-none focus:ring-1 focus:ring-blue-500`}
              placeholder="cth. Teknis, Akademis, Lucu, dll"
            />
            {errors.nama && <p className="text-red-500 text-xs mt-1">{errors.nama}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Deskripsi (Opsional)</label>
            <input
              type="text"
              name="deskripsi"
              value={gaya.deskripsi}
              onChange={handleChange}
              className="w-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-lg p-2 text-sm outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="cth. Jawaban dengan istilah teknis dan penjelasan detil"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Petunjuk untuk AI</label>
            <textarea
              name="petunjuk"
              value={gaya.petunjuk}
              onChange={handleChange}
              rows={5}
              className={`w-full bg-black/5 dark:bg-white/5 border ${
                errors.petunjuk ? 'border-red-500' : 'border-black/5 dark:border-white/10'
              } rounded-lg p-2 text-sm outline-none focus:ring-1 focus:ring-blue-500 resize-none`}
              placeholder="Jelaskan bagaimana AI seharusnya merespon. Mis: Jawab dengan bahasa teknis, gunakan analogi, tambahkan contoh kode, dll."
            />
            {errors.petunjuk && <p className="text-red-500 text-xs mt-1">{errors.petunjuk}</p>}
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

export default CustomResponseStyleEditor;
