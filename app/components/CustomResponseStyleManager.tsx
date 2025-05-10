'use client';

import React, { useState } from 'react';
import { GayaResponsOption, GayaResponsKustom } from '../types/chat';
import CustomResponseStyleEditor from './CustomResponseStyleEditor';

interface CustomResponseStyleManagerProps {
  isOpen: boolean;
  onClose: () => void;
  daftarGayaResponsKustom: GayaResponsKustom[];
  onSaveGayaRespons: (gaya: GayaResponsKustom) => void;
  onDeleteGayaRespons: (id: string) => void;
  onSelectGayaRespons: (id: string) => void;
}

const CustomResponseStyleManager: React.FC<CustomResponseStyleManagerProps> = ({
  isOpen,
  onClose,
  daftarGayaResponsKustom,
  onSaveGayaRespons,
  onDeleteGayaRespons,
  onSelectGayaRespons
}) => {
  const [showEditor, setShowEditor] = useState<boolean>(false);
  const [gayaResponsEdit, setGayaResponsEdit] = useState<GayaResponsKustom | null>(null);
  
  const handleEdit = (gaya: GayaResponsKustom) => {
    setGayaResponsEdit(gaya);
    setShowEditor(true);
  };
  
  const handleCreate = () => {
    setGayaResponsEdit(null);
    setShowEditor(true);
  };
  
  const handleDelete = (id: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus gaya respons ini?")) {
      onDeleteGayaRespons(id);
    }
  };
  
  const handleSave = (gaya: GayaResponsKustom) => {
    onSaveGayaRespons(gaya);
    setShowEditor(false);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center p-4">
        <div className="bg-background rounded-xl shadow-lg w-full max-w-lg overflow-hidden">
          <div className="p-4 border-b border-black/10 dark:border-white/10 flex justify-between items-center">
            <h2 className="text-lg font-semibold">Kelola Gaya Respons</h2>
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
              Buat Gaya Respons Baru
            </button>
            
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {daftarGayaResponsKustom.length === 0 ? (
                <div className="text-center py-8 text-foreground/60">
                  Anda belum membuat gaya respons kustom.
                </div>
              ) : (
                daftarGayaResponsKustom.map((gaya) => (
                  <div key={gaya.id} className="border border-black/5 dark:border-white/10 rounded-lg p-3 hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{gaya.nama}</h3>
                        {gaya.deskripsi && <p className="text-sm text-foreground/70">{gaya.deskripsi}</p>}
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => onSelectGayaRespons(gaya.id)}
                          className="p-1 text-blue-500 hover:bg-blue-500/10 rounded transition-colors"
                          title="Gunakan"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                            <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleEdit(gaya)}
                          className="p-1 text-foreground/60 hover:bg-black/5 dark:hover:bg-white/5 rounded transition-colors"
                          title="Edit"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                            <path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" />
                            <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(gaya.id)}
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
                      {gaya.petunjuk}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <CustomResponseStyleEditor 
        isOpen={showEditor}
        onClose={() => setShowEditor(false)}
        onSave={handleSave}
        gayaResponsEdit={gayaResponsEdit}
      />
    </>
  );
};

export default CustomResponseStyleManager;
