import { useState, useEffect } from 'react';
import { PercakapanType, DaftarPercakapanType } from '../types/chat';
import { getDaftarPercakapan, hapusPercakapan } from '../api/chatService';

interface ConversationSidebarProps {
  visible: boolean;
  onClose: () => void;
  onSelectConversation: (percakapan: PercakapanType) => void;
  onNewChat: () => void;
  percakapanAktif: string | null;
}

export default function ConversationSidebar({
  visible,
  onClose,
  onSelectConversation,
  onNewChat,
  percakapanAktif
}: ConversationSidebarProps) {
  const [daftarPercakapan, setDaftarPercakapan] = useState<DaftarPercakapanType>([]);
  const [pencarian, setPencarian] = useState('');
  useEffect(() => {
    if (visible) {
      muatPercakapan();
    }
  }, [visible]);

  const muatPercakapan = () => {
    const percakapan = getDaftarPercakapan();
    setDaftarPercakapan(percakapan);
  };
  const handleHapusPercakapan = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (window.confirm('Apakah Anda yakin ingin menghapus percakapan ini?')) {
      hapusPercakapan(id);
      muatPercakapan();
      
      if (percakapanAktif === id) {
        onNewChat();
      }
    }
  };
  const handlePencarian = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPencarian(e.target.value);
  };
  const percakapanTerfilter = daftarPercakapan.filter((percakapan) => {
    return percakapan.judul.toLowerCase().includes(pencarian.toLowerCase()) ||
      (percakapan.pesanPertama && percakapan.pesanPertama.toLowerCase().includes(pencarian.toLowerCase()));
  });

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const today = new Date();
    
    if (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    ) {
      return `Hari ini, ${date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}`;
    }
    
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (
      date.getDate() === yesterday.getDate() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getFullYear() === yesterday.getFullYear()
    ) {
      return `Kemarin, ${date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}`;
    }
    
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={`fixed inset-y-0 left-0 w-72 bg-background border-r border-black/10 dark:border-white/10 shadow-lg z-20 transform transition-transform duration-300 ${visible ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="flex flex-col h-full">
        <div className="p-4 border-b border-black/5 dark:border-white/5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Riwayat Percakapan</h2>
            <button 
              onClick={onClose} 
              className="rounded-full p-1.5 hover:bg-black/5 dark:hover:bg-white/5 text-foreground/70"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          
          <button
            onClick={onNewChat}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 px-4 rounded-lg hover:opacity-90 transition-opacity mb-3"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Percakapan Baru
          </button>
          
          <div className="relative">
            <input
              type="text"
              placeholder="Cari percakapan..."              value={pencarian}
              onChange={handlePencarian}
              className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-lg py-2 pl-8 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <svg
              className="absolute left-2.5 top-2.5 h-4 w-4 text-foreground/50"
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">          {percakapanTerfilter.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-center p-4">
              <svg
                className="h-8 w-8 text-foreground/40 mb-2"
                xmlns="http://www.w3.org/2000/svg" 
                width="24" 
                height="24" 
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="8" y1="12" x2="16" y2="12"></line>
              </svg>
              <p className="text-sm text-foreground/60">
                {pencarian 
                  ? 'Tidak ada percakapan yang sesuai dengan pencarian Anda' 
                  : 'Tidak ada riwayat percakapan'}
              </p>
            </div>
          ) : (
            <ul className="py-2">
              {percakapanTerfilter.map((percakapan) => (
                <li 
                  key={percakapan.id}
                  className={`px-4 py-3 hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer transition-colors ${percakapanAktif === percakapan.id ? 'bg-black/10 dark:bg-white/10' : ''}`}
                  onClick={() => onSelectConversation(percakapan)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center">
                        <h3 className="text-sm font-medium truncate mr-2">
                          {percakapan.judul}
                        </h3>
                      </div>
                      <p className="text-xs text-foreground/50 truncate mt-1">
                        {formatDate(percakapan.terakhirDiubah)}
                      </p>
                      {percakapan.pesanPertama && (
                        <p className="text-xs text-foreground/70 mt-1 truncate">
                          {percakapan.pesanPertama}
                        </p>
                      )}
                    </div>                    <button
                      onClick={(e) => handleHapusPercakapan(percakapan.id, e)}
                      className="ml-2 p-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10 text-foreground/50 hover:text-foreground/80 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      </svg>
                    </button>
                  </div>
                  <div className="mt-1.5 flex items-center">
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs bg-black/5 dark:bg-white/5 text-foreground/60">
                      <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                        <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
                        <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
                        <line x1="6" y1="6" x2="6.01" y2="6"></line>
                        <line x1="6" y1="18" x2="6.01" y2="18"></line>
                      </svg>
                      {percakapan.model}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
