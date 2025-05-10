import React from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { PesanType } from '../types/chat';

interface EksporPDFProps {
  daftarPesan: PesanType[];
  judulPercakapan: string;
  onSelesai: () => void;
  onError: (pesan: string) => void;
}

const EksporPDF: React.FC<EksporPDFProps> = ({ 
  daftarPesan, 
  judulPercakapan,
  onSelesai,
  onError
}) => {
  const eksporPDF = async () => {
    try {
      const containerPesan = document.getElementById('container-pesan-pdf');
      
      if (!containerPesan) {
        onError('Tidak dapat menemukan elemen percakapan');
        return;
      }
      
      // Tambahkan class untuk styling khusus ekspor
      containerPesan.classList.add('ekspor-pdf-aktif');
      
      // Buat PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      const lebarHalaman = pdf.internal.pageSize.getWidth();
      const marginKiri = 10;
      const marginKanan = 10;
      const lebarKonten = lebarHalaman - marginKiri - marginKanan;
      
      // Tambahkan judul
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(16);
      pdf.text(judulPercakapan || "Wahit AI - Percakapan", lebarHalaman / 2, 15, { align: 'center' });
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(10);
      pdf.text(`Diekspor pada: ${new Date().toLocaleString('id-ID')}`, lebarHalaman / 2, 22, { align: 'center' });
      
      let posisiY = 30;
      const marginAntarPesan = 10;
      const marginBawah = 20;
      
      // Proses setiap pesan
      for (let i = 0; i < daftarPesan.length; i++) {
        const pesan = daftarPesan[i];
        
        // Buat elemen pesan sementara untuk dirender
        const elemenPesan = document.createElement('div');
        
        // Styling elemen pesan
        elemenPesan.style.margin = '10px';
        elemenPesan.style.padding = '10px';
        elemenPesan.style.borderRadius = '5px';
        elemenPesan.style.maxWidth = '500px';
        elemenPesan.style.fontSize = '12px';
        elemenPesan.style.lineHeight = '1.5';
        
        if (pesan.pengirim === 'user') {
          elemenPesan.style.backgroundColor = '#3B82F6';
          elemenPesan.style.color = 'white';
        } else {
          elemenPesan.style.backgroundColor = '#F3F4F6';
          elemenPesan.style.color = 'black';
        }
        
        // Tambahkan header pengirim
        const headerPengirim = document.createElement('div');
        headerPengirim.style.marginBottom = '5px';
        headerPengirim.style.fontWeight = 'bold';
        headerPengirim.textContent = pesan.pengirim === 'user' ? 'Anda' : 'Wahit AI';
        elemenPesan.appendChild(headerPengirim);
        
        // Tambahkan isi pesan
        const isiPesan = document.createElement('div');
        isiPesan.textContent = pesan.pesan;
        elemenPesan.appendChild(isiPesan);
        
        // Tambahkan timestamp
        const timestamp = document.createElement('div');
        timestamp.style.marginTop = '5px';
        timestamp.style.fontSize = '10px';
        timestamp.style.opacity = '0.7';
        timestamp.textContent = new Date(pesan.timestamp).toLocaleString('id-ID');
        elemenPesan.appendChild(timestamp);
        
        // Tambahkan ke body untuk merender sementara
        document.body.appendChild(elemenPesan);
        
        // Konversi elemen ke canvas
        const canvas = await html2canvas(elemenPesan, {
          scale: 2,
          logging: false,
          useCORS: true
        });
        
        // Hapus elemen sementara
        document.body.removeChild(elemenPesan);
        
        // Konversi canvas ke gambar
        const imgData = canvas.toDataURL('image/png');
        const imgHeight = canvas.height * lebarKonten / canvas.width;
        
        // Cek apakah perlu halaman baru
        if (posisiY + imgHeight > pdf.internal.pageSize.getHeight() - marginBawah) {
          pdf.addPage();
          posisiY = 20;
        }
        
        // Tambahkan gambar ke PDF
        pdf.addImage(imgData, 'PNG', marginKiri, posisiY, lebarKonten, imgHeight);
        posisiY += imgHeight + marginAntarPesan;
      }
      
      // Hapus class styling ekspor
      containerPesan.classList.remove('ekspor-pdf-aktif');
      
      // Simpan dan unduh PDF
      const namaFile = `wahit-ai_${judulPercakapan.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${new Date().toISOString().slice(0, 10)}.pdf`;
      pdf.save(namaFile);
      
      onSelesai();
    } catch (error) {
      console.error('Error mengekspor PDF:', error);
      onError('Terjadi kesalahan saat mengekspor PDF');
    }
  };
  
  return (
    <button
      onClick={eksporPDF}
      className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
      title="Ekspor percakapan ke PDF"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
        <line x1="16" y1="13" x2="8" y2="13"></line>
        <line x1="16" y1="17" x2="8" y2="17"></line>
        <polyline points="10 9 9 9 8 9"></polyline>
      </svg>
      Ekspor PDF
    </button>
  );
};

export default EksporPDF;
