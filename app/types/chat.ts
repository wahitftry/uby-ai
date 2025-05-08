export type PesanType = {
  id: string;
  pesan: string;
  pengirim: 'user' | 'ai';
  timestamp: number;
};

export type DaftarPesanType = PesanType[];

export type ResponseAPIType = {
  respons: string;
  status: 'success' | 'error';
  kode: number;
};