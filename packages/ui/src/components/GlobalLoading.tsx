
import React from 'react';
import { LucideLoader2 } from 'lucide-react';

export const GlobalLoading: React.FC = () => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-50/50">
      <LucideLoader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
      <div className="text-sm font-medium text-slate-400 animate-pulse">
        SYNCHRONIZING DATA...
      </div>
    </div>
  );
};
