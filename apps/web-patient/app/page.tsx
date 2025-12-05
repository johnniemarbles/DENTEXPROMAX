
import React, { useState } from 'react';
import { ClinicCard, SearchBar } from '../../../packages/ui/src';
import { LucideLoader2, LucideShieldCheck } from 'lucide-react';
import { Clinic, Profile } from '../../../packages/database/types';

// 1. INSTANT MOCK DATA (No Database Lag)
const MOCK_CLINICS: any[] = [
  { 
    id: '1', 
    name: 'Yorkville Smile Centre', 
    address: '123 Yorkville Ave', 
    city: 'Toronto',
    slug: 'yorkville-smile', 
    claim_status: 'verified',
    is_front_runner: true,
    created_at: new Date().toISOString()
  },
  { 
    id: '2', 
    name: 'Downtown Dental', 
    address: '55 Spadina Ave', 
    city: 'Toronto',
    slug: 'downtown-dental', 
    claim_status: 'verified',
    is_front_runner: false,
    created_at: new Date().toISOString()
  },
  { 
    id: '3', 
    name: 'Lakeshore Orthodontics', 
    address: '2200 Lake Shore Blvd', 
    city: 'Etobicoke',
    slug: 'lakeshore-ortho', 
    claim_status: 'verified',
    is_front_runner: true,
    created_at: new Date().toISOString()
  },
];

interface PatientDirectoryProps {
  user: Profile | null;
  onNavigate: (path: string, params?: any) => void;
}

export const PatientDirectory: React.FC<PatientDirectoryProps> = ({ user, onNavigate }) => {
  // 2. Initialize with data immediately (No loading state)
  const [clinics, setClinics] = useState<Clinic[]>(MOCK_CLINICS);
  const [loading, setLoading] = useState(false); 

  // Simplified Search (Client-side only for visual testing)
  const handleSearch = (location: string, keyword: string) => {
    setLoading(true);
    // Simulate a tiny 200ms flicker just to show the UI updates
    setTimeout(() => {
        const filtered = MOCK_CLINICS.filter(c => 
            c.name.toLowerCase().includes(keyword.toLowerCase()) || 
            (c.address || '').toLowerCase().includes(location.toLowerCase()) ||
            (c.city || '').toLowerCase().includes(location.toLowerCase())
        );
        setClinics(filtered);
        setLoading(false);
    }, 200);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-20">
       
       {/* Hero Search Section */}
       <div className="relative bg-[url('https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=2068&auto=format&fit=crop')] bg-cover bg-center">
          <div className="absolute inset-0 bg-slate-950/90 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950/80 to-slate-950"></div>
          
          <div className="relative z-10 py-32 px-6 text-center">
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider mb-6">
                <LucideShieldCheck className="w-4 h-4" /> Trusted by 15,000+ Patients
             </div>
             <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">
                Find Your <span className="text-blue-500">Perfect Dentist</span>
             </h1>
             <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-10">
                Real-time availability. Verified reviews. Instant booking.
             </p>
             
             {/* The Search Bar Component */}
             <div className="flex justify-center">
                <SearchBar onSearch={handleSearch} />
             </div>
          </div>
       </div>

       {/* Results Grid */}
       <div className="max-w-7xl mx-auto px-6 -mt-12 relative z-20">
          {loading ? (
             <div className="flex flex-col items-center justify-center py-20 bg-slate-900/50 rounded-3xl border border-slate-800">
                <LucideLoader2 className="w-10 h-10 animate-spin text-blue-500 mb-4" />
                <p className="text-slate-500 font-mono text-xs">SCANNING NETWORK...</p>
             </div>
          ) : (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {clinics.map(clinic => (
                   <ClinicCard 
                      key={clinic.id}
                      clinic={clinic}
                      onBook={() => onNavigate(`/clinic/${clinic.slug}`, { openBooking: true })}
                      onViewProfile={() => onNavigate(`/clinic/${clinic.slug}`)}
                   />
                ))}
             </div>
          )}

          {/* Empty State */}
          {!loading && clinics.length === 0 && (
             <div className="text-center py-20 bg-slate-900/50 rounded-2xl border border-slate-800">
                <p className="text-slate-500 font-bold text-lg mb-2">No clinics found matching your search.</p>
                <p className="text-slate-600 text-sm mb-6">Try searching for "Toronto" or "Yorkville".</p>
                <button 
                    onClick={() => handleSearch('', '')} 
                    className="text-blue-400 hover:text-blue-300 text-sm font-bold underline"
                >
                    Clear Filters
                </button>
             </div>
          )}
       </div>
    </div>
  );
}
