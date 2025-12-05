
'use client';

import React from 'react';
import { User, Stethoscope, Shield, RefreshCw, X } from 'lucide-react';

export const DebugSessionBar = () => {
  // Only show in development (or if you want it always visible for now)
  // if (process.env.NODE_ENV === 'production') return null;

  const setGhostRole = (role: 'patient' | 'clinic' | 'admin' | 'clear') => {
    if (role === 'clear') {
        document.cookie = "dentex_ghost_role=; path=/; max-age=0";
        window.location.reload();
        return;
    }

    // Set cookie for all subdomains
    document.cookie = `dentex_ghost_role=${role}; path=/; max-age=3600`;
    
    // Redirect using Hash Routing for the Monorepo Simulation
    if (role === 'patient') window.location.hash = 'patient';
    if (role === 'clinic') window.location.hash = 'clinic';
    if (role === 'admin') window.location.hash = 'admin';
    
    window.location.reload(); // Force reload to re-read cookies/auth state if implemented
  };

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[9999] bg-slate-900/90 backdrop-blur-md border border-slate-700 p-2 rounded-full shadow-2xl flex items-center gap-2 animate-in slide-in-from-bottom-4">
       <div className="px-3 py-1 border-r border-slate-700 text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
         <Shield className="w-3 h-3" /> God Mode
       </div>
       
       <button onClick={() => setGhostRole('patient')} className="px-3 py-1.5 hover:bg-blue-500/20 hover:text-blue-400 text-slate-400 text-xs font-bold rounded-lg transition-colors flex items-center gap-2">
         <User className="w-3 h-3" /> Patient
       </button>
       
       <button onClick={() => setGhostRole('clinic')} className="px-3 py-1.5 hover:bg-emerald-500/20 hover:text-emerald-400 text-slate-400 text-xs font-bold rounded-lg transition-colors flex items-center gap-2">
         <Stethoscope className="w-3 h-3" /> Clinic
       </button>

       <button onClick={() => setGhostRole('admin')} className="px-3 py-1.5 hover:bg-red-500/20 hover:text-red-400 text-slate-400 text-xs font-bold rounded-lg transition-colors flex items-center gap-2">
         <Shield className="w-3 h-3" /> Admin
       </button>

       <div className="w-px h-4 bg-slate-700 mx-1"></div>

       <button onClick={() => setGhostRole('clear')} className="p-1.5 hover:bg-slate-800 text-slate-500 hover:text-white rounded-full transition-colors" title="Clear Ghost Session">
         <X className="w-3 h-3" />
       </button>
    </div>
  );
};
