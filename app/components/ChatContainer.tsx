'use client';

import React, { useState, useEffect, useRef } from 'react';
import { PesanType, DaftarPesanType, PercakapanType } from '../types/chat';
import { 
  kirimPesan, 
  daftarModelAI, 
  getModelSekarang, 
  setModelSekarang, 
  simpanPercakapan,
  getPercakapan,
  getPercakapanAktif,
  setPercakapanAktif,
  generateId
} from '../api/chatService';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import ConversationSidebar from './ConversationSidebar';

const ChatContainer: React.FC = () => {
  const [daftarPesan, setDaftarPesan] = useState<DaftarPesanType>([]);
  const [sedangMengirim, setSedangMengirim] = useState<boolean>(false);
  const [modelTerpilih, setModelTerpilih] = useState<string>(getModelSekarang());
  const [sidebarVisible, setSidebarVisible] = useState<boolean>(false);
  const [percakapanId, setPercakapanId] = useState<string | null>(getPercakapanAktif());
  
  const pesanContainerRef = useRef<HTMLDivElement>(null);
  const pesanSelamatDatangDitampilkan = useRef<boolean>(false);
    useEffect(() => {
    if (pesanContainerRef.current) {
      pesanContainerRef.current.scrollTop = pesanContainerRef.current.scrollHeight;
    }
  }, [daftarPesan]);
    useEffect(() => {    const idTersimpan = getPercakapanAktif();
    if (idTersimpan) {
      const percakapan = getPercakapan(idTersimpan);
      if (percakapan) {
        setDaftarPesan(percakapan.pesan);
        setModelTerpilih(percakapan.model);
        setPercakapanId(idTersimpan);
        setModelSekarang(percakapan.model);
        pesanSelamatDatangDitampilkan.current = true;
        return;
      }
    }
    buatPercakapanBaru();
  }, []);
  
  useEffect(() => {
    if (daftarPesan.length > 0 && percakapanId) {
      simpanPercakapan(percakapanId, '', daftarPesan);
    }
  }, [daftarPesan, percakapanId]);
  const tambahPesan = (isiPesan: string, pengirim: 'user' | 'ai') => {
    const pesanBaru: PesanType = {
      id: generateId(),
      pesan: isiPesan,
      pengirim,
      timestamp: Date.now()
    };
    
    setDaftarPesan((pesanSebelumnya) => [...pesanSebelumnya, pesanBaru]);
  };
  
  const handleKirimPesan = async (isiPesan: string) => {
    tambahPesan(isiPesan, 'user');
    
    setSedangMengirim(true);
    
    try {
      const respons = await kirimPesan(isiPesan);
      if (respons.status === 'success') {
        tambahPesan(respons.respons, 'ai');
      } else {
        tambahPesan('Maaf, terjadi kesalahan saat berkomunikasi dengan AI. Silakan coba lagi.', 'ai');
      }
    } catch (error) {
      console.error('Error:', error);
      tambahPesan('Maaf, terjadi kesalahan teknis. Silakan coba lagi.', 'ai');
    } finally {
      setSedangMengirim(false);
    }
  };
    const handleUbahModel = (modelId: string) => {
    const hasil = setModelSekarang(modelId);
    if (hasil.status === 'success') {
      setModelTerpilih(modelId);
      tambahPesan(`Model AI diubah ke ${daftarModelAI.find(m => m.id === modelId)?.nama || modelId}`, 'ai');
    }
  };
  
  const buatPercakapanBaru = () => {
    const id = generateId();
    setPercakapanId(id);
    setPercakapanAktif(id);
    setDaftarPesan([]);
    
    pesanSelamatDatangDitampilkan.current = false;
  };
  
  const handlePilihPercakapan = (percakapan: PercakapanType) => {
    setDaftarPesan(percakapan.pesan);
    setModelTerpilih(percakapan.model);
    setPercakapanId(percakapan.id);
    setPercakapanAktif(percakapan.id);
    setModelSekarang(percakapan.model);
    setSidebarVisible(false);
  };
    const alihkanSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };
  
  useEffect(() => {
    if (daftarPesan.length === 0 && !pesanSelamatDatangDitampilkan.current) {
      tambahPesan('Halo! Saya adalah Wahit AI, asisten AI yang siap membantu Anda. Ada yang bisa saya bantu?', 'ai');
      pesanSelamatDatangDitampilkan.current = true;
    }
  }, []);
  return (
    <>      <ConversationSidebar
        visible={sidebarVisible}
        onClose={() => setSidebarVisible(false)}
        onSelectConversation={handlePilihPercakapan}
        onNewChat={buatPercakapanBaru}
        percakapanAktif={percakapanId}
      />
      
      <div className="flex flex-col h-full w-full">
        <div className="relative flex-1 overflow-hidden">          <button 
            onClick={alihkanSidebar}
            className="absolute top-2 left-2 z-10 p-2 rounded-full bg-black/5 dark:bg-white/5 text-foreground/70 hover:text-foreground/90 hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
            title="Riwayat Percakapan"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
          
          <button 
            onClick={buatPercakapanBaru}
            className="absolute top-2 right-2 z-10 p-2 rounded-full bg-black/5 dark:bg-white/5 text-foreground/70 hover:text-foreground/90 hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
            title="Percakapan Baru"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </button>
          
          <div 
            ref={pesanContainerRef}
            className="absolute inset-0 px-4 py-6 overflow-y-auto scroll-smooth"
          >
          {daftarPesan.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-4">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-blue-500 to-purple-600 shadow-lg flex items-center justify-center mb-6">
                <span className="text-white text-2xl font-bold">W</span>
              </div>
              <h2 className="text-xl font-bold mb-2 text-foreground/90">Selamat datang di Wahit AI</h2>
              <p className="text-sm text-foreground/60 max-w-md">
                Tanyakan apapun dan dapatkan jawaban instan. Saya siap membantu Anda dengan berbagai pertanyaan.
              </p>
            </div>
          ) : (
            daftarPesan.map((pesan) => (
              <ChatMessage key={pesan.id} pesan={pesan} />
            ))
          )}
          
          {sedangMengirim && (
            <div className="flex items-center space-x-3 text-foreground/70 pl-4 mt-3 animate-fadeIn">
              <div className="flex h-8 items-center rounded-full bg-black/5 dark:bg-white/5 px-3 py-1">
                <div className="flex space-x-1 items-center">
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: '200ms' }}></div>
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '400ms' }}></div>
                  <span className="ml-2 text-xs font-medium">
                    Wahit AI sedang mengetik ({daftarModelAI.find(m => m.id === modelTerpilih)?.nama || modelTerpilih})
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="px-4 pt-3 pb-4 border-t border-black/5 dark:border-white/5 bg-gradient-to-b from-transparent to-background/40 backdrop-blur-sm">
        <ChatInput 
          mengirimPesan={handleKirimPesan} 
          sedangMengirim={sedangMengirim} 
          modelTerpilih={modelTerpilih}
          mengubahModel={handleUbahModel}
          daftarModel={daftarModelAI}
        />      </div>
    </div>
    </>
  );
};

export default ChatContainer;