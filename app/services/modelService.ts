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
  { id: 'deepseek-v3', nama: 'Deepseek V3' },
  { id: 'deepseek-r1', nama: 'Deepseek R1 Thinking' },
  { id: 'o3-mini', nama: 'GPT o3 Mini' },
  { id: 'phi-4', nama: 'Phi 4' }
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
  return { status: 'error', pesan: 'Model tidak ditemukan' };
}
