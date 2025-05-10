'use client';

import React, { useState, useEffect, useRef } from 'react';
import { PesanType, DaftarPesanType, PercakapanType } from '../types/chat';
import { 
  kirimPesan, 
  daftarModelAI,
  daftarGayaRespons,
  getModelSekarang, 
  setModelSekarang,
  getGayaResponsSekarang,
  setGayaResponsSekarang,
  simpanPercakapan,
  getPercakapan,
  getPercakapanAktif,
  setPercakapanAktif,
  generateId,
  editJudulPercakapan,
  hapusPercakapan,
  setKunciEnkripsi,
  getIsAuthenticated,
  setModePrivasi,
  getModePrivasi,
  dekripsiPercakapan,
  cekPercakapanTerenkripsi
} from '../api/chatService';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import ConversationSidebar from './ConversationSidebar';
import EksporPDF from './EksporPDF';
import ContextWindowIndicator from './ContextWindowIndicator';
import AuthManager from './AuthManager';
import PrivacyModeToggle from './PrivacyModeToggle';
import EncryptionAlert from './EncryptionAlert';

const ChatContainer: React.FC = () => {
  const [daftarPesan, setDaftarPesan] = useState<DaftarPesanType>([]);
  const [sedangMengirim, setSedangMengirim] = useState<boolean>(false);
  const [modelTerpilih, setModelTerpilih] = useState<string>(getModelSekarang());
  const [gayaResponsTerpilih, setGayaResponsTerpilih] = useState<string>(getGayaResponsSekarang());
  const [sidebarVisible, setSidebarVisible] = useState<boolean>(false);
  const [percakapanId, setPercakapanId] = useState<string | null>(getPercakapanAktif());
  const [eksporMenuVisible, setEksporMenuVisible] = useState<boolean>(false);
  const [notifikasi, setNotifikasi] = useState<{pesan: string, tipe: 'sukses' | 'error'} | null>(null);
  const [judulPercakapan, setJudulPercakapan] = useState<string>('');
  const [editJudul, setEditJudul] = useState<boolean>(false);  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(getIsAuthenticated());
  const [modePrivasi, setModePrivasiState] = useState<boolean>(getModePrivasi());
  const [showEncryptionAlert, setShowEncryptionAlert] = useState<boolean>(false);
  const [selectedEncryptedConversation, setSelectedEncryptedConversation] = useState<string | null>(null);
  const getInitialKunci = (): string | null => {
    if (typeof window !== 'undefined') {
      const savedKunci = localStorage.getItem('wahit_kunci_hash');
      if (savedKunci) {
        try {
          return atob(savedKunci);
        } catch (error) {
          console.error('Gagal mendekode kunci enkripsi:', error);
          localStorage.removeItem('wahit_kunci_hash');
        }
      }
    }
    return null;
  };
  const [kunciEnkripsi, setKunciEnkripsiState] = useState<string | null>(getInitialKunci());
  
  const pesanContainerRef = useRef<HTMLDivElement>(null);
  const pesanSelamatDatangDitampilkan = useRef<boolean>(false);
  useEffect(() => {
    const initialKunci = getInitialKunci();
    
    if (initialKunci) {
      setKunciEnkripsiState(initialKunci);
      setKunciEnkripsi(initialKunci);
      setIsAuthenticated(true);
      const idTersimpan = getPercakapanAktif();
      if (idTersimpan) {
        const percakapan = getPercakapan(idTersimpan);
        if (percakapan && percakapan.terenkripsi) {
          try {
            const percakapanDekripsi = dekripsiPercakapan(percakapan, initialKunci);
            setDaftarPesan(percakapanDekripsi.pesan || []);
          } catch (error) {
            console.error('Gagal mendekripsi percakapan:', error);
          }
        }
      }
    }
  }, []);
  
  useEffect(() => {
    if (pesanContainerRef.current) {
      pesanContainerRef.current.scrollTop = pesanContainerRef.current.scrollHeight;
    }
  }, [daftarPesan]);  useEffect(() => {
    try {
      const idTersimpan = getPercakapanAktif();
      
      if (idTersimpan) {
        const percakapan = getPercakapan(idTersimpan);
        if (percakapan) {
          if (percakapan.terenkripsi && kunciEnkripsi) {
            const percakapanDekripsi = dekripsiPercakapan(percakapan, kunciEnkripsi);
            setDaftarPesan(percakapanDekripsi.pesan || []);
          } else {
            setDaftarPesan(percakapan.pesan || []);
          }
          
          setModelTerpilih(percakapan.model || getModelSekarang());
          setPercakapanId(idTersimpan);
          setJudulPercakapan(percakapan.judul || 'Percakapan');
          setModelSekarang(percakapan.model || getModelSekarang());
          
          if (percakapan.gayaRespons) {
            setGayaResponsTerpilih(percakapan.gayaRespons);
            setGayaResponsSekarang(percakapan.gayaRespons);
          }
          
          pesanSelamatDatangDitampilkan.current = true;
          return;
        }
      }
      
      const idBaru = generateId();
      setPercakapanId(idBaru);
      setPercakapanAktif(idBaru);
      setJudulPercakapan('Percakapan Baru');
      simpanPercakapan(idBaru, 'Percakapan Baru', []);
    } catch (error) {
      console.error('Error saat memuat percakapan aktif:', error);

      const idBaru = generateId();
      setPercakapanId(idBaru);
      setPercakapanAktif(idBaru);
      setJudulPercakapan('Percakapan Baru');
      simpanPercakapan(idBaru, 'Percakapan Baru', []);
    }
    
    pesanSelamatDatangDitampilkan.current = true;
  }, []);
  useEffect(() => {
    if (percakapanId && !sedangMengirim && daftarPesan.length > 0) {
      try {
        simpanPercakapan(percakapanId, judulPercakapan || '', daftarPesan);
        setPercakapanAktif(percakapanId);
        console.log('Percakapan tersimpan dengan ID:', percakapanId);
      } catch (error) {
        console.error('Error saat menyimpan percakapan:', error);
      }
    }
  }, [daftarPesan, percakapanId, judulPercakapan, sedangMengirim]);const tambahPesan = (isiPesan: string, pengirim: 'user' | 'ai') => {
    if (!isiPesan.trim()) return;
    
    const pesanBaru: PesanType = {
      id: generateId(),
      pesan: isiPesan,
      pengirim,
      timestamp: Date.now()
    };
    
    setDaftarPesan((pesanSebelumnya) => {
      const daftarBaru = [...pesanSebelumnya, pesanBaru];
      
      if (percakapanId) {
        try {
          setTimeout(() => {
            const judulBaru = judulPercakapan || 
              (pengirim === 'user' && isiPesan.trim() ? 
                isiPesan.substring(0, 30) + (isiPesan.length > 30 ? '...' : '') : 
                'Percakapan Baru');
            
            simpanPercakapan(percakapanId, judulBaru, daftarBaru);
            setPercakapanAktif(percakapanId);
          }, 0);
        } catch (error) {
          console.error('Error saat menyimpan pesan:', error);
        }
      }
      
      return daftarBaru;
    });
  }; 
  const ekstrakKalimatPertama = (teks: string): string => {
    let teksBersih = teks.replace(/[#*_~`]/g, '');
    teksBersih = teksBersih.replace(/^(Halo|Hai|Hi|Hello|Selamat pagi|Selamat siang|Selamat sore|Selamat malam),?\s+/i, '');
    const pola = /([.!?])\s+|([.!?])$/;
    const match = teksBersih.search(pola);
    let kalimatPertama: string;
    if (match !== -1) {
      kalimatPertama = teksBersih.substring(0, match + 1);
    } else {
      const barisBaruIndex = teksBersih.indexOf('\n');
      if (barisBaruIndex !== -1) {
        kalimatPertama = teksBersih.substring(0, barisBaruIndex);
      } else {
        kalimatPertama = teksBersih;
      }
    }
    
    if (kalimatPertama.trim().length < 10 && teksBersih.length > kalimatPertama.length) {
      const nextSentence = teksBersih.substring(kalimatPertama.length).trim();
      const nextEnd = nextSentence.search(pola);
      
      if (nextEnd !== -1) {
        kalimatPertama = kalimatPertama + ' ' + nextSentence.substring(0, nextEnd + 1);
      } else if (nextSentence.length > 0) {
        kalimatPertama = kalimatPertama + ' ' + nextSentence;
      }
    }
    
    if (kalimatPertama.length > 0) {
      kalimatPertama = kalimatPertama.charAt(0).toUpperCase() + kalimatPertama.slice(1);
    }
    
    if (kalimatPertama.length > 50) {
      kalimatPertama = kalimatPertama.substring(0, 50) + '...';
    }
    
    return kalimatPertama;
  };
  
  const handleKirimPesan = async (isiPesan: string) => {
    const percakapanKosong = daftarPesan.length === 0;
    
    if (!percakapanId) {
      const id = generateId();
      setPercakapanId(id);
      setPercakapanAktif(id);
      setJudulPercakapan(isiPesan.length > 30 ? isiPesan.substring(0, 30) + '...' : isiPesan);
    }
    
    tambahPesan(isiPesan, 'user');
    
    setSedangMengirim(true);
    
    try {
      const respons = await kirimPesan(isiPesan);
      if (respons.status === 'success') {
        tambahPesan(respons.respons, 'ai');
        if (percakapanKosong && percakapanId) {
          const kalimatPertama = ekstrakKalimatPertama(respons.respons);
          setJudulPercakapan(kalimatPertama);
          const berhasilUbahJudul = editJudulPercakapan(percakapanId, kalimatPertama);
          
          if (berhasilUbahJudul) {
            setNotifikasi({
              pesan: 'Judul percakapan otomatis diperbarui',
              tipe: 'sukses'
            });
            setTimeout(() => setNotifikasi(null), 3000);
          }
        }
      } else {
        tambahPesan('Maaf, terjadi kesalahan saat berkomunikasi dengan AI. Silakan coba lagi.', 'ai');
      }
    } catch (error) {
      console.error('Error:', error);
      tambahPesan('Maaf, terjadi kesalahan teknis. Silakan coba lagi.', 'ai');
    } finally {
      setSedangMengirim(false);
      
      if (percakapanId && daftarPesan.length > 0) {
        simpanPercakapan(
          percakapanId, 
          judulPercakapan || (daftarPesan[0].pesan.length > 30 ? daftarPesan[0].pesan.substring(0, 30) + '...' : daftarPesan[0].pesan),
          [...daftarPesan]
        );
      }
    }
  };
  const handleUbahModel = (modelId: string) => {
    const hasil = setModelSekarang(modelId);
    if (hasil.status === 'success') {
      setModelTerpilih(modelId);
      tambahPesan(`Model AI diubah ke ${daftarModelAI.find(m => m.id === modelId)?.nama || modelId}`, 'ai');
    }
  };
  
  const handleUbahGayaRespons = (gayaId: string) => {
    const hasilGaya = setGayaResponsSekarang(gayaId);
    if (hasilGaya) {
      setGayaResponsTerpilih(gayaId);
      tambahPesan(`Gaya respons AI diubah ke ${daftarGayaRespons.find(g => g.id === gayaId)?.nama || gayaId}`, 'ai');
    }
  };
  const buatPercakapanBaru = () => {
    const id = generateId();
    setPercakapanId(id);
    setPercakapanAktif(id);
    setDaftarPesan([]);
    setJudulPercakapan('Percakapan Baru');
    simpanPercakapan(id, 'Percakapan Baru', []);
    
    pesanSelamatDatangDitampilkan.current = true;
  };  const handlePilihPercakapan = (percakapan: PercakapanType) => {
    if (percakapan.terenkripsi) {
      let kunciUntukDekripsi = kunciEnkripsi;
      
      if (!kunciUntukDekripsi && typeof window !== 'undefined') {
        const savedKunci = localStorage.getItem('wahit_kunci_hash');
        if (savedKunci) {
          try {
            kunciUntukDekripsi = atob(savedKunci);
            if (kunciUntukDekripsi) {
              setKunciEnkripsiState(kunciUntukDekripsi);
              setKunciEnkripsi(kunciUntukDekripsi);
              setIsAuthenticated(true);
            }
          } catch (error) {
            console.error('Gagal mendekode kunci enkripsi:', error);
          }
        }
      }
      
      if (kunciUntukDekripsi) {
        try {
          const percakapanDekripsi = dekripsiPercakapan(percakapan, kunciUntukDekripsi);
          setDaftarPesan(percakapanDekripsi.pesan);
        } catch (error) {
          console.error('Gagal mendekripsi percakapan:', error);
          setShowEncryptionAlert(true);
          setSelectedEncryptedConversation(percakapan.id);
          return;
        }
      } else {
        setShowEncryptionAlert(true);
        setSelectedEncryptedConversation(percakapan.id);
        return; 
      }
    } else {
      setDaftarPesan(percakapan.pesan);
    }
    
    setModelTerpilih(percakapan.model);
    setPercakapanId(percakapan.id);
    setJudulPercakapan(percakapan.judul);
    setModelSekarang(percakapan.model);
    setPercakapanAktif(percakapan.id);
    
    if (percakapan.gayaRespons) {
      setGayaResponsTerpilih(percakapan.gayaRespons);
      setGayaResponsSekarang(percakapan.gayaRespons);
    }
    setSidebarVisible(false);
  };
    const alihkanSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };
  
  const handleEditJudul = () => {
    if (!percakapanId || !judulPercakapan.trim()) return;
    
    const berhasil = editJudulPercakapan(percakapanId, judulPercakapan);
    if (berhasil) {
      setEditJudul(false);
      setNotifikasi({
        pesan: 'Judul percakapan berhasil diubah',
        tipe: 'sukses'
      });
      setTimeout(() => setNotifikasi(null), 3000);
    } else {
      setNotifikasi({
        pesan: 'Gagal mengubah judul percakapan',
        tipe: 'error'
      });
      setTimeout(() => setNotifikasi(null), 3000);
    }
  };
  
  useEffect(() => {
    if (percakapanId) {
      const percakapan = getPercakapan(percakapanId);
      if (percakapan) {
        setJudulPercakapan(percakapan.judul);
      }
    }
  }, [percakapanId]);
  const handleLogin = (kunci: string) => {
    if (kunciEnkripsi !== kunci) {
      setKunciEnkripsi(kunci);
      setKunciEnkripsiState(kunci);
      setIsAuthenticated(true);
      const kunciEncoded = btoa(kunci);
      localStorage.setItem('wahit_kunci_hash', kunciEncoded);
      localStorage.setItem('wahit_authenticated', 'true');
      
      setNotifikasi({
        pesan: 'Berhasil masuk dengan kunci enkripsi',
        tipe: 'sukses'
      });
      
      setTimeout(() => {
        setNotifikasi(null);
      }, 3000);
      if (percakapanId) {
        const percakapanAktif = getPercakapan(percakapanId);
        if (percakapanAktif?.terenkripsi) {
          try {
            const percakapanDekripsi = dekripsiPercakapan(percakapanAktif, kunci);
            setDaftarPesan(percakapanDekripsi.pesan || []);
          } catch (error) {
            console.error('Gagal mendekripsi percakapan aktif:', error);
          }
        }
      }
      
      if (selectedEncryptedConversation) {
        bukaPercakapanTerenkripsi(selectedEncryptedConversation, kunci);
      }
    }
  };
    const handleLogout = () => {
    setKunciEnkripsi(null);
    setKunciEnkripsiState(null);
    setIsAuthenticated(false);
    
    localStorage.removeItem('wahit_kunci_hash');
    localStorage.removeItem('wahit_authenticated');
    
    const percakapanAktif = getPercakapan(percakapanId || '');
    if (percakapanAktif?.terenkripsi) {
      const idBaru = generateId();
      setPercakapanId(idBaru);
      setDaftarPesan([]);
      setJudulPercakapan('Percakapan Baru');
      simpanPercakapan(idBaru, 'Percakapan Baru', []);
    }
    
    setNotifikasi({
      pesan: 'Berhasil keluar',
      tipe: 'sukses'
    });
    
    setTimeout(() => {
      setNotifikasi(null);
    }, 3000);
  };
  
  const toggleModePrivasi = () => {
    const newStatus = !modePrivasi;
    setModePrivasiState(newStatus);
    setModePrivasi(newStatus);
    
    setNotifikasi({
      pesan: `Mode privasi ${newStatus ? 'diaktifkan' : 'dinonaktifkan'}`,
      tipe: 'sukses'
    });
    
    setTimeout(() => {
      setNotifikasi(null);
    }, 3000);
  };
  
  const bukaPercakapanTerenkripsi = (id: string, kunci: string) => {
    try {
      const percakapan = getPercakapan(id);
      if (!percakapan) throw new Error('Percakapan tidak ditemukan');
      const percakapanDekripsi = dekripsiPercakapan(percakapan, kunci);
      setDaftarPesan(percakapanDekripsi.pesan || []);
      setModelTerpilih(percakapanDekripsi.model || getModelSekarang());
      setPercakapanId(id);
      setJudulPercakapan(percakapanDekripsi.judul || 'Percakapan');
      setModelSekarang(percakapanDekripsi.model || getModelSekarang());
      
      if (percakapanDekripsi.gayaRespons) {
        setGayaResponsTerpilih(percakapanDekripsi.gayaRespons);
        setGayaResponsSekarang(percakapanDekripsi.gayaRespons);
      }
      setShowEncryptionAlert(false);
      setSelectedEncryptedConversation(null);
      
      setNotifikasi({
        pesan: 'Percakapan terenkripsi berhasil dibuka',
        tipe: 'sukses'
      });
      
      setTimeout(() => {
        setNotifikasi(null);
      }, 3000);
      
      return true;
    } catch (error) {
      console.error('Gagal membuka percakapan terenkripsi:', error);
      
      setNotifikasi({
        pesan: 'Kunci yang Anda masukkan salah',
        tipe: 'error'
      });
      
      setTimeout(() => {
        setNotifikasi(null);
      }, 3000);
      
      return false;
    }
  };  const handleBukaPercakapanTerenkripsi = (id: string) => {
    let kunciUntukDekripsi = kunciEnkripsi;
    
    if (!kunciUntukDekripsi && typeof window !== 'undefined') {
      const savedKunci = localStorage.getItem('wahit_kunci_hash');
      if (savedKunci) {
        try {
          kunciUntukDekripsi = atob(savedKunci);
          if (kunciUntukDekripsi) {
            setKunciEnkripsiState(kunciUntukDekripsi);
            setKunciEnkripsi(kunciUntukDekripsi);
            setIsAuthenticated(true);
          }
        } catch (error) {
          console.error('Gagal mendekode kunci enkripsi:', error);
        }
      }
    }
    
    if (kunciUntukDekripsi) {
      return bukaPercakapanTerenkripsi(id, kunciUntukDekripsi);
    } else {
      setSelectedEncryptedConversation(id);
      setShowEncryptionAlert(true);
      return false;
    }
  };
  
  const handleUnlockEncryptedConversation = (kunci: string) => {
    if (selectedEncryptedConversation) {
      const berhasil = bukaPercakapanTerenkripsi(selectedEncryptedConversation, kunci);
      
      if (berhasil) {
        setKunciEnkripsi(kunci);
        setKunciEnkripsiState(kunci);
        setIsAuthenticated(true);
      }
    }
  };

  return (
    <>      <ConversationSidebar
        visible={sidebarVisible}
        onClose={() => setSidebarVisible(false)}
        onSelectConversation={handlePilihPercakapan}
        onNewChat={buatPercakapanBaru}
        percakapanAktif={percakapanId}
        onOpenEncryptedConversation={handleBukaPercakapanTerenkripsi}
      />
        <div className="flex flex-col h-full w-full">
        <div className="relative flex-1 overflow-hidden">          <button 
            onClick={alihkanSidebar}
            className="absolute top-2 left-2 z-10 p-2 rounded-full bg-black/5 dark:bg.white/5 text-foreground/70 hover:text-foreground/90 hover:bg-black/10 dark:hover:bg.white/10 transition-colors"
            title="Riwayat Percakapan"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
          
          <div className="absolute top-2 left-12 z-10 flex items-center">
            <ContextWindowIndicator jumlahPesan={daftarPesan.length} maksimalPesan={30} />
          </div>
          
            <div className="absolute top-2 right-2 z-10 flex gap-2">
            <button
              onClick={() => setEksporMenuVisible(!eksporMenuVisible)}
              className="p-2 rounded-full bg-black/5 dark:bg.white/5 text-foreground/70 hover:text-foreground/90 hover:bg.black/10 dark:hover:bg.white/10 transition-colors"
              title="Opsi Percakapan"
              disabled={daftarPesan.length === 0}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="1"></circle>
                <circle cx="19" cy="12" r="1"></circle>
                <circle cx="5" cy="12" r="1"></circle>
              </svg>
            </button>
            
            <button 
              onClick={buatPercakapanBaru}
              className="p-2 rounded-full bg-black/5 dark:bg.white/5 text-foreground/70 hover:text-foreground/90 hover:bg.black/10 dark:hover:bg.white/10 transition-colors"
              title="Percakapan Baru"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </button>
          </div>
            {eksporMenuVisible && daftarPesan.length > 0 && (
            <div className="absolute top-14 right-2 z-20 bg-background/95 border border-black/10 dark:border.white/10 rounded-lg shadow-lg p-3 backdrop-blur-sm w-64">
              <h3 className="text-sm font-medium mb-2 text-center">Opsi Percakapan</h3>
                <div className="space-y-2">
                {!editJudul ? (
                  <div 
                    className="text-sm font-medium p-1 rounded hover:bg-black/5 dark:hover:bg.white/5 cursor-pointer transition-colors flex justify-between items-center" 
                    onClick={() => {
                      if (percakapanId) {
                        const percakapan = getPercakapan(percakapanId);
                        if (percakapan) {
                          setJudulPercakapan(percakapan.judul);
                          setEditJudul(true);
                        }
                      }
                    }}
                  >
                    <span className="truncate">
                      {getPercakapan(percakapanId || '')?.judul || 'UBY AI - Percakapan'}
                    </span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2">
                      <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                    </svg>
                  </div>
                ) : (
                  <div className="flex items-center gap-1">
                    <input
                      type="text"
                      value={judulPercakapan}
                      onChange={(e) => setJudulPercakapan(e.target.value)}
                      className="flex-1 bg-black/5 dark:bg.white/5 border border-black/10 dark:border.white/10 rounded py-1 px-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      autoFocus
                      placeholder="Judul percakapan..."
                    />
                    <button
                      onClick={handleEditJudul}
                      className="p-1 rounded bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </button>
                    <button
                      onClick={() => setEditJudul(false)}
                      className="p-1 rounded bg-black/10 dark:bg.white/10 hover:bg-black/20 dark:hover:bg.white/20 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </button>
                  </div>
                )}
                
                <hr className="border-t border-black/10 dark:border-white/10 my-2" />
                
                <EksporPDF 
                  daftarPesan={daftarPesan} 
                  judulPercakapan={getPercakapan(percakapanId || '')?.judul || 'UBY AI - Percakapan'}
                  onSelesai={() => {
                    setEksporMenuVisible(false);
                    setNotifikasi({
                      pesan: 'Percakapan berhasil diekspor ke PDF',
                      tipe: 'sukses'
                    });
                    setTimeout(() => setNotifikasi(null), 3000);
                  }}
                  onError={(pesan) => {
                    setNotifikasi({
                      pesan,
                      tipe: 'error'
                    });
                    setTimeout(() => setNotifikasi(null), 3000);
                  }}                />
                
                <hr className="border-t border-black/10 dark:border-white/10 my-2" />
                  <button
                  onClick={() => {
                    if (percakapanId && window.confirm('Apakah Anda yakin ingin menghapus percakapan ini?')) {
                      try {
                        const hasilHapus = hapusPercakapan(percakapanId);
                        if (hasilHapus) {
                          setEksporMenuVisible(false);
                          setNotifikasi({
                            pesan: 'Percakapan berhasil dihapus',
                            tipe: 'sukses'
                          });
                          buatPercakapanBaru();
                          setTimeout(() => setNotifikasi(null), 3000);
                        } else {
                          setNotifikasi({
                            pesan: 'Gagal menghapus percakapan',
                            tipe: 'error'
                          });
                          setTimeout(() => setNotifikasi(null), 3000);
                        }
                      } catch (error) {
                        console.error('Error saat menghapus percakapan:', error);
                        setNotifikasi({
                          pesan: 'Terjadi kesalahan saat menghapus percakapan',
                          tipe: 'error'
                        });
                        setTimeout(() => setNotifikasi(null), 3000);
                      }
                    }
                  }}
                  className="flex items-center gap-2 w-full px-3 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                  Hapus Percakapan
                </button>
              </div>
            </div>
          )}
            <div 
            ref={pesanContainerRef}
            id="container-pesan-pdf"
            className="absolute inset-0 px-4 py-6 overflow-y-auto scroll-smooth"
          >
          {daftarPesan.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-4">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-blue-500 to-purple-600 shadow-lg flex items-center justify-center mb-6">
                <span className="text-white text-2xl font-bold">W</span>
              </div>
              <h2 className="text-xl font-bold mb-2 text-foreground/90">Selamat datang di UBY AI</h2>
              <p className="text-sm text-foreground/60 max-w-md">
                Tanyakan apapun dan dapatkan jawaban instan. Saya siap membantu Anda dengan berbagai pertanyaan.
              </p>
            </div>
          ) : (
            daftarPesan.map((pesan) => (
              <ChatMessage key={pesan.id} pesan={pesan} />
            ))
          )}
          
          {sedangMengirim && (
            <div className="flex items-center space-x-3 text-foreground/70 pl-4 mt-3 animate-fadeIn">
              <div className="flex h-8 items-center rounded-full bg-black/5 dark:bg.white/5 px-3 py-1">
                <div className="flex space-x-1 items-center">
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: '200ms' }}></div>
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '400ms' }}></div>
                  <span className="ml-2 text-xs font-medium">
                    UBY AI sedang mengetik ({daftarModelAI.find(m => m.id === modelTerpilih)?.nama || modelTerpilih})
                  </span>
                </div>
              </div>
            </div>          )}
          
          {notifikasi && (
            <div className={`fixed bottom-20 left-1/2 transform -translate-x-1/2 z-50 px-4 py-2 rounded-full shadow-lg animate-fadeIn ${
              notifikasi.tipe === 'sukses' 
                ? 'bg-green-500 text-white' 
                : 'bg-red-500 text-white'
            }`}>
              <div className="flex items-center gap-2">
                {notifikasi.tipe === 'sukses' ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                )}
                {notifikasi.pesan}
              </div>
            </div>
          )}
          
          {showEncryptionAlert && (
            <EncryptionAlert
              onUnlock={handleUnlockEncryptedConversation}
              onCancel={() => {
                setShowEncryptionAlert(false);
                setSelectedEncryptedConversation(null);
              }}
            />
          )}
        </div>
      </div>
      
      <div className="px-4 pt-3 pb-4 border-t border-black/5 dark:border-white/5 bg-gradient-to-b from-transparent to-background/40 backdrop-blur-sm">
        <div className="flex flex-wrap justify-between items-center mb-2">
          <div className="mb-2 sm:mb-0">
            <AuthManager 
              onLogin={handleLogin}
              onLogout={handleLogout}
              isAuthenticated={isAuthenticated}
            />
          </div>
          <div className="mb-2 sm:mb-0">
            <PrivacyModeToggle 
              isPrivacyMode={modePrivasi}
              togglePrivacyMode={toggleModePrivasi}
            />
          </div>
        </div>
        
        <ChatInput 
          mengirimPesan={handleKirimPesan} 
          sedangMengirim={sedangMengirim} 
          modelTerpilih={modelTerpilih}
          gayaResponsTerpilih={gayaResponsTerpilih}
          mengubahModel={handleUbahModel}
          mengubahGayaRespons={handleUbahGayaRespons}
          daftarModel={daftarModelAI}
        />
      </div>
    </div>
    </>
  );
};

export default ChatContainer;