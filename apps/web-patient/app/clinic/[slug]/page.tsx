
'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '../../../../../packages/database/client';
import { BookingWidget } from '../../../../../packages/ui/src';
import { Profile } from '../../../../../packages/database/types';
import { LucideMapPin, LucideStar, LucideShieldCheck, LucideClock, LucidePhone, LucideGlobe, LucideArrowLeft, LucideLogOut, LucideUsers, LucideArrowRight } from 'lucide-react';
import Link from 'next/link';

// Mock Content Components
const ProvidersTab = () => (
    <div className="space-y-4 animate-in fade-in">
        <h3 className="text-lg font-bold text-white mb-3">Our Dedicated Team</h3>
        {[
            { id: 'p1', name: 'Dr. Sarah Smith', role: 'Lead Dentist', specialty: 'Cosmetic' },
            { id: 'p2', name: 'Dr. John Wilson', role: 'Orthodontist', specialty: 'Pediatric' },
        ].map(p => (
            <div key={p.id} className="bg-slate-950 border border-slate-800 p-4 rounded-xl flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center"><LucideUsers className="w-6 h-6 text-slate-500" /></div>
                <div>
                    <p className="font-bold text-white text-md">{p.name}</p>
                    <p className="text-xs text-slate-400 uppercase">{p.role} • {p.specialty}</p>
                </div>
            </div>
        ))}
    </div>
);

const InsuranceTab = () => (
    <div className="space-y-4 animate-in fade-in">
        <h3 className="text-lg font-bold text-white mb-3">Insurance & Billing</h3>
        <p className="text-slate-400 text-sm">We accept major insurance carriers.</p>
        <div className="grid grid-cols-2 gap-4">
             {["Sun Life", "Manulife", "Canada Life", "Blue Cross"].map(i => (
                 <div key={i} className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-sm font-bold text-slate-300">
                     {i}
                 </div>
             ))}
        </div>
    </div>
);

const DetailsTab = ({ clinic, user }: { clinic: any, user: any }) => (
    <div className="space-y-6 animate-in fade-in">
        <div>
            <h3 className="text-lg font-bold text-white mb-3">About Us</h3>
            <p className="text-slate-400 leading-relaxed">
                Experience state-of-the-art dental care in a comfortable environment. 
                We specialize in general, cosmetic, and emergency dentistry using the latest technology.
            </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center gap-3 group">
                <LucidePhone className="w-5 h-5 text-slate-500" />
                <div>
                    <p className="text-xs text-slate-500 uppercase font-bold">Phone</p>
                    <p className={`text-sm font-medium ${!user ? 'blur-sm opacity-50' : ''}`}>
                        {user ? clinic.contact_phone : '+1 (555) ***-****'}
                    </p>
                </div>
            </div>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center gap-3 group">
                <LucideGlobe className="w-5 h-5 text-slate-500" />
                <div>
                    <p className="text-xs text-slate-500 uppercase font-bold">Website</p>
                    <p className={`text-sm font-medium ${!user ? 'blur-sm opacity-50' : 'text-blue-400'}`}>
                        {user ? clinic.website_url : 'www.******.com'}
                    </p>
                </div>
            </div>
        </div>
        
        <div className="w-full h-48 bg-slate-800 rounded-xl flex items-center justify-center border border-slate-700">
             <LucideMapPin className="w-8 h-8 text-slate-600" />
             <p className="text-sm text-slate-600 ml-2">Location Map Placeholder</p>
        </div>
    </div>
);


interface ClinicProfileProps {
  slug: string;
  user: Profile | null;
  initialBookingState?: boolean;
  onNavigate: (path: string) => void;
}

export const ClinicProfile: React.FC<ClinicProfileProps> = ({ slug, user, initialBookingState, onNavigate }) => {
  const [clinic, setClinic] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('details');
  const db = createClient();

  useEffect(() => {
    // Mock Fetch
    setClinic({
        id: '00000000-0000-0000-0000-000000000001', 
        name: 'Yorkville Smile Centre',
        slug: slug,
        address: '123 Yorkville Ave',
        city: 'Toronto',
        contact_phone: '416-555-0199',
        website_url: 'dental.com',
        claim_status: 'verified',
        is_front_runner: true
    });
    
    // NO AUTO-REDIRECT HERE
    // We let the user interact with the widget manually.
    
  }, [slug]);

  if (!clinic) return null;

  const currentPathWithQuery = `/clinic/${clinic.slug}`;

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-20">
      
      {/* Header Image */}
      <div className="h-64 md:h-80 w-full relative overflow-hidden">
         <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent z-10"></div>
         <img src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=2068&auto=format&fit=crop" alt={clinic.name} className="w-full h-full object-cover" />
         
         <div className="absolute top-6 left-6 z-20 flex gap-4">
            <button onClick={() => onNavigate('/')} className="flex items-center gap-2 text-white/80 hover:text-white transition-colors bg-black/30 backdrop-blur-md px-4 py-2 rounded-full text-sm font-bold">
                <LucideArrowLeft className="w-4 h-4" /> Back to Directory
            </button>
         </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-6 -mt-20 relative z-20">
         <div className="flex flex-col lg:flex-row gap-8 items-start">
            
            {/* Main Content */}
            <div className="flex-1 w-full">
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl">
                    
                    <div className="mb-8">
                        <div className="flex justify-between items-start mb-4">
                            <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2">{clinic.name}</h1>
                            <div className="bg-slate-800 px-3 py-1.5 rounded-lg flex items-center gap-2 border border-slate-700 self-start">
                                <LucideStar className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                <span className="font-bold text-lg">4.9</span>
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="flex border-b border-slate-800 overflow-x-auto whitespace-nowrap pt-2">
                            {[{ key: 'details', name: 'Overview' }, { key: 'providers', name: 'Team' }, { key: 'insurance', name: 'Insurance' }].map(tab => (
                                <button 
                                    key={tab.key}
                                    onClick={() => setActiveTab(tab.key)}
                                    className={`py-2 px-4 text-sm font-bold transition-all border-b-2 ${activeTab === tab.key ? 'text-blue-500 border-blue-500' : 'text-slate-500 border-transparent hover:text-white'}`}
                                >
                                    {tab.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Tab Render */}
                    {activeTab === 'details' && <DetailsTab clinic={clinic} user={user} />}
                    {activeTab === 'providers' && <ProvidersTab />}
                    {activeTab === 'insurance' && <InsuranceTab />}

                </div>
            </div>

            {/* Booking Sidebar */}
            <div className="w-full lg:w-[400px] shrink-0 space-y-4">
                <BookingWidget 
                    clinic={clinic} 
                    user={user} 
                    currentPath={currentPathWithQuery} 
                    initialOpen={initialBookingState}
                />
            </div>

         </div>
      </div>
    </div>
  );
}
