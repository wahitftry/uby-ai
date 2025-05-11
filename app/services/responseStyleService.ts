import { GayaResponsOption, GayaResponsKustom } from '../types/chat';

let gayaResponsSekarang: string = 'santai';

if (typeof window !== 'undefined') {
  const gayaResponsTersimpan = localStorage.getItem('wahit_gaya_respons');
  if (gayaResponsTersimpan) {
    gayaResponsSekarang = gayaResponsTersimpan;
  }
}

export const daftarGayaRespons: GayaResponsOption[] = [
  { 
    id: 'formal', 
    nama: 'Formal', 
    deskripsi: 'Jawaban dengan bahasa formal dan profesional',
    petunjuk: 'Gunakan bahasa formal dan profesional. Hindari bahasa gaul atau ekspresi informal.'
  },
  { 
    id: 'santai', 
    nama: 'Santai', 
    deskripsi: 'Jawaban dengan bahasa yang santai dan ramah',
    petunjuk: 'Gunakan bahasa yang santai dan ramah, seperti berbicara dengan teman. Boleh menggunakan bahasa percakapan sehari-hari.'
  },
  { 
    id: 'panjang', 
    nama: 'Panjang', 
    deskripsi: 'Jawaban dengan penjelasan yang detail dan mendalam',
    petunjuk: 'Berikan jawaban yang detail, menyeluruh dan mendalam. Jelaskan dengan contoh jika perlu.'
  },
  { 
    id: 'pendek', 
    nama: 'Pendek', 
    deskripsi: 'Jawaban singkat dan langsung pada inti permasalahan',
    petunjuk: 'Berikan jawaban yang singkat, padat dan jelas. Langsung ke poin utama tanpa elaborasi yang berlebihan.'
  }
];

let daftarGayaResponsKustom: GayaResponsKustom[] = [];
if (typeof window !== 'undefined') {
  try {
    const gayaResponsKustomString = localStorage.getItem('wahit_gaya_respons_kustom');
    if (gayaResponsKustomString) {
      daftarGayaResponsKustom = JSON.parse(gayaResponsKustomString);
    }
  } catch (e) {
    console.error('Error loading custom response styles:', e);
  }
}

export function getDaftarGayaResponsKustom(): GayaResponsKustom[] {
  return daftarGayaResponsKustom;
}

export function getDaftarGayaResponsGabungan(): GayaResponsOption[] {
  return [
    ...daftarGayaRespons,
    ...daftarGayaResponsKustom.map(gaya => ({
      ...gaya,
      isKustom: true
    }))
  ];
}

export function getGayaResponsById(id: string): GayaResponsOption | undefined {
  const gayaResponsBawaan = daftarGayaRespons.find(gaya => gaya.id === id);
  if (gayaResponsBawaan) return gayaResponsBawaan;
  
  const gayaResponsKustom = daftarGayaResponsKustom.find(gaya => gaya.id === id);
  if (gayaResponsKustom) return {
    ...gayaResponsKustom,
    isKustom: true
  };
  
  return undefined;
}

export function simpanGayaResponsKustom(gaya: GayaResponsKustom): boolean {
  try {
    const index = daftarGayaResponsKustom.findIndex(g => g.id === gaya.id);
    
    if (index !== -1) {
      daftarGayaResponsKustom[index] = gaya;
    } else {
      daftarGayaResponsKustom.push(gaya);
    }
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('wahit_gaya_respons_kustom', JSON.stringify(daftarGayaResponsKustom));
    }
    
    return true;
  } catch (e) {
    console.error('Error saving custom response style:', e);
    return false;
  }
}

export function hapusGayaResponsKustom(id: string): boolean {
  try {
    const indexSebelum = daftarGayaResponsKustom.length;
    daftarGayaResponsKustom = daftarGayaResponsKustom.filter(gaya => gaya.id !== id);
    
    if (daftarGayaResponsKustom.length === indexSebelum) {
      return false; 
    }
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('wahit_gaya_respons_kustom', JSON.stringify(daftarGayaResponsKustom));
      if (gayaResponsSekarang === id) {
        setGayaResponsSekarang('santai');
      }
    }
    
    return true;
  } catch (e) {
    console.error('Error deleting custom response style:', e);
    return false;
  }
}

export function getGayaResponsSekarang(): string {
  if (typeof window !== 'undefined') {
    const gayaTersimpan = localStorage.getItem('wahit_gaya_respons');
    if (gayaTersimpan) {
      gayaResponsSekarang = gayaTersimpan;
    }
  }
  return gayaResponsSekarang;
}

export function setGayaResponsSekarang(gayaId: string): boolean {
  const gayaValid = daftarGayaRespons.some(gaya => gaya.id === gayaId);
  
  if (gayaValid) {
    gayaResponsSekarang = gayaId;
    if (typeof window !== 'undefined') {
      localStorage.setItem('wahit_gaya_respons', gayaId);
    }
    return true;
  }
  
  return false;
}
