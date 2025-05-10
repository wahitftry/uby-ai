import { ResponseAPIType, ModelAIType, PercakapanType, DaftarPercakapanType, DaftarPesanType, PesanType } from '../types/chat';

let riwayatPesan: { role: string, content: string }[] = [];
let modelSekarang: string = 'gpt-4o';
let percakapanAktif: string | null = null;
let gayaResponsSekarang: string = 'santai';

if (typeof window !== 'undefined') {
  const percakapanAktifTersimpan = localStorage.getItem('wahit_percakapan_aktif');
  if (percakapanAktifTersimpan) {
    percakapanAktif = percakapanAktifTersimpan;
  }
  const modelTersimpan = localStorage.getItem('wahit_model_sekarang');
  if (modelTersimpan) {
    modelSekarang = modelTersimpan;
  }
  const gayaResponsTersimpan = localStorage.getItem('wahit_gaya_respons');
  if (gayaResponsTersimpan) {
    gayaResponsSekarang = gayaResponsTersimpan;
  }
}

export const daftarModelAI: ModelAIType[] = [
  { id: 'gpt-4o', nama: 'GPT-4o' },
  { id: 'gemini-pro', nama: 'Gemini Pro' },
  { id: 'claude-3-opus', nama: 'Claude 3 Opus' },
  { id: 'llama-3-70b', nama: 'Llama 3 70B' },
  { id: 'mistral-large', nama: 'Mistral Large' }
];

export const daftarGayaRespons = [
  { 
    id: 'formal', 
    nama: 'Formal', 
    deskripsi: 'Jawaban dengan bahasa formal dan profesional' 
  },
  { 
    id: 'santai', 
    nama: 'Santai', 
    deskripsi: 'Jawaban dengan bahasa yang santai dan ramah' 
  },
  { 
    id: 'panjang', 
    nama: 'Panjang', 
    deskripsi: 'Jawaban dengan penjelasan yang detail dan mendalam' 
  },
  { 
    id: 'pendek', 
    nama: 'Pendek', 
    deskripsi: 'Jawaban singkat dan langsung pada inti permasalahan' 
  }
];

export async function kirimPesan(pesan: string): Promise<ResponseAPIType> {
  try {
    riwayatPesan.push({ role: 'user', content: pesan });
    
    if (riwayatPesan.length > 30) {
      riwayatPesan = riwayatPesan.slice(-30);
    }
    
    const konfigurasi = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        pesan,
        riwayatPesan,
        model: modelSekarang,
        gayaRespons: gayaResponsSekarang
      })
    };
    
    const respons = await fetch(`/api/chat`, konfigurasi);
    
    if (!respons.ok) {
      throw new Error(`Error: ${respons.status}`);
    }

    const data = await respons.json();
    if (data.status === 'success') {
      riwayatPesan.push({ role: 'assistant', content: data.respons });
    }
    
    return {
      respons: data.respons || data.message || 'Tidak ada respons dari AI',
      status: 'success',
      kode: respons.status
    };
    
  } catch (error) {
    console.error('Error mengirim pesan:', error);
    return {
      respons: 'Terjadi kesalahan saat berkomunikasi dengan AI. Silakan coba lagi.',
      status: 'error',
      kode: 500
    };
  }
}

export function getRiwayatPesan() {
  return [...riwayatPesan];
}

export function resetRiwayatPesan() {
  riwayatPesan = [];
  return { status: 'success' };
}

export function getModelSekarang() {
  if (typeof window !== 'undefined') {
    const modelTersimpan = localStorage.getItem('wahit_model_sekarang');
    if (modelTersimpan) {
      modelSekarang = modelTersimpan;
    }
  }
  return modelSekarang;
}

export function setModelSekarang(modelId: string) {
  if (daftarModelAI.some(model => model.id === modelId)) {
    modelSekarang = modelId;
    if (typeof window !== 'undefined') {
      localStorage.setItem('wahit_model_sekarang', modelId);
    }
    return { status: 'success', model: modelSekarang };
  }
  return { status: 'error', pesan: 'Model tidak valid' };
}

export function generateId(): string {
  return Date.now().toString() + Math.random().toString(36).substring(2, 10);
}

export function simpanPercakapan(id: string, judul: string, pesan: DaftarPesanType): PercakapanType {  try {
    if (typeof window === 'undefined') {
      throw new Error('localStorage tidak tersedia');
    }
    
    const daftarPercakapanString = localStorage.getItem('wahit_percakapan');
    const daftarPercakapan: DaftarPercakapanType = daftarPercakapanString 
      ? JSON.parse(daftarPercakapanString) 
      : [];
    
    const judulPercakapan = judul || 
      (pesan.length > 0 && pesan[0].pengirim === 'user'
        ? pesan[0].pesan.substring(0, 30) + (pesan[0].pesan.length > 30 ? '...' : '')
        : 'Percakapan Baru');
    
    const indexPercakapan = daftarPercakapan.findIndex(p => p.id === id);
    
    const waktuSekarang = Date.now();    const percakapan: PercakapanType = {
      id,
      judul: judulPercakapan,
      tanggalDibuat: indexPercakapan >= 0 ? daftarPercakapan[indexPercakapan].tanggalDibuat : waktuSekarang,
      terakhirDiubah: waktuSekarang,
      pesanPertama: pesan.length > 0 && pesan[0].pengirim === 'user' ? pesan[0].pesan : undefined,
      model: modelSekarang,
      gayaRespons: gayaResponsSekarang,
      pesan: [...pesan]
    };

    if (indexPercakapan >= 0) {
      daftarPercakapan[indexPercakapan] = percakapan;
    } else {
      daftarPercakapan.unshift(percakapan);
    }

    localStorage.setItem('wahit_percakapan', JSON.stringify(daftarPercakapan));
    
    return percakapan;
  } catch (error) {
    console.error('Error menyimpan percakapan:', error);
    throw error;
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
    
    const daftarPercakapan = getDaftarPercakapan();
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
}

export function getPercakapanAktif(): string | null {
  if (typeof window !== 'undefined') {
    const idTersimpan = localStorage.getItem('wahit_percakapan_aktif');
    if (idTersimpan) {
      percakapanAktif = idTersimpan;
      return idTersimpan;
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
    
    // Toggle status bookmark
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