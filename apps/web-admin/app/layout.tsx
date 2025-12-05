
import React from 'react';
import { Profile } from '../../../packages/database/types';
import { Header, Footer } from '../../../packages/ui/src';
import { LucideShield, LucideUsers, LucideCircleDollarSign, LucideActivity, LucideServer } from 'lucide-react';

interface AdminLayoutProps {
  user: Profile;
  children: React.ReactNode;
  onNavigate: (path: string) => void;
  currentPath: string;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ user, children, onNavigate, currentPath }) => {
  const navItems = [
    { id: '/', label: 'Overview', icon: LucideActivity },
    { id: '/users', label: 'User Manager', icon: LucideUsers },
    { id: '/finance', label: 'Finance Vault', icon: LucideCircleDollarSign },
    { id: '/vault', label: 'Ops Vault', icon: LucideServer },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans flex flex-col selection:bg-red-500 selection:text-white">
      <Header 
        appName="ADMIN" 
        appColor="text-red-600" 
        user={user} 
        onLogout={() => window.location.reload()}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* SIDEBAR */}
        <aside className="w-64 bg-slate-925 border-r border-slate-800 flex flex-col">
          <div className="p-6 border-b border-slate-800 bg-red-950/10">
             <div className="flex items-center gap-2 text-red-500 font-black tracking-widest uppercase text-xs mb-1">
                <LucideShield size={12} />
                GOD MODE ACTIVE
             </div>
             <div className="font-bold text-white text-lg">Mission Control</div>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded text-sm font-medium transition-all ${
                  currentPath === item.id 
                    ? 'bg-red-600 text-white shadow-lg shadow-red-900/50' 
                    : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                }`}
              >
                <item.icon size={18} />
                {item.label}
              </button>
            ))}
          </nav>
          
          <div className="p-4 mt-auto border-t border-slate-800">
             <div className="text-[10px] text-red-900 font-mono bg-red-950/30 p-2 rounded border border-red-900/20">
                WARNING: ACTIONS ARE IRREVERSIBLE AND AUDITED.
             </div>
          </div>
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 overflow-auto relative bg-slate-950">
           {children}
        </main>
      </div>
      <Footer currentApp="web-admin" userRole={user.global_role} />
    </div>
  );
};
