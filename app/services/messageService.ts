import { ResponseAPIType } from '../types/chat';
import { getModelSekarang } from './modelService';
import { getGayaResponsById, getGayaResponsSekarang } from './responseStyleService';

let riwayatPesan: { role: string, content: string }[] = [];

export async function kirimPesan(pesan: string): Promise<ResponseAPIType> {
  try {
    riwayatPesan.push({ role: 'user', content: pesan });
    
    if (riwayatPesan.length > 30) {
      riwayatPesan = riwayatPesan.slice(-30);
    }
    const gayaRespons = getGayaResponsById(getGayaResponsSekarang());
    const petunjukKustom = gayaRespons?.petunjuk || '';
    
    const konfigurasi = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        pesan,
        riwayatPesan,
        model: getModelSekarang(),
        gayaRespons: getGayaResponsSekarang(),
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
