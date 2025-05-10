import { useState, useEffect } from 'react';
import { PercakapanType, DaftarPercakapanType } from '../types/chat';
import { 
  getDaftarPercakapan, 
  hapusPercakapan, 
  toggleBookmarkPercakapan, 
  getDaftarPercakapanBookmark, 
  cekPercakapanTerenkripsi,
  cariPercakapanLanjutan,
  SearchFilter,
  daftarModelAI
} from '../api/chatService';
import SearchAdvanced from './SearchAdvanced';

interface ConversationSidebarProps {
  visible: boolean;
  onClose: () => void;
  onSelectConversation: (percakapan: PercakapanType) => void;
  onNewChat: () => void;
  percakapanAktif: string | null;
  onOpenEncryptedConversation?: (id: string) => boolean;
}

export default function ConversationSidebar({
  visible,
  onClose,
  onSelectConversation,
  onNewChat,
  percakapanAktif,
  onOpenEncryptedConversation
}: ConversationSidebarProps) {
  const [daftarPercakapan, setDaftarPercakapan] = useState<DaftarPercakapanType>([]);
  const [pencarian, setPencarian] = useState('');
  const [tampilkanBookmark, setTampilkanBookmark] = useState<boolean>(false); 
  const [percakapanTerenkripsi, setPercakapanTerenkripsi] = useState<{[key: string]: boolean}>({});
  const [pencarianLanjutanVisible, setPencarianLanjutanVisible] = useState<boolean>(false);
  const [filterAktif, setFilterAktif] = useState<SearchFilter | null>(null);
  
  useEffect(() => {
    if (visible) {
      muatPercakapan();
    }
  }, [visible, tampilkanBookmark, percakapanAktif]);
  const muatPercakapan = () => {
    let percakapanList: DaftarPercakapanType = [];
    
    if (filterAktif) {
      percakapanList = cariPercakapanLanjutan(filterAktif);
    } else if (tampilkanBookmark) {
      percakapanList = getDaftarPercakapanBookmark();
    } else {
      percakapanList = getDaftarPercakapan();
    }
    
    setDaftarPercakapan(percakapanList);
    
    const encryptedStatus: {[key: string]: boolean} = {};
    percakapanList.forEach(percakapan => {
      encryptedStatus[percakapan.id] = percakapan.terenkripsi || false;
    });
    setPercakapanTerenkripsi(encryptedStatus);
  };
    const handleHapusPercakapan = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (window.confirm('Apakah Anda yakin ingin menghapus percakapan ini?')) {
      const berhasil = hapusPercakapan(id);
      
      if (berhasil) {
        muatPercakapan();
        if (percakapanAktif === id) {
          onNewChat();
        }
      } else {
        alert('Gagal menghapus percakapan');
      }
    }
  };
  
  const handleToggleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const berhasil = toggleBookmarkPercakapan(id);
    if (berhasil) {
      muatPercakapan();
    }
  };
  const handlePencarian = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPencarian(e.target.value);
    if (filterAktif && e.target.value) {
      setFilterAktif(null);
    }
  };
  
  const handlePencarianLanjutan = (filter: SearchFilter) => {
    setFilterAktif(filter);
    if (filter.keyword) {
      setPencarian(filter.keyword);
    }
    muatPercakapan();
  };
  
  const resetPencarianLanjutan = () => {
    setFilterAktif(null);
    setPencarian('');
    muatPercakapan();
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
    <aside
      className={`fixed inset-y-0 left-0 w-72 bg-background/95 border-r border-black/5 dark:border-white/5 flex flex-col z-30 transition-all duration-300 ease-in-out transform ${
        visible ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="p-4 border-b border-black/5 dark:border-white/5">
        <button
          onClick={onNewChat}
          className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg text-sm transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" />
            <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" />
          </svg>
          Percakapan Baru
        </button>
      </div>
      
      <div className="p-4 border-b border-black/5 dark:border-white/5">
        <div className="relative mb-2">
          <input
            type="text"
            placeholder="Cari percakapan..."
            className="w-full px-8 py-2 bg-black/5 dark:bg-white/5 rounded-lg placeholder:text-foreground/40 text-sm"
            value={pencarian}
            onChange={handlePencarian}
          />
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="absolute left-2 top-2.5 w-4 h-4 text-foreground/40">
            <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
          </svg>
          <div className="absolute right-2 top-2 flex gap-1">
            {filterAktif && (
              <button 
                onClick={resetPencarianLanjutan}
                className="p-0.5 hover:bg-black/5 dark:hover:bg-white/5 rounded transition-colors"
                title="Reset filter pencarian"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-foreground/60">
                  <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                </svg>
              </button>
            )}
            <button 
              onClick={() => setPencarianLanjutanVisible(true)}
              className="p-0.5 hover:bg-black/5 dark:hover:bg-white/5 rounded transition-colors"
              title="Pencarian lanjutan"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-4 h-4 ${filterAktif ? 'text-blue-500' : 'text-foreground/60'}`}>
                <path fillRule="evenodd" d="M2.628 1.601C5.028 1.206 7.49 1 10 1s4.973.206 7.372.601a.75.75 0 01.628.74v2.288a2.25 2.25 0 01-.659 1.59l-4.682 4.683a2.25 2.25 0 00-.659 1.59v3.037c0 .684-.31 1.33-.844 1.757l-1.937 1.55A.75.75 0 018 18.25v-5.757a2.25 2.25 0 00-.659-1.591L2.659 6.22A2.25 2.25 0 012 4.629V2.34a.75.75 0 01.628-.74z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <button 
            onClick={() => setTampilkanBookmark(!tampilkanBookmark)}
            className={`text-xs flex items-center gap-1 px-2 py-1 rounded-md ${
              tampilkanBookmark ? 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400' : 'text-foreground/60 hover:bg-black/5 dark:hover:bg-white/5'
            } transition-colors`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
              <path fillRule="evenodd" d="M10 2c-1.716 0-3.408.106-5.07.31C3.806 2.45 3 3.414 3 4.517V17.25a.75.75 0 001.075.676L10 15.082l5.925 2.844A.75.75 0 0017 17.25V4.517c0-1.103-.806-2.068-1.93-2.207A41.403 41.403 0 0010 2z" clipRule="evenodd" />
            </svg>
            {tampilkanBookmark ? 'Semua Percakapan' : 'Hanya Bookmark'}
          </button>
          
          {filterAktif && (
            <div className="text-xs text-blue-500 flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                <path fillRule="evenodd" d="M2.628 1.601C5.028 1.206 7.49 1 10 1s4.973.206 7.372.601a.75.75 0 01.628.74v2.288a2.25 2.25 0 01-.659 1.59l-4.682 4.683a2.25 2.25 0 00-.659 1.59v3.037c0 .684-.31 1.33-.844 1.757l-1.937 1.55A.75.75 0 018 18.25v-5.757a2.25 2.25 0 00-.659-1.591L2.659 6.22A2.25 2.25 0 012 4.629V2.34a.75.75 0 01.628-.74z" clipRule="evenodd" />
              </svg>
              Filter Aktif
            </div>
          )}
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
                  className={`px-4 py-3 hover:bg-black/5 dark:hover:bg.white/5 cursor-pointer transition-colors ${percakapanAktif === percakapan.id ? 'bg-black/10 dark:bg.white/10' : ''}`}
                  onClick={() => {
                    if (percakapan.terenkripsi && onOpenEncryptedConversation) {
                      const berhasil = onOpenEncryptedConversation(percakapan.id);
                      if (berhasil) {
                        onClose();
                      }
                    } else {
                      onSelectConversation(percakapan);
                    }
                  }}
                >
                  <div className="flex justify-between items-start">                    <div className="flex-1 min-w-0">
                      <div className="flex items-center">
                        <h3 className="text-sm font-medium truncate mr-2">
                          {percakapan.judul}
                        </h3>
                        {percakapan.terenkripsi && (
                          <span className="text-amber-500" title="Percakapan terenkripsi">
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                            </svg>
                          </span>
                        )}
                        {percakapan.privateMode && (
                          <span className="text-blue-500 ml-1" title="Mode Privasi">
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                              <circle cx="12" cy="12" r="3"></circle>
                              <path d="M3 3l18 18"></path>
                            </svg>
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-foreground/50 truncate mt-1">
                        {formatDate(percakapan.terakhirDiubah)}
                      </p>
                      {percakapan.pesanPertama && (
                        <p className="text-xs text-foreground/70 mt-1 truncate">
                          {percakapan.pesanPertama}
                        </p>
                      )}
                    </div>                    
                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => handleToggleBookmark(percakapan.id, e)}
                        className={`p-1 rounded-full hover:bg-black/10 dark:hover:bg.white/10 transition-colors ${
                          percakapan.dibookmark ? 'text-yellow-500' : 'text-foreground/50 hover:text-foreground/80'
                        }`}
                        title={percakapan.dibookmark ? "Hapus dari favorit" : "Tambahkan ke favorit"}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill={percakapan.dibookmark ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                        </svg>
                      </button>
                      
                      <button
                        onClick={(e) => handleHapusPercakapan(percakapan.id, e)}
                        className="p-1 rounded-full hover:bg-black/10 dark:hover:bg.white/10 text-foreground/50 hover:text-foreground/80 transition-colors"
                        title="Hapus percakapan"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="mt-1.5 flex items-center">
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs bg-black/5 dark:bg.white/5 text-foreground/60">
                      <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                        <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
                        <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
                        <line x1="6" y1="6" x2="6.01" y2="6"></line>
                        <line x1="6" y1="18" x2="6.01" y2="18"></line>
                      </svg>
                      {percakapan.model}
                    </span>
                    {percakapanTerenkripsi[percakapan.id] && (
                      <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-xs bg-green-500 text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                          <path d="M12 1v22"></path>
                          <path d="M5 12h14"></path>
                        </svg>
                        Terenkripsi
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      
      <SearchAdvanced 
        isOpen={pencarianLanjutanVisible}
        onClose={() => setPencarianLanjutanVisible(false)}
        onSearch={handlePencarianLanjutan}
        daftarModel={daftarModelAI}
      />
    </aside>
  );
}
