'use client';

import React, { useState, KeyboardEvent } from 'react';
import ModelSelector from './ModelSelector';
import GayaResponsSelector from './GayaResponsSelector';
import TemplatePromptSelector from './TemplatePromptSelector';
import TemplatePromptManager from './TemplatePromptManager';
import TemplateFill from './TemplateFill';
import CodeSnippetManager from './CodeSnippetManager';
import { ModelAIType, TemplatePromptType, CodeSnippetType } from '../types/chat';
import { 
  getDaftarTemplatePrompt, 
  simpanTemplatePrompt, 
  hapusTemplatePrompt,
  getDaftarCodeSnippet,
  simpanCodeSnippet,
  hapusCodeSnippet
} from '../api/chatService';

interface ChatInputProps {
  mengirimPesan: (pesan: string) => void;
  sedangMengirim: boolean;
  modelTerpilih: string;
  gayaResponsTerpilih: string;
  mengubahModel: (modelId: string) => void;
  mengubahGayaRespons: (gayaId: string) => void;
  daftarModel: ModelAIType[];
}

const ChatInput: React.FC<ChatInputProps> = ({ 
  mengirimPesan, 
  sedangMengirim,
  modelTerpilih,
  gayaResponsTerpilih,
  mengubahModel,
  mengubahGayaRespons,
  daftarModel
})=> {  const [pesan, setPesan] = useState<string>('');
  const [showTemplateSelector, setShowTemplateSelector] = useState<boolean>(false);
  const [showTemplateManager, setShowTemplateManager] = useState<boolean>(false);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplatePromptType | null>(null);
  const [showTemplateFill, setShowTemplateFill] = useState<boolean>(false);
  const [showCodeSnippetManager, setShowCodeSnippetManager] = useState<boolean>(false);
    const handleKirim = () => {
    if (pesan.trim() && !sedangMengirim) {
      mengirimPesan(pesan);
      setPesan('');
    }
  };
  
  const handleTekanTombol = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleKirim();
    }
  };
  
  const handleTemplateSelect = (template: TemplatePromptType) => {
    if (template.template.includes('[input]')) {
      setSelectedTemplate(template);
      setShowTemplateFill(true);
    } else {
      setPesan(template.template);
      setShowTemplateSelector(false);
    }
    
    if (template.modelDisarankan && template.modelDisarankan !== modelTerpilih) {
      mengubahModel(template.modelDisarankan);
    }
    
    if (template.gayaResponsDisarankan && template.gayaResponsDisarankan !== gayaResponsTerpilih) {
      mengubahGayaRespons(template.gayaResponsDisarankan);
    }
  };
  
  const handleSaveTemplate = (template: TemplatePromptType) => {
    simpanTemplatePrompt(template);
  };
  
  const handleDeleteTemplate = (id: string) => {
    hapusTemplatePrompt(id);
  };
  
  const handleTemplateFilled = (filledTemplate: string) => {
    setPesan(filledTemplate);
    setSelectedTemplate(null);
  };
  
  const handleSaveCodeSnippet = (snippet: CodeSnippetType) => {
    simpanCodeSnippet(snippet);
  };
  
  const handleDeleteCodeSnippet = (id: string) => {
    hapusCodeSnippet(id);
  };
  
  const handleSelectCodeSnippet = (snippet: CodeSnippetType) => {
    let codeText = '';
    
    if (snippet.bahasa && snippet.bahasa !== 'plaintext') {
      codeText = '```' + snippet.bahasa + '\n' + snippet.kode + '\n```';
    } else {
      codeText = '```\n' + snippet.kode + '\n```';
    }
    
    if (pesan.trim()) {
      setPesan(pesan + '\n\n' + codeText);
    } else {
      setPesan(codeText);
    }
    
    setShowCodeSnippetManager(false);
  };
    
  return (
    <div className="flex flex-col w-full">
      <div className="flex justify-between mb-2">
        <GayaResponsSelector
          gayaResponsTerpilih={gayaResponsTerpilih}
          mengubahGayaRespons={mengubahGayaRespons}
          disabled={sedangMengirim}
        />
        <ModelSelector 
          modelTerpilih={modelTerpilih} 
          mengubahModel={mengubahModel} 
          daftarModel={daftarModel} 
        />
      </div>
      
      <div className="flex items-center gap-2 mb-2">
        <button
          onClick={() => setShowTemplateSelector(true)}
          className="p-1.5 rounded-full hover:bg-white/5 transition-colors text-foreground/60 hover:text-foreground flex items-center gap-1"
          title="Gunakan template prompt"
          disabled={sedangMengirim}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
          <span className="text-xs hidden sm:inline">Template</span>
        </button>
        
        <button
          onClick={() => setShowTemplateManager(true)}
          className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-foreground/60 hover:text-foreground"
          title="Kelola template prompt"
          disabled={sedangMengirim}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path d="M17 2.75a.75.75 0 00-1.5 0v5.5a.75.75 0 001.5 0v-5.5zM17 15.75a.75.75 0 00-1.5 0v1.5a.75.75 0 001.5 0v-1.5zM3.75 15a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5a.75.75 0 01.75-.75zM4.5 2.75a.75.75 0 00-1.5 0v5.5a.75.75 0 001.5 0v-5.5zM10 11a.75.75 0 01.75.75v5.5a.75.75 0 01-1.5 0v-5.5A.75.75 0 0110 11zM10.75 2.75a.75.75 0 00-1.5 0v1.5a.75.75 0 001.5 0v-1.5zM10 6a2 2 0 100 4 2 2 0 000-4zM3.75 10a2 2 0 100 4 2 2 0 000-4zM16.25 10a2 2 0 100 4 2 2 0 000-4z" />
          </svg>
        </button>
        
        <div className="h-5 w-px bg-black/10 dark:bg-white/10 mx-1"></div>
        
        <button
          onClick={() => setShowCodeSnippetManager(true)}
          className="p-1.5 rounded-full hover:bg-white/5 transition-colors text-foreground/60 hover:text-foreground flex items-center gap-1"
          title="Gunakan snippet kode"
          disabled={sedangMengirim}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path fillRule="evenodd" d="M6.28 5.22a.75.75 0 01.44 1.06L4.56 11l2.16 4.72a.75.75 0 11-1.38.57L3.06 11.29a.75.75 0 010-.57l2.22-5.5a.75.75 0 011.06-.44z" clipRule="evenodd" />
            <path fillRule="evenodd" d="M13.72 5.22a.75.75 0 00-.44 1.06l2.16 4.72-2.16 4.72a.75.75 0 001.38.57l2.22-5.5a.75.75 0 000-.57l-2.22-5.5a.75.75 0 00-1.06-.44z" clipRule="evenodd" />
          </svg>
          <span className="text-xs hidden sm:inline">Kode</span>
        </button>
      </div>
      
      <div className="relative flex items-end">
        <textarea
          className="w-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-2xl p-4 pr-16 outline-none resize-none min-h-[80px] max-h-[200px] text-sm md:text-base placeholder:text-foreground/40 transition-all duration-300 focus:shadow-lg focus:border-blue-500/40"
          placeholder="Ketik pesan Anda di sini..."
          value={pesan}
          onChange={(e) => setPesan(e.target.value)}
          onKeyDown={handleTekanTombol}
          disabled={sedangMengirim}
          rows={1}
          style={{
            overflow: 'hidden',
            height: 'auto',
            minHeight: '60px'
          }}
        />
        <button
          className={`absolute bottom-3 right-3 rounded-full w-10 h-10 flex items-center justify-center transition-all duration-300 ${
            sedangMengirim || !pesan.trim()
              ? 'bg-gray-300/50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 cursor-not-allowed' 
              : 'bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 text-white shadow-md hover:shadow-lg hover:scale-105 active:scale-95'
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
      <TemplatePromptSelector
        isOpen={showTemplateSelector}
        onClose={() => setShowTemplateSelector(false)}
        onSelectTemplate={handleTemplateSelect}
        templates={getDaftarTemplatePrompt()}
      />
      
      <TemplatePromptManager
        isOpen={showTemplateManager}
        onClose={() => setShowTemplateManager(false)}
        daftarTemplate={getDaftarTemplatePrompt()}
        onSaveTemplate={handleSaveTemplate}
        onDeleteTemplate={handleDeleteTemplate}
        onSelectTemplate={handleTemplateSelect}
      />
      
      <TemplateFill
        isOpen={showTemplateFill}
        onClose={() => setShowTemplateFill(false)}
        template={selectedTemplate}
        onSubmit={handleTemplateFilled}
      />
      
      <CodeSnippetManager
        isOpen={showCodeSnippetManager}
        onClose={() => setShowCodeSnippetManager(false)}
        daftarSnippet={getDaftarCodeSnippet()}
        onSaveSnippet={handleSaveCodeSnippet}
        onDeleteSnippet={handleDeleteCodeSnippet}
        onSelectSnippet={handleSelectCodeSnippet}
      />
      
      <CodeSnippetManager
        isOpen={showCodeSnippetManager}
        onClose={() => setShowCodeSnippetManager(false)}
        daftarSnippet={getDaftarCodeSnippet()}
        onSaveSnippet={handleSaveCodeSnippet}
        onDeleteSnippet={handleDeleteCodeSnippet}
        onSelectSnippet={handleSelectCodeSnippet}
      />
    </div>
  );
};

export default ChatInput;