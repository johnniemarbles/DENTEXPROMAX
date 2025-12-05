
import React from 'react';
import { EcosystemGrid } from '../components/EcosystemGrid';
import { LucideArrowRight, LucideSearch, LucideLayout, LucideBriefcase } from 'lucide-react';

export const PublicHome: React.FC = () => {
  return (
    <div className="bg-slate-950">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-24 pb-32 px-6">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto text-center relative z-10">
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-bold text-slate-400 mb-8 uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              System Operational v1.10.0
           </div>
           
           <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight mb-6 leading-tight">
             The Operating System for <br/>
             <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-emerald-400 to-violet-400">
               Modern Dentistry
             </span>
           </h1>
           
           <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-16 leading-relaxed">
             DENTEX connects patients, clinics, and professionals in a single, unified ecosystem. 
             Experience the future of dental care management.
           </p>

           {/* ROLE ROUTING CARDS */}
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto text-left">
              
              {/* PATIENT CARD */}
              <button 
                onClick={() => window.location.hash = 'patient'}
                className="group bg-slate-900/50 hover:bg-blue-900/20 border border-slate-800 hover:border-blue-500/50 p-6 rounded-2xl transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                   <LucideSearch size={24} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400">For Patients</h3>
                <p className="text-slate-400 text-sm mb-6">Find top-rated dentists, book appointments, and manage your care journey.</p>
                <div className="flex items-center text-blue-500 font-bold text-sm">
                   Find a Dentist <LucideArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>

              {/* CLINIC CARD */}
              <button 
                onClick={() => window.location.hash = 'clinic'}
                className="group bg-slate-900/50 hover:bg-emerald-900/20 border border-slate-800 hover:border-emerald-500/50 p-6 rounded-2xl transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                   <LucideLayout size={24} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-400">For Clinics</h3>
                <p className="text-slate-400 text-sm mb-6">A complete Operating System. Schedule, Billing, Staffing, and Inventory.</p>
                <div className="flex items-center text-emerald-500 font-bold text-sm">
                   Manage Practice <LucideArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>

              {/* PRO CARD */}
              <button 
                onClick={() => window.location.hash = 'pro'}
                className="group bg-slate-900/50 hover:bg-violet-900/20 border border-slate-800 hover:border-violet-500/50 p-6 rounded-2xl transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-violet-500/10 text-violet-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                   <LucideBriefcase size={24} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-violet-400">For Professionals</h3>
                <p className="text-slate-400 text-sm mb-6">Digital Passports, verified credentials, and high-paying locum shifts.</p>
                <div className="flex items-center text-violet-500 font-bold text-sm">
                   Find Jobs <LucideArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>

           </div>
        </div>
      </section>

      {/* ECOSYSTEM PILLARS */}
      <section className="py-24 border-t border-slate-900 bg-slate-950">
         <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
               <h2 className="text-3xl font-bold text-white">Full-Stack Infrastructure</h2>
               <p className="text-slate-500 mt-2">Everything you need to run a modern dental economy.</p>
            </div>
            <EcosystemGrid />
         </div>
      </section>
    </div>
  );
};
