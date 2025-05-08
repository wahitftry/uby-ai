'use client';

import React, { useState, KeyboardEvent } from 'react';

interface ChatInputProps {
  mengirimPesan: (pesan: string) => void;
  sedangMengirim: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ mengirimPesan, sedangMengirim }) => {
  const [pesan, setPesan] = useState<string>('');
  
  const handleKirim = () => {
    if (pesan.trim() && !sedangMengirim) {
      mengirimPesan(pesan);
      setPesan('');
    }
  };
  
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleKirim();
    }
  };
  
  return (
    <div className="flex flex-col w-full">
      <div className="relative flex items-end">
        <textarea
          className="w-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-2xl p-4 pr-16 outline-none resize-none min-h-[80px] max-h-[200px] text-sm md:text-base placeholder:text-foreground/40 transition-all duration-200 focus:shadow-md focus:border-blue-500/30"
          placeholder="Ketik pesan Anda di sini..."
          value={pesan}
          onChange={(e) => setPesan(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={sedangMengirim}
          rows={1}
          style={{
            overflow: 'hidden',
            height: 'auto',
            minHeight: '60px'
          }}
        />
        <button
          className={`absolute bottom-3 right-3 rounded-full w-10 h-10 flex items-center justify-center transition-all duration-200 ${
            sedangMengirim || !pesan.trim()
              ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed opacity-70' 
              : 'bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:shadow-md hover:scale-105 active:scale-95'
          }`}
          onClick={handleKirim}
          disabled={sedangMengirim || !pesan.trim()}
          aria-label="Kirim pesan"
        >
          {sedangMengirim ? (
            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
            </svg>
          )}
        </button>
      </div>
      <div className="text-xs text-center mt-2 text-foreground/40">
        Gunakan Enter untuk mengirim, Shift+Enter untuk baris baru
      </div>
    </div>
  );
};

export default ChatInput;