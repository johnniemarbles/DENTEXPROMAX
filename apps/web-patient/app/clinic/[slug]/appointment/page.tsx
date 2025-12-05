
'use client';

import React, { useEffect, useState } from 'react';
import { LucideCalendar, LucideLoader2, LucideArrowLeft, LucideCheckCircle } from 'lucide-react';
import { Button } from '../../../../../../packages/ui/src';

// Helper for parsing Hash Params in Simulation
const useHashSearchParams = () => {
    const [params, setParams] = useState<URLSearchParams>(new URLSearchParams());
    useEffect(() => {
        // Expected format: #patient/clinic/slug/appointment?reason=xyz
        const hash = window.location.hash;
        if (hash.includes('?')) {
            setParams(new URLSearchParams(hash.split('?')[1]));
        }
    }, []);
    return params;
};

interface AppointmentPageProps {
  slug: string;
  onNavigate: (path: string) => void;
}

export const AppointmentPage: React.FC<AppointmentPageProps> = ({ slug, onNavigate }) => {
  const searchParams = useHashSearchParams();
  const reason = searchParams.get('reason') || searchParams.get('serviceId');
  const [loading, setLoading] = useState(true);

  // --- THE GATEKEEPER ---
  useEffect(() => {
    // Small delay to ensure params are mounted
    const checkContext = setTimeout(() => {
        if (!reason) {
          console.warn("[Gatekeeper] No reason selected. Bouncing user back to Service Selection.");
          onNavigate(`/clinic/${slug}`);
        } else {
          setLoading(false);
        }
    }, 500); 
    
    return () => clearTimeout(checkContext);
  }, [reason, slug, onNavigate]);

  if (loading) {
      return (
          <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white">
              <LucideLoader2 className="animate-spin mb-4 w-8 h-8 text-blue-500" />
              <p className="font-mono text-sm text-slate-400">VALIDATING SERVICE CONTEXT...</p>
          </div>
      );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 md:p-12">
       <div className="max-w-4xl mx-auto">
           <button onClick={() => onNavigate(`/clinic/${slug}`)} className="mb-8 text-slate-400 hover:text-white flex items-center gap-2 transition-colors">
               <LucideArrowLeft size={16} /> Back to Services
           </button>
           
           <div className="flex items-center gap-3 mb-2">
               <div className="bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2 border border-emerald-500/20">
                   <LucideCheckCircle size={12} /> Service Selected
               </div>
           </div>

           <h1 className="text-3xl font-bold mb-2">Select a Time</h1>
           <p className="text-slate-400 mb-8">
               Showing availability for: <span className="text-white font-bold text-lg border-b border-blue-500">{reason}</span>
           </p>
           
           <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center shadow-2xl">
               <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                   <LucideCalendar className="w-8 h-8 text-blue-500" />
               </div>
               <h3 className="text-xl font-bold mb-3 text-white">Calendar Module</h3>
               <p className="text-slate-500 max-w-md mx-auto mb-8 leading-relaxed">
                   (In a full implementation, the Standalone Calendar Grid would render here. 
                   For this demo, please use the main widget on the profile page.)
               </p>
               <Button 
                    className="bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-900/20"
                    onClick={() => onNavigate(`/clinic/${slug}?openBooking=true`)}
               >
                   Open Full Booking Widget
               </Button>
           </div>
       </div>
    </div>
  )
}
