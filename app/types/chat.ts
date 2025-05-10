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

export type GayaResponsType = 'formal' | 'santai' | 'panjang' | 'pendek';

export type GayaResponsOption = {
  id: GayaResponsType;
  nama: string;
  deskripsi: string;
};