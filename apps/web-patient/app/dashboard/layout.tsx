
'use client';

import React from 'react';
import { LayoutDashboard, Users, Search, Settings, LogOut, Briefcase } from 'lucide-react';
import { Profile } from '../../../../packages/database/types';

interface DashboardLayoutProps {
  children: React.ReactNode;
  currentPath: string;
  onNavigate: (path: string) => void;
  user: Profile | null;
}

export const PatientDashboardLayout: React.FC<DashboardLayoutProps> = ({ children, currentPath, onNavigate, user }) => {
  // 1. Identify if user is a Professional
  const isPro = user?.global_role === 'pro_candidate' || user?.global_role === 'pro';

  // 2. THE FIX: Dynamic Dashboard Link Logic
  // If role is 'pro', go to /pro (External Hash Link). Otherwise /dashboard (Internal).
  const dashboardHref = isPro ? '#pro' : '/dashboard';

  const navItems = [
    { 
      name: 'Overview', 
      href: dashboardHref, 
      icon: <LayoutDashboard className="w-5 h-5" /> 
    },
    { name: 'My Family', href: '/family', icon: <Users className="w-5 h-5" /> },
    { name: 'Find Dentist', href: '/', icon: <Search className="w-5 h-5" /> },
    { name: 'Settings', href: '/settings', icon: <Settings className="w-5 h-5" /> },
  ];

  const handleNavClick = (href: string) => {
      // Handle External Links (Hash based for SPA simulation)
      if (href.startsWith('#')) {
          window.location.hash = href.replace('#', '');
      } else {
          // Handle Internal Navigation
          onNavigate(href);
      }
  };

  return (
    <div className="flex min-h-screen bg-slate-950 pt-16 font-sans text-slate-200 selection:bg-blue-500 selection:text-white"> 
      
      <aside className="w-64 bg-slate-900 border-r border-slate-800 hidden md:flex flex-col shrink-0 h-[calc(100vh-64px)] sticky top-16">
         <div className="p-6">
            <div className="mb-6 px-4 py-3 bg-slate-800/50 rounded-xl border border-slate-700/50">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  {isPro ? 'Pro Account' : 'Patient Portal'}
                </p>
                <p className="text-xs text-white font-bold mt-1">Welcome Back</p>
            </div>
            
            <nav className="space-y-2">
               {navItems.map(item => {
                 const isActive = currentPath === item.href;
                 // If user is Pro, don't highlight the dashboard link as it points elsewhere
                 const itemActive = !isPro && isActive;

                 return (
                   <button 
                     key={item.name} 
                     onClick={() => handleNavClick(item.href)}
                     className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                        itemActive 
                       ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
                       : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                     }`}
                   >
                     {item.icon}
                     {item.name}
                   </button>
                 );
               })}
            </nav>
            
            {/* Explicit Return Link for Pros who might have wandered here */}
            {isPro && (
                <div className="mt-6 pt-6 border-t border-slate-800">
                    <button 
                        onClick={() => window.location.hash = 'pro'}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold bg-violet-600/10 text-violet-400 border border-violet-500/20 hover:bg-violet-600 hover:text-white transition-all"
                    >
                        <Briefcase className="w-5 h-5" />
                        Return to Pro Hub
                    </button>
                </div>
            )}
         </div>

         <div className="mt-auto p-6 border-t border-slate-800">
            <button 
                onClick={() => window.location.hash = 'auth'}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-400 hover:bg-red-900/20 transition-colors"
            >
                <LogOut className="w-5 h-5" />
                Sign Out
            </button>
         </div>
      </aside>

      <main className="flex-1 p-6 md:p-10 overflow-y-auto bg-slate-950">
         <div className="max-w-5xl mx-auto">
            {children}
         </div>
      </main>

    </div>
  );
};
