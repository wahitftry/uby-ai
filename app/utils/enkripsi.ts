export const enkripsiData = (data: string, kunci: string): string => {
  if (!data) return '';
  
  try {
    const enkripsi = Array.from(data)
      .map((char, i) => {
        const kunciChar = kunci.charCodeAt(i % kunci.length);
        return String.fromCharCode(char.charCodeAt(0) ^ kunciChar);
      })
      .join('');
    const bytesEnkripsi = new TextEncoder().encode(enkripsi);
    
    return btoa(
      Array.from(bytesEnkripsi)
        .map(byte => String.fromCharCode(byte))
        .join('')
    );
  } catch (error) {
    console.error("Gagal mengenkripsi data:", error);
    return '';
  }
};

export const dekripsiData = (dataEnkripsi: string, kunci: string): string => {
  if (!dataEnkripsi) return '';
  
  try {
    const dataBase64 = atob(dataEnkripsi);
    const bytes = new Uint8Array(dataBase64.length);
    for (let i = 0; i < dataBase64.length; i++) {
      bytes[i] = dataBase64.charCodeAt(i);
    }
    const stringValue = new TextDecoder().decode(bytes);
    const dekripsi = Array.from(stringValue)
      .map((char, i) => {
        const kunciChar = kunci.charCodeAt(i % kunci.length);
        return String.fromCharCode(char.charCodeAt(0) ^ kunciChar);
      })
      .join('');
    
    return dekripsi;
  } catch (error) {
    console.error("Gagal mendekripsi data:", error);
    return '';
  }
};
export const isDataTerenkripsi = (data: string): boolean => {
  try {
    JSON.parse(data);
    return false;
  } catch (error) {
    const base64Regex = /^[A-Za-z0-9+/=]+$/;
    return base64Regex.test(data);
  }
};
export const hashKunci = (kunci: string): string => {
  let hash = 0;
  if (kunci.length === 0) return hash.toString();
  
  for (let i = 0; i < kunci.length; i++) {
    const char = kunci.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  
  return hash.toString();
};
