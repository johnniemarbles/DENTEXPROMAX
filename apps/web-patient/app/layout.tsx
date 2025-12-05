
import React from 'react';
import { Profile } from '../../../packages/database/types';
import { Header, Footer } from '../../../packages/ui/src';

interface PatientLayoutProps {
  user: Profile | null;
  children: React.ReactNode;
}

export const PatientLayout: React.FC<PatientLayoutProps> = ({ user, children }) => {
  return (
    // HARDENED APP SHELL: Force background color via inline style to prevent white flash
    <div 
      className="bg-slate-950 text-white font-sans flex flex-col h-screen overflow-hidden selection:bg-blue-500 selection:text-white"
      style={{ backgroundColor: '#020617', color: '#ffffff', minHeight: '100vh' }}
    >
      <Header 
        appName="Patient Portal" 
        user={user} 
        onLoginClick={() => window.location.hash = 'auth'} 
      />
      
      {/* SCROLLABLE CONTENT AREA */}
      <div 
        className="flex-1 overflow-y-auto bg-slate-950 relative" 
        style={{ backgroundColor: '#020617' }}
      >
        <main className="relative z-0 min-h-full flex flex-col">
          <div className="flex-1 w-full flex flex-col">
            {children}
          </div>
          <Footer currentApp="web-patient" userRole={user?.global_role} />
        </main>
      </div>
    </div>
  );
};
