
import React from 'react';
import { Header, Footer } from '../../../packages/ui/src';

interface PublicLayoutProps {
  children: React.ReactNode;
  onNavigate: (path: string) => void;
}

export const PublicLayout: React.FC<PublicLayoutProps> = ({ children, onNavigate }) => {
  return (
    <div 
      className="bg-slate-950 text-white font-sans flex flex-col h-screen overflow-hidden selection:bg-blue-500 selection:text-white"
      style={{ backgroundColor: '#020617', color: 'white' }}
    >
      {/* SHARED HEADER */}
      <Header 
        appName="Public Home" 
        onLoginClick={() => window.location.hash = 'auth'}
      />
      
      {/* SCROLLABLE CONTENT AREA */}
      <div className="flex-1 overflow-y-auto bg-slate-950 relative" style={{ backgroundColor: '#020617' }}>
        <main className="relative z-0 min-h-full flex flex-col">
           {children}
           <div className="mt-auto">
             <Footer currentApp="www" />
           </div>
        </main>
      </div>
    </div>
  );
};
