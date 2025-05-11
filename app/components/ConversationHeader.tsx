import React from 'react';
import ContextWindowIndicator from './ContextWindowIndicator';

interface ConversationHeaderProps {
  onToggleSidebar: () => void;
  onNewChat: () => void;
  onToggleExportMenu: () => void;
  jumlahPesan: number;
  disableExport: boolean;
}

const ConversationHeader: React.FC<ConversationHeaderProps> = ({
  onToggleSidebar,
  onNewChat,
  onToggleExportMenu,
  jumlahPesan,
  disableExport
}) => {
  return (
    <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-4 py-3 bg-gradient-to-b from-background/95 to-transparent backdrop-blur-sm">
      <div className="flex items-center">
        <button 
          onClick={onToggleSidebar}
          className="p-2 mr-2 rounded-full bg-black/10 hover:bg-black/20 text-foreground/80 hover:text-foreground transition-colors"
          title="Riwayat Percakapan"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
        
        <ContextWindowIndicator jumlahPesan={jumlahPesan} maksimalPesan={30} />
      </div>
      
      <div className="flex gap-2">
        <button
          onClick={onNewChat}
          className="p-2 rounded-full bg-black/10 hover:bg-black/20 text-foreground/80 hover:text-foreground transition-colors"
          title="Percakapan Baru"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </button>
        
        <button
          onClick={onToggleExportMenu}
          className={`p-2 rounded-full ${
            disableExport 
              ? 'bg-black/5 text-foreground/40 cursor-not-allowed' 
              : 'bg-black/10 hover:bg-black/20 text-foreground/80 hover:text-foreground transition-colors'
          }`}
          title="Opsi Percakapan"
          disabled={disableExport}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="1"></circle>
            <circle cx="19" cy="12" r="1"></circle>
            <circle cx="5" cy="12" r="1"></circle>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ConversationHeader;
