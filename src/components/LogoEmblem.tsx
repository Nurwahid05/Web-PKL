import React from 'react';

interface LogoEmblemProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const LogoEmblem: React.FC<LogoEmblemProps> = ({ className = '', size = 'md' }) => {
  const dimensions = size === 'sm' ? 'w-8 h-8 text-xs' : size === 'lg' ? 'w-14 h-14 text-base' : 'w-10 h-10 text-sm';

  return (
    <div className={`flex items-center justify-center rounded-lg bg-emerald-600 text-white font-bold tracking-tight shadow-sm shrink-0 select-none ${dimensions} ${className}`}>
      SI
    </div>
  );
};
