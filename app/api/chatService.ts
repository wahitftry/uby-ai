import { ResponseAPIType, ModelAIType, PercakapanType, DaftarPercakapanType, DaftarPesanType, PesanType, GayaResponsOption, GayaResponsKustom, TemplatePromptType, CodeSnippetType } from '../types/chat';
import { enkripsiData, dekripsiData, isDataTerenkripsi } from '../utils/enkripsi';

let riwayatPesan: { role: string, content: string }[] = [];
let modelSekarang: string = 'gpt-4o';
let percakapanAktif: string | null = null;
let gayaResponsSekarang: string = 'santai';
let modePrivasi: boolean = false;
let kunciEnkripsi: string | null = null;
let isAuthenticated: boolean = false;

if (typeof window !== 'undefined') {
  const modePrivasiTersimpan = localStorage.getItem('wahit_mode_privasi');
  if (modePrivasiTersimpan) {
    modePrivasi = modePrivasiTersimpan === 'true';
  }

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

// Load gaya respons kustom dari local storage
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
    // Check if it's an edit or a new style
    const index = daftarGayaResponsKustom.findIndex(g => g.id === gaya.id);
    
    if (index !== -1) {
      // Update existing style
      daftarGayaResponsKustom[index] = gaya;
    } else {
      // Add new style
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
      return false; // Tidak ada yang dihapus
    }
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('wahit_gaya_respons_kustom', JSON.stringify(daftarGayaResponsKustom));
      
      // Jika gaya respons yang aktif dihapus, kembali ke default
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

export async function kirimPesan(pesan: string): Promise<ResponseAPIType> {
  try {
    riwayatPesan.push({ role: 'user', content: pesan });
    
    if (riwayatPesan.length > 30) {
      riwayatPesan = riwayatPesan.slice(-30);
    }
    
    // Periksa jika gaya respons kustom atau bawaan
    const gayaRespons = getGayaResponsById(gayaResponsSekarang);
    const petunjukKustom = gayaRespons?.petunjuk || '';
    
    const konfigurasi = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        pesan,
        riwayatPesan,
        model: modelSekarang,
        gayaRespons: gayaResponsSekarang,
        gayaResponsPetunjuk: petunjukKustom
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
      model: modelSekarang,
      gayaRespons: gayaResponsSekarang,
      pesan: [...pesanValid],
      dibookmark: indexPercakapan >= 0 && daftarPercakapan[indexPercakapan].dibookmark ? true : false,
      privateMode: modePrivasi && !percakapanLama?.privateMode ? modePrivasi : percakapanLama?.privateMode
    };

    // Jika mode privasi aktif, kita tidak perlu menyimpan ke localStorage
    if (!modePrivasi || !percakapan.privateMode) {
      // Jika kunci enkripsi ada dan percakapan perlu disimpan, enkripsi dulu
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
      model: modelSekarang,
      gayaRespons: gayaResponsSekarang,
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
    
    // Filter berdasarkan kata kunci
    if (filter.keyword && filter.keyword.trim() !== '') {
      const keyword = filter.keyword.toLowerCase().trim();
      hasilPercakapan = hasilPercakapan.filter(percakapan => {
        const judulMatch = percakapan.judul.toLowerCase().includes(keyword);
        const pesanMatch = percakapan.pesan.some(p => p.pesan.toLowerCase().includes(keyword));
        return judulMatch || pesanMatch;
      });
    }
    
    // Filter berdasarkan tanggal mulai
    if (filter.tanggalMulai) {
      const tanggalMulai = new Date(filter.tanggalMulai);
      tanggalMulai.setHours(0, 0, 0, 0);
      hasilPercakapan = hasilPercakapan.filter(percakapan => {
        const tanggalPercakapan = new Date(percakapan.tanggalDibuat);
        return tanggalPercakapan >= tanggalMulai;
      });
    }
    
    // Filter berdasarkan tanggal selesai
    if (filter.tanggalSelesai) {
      const tanggalSelesai = new Date(filter.tanggalSelesai);
      tanggalSelesai.setHours(23, 59, 59, 999);
      hasilPercakapan = hasilPercakapan.filter(percakapan => {
        const tanggalPercakapan = new Date(percakapan.terakhirDiubah || percakapan.tanggalDibuat);
        return tanggalPercakapan <= tanggalSelesai;
      });
    }
    
    // Filter berdasarkan model AI
    if (filter.modelAI && filter.modelAI.length > 0) {
      hasilPercakapan = hasilPercakapan.filter(percakapan => 
        filter.modelAI?.includes(percakapan.model)
      );
    }
    
    // Filter berdasarkan bookmark
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

// Fungsi untuk mengatur kunci enkripsi
export const setKunciEnkripsi = (kunci: string | null) => {
  kunciEnkripsi = kunci;
  isAuthenticated = kunci !== null;
};

// Fungsi untuk mendapatkan status autentikasi
export const getIsAuthenticated = () => {
  return isAuthenticated;
};

// Fungsi untuk mengatur mode privasi
export const setModePrivasi = (status: boolean) => {
  modePrivasi = status;
  if (typeof window !== 'undefined') {
    localStorage.setItem('wahit_mode_privasi', status.toString());
  }
};

// Fungsi untuk mendapatkan status mode privasi
export const getModePrivasi = () => {
  return modePrivasi;
};

// Fungsi untuk mengenkripsi percakapan
export const enkripsiPercakapan = (percakapan: PercakapanType, kunci: string): PercakapanType => {
  if (!kunci) {
    return percakapan;
  }
  
  try {
    // Buat salinan percakapan dan tandai sebagai terenkripsi
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

// Fungsi untuk mendekripsi percakapan
export const dekripsiPercakapan = (percakapan: PercakapanType, kunci: string): PercakapanType => {
  if (!percakapan.terenkripsi || !kunci) {
    return percakapan;
  }
  
  try {
    // Buat salinan percakapan dan hapus tanda terenkripsi
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

// Fungsi untuk mengenkripsi pesan dalam percakapan
const enkripsiPesanDalamPercakapan = (daftarPesan: DaftarPesanType, kunci: string): DaftarPesanType => {
  return daftarPesan.map(pesan => ({
    ...pesan,
    pesan: enkripsiData(pesan.pesan, kunci)
  }));
};

// Fungsi untuk mendekripsi pesan dalam percakapan
const dekripsiPesanDalamPercakapan = (daftarPesan: DaftarPesanType, kunci: string): DaftarPesanType => {
  return daftarPesan.map(pesan => ({
    ...pesan,
    pesan: dekripsiData(pesan.pesan, kunci)
  }));
};

// Fungsi untuk memeriksa apakah percakapan terenkripsi
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

// Template Prompt
let daftarTemplatePrompt: TemplatePromptType[] = [];

// Load template prompt dari local storage
if (typeof window !== 'undefined') {
  try {
    const templateString = localStorage.getItem('wahit_template_prompt');
    if (templateString) {
      daftarTemplatePrompt = JSON.parse(templateString);
    } else {
      // Template default
      daftarTemplatePrompt = [
        {
          id: 'template-default-1',
          nama: 'Ringkasan Artikel',
          deskripsi: 'Meringkas artikel menjadi 3 poin utama',
          template: 'Tolong ringkas artikel berikut menjadi 3 poin utama dengan format bullet point:\n\n[input]',
          kategori: 'Writing',
          modelDisarankan: 'gpt-4',
          gayaResponsDisarankan: 'ringkas'
        },
        {
          id: 'template-default-2',
          nama: 'Analisis Kode',
          deskripsi: 'Menganalisis kode dan memberikan saran perbaikan',
          template: 'Tolong analisis kode berikut dan berikan saran untuk perbaikan atau optimalisasi:\n\n```\n[input]\n```',
          kategori: 'Coding',
          modelDisarankan: 'gpt-4',
          gayaResponsDisarankan: 'informatif'
        }
      ];
      
      localStorage.setItem('wahit_template_prompt', JSON.stringify(daftarTemplatePrompt));
    }
  } catch (e) {
    console.error('Error loading template prompts:', e);
  }
}

export function getDaftarTemplatePrompt(): TemplatePromptType[] {
  return daftarTemplatePrompt;
}

export function simpanTemplatePrompt(template: TemplatePromptType): boolean {
  try {
    // Check if it's an edit or a new template
    const index = daftarTemplatePrompt.findIndex(t => t.id === template.id);
    
    if (index !== -1) {
      // Update existing template
      daftarTemplatePrompt[index] = template;
    } else {
      // Add new template
      daftarTemplatePrompt.push(template);
    }
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('wahit_template_prompt', JSON.stringify(daftarTemplatePrompt));
    }
    
    return true;
  } catch (e) {
    console.error('Error saving template prompt:', e);
    return false;
  }
}

export function hapusTemplatePrompt(id: string): boolean {
  try {
    const indexSebelum = daftarTemplatePrompt.length;
    daftarTemplatePrompt = daftarTemplatePrompt.filter(template => template.id !== id);
    
    if (daftarTemplatePrompt.length === indexSebelum) {
      return false; // Tidak ada yang dihapus
    }
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('wahit_template_prompt', JSON.stringify(daftarTemplatePrompt));
    }
    
    return true;
  } catch (e) {
    console.error('Error deleting template prompt:', e);
    return false;
  }
}

// Code Snippet
let daftarCodeSnippet: CodeSnippetType[] = [];

// Load code snippet dari local storage
if (typeof window !== 'undefined') {
  try {
    const codeSnippetString = localStorage.getItem('wahit_code_snippet');
    if (codeSnippetString) {
      daftarCodeSnippet = JSON.parse(codeSnippetString);
    }
  } catch (e) {
    console.error('Error loading code snippets:', e);
  }
}

export function getDaftarCodeSnippet(): CodeSnippetType[] {
  return daftarCodeSnippet;
}

export function simpanCodeSnippet(snippet: CodeSnippetType): boolean {
  try {
    // Check if it's an edit or a new snippet
    const index = daftarCodeSnippet.findIndex(s => s.id === snippet.id);
    
    if (index !== -1) {
      // Update existing snippet
      daftarCodeSnippet[index] = snippet;
    } else {
      // Add new snippet
      daftarCodeSnippet.push(snippet);
    }
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('wahit_code_snippet', JSON.stringify(daftarCodeSnippet));
    }
    
    return true;
  } catch (e) {
    console.error('Error saving code snippet:', e);
    return false;
  }
}

export function hapusCodeSnippet(id: string): boolean {
  try {
    const indexSebelum = daftarCodeSnippet.length;
    daftarCodeSnippet = daftarCodeSnippet.filter(snippet => snippet.id !== id);
    
    if (daftarCodeSnippet.length === indexSebelum) {
      return false; // Tidak ada yang dihapus
    }
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('wahit_code_snippet', JSON.stringify(daftarCodeSnippet));
    }
    
    return true;
  } catch (e) {
    console.error('Error deleting code snippet:', e);
    return false;
  }
}