
import React, { useState } from 'react';
import { Clinic, Profile } from '../../../packages/database/types';
import { Header, Footer } from '../../../packages/ui/src';
import { LucideLayoutDashboard, LucideUsers, LucideCalendar, LucideSettings, LucideStethoscope, LucideLock } from 'lucide-react';

interface ClinicLayoutProps {
  user: Profile;
  clinic: Clinic;
  children: React.ReactNode;
  onNavigate?: (path: string) => void;
  currentPath?: string;
}

export const ClinicLayout: React.FC<ClinicLayoutProps> = ({ user, clinic, children, onNavigate, currentPath = 'dashboard' }) => {
  const isVerified = clinic.claim_status === 'verified';

  const navItems = [
    { id: 'dashboard', label: 'Front Desk', icon: LucideLayoutDashboard, requiredVerification: false },
    { id: 'calendar', label: 'Schedule', icon: LucideCalendar, requiredVerification: true },
    { id: 'patients', label: 'Patients', icon: LucideUsers, requiredVerification: true },
    { id: 'team', label: 'Clinical Team', icon: LucideStethoscope, requiredVerification: true },
    { id: 'settings', label: 'Settings', icon: LucideSettings, requiredVerification: false },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans flex flex-col selection:bg-emerald-500 selection:text-white">
      <Header 
        appName="CLINIC OS" 
        user={user} 
        onLogout={async () => {
           window.location.hash = 'auth'; 
           window.location.reload();
        }}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* SIDEBAR */}
        <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col hidden md:flex">
          <div className="p-6 border-b border-slate-800">
            <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Active Tenant</h2>
            <div className="font-bold text-white truncate text-lg">{clinic.name}</div>
            <div className={`text-xs mt-1 font-mono inline-flex items-center gap-1.5 ${isVerified ? 'text-emerald-500' : 'text-amber-500'}`}>
              <div className={`w-1.5 h-1.5 rounded-full ${isVerified ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
              {clinic.claim_status.toUpperCase().replace('_', ' ')}
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => {
              const isDisabled = item.requiredVerification && !isVerified;
              
              return (
                <button
                  key={item.id}
                  disabled={isDisabled}
                  onClick={() => {
                      if (!isDisabled && onNavigate) onNavigate(item.id);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isDisabled 
                      ? 'opacity-40 cursor-not-allowed text-slate-600'
                      : currentPath === item.id 
                        ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/20' 
                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon size={18} className={currentPath === item.id ? 'text-white' : 'text-slate-500'} />
                    {item.label}
                  </div>
                  {isDisabled && <LucideLock size={12} />}
                </button>
              );
            })}
          </nav>

          <div className="p-4 border-t border-slate-800">
            <div className="bg-slate-950 rounded-lg p-3 text-xs text-slate-500 border border-slate-800">
              <p className="font-bold text-slate-400 mb-1">System Health</p>
              <div className="flex items-center gap-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                 Operational
              </div>
            </div>
          </div>
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 overflow-auto relative bg-slate-950">
           {children}
        </main>
      </div>
      <Footer currentApp="web-clinic" tenantId={clinic.id} userRole={user.global_role} />
    </div>
  );
};
