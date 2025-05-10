import React from 'react';

interface ContextWindowIndicatorProps {
  jumlahPesan: number;
  maksimalPesan: number;
}

const ContextWindowIndicator: React.FC<ContextWindowIndicatorProps> = ({ jumlahPesan, maksimalPesan }) => {
  const persentase = (jumlahPesan / maksimalPesan) * 100;
  
  let warna = 'bg-green-500';
  if (persentase > 75) {
    warna = 'bg-red-500';
  } else if (persentase > 50) {
    warna = 'bg-yellow-500';
  }

  return (
    <div className="flex items-center gap-2">
      <div className="text-xs text-foreground/50 whitespace-nowrap">
        Context: {jumlahPesan}/{maksimalPesan}
      </div>
      <div className="w-16 h-1.5 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
        <div 
          className={`h-full ${warna} transition-all duration-300 ease-in-out`}
          style={{ width: `${persentase}%` }}
        />
      </div>
    </div>
  );
};

export default ContextWindowIndicator;
