'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  getPercakapan,
  getPercakapanAktif,
  setPercakapanAktif,
  generateId,
  kirimPesan,
  daftarModelAI,
  simpanPercakapan,
  cekPercakapanTerenkripsi,
  dekripsiPercakapan,
  getDaftarGayaResponsGabungan,
} from '../api/chatService';

import { useChat } from '../hooks/useChat';
import { useConversation } from '../hooks/useConversation';
import { useEncryption } from '../hooks/useEncryption';
import { useUIState } from '../hooks/useUIState';
import { useAIModel } from '../hooks/useAIModel';

import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import ConversationSidebar from './ConversationSidebar';
import EncryptionManager from './EncryptionManager';
import ConversationHeader from './ConversationHeader';
import ConversationOptions from './ConversationOptions';
import { TemplatePromptType, CodeSnippetType } from '../types/chat';

interface DialogCallbacks {
  onOpenTemplateSelector: () => void;
  onOpenTemplateManager: () => void;
  onOpenCodeSnippetManager: () => void;
  onOpenResponseStyleManager: () => void;
}

interface ChatContainerProps {
  dialogCallbacks: DialogCallbacks;
}

const ChatContainer: React.FC<ChatContainerProps> = ({ dialogCallbacks }) => {
  const { 
    percakapanId, 
    setPercakapanId,
    judulPercakapan,
    setJudulPercakapan,
    editJudul,
    setEditJudul,
    buatPercakapanBaru,
    handleEditJudul,
    handlePilihPercakapan,
    handleHapusPercakapan
  } = useConversation();
  
  const {
    daftarPesan,
    setDaftarPesan,
    sedangMengirim,
    tambahPesan,
    ekstrakKalimatPertama,
    setSedangMengirim
  } = useChat(percakapanId, judulPercakapan, setPercakapanId, setJudulPercakapan);
  
  const {
    kunciEnkripsi,
    isAuthenticated,
    modePrivasi,
    showEncryptionAlert,
    setShowEncryptionAlert,
    selectedEncryptedConversation,
    setSelectedEncryptedConversation,
    handleLogin,
    handleLogout,
    toggleModePrivasi,
    bukaPercakapanTerenkripsi
  } = useEncryption();
  
  const {
    sidebarVisible,
    setSidebarVisible,
    eksporMenuVisible,
    setEksporMenuVisible,
    notifikasi,
    tampilkanNotifikasi,
    alihkanSidebar,
    pesanContainerRef,
    pesanSelamatDatangDitampilkan
  } = useUIState();
  
  const {
    modelTerpilih,
    setModelTerpilih,
    gayaResponsTerpilih,
    setGayaResponsTerpilih,
    handleUbahModel,
    handleUbahGayaRespons,
    daftarModelAI
  } = useAIModel();

  const [inputPesan, setInputPesan] = useState<string>('');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (pesanContainerRef.current) {
      pesanContainerRef.current.scrollTop = pesanContainerRef.current.scrollHeight;
    }
  }, [daftarPesan]);
  
  useEffect(() => {
    const container = document.getElementById('chat-container');
    
    const handleTemplateSelected = (event: Event) => {
      const template = (event as CustomEvent).detail as TemplatePromptType;
      
      if (template.modelDisarankan && template.modelDisarankan !== modelTerpilih) {
        handleUbahModel(template.modelDisarankan);
      }
      
      if (template.gayaResponsDisarankan && template.gayaResponsDisarankan !== gayaResponsTerpilih) {
        handleUbahGayaRespons(template.gayaResponsDisarankan);
      }
      
      setInputPesan(template.template);
    };
    
    const handleTemplateFilled = (event: Event) => {
      const filledTemplate = (event as CustomEvent).detail as string;
      setInputPesan(filledTemplate);
    };
    
    const handleSnippetSelected = (event: Event) => {
      const snippet = (event as CustomEvent).detail as CodeSnippetType;
      let codeText = '';
      
      if (snippet.bahasa && snippet.bahasa !== 'plaintext') {
        codeText = '```' + snippet.bahasa + '\n' + snippet.kode + '\n```';
      } else {
        codeText = '```\n' + snippet.kode + '\n```';
      }
      
      if (inputPesan.trim()) {
        setInputPesan(inputPesan + '\n\n' + codeText);
      } else {
        setInputPesan(codeText);
      }
    };
    
    const handleStyleSelected = (event: Event) => {
      const gayaId = (event as CustomEvent).detail as string;
      onUbahGayaRespons(gayaId);
    };
    
    if (container) {
      container.addEventListener('template-selected', handleTemplateSelected);
      container.addEventListener('template-filled', handleTemplateFilled);
      container.addEventListener('snippet-selected', handleSnippetSelected);
      container.addEventListener('style-selected', handleStyleSelected);
      
      return () => {
        container.removeEventListener('template-selected', handleTemplateSelected);
        container.removeEventListener('template-filled', handleTemplateFilled);
        container.removeEventListener('snippet-selected', handleSnippetSelected);
        container.removeEventListener('style-selected', handleStyleSelected);
      };
    }
  }, [modelTerpilih, gayaResponsTerpilih, inputPesan]);
  
  useEffect(() => {
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
          
          setModelTerpilih(percakapan.model || modelTerpilih);
          setPercakapanId(idTersimpan);
          setJudulPercakapan(percakapan.judul || 'Percakapan');
          
          if (percakapan.gayaRespons) {
            setGayaResponsTerpilih(percakapan.gayaRespons);
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
  }, [daftarPesan, percakapanId, judulPercakapan, sedangMengirim]);
  
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
          const berhasilUbahJudul = handleEditJudul();
          
          if (berhasilUbahJudul) {
            tampilkanNotifikasi('Judul percakapan otomatis diperbarui', 'sukses');
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
  
  const handleBukaPercakapanTerenkripsi = (id: string) => {
    const percakapan = getPercakapan(id);
    if (!percakapan) return false;
    
    if (kunciEnkripsi) {
      const { sukses, data } = bukaPercakapanTerenkripsi(percakapan, kunciEnkripsi);
      
      if (sukses && data) {
        setDaftarPesan(data.pesan || []);
        setModelTerpilih(data.model || modelTerpilih);
        setPercakapanId(id);
        setJudulPercakapan(data.judul || 'Percakapan');
        setPercakapanAktif(id);
        tampilkanNotifikasi('Percakapan terenkripsi berhasil dibuka', 'sukses');
        return true;
      }
    }
    
    setSelectedEncryptedConversation(id);
    setShowEncryptionAlert(true);
    return false;
  };
  
  const handleUnlockEncryptedConversation = (kunci: string) => {
    if (selectedEncryptedConversation) {
      const percakapan = getPercakapan(selectedEncryptedConversation);
      if (percakapan) {
        const { sukses, data } = bukaPercakapanTerenkripsi(percakapan, kunci);
        
        if (sukses && data) {
          setDaftarPesan(data.pesan || []);
          setModelTerpilih(data.model || modelTerpilih);
          setPercakapanId(selectedEncryptedConversation);
          setJudulPercakapan(data.judul || 'Percakapan');
          setPercakapanAktif(selectedEncryptedConversation);
          setShowEncryptionAlert(false);
          setSelectedEncryptedConversation(null);
          
          handleLogin(kunci);
          
          tampilkanNotifikasi('Percakapan terenkripsi berhasil dibuka', 'sukses');
          return true;
        } else {
          tampilkanNotifikasi('Kunci yang Anda masukkan salah', 'error');
          return false;
        }
      }
    }
    return false;
  };
  
  const pilihPercakapan = (id: string) => {
    const percakapan = getPercakapan(id);
    if (!percakapan) return;
    
    if (percakapan.terenkripsi) {
      return handleBukaPercakapanTerenkripsi(id);
    } else {
      setDaftarPesan(percakapan.pesan || []);
      setModelTerpilih(percakapan.model || modelTerpilih);
      setPercakapanId(id);
      setJudulPercakapan(percakapan.judul || 'Percakapan');
      setPercakapanAktif(id);
      
      if (percakapan.gayaRespons) {
        setGayaResponsTerpilih(percakapan.gayaRespons);
      }
      
      setSidebarVisible(false);
      return true;
    }
  };
  
  const onUbahModel = (modelId: string) => {
    const sukses = handleUbahModel(modelId);
    if (sukses) {
      tambahPesan(`Model AI diubah ke ${daftarModelAI.find(m => m.id === modelId)?.nama || modelId}`, 'ai');
    }
  };
  
  const onUbahGayaRespons = (gayaId: string) => {
    const sukses = handleUbahGayaRespons(gayaId);
    if (sukses) {
      const daftarGaya = getDaftarGayaResponsGabungan();
      const gayaNama = daftarGaya.find((g) => g.id === gayaId)?.nama || gayaId;
      tambahPesan(`Gaya respons AI diubah ke "${gayaNama}"`, 'ai');
    }
  };
  
  const konfirmasiHapusPercakapan = () => {
    if (percakapanId && window.confirm('Apakah Anda yakin ingin menghapus percakapan ini?')) {
      try {
        const hasilHapus = handleHapusPercakapan(percakapanId);
        
        if (hasilHapus) {
          setEksporMenuVisible(false);
          tampilkanNotifikasi('Percakapan berhasil dihapus', 'sukses');
          buatPercakapanBaru();
        } else {
          tampilkanNotifikasi('Gagal menghapus percakapan', 'error');
        }
      } catch (error) {
        console.error('Error saat menghapus percakapan:', error);
        tampilkanNotifikasi('Terjadi kesalahan saat menghapus percakapan', 'error');
      }
    }
  };

  return (
    <div id="chat-container" ref={containerRef} className="flex flex-col h-full w-full">
      <ConversationSidebar
        visible={sidebarVisible}
        onClose={() => setSidebarVisible(false)}
        onSelectConversation={(percakapan) => pilihPercakapan(percakapan.id)}
        onNewChat={buatPercakapanBaru}
        percakapanAktif={percakapanId}
        onOpenEncryptedConversation={handleBukaPercakapanTerenkripsi}
      />
      
      <div className="relative flex-1 overflow-hidden">
        <ConversationHeader 
          onToggleSidebar={alihkanSidebar}
          onNewChat={buatPercakapanBaru}
          onToggleExportMenu={() => setEksporMenuVisible(!eksporMenuVisible)}
          jumlahPesan={daftarPesan.length}
          disableExport={daftarPesan.length === 0}
        />
        
        <ConversationOptions
          daftarPesan={daftarPesan}
          percakapanId={percakapanId}
          judulPercakapan={judulPercakapan}
          editJudul={editJudul}
          visible={eksporMenuVisible && daftarPesan.length > 0}
          onToggleEditJudul={() => {
            if (percakapanId) {
              const percakapan = getPercakapan(percakapanId);
              if (percakapan) {
                setJudulPercakapan(percakapan.judul);
                setEditJudul(true);
              }
            }
          }}
          onChangeJudul={(e) => setJudulPercakapan(e.target.value)}
          onSaveJudul={() => {
            const sukses = handleEditJudul();
            if (sukses) {
              tampilkanNotifikasi('Judul percakapan berhasil diubah', 'sukses');
            } else {
              tampilkanNotifikasi('Gagal mengubah judul percakapan', 'error');
            }
          }}
          onCancelEditJudul={() => setEditJudul(false)}
          onDeleteConversation={konfirmasiHapusPercakapan}
          onExportSuccess={() => {
            setEksporMenuVisible(false);
            tampilkanNotifikasi('Percakapan berhasil diekspor ke PDF', 'sukses');
          }}
          onExportError={(pesan) => tampilkanNotifikasi(pesan, 'error')}
        />
        
        <div 
          ref={pesanContainerRef}
          id="container-pesan-pdf"
          className="absolute inset-0 px-4 pt-16 pb-6 overflow-y-auto scroll-smooth"
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
              <div className="flex h-8 items-center rounded-full bg-white/5 px-3 py-1">
                <div className="flex space-x-1 items-center">
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: '200ms' }}></div>
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '400ms' }}></div>
                  <span className="ml-2 text-xs font-medium">
                    UBY AI sedang mengetik ({daftarModelAI.find(m => m.id === modelTerpilih)?.nama || modelTerpilih})
                  </span>
                </div>
              </div>
            </div>
          )}
          
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
            <EncryptionManager
              isAuthenticated={isAuthenticated}
              modePrivasi={modePrivasi}
              showEncryptionAlert={showEncryptionAlert}
              onLogin={handleLogin}
              onLogout={handleLogout}
              togglePrivacyMode={toggleModePrivasi}
              onUnlockEncryptedConversation={handleUnlockEncryptedConversation}
              onCancelEncryptionAlert={() => {
                setShowEncryptionAlert(false);
                setSelectedEncryptedConversation(null);
              }}
            />
          )}
        </div>
      </div>
      
      <div className="px-4 pt-3 pb-4 border-t border-black/5 dark:border-white/5 bg-gradient-to-b from-transparent to-background/40 backdrop-blur-sm">
        <EncryptionManager
          isAuthenticated={isAuthenticated}
          modePrivasi={modePrivasi}
          showEncryptionAlert={false}
          onLogin={handleLogin}
          onLogout={handleLogout}
          togglePrivacyMode={toggleModePrivasi}
          onUnlockEncryptedConversation={handleUnlockEncryptedConversation}
          onCancelEncryptionAlert={() => {}}
        />
        
        <ChatInput 
          mengirimPesan={(pesan) => {
            handleKirimPesan(pesan);
            setInputPesan('');
          }}
          sedangMengirim={sedangMengirim} 
          modelTerpilih={modelTerpilih}
          gayaResponsTerpilih={gayaResponsTerpilih}
          mengubahModel={onUbahModel}
          mengubahGayaRespons={onUbahGayaRespons}
          daftarModel={daftarModelAI}
          inputPesan={inputPesan}
          onInputChange={(pesan) => setInputPesan(pesan)}
          dialogCallbacks={dialogCallbacks}
        />
      </div>
    </div>
  );
};

export default ChatContainer;