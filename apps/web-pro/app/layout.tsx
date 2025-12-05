
import React from 'react';
import { Profile } from '../../../packages/database/types';
import { Header, Footer } from '../../../packages/ui/src';
import { LucideLayoutDashboard, LucideBriefcase, LucideUserCheck, LucideShieldCheck } from 'lucide-react';

interface ProLayoutProps {
  user: Profile | null;
  children: React.ReactNode;
  onNavigate: (path: string) => void;
  currentPath: string;
}

export const ProLayout: React.FC<ProLayoutProps> = ({ user, children, onNavigate, currentPath }) => {
  const navItems = [
    { id: '/', label: 'My Dashboard', icon: LucideLayoutDashboard },
    { id: '/passport', label: 'Digital Passport', icon: LucideUserCheck },
    { id: '/jobs', label: 'Job Board', icon: LucideBriefcase },
  ];

  if (!user) {
    return (
        <div className="h-screen bg-slate-950 flex flex-col items-center justify-center text-white">
            <h1 className="text-2xl font-bold">Pro Portal Access Denied</h1>
            <button onClick={() => window.location.hash = 'auth'} className="text-violet-500 mt-4 underline">Please Sign In</button>
        </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans flex flex-col selection:bg-violet-500 selection:text-white">
      <Header 
        appName="PRO PORTAL" 
        user={user} 
        onLogout={() => window.location.reload()}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* SIDEBAR */}
        <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col hidden md:flex">
          <div className="p-6 border-b border-slate-800">
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-violet-500/10 flex items-center justify-center text-violet-400 font-bold border border-violet-500/20">
                    {user.full_name.charAt(0)}
                </div>
                <div className="overflow-hidden">
                    <div className="font-bold text-white truncate text-sm">{user.full_name}</div>
                    <div className="text-xs text-slate-500">Talent ID: {user.id.split('-')[1]}</div>
                </div>
             </div>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  currentPath === item.id 
                    ? 'bg-violet-600 text-white shadow-lg shadow-violet-900/20' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <item.icon size={18} className={currentPath === item.id ? 'text-white' : 'text-slate-500'} />
                {item.label}
              </button>
            ))}
          </nav>
          
          <div className="p-4 mt-auto">
             <div className="bg-gradient-to-br from-violet-900/50 to-indigo-900/50 border border-violet-500/20 rounded-xl p-4 text-white shadow-lg">
                <div className="flex items-center gap-2 mb-2">
                    <LucideShieldCheck size={16} className="text-violet-400" />
                    <span className="font-bold text-xs uppercase tracking-wider text-violet-200">Verification</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                   Complete your Digital Passport to unlock higher paying shifts.
                </p>
             </div>
          </div>
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 overflow-auto relative bg-slate-950">
           {children}
        </main>
      </div>
      <Footer currentApp="web-pro" userRole={user.global_role} />
    </div>
  );
};
