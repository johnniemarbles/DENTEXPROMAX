
import React from 'react';
import { Profile } from '../../../packages/database/types';
import { Header, Footer } from '../../../packages/ui/src';
import { LucideDatabase, LucideGlobe, LucideSettings, LucideTerminal } from 'lucide-react';

interface CrmLayoutProps {
  user: Profile;
  children: React.ReactNode;
  onNavigate: (path: string) => void;
  currentPath: string;
}

export const CrmLayout: React.FC<CrmLayoutProps> = ({ user, children, onNavigate, currentPath }) => {
  const navItems = [
    { id: '/', label: 'Harvester Console', icon: LucideTerminal },
    { id: '/leads', label: 'Lead Database', icon: LucideDatabase },
    { id: '/outreach', label: 'Outreach', icon: LucideGlobe },
    { id: '/settings', label: 'System Config', icon: LucideSettings },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-mono flex flex-col selection:bg-orange-500 selection:text-white">
      <Header 
        appName="GROWTH CRM" 
        user={user} 
        onLogout={() => window.location.reload()}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* SIDEBAR */}
        <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col hidden md:flex">
          <div className="p-6 border-b border-slate-800">
             <div className="text-xs text-orange-500 font-bold tracking-widest uppercase mb-1">INTERNAL OPS</div>
             <div className="font-bold text-white text-lg">Growth Engine</div>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded text-xs font-bold uppercase tracking-wide transition-all ${
                  currentPath === item.id 
                    ? 'bg-orange-500/10 text-orange-400 border-l-2 border-orange-500' 
                    : 'text-slate-500 hover:bg-slate-900 hover:text-slate-300 border-l-2 border-transparent'
                }`}
              >
                <item.icon size={16} />
                {item.label}
              </button>
            ))}
          </nav>
          
          <div className="p-4 mt-auto border-t border-slate-800">
             <div className="text-[10px] text-slate-600">
                SECURE CONNECTION<br/>
                IP: 192.168.0.X
             </div>
          </div>
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 overflow-auto relative bg-slate-950">
           {children}
        </main>
      </div>
      <Footer currentApp="web-crm" userRole={user.global_role} />
    </div>
  );
};
