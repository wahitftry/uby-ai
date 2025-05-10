export type PesanType = {
  id: string;
  pesan: string;
  pengirim: 'user' | 'ai';
  timestamp: number;
};

export type DaftarPesanType = PesanType[];

export type PercakapanType = {
  id: string;
  judul: string;
  tanggalDibuat: number;
  terakhirDiubah: number;
  pesanPertama?: string;
  model: string;
  gayaRespons?: string;
  pesan: DaftarPesanType;
  dibookmark?: boolean;
  terenkripsi?: boolean;
  requireAuth?: boolean;
  privateMode?: boolean;
};

export type DaftarPercakapanType = PercakapanType[];

export type ResponseAPIType = {
  respons: string;
  status: 'success' | 'error';
  kode: number;
};

export type ModelAIType = {
  id: string;
  nama: string;
};

export type TemplatePromptType = {
  id: string;
  nama: string;
  deskripsi: string;
  template: string;
  kategori?: string;
  modelDisarankan?: string;
  gayaResponsDisarankan?: string;
};

export type DaftarTemplatePromptType = TemplatePromptType[];

export type GayaResponsType = string;

export type GayaResponsOption = {
  id: GayaResponsType;
  nama: string;
  deskripsi: string;
  petunjuk: string;
  isKustom?: boolean;
};

export type GayaResponsKustom = {
  id: string;
  nama: string;
  deskripsi: string;
  petunjuk: string;
};

export type DaftarGayaResponsKustom = GayaResponsKustom[];

export type CodeSnippetType = {
  id: string;
  nama: string;
  deskripsi?: string;
  kode: string;
  bahasa: string;
  kategori?: string;
  tag?: string[];
  createdAt: number;
  updatedAt: number;
};