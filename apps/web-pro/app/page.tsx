
import React, { useEffect, useState } from 'react';
import { createClient } from '../../../../packages/database/client';
import { Profile, ProProfile } from '../../../../packages/database/types';
import { LucideShieldCheck, LucideShieldAlert, LucideEye } from 'lucide-react';

interface ProDashboardProps {
  user: Profile;
  onNavigate: (path: string) => void;
}

export const ProDashboard: React.FC<ProDashboardProps> = ({ user, onNavigate }) => {
  const [profile, setProfile] = useState<ProProfile | undefined>(undefined);
  const db = createClient();

  useEffect(() => {
    db.getProProfile(user.id).then(setProfile);
  }, [user.id]);

  const isVerified = profile?.is_license_verified;

  return (
    <div className="p-6 md:p-12 max-w-5xl mx-auto">
       <h1 className="text-3xl font-bold text-slate-900 mb-8">
         Welcome back, {user.full_name.split(' ')[0]}
       </h1>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* VERIFICATION CARD */}
          <div className={`p-6 rounded-2xl border ${isVerified ? 'bg-emerald-50 border-emerald-100' : 'bg-amber-50 border-amber-100'}`}>
             <div className="flex items-center gap-4 mb-4">
                <div className={`p-3 rounded-full ${isVerified ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                   {isVerified ? <LucideShieldCheck size={24} /> : <LucideShieldAlert size={24} />}
                </div>
                <div>
                   <h3 className={`font-bold text-lg ${isVerified ? 'text-emerald-900' : 'text-amber-900'}`}>
                      {isVerified ? 'Verified Professional' : 'Verification Pending'}
                   </h3>
                   <p className={`text-sm ${isVerified ? 'text-emerald-700' : 'text-amber-700'}`}>
                      {isVerified ? 'You are fully clear to book shifts.' : 'Add your License Number in Passport.'}
                   </p>
                </div>
             </div>
             {!isVerified && (
                <button 
                  onClick={() => onNavigate('/passport')}
                  className="w-full py-2 bg-white border border-amber-200 text-amber-700 font-bold rounded-lg text-sm hover:bg-amber-50"
                >
                   Complete Passport
                </button>
             )}
          </div>

          {/* VISIBILITY CARD */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
             <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                   <div className="p-3 bg-blue-50 text-blue-600 rounded-full">
                      <LucideEye size={24} />
                   </div>
                   <div>
                      <h3 className="font-bold text-lg text-slate-900">Profile Visibility</h3>
                      <p className="text-sm text-slate-500">Visible to 2 clinics today</p>
                   </div>
                </div>
                <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-slate-200">
                   <span className="translate-x-6 inline-block h-4 w-4 transform rounded-full bg-white transition" />
                </div>
             </div>
             <p className="text-xs text-slate-400">
                Toggle availability to show clinics you are open to offers.
             </p>
          </div>
       </div>
    </div>
  );
};
