import { TemplatePromptType } from '../types/chat';

let daftarTemplatePrompt: TemplatePromptType[] = [];
if (typeof window !== 'undefined') {
  try {
    const templateString = localStorage.getItem('wahit_template_prompt');
    if (templateString) {
      try {
        daftarTemplatePrompt = JSON.parse(templateString);
        if (!Array.isArray(daftarTemplatePrompt)) {
          throw new Error('Data template prompt tidak valid');
        }
      } catch (parseError) {
        console.error('Gagal memproses data template prompt:', parseError);
        daftarTemplatePrompt = [];
      }
    } else {
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
    const index = daftarTemplatePrompt.findIndex(t => t.id === template.id);
    
    if (index !== -1) {
      daftarTemplatePrompt[index] = template;
    } else {
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
      return false;
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
