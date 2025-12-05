
'use client';

import React from 'react';
import { LogOut, Shield, Stethoscope, LayoutDashboard, ChevronDown, Briefcase, User } from 'lucide-react';

// DOMAIN MAP (Adapted for SPA Hash Routing to work in single-port simulation)
const DOMAINS = {
    public: '#',
    patient: '#patient',
    clinic: '#clinic',
    admin: '#admin',
    auth: '#auth',
    pro: '#pro',
    vendor: '#vendor',
    crm: '#crm',
    recruit: '#recruit'
};

const APP_ROUTES = [
    { name: 'Patient Portal', href: DOMAINS.patient },
    { name: 'Clinic OS', href: DOMAINS.clinic },
    { name: 'Recruitment', href: DOMAINS.recruit },
    { name: 'Pro Talent', href: DOMAINS.pro },
    { name: 'Vendor Market', href: DOMAINS.vendor },
    { name: 'Admin', href: DOMAINS.admin },
    { name: 'Public Home', href: DOMAINS.public },
];

interface HeaderProps {
  appName?: string;
  appColor?: string;
  user?: any;
  onLogout?: () => void;
  onLoginClick?: () => void;
}

export const Header = ({ appName = 'DENTEX', appColor, user, onLogout }: HeaderProps) => {
  
  const getIcon = () => {
      if (appName?.includes('Clinic')) return <Stethoscope className="w-5 h-5 text-emerald-400" />;
      if (appName?.includes('Admin')) return <Shield className="w-5 h-5 text-red-400" />;
      if (appName?.includes('Recruit')) return <Briefcase className="w-5 h-5 text-orange-400" />;
      return <LayoutDashboard className="w-5 h-5 text-blue-400" />;
  };

  const handleAppSwitch = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const url = e.target.value;
      // SPA Adaptation: Assign hash
      if (url) window.location.hash = url.replace('#', '');
  };

  // LOGIC: Determine the correct Home URL (Hash Based)
  // This supports the requirement for dynamic Dashboard/Profile links based on role
  const getHomeUrl = () => {
      if (!user) return DOMAINS.auth;
      
      // Fallback to 'patient' if role is missing
      const role = user.global_role || user.role || user.user_metadata?.role || 'patient';
      
      switch (role) {
          case 'admin': return DOMAINS.admin;
          case 'owner':
          case 'dentist': return DOMAINS.clinic;
          case 'pro': 
          case 'pro_candidate': return DOMAINS.pro;
          case 'vendor': return DOMAINS.vendor;
          default: return `${DOMAINS.patient}/dashboard`;
      }
  };

  const displayRole = user?.global_role || user?.role || 'Account';

  return (
    <header 
      className="h-16 border-b border-slate-800 bg-slate-950 flex items-center justify-between px-6 sticky top-0 z-40"
      style={{ backgroundColor: '#020617', borderColor: '#1e293b' }} 
    >
      
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-slate-900 rounded-lg border border-slate-800 flex items-center justify-center">
                {getIcon()}
            </div>
            <div className="hidden md:block">
                <h1 className="text-sm font-bold text-white tracking-tight">DENTEX PRO</h1>
                <p className={`text-[10px] uppercase tracking-wider ${appColor || 'text-slate-500'}`}>{appName}</p>
            </div>
        </div>
        
        <div className="relative">
            <select
                onChange={handleAppSwitch}
                defaultValue=""
                className="appearance-none bg-slate-800 border border-slate-700 text-xs md:text-sm font-medium text-white pl-3 pr-8 py-1.5 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors cursor-pointer hover:bg-slate-700"
            >
                <option value="" disabled>Switch App</option>
                {APP_ROUTES.map((app) => (
                    <option key={app.name} value={app.href}>{app.name}</option>
                ))}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2 top-2.5 pointer-events-none" />
        </div>
      </div>

      <div className="flex items-center gap-4">
        {user ? (
            <div className="flex items-center gap-4">
                {/* PROFILE LINK: Adapted to Hash Router using dynamic getHomeUrl */}
                <a href={getHomeUrl()} className="flex items-center gap-3 group cursor-pointer">
                    <div className="hidden md:block text-right">
                        <p className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors">{user.email}</p>
                        <p className="text-[10px] text-slate-500 capitalize">{displayRole}</p>
                    </div>
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-xs font-bold text-white border-2 border-slate-900 ring-2 ring-slate-800 group-hover:ring-blue-500 transition-all">
                        {user.email?.[0]?.toUpperCase() || 'U'}
                    </div>
                </a>

                {onLogout && (
                    <button onClick={onLogout} className="p-2 text-slate-500 hover:text-red-400 transition-colors border border-slate-800 rounded-lg hover:bg-slate-900" title="Sign Out">
                        <LogOut className="w-4 h-4" />
                    </button>
                )}
            </div>
        ) : (
            <button onClick={() => window.location.hash = 'auth'} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition-colors shadow-lg shadow-blue-900/20">
                Sign In
            </button>
        )}
      </div>
    </header>
  );
};
