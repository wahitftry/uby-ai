import { useState } from 'react';
import { 
  getPercakapanAktif, 
  setPercakapanAktif, 
  simpanPercakapan, 
  editJudulPercakapan, 
  hapusPercakapan, 
  generateId, 
  getPercakapan
} from '../api/chatService';
import { DaftarPesanType, PercakapanType } from '../types/chat';

export const useConversation = () => {
  const [percakapanId, setPercakapanId] = useState<string | null>(getPercakapanAktif());
  const [judulPercakapan, setJudulPercakapan] = useState<string>('');
  const [editJudul, setEditJudul] = useState<boolean>(false);

  const buatPercakapanBaru = () => {
    const id = generateId();
    setPercakapanId(id);
    setPercakapanAktif(id);
    setJudulPercakapan('Percakapan Baru');
    simpanPercakapan(id, 'Percakapan Baru', []);
    return id;
  };

  const handleEditJudul = () => {
    if (!percakapanId || !judulPercakapan.trim()) return false;
    
    const berhasil = editJudulPercakapan(percakapanId, judulPercakapan);
    setEditJudul(false);
    return berhasil;
  };

  const handlePilihPercakapan = (percakapan: PercakapanType, isEnkripsi: boolean, kunciEnkripsi: string | null = null) => {
    if (!isEnkripsi) {
      setPercakapanId(percakapan.id);
      setJudulPercakapan(percakapan.judul);
      setPercakapanAktif(percakapan.id);
      return true;
    }
    return false;
  };

  const handleHapusPercakapan = (idPercakapan: string) => {
    if (!idPercakapan) return false;
    
    try {
      return hapusPercakapan(idPercakapan);
    } catch (error) {
      console.error('Error saat menghapus percakapan:', error);
      return false;
    }
  };

  return {
    percakapanId,
    setPercakapanId,
    judulPercakapan,
    setJudulPercakapan,
    editJudul,
    setEditJudul,
    buatPercakapanBaru,
    handleEditJudul,
    handlePilihPercakapan,
    handleHapusPercakapan
  };
};
