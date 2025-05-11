import { useState, useEffect } from 'react';
import { 
  setKunciEnkripsi as setAPIKunciEnkripsi, 
  getIsAuthenticated, 
  dekripsiPercakapan, 
  getModePrivasi, 
  setModePrivasi as setAPIModePrivasi 
} from '../api/chatService';
import { PercakapanType } from '../types/chat';

export const useEncryption = () => {
  const getInitialKunci = (): string | null => {
    if (typeof window !== 'undefined') {
      const savedKunci = localStorage.getItem('wahit_kunci_hash');
      if (savedKunci) {
        try {
          return atob(savedKunci);
        } catch (error) {
          console.error('Gagal mendekode kunci enkripsi:', error);
          localStorage.removeItem('wahit_kunci_hash');
        }
      }
    }
    return null;
  };

  const [kunciEnkripsi, setKunciEnkripsiState] = useState<string | null>(getInitialKunci());
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(getIsAuthenticated());
  const [modePrivasi, setModePrivasiState] = useState<boolean>(getModePrivasi());
  const [showEncryptionAlert, setShowEncryptionAlert] = useState<boolean>(false);
  const [selectedEncryptedConversation, setSelectedEncryptedConversation] = useState<string | null>(null);

  const handleLogin = (kunci: string) => {
    setKunciEnkripsiState(kunci);
    setAPIKunciEnkripsi(kunci);
    setIsAuthenticated(true);
    const kunciEncoded = btoa(kunci);
    localStorage.setItem('wahit_kunci_hash', kunciEncoded);
    localStorage.setItem('wahit_authenticated', 'true');
    return true;
  };

  const handleLogout = () => {
    setKunciEnkripsiState(null);
    setAPIKunciEnkripsi(null);
    setIsAuthenticated(false);
    localStorage.removeItem('wahit_kunci_hash');
    localStorage.removeItem('wahit_authenticated');
    return true;
  };

  const toggleModePrivasi = () => {
    const newStatus = !modePrivasi;
    setModePrivasiState(newStatus);
    setAPIModePrivasi(newStatus);
    return newStatus;
  };

  const bukaPercakapanTerenkripsi = (percakapan: PercakapanType, kunci: string) => {
    try {
      const percakapanDekripsi = dekripsiPercakapan(percakapan, kunci);
      return { sukses: true, data: percakapanDekripsi };
    } catch (error) {
      console.error('Gagal mendekripsi percakapan:', error);
      return { sukses: false, data: null };
    }
  };

  return {
    kunciEnkripsi,
    isAuthenticated,
    modePrivasi,
    showEncryptionAlert,
    setShowEncryptionAlert,
    selectedEncryptedConversation,
    setSelectedEncryptedConversation,
    handleLogin,
    handleLogout,
    toggleModePrivasi,
    bukaPercakapanTerenkripsi
  };
};
