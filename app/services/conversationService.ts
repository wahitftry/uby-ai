import { PercakapanType, DaftarPercakapanType, DaftarPesanType } from '../types/chat';
import { getModelSekarang } from './modelService';
import { getGayaResponsSekarang } from './responseStyleService';
import { getModePrivasi, enkripsiPercakapan } from './securityService';

let percakapanAktif: string | null = null;
let kunciEnkripsi: string | null = null;
let isAuthenticated: boolean = false;

if (typeof window !== 'undefined') {
  const percakapanAktifTersimpan = localStorage.getItem('wahit_percakapan_aktif');
  if (percakapanAktifTersimpan) {
    percakapanAktif = percakapanAktifTersimpan;
  }
}

export function simpanPercakapan(id: string, judul: string, pesan: DaftarPesanType): PercakapanType {  
  try {
    if (typeof window === 'undefined') {
      throw new Error('localStorage tidak tersedia');
    }
    
    if (!id) {
      throw new Error('ID percakapan tidak valid');
    }

    const pesanValid = Array.isArray(pesan) ? pesan : [];
    let daftarPercakapan: DaftarPercakapanType = [];
    try {
      const daftarPercakapanString = localStorage.getItem('wahit_percakapan');
      if (daftarPercakapanString) {
        daftarPercakapan = JSON.parse(daftarPercakapanString);
        if (!Array.isArray(daftarPercakapan)) {
          daftarPercakapan = [];
        }
      }
    } catch (parseError) {
      console.error('Error parsing data percakapan:', parseError);
      daftarPercakapan = [];
    }    
    
    const indexPercakapan = daftarPercakapan.findIndex(p => p.id === id);
    
    const percakapanLama = indexPercakapan >= 0 ? daftarPercakapan[indexPercakapan] : null;
    const judulPercakapan = judul || 
      (percakapanLama?.judul) || 
      (pesanValid.length > 0 && pesanValid[0].pengirim === 'user'
        ? pesanValid[0].pesan.substring(0, 30) + (pesanValid[0].pesan.length > 30 ? '...' : '')
        : 'Percakapan Baru');
    
    const waktuSekarang = Date.now();
    const percakapan: PercakapanType = {
      id,
      judul: judulPercakapan,
      tanggalDibuat: indexPercakapan >= 0 ? daftarPercakapan[indexPercakapan].tanggalDibuat : waktuSekarang,
      terakhirDiubah: waktuSekarang,
      pesanPertama: pesanValid.length > 0 && pesanValid[0].pengirim === 'user' ? pesanValid[0].pesan : undefined,
      model: getModelSekarang(),
      gayaRespons: getGayaResponsSekarang(),
      pesan: [...pesanValid],
      dibookmark: indexPercakapan >= 0 && daftarPercakapan[indexPercakapan].dibookmark ? true : false,
      privateMode: getModePrivasi() && !percakapanLama?.privateMode ? getModePrivasi() : percakapanLama?.privateMode
    };
    if (!getModePrivasi() || !percakapan.privateMode) {
      let percakapanToSave = { ...percakapan };
      if (kunciEnkripsi && isAuthenticated) {
        percakapanToSave = enkripsiPercakapan(percakapanToSave, kunciEnkripsi);
      }

      if (indexPercakapan >= 0) {
        daftarPercakapan[indexPercakapan] = percakapanToSave;
      } else {
        daftarPercakapan.unshift(percakapanToSave);
      }

      try {
        localStorage.setItem('wahit_percakapan', JSON.stringify(daftarPercakapan));
      } catch (storageError) {
        console.error('Error menyimpan ke localStorage:', storageError);
      }
    }

    setPercakapanAktif(id);
    
    return percakapan;
  } catch (error) {
    console.error('Error menyimpan percakapan:', error);
    
    const percakapanDefault: PercakapanType = {
      id,
      judul: judul || 'Percakapan Baru',
      tanggalDibuat: Date.now(),
      terakhirDiubah: Date.now(),
      model: getModelSekarang(),
      gayaRespons: getGayaResponsSekarang(),
      pesan: [],
      dibookmark: false
    };
    
    return percakapanDefault;
  }
}

export function getDaftarPercakapan(): DaftarPercakapanType {
  try {
    if (typeof window === 'undefined') {
      return [];
    }
    
    const daftarPercakapanString = localStorage.getItem('wahit_percakapan');
    if (!daftarPercakapanString) return [];
    
    return JSON.parse(daftarPercakapanString);
  } catch (error) {
    console.error('Error mendapatkan daftar percakapan:', error);
    return [];
  }
}

export function getPercakapan(id: string): PercakapanType | null {
  try {
    const daftarPercakapan = getDaftarPercakapan();
    const percakapan = daftarPercakapan.find(p => p.id === id);
    
    return percakapan || null;
  } catch (error) {
    console.error('Error mendapatkan percakapan:', error);
    return null;
  }
}

export function hapusPercakapan(id: string): boolean {
  try {
    if (typeof window === 'undefined') {
      return false;
    }
    
    const daftarPercakapanString = localStorage.getItem('wahit_percakapan');
    if (!daftarPercakapanString) return false;
    
    const daftarPercakapan: DaftarPercakapanType = JSON.parse(daftarPercakapanString);
    const daftarBaru = daftarPercakapan.filter(p => p.id !== id);
    
    localStorage.setItem('wahit_percakapan', JSON.stringify(daftarBaru));
    
    if (percakapanAktif === id) {
      percakapanAktif = null;
      localStorage.removeItem('wahit_percakapan_aktif');
    }
    
    return true;
  } catch (error) {
    console.error('Error menghapus percakapan:', error);
    return false;
  }
}

export function setPercakapanAktif(id: string | null) {
  percakapanAktif = id;
  
  if (typeof window !== 'undefined') {
    if (id === null) {
      localStorage.removeItem('wahit_percakapan_aktif');
    } else {
      localStorage.setItem('wahit_percakapan_aktif', id);
    }
  }
  
  return id;
}

export function getPercakapanAktif(): string | null {
  if (typeof window !== 'undefined') {
    const idTersimpan = localStorage.getItem('wahit_percakapan_aktif');
    if (idTersimpan) {
      const percakapanDitemukan = getPercakapan(idTersimpan);
      if (percakapanDitemukan) {
        percakapanAktif = idTersimpan;
        return idTersimpan;
      } else {
        localStorage.removeItem('wahit_percakapan_aktif');
      }
    }
  }
  
  return percakapanAktif;
}

export function toggleBookmarkPercakapan(id: string): boolean {
  try {
    if (typeof window === 'undefined') {
      return false;
    }
    
    const daftarPercakapan = getDaftarPercakapan();
    const index = daftarPercakapan.findIndex(p => p.id === id);
    
    if (index === -1) return false;
    
    daftarPercakapan[index].dibookmark = !daftarPercakapan[index].dibookmark;
    
    localStorage.setItem('wahit_percakapan', JSON.stringify(daftarPercakapan));
    return true;
  } catch (error) {
    console.error('Error toggle bookmark percakapan:', error);
    return false;
  }
}

export function getDaftarPercakapanBookmark(): PercakapanType[] {
  const daftarPercakapan = getDaftarPercakapan();
  return daftarPercakapan.filter(p => p.dibookmark);
}

export interface SearchFilter {
  keyword?: string | null;
  tanggalMulai?: string | null;
  tanggalSelesai?: string | null;
  modelAI?: string[] | null;
  bookmark?: boolean | null;
}

export function cariPercakapanLanjutan(filter: SearchFilter): PercakapanType[] {
  try {
    let hasilPercakapan = getDaftarPercakapan();
    if (filter.keyword && filter.keyword.trim() !== '') {
      const keyword = filter.keyword.toLowerCase().trim();
      hasilPercakapan = hasilPercakapan.filter(percakapan => {
        const judulMatch = percakapan.judul.toLowerCase().includes(keyword);
        const pesanMatch = percakapan.pesan.some(p => p.pesan.toLowerCase().includes(keyword));
        return judulMatch || pesanMatch;
      });
    }
    if (filter.tanggalMulai) {
      const tanggalMulai = new Date(filter.tanggalMulai);
      tanggalMulai.setHours(0, 0, 0, 0);
      hasilPercakapan = hasilPercakapan.filter(percakapan => {
        const tanggalPercakapan = new Date(percakapan.tanggalDibuat);
        return tanggalPercakapan >= tanggalMulai;
      });
    }
    
    if (filter.tanggalSelesai) {
      const tanggalSelesai = new Date(filter.tanggalSelesai);
      tanggalSelesai.setHours(23, 59, 59, 999);
      hasilPercakapan = hasilPercakapan.filter(percakapan => {
        const tanggalPercakapan = new Date(percakapan.terakhirDiubah || percakapan.tanggalDibuat);
        return tanggalPercakapan <= tanggalSelesai;
      });
    }
    if (filter.modelAI && filter.modelAI.length > 0) {
      hasilPercakapan = hasilPercakapan.filter(percakapan => 
        filter.modelAI?.includes(percakapan.model)
      );
    }
    if (filter.bookmark === true) {
      hasilPercakapan = hasilPercakapan.filter(p => p.dibookmark);
    }
    
    return hasilPercakapan;
  } catch (error) {
    console.error('Error mencari percakapan lanjutan:', error);
    return [];
  }
}

export function editJudulPercakapan(id: string, judulBaru: string): boolean {
  try {
    if (typeof window === 'undefined') {
      return false;
    }
    
    const daftarPercakapan = getDaftarPercakapan();
    const index = daftarPercakapan.findIndex(p => p.id === id);
    
    if (index === -1) return false;
    
    daftarPercakapan[index].judul = judulBaru;
    daftarPercakapan[index].terakhirDiubah = Date.now();
    
    localStorage.setItem('wahit_percakapan', JSON.stringify(daftarPercakapan));
    return true;
  } catch (error) {
    console.error('Error mengedit judul percakapan:', error);
    return false;
  }
}
