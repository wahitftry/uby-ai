import { useState, useEffect } from 'react';
import { 
  getModelSekarang, 
  setModelSekarang, 
  getGayaResponsSekarang, 
  setGayaResponsSekarang,
  daftarModelAI,
  daftarGayaRespons
} from '../api/chatService';

export const useAIModel = () => {
  const [modelTerpilih, setModelTerpilih] = useState<string>(getModelSekarang());
  const [gayaResponsTerpilih, setGayaResponsTerpilih] = useState<string>(getGayaResponsSekarang());
  useEffect(() => {
    setModelTerpilih(getModelSekarang());
  }, []);

  const handleUbahModel = (modelId: string) => {
    const hasil = setModelSekarang(modelId);
    if (hasil.status === 'success') {
      setModelTerpilih(modelId);
      return true;
    }
    return false;
  };

  const handleUbahGayaRespons = (gayaId: string) => {
    const hasilGaya = setGayaResponsSekarang(gayaId);
    if (hasilGaya) {
      setGayaResponsTerpilih(gayaId);
      return true;
    }
    return false;
  };

  return {
    modelTerpilih,
    setModelTerpilih,
    gayaResponsTerpilih,
    setGayaResponsTerpilih,
    handleUbahModel,
    handleUbahGayaRespons,
    daftarModelAI
  };
};
