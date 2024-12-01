import React from 'react';

interface ControlRowProps {
  label: string;
  children: React.ReactNode;
}

export const ControlRow: React.FC<ControlRowProps> = ({ label, children }) => (
  <div className="flex items-center gap-4">
    <div className="text-xs text-muted-foreground truncate w-16.5 flex-shrink-0">{label}</div>
    <div className="w-full">
      {children}
    </div>
  </div>
); 