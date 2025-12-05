
import React from 'react';
import { LucideLayout, LucideBriefcase, LucideShoppingBag, LucideSearch } from 'lucide-react';

export const EcosystemGrid: React.FC = () => {
  const pillars = [
    {
      icon: LucideLayout,
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10',
      title: 'Clinic OS',
      desc: 'Practice management, scheduling, and patient records for modern clinics.'
    },
    {
      icon: LucideSearch,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
      title: 'Patient Directory',
      desc: 'SEO-optimized listing engine connecting patients with verified care.'
    },
    {
      icon: LucideBriefcase,
      color: 'text-violet-500',
      bg: 'bg-violet-500/10',
      title: 'Talent Hub',
      desc: 'Digital passports and job matching for dental professionals.'
    },
    {
      icon: LucideShoppingBag,
      color: 'text-orange-500',
      bg: 'bg-orange-500/10',
      title: 'Vendor Market',
      desc: 'Direct-to-clinic supply chain with automated fulfillment.'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 py-12">
      {pillars.map((item, idx) => (
        <div key={idx} className="bg-slate-900 border border-slate-800 p-6 rounded-xl hover:border-slate-700 transition-colors">
          <div className={`w-12 h-12 rounded-lg ${item.bg} ${item.color} flex items-center justify-center mb-4`}>
            <item.icon size={24} />
          </div>
          <h3 className="text-white font-bold text-lg mb-2">{item.title}</h3>
          <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
        </div>
      ))}
    </div>
  );
};
