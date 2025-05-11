import { CodeSnippetType } from '../types/chat';

let daftarCodeSnippet: CodeSnippetType[] = [];
if (typeof window !== 'undefined') {
  try {
    const codeSnippetString = localStorage.getItem('wahit_code_snippet');
    if (codeSnippetString) {
      try {
        daftarCodeSnippet = JSON.parse(codeSnippetString);
        if (!Array.isArray(daftarCodeSnippet)) {
          throw new Error('Data code snippet tidak valid');
        }
      } catch (parseError) {
        console.error('Gagal memproses data code snippet:', parseError);
        daftarCodeSnippet = [];
      }
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
    const index = daftarCodeSnippet.findIndex(s => s.id === snippet.id);
    
    if (index !== -1) {
      daftarCodeSnippet[index] = snippet;
    } else {
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
      return false;
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
