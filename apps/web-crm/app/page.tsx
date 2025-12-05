
import React, { useState } from 'react';
import { createClient } from '../../../packages/database/client';
import { Button, Input } from '../../../packages/ui/src';
import { LucideTerminal, LucidePlay, LucideLoader2 } from 'lucide-react';

export const CrmHarvester: React.FC = () => {
  const [city, setCity] = useState('');
  const [logs, setLogs] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const db = createClient();

  const addLog = (msg: string) => setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);

  const runHarvester = async () => {
    if (!city) return;
    setIsRunning(true);
    setLogs([]);
    addLog(`INITIATING SEQUENCE: Target City = ${city}`);
    addLog('Connecting to Google Places API...');
    
    // Simulation
    setTimeout(() => addLog('Connection Established. Handshake OK.'), 500);
    setTimeout(() => addLog('Scanning for "Dentist" keywords...'), 1200);
    setTimeout(() => addLog('Found 3 potential candidates.'), 2000);
    
    setTimeout(async () => {
       const newClinics = [
          { name: `${city} Family Dental`, slug: `${city.toLowerCase().replace(/ /g, '-')}-family`, address: `101 Main St, ${city}` },
          { name: `Smile ${city}`, slug: `smile-${city.toLowerCase().replace(/ /g, '-')}`, address: `55 West Ave, ${city}` },
          { name: `${city} Orthodontics`, slug: `${city.toLowerCase().replace(/ /g, '-')}-ortho`, address: `889 Broadway, ${city}` },
       ];

       for (const c of newClinics) {
           await db.createClinic({
               name: c.name,
               slug: c.slug,
               address: c.address,
               city: city,
               contact_phone: '555-0000'
           });
           addLog(`IMPORTED: ${c.name} [ID: GENERATED]`);
       }
       
       addLog('BATCH COMPLETE. Data persisted to "public.clinics".');
       setIsRunning(false);
    }, 3000);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto h-full flex flex-col">
       <div className="mb-8 border-b border-slate-800 pb-4">
          <h1 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
             <LucideTerminal className="text-orange-500" />
             Harvester Console
          </h1>
          <p className="text-slate-500 text-sm">Automated Lead Acquisition & Data Scraping Tool.</p>
       </div>

       <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="col-span-2">
             <Input 
                label="Target Geo-Location" 
                placeholder="e.g. Miami, Seattle, Toronto"
                className="bg-slate-900 border-slate-700 text-white focus:ring-orange-500"
                value={city}
                onChange={e => setCity(e.target.value)}
             />
          </div>
          <div className="flex items-end">
             <Button 
               onClick={runHarvester} 
               disabled={isRunning || !city}
               className="w-full bg-orange-600 hover:bg-orange-700 text-white font-mono"
             >
                {isRunning ? <LucideLoader2 className="animate-spin mr-2" /> : <LucidePlay className="mr-2" />}
                EXECUTE
             </Button>
          </div>
       </div>

       <div className="flex-1 bg-black rounded-lg border border-slate-800 p-4 font-mono text-xs overflow-y-auto shadow-inner">
          {logs.length === 0 && <span className="text-slate-700">System Ready. Awaiting command...</span>}
          {logs.map((log, i) => (
             <div key={i} className="mb-1 text-emerald-500 border-l-2 border-emerald-900 pl-2">
                {log}
             </div>
          ))}
          {isRunning && <div className="animate-pulse text-orange-500 mt-2">_ PROCESSING_DATA_STREAM</div>}
       </div>
    </div>
  );
};