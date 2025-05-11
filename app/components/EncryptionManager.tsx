import React from 'react';
import AuthManager from './AuthManager';
import PrivacyModeToggle from './PrivacyModeToggle';
import EncryptionAlert from './EncryptionAlert';

interface EncryptionManagerProps {
  isAuthenticated: boolean;
  modePrivasi: boolean;
  showEncryptionAlert: boolean;
  onLogin: (kunci: string) => void;
  onLogout: () => void;
  togglePrivacyMode: () => void;
  onUnlockEncryptedConversation: (kunci: string) => void;
  onCancelEncryptionAlert: () => void;
}

const EncryptionManager: React.FC<EncryptionManagerProps> = ({
  isAuthenticated,
  modePrivasi,
  showEncryptionAlert,
  onLogin,
  onLogout,
  togglePrivacyMode,
  onUnlockEncryptedConversation,
  onCancelEncryptionAlert
}) => {
  return (
    <>
      <div className="flex flex-wrap justify-between items-center mb-2">
        <div className="mb-2 sm:mb-0">
          <AuthManager 
            onLogin={onLogin}
            onLogout={onLogout}
            isAuthenticated={isAuthenticated}
          />
        </div>
        <div className="mb-2 sm:mb-0">
          <PrivacyModeToggle 
            isPrivacyMode={modePrivasi}
            togglePrivacyMode={togglePrivacyMode}
          />
        </div>
      </div>
      
      {showEncryptionAlert && (
        <EncryptionAlert
          onUnlock={onUnlockEncryptedConversation}
          onCancel={onCancelEncryptionAlert}
        />
      )}
    </>
  );
};

export default EncryptionManager;
