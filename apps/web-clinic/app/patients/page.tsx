
'use client';

import React from 'react';
import { LucideUsers, LucideSearch } from 'lucide-react';

export const PatientsPage: React.FC = () => {
  return (
    <div className="p-8 max-w-7xl mx-auto text-white">
       <div className="flex justify-between items-end mb-8">
          <div>
             <h1 className="text-3xl font-bold flex items-center gap-3">
                <LucideUsers className="text-blue-500" /> Patient Database
             </h1>
             <p className="text-slate-400 mt-2">Manage records, history, and family connections.</p>
          </div>
          <div className="relative">
             <LucideSearch className="absolute left-3 top-2.5 text-slate-500" size={16} />
             <input 
               placeholder="Search patients..." 
               className="bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
             />
          </div>
       </div>

       <div className="border border-slate-800 rounded-2xl p-12 text-center bg-slate-900/50 border-dashed">
          <p className="text-slate-500 font-bold mb-2">Directory Empty</p>
          <p className="text-sm text-slate-600">Syncing with Practice Management System...</p>
       </div>
    </div>
  );
};
