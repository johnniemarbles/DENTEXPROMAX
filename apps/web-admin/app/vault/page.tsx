
import React, { useState, useEffect } from 'react';
import { createClient } from '../../../../packages/database/client';
import { SystemSetting } from '../../../../packages/database/types';
import { LucideLock, LucideEye, LucideEyeOff, LucideServer, LucideGlobe, LucideSearch, LucideRefreshCw, LucideLoader2 } from 'lucide-react';

export const OperationalVaultPage: React.FC = () => {
  const db = createClient();
  const [settings, setSettings] = useState<SystemSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [revealed, setRevealed] = useState<Set<string>>(new Set());
  const [saving, setSaving] = useState<string | null>(null);

  // Fetch Keys
  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    setLoading(true);
    const data = await db.getSystemSettings();
    setSettings(data);
    setLoading(false);
  }

  async function handleUpdate(key: string, newValue: string) {
    setSaving(key);
    await db.updateSystemSetting(key, newValue);
    setSaving(null);
    // In a real app we might toast here
    console.log(`Updated ${key}`);
  }

  const toggleReveal = (key: string) => {
    const next = new Set(revealed);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    setRevealed(next);
  };

  return (
    <div className="space-y-8 p-8 max-w-6xl mx-auto min-h-screen text-slate-200">
      <div className="flex justify-between items-center pb-6 border-b border-slate-800">
         <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
               <LucideServer className="w-6 h-6 text-blue-500" />
               Operational Vault
            </h1>
            <p className="text-slate-400 text-sm">Manage verification, geo, and infrastructure keys.</p>
         </div>
         <button onClick={fetchSettings} className="bg-slate-900 border border-slate-800 p-2 rounded-lg hover:text-white transition-colors">
            <LucideRefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
         </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
         <div className="divide-y divide-slate-800">
            {settings.map((conf) => (
               <div key={conf.key} className="p-6 flex flex-col md:flex-row gap-6 hover:bg-slate-800/30 transition-colors">
                  <div className="flex-1">
                     <div className="flex items-center gap-2 mb-1">
                        {conf.key.includes('GOOGLE') && <LucideGlobe className="w-4 h-4 text-emerald-400" />}
                        {conf.key.includes('REOON') && <LucideSearch className="w-4 h-4 text-purple-400" />}
                        {conf.key.includes('SUPABASE') && <LucideServer className="w-4 h-4 text-green-400" />}
                        <h4 className="font-mono text-sm font-bold text-slate-300">{conf.key}</h4>
                     </div>
                     <p className="text-xs text-slate-500">{conf.description}</p>
                  </div>
                  
                  <div className="flex-1 relative">
                     <input 
                        type={revealed.has(conf.key) ? 'text' : 'password'}
                        defaultValue={conf.value}
                        onBlur={(e) => handleUpdate(conf.key, e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 pl-3 pr-10 text-sm font-mono text-blue-400 focus:border-blue-500 focus:outline-none"
                     />
                     <button 
                        onClick={() => toggleReveal(conf.key)}
                        className="absolute right-3 top-2.5 text-slate-500 hover:text-white"
                     >
                        {revealed.has(conf.key) ? <LucideEyeOff className="w-4 h-4" /> : <LucideEye className="w-4 h-4" />}
                     </button>
                  </div>

                  <div className="flex items-center w-24 justify-end">
                     {saving === conf.key ? (
                        <LucideLoader2 className="w-4 h-4 animate-spin text-blue-500" />
                     ) : (
                        <span className="text-[10px] text-slate-600 font-mono">AUTOSAVE</span>
                     )}
                  </div>
               </div>
            ))}
         </div>
      </div>
    </div>
  );
}
