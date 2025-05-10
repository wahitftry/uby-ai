import React, { useState } from 'react';
import { PesanType } from '../types/chat';

interface BagiPercakapanProps {
  daftarPesan: PesanType[];
  judulPercakapan: string;
  onSelesai: () => void;
  onError: (pesan: string) => void;
}

const BagiPercakapan: React.FC<BagiPercakapanProps> = ({ 
  daftarPesan, 
  judulPercakapan,
  onSelesai,
  onError
}) => {
  const [sedangMembuat, setSedangMembuat] = useState<boolean>(false);
  const [linkBerbagi, setLinkBerbagi] = useState<string>('');
  
  const buatLinkBerbagi = async () => {
    try {
      setSedangMembuat(true);
      
      // Siapkan data untuk dibagikan
      const dataBerbagi = {
        judul: judulPercakapan,
        tanggalDibuat: Date.now(),
        pesan: daftarPesan.map(p => ({
          pesan: p.pesan,
          pengirim: p.pengirim,
          timestamp: p.timestamp
        }))
      };
      
      // Gunakan localStorage sebagai alternatif sementara untuk API sharing
      // Dalam implementasi nyata, Anda akan menggunakan API untuk menyimpan data
      const idBerbagi = `share_${Math.random().toString(36).substring(2, 15)}`;
      localStorage.setItem(`wahit_share_${idBerbagi}`, JSON.stringify(dataBerbagi));
      
      // Buat URL untuk berbagi
      const baseUrl = window.location.origin;
      const urlBerbagi = `${baseUrl}/shared/${idBerbagi}`;
      
      setLinkBerbagi(urlBerbagi);
      onSelesai();
    } catch (error) {
      console.error('Error membuat tautan berbagi:', error);
      onError('Terjadi kesalahan saat membuat tautan berbagi');
    } finally {
      setSedangMembuat(false);
    }
  };
  
  const salinKeClipboard = () => {
    if (!linkBerbagi) return;
    
    navigator.clipboard.writeText(linkBerbagi)
      .then(() => {
        onError('Tautan berhasil disalin ke clipboard');
      })
      .catch((err) => {
        console.error('Gagal menyalin tautan:', err);
        onError('Gagal menyalin tautan ke clipboard');
      });
  };
  
  return (
    <div className="w-full">
      {!linkBerbagi ? (
        <button
          onClick={buatLinkBerbagi}
          disabled={sedangMembuat}
          className="flex items-center gap-2 px-3 py-2 w-full bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
        >
          {sedangMembuat ? (
            <>
              <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
              <span>Membuat tautan...</span>
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="18" cy="5" r="3"></circle>
                <circle cx="6" cy="12" r="3"></circle>
                <circle cx="18" cy="19" r="3"></circle>
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
              </svg>
              <span>Buat Tautan Berbagi</span>
            </>
          )}
        </button>
      ) : (
        <div className="w-full">
          <div className="flex items-center gap-2 border border-black/10 dark:border-white/10 rounded-lg overflow-hidden mb-2">
            <input
              type="text"
              readOnly
              value={linkBerbagi}
              className="flex-1 bg-black/5 dark:bg-white/5 px-3 py-2 outline-none text-sm"
            />
            <button
              onClick={salinKeClipboard}
              className="p-2 bg-black/10 dark:bg-white/10 hover:bg-black/20 dark:hover:bg-white/20 transition-colors"
              title="Salin tautan"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BagiPercakapan;
