'use client';

import React, { useState } from 'react';
import { TemplatePromptType } from '../types/chat';

interface TemplateFillProps {
  isOpen: boolean;
  onClose: () => void;
  template: TemplatePromptType | null;
  onSubmit: (filledTemplate: string) => void;
}

const TemplateFill: React.FC<TemplateFillProps> = ({
  isOpen,
  onClose,
  template,
  onSubmit
}) => {
  const [userInput, setUserInput] = useState<string>('');
  
  const needsInput = template?.template.includes('[input]') ?? false;
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!template) return;
    
    let filledTemplate = template.template;
    
    if (needsInput) {
      filledTemplate = filledTemplate.replace(/\[input\]/g, userInput);
    }
    
    onSubmit(filledTemplate);
    onClose();
  };
  
  const handleCancel = () => {
    setUserInput('');
    onClose();
  };
  
  if (!isOpen || !template) return null;
  if (!needsInput) {
    onSubmit(template.template);
    onClose();
    return null;
  }
  
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center p-4">
      <div className="bg-background rounded-xl shadow-lg w-full max-w-lg overflow-hidden">
        <div className="p-4 border-b border-white/10 flex justify-between items-center">
          <h2 className="text-lg font-semibold">{template.nama}</h2>
          <button 
            onClick={handleCancel}
            className="text-foreground/70 hover:text-foreground transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div className="text-sm text-foreground/80">
            {template.deskripsi}
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Isi Template</label>
            <textarea
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              rows={8}
              className="w-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-lg p-2 text-sm outline-none focus:ring-1 focus:ring-blue-500 resize-none"
              placeholder="Masukkan teks untuk menggantikan [input] di template"
            />
          </div>
          
          <div className="text-xs text-foreground/60 space-y-1">
            <p>Preview Template:</p>
            <div className="bg-black/5 dark:bg-white/5 rounded p-2 whitespace-pre-wrap max-h-24 overflow-y-auto">
              {template.template.replace(/\[input\]/g, userInput || '[input]')}
            </div>
          </div>
          
          <div className="pt-2 flex justify-end space-x-2">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 text-sm border border-black/10 dark:border-white/10 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={!userInput.trim()}
              className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                !userInput.trim() ? 
                'bg-gray-400 text-gray-200 dark:bg-gray-700 dark:text-gray-500 cursor-not-allowed' : 
                'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              Gunakan Template
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TemplateFill;
