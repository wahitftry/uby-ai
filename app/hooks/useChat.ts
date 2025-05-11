import { useState, useRef } from 'react';
import { PesanType, DaftarPesanType } from '../types/chat';
import { kirimPesan, generateId, simpanPercakapan } from '../api/chatService';

export const useChat = (percakapanId: string | null, judulPercakapan: string, setPercakapanId: (id: string) => void, setJudulPercakapan: (judul: string) => void) => {
  const [daftarPesan, setDaftarPesan] = useState<DaftarPesanType>([]);
  const [sedangMengirim, setSedangMengirim] = useState<boolean>(false);
  
  const tambahPesan = (isiPesan: string, pengirim: 'user' | 'ai') => {
    if (!isiPesan.trim()) return;
    
    const pesanBaru: PesanType = {
      id: generateId(),
      pesan: isiPesan,
      pengirim,
      timestamp: Date.now()
    };
    
    setDaftarPesan((pesanSebelumnya) => {
      const daftarBaru = [...pesanSebelumnya, pesanBaru];
      
      if (percakapanId) {
        try {
          setTimeout(() => {
            const judulBaru = judulPercakapan || 
              (pengirim === 'user' && isiPesan.trim() ? 
                isiPesan.substring(0, 30) + (isiPesan.length > 30 ? '...' : '') : 
                'Percakapan Baru');
            
            simpanPercakapan(percakapanId, judulBaru, daftarBaru);
          }, 0);
        } catch (error) {
          console.error('Error saat menyimpan pesan:', error);
        }
      }
      
      return daftarBaru;
    });
  };
  
  const ekstrakKalimatPertama = (teks: string): string => {
    let teksBersih = teks.replace(/[#*_~`]/g, '');
    teksBersih = teksBersih.replace(/^(Halo|Hai|Hi|Hello|Selamat pagi|Selamat siang|Selamat sore|Selamat malam),?\s+/i, '');
    const pola = /([.!?])\s+|([.!?])$/;
    const match = teksBersih.search(pola);
    let kalimatPertama: string;
    if (match !== -1) {
      kalimatPertama = teksBersih.substring(0, match + 1);
    } else {
      const barisBaruIndex = teksBersih.indexOf('\n');
      if (barisBaruIndex !== -1) {
        kalimatPertama = teksBersih.substring(0, barisBaruIndex);
      } else {
        kalimatPertama = teksBersih;
      }
    }
    
    if (kalimatPertama.trim().length < 10 && teksBersih.length > kalimatPertama.length) {
      const nextSentence = teksBersih.substring(kalimatPertama.length).trim();
      const nextEnd = nextSentence.search(pola);
      
      if (nextEnd !== -1) {
        kalimatPertama = kalimatPertama + ' ' + nextSentence.substring(0, nextEnd + 1);
      } else if (nextSentence.length > 0) {
        kalimatPertama = kalimatPertama + ' ' + nextSentence;
      }
    }
    
    if (kalimatPertama.length > 0) {
      kalimatPertama = kalimatPertama.charAt(0).toUpperCase() + kalimatPertama.slice(1);
    }
    
    if (kalimatPertama.length > 50) {
      kalimatPertama = kalimatPertama.substring(0, 50) + '...';
    }
    
    return kalimatPertama;
  };

  return {
    daftarPesan,
    setDaftarPesan,
    sedangMengirim,
    tambahPesan,
    ekstrakKalimatPertama,
    setSedangMengirim
  };
};
