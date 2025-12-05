
import React from 'react';
import { Profile } from '../../../packages/database/types';
import { Header, Footer } from '../../../packages/ui/src';
import { LucideVideo, LucideUsers, LucideTarget, LucideMessageSquare } from 'lucide-react';

interface RecruitLayoutProps {
  user: Profile;
  children: React.ReactNode;
  onNavigate: (path: string) => void;
  currentPath: string;
}

export const RecruitLayout: React.FC<RecruitLayoutProps> = ({ user, children, onNavigate, currentPath }) => {
  const navItems = [
    { id: '/', label: 'Hiring Board', icon: LucideTarget },
    { id: '/interviews', label: 'Video Interviews', icon: LucideVideo },
    { id: '/candidates', label: 'Candidate Pool', icon: LucideUsers },
    { id: '/messages', label: 'Messages', icon: LucideMessageSquare },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans flex flex-col selection:bg-cyan-500 selection:text-white">
      <Header 
        appName="RECRUIT" 
        appColor="text-cyan-400" 
        user={user} 
        onLogout={() => window.location.reload()}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* SIDEBAR */}
        <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col hidden md:flex">
          <div className="p-6 border-b border-slate-800 bg-cyan-950/10">
             <div className="flex items-center gap-2 text-cyan-500 font-bold tracking-widest uppercase text-xs mb-1">
                <LucideVideo size={12} />
                TALENT ACQUISITION
             </div>
             <div className="font-bold text-white text-lg">Hiring Portal</div>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded text-sm font-medium transition-all ${
                  currentPath === item.id 
                    ? 'bg-cyan-600/20 text-cyan-400 border-l-2 border-cyan-500' 
                    : 'text-slate-400 hover:bg-slate-900 hover:text-white border-l-2 border-transparent'
                }`}
              >
                <item.icon size={18} />
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 overflow-auto relative bg-slate-950">
           {children}
        </main>
      </div>
      <Footer currentApp="web-recruit" userRole={user.global_role} />
    </div>
  );
};
