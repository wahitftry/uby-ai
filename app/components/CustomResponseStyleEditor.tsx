'use client';

import React, { useState, useEffect } from 'react';
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
  
  useEffect(() => {
    if (isOpen) {
      setGaya(gayaResponsEdit || {
        id: `custom-${Date.now()}`,
        nama: '',
        deskripsi: '',
        petunjuk: ''
      });
      setErrors({});
      setCharCount({
        nama: gayaResponsEdit?.nama.length || 0,
        deskripsi: gayaResponsEdit?.deskripsi.length || 0,
        petunjuk: gayaResponsEdit?.petunjuk.length || 0
      });
    }
  }, [isOpen, gayaResponsEdit]);

  const [errors, setErrors] = useState<{
    nama?: string;
    petunjuk?: string;
  }>({});
  
  const [charCount, setCharCount] = useState({
    nama: 0,
    deskripsi: 0,
    petunjuk: 0
  });

  const [isSaving, setIsSaving] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: {
      nama?: string;
      petunjuk?: string;
    } = {};

    if (!gaya.nama.trim()) {
      newErrors.nama = 'Nama gaya respons tidak boleh kosong';
    } else if (gaya.nama.length > 50) {
      newErrors.nama = 'Nama tidak boleh lebih dari 50 karakter';
    }

    if (!gaya.petunjuk.trim()) {
      newErrors.petunjuk = 'Petunjuk untuk AI tidak boleh kosong';
    } else if (gaya.petunjuk.length > 1000) {
      newErrors.petunjuk = 'Petunjuk tidak boleh lebih dari 1000 karakter';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setCharCount(prev => ({
      ...prev,
      [name]: value.length
    }));
    
    setGaya(prev => ({ ...prev, [name]: value }));
    
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSaving(true);
      try {
        onSave(gaya);
      } finally {
        setIsSaving(false);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white/90 dark:bg-gray-900/90 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden backdrop-blur-md border border-black/10 dark:border-white/10">
        <div className="p-4 border-b border-black/10 dark:border-white/10 flex justify-between items-center bg-gradient-to-r from-white/50 to-white/30 dark:from-gray-800/50 dark:to-gray-900/30">
          <h2 className="text-lg font-semibold">
            {gayaResponsEdit ? 'Edit Gaya Respons' : 'Buat Gaya Respons Baru'}
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
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-sm font-medium">Nama Gaya Respons</label>
              <span className={`text-xs ${charCount.nama > 50 ? 'text-red-500' : 'text-foreground/60'}`}>
                {charCount.nama}/50
              </span>
            </div>
            <input
              type="text"
              name="nama"
              value={gaya.nama}
              onChange={handleChange}
              className={`w-full bg-white dark:bg-gray-800 border ${
                errors.nama ? 'border-red-500 ring-1 ring-red-500' : 'border-black/10 dark:border-white/20'
              } rounded-xl p-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 transition-all shadow-sm`}
              placeholder="cth. Teknis, Akademis, Lucu, dll"
              maxLength={50}
            />
            {errors.nama && <p className="text-red-500 text-sm mt-1.5 flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
              </svg>
              {errors.nama}
            </p>}
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-sm font-medium">Deskripsi (Opsional)</label>
              <span className={`text-xs ${charCount.deskripsi > 100 ? 'text-red-500' : 'text-foreground/60'}`}>
                {charCount.deskripsi}/100
              </span>
            </div>
            <input
              type="text"
              name="deskripsi"
              value={gaya.deskripsi}
              onChange={handleChange}
              className="w-full bg-white dark:bg-gray-800 border border-black/10 dark:border-white/20 rounded-xl p-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 transition-all shadow-sm"
              placeholder="cth. Jawaban dengan istilah teknis dan penjelasan detil"
              maxLength={100}
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-sm font-medium">Petunjuk untuk AI</label>
              <span className={`text-xs ${charCount.petunjuk > 1000 ? 'text-red-500' : 'text-foreground/60'}`}>
                {charCount.petunjuk}/1000
              </span>
            </div>
            <textarea
              name="petunjuk"
              value={gaya.petunjuk}
              onChange={handleChange}
              rows={6}
              className={`w-full bg-white dark:bg-gray-800 border ${
                errors.petunjuk ? 'border-red-500 ring-1 ring-red-500' : 'border-black/10 dark:border-white/20'
              } rounded-xl p-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 transition-all shadow-sm`}
              placeholder="Jelaskan bagaimana AI seharusnya merespon. Mis: Jawab dengan bahasa teknis, gunakan analogi, tambahkan contoh kode, dll."
              maxLength={1000}
            />
            {errors.petunjuk && <p className="text-red-500 text-sm mt-1.5 flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
              </svg>
              {errors.petunjuk}
            </p>}
            
            <p className="text-xs text-foreground/60 mt-1.5 flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
              </svg>
              Buat petunjuk yang spesifik untuk mengontrol bagaimana AI merespons pesan Anda
            </p>
          </div>

          <div className="pt-3 flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm border border-black/10 dark:border-white/10 rounded-xl bg-white/50 dark:bg-gray-800/50 hover:bg-black/5 dark:hover:bg-white/5 transition-colors font-medium"
              disabled={isSaving}
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2.5 text-sm bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl transition-colors font-medium shadow-sm hover:shadow-md"
            >
              {isSaving ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Menyimpan...
                </span>
              ) : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomResponseStyleEditor;
