'use client';

import React, { useState, useEffect, useRef } from 'react';
import { PesanType, DaftarPesanType } from '../types/chat';
import { kirimPesan } from '../api/chatService';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';

const generateUniqueId = () => {
  return Date.now().toString() + Math.random().toString(36).substring(2);
};

const ChatContainer: React.FC = () => {
  const [daftarPesan, setDaftarPesan] = useState<DaftarPesanType>([]);
  const [sedangMengirim, setSedangMengirim] = useState<boolean>(false);
  const pesanContainerRef = useRef<HTMLDivElement>(null);
  const pesanSelamatDatangDitampilkan = useRef<boolean>(false);
  
  useEffect(() => {
    if (pesanContainerRef.current) {
      pesanContainerRef.current.scrollTop = pesanContainerRef.current.scrollHeight;
    }
  }, [daftarPesan]);

  const tambahPesan = (isiPesan: string, pengirim: 'user' | 'ai') => {
    const pesanBaru: PesanType = {
      id: generateUniqueId(),
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
  
  useEffect(() => {
    if (daftarPesan.length === 0 && !pesanSelamatDatangDitampilkan.current) {
      tambahPesan('Halo! Saya adalah Wahit AI, asisten AI yang siap membantu Anda. Ada yang bisa saya bantu?', 'ai');
      pesanSelamatDatangDitampilkan.current = true;
    }
  }, []);

  return (
    <div className="flex flex-col h-full w-full max-w-3xl mx-auto">
      <div className="flex items-center justify-center py-4 border-b border-black/10 dark:border-white/10">
        <h1 className="text-2xl font-semibold">Wahit AI</h1>
      </div>
      
      <div 
        ref={pesanContainerRef}
        className="flex-1 p-4 overflow-y-auto"
      >
        {daftarPesan.map((pesan) => (
          <ChatMessage key={pesan.id} pesan={pesan} />
        ))}
        
        {sedangMengirim && (
          <div className="flex items-center space-x-2 text-foreground/70 pl-4">
            <div className="animate-pulse">Wahit AI sedang mengetik</div>
            <div className="flex space-x-1">
              <div className="w-2 h-2 rounded-full bg-foreground/70 animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 rounded-full bg-foreground/70 animate-bounce" style={{ animationDelay: '200ms' }}></div>
              <div className="w-2 h-2 rounded-full bg-foreground/70 animate-bounce" style={{ animationDelay: '400ms' }}></div>
            </div>
          </div>
        )}
      </div>
      
      <div className="p-4 border-t border-black/10 dark:border-white/10">
        <ChatInput mengirimPesan={handleKirimPesan} sedangMengirim={sedangMengirim} />
      </div>
    </div>
  );
};

export default ChatContainer;