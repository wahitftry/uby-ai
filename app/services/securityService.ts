import { DaftarPesanType, PercakapanType } from '../types/chat';
import { enkripsiData, dekripsiData, isDataTerenkripsi } from '../utils/enkripsi';

let modePrivasi: boolean = false;
let kunciEnkripsi: string | null = null;
let isAuthenticated: boolean = false;

if (typeof window !== 'undefined') {
  const modePrivasiTersimpan = localStorage.getItem('wahit_mode_privasi');
  if (modePrivasiTersimpan) {
    modePrivasi = modePrivasiTersimpan === 'true';
  }
}

export const setKunciEnkripsi = (kunci: string | null) => {
  kunciEnkripsi = kunci;
  isAuthenticated = kunci !== null;
  
  if (typeof window !== 'undefined') {
    if (kunci) {
      localStorage.setItem('wahit_authenticated', 'true');
      localStorage.setItem('wahit_kunci_hash', btoa(kunci));
    } else {
      localStorage.removeItem('wahit_authenticated');
      localStorage.removeItem('wahit_kunci_hash');
    }
  }
};

export const getIsAuthenticated = () => {
  if (typeof window !== 'undefined') {
    const auth = localStorage.getItem('wahit_authenticated');
    const savedKunci = localStorage.getItem('wahit_kunci_hash');
    isAuthenticated = (auth === 'true') && (savedKunci !== null);
    if (savedKunci && isAuthenticated && kunciEnkripsi === null) {
      try {
        kunciEnkripsi = atob(savedKunci);
      } catch (error) {
        console.error('Gagal mendekode kunci enkripsi:', error);
        localStorage.removeItem('wahit_kunci_hash');
        isAuthenticated = false;
      }
    }
  }
  return isAuthenticated;
};

export const setModePrivasi = (status: boolean) => {
  modePrivasi = status;
  if (typeof window !== 'undefined') {
    localStorage.setItem('wahit_mode_privasi', status.toString());
  }
};

export const getModePrivasi = () => {
  return modePrivasi;
};

export const enkripsiPercakapan = (percakapan: PercakapanType, kunci: string): PercakapanType => {
  if (!kunci) {
    return percakapan;
  }
  
  try {
    const percakapanEnkripsi = {
      ...percakapan,
      terenkripsi: true,
      pesan: enkripsiPesanDalamPercakapan(percakapan.pesan, kunci)
    };
    
    return percakapanEnkripsi;
  } catch (error) {
    console.error("Gagal mengenkripsi percakapan:", error);
    return percakapan;
  }
};

export const dekripsiPercakapan = (percakapan: PercakapanType, kunci: string): PercakapanType => {
  if (!percakapan.terenkripsi || !kunci) {
    return percakapan;
  }
  
  try {
    const percakapanDekripsi = {
      ...percakapan,
      terenkripsi: false,
      pesan: dekripsiPesanDalamPercakapan(percakapan.pesan, kunci)
    };
    
    return percakapanDekripsi;
  } catch (error) {
    console.error("Gagal mendekripsi percakapan:", error);
    return percakapan;
  }
};

const enkripsiPesanDalamPercakapan = (daftarPesan: DaftarPesanType, kunci: string): DaftarPesanType => {
  return daftarPesan.map(pesan => ({
    ...pesan,
    pesan: enkripsiData(pesan.pesan, kunci)
  }));
};

const dekripsiPesanDalamPercakapan = (daftarPesan: DaftarPesanType, kunci: string): DaftarPesanType => {
  return daftarPesan.map(pesan => ({
    ...pesan,
    pesan: dekripsiData(pesan.pesan, kunci)
  }));
};

export const cekPercakapanTerenkripsi = (id: string): boolean => {
  try {
    const storedDataRaw = localStorage.getItem(`wahit_percakapan_${id}`);
    if (!storedDataRaw) return false;
    
    const storedData = JSON.parse(storedDataRaw);
    return storedData.terenkripsi === true;
  } catch (error) {
    return false;
  }
};
