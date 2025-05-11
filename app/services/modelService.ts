import { ModelAIType } from '../types/chat';

let modelSekarang: string = 'gpt-4o';

if (typeof window !== 'undefined') {
  const modelTersimpan = localStorage.getItem('wahit_model_sekarang');
  if (modelTersimpan) {
    modelSekarang = modelTersimpan;
  }
}

export const daftarModelAI: ModelAIType[] = [
  { id: 'gpt-4o', nama: 'GPT-4o' },
  { id: 'gemini-pro', nama: 'Gemini Pro' },
  { id: 'claude-3-opus', nama: 'Claude 3 Opus' },
  { id: 'llama-3-70b', nama: 'Llama 3 70B' },
  { id: 'mistral-large', nama: 'Mistral Large' }
];

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
