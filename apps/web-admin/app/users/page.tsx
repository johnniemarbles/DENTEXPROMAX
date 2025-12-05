
import React, { useEffect, useState } from 'react';
import { createClient } from '../../../../packages/database/client';
import { Profile } from '../../../../packages/database/types';
import { LucideBan, LucideGhost, LucideSearch, LucideCheckCircle } from 'lucide-react';

export const UserManager: React.FC = () => {
  const [users, setUsers] = useState<Profile[]>([]);
  const [search, setSearch] = useState('');
  const db = createClient();

  useEffect(() => {
    db.getAllProfiles().then(setUsers);
  }, []);

  const handleBan = async (id: string) => {
     if(confirm('Are you sure you want to ban this user?')) {
        await db.banUser(id);
        alert('User has been banned.');
     }
  };

  const filtered = users.filter(u => 
     u.email.toLowerCase().includes(search.toLowerCase()) || 
     u.full_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 max-w-6xl mx-auto">
       <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">User Registry</h1>
            <p className="text-slate-500">Global Identity Management ({users.length} Records)</p>
          </div>
          <div className="relative">
             <LucideSearch className="absolute left-3 top-2.5 text-slate-500" size={16} />
             <input 
               className="bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-red-500 w-64"
               placeholder="Search by email or name..."
               value={search}
               onChange={e => setSearch(e.target.value)}
             />
          </div>
       </div>

       <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
          <table className="w-full text-left text-sm text-slate-400">
             <thead className="bg-slate-950 text-slate-500 font-bold uppercase text-xs border-b border-slate-800">
                <tr>
                   <th className="px-6 py-4">User Identity</th>
                   <th className="px-6 py-4">Role Context</th>
                   <th className="px-6 py-4">Created At</th>
                   <th className="px-6 py-4 text-right">Admin Controls</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-slate-800">
                {filtered.map(user => (
                   <tr key={user.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4">
                         <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-800 overflow-hidden">
                               <img src={user.avatar_url} alt="" className="w-full h-full" />
                            </div>
                            <div>
                               <div className="font-bold text-slate-200">{user.full_name}</div>
                               <div className="text-xs text-slate-500">{user.email}</div>
                            </div>
                         </div>
                      </td>
                      <td className="px-6 py-4">
                         <span className={`px-2 py-1 rounded text-xs font-bold uppercase
                            ${user.global_role === 'admin' ? 'bg-red-500/20 text-red-500' : ''}
                            ${user.global_role === 'clinic_user' ? 'bg-emerald-500/20 text-emerald-500' : ''}
                            ${user.global_role === 'patient' ? 'bg-blue-500/20 text-blue-500' : ''}
                            ${user.global_role === 'vendor_user' ? 'bg-orange-500/20 text-orange-500' : ''}
                         `}>
                            {user.global_role}
                         </span>
                      </td>
                      <td className="px-6 py-4 font-mono text-xs">
                         {new Date(user.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                         <div className="flex justify-end gap-2">
                            <button className="p-2 hover:bg-slate-800 rounded text-slate-500 hover:text-white" title="Impersonate (Ghost Mode)">
                               <LucideGhost size={16} />
                            </button>
                            <button 
                               onClick={() => handleBan(user.id)}
                               className="p-2 hover:bg-red-900/30 rounded text-slate-500 hover:text-red-500" 
                               title="Ban User"
                            >
                               <LucideBan size={16} />
                            </button>
                         </div>
                      </td>
                   </tr>
                ))}
             </tbody>
          </table>
       </div>
    </div>
  );
};
