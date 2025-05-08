import React from 'react';
import { PesanType } from '../types/chat';

interface ChatMessageProps {
  pesan: PesanType;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ pesan }) => {
  const isPengguna = pesan.pengirim === 'user';
  
  return (
    <div className={`flex w-full ${isPengguna ? 'justify-end' : 'justify-start'} mb-4`}>
      <div 
        className={`max-w-[80%] md:max-w-[70%] rounded-2xl px-4 py-3 ${
          isPengguna 
            ? 'bg-foreground text-background rounded-tr-none' 
            : 'bg-black/10 dark:bg-white/10 rounded-tl-none'
        }`}
      >
        <div className="text-sm md:text-base">{pesan.pesan}</div>
        <div className={`text-xs mt-1 ${isPengguna ? 'text-background/70' : 'text-foreground/50'}`}>
          {new Date(pesan.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;