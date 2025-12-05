
import React from 'react';
import { Clinic } from '../../../database/types';
import { Button } from './Button';
import { LucideMapPin, LucidePhone, LucideCheckCircle, LucideStar } from 'lucide-react';

interface ClinicCardProps {
  clinic: Clinic;
  onViewProfile?: () => void;
  onBook?: () => void;
}

export const ClinicCard: React.FC<ClinicCardProps> = ({ clinic, onViewProfile, onBook }) => {
  // Mock Imagery logic since DB doesn't have it yet
  const bgImage = `https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=800&seed=${clinic.id}`;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-xl hover:translate-y-[-2px] transition-all duration-300 group flex flex-col h-full">
      <div className="h-40 bg-slate-100 relative overflow-hidden">
        <img src={bgImage} alt={clinic.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
        
        {clinic.is_front_runner && (
           <div className="absolute top-3 right-3 bg-yellow-400 text-yellow-950 text-[10px] font-extrabold px-2 py-1 rounded shadow-lg uppercase tracking-wider flex items-center gap-1">
             <LucideStar size={10} className="fill-current" /> Top Rated
           </div>
        )}

        <div className="absolute bottom-3 left-3 text-white">
           <div className="flex items-center gap-1 text-xs font-bold bg-slate-900/50 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10">
              <LucideStar size={12} className="text-yellow-400 fill-yellow-400" />
              <span>4.9</span>
              <span className="text-slate-300 font-normal">(120 reviews)</span>
           </div>
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg text-slate-900 leading-tight group-hover:text-blue-600 transition-colors">{clinic.name}</h3>
        </div>
        
        <div className="mb-4 space-y-2">
            <div className="flex items-start gap-2 text-sm text-slate-500">
                <LucideMapPin size={16} className="mt-0.5 shrink-0 text-slate-400" />
                <span className="line-clamp-1">{clinic.address}, {clinic.city}</span>
            </div>
            <div className="flex flex-wrap gap-1">
                {['General', 'Cosmetic', 'Implants'].map(tag => (
                   <span key={tag} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">
                      {tag}
                   </span>
                ))}
            </div>
        </div>
        
        <div className="mt-auto flex gap-3 pt-4 border-t border-slate-100">
            <Button size="sm" variant="outline" onClick={onViewProfile} className="flex-1">Profile</Button>
            <Button size="sm" onClick={onBook} className="flex-1 bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20">Book Now</Button>
        </div>
      </div>
    </div>
  );
};
