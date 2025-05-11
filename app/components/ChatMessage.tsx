import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Components } from 'react-markdown';
import { PesanType } from '../types/chat';

interface ChatMessageProps {
  pesan: PesanType;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ pesan }) => {
  const isPengguna = pesan.pengirim === 'user';
  
  return (
    <div className={`flex w-full ${isPengguna ? 'justify-end' : 'justify-start'} mb-5 group`}>
      <div 
        className={`relative max-w-[85%] md:max-w-[75%] rounded-2xl px-5 py-3.5 shadow-sm transition-all duration-200 ${
          isPengguna 
            ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-tr-none' 
            : 'bg-white/5 rounded-tl-none backdrop-blur-sm border border-white/5'
        }`}
      >
        {isPengguna ? (
          <div className="text-sm md:text-base leading-relaxed">{pesan.pesan}</div>
        ) : (
          <div className="markdown text-sm md:text-base leading-relaxed">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                p: ({ node, ...props }) => <p className="mb-2" {...props} />,
                a: ({ node, ...props }) => <a className="text-blue-500 underline hover:text-blue-700" target="_blank" rel="noopener noreferrer" {...props} />,
                h1: ({ node, ...props }) => <h1 className="text-xl font-bold mt-4 mb-2" {...props} />,
                h2: ({ node, ...props }) => <h2 className="text-lg font-bold mt-4 mb-2" {...props} />,
                h3: ({ node, ...props }) => <h3 className="text-md font-bold mt-3 mb-1" {...props} />,
                ul: ({ node, ...props }) => <ul className="list-disc list-inside mb-4 pl-2" {...props} />,
                ol: ({ node, ...props }) => <ol className="list-decimal list-inside mb-4 pl-2" {...props} />,
                li: ({ node, ...props }) => <li className="mb-1" {...props} />,                code: ({ node, className, ...props }: any) => {
                  const isInline = props.inline;
                  return isInline ? (
                    <code className="bg-black/10 dark:bg-white/10 px-1 py-0.5 rounded text-sm" {...props} />
                  ) : (
                    <code className="block bg-black/10 dark:bg-white/10 p-3 rounded-md text-sm overflow-x-auto my-2" {...props} />
                  );
                },
                pre: ({ node, ...props }) => <pre className="bg-black/10 dark:bg-white/10 p-0 rounded-md overflow-x-auto my-2" {...props} />,
                blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-blue-500 pl-4 italic my-4" {...props} />,
                table: ({ node, ...props }) => <table className="border-collapse table-auto w-full my-4" {...props} />,
                th: ({ node, ...props }) => <th className="border border-black/10 dark:border-white/10 px-4 py-2 text-left" {...props} />,
                td: ({ node, ...props }) => <td className="border border-black/10 dark:border-white/10 px-4 py-2" {...props} />,
                img: ({ node, ...props }) => <img className="max-w-full h-auto my-2 rounded" {...props} />
              }}
            >
              {pesan.pesan}
            </ReactMarkdown>
          </div>
        )}
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
              <span className="font-medium text-blue-500 dark:text-blue-400">UBY AI</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;