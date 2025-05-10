import React from 'react';
import { PesanType } from '../types/chat';

interface ChatMessageProps {
  pesan: PesanType;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ pesan }) => {
  const isPengguna = pesan.pengirim === 'user';  return (
    <div className={`flex w-full ${isPengguna ? 'justify-end' : 'justify-start'} mb-5 group`}>
      <div 
        className={`relative max-w-[85%] md:max-w-[75%] rounded-2xl px-5 py-3.5 shadow-sm transition-all duration-200 ${
          isPengguna 
            ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-tr-none' 
            : 'bg-black/5 dark:bg-white/5 rounded-tl-none backdrop-blur-sm border border-black/5 dark:border-white/5'
        }`}
      >
        <div className="text-sm md:text-base leading-relaxed">{pesan.pesan}</div>
        <div className={`text-xs mt-1.5 flex items-center ${isPengguna ? 'text-blue-100' : 'text-foreground/50'}`}>
          <span className="opacity-70">
            {new Date(pesan.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
          {isPengguna && (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 ml-1.5">
              <path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" />
            </svg>
          )}
          {!isPengguna && (
            <div className="flex items-center ml-1.5 text-xs">
              <span className="font-medium text-blue-500 dark:text-blue-400">Wahit AI</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;