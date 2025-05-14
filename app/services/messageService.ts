import { ResponseAPIType } from '../types/chat';
import { getModelSekarang } from './modelService';
import { getGayaResponsById, getGayaResponsSekarang } from './responseStyleService';

let riwayatPesan: { role: string, content: string }[] = [];

export async function kirimPesan(
  pesan: string,
  onUpdate?: (konten: string) => void
): Promise<ResponseAPIType> {
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
        gayaResponsPetunjuk: petunjukKustom,
        stream: !!onUpdate
      })
    };
    
    if (onUpdate) {
      const respons = await fetch(`/api/chat`, konfigurasi);
      if (!respons.ok) {
        throw new Error(`Error: ${respons.status}`);
      }

      const reader = respons.body?.getReader();
      if (!reader) {
        throw new Error('Tidak bisa membaca stream respons');
      }

      const decoder = new TextDecoder();
      let kontenLengkap = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n\n');
        
        for (const line of lines) {
          if (line.startsWith('data:')) {
            const data = line.slice(5).trim();
            if (data === '[DONE]') continue;

            try {
              const jsonData = JSON.parse(data);
              if (jsonData.tipe === 'konten') {
                onUpdate(jsonData.konten);
                kontenLengkap = jsonData.kontenPenuh;
              }
            } catch (error) {
              console.error('Error memproses data streaming:', error);
            }
          }
        }
      }

      if (kontenLengkap) {
        riwayatPesan.push({ role: 'assistant', content: kontenLengkap });
        return {
          respons: kontenLengkap,
          status: 'success',
          kode: 200
        };
      }

      return {
        respons: 'Tidak ada respons dari AI',
        status: 'error',
        kode: 500
      };
    } else {
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
    }
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
