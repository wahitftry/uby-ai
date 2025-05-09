import { ResponseAPIType, ModelAIType } from '../types/chat';

let riwayatPesan: { role: string, content: string }[] = [];
let modelSekarang: string = 'gpt-4o';

export const daftarModelAI: ModelAIType[] = [
  { id: 'gpt-4o', nama: 'GPT-4o' },
  { id: 'gemini-pro', nama: 'Gemini Pro' },
  { id: 'claude-3-opus', nama: 'Claude 3 Opus' },
  { id: 'llama-3-70b', nama: 'Llama 3 70B' },
  { id: 'mistral-large', nama: 'Mistral Large' }
];

export async function kirimPesan(pesan: string): Promise<ResponseAPIType> {
  try {
    riwayatPesan.push({ role: 'user', content: pesan });
    
    if (riwayatPesan.length > 10) {
      riwayatPesan = riwayatPesan.slice(-10);
    }
    
    const konfigurasi = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        pesan,
        riwayatPesan,
        model: modelSekarang
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
  return modelSekarang;
}

export function setModelSekarang(modelId: string) {
  if (daftarModelAI.some(model => model.id === modelId)) {
    modelSekarang = modelId;
    return { status: 'success', model: modelSekarang };
  }
  return { status: 'error', pesan: 'Model tidak valid' };
}