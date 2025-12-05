
import React, { useEffect, useState } from 'react';
import { createClient } from '../../../../packages/database/client';
import { Clinic } from '../../../../packages/database/types';
import { Button } from '../../../../packages/ui/src';
import { LucideCheck, LucideTrash2, LucideSearch } from 'lucide-react';

export const CrmLeads: React.FC = () => {
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [filter, setFilter] = useState('');
  const db = createClient();

  const refresh = () => db.getClinics('all').then(res => setClinics(res.filter(c => c.claim_status === 'unclaimed')));

  useEffect(() => {
    refresh();
  }, []);

  const handleVerify = async (id: string) => {
     await db.updateClinicStatus(id, 'verified');
     refresh();
  };

  const handleDelete = async (id: string) => {
     await db.deleteClinic(id);
     refresh();
  };

  const filtered = clinics.filter(c => c.name.toLowerCase().includes(filter.toLowerCase()));

  return (
    <div className="p-8 max-w-6xl mx-auto">
       <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">Unclaimed Lead Database</h1>
          <div className="relative">
             <LucideSearch className="absolute left-3 top-2.5 text-slate-500" size={16} />
             <input 
               className="bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-orange-500"
               placeholder="Filter leads..."
               value={filter}
               onChange={e => setFilter(e.target.value)}
             />
          </div>
       </div>

       <div className="border border-slate-800 rounded-lg overflow-hidden bg-slate-900/50">
          <table className="w-full text-left text-sm text-slate-400">
             <thead className="bg-slate-900 text-slate-500 font-bold border-b border-slate-800">
                <tr>
                   <th className="px-4 py-3">Clinic Name</th>
                   <th className="px-4 py-3">City</th>
                   <th className="px-4 py-3">Source</th>
                   <th className="px-4 py-3 text-right">Actions</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-slate-800">
                {filtered.map(clinic => (
                   <tr key={clinic.id} className="hover:bg-slate-800/50 transition-colors">
                      <td className="px-4 py-3 text-white font-medium">{clinic.name}</td>
                      <td className="px-4 py-3">{clinic.city}</td>
                      <td className="px-4 py-3">
                         <span className="text-[10px] bg-slate-800 px-2 py-1 rounded text-slate-500 uppercase">Automated</span>
                      </td>
                      <td className="px-4 py-3 text-right space-x-2">
                         <button 
                           onClick={() => handleVerify(clinic.id)}
                           className="text-emerald-500 hover:text-emerald-400 p-1 hover:bg-emerald-900/30 rounded" 
                           title="Verify & Onboard"
                         >
                            <LucideCheck size={16} />
                         </button>
                         <button 
                           onClick={() => handleDelete(clinic.id)}
                           className="text-red-500 hover:text-red-400 p-1 hover:bg-red-900/30 rounded" 
                           title="Delete Lead"
                         >
                            <LucideTrash2 size={16} />
                         </button>
                      </td>
                   </tr>
                ))}
                {filtered.length === 0 && (
                   <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-slate-600">No unclaimed leads found. Run the Harvester.</td>
                   </tr>
                )}
             </tbody>
          </table>
       </div>
    </div>
  );
};
