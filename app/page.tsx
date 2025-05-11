'use client';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import TemplatePromptSelector from './components/TemplatePromptSelector';
import TemplatePromptManager from './components/TemplatePromptManager';
import CodeSnippetManager from './components/CodeSnippetManager';
import CustomResponseStyleManager from './components/CustomResponseStyleManager';
import TemplateFill from './components/TemplateFill';
import { 
  TemplatePromptType, 
  GayaResponsKustom, 
  CodeSnippetType 
} from './types/chat';
import { 
  getDaftarTemplatePrompt, 
  simpanTemplatePrompt, 
  hapusTemplatePrompt,
  getDaftarCodeSnippet,
  simpanCodeSnippet,
  hapusCodeSnippet,
  getDaftarGayaResponsKustom,
  simpanGayaResponsKustom,
  hapusGayaResponsKustom
} from './api/chatService';

const ChatContainer = dynamic(() => import('./components/ChatContainer'), { 
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full">
      <div className="flex flex-col items-center">
        <div className="h-12 w-12 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 animate-pulse flex items-center justify-center">
          <span className="text-white font-bold text-xl">W</span>
        </div>
        <div className="mt-4 text-foreground/70 animate-pulse">Memuat UBY AI...</div>
      </div>
    </div>
  )
});

export default function Home() {
  const [showTemplateSelector, setShowTemplateSelector] = useState<boolean>(false);
  const [showTemplateManager, setShowTemplateManager] = useState<boolean>(false);
  const [showTemplateFill, setShowTemplateFill] = useState<boolean>(false);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplatePromptType | null>(null);
  const [showCodeSnippetManager, setShowCodeSnippetManager] = useState<boolean>(false);
  const [showResponseStyleManager, setShowResponseStyleManager] = useState<boolean>(false);
  const handleTemplateSelect = (template: TemplatePromptType, callback?: (template: TemplatePromptType) => void) => {
    if (template.template.includes('[input]')) {
      setSelectedTemplate(template);
      setShowTemplateFill(true);
    } else {
      callback?.(template);
      setShowTemplateSelector(false);
    }
  };
  
  const handleSaveTemplate = (template: TemplatePromptType) => {
    simpanTemplatePrompt(template);
  };
  
  const handleDeleteTemplate = (id: string) => {
    hapusTemplatePrompt(id);
  };
  
  const handleSaveCodeSnippet = (snippet: CodeSnippetType) => {
    simpanCodeSnippet(snippet);
  };
  
  const handleDeleteCodeSnippet = (id: string) => {
    hapusCodeSnippet(id);
  };
  const handleSaveResponseStyle = (gaya: GayaResponsKustom) => {
    simpanGayaResponsKustom(gaya);
  };
  
  const handleDeleteResponseStyle = (id: string) => {
    hapusGayaResponsKustom(id);
  };
  const dialogCallbacks = {
    onOpenTemplateSelector: () => setShowTemplateSelector(true),
    onOpenTemplateManager: () => setShowTemplateManager(true),
    onOpenCodeSnippetManager: () => setShowCodeSnippetManager(true),
    onOpenResponseStyleManager: () => setShowResponseStyleManager(true)
  };

  return (
    <div className="grid grid-rows-[auto_1fr] min-h-screen bg-gradient-to-b from-background to-background/95">
      <Navbar />
      
      <main className="flex-1 flex overflow-hidden p-4">
        <div className="w-full max-w-4xl mx-auto rounded-2xl shadow-lg border border-black/5 dark:border-white/5 overflow-hidden backdrop-blur-sm bg-background/70">
          <ChatContainer dialogCallbacks={dialogCallbacks} />
        </div>
      </main>
      <Footer />
      <TemplatePromptSelector
        isOpen={showTemplateSelector}
        onClose={() => setShowTemplateSelector(false)}
        onSelectTemplate={(template) => handleTemplateSelect(template, (template) => {
          const chatContainer = document.getElementById('chat-container');
          if (chatContainer) {
            const event = new CustomEvent('template-selected', { detail: template });
            chatContainer.dispatchEvent(event);
          }
        })}
        templates={getDaftarTemplatePrompt()}
      />
      <TemplatePromptManager
        isOpen={showTemplateManager}
        onClose={() => setShowTemplateManager(false)}
        daftarTemplate={getDaftarTemplatePrompt()}
        onSaveTemplate={handleSaveTemplate}
        onDeleteTemplate={handleDeleteTemplate}
        onSelectTemplate={(template) => handleTemplateSelect(template, (template) => {
          const chatContainer = document.getElementById('chat-container');
          if (chatContainer) {
            const event = new CustomEvent('template-selected', { detail: template });
            chatContainer.dispatchEvent(event);
          }
        })}
      />
      <TemplateFill
        isOpen={showTemplateFill}
        onClose={() => setShowTemplateFill(false)}
        template={selectedTemplate}
        onSubmit={(filledTemplate) => {
          setShowTemplateFill(false);
          const chatContainer = document.getElementById('chat-container');
          if (chatContainer) {
            const event = new CustomEvent('template-filled', { detail: filledTemplate });
            chatContainer.dispatchEvent(event);
          }
        }}
      />
      <CodeSnippetManager
        isOpen={showCodeSnippetManager}
        onClose={() => setShowCodeSnippetManager(false)}
        daftarSnippet={getDaftarCodeSnippet()}
        onSaveSnippet={handleSaveCodeSnippet}
        onDeleteSnippet={handleDeleteCodeSnippet}
        onSelectSnippet={(snippet) => {
          setShowCodeSnippetManager(false);
          const chatContainer = document.getElementById('chat-container');
          if (chatContainer) {
            const event = new CustomEvent('snippet-selected', { detail: snippet });
            chatContainer.dispatchEvent(event);
          }
        }}
      />
      <CustomResponseStyleManager
        isOpen={showResponseStyleManager}
        onClose={() => setShowResponseStyleManager(false)}
        daftarGayaResponsKustom={getDaftarGayaResponsKustom()}
        onSaveGayaRespons={handleSaveResponseStyle}
        onDeleteGayaRespons={handleDeleteResponseStyle}
        onSelectGayaRespons={(id) => {
          setShowResponseStyleManager(false);
          const chatContainer = document.getElementById('chat-container');
          if (chatContainer) {
            const event = new CustomEvent('style-selected', { detail: id });
            chatContainer.dispatchEvent(event);
          }
        }}
      />
    </div>
  );
}
