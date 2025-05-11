import { useState, useRef } from 'react';

export const useUIState = () => {
  const [sidebarVisible, setSidebarVisible] = useState<boolean>(false);
  const [eksporMenuVisible, setEksporMenuVisible] = useState<boolean>(false);
  const [notifikasi, setNotifikasi] = useState<{pesan: string, tipe: 'sukses' | 'error'} | null>(null);
  const pesanContainerRef = useRef<HTMLDivElement>(null);
  const pesanSelamatDatangDitampilkan = useRef<boolean>(false);

  const tampilkanNotifikasi = (pesan: string, tipe: 'sukses' | 'error', waktuTampil: number = 3000) => {
    setNotifikasi({ pesan, tipe });
    setTimeout(() => setNotifikasi(null), waktuTampil);
  };

  const alihkanSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  return {
    sidebarVisible,
    setSidebarVisible,
    eksporMenuVisible,
    setEksporMenuVisible,
    notifikasi,
    setNotifikasi,
    tampilkanNotifikasi,
    alihkanSidebar,
    pesanContainerRef,
    pesanSelamatDatangDitampilkan
  };
};
