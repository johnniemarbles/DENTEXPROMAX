
'use client';

import React, { useEffect, useState } from 'react';
import { APP_VERSION } from './version';
import { Shield, MapPin, Activity } from 'lucide-react';

const getStatusColor = (version: string): string => {
  if (!version) return "text-slate-500";
  const numericPart = version.match(/v?(\d+\.\d+\.\d+)/)?.[1] || "0.0.0";
  const sum = numericPart.split('.').reduce((acc, val) => acc + parseInt(val), 0);
  
  if (sum % 3 === 0) return "text-blue-400"; 
  if (sum % 3 === 1) return "text-green-400";
  return "text-red-400";
};

interface FooterProps {
  currentApp?: string;
  userRole?: string;
  tenantId?: string;
  clinicId?: string;
}

export const Footer = ({ currentApp, userRole, tenantId, clinicId }: FooterProps) => {
  const [color, setColor] = useState(getStatusColor(APP_VERSION));
  
  useEffect(() => {
     setColor(getStatusColor(APP_VERSION));
  }, []);

  const popularCities = ['Toronto, ON', 'Vancouver, BC', 'Montreal, QC', 'Calgary, AB', 'Ottawa, ON', 'Edmonton, AB', 'Mississauga, ON', 'Winnipeg, MB'];

  return (
    <footer className="w-full bg-slate-950 border-t border-slate-900 mt-auto flex-shrink-0">
      <div className="container mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 text-sm">
        <div className="space-y-4">
           <div className="flex items-center gap-2 mb-4">
             <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
             </div>
             <h3 className="text-xl font-bold text-white tracking-tight">DENTEX</h3>
           </div>
           <p className="text-slate-400 leading-relaxed">
             The leading unified platform for dental staffing, patient booking, and practice management.
           </p>
        </div>
        <div>
          <h4 className="font-bold text-white uppercase tracking-wider mb-6">Popular Locations</h4>
          <ul className="grid grid-cols-1 gap-3">
             {popularCities.map(city => (
               <li key={city}>
                 <a href="#" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group">
                    <MapPin className="w-3 h-3 text-slate-600 group-hover:text-teal-400 transition-colors" />
                    {city}
                 </a>
               </li>
             ))}
          </ul>
        </div>
        <div>
             <h4 className="font-bold text-white uppercase tracking-wider mb-6">Legal</h4>
             <ul className="space-y-3">
                <li><a href="#" className="text-slate-400 hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white">Terms of Service</a></li>
             </ul>
        </div>
      </div>

      {/* RESTORED: Version & Status Bar */}
      <div className="border-t border-slate-900 bg-black/20">
        <div className="container mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500 font-mono gap-4">
          <div>DENTEX © 2024. All rights reserved.</div>
          
          <div className="flex items-center gap-4">
            {/* System Heartbeat */}
            <div className="flex items-center gap-2">
                <Activity className="w-3 h-3 text-slate-600" />
                <span>STATUS:</span>
                <span className={`font-bold ${color} animate-pulse`}>ONLINE</span>
            </div>

            {/* App Context Info (Non-Interactive) */}
            <div className="flex items-center gap-2 border-l border-slate-800 pl-4">
                <span className="text-slate-400">v{APP_VERSION}</span>
                {currentApp && <span className="text-slate-600 px-2">|</span>}
                {currentApp && <span className="uppercase tracking-widest opacity-50">{currentApp}</span>}
                {userRole && <span className="hidden md:inline text-slate-700 ml-2">[{userRole}]</span>}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
