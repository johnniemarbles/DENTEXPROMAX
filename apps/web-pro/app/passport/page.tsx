
'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '../../../../packages/database/client';
import { Profile, ProProfile } from '../../../../packages/database/types';
import { Button, Input } from '../../../../packages/ui/src';
import { LucideSave, LucideCheck, LucideAward, LucideLoader2 } from 'lucide-react';

interface PassportPageProps {
  user: Profile;
}

export const PassportPage: React.FC<PassportPageProps> = ({ user }) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<ProProfile>>({
    title: '',
    license_number: '',
    hourly_rate: 0,
    bio: ''
  });
  const [successMsg, setSuccessMsg] = useState('');
  const db = createClient();

  useEffect(() => {
    db.getProProfile(user.id).then(profile => {
       if (profile) {
         setFormData(profile);
       }
       setLoading(false);
    });
  }, [user.id]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    
    try {
      // Simulate network delay for better UX
      await new Promise(r => setTimeout(r, 600));

      await db.updateProProfile(user.id, formData);
      setSuccessMsg('Passport updated! Redirecting...');
      
      // Auto-redirect pattern (ProfileLinkSubmit logic)
      setTimeout(() => {
          window.location.hash = 'pro'; 
      }, 1000);
      
    } catch (err) {
      console.error(err);
      alert("Failed to save passport.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-12 flex items-center justify-center text-slate-500"><LucideLoader2 className="animate-spin mr-2"/> Loading Passport...</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 md:p-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Digital Passport</h1>
          <p className="text-slate-500">Manage your professional credentials and visibility.</p>
        </div>
        <div className="h-12 w-12 bg-violet-100 text-violet-600 rounded-full flex items-center justify-center">
           <LucideAward size={24} />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-4">
        <form onSubmit={handleSave} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <Input 
               label="Professional Title" 
               placeholder="e.g. Registered Dental Hygienist"
               value={formData.title}
               onChange={e => setFormData({...formData, title: e.target.value})}
               required
               className="bg-white border-slate-300 text-slate-900"
             />
             <Input 
               label="License Number" 
               placeholder="Required for verification"
               value={formData.license_number}
               onChange={e => setFormData({...formData, license_number: e.target.value})}
               required
               className="bg-white border-slate-300 text-slate-900"
             />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <Input 
               label="Hourly Rate ($/hr)" 
               type="number"
               placeholder="0.00"
               value={formData.hourly_rate}
               onChange={e => setFormData({...formData, hourly_rate: parseFloat(e.target.value)})}
               className="bg-white border-slate-300 text-slate-900"
             />
             <div className="pt-7">
               <div className="text-sm text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-100">
                  Rates are displayed to clinics during search. DENTEX takes a 0% commission from Pros.
               </div>
             </div>
          </div>

          <div>
             <label className="block text-sm font-medium text-slate-700 mb-1.5">Professional Bio</label>
             <textarea 
               className="w-full rounded-lg border border-slate-300 p-3 text-sm text-slate-900 focus:ring-2 focus:ring-violet-500 outline-none h-32 resize-none bg-white"
               placeholder="Tell clinics about your experience, specialties, and work ethic..."
               value={formData.bio}
               onChange={e => setFormData({...formData, bio: e.target.value})}
             />
          </div>

          <div className="pt-4 flex items-center justify-between border-t border-slate-100 mt-6">
             {successMsg ? (
                <span className="text-emerald-600 flex items-center gap-2 text-sm font-bold animate-pulse">
                   <LucideCheck size={16} /> {successMsg}
                </span>
             ) : <span></span>}
             
             <Button type="submit" className="bg-violet-600 hover:bg-violet-700" isLoading={saving}>
               <LucideSave size={16} className="mr-2" /> Save & Return
             </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
