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
  pesan: DaftarPesanType;
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