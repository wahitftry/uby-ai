import React from 'react';
import EksporPDF from './EksporPDF';
import { DaftarPesanType } from '../types/chat';
import { getPercakapan } from '../api/chatService';

interface ConversationOptionsProps {
  daftarPesan: DaftarPesanType;
  percakapanId: string | null;
  judulPercakapan: string;
  editJudul: boolean;
  visible: boolean;
  onToggleEditJudul: () => void;
  onChangeJudul: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSaveJudul: () => void;
  onCancelEditJudul: () => void;
  onDeleteConversation: () => void;
  onExportSuccess: () => void;
  onExportError: (pesan: string) => void;
}

const ConversationOptions: React.FC<ConversationOptionsProps> = ({
  daftarPesan,
  percakapanId,
  judulPercakapan,
  editJudul,
  visible,
  onToggleEditJudul,
  onChangeJudul,
  onSaveJudul,
  onCancelEditJudul,
  onDeleteConversation,
  onExportSuccess,
  onExportError
}) => {
  if (!visible) return null;
  
  return (
    <div className="absolute top-14 right-4 z-20 bg-gradient-to-b from-gray-900/95 to-black/90 border border-white/10 rounded-xl shadow-xl p-4 backdrop-blur-md w-72 animate-fadeIn">
      <h3 className="text-base font-medium mb-3 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">Opsi Percakapan</h3>
      <div className="space-y-3">
        {!editJudul ? (
          <div 
            className="text-sm font-medium p-2 rounded-lg bg-white/5 hover:bg-white/10 cursor-pointer transition-colors flex justify-between items-center" 
            onClick={onToggleEditJudul}
          >
            <span className="truncate">
              {getPercakapan(percakapanId || '')?.judul || 'UBY AI - Percakapan'}
            </span>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2 text-blue-400">
              <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
            </svg>
          </div>
        ) : (
          <div className="flex items-center gap-1 rounded-lg bg-white/5 p-1">
            <input
              type="text"
              value={judulPercakapan}
              onChange={onChangeJudul}
              className="flex-1 bg-transparent border border-white/20 rounded-lg py-1.5 px-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              autoFocus
              placeholder="Judul percakapan..."
            />
            <button
              onClick={onSaveJudul}
              className="p-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </button>
            <button
              onClick={onCancelEditJudul}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        )}
        
        <hr className="border-t border-white/10 my-3" />
        
        <EksporPDF 
          daftarPesan={daftarPesan} 
          judulPercakapan={getPercakapan(percakapanId || '')?.judul || 'UBY AI - Percakapan'}
          onSelesai={onExportSuccess}
          onError={onExportError}
        />
        
        <hr className="border-t border-white/10 my-3" />
        
        <button
          onClick={onDeleteConversation}
          className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-lg bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
          Hapus Percakapan
        </button>
      </div>
    </div>
  );
};

export default ConversationOptions;
