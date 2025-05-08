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
    <div className="flex flex-col w-full bg-black/5 dark:bg-white/5 rounded-xl p-2 md:p-4">
      <textarea
        className="w-full bg-transparent border-none outline-none resize-none min-h-[60px] text-sm md:text-base placeholder:text-foreground/50"
        placeholder="Ketik pesan Anda di sini..."
        value={pesan}
        onChange={(e) => setPesan(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={sedangMengirim}
      />
      <div className="flex justify-end mt-2">
        <button
          className={`rounded-full px-4 py-2 text-sm font-medium transition-colors 
            ${sedangMengirim || !pesan.trim()
              ? 'bg-foreground/30 text-background/70 cursor-not-allowed' 
              : 'bg-foreground text-background hover:bg-[#383838] dark:hover:bg-[#ccc]'
            }`}
          onClick={handleKirim}
          disabled={sedangMengirim || !pesan.trim()}
        >
          {sedangMengirim ? 'Mengirim...' : 'Kirim'}
        </button>
      </div>
    </div>
  );
};

export default ChatInput;